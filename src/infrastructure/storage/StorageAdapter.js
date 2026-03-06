/**
 * StorageAdapter.js - 存储适配器接口和实现
 * 功能：统一存储接口、LocalStorage/SessionStorage/IndexedDB 适配
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module infrastructure/storage
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} StorageAdapter
     * @property {Function} init - 初始化
     * @property {Function} get - 获取数据
     * @property {Function} set - 设置数据
     * @property {Function} remove - 删除数据
     * @property {Function} clear - 清空
     * @property {Function} has - 检查是否存在
     * @property {Function} keys - 获取所有键
     */

    /**
     * 存储适配器基类
     * @abstract
     */
    class BaseStorageAdapter {
        constructor(name) {
            if (new.target === BaseStorageAdapter) {
                throw new Error('BaseStorageAdapter is abstract and cannot be instantiated');
            }
            this.name = name;
            this.initialized = false;
        }

        /**
         * 初始化存储
         * @abstract
         * @returns {Promise<void>}
         */
        async init() {
            this.initialized = true;
        }

        /**
         * 获取数据
         * @abstract
         * @param {string} key - 键
         * @returns {Promise<*>}
         */
        async get(key) {
            throw new Error('Method "get" must be implemented');
        }

        /**
         * 设置数据
         * @abstract
         * @param {string} key - 键
         * @param {*} value - 值
         * @returns {Promise<void>}
         */
        async set(key, value) {
            throw new Error('Method "set" must be implemented');
        }

        /**
         * 删除数据
         * @abstract
         * @param {string} key - 键
         * @returns {Promise<void>}
         */
        async remove(key) {
            throw new Error('Method "remove" must be implemented');
        }

        /**
         * 清空存储
         * @abstract
         * @returns {Promise<void>}
         */
        async clear() {
            throw new Error('Method "clear" must be implemented');
        }

        /**
         * 检查键是否存在
         * @abstract
         * @param {string} key - 键
         * @returns {Promise<boolean>}
         */
        async has(key) {
            throw new Error('Method "has" must be implemented');
        }

        /**
         * 获取所有键
         * @abstract
         * @returns {Promise<string[]>}
         */
        async keys() {
            throw new Error('Method "keys" must be implemented');
        }

        /**
         * 获取存储类型
         * @returns {string}
         */
        getType() {
            return this.name;
        }

        /**
         * 检查是否已初始化
         * @returns {boolean}
         */
        isInitialized() {
            return this.initialized;
        }
    }

    /**
     * LocalStorage 适配器
     */
    class LocalStorageAdapter extends BaseStorageAdapter {
        constructor() {
            super('local');
        }

        /**
         * @inheritDoc
         */
        async init() {
            if (typeof localStorage === 'undefined') {
                throw new Error('LocalStorage is not supported in this environment');
            }
            this.initialized = true;
        }

        async get(key) {
            if (!this.initialized) await this.init();
            
            const item = localStorage.getItem(key);
            if (item === null) return undefined;
            
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        }

        async set(key, value) {
            if (!this.initialized) await this.init();
            
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        }

        async remove(key) {
            if (!this.initialized) await this.init();
            localStorage.removeItem(key);
        }

        async clear() {
            if (!this.initialized) await this.init();
            localStorage.clear();
        }

        async has(key) {
            if (!this.initialized) await this.init();
            return localStorage.hasOwnProperty(key);
        }

        async keys() {
            if (!this.initialized) await this.init();
            return Object.keys(localStorage);
        }
    }

    /**
     * SessionStorage 适配器
     */
    class SessionStorageAdapter extends BaseStorageAdapter {
        constructor() {
            super('session');
        }

        /**
         * @inheritDoc
         */
        async init() {
            if (typeof sessionStorage === 'undefined') {
                throw new Error('SessionStorage is not supported in this environment');
            }
            this.initialized = true;
        }

        async get(key) {
            if (!this.initialized) await this.init();
            
            const item = sessionStorage.getItem(key);
            if (item === null) return undefined;
            
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        }

        async set(key, value) {
            if (!this.initialized) await this.init();
            
            const serialized = JSON.stringify(value);
            sessionStorage.setItem(key, serialized);
        }

        async remove(key) {
            if (!this.initialized) await this.init();
            sessionStorage.removeItem(key);
        }

        async clear() {
            if (!this.initialized) await this.init();
            sessionStorage.clear();
        }

        async has(key) {
            if (!this.initialized) await this.init();
            return sessionStorage.hasOwnProperty(key);
        }

        async keys() {
            if (!this.initialized) await this.init();
            return Object.keys(sessionStorage);
        }
    }

    /**
     * IndexedDB 适配器
     */
    class IndexedDBAdapter extends BaseStorageAdapter {
        constructor(dbName = 'qht_database', version = 1) {
            super('indexeddb');
            this.dbName = dbName;
            this.version = version;
            this.db = null;
            this.storeName = 'storage';
        }

        /**
         * @inheritDoc
         */
        async init() {
            if (!('indexedDB' in global)) {
                throw new Error('IndexedDB is not supported in this environment');
            }

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.version);

                request.onerror = () => {
                    reject(new Error('Failed to open IndexedDB'));
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    this.initialized = true;
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };
            });
        }

        /**
         * 获取对象存储
         * @private
         * @param {IDBTransactionMode} mode - 事务模式
         * @returns {IDBObjectStore}
         */
        _getStore(mode) {
            if (!this.db) {
                throw new Error('IndexedDB not initialized');
            }
            
            const transaction = this.db.transaction(this.storeName, mode);
            return transaction.objectStore(this.storeName);
        }

        async get(key) {
            if (!this.initialized) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const store = this._getStore('readonly');
                    const request = store.get(key);

                    request.onsuccess = () => {
                        resolve(request.result);
                    };

                    request.onerror = () => {
                        reject(new Error('Failed to get value'));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        }

        async set(key, value) {
            if (!this.initialized) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const store = this._getStore('readwrite');
                    const request = store.put(value, key);

                    request.onsuccess = () => {
                        resolve();
                    };

                    request.onerror = () => {
                        reject(new Error('Failed to set value'));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        }

        async remove(key) {
            if (!this.initialized) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const store = this._getStore('readwrite');
                    const request = store.delete(key);

                    request.onsuccess = () => {
                        resolve();
                    };

                    request.onerror = () => {
                        reject(new Error('Failed to remove value'));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        }

        async clear() {
            if (!this.initialized) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const store = this._getStore('readwrite');
                    const request = store.clear();

                    request.onsuccess = () => {
                        resolve();
                    };

                    request.onerror = () => {
                        reject(new Error('Failed to clear store'));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        }

        async has(key) {
            const value = await this.get(key);
            return value !== undefined;
        }

        async keys() {
            if (!this.initialized) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const store = this._getStore('readonly');
                    const request = store.getAllKeys();

                    request.onsuccess = () => {
                        resolve(request.result);
                    };

                    request.onerror = () => {
                        reject(new Error('Failed to get keys'));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        }

        /**
         * 关闭数据库连接
         * @returns {void}
         */
        close() {
            if (this.db) {
                this.db.close();
                this.db = null;
            }
        }
    }

    /**
     * 存储管理器 - 统一管理多个存储适配器
     */
    class StorageManager {
        constructor() {
            this.adapters = new Map();
            this.defaultAdapter = null;
        }

        /**
         * 注册存储适配器
         * @param {string} name - 适配器名称
         * @param {BaseStorageAdapter} adapter - 适配器实例
         * @param {boolean} [isDefault=false] - 是否为默认适配器
         * @returns {StorageManager}
         */
        register(name, adapter, isDefault = false) {
            this.adapters.set(name, adapter);
            
            if (isDefault || !this.defaultAdapter) {
                this.defaultAdapter = name;
            }

            return this;
        }

        /**
         * 获取适配器
         * @param {string} [name] - 适配器名称，不传则使用默认
         * @returns {BaseStorageAdapter}
         */
        getAdapter(name) {
            const adapterName = name || this.defaultAdapter;
            const adapter = this.adapters.get(adapterName);
            
            if (!adapter) {
                throw new Error(`Storage adapter "${adapterName}" not found`);
            }

            return adapter;
        }

        /**
         * 设置默认适配器
         * @param {string} name - 适配器名称
         */
        setDefault(name) {
            if (!this.adapters.has(name)) {
                throw new Error(`Storage adapter "${name}" not found`);
            }
            this.defaultAdapter = name;
        }

        /**
         * 初始化所有适配器
         * @returns {Promise<Object>}
         */
        async initAll() {
            const results = {};
            
            for (const [name, adapter] of this.adapters) {
                try {
                    await adapter.init();
                    results[name] = { success: true };
                } catch (error) {
                    results[name] = { 
                        success: false, 
                        error: error.message 
                    };
                }
            }

            return results;
        }

        /**
         * 获取数据（使用默认或指定适配器）
         * @param {string} key - 键
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<*>}
         */
        async get(key, adapterName) {
            return this.getAdapter(adapterName).get(key);
        }

        /**
         * 设置数据（使用默认或指定适配器）
         * @param {string} key - 键
         * @param {*} value - 值
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<void>}
         */
        async set(key, value, adapterName) {
            return this.getAdapter(adapterName).set(key, value);
        }

        /**
         * 删除数据
         * @param {string} key - 键
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<void>}
         */
        async remove(key, adapterName) {
            return this.getAdapter(adapterName).remove(key);
        }

        /**
         * 清空存储
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<void>}
         */
        async clear(adapterName) {
            return this.getAdapter(adapterName).clear();
        }

        /**
         * 检查键是否存在
         * @param {string} key - 键
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<boolean>}
         */
        async has(key, adapterName) {
            return this.getAdapter(adapterName).has(key);
        }

        /**
         * 获取所有键
         * @param {string} [adapterName] - 适配器名称
         * @returns {Promise<string[]>}
         */
        async keys(adapterName) {
            return this.getAdapter(adapterName).keys();
        }

        /**
         * 获取所有已注册的适配器
         * @returns {string[]}
         */
        listAdapters() {
            return Array.from(this.adapters.keys());
        }

        /**
         * 导出状态
         * @returns {Object}
         */
        exportState() {
            return {
                defaultAdapter: this.defaultAdapter,
                adapters: this.listAdapters(),
                initialized: Object.fromEntries(
                    Array.from(this.adapters.entries()).map(([name, adapter]) => [
                        name,
                        adapter.isInitialized()
                    ])
                )
            };
        }
    }

    // 创建默认存储管理器实例
    const defaultStorageManager = new StorageManager();

    // 注册常用适配器
    try {
        defaultStorageManager.register('local', new LocalStorageAdapter(), true);
        defaultStorageManager.register('session', new SessionStorageAdapter());
        defaultStorageManager.register('indexeddb', new IndexedDBAdapter());
    } catch (e) {
        console.warn('[StorageAdapter] Some adapters could not be registered:', e.message);
    }

    // 导出
    const StorageAdapter = {
        // 类
        BaseStorageAdapter,
        LocalStorageAdapter,
        SessionStorageAdapter,
        IndexedDBAdapter,
        StorageManager,

        // 默认实例
        default: defaultStorageManager,

        // 便捷方法（使用默认适配器）
        async get(key) {
            return defaultStorageManager.get(key);
        },
        async set(key, value) {
            return defaultStorageManager.set(key, value);
        },
        async remove(key) {
            return defaultStorageManager.remove(key);
        },
        async clear() {
            return defaultStorageManager.clear();
        },
        async has(key) {
            return defaultStorageManager.has(key);
        },
        async keys() {
            return defaultStorageManager.keys();
        }
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.StorageAdapter = StorageAdapter;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = StorageAdapter;
    }

})(typeof window !== 'undefined' ? window : this);
