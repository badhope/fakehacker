/**
 * Container.js - 依赖注入容器
 * 功能：管理模块依赖、实现模块解耦、支持懒加载和循环依赖检测
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module core/Container
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} ServiceDescriptor
     * @property {Function} factory - 工厂函数
     * @property {string[]} dependencies - 依赖列表
     * @property {boolean} singleton - 是否单例
     * @property {string} [scope='transient'] - 作用域
     */

    /**
     * @typedef {Object} ContainerOptions
     * @property {boolean} [enableLogging=false] - 启用日志
     * @property {boolean} [strictMode=false] - 严格模式（缺失依赖时报错）
     * @property {boolean} [autoResolve=true] - 自动解析依赖
     */

    // 配置
    const config = {
        enableLogging: false,
        strictMode: false,
        autoResolve: true
    };

    // 服务注册表
    const services = new Map();

    // 已解析的实例缓存
    const instances = new Map();

    // 依赖关系图
    const dependencyGraph = new Map();

    // 服务元数据
    const metadata = new Map();

    /**
     * 日志函数
     * @private
     * @param {string} type - 日志类型
     * @param {string} name - 服务名
     * @param {*} data - 数据
     */
    function log(type, name, data) {
        if (!config.enableLogging) return;
        console.log(`[Container.${type}] ${name}:`, data);
    }

    /**
     * 检测循环依赖
     * @private
     * @param {string} serviceName - 服务名
     * @param {Set<string>} visited - 已访问集合
     * @param {Set<string>} recursionStack - 递归栈
     * @returns {string[]|null} 循环依赖路径或 null
     */
    function detectCycle(serviceName, visited = new Set(), recursionStack = new Set()) {
        if (recursionStack.has(serviceName)) {
            return [serviceName];
        }

        if (visited.has(serviceName)) {
            return null;
        }

        visited.add(serviceName);
        recursionStack.add(serviceName);

        const deps = dependencyGraph.get(serviceName) || [];
        for (const dep of deps) {
            const cycle = detectCycle(dep, visited, recursionStack);
            if (cycle) {
                cycle.push(serviceName);
                return cycle;
            }
        }

        recursionStack.delete(serviceName);
        return null;
    }

    /**
     * 拓扑排序
     * @private
     * @returns {string[]} 排序后的服务列表
     */
    function topologicalSort() {
        const visited = new Set();
        const result = [];

        function visit(serviceName) {
            if (visited.has(serviceName)) return;
            
            visited.add(serviceName);
            
            const deps = dependencyGraph.get(serviceName) || [];
            deps.forEach(visit);
            
            result.push(serviceName);
        }

        services.forEach((_, name) => visit(name));
        return result;
    }

    /**
     * 注册服务
     * @param {string} name - 服务名称
     * @param {Function} factory - 工厂函数
     * @param {string[]} [dependencies=[]] - 依赖列表
     * @param {Object} [options] - 选项
     * @param {boolean} [options.singleton=true] - 是否单例
     * @param {string} [options.scope='transient'] - 作用域
     * @returns {Container} 链式调用
     */
    function register(name, factory, dependencies = [], options = {}) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new TypeError('Service name must be a non-empty string');
        }

        if (typeof factory !== 'function') {
            throw new TypeError('Factory must be a function');
        }

        if (!Array.isArray(dependencies)) {
            throw new TypeError('Dependencies must be an array');
        }

        const { singleton = true, scope = 'transient' } = options;

        // 检查循环依赖
        const descriptor = {
            factory,
            dependencies,
            singleton,
            scope
        };

        services.set(name, descriptor);
        dependencyGraph.set(name, dependencies);

        // 存储元数据
        metadata.set(name, {
            registeredAt: Date.now(),
            createdAt: null,
            resolvedCount: 0
        });

        log('REGISTER', name, { dependencies, singleton, scope });

        // 检查循环依赖
        const cycle = detectCycle(name);
        if (cycle) {
            const cyclePath = cycle.reverse().join(' -> ');
            const error = new Error(`Circular dependency detected: ${cyclePath}`);
            
            if (config.strictMode) {
                services.delete(name);
                dependencyGraph.delete(name);
                throw error;
            } else {
                console.warn('[Container]', error.message);
            }
        }

        return Container;
    }

    /**
     * 注册单例服务
     * @param {string} name - 服务名称
     * @param {Function} factory - 工厂函数
     * @param {string[]} [dependencies=[]] - 依赖列表
     * @returns {Container} 链式调用
     */
    function singleton(name, factory, dependencies = []) {
        return register(name, factory, dependencies, { singleton: true });
    }

    /**
     * 注册瞬态服务（每次获取都创建新实例）
     * @param {string} name - 服务名称
     * @param {Function} factory - 工厂函数
     * @param {string[]} [dependencies=[]] - 依赖列表
     * @returns {Container} 链式调用
     */
    function transient(name, factory, dependencies = []) {
        return register(name, factory, dependencies, { singleton: false });
    }

    /**
     * 注册值服务
     * @param {string} name - 服务名称
     * @param {*} value - 值
     * @returns {Container} 链式调用
     */
    function value(name, value) {
        return register(name, () => value, [], { singleton: true });
    }

    /**
     * 注册已存在的实例
     * @param {string} name - 服务名称
     * @param {*} instance - 实例
     * @returns {Container} 链式调用
     */
    function instance(name, instance) {
        instances.set(name, instance);
        services.set(name, {
            factory: () => instance,
            dependencies: [],
            singleton: true,
            scope: 'singleton'
        });
        dependencyGraph.set(name, []);
        
        metadata.set(name, {
            registeredAt: Date.now(),
            createdAt: Date.now(),
            resolvedCount: 1
        });

        log('INSTANCE', name, { type: typeof instance });
        return Container;
    }

    /**
     * 解析依赖并获取服务实例
     * @param {string} name - 服务名称
     * @returns {*} 服务实例
     */
    function get(name) {
        // 检查是否有实例缓存
        if (instances.has(name)) {
            const meta = metadata.get(name);
            if (meta) meta.resolvedCount++;
            log('GET_CACHED', name);
            return instances.get(name);
        }

        const descriptor = services.get(name);
        if (!descriptor) {
            const error = new Error(`Service "${name}" not found in container`);
            
            if (config.strictMode) {
                throw error;
            } else {
                console.warn('[Container]', error.message);
                return undefined;
            }
        }

        // 检查循环依赖
        const cycle = detectCycle(name);
        if (cycle) {
            throw new Error(`Cannot resolve "${name}": Circular dependency detected`);
        }

        // 解析依赖
        const resolvedDeps = descriptor.dependencies.map(depName => {
            if (config.autoResolve) {
                return get(depName);
            } else {
                return instances.get(depName);
            }
        });

        log('RESOLVE', name, { 
            dependencies: descriptor.dependencies,
            resolvedDeps: resolvedDeps.length 
        });

        // 创建实例
        let instance;
        try {
            instance = descriptor.factory(...resolvedDeps);
        } catch (error) {
            throw new Error(`Failed to create instance "${name}": ${error.message}`);
        }

        // 缓存单例
        if (descriptor.singleton) {
            instances.set(name, instance);
            
            const meta = metadata.get(name);
            if (meta) {
                meta.createdAt = Date.now();
                meta.resolvedCount = 1;
            }
        } else {
            const meta = metadata.get(name);
            if (meta) meta.resolvedCount++;
        }

        return instance;
    }

    /**
     * 检查服务是否已注册
     * @param {string} name - 服务名称
     * @returns {boolean}
     */
    function has(name) {
        return services.has(name) || instances.has(name);
    }

    /**
     * 移除服务
     * @param {string} name - 服务名称
     * @returns {boolean} 是否成功移除
     */
    function remove(name) {
        const existed = services.has(name);
        
        services.delete(name);
        instances.delete(name);
        dependencyGraph.delete(name);
        metadata.delete(name);

        if (existed) {
            log('REMOVE', name);
        }

        return existed;
    }

    /**
     * 清空所有服务
     */
    function clear() {
        const count = services.size;
        services.clear();
        instances.clear();
        dependencyGraph.clear();
        metadata.clear();
        
        log('CLEAR', 'all', { count });
    }

    /**
     * 获取所有注册的服务名称
     * @returns {string[]}
     */
    function list() {
        return Array.from(services.keys());
    }

    /**
     * 获取依赖关系图
     * @returns {Map<string, string[]>}
     */
    function getDependencyGraph() {
        return new Map(dependencyGraph);
    }

    /**
     * 获取服务元数据
     * @param {string} name - 服务名称
     * @returns {Object|null}
     */
    function getMetadata(name) {
        return metadata.get(name) || null;
    }

    /**
     * 验证所有服务
     * @returns {Object} 验证结果
     */
    function validate() {
        const errors = [];
        const warnings = [];

        // 检查循环依赖
        for (const [name] of services) {
            const cycle = detectCycle(name);
            if (cycle) {
                errors.push(`Circular dependency: ${cycle.reverse().join(' -> ')}`);
            }
        }

        // 检查缺失的依赖
        for (const [name, { dependencies }] of services) {
            for (const dep of dependencies) {
                if (!services.has(dep) && !instances.has(dep)) {
                    warnings.push(`Service "${name}" depends on missing "${dep}"`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            serviceCount: services.size,
            instanceCount: instances.size
        };
    }

    /**
     * 获取初始化顺序（拓扑排序）
     * @returns {string[]}
     */
    function getInitializationOrder() {
        return topologicalSort();
    }

    /**
     * 初始化所有服务（按依赖顺序）
     * @returns {Object} 初始化结果
     */
    function initializeAll() {
        const order = getInitializationOrder();
        const results = {
            success: [],
            failed: [],
            errors: []
        };

        for (const name of order) {
            try {
                get(name);
                results.success.push(name);
            } catch (error) {
                results.failed.push(name);
                results.errors.push({
                    service: name,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 更新配置
     * @param {ContainerOptions} newConfig - 新配置
     */
    function configure(newConfig) {
        Object.assign(config, newConfig);
        log('CONFIGURE', 'config', config);
    }

    /**
     * 获取配置
     * @returns {Object}
     */
    function getConfig() {
        return { ...config };
    }

    /**
     * 导出容器状态
     * @returns {Object}
     */
    function exportState() {
        return {
            services: list(),
            instances: Array.from(instances.keys()),
            dependencies: Object.fromEntries(dependencyGraph),
            metadata: Object.fromEntries(metadata),
            validation: validate(),
            config: getConfig()
        };
    }

    /**
     * 打印调试信息
     */
    function debug() {
        const state = exportState();
        console.group('[Container] Debug Info');
        console.log('Configuration:', state.config);
        console.log('Registered Services:', state.services);
        console.log('Instantiated Services:', state.instances);
        console.log('Dependencies:', state.dependencies);
        console.log('Metadata:', state.metadata);
        
        if (state.validation.errors.length) {
            console.error('Errors:', state.validation.errors);
        }
        if (state.validation.warnings.length) {
            console.warn('Warnings:', state.validation.warnings);
        }
        
        console.groupEnd();
    }

    // 公开 API
    const Container = {
        // 注册服务
        register,
        singleton,
        transient,
        value,
        instance,
        
        // 获取服务
        get,
        has,
        
        // 管理
        remove,
        clear,
        list,
        
        // 依赖分析
        getDependencyGraph,
        getMetadata,
        validate,
        getInitializationOrder,
        initializeAll,
        
        // 配置
        configure,
        getConfig,
        exportState,
        debug
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.Container = Container;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Container;
    }

})(typeof window !== 'undefined' ? window : this);
