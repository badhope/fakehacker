/**
 * EventBus.js - 响应式事件总线
 * 功能：发布/订阅模式实现、事件驱动架构、响应式数据流
 * 版本：v5.0.0
 * 作者：QHT System
 * 
 * @module core/EventBus
 */

(function(global) {
    'use strict';

    /**
     * @typedef {Object} Event
     * @property {string} type - 事件类型
     * @property {*} payload - 事件数据
     * @property {number} timestamp - 时间戳
     * @property {boolean} defaultPrevented - 是否阻止默认行为
     */

    /**
     * @typedef {Function} EventCallback
     * @param {Event} event - 事件对象
     * @returns {void}
     */

    /**
     * @typedef {Object} EventBusOptions
     * @property {boolean} [enableLogging=false] - 启用日志
     * @property {boolean} [enableHistory=false] - 启用历史记录
     * @property {number} [maxHistorySize=100] - 最大历史记录数
     */

    // 配置
    const config = {
        enableLogging: false,
        enableHistory: false,
        maxHistorySize: 100
    };

    // 事件注册表
    const registry = new Map();

    // 事件历史记录
    const history = [];

    // 一次性监听器
    const onceListeners = new Map();

    // 事件别名
    const aliases = new Map();

    /**
     * 日志函数
     * @private
     * @param {string} type - 日志类型
     * @param {string} event - 事件名
     * @param {*} data - 数据
     */
    function log(type, event, data) {
        if (!config.enableLogging) return;
        
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [EventBus.${type}] ${event}:`, data);
    }

    /**
     * 记录事件历史
     * @private
     * @param {string} type - 事件类型
     * @param {*} payload - 事件数据
     */
    function recordHistory(type, payload) {
        if (!config.enableHistory) return;

        history.push({
            type,
            payload,
            timestamp: Date.now()
        });

        if (history.length > config.maxHistorySize) {
            history.shift();
        }
    }

    /**
     * 创建事件对象
     * @private
     * @param {string} type - 事件类型
     * @param {*} payload - 事件数据
     * @returns {Event}
     */
    function createEvent(type, payload) {
        const event = {
            type,
            payload,
            timestamp: Date.now(),
            defaultPrevented: false,
            preventDefault() {
                this.defaultPrevented = true;
            }
        };
        return event;
    }

    /**
     * 获取或创建事件监听器列表
     * @private
     * @param {string} eventType - 事件类型
     * @returns {Set<EventCallback>}
     */
    function getListeners(eventType) {
        if (!registry.has(eventType)) {
            registry.set(eventType, new Set());
        }
        return registry.get(eventType);
    }

    /**
     * 订阅事件
     * @param {string} eventType - 事件类型
     * @param {EventCallback} callback - 回调函数
     * @param {Object} [options] - 选项
     * @param {number} [options.priority=0] - 优先级（数字越大优先级越高）
     * @param {boolean} [options.once=false] - 是否只触发一次
     * @returns {Function} 取消订阅函数
     */
    function on(eventType, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        const listeners = getListeners(eventType);
        
        // 包装回调以支持优先级
        const wrappedCallback = Object.assign(callback, {
            priority: options.priority || 0,
            once: options.once || false
        });

        listeners.add(wrappedCallback);
        
        log('SUBSCRIBE', eventType, { callback: callback.name, options });

        // 返回取消订阅函数
        return function off() {
            listeners.delete(wrappedCallback);
            log('UNSUBSCRIBE', eventType, { callback: callback.name });
        };
    }

    /**
     * 订阅事件（只触发一次）
     * @param {string} eventType - 事件类型
     * @param {EventCallback} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    function once(eventType, callback) {
        return on(eventType, callback, { once: true });
    }

    /**
     * 发布事件
     * @param {string} eventType - 事件类型
     * @param {*} [payload] - 事件数据
     * @returns {Promise<Event>} 事件对象
     */
    async function emit(eventType, payload) {
        const event = createEvent(eventType, payload);
        
        log('EMIT', eventType, payload);
        recordHistory(eventType, payload);

        // 处理别名
        const actualType = aliases.get(eventType) || eventType;
        const listeners = getListeners(actualType);

        // 按优先级排序
        const sortedListeners = Array.from(listeners)
            .sort((a, b) => b.priority - a.priority);

        // 触发监听器
        for (const listener of sortedListeners) {
            try {
                if (listener.once) {
                    listeners.delete(listener);
                }
                
                const result = listener(event);
                
                // 支持异步回调
                if (result instanceof Promise) {
                    await result;
                }
            } catch (error) {
                console.error(`[EventBus] Error in listener "${listener.name || 'anonymous'}":`, error);
            }
        }

        return event;
    }

    /**
     * 取消订阅
     * @param {string} eventType - 事件类型
     * @param {EventCallback} callback - 回调函数
     */
    function off(eventType, callback) {
        const listeners = registry.get(eventType);
        if (!listeners) return;

        if (callback) {
            listeners.delete(callback);
        } else {
            listeners.clear();
        }

        log('UNSUBSCRIBE_ALL', eventType);
    }

    /**
     * 移除所有监听器
     * @param {string} [eventType] - 可选的事件类型，不传则清空所有
     */
    function clear(eventType) {
        if (eventType) {
            registry.delete(eventType);
            log('CLEAR', eventType);
        } else {
            registry.clear();
            log('CLEAR_ALL');
        }
    }

    /**
     * 获取事件监听器数量
     * @param {string} eventType - 事件类型
     * @returns {number}
     */
    function listenerCount(eventType) {
        const listeners = registry.get(eventType);
        return listeners ? listeners.size : 0;
    }

    /**
     * 获取所有已注册的事件类型
     * @returns {string[]}
     */
    function eventNames() {
        return Array.from(registry.keys());
    }

    /**
     * 设置事件别名
     * @param {string} alias - 别名
     * @param {string} target - 目标事件类型
     */
    function setAlias(alias, target) {
        aliases.set(alias, target);
        log('SET_ALIAS', `${alias} -> ${target}`);
    }

    /**
     * 移除事件别名
     * @param {string} alias - 别名
     */
    function removeAlias(alias) {
        aliases.delete(alias);
        log('REMOVE_ALIAS', alias);
    }

    /**
     * 获取事件历史
     * @param {number} [limit] - 限制数量
     * @returns {Array<Object>}
     */
    function getHistory(limit) {
        if (limit) {
            return history.slice(-limit);
        }
        return [...history];
    }

    /**
     * 清空事件历史
     */
    function clearHistory() {
        history.length = 0;
        log('CLEAR_HISTORY');
    }

    /**
     * 等待事件
     * @param {string} eventType - 事件类型
     * @param {Function} [predicate] - 可选的过滤函数
     * @param {number} [timeout] - 超时时间（毫秒）
     * @returns {Promise<Event>}
     */
    function waitFor(eventType, predicate, timeout) {
        return new Promise((resolve, reject) => {
            let timeoutId;

            const handler = (event) => {
                if (!predicate || predicate(event)) {
                    if (timeoutId) clearTimeout(timeoutId);
                    resolve(event);
                }
            };

            const unsubscribe = on(eventType, handler, { once: true });

            if (timeout) {
                timeoutId = setTimeout(() => {
                    unsubscribe();
                    reject(new Error(`Timeout waiting for event: ${eventType}`));
                }, timeout);
            }
        });
    }

    /**
     * 批量订阅多个事件
     * @param {Object<string, EventCallback>} eventMap - 事件映射
     * @returns {Function} 取消所有订阅函数
     */
    function onMany(eventMap) {
        const unsubscribers = [];

        for (const [eventType, callback] of Object.entries(eventMap)) {
            unsubscribers.push(on(eventType, callback));
        }

        return function offMany() {
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    }

    /**
     * 更新配置
     * @param {EventBusOptions} newConfig - 新配置
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
            registeredEvents: eventNames(),
            listenerCounts: eventNames().reduce((acc, name) => {
                acc[name] = listenerCount(name);
                return acc;
            }, {}),
            historySize: history.length
        };
    }

    /**
     * 打印调试信息
     */
    function debug() {
        const state = exportState();
        console.group('[EventBus] Debug Info');
        console.log('Configuration:', state.config);
        console.log('Registered Events:', state.registeredEvents);
        console.log('Listener Counts:', state.listenerCounts);
        console.log('History Size:', state.historySize);
        console.groupEnd();
    }

    // 公开 API
    const EventBus = {
        // 基本操作
        on,
        off,
        emit,
        once,
        clear,
        
        // 查询
        listenerCount,
        eventNames,
        
        // 别名管理
        setAlias,
        removeAlias,
        
        // 历史管理
        getHistory,
        clearHistory,
        
        // 高级功能
        waitFor,
        onMany,
        
        // 配置
        configure,
        getConfig,
        exportState,
        debug
    };

    // 导出到全局
    if (typeof window !== 'undefined') {
        window.EventBus = EventBus;
    }

    // 支持 CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EventBus;
    }

})(typeof window !== 'undefined' ? window : this);
