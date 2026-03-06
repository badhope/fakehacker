/**
 * ConfigManager.js - 配置管理器
 * 功能：应用配置管理、环境变量、配置验证、配置热更新
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module core/ConfigManager
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} ConfigSchema
     * @property {string} type - 数据类型
     * @property {*} [default] - 默认值
     * @property {boolean} [required=false] - 是否必填
     * @property {Function} [validator] - 验证函数
     * @property {*} [min] - 最小值
     * @property {*} [max] - 最大值
     * @property {string[]} [enum] - 枚举值
     */

    // 默认配置
    const defaults = {
        // 应用配置
        app: {
            name: 'QUANTUM HACK TERMINAL',
            version: '5.0.0',
            environment: 'development',
            debug: false
        },
        
        // UI 配置
        ui: {
            theme: 'dark',
            language: 'zh-CN',
            animations: true,
            sounds: true,
            notifications: true
        },
        
        // 性能配置
        performance: {
            enableCache: true,
            cacheSize: 100,
            enableLazyLoad: true,
            maxWorkers: 4
        },
        
        // 安全配置
        security: {
            enableXSSProtection: true,
            enableInputValidation: true,
            enablePermissionCheck: true,
            maxInputLength: 500
        },
        
        // 存储配置
        storage: {
            prefix: 'qht_',
            encryption: false,
            autoSave: true,
            autoSaveInterval: 60000
        }
    };

    // 当前配置
    let currentConfig = JSON.parse(JSON.stringify(defaults));

    // 配置 schema
    const schemas = new Map();

    // 配置变更监听器
    const listeners = new Map();

    // 配置历史（用于回滚）
    const history = [];
    const MAX_HISTORY = 50;

    /**
     * 定义配置 schema
     * @param {string} path - 配置路径（点分隔）
     * @param {ConfigSchema} schema - Schema 定义
     */
    function defineSchema(path, schema) {
        schemas.set(path, schema);
    }

    /**
     * 获取配置值
     * @param {string} path - 配置路径（点分隔）
     * @param {*} [defaultValue] - 默认值
     * @returns {*} 配置值
     */
    function get(path, defaultValue) {
        const keys = path.split('.');
        let value = currentConfig;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue !== undefined ? defaultValue : undefined;
            }
        }

        return value;
    }

    /**
     * 设置配置值
     * @param {string} path - 配置路径（点分隔）
     * @param {*} value - 配置值
     * @param {Object} [options] - 选项
     * @param {boolean} [options.saveHistory=true] - 是否保存历史
     * @param {boolean} [options.validate=true] - 是否验证
     */
    function set(path, value, options = {}) {
        const { saveHistory = true, validate = true } = options;

        // 保存历史
        if (saveHistory) {
            history.push({
                path,
                oldValue: get(path),
                timestamp: Date.now()
            });

            if (history.length > MAX_HISTORY) {
                history.shift();
            }
        }

        // 验证
        if (validate) {
            const schema = schemas.get(path);
            if (schema && !validateValue(value, schema)) {
                throw new Error(`Invalid value for "${path}": ${value}`);
            }
        }

        // 设置值
        const keys = path.split('.');
        let obj = currentConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }

        const oldValue = obj[keys[keys.length - 1]];
        obj[keys[keys.length - 1]] = value;

        // 触发变更事件
        notifyListeners(path, value, oldValue);

        return true;
    }

    /**
     * 批量设置配置
     * @param {Object} config - 配置对象
     * @param {Object} [options] - 选项
     */
    function setMany(config, options = {}) {
        for (const [key, value] of Object.entries(config)) {
            set(key, value, options);
        }
    }

    /**
     * 验证值是否符合 schema
     * @private
     * @param {*} value - 值
     * @param {ConfigSchema} schema - Schema
     * @returns {boolean}
     */
    function validateValue(value, schema) {
        if (value === undefined || value === null) {
            return !schema.required;
        }

        // 类型检查
        if (schema.type) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== schema.type) {
                return false;
            }
        }

        // 枚举检查
        if (schema.enum && !schema.enum.includes(value)) {
            return false;
        }

        // 范围检查
        if (schema.min !== undefined && value < schema.min) {
            return false;
        }

        if (schema.max !== undefined && value > schema.max) {
            return false;
        }

        // 自定义验证
        if (schema.validator && typeof schema.validator === 'function') {
            return schema.validator(value);
        }

        return true;
    }

    /**
     * 监听配置变更
     * @param {string} path - 配置路径
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消监听函数
     */
    function watch(path, callback) {
        if (!listeners.has(path)) {
            listeners.set(path, new Set());
        }

        listeners.get(path).add(callback);

        // 返回取消监听函数
        return function unwatch() {
            const pathListeners = listeners.get(path);
            if (pathListeners) {
                pathListeners.delete(callback);
            }
        };
    }

    /**
     * 通知监听器
     * @private
     * @param {string} path - 配置路径
     * @param {*} newValue - 新值
     * @param {*} oldValue - 旧值
     */
    function notifyListeners(path, newValue, oldValue) {
        const pathListeners = listeners.get(path);
        if (pathListeners) {
            pathListeners.forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    console.error(`[ConfigManager] Error in listener for "${path}":`, error);
                }
            });
        }

        // 通知通配符监听器
        const wildcardListeners = listeners.get('*');
        if (wildcardListeners) {
            wildcardListeners.forEach(callback => {
                try {
                    callback(path, newValue, oldValue);
                } catch (error) {
                    console.error(`[ConfigManager] Error in wildcard listener:`, error);
                }
            });
        }
    }

    /**
     * 重置配置为默认值
     * @param {string} [path] - 可选的配置路径，不传则重置所有
     */
    function reset(path) {
        if (!path) {
            currentConfig = JSON.parse(JSON.stringify(defaults));
            notifyListeners('*', currentConfig, null);
        } else {
            const keys = path.split('.');
            let defaultObj = defaults;

            for (const key of keys) {
                if (defaultObj && typeof defaultObj === 'object' && key in defaultObj) {
                    defaultObj = defaultObj[key];
                } else {
                    return;
                }
            }

            set(path, JSON.parse(JSON.stringify(defaultObj)));
        }
    }

    /**
     * 回滚到历史状态
     * @param {number} [steps=1] - 回滚步数
     * @returns {boolean} 是否成功回滚
     */
    function rollback(steps = 1) {
        if (history.length === 0) {
            return false;
        }

        const actualSteps = Math.min(steps, history.length);
        const changes = history.splice(-actualSteps);

        // 逆向应用变更
        for (let i = changes.length - 1; i >= 0; i--) {
            const change = changes[i];
            const keys = change.path.split('.');
            let obj = currentConfig;

            for (let j = 0; j < keys.length - 1; j++) {
                obj = obj[keys[j]];
            }

            obj[keys[keys.length - 1]] = change.oldValue;
            notifyListeners(change.path, change.oldValue, null);
        }

        return true;
    }

    /**
     * 导出配置
     * @param {string[]} [paths] - 要导出的配置路径列表
     * @returns {Object}
     */
    function export(paths) {
        if (!paths) {
            return JSON.parse(JSON.stringify(currentConfig));
        }

        const result = {};
        for (const path of paths) {
            const keys = path.split('.');
            let value = currentConfig;
            let obj = result;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!(key in obj)) {
                    obj[key] = {};
                }
                obj = obj[key];
                value = value[key];
            }

            obj[keys[keys.length - 1]] = JSON.parse(JSON.stringify(value[keys[keys.length - 1]]));
        }

        return result;
    }

    /**
     * 导入配置
     * @param {Object} config - 配置对象
     * @param {Object} [options] - 选项
     */
    function import(config, options = {}) {
        const { merge = true, validate = true } = options;

        if (!merge) {
            currentConfig = JSON.parse(JSON.stringify(defaults));
        }

        setMany(config, { validate });
    }

    /**
     * 获取所有配置
     * @returns {Object}
     */
    function getAll() {
        return JSON.parse(JSON.stringify(currentConfig));
    }

    /**
     * 检查配置项是否存在
     * @param {string} path - 配置路径
     * @returns {boolean}
     */
    function has(path) {
        const keys = path.split('.');
        let obj = currentConfig;

        for (const key of keys) {
            if (obj && typeof obj === 'object' && key in obj) {
                obj = obj[key];
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * 验证所有配置
     * @returns {Object} 验证结果
     */
    function validate() {
        const errors = [];
        const warnings = [];

        for (const [path, schema] of schemas) {
            const value = get(path);
            
            if (schema.required && (value === undefined || value === null)) {
                errors.push(`Missing required config: ${path}`);
                continue;
            }

            if (value !== undefined && value !== null && !validateValue(value, schema)) {
                errors.push(`Invalid config value for "${path}": ${value}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * 重置为默认配置
     */
    function resetToDefaults() {
        reset();
    }

    /**
     * 打印配置信息
     */
    function debug() {
        console.group('[ConfigManager] Debug Info');
        console.log('Current Config:', currentConfig);
        console.log('Schemas:', Array.from(schemas.keys()));
        console.log('Listeners:', Array.from(listeners.keys()));
        console.log('History Size:', history.length);
        console.log('Validation:', validate());
        console.groupEnd();
    }

    // 公开 API
    const ConfigManager = {
        // 基本操作
        get,
        set,
        setMany,
        has,
        
        // 监听
        watch,
        
        // 管理
        reset,
        rollback,
        export,
        import,
        getAll,
        
        // Schema
        defineSchema,
        validate,
        
        // 调试
        debug,
        resetToDefaults
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.ConfigManager = ConfigManager;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ConfigManager;
    }

})(typeof window !== 'undefined' ? window : this);
