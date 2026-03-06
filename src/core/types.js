/**
 * types.js - 类型定义和常量
 * 功能：全局类型定义、枚举常量、接口规范
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module core/types
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} LogLevel
     * @property {'DEBUG'} DEBUG - 调试日志
     * @property {'INFO'} INFO - 信息日志
     * @property {'WARN'} WARN - 警告日志
     * @property {'ERROR'} ERROR - 错误日志
     * @property {'FATAL'} FATAL - 致命错误
     */
    const LogLevel = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        FATAL: 'FATAL'
    };

    /**
     * @typedef {Object} LogType
     * @property {'info'} INFO - 信息
     * @property {'success'} SUCCESS - 成功
     * @property {'warning'} WARNING - 警告
     * @property {'error'} ERROR - 错误
     * @property {'debug'} DEBUG - 调试
     */
    const LogType = {
        INFO: 'info',
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error',
        DEBUG: 'debug'
    };

    /**
     * @typedef {Object} ThemeType
     * @property {'dark'} DARK - 暗色主题
     * @property {'light'} LIGHT - 亮色主题
     * @property {'cyberpunk'} CYBERPUNK - 赛博朋克
     * @property {'matrix'} MATRIX - 矩阵主题
     * @property {'solar'} SOLAR - 太阳能主题
     */
    const ThemeType = {
        DARK: 'dark',
        LIGHT: 'light',
        CYBERPUNK: 'cyberpunk',
        MATRIX: 'matrix',
        SOLAR: 'solar'
    };

    /**
     * @typedef {Object} PermissionLevel
     * @property {number} GUEST - 访客 (0)
     * @property {number} USER - 用户 (1)
     * @property {number} ADVANCED - 高级用户 (2)
     * @property {number} ADMIN - 管理员 (3)
     * @property {number} DEVELOPER - 开发者 (4)
     */
    const PermissionLevel = {
        GUEST: 0,
        USER: 1,
        ADVANCED: 2,
        ADMIN: 3,
        DEVELOPER: 4
    };

    /**
     * @typedef {Object} CommandType
     * @property {'basic'} BASIC - 基础命令
     * @property {'advanced'} ADVANCED - 高级命令
     * @property {'system'} SYSTEM - 系统命令
     * @property {'custom'} CUSTOM - 自定义命令
     */
    const CommandType = {
        BASIC: 'basic',
        ADVANCED: 'advanced',
        SYSTEM: 'system',
        CUSTOM: 'custom'
    };

    /**
     * @typedef {Object} CommandStatus
     * @property {'pending'} PENDING - 等待中
     * @property {'running'} RUNNING - 运行中
     * @property {'success'} SUCCESS - 成功
     * @property {'failed'} FAILED - 失败
     * @property {'cancelled'} CANCELLED - 已取消
     */
    const CommandStatus = {
        PENDING: 'pending',
        RUNNING: 'running',
        SUCCESS: 'success',
        FAILED: 'failed',
        CANCELLED: 'cancelled'
    };

    /**
     * @typedef {Object} NotificationType
     * @property {'info'} INFO - 信息
     * @property {'success'} SUCCESS - 成功
     * @property {'warning'} WARNING - 警告
     * @property {'error'} ERROR - 错误
     */
    const NotificationType = {
        INFO: 'info',
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error'
    };

    /**
     * @typedef {Object} NotificationPosition
     * @property {'top-left'} TOP_LEFT - 左上
     * @property {'top-right'} TOP_RIGHT - 右上
     * @property {'bottom-left'} BOTTOM_LEFT - 左下
     * @property {'bottom-right'} BOTTOM_RIGHT - 右下
     * @property {'top-center'} TOP_CENTER - 顶部居中
     * @property {'bottom-center'} BOTTOM_CENTER - 底部居中
     */
    const NotificationPosition = {
        TOP_LEFT: 'top-left',
        TOP_RIGHT: 'top-right',
        BOTTOM_LEFT: 'bottom-left',
        BOTTOM_RIGHT: 'bottom-right',
        TOP_CENTER: 'top-center',
        BOTTOM_CENTER: 'bottom-center'
    };

    /**
     * @typedef {Object} StorageType
     * @property {'local'} LOCAL - LocalStorage
     * @property {'session'} SESSION - SessionStorage
     * @property {'indexeddb'} INDEXEDDB - IndexedDB
     */
    const StorageType = {
        LOCAL: 'local',
        SESSION: 'session',
        INDEXEDDB: 'indexeddb'
    };

    /**
     * @typedef {Object} CacheStrategy
     * @property {'lru'} LRU - 最近最少使用
     * @property {'lfu'} LFU - 最不经常使用
     * @property {'fifo'} FIFO - 先进先出
     * @property {'ttl'} TTL - 基于过期时间
     */
    const CacheStrategy = {
        LRU: 'lru',
        LFU: 'lfu',
        FIFO: 'fifo',
        TTL: 'ttl'
    };

    /**
     * @typedef {Object} EffectType
     * @property {'matrix'} MATRIX - 矩阵雨
     * @property {'network'} NETWORK - 网络拓扑
     * @property {'glitch'} GLITCH - 故障效果
     * @property {'flash'} FLASH - 闪烁效果
     * @property {'particles'} PARTICLES - 粒子效果
     */
    const EffectType = {
        MATRIX: 'matrix',
        NETWORK: 'network',
        GLITCH: 'glitch',
        FLASH: 'flash',
        PARTICLES: 'particles'
    };

    /**
     * @typedef {Object} AppState
     * @property {'initializing'} INITIALIZING - 初始化中
     * @property {'ready'} READY - 就绪
     * @property {'running'} RUNNING - 运行中
     * @property {'paused'} PAUSED - 暂停
     * @property {'error'} ERROR - 错误
     * @property {'destroyed'} DESTROYED - 已销毁
     */
    const AppState = {
        INITIALIZING: 'initializing',
        READY: 'ready',
        RUNNING: 'running',
        PAUSED: 'paused',
        ERROR: 'error',
        DESTROYED: 'destroyed'
    };

    /**
     * @typedef {Object} UIComponent
     * @property {'button'} BUTTON - 按钮
     * @property {'panel'} PANEL - 面板
     * @property {'modal'} MODAL - 模态框
     * @property {'notification'} NOTIFICATION - 通知
     * @property {'progress'} PROGRESS - 进度条
     * @property {'tooltip'} TOOLTIP - 提示框
     */
    const UIComponent = {
        BUTTON: 'button',
        PANEL: 'panel',
        MODAL: 'modal',
        NOTIFICATION: 'notification',
        PROGRESS: 'progress',
        TOOLTIP: 'tooltip'
    };

    /**
     * @typedef {Object} EventPriority
     * @property {number} LOW - 低优先级 (0)
     * @property {number} NORMAL - 普通优先级 (1)
     * @property {number} HIGH - 高优先级 (2)
     * @property {number} URGENT - 紧急优先级 (3)
     */
    const EventPriority = {
        LOW: 0,
        NORMAL: 1,
        HIGH: 2,
        URGENT: 3
    };

    /**
     * @typedef {Object} ServiceScope
     * @property {'singleton'} SINGLETON - 单例
     * @property {'transient'} TRANSIENT - 瞬态
     * @property {'scoped'} SCOPED - 作用域
     */
    const ServiceScope = {
        SINGLETON: 'singleton',
        TRANSIENT: 'transient',
        SCOPED: 'scoped'
    };

    /**
     * @typedef {Object} ValidationRule
     * @property {'string'} STRING - 字符串
     * @property {'number'} NUMBER - 数字
     * @property {'boolean'} BOOLEAN - 布尔
     * @property {'array'} ARRAY - 数组
     * @property {'object'} OBJECT - 对象
     * @property {'email'} EMAIL - 邮箱
     * @property {'url'} URL - URL
     * @property {'phone'} PHONE - 电话
     * @property {'alphanumeric'} ALPHANUMERIC - 字母数字
     */
    const ValidationRule = {
        STRING: 'string',
        NUMBER: 'number',
        BOOLEAN: 'boolean',
        ARRAY: 'array',
        OBJECT: 'object',
        EMAIL: 'email',
        URL: 'url',
        PHONE: 'phone',
        ALPHANUMERIC: 'alphanumeric'
    };

    /**
     * @typedef {Object} ColorScheme
     * @property {string} primary - 主色调
     * @property {string} secondary - 次要色
     * @property {string} accent - 强调色
     * @property {string} background - 背景色
     * @property {string} surface - 表面色
     * @property {string} error - 错误色
     * @property {string} success - 成功色
     * @property {string} warning - 警告色
     * @property {string} info - 信息色
     */

    /**
     * 预定义配色方案
     */
    const ColorSchemes = {
        dark: {
            primary: '#00ff00',
            secondary: '#00aa00',
            accent: '#00ffff',
            background: '#050505',
            surface: '#1a1a1a',
            error: '#ff0044',
            success: '#00ff00',
            warning: '#ffaa00',
            info: '#00ffff'
        },
        cyberpunk: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ffff00',
            background: '#0a0a1a',
            surface: '#1a1a3a',
            error: '#ff0044',
            success: '#00ff88',
            warning: '#ffaa00',
            info: '#00ffff'
        },
        matrix: {
            primary: '#00ff00',
            secondary: '#00aa00',
            accent: '#00ff00',
            background: '#000000',
            surface: '#0a0a0a',
            error: '#ff0000',
            success: '#00ff00',
            warning: '#ffff00',
            info: '#00ffff'
        }
    };

    /**
     * @typedef {Object} Breakpoint
     * @property {number} MOBILE - 手机 (<768px)
     * @property {number} TABLET - 平板 (>=768px)
     * @property {number} DESKTOP - 桌面 (>=1024px)
     * @property {number} WIDE - 宽屏 (>=1440px)
     */
    const Breakpoint = {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1440,
        WIDE: 1920
    };

    /**
     * @typedef {Object} KeyCode
     * @property {string} ENTER - Enter 键
     * @property {string} ESCAPE - Escape 键
     * @property {string} SPACE - 空格键
     * @property {string} ARROW_UP - 上箭头
     * @property {string} ARROW_DOWN - 下箭头
     * @property {string} ARROW_LEFT - 左箭头
     * @property {string} ARROW_RIGHT - 右箭头
     */
    const KeyCode = {
        ENTER: 'Enter',
        ESCAPE: 'Escape',
        SPACE: 'Space',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight'
    };

    /**
     * 导出所有类型和常量
     */
    const Types = {
        // 枚举常量
        LogLevel,
        LogType,
        ThemeType,
        PermissionLevel,
        CommandType,
        CommandStatus,
        NotificationType,
        NotificationPosition,
        StorageType,
        CacheStrategy,
        EffectType,
        AppState,
        UIComponent,
        EventPriority,
        ServiceScope,
        ValidationRule,
        ColorSchemes,
        Breakpoint,
        KeyCode,

        /**
         * 获取类型名称
         * @param {*} value - 值
         * @returns {string} 类型名称
         */
        getTypeName(value) {
            return Object.prototype.toString.call(value).slice(8, -1);
        },

        /**
         * 检查值是否为指定类型
         * @param {*} value - 值
         * @param {string} typeName - 类型名称
         * @returns {boolean}
         */
        isType(value, typeName) {
            return this.getTypeName(value) === typeName;
        },

        /**
         * 检查是否为对象
         * @param {*} value - 值
         * @returns {boolean}
         */
        isObject(value) {
            return this.isType(value, 'Object');
        },

        /**
         * 检查是否为数组
         * @param {*} value - 值
         * @returns {boolean}
         */
        isArray(value) {
            return Array.isArray(value);
        },

        /**
         * 检查是否为函数
         * @param {*} value - 值
         * @returns {boolean}
         */
        isFunction(value) {
            return typeof value === 'function';
        },

        /**
         * 检查是否为字符串
         * @param {*} value - 值
         * @returns {boolean}
         */
        isString(value) {
            return typeof value === 'string';
        },

        /**
         * 检查是否为数字
         * @param {*} value - 值
         * @returns {boolean}
         */
        isNumber(value) {
            return typeof value === 'number' && !isNaN(value);
        },

        /**
         * 检查是否为布尔值
         * @param {*} value - 值
         * @returns {boolean}
         */
        isBoolean(value) {
            return typeof value === 'boolean';
        },

        /**
         * 检查是否为空值
         * @param {*} value - 值
         * @returns {boolean}
         */
        isNullOrEmpty(value) {
            return value === null || value === undefined || value === '';
        },

        /**
         * 深拷贝对象
         * @template T
         * @param {T} obj - 对象
         * @returns {T} 深拷贝后的对象
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            if (Array.isArray(obj)) {
                return obj.map(item => this.deepClone(item));
            }

            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        },

        /**
         * 冻结对象（不可变）
         * @template T
         * @param {T} obj - 对象
         * @returns {Readonly<T>} 冻结后的对象
         */
        freeze(obj) {
            return Object.freeze(obj);
        }
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.Types = Types;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Types;
    }

})(typeof window !== 'undefined' ? window : this);
