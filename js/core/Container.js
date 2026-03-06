/**
 * Container.js - 依赖注入容器
 * 功能：管理模块依赖、实现模块解耦、支持懒加载
 * 版本：v4.0
 * 作者：QHT System
 */

const Container = (function() {
    'use strict';
    
    // 服务注册表
    const services = new Map();
    
    // 已解析的实例缓存
    const instances = new Map();
    
    // 依赖关系图
    const dependencies = new Map();
    
    /**
     * 注册服务
     * @param {string} name - 服务名称
     * @param {Function} factory - 工厂函数
     * @param {Array<string>} deps - 依赖列表
     */
    function register(name, factory, deps = []) {
        if (services.has(name)) {
            console.warn(`Service "${name}" is already registered. Overwriting.`);
        }
        
        services.set(name, {
            factory,
            dependencies: deps,
            singleton: true // 默认单例
        });
        
        dependencies.set(name, deps);
        
        console.log(`[Container] Registered: ${name}`, deps.length ? `(deps: ${deps.join(', ')})` : '');
    }
    
    /**
     * 获取服务实例
     * @param {string} name - 服务名称
     * @returns {any} 服务实例
     */
    function get(name) {
        // 检查是否已有实例
        if (instances.has(name)) {
            return instances.get(name);
        }
        
        const service = services.get(name);
        if (!service) {
            throw new Error(`Service "${name}" not found in container`);
        }
        
        // 解析依赖
        const resolvedDeps = service.dependencies.map(depName => {
            return get(depName);
        });
        
        // 创建实例
        console.log(`[Container] Resolving: ${name}`);
        const instance = service.factory(...resolvedDeps);
        
        // 缓存单例
        if (service.singleton) {
            instances.set(name, instance);
        }
        
        return instance;
    }
    
    /**
     * 注册单例服务
     * @param {string} name - 服务名称
     * @param {any} instance - 实例对象
     */
    function singleton(name, instance) {
        instances.set(name, instance);
        services.set(name, {
            factory: () => instance,
            dependencies: [],
            singleton: true
        });
        console.log(`[Container] Singleton registered: ${name}`);
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
     */
    function remove(name) {
        services.delete(name);
        instances.delete(name);
        dependencies.delete(name);
        console.log(`[Container] Removed: ${name}`);
    }
    
    /**
     * 清空所有服务
     */
    function clear() {
        const count = services.size;
        services.clear();
        instances.clear();
        dependencies.clear();
        console.log(`[Container] Cleared ${count} services`);
    }
    
    /**
     * 获取所有注册的服务
     * @returns {Array<string>}
     */
    function list() {
        return Array.from(services.keys());
    }
    
    /**
     * 获取依赖关系图
     * @returns {Map<string, Array<string>>}
     */
    function getDependencyGraph() {
        return new Map(dependencies);
    }
    
    /**
     * 检查循环依赖
     * @param {string} start - 起始服务
     * @returns {boolean}
     */
    function hasCircularDependency(start) {
        const visited = new Set();
        const recursionStack = new Set();
        
        function dfs(service) {
            if (recursionStack.has(service)) {
                return true; // 发现循环依赖
            }
            
            if (visited.has(service)) {
                return false;
            }
            
            visited.add(service);
            recursionStack.add(service);
            
            const deps = dependencies.get(service) || [];
            for (const dep of deps) {
                if (dfs(dep)) {
                    return true;
                }
            }
            
            recursionStack.delete(service);
            return false;
        }
        
        return dfs(start);
    }
    
    /**
     * 验证所有依赖
     * @returns {Object} 验证结果
     */
    function validate() {
        const errors = [];
        const warnings = [];
        
        // 检查循环依赖
        for (const [name] of services) {
            if (hasCircularDependency(name)) {
                errors.push(`Circular dependency detected involving "${name}"`);
            }
        }
        
        // 检查缺失的依赖
        for (const [name, { dependencies: deps }] of services) {
            for (const dep of deps) {
                if (!services.has(dep) && !instances.has(dep)) {
                    warnings.push(`Service "${name}" depends on "${dep}" which is not registered`);
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            serviceCount: services.size
        };
    }
    
    /**
     * 导出容器状态
     * @returns {Object}
     */
    function exportState() {
        return {
            services: list(),
            instances: Array.from(instances.keys()),
            dependencies: Object.fromEntries(dependencies),
            validation: validate()
        };
    }
    
    /**
     * 打印容器状态
     */
    function debug() {
        const state = exportState();
        console.group('[Container] Debug Info');
        console.log('Registered Services:', state.services);
        console.log('Instantiated Services:', state.instances);
        console.log('Dependencies:', state.dependencies);
        
        if (state.validation.errors.length) {
            console.error('Errors:', state.validation.errors);
        }
        if (state.validation.warnings.length) {
            console.warn('Warnings:', state.validation.warnings);
        }
        
        console.groupEnd();
    }
    
    // 公开 API
    return {
        register,
        get,
        singleton,
        has,
        remove,
        clear,
        list,
        getDependencyGraph,
        hasCircularDependency,
        validate,
        exportState,
        debug
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.Container = Container;
}

// 也支持 CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Container;
}
