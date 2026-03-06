/**
 * index.js - 应用主入口
 * 功能：模块加载、初始化、应用启动
 * 版本：v5.0.0
 * 作者：QHT System
 */

(function(global) {
    'use strict';

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     QUANTUM HACK TERMINAL v5.0 - REFACTORED EDITION      ║
║                                                           ║
║     Initializing core modules...                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // 应用状态
    const AppState = {
        INITIALIZING: 'initializing',
        READY: 'ready',
        RUNNING: 'running',
        ERROR: 'error'
    };

    let currentState = AppState.INITIALIZING;

    /**
     * 初始化核心层
     */
    async function initCore() {
        console.group('[INIT] Core Layer');
        
        try {
            // 加载核心模块
            await ModuleLoader.load('EventBus');
            await ModuleLoader.load('Container');
            await ModuleLoader.load('ConfigManager');
            
            console.log('✅ Core modules loaded');
            console.groupEnd();
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize core layer:', error);
            console.groupEnd();
            return false;
        }
    }

    /**
     * 初始化基础设施层
     */
    async function initInfrastructure() {
        console.group('[INIT] Infrastructure Layer');
        
        try {
            // 注册基础设施模块
            ModuleLoader
                .register('StorageAdapter', {
                    path: 'src/infrastructure/storage/StorageAdapter.js',
                    dependencies: []
                })
                .register('SecurityManager', {
                    path: 'src/infrastructure/security/SecurityManager.js',
                    dependencies: []
                });
            
            // 加载模块
            await ModuleLoader.load('StorageAdapter');
            await ModuleLoader.load('SecurityManager');
            
            console.log('✅ Infrastructure modules loaded');
            console.groupEnd();
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize infrastructure layer:', error);
            console.groupEnd();
            return false;
        }
    }

    /**
     * 注册核心服务到容器
     */
    function registerCoreServices() {
        console.group('[INIT] Registering Services');
        
        try {
            // 注册配置管理器
            Container.singleton('ConfigManager', () => ConfigManager);
            
            // 注册事件总线
            Container.singleton('EventBus', () => EventBus);
            
            // 注册存储管理器
            Container.singleton('StorageManager', () => StorageAdapter.default);
            
            // 注册安全管理器
            Container.singleton('SecurityManager', () => SecurityManager);
            
            console.log('✅ Core services registered');
            console.groupEnd();
            return true;
        } catch (error) {
            console.error('❌ Failed to register services:', error);
            console.groupEnd();
            return false;
        }
    }

    /**
     * 初始化应用
     */
    async function init() {
        currentState = AppState.INITIALIZING;
        
        console.group('[APP] Initialization');
        console.time('Initialization');
        
        try {
            // 1. 初始化核心层
            if (!await initCore()) {
                throw new Error('Core layer initialization failed');
            }
            
            // 2. 初始化基础设施层
            if (!await initInfrastructure()) {
                throw new Error('Infrastructure layer initialization failed');
            }
            
            // 3. 注册服务
            if (!registerCoreServices()) {
                throw new Error('Service registration failed');
            }
            
            // 4. 初始化配置
            ConfigManager.set('app.environment', 'development');
            ConfigManager.set('app.debug', true);
            
            // 5. 初始化安全管理器
            SecurityManager.init();
            
            currentState = AppState.READY;
            
            console.timeEnd('Initialization');
            console.log('✅ Application initialized successfully');
            console.groupEnd();
            
            // 发送初始化完成事件
            await EventBus.emit('app:initialized', {
                version: '5.0.0',
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            currentState = AppState.ERROR;
            console.error('❌ Application initialization failed:', error);
            console.groupEnd();
            
            await EventBus.emit('app:error', {
                error: error.message,
                timestamp: Date.now()
            });
            
            return false;
        }
    }

    /**
     * 启动应用
     */
    async function start() {
        if (currentState !== AppState.READY) {
            console.warn('[APP] Not ready to start. Current state:', currentState);
            return false;
        }
        
        currentState = AppState.RUNNING;
        
        console.group('[APP] Starting');
        console.log('🚀 Starting application...');
        
        try {
            // 发送启动事件
            await EventBus.emit('app:started', {
                timestamp: Date.now()
            });
            
            console.log('✅ Application started');
            console.groupEnd();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to start application:', error);
            console.groupEnd();
            return false;
        }
    }

    /**
     * 获取应用状态
     */
    function getState() {
        return currentState;
    }

    /**
     * 导出应用信息
     */
    function exportInfo() {
        return {
            name: 'QUANTUM HACK TERMINAL',
            version: '5.0.0',
            state: currentState,
            coreModules: Container.list(),
            config: ConfigManager.getAll(),
            security: SecurityManager.exportReport()
        };
    }

    // 公开 API
    const App = {
        init,
        start,
        getState,
        exportInfo
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.App = App;
        
        // 自动初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => App.init());
        } else {
            App.init();
        }
    }

})(typeof window !== 'undefined' ? window : this);
