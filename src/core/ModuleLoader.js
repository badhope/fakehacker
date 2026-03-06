/**
 * ModuleLoader.js - 模块加载器
 * 功能：动态模块加载、依赖管理、懒加载、模块生命周期管理
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module core/ModuleLoader
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} ModuleDescriptor
     * @property {string} name - 模块名称
     * @property {string} path - 模块路径
     * @property {string[]} dependencies - 依赖模块列表
     * @property {Function} [factory] - 工厂函数
     * @property {boolean} [lazy=false] - 是否懒加载
     * @property {boolean} [loaded=false] - 是否已加载
     * @property {boolean} [initialized=false] - 是否已初始化
     */

    /**
     * @typedef {Object} ModuleLoaderOptions
     * @property {string} [basePath=''] - 基础路径
     * @property {string} [extension='.js'] - 文件扩展名
     * @property {boolean} [enableLogging=false] - 启用日志
     * @property {number} [timeout=30000] - 加载超时时间（毫秒）
     */

    // 配置
    const config = {
        basePath: '',
        extension: '.js',
        enableLogging: false,
        timeout: 30000
    };

    // 模块注册表
    const modules = new Map();

    // 模块实例缓存
    const instances = new Map();

    // 加载中的 Promise
    const loadingPromises = new Map();

    // 模块加载顺序
    const loadOrder = [];

    /**
     * 日志函数
     * @private
     * @param {string} type - 日志类型
     * @param {string} moduleName - 模块名
     * @param {*} data - 数据
     */
    function log(type, moduleName, data) {
        if (!config.enableLogging) return;
        console.log(`[ModuleLoader.${type}] ${moduleName}:`, data);
    }

    /**
     * 标准化模块路径
     * @private
     * @param {string} path - 原始路径
     * @returns {string} 标准化路径
     */
    function normalizePath(path) {
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
            return path;
        }
        return `${config.basePath}${config.basePath && !config.basePath.endsWith('/') ? '/' : ''}${path}`;
    }

    /**
     * 动态加载脚本
     * @private
     * @param {string} src - 脚本路径
     * @returns {Promise<void>}
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // 检查是否已存在
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                log('SKIP', src, 'already loaded');
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.defer = false;

            const timeoutId = setTimeout(() => {
                script.onerror = null;
                script.onload = null;
                reject(new Error(`Timeout loading script: ${src}`));
            }, config.timeout);

            script.onload = () => {
                clearTimeout(timeoutId);
                log('LOAD', src, 'success');
                resolve();
            };

            script.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * 注册模块
     * @param {string} name - 模块名称
     * @param {Object} descriptor - 模块描述符
     * @returns {ModuleLoader} 链式调用
     */
    function register(name, descriptor) {
        if (modules.has(name)) {
            console.warn(`[ModuleLoader] Module "${name}" is already registered`);
        }

        const moduleDesc = {
            name,
            path: descriptor.path ? normalizePath(descriptor.path) : null,
            dependencies: descriptor.dependencies || [],
            factory: descriptor.factory || null,
            lazy: descriptor.lazy || false,
            loaded: false,
            initialized: false
        };

        modules.set(name, moduleDesc);
        log('REGISTER', name, moduleDesc);

        return ModuleLoader;
    }

    /**
     * 注册已存在的模块（全局变量）
     * @param {string} name - 模块名称
     * @param {string} globalName - 全局变量名
     * @param {string[]} [dependencies=[]] - 依赖列表
     * @returns {ModuleLoader} 链式调用
     */
    function registerGlobal(name, globalName, dependencies = []) {
        return register(name, {
            factory: () => {
                const module = global[globalName];
                if (!module) {
                    throw new Error(`Global module "${globalName}" not found`);
                }
                return module;
            },
            dependencies
        });
    }

    /**
     * 加载单个模块
     * @private
     * @param {string} name - 模块名称
     * @returns {Promise<*>}
     */
    async function loadModule(name) {
        // 检查是否已加载
        if (instances.has(name)) {
            log('GET_CACHED', name);
            return instances.get(name);
        }

        // 检查是否正在加载
        if (loadingPromises.has(name)) {
            log('WAITING', name);
            return loadingPromises.get(name);
        }

        const module = modules.get(name);
        if (!module) {
            throw new Error(`Module "${name}" not found`);
        }

        // 先加载依赖
        log('LOAD_DEPENDENCIES', name, module.dependencies);
        for (const dep of module.dependencies) {
            await loadModule(dep);
        }

        // 加载模块
        let loadPromise;

        if (module.path && !module.loaded) {
            log('LOAD_SCRIPT', name, module.path);
            loadPromise = loadScript(module.path)
                .then(() => {
                    module.loaded = true;
                    log('LOADED', name);
                });
            
            loadingPromises.set(name, loadPromise);
            await loadPromise;
            loadingPromises.delete(name);
        } else {
            module.loaded = true;
        }

        // 创建实例
        if (module.factory) {
            log('CREATE_INSTANCE', name);
            
            // 解析依赖实例
            const depInstances = module.dependencies.map(dep => instances.get(dep));
            
            const instance = module.factory(...depInstances);
            instances.set(name, instance);
            module.initialized = true;
            
            if (!loadOrder.includes(name)) {
                loadOrder.push(name);
            }
            
            return instance;
        }

        return null;
    }

    /**
     * 获取模块实例
     * @param {string} name - 模块名称
     * @returns {*} 模块实例
     */
    function get(name) {
        if (!instances.has(name)) {
            throw new Error(`Module "${name}" is not loaded`);
        }
        return instances.get(name);
    }

    /**
     * 检查模块是否已加载
     * @param {string} name - 模块名称
     * @returns {boolean}
     */
    function isLoaded(name) {
        const module = modules.get(name);
        return module ? module.loaded : false;
    }

    /**
     * 检查模块是否已初始化
     * @param {string} name - 模块名称
     * @returns {boolean}
     */
    function isInitialized(name) {
        const module = modules.get(name);
        return module ? module.initialized : false;
    }

    /**
     * 加载单个模块（公开方法）
     * @param {string} name - 模块名称
     * @returns {Promise<*>}
     */
    async function load(name) {
        if (!modules.has(name)) {
            throw new Error(`Module "${name}" not registered`);
        }

        await loadModule(name);
        return get(name);
    }

    /**
     * 批量加载模块
     * @param {string[]} names - 模块名称列表
     * @param {Object} [options] - 选项
     * @param {boolean} [options.parallel=true] - 是否并行加载
     * @returns {Promise<Object>} 模块实例映射
     */
    async function loadMany(names, options = {}) {
        const { parallel = true } = options;

        if (parallel) {
            await Promise.all(names.map(name => loadModule(name)));
        } else {
            for (const name of names) {
                await loadModule(name);
            }
        }

        const result = {};
        for (const name of names) {
            result[name] = get(name);
        }

        return result;
    }

    /**
     * 加载所有已注册的模块
     * @param {Object} [options] - 选项
     * @returns {Promise<Object>} 加载结果
     */
    async function loadAll(options = {}) {
        const { skipLazy = false } = options;
        const results = {
            success: [],
            failed: [],
            errors: []
        };

        // 获取需要加载的模块
        const modulesToLoad = [];
        for (const [name, module] of modules) {
            if (skipLazy && module.lazy) continue;
            modulesToLoad.push(name);
        }

        // 拓扑排序
        const sorted = topologicalSort(modulesToLoad);

        for (const name of sorted) {
            try {
                await loadModule(name);
                results.success.push(name);
            } catch (error) {
                results.failed.push(name);
                results.errors.push({
                    module: name,
                    error: error.message
                });
                console.error(`[ModuleLoader] Failed to load "${name}":`, error);
            }
        }

        return results;
    }

    /**
     * 拓扑排序
     * @private
     * @param {string[]} moduleNames - 模块名称列表
     * @returns {string[]} 排序后的列表
     */
    function topologicalSort(moduleNames) {
        const visited = new Set();
        const result = [];

        function visit(name) {
            if (visited.has(name)) return;
            visited.add(name);

            const module = modules.get(name);
            if (module && module.dependencies) {
                module.dependencies.forEach(dep => {
                    if (moduleNames.includes(dep)) {
                        visit(dep);
                    }
                });
            }

            result.push(name);
        }

        moduleNames.forEach(visit);
        return result;
    }

    /**
     * 卸载模块
     * @param {string} name - 模块名称
     * @returns {boolean} 是否成功卸载
     */
    function unload(name) {
        const module = modules.get(name);
        if (!module) return false;

        // 检查是否有其他模块依赖它
        for (const [otherName, otherModule] of modules) {
            if (otherName !== name && 
                otherModule.dependencies.includes(name) && 
                otherModule.initialized) {
                console.warn(`[ModuleLoader] Cannot unload "${name}": "${otherName}" depends on it`);
                return false;
            }
        }

        instances.delete(name);
        module.initialized = false;
        module.loaded = false;
        
        const index = loadOrder.indexOf(name);
        if (index > -1) {
            loadOrder.splice(index, 1);
        }

        log('UNLOAD', name);
        return true;
    }

    /**
     * 清空所有模块
     */
    function clear() {
        const count = modules.size;
        modules.clear();
        instances.clear();
        loadingPromises.clear();
        loadOrder.length = 0;
        log('CLEAR', 'all', { count });
    }

    /**
     * 获取所有已注册的模块
     * @returns {string[]}
     */
    function list() {
        return Array.from(modules.keys());
    }

    /**
     * 获取模块信息
     * @param {string} name - 模块名称
     * @returns {Object|null}
     */
    function getInfo(name) {
        const module = modules.get(name);
        if (!module) return null;

        return {
            name: module.name,
            path: module.path,
            dependencies: module.dependencies,
            loaded: module.loaded,
            initialized: module.initialized,
            lazy: module.lazy
        };
    }

    /**
     * 获取加载顺序
     * @returns {string[]}
     */
    function getLoadOrder() {
        return [...loadOrder];
    }

    /**
     * 获取依赖图
     * @returns {Object}
     */
    function getDependencyGraph() {
        const graph = {};
        for (const [name, module] of modules) {
            graph[name] = module.dependencies;
        }
        return graph;
    }

    /**
     * 更新配置
     * @param {ModuleLoaderOptions} newConfig - 新配置
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
     * 导出状态
     * @returns {Object}
     */
    function exportState() {
        return {
            config: getConfig(),
            modules: list(),
            loaded: Array.from(modules.entries())
                .filter(([_, m]) => m.loaded)
                .map(([name, _]) => name),
            initialized: Array.from(modules.entries())
                .filter(([_, m]) => m.initialized)
                .map(([name, _]) => name),
            loadOrder: getLoadOrder(),
            dependencyGraph: getDependencyGraph()
        };
    }

    /**
     * 打印调试信息
     */
    function debug() {
        const state = exportState();
        console.group('[ModuleLoader] Debug Info');
        console.log('Configuration:', state.config);
        console.log('Registered Modules:', state.modules);
        console.log('Loaded Modules:', state.loaded);
        console.log('Initialized Modules:', state.initialized);
        console.log('Load Order:', state.loadOrder);
        console.log('Dependency Graph:', state.dependencyGraph);
        console.groupEnd();
    }

    // 公开 API
    const ModuleLoader = {
        // 注册
        register,
        registerGlobal,
        
        // 加载
        load,
        loadMany,
        loadAll,
        get,
        
        // 状态查询
        isLoaded,
        isInitialized,
        getInfo,
        list,
        getLoadOrder,
        getDependencyGraph,
        
        // 管理
        unload,
        clear,
        
        // 配置
        configure,
        getConfig,
        exportState,
        debug
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.ModuleLoader = ModuleLoader;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ModuleLoader;
    }

})(typeof window !== 'undefined' ? window : this);
