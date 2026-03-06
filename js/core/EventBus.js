/* ==========================================
   模块名称：core/EventBus.js
   功能：全局事件总线，模块间解耦通信
   版本：3.0 - 架构优化
   ========================================== */

/**
 * 事件总线 - 实现模块间松耦合通信
 */
const EventBus = (function() {
    // 事件存储
    const events = new Map();
    
    // 一次性事件存储
    const onceEvents = new Map();
    
    // 事件历史（用于调试）
    const eventHistory = [];
    const maxHistory = 100;

    /**
     * 订阅事件
     */
    function on(event, callback, context = null) {
        if (!events.has(event)) {
            events.set(event, []);
        }
        
        const subscription = { callback, context };
        events.get(event).push(subscription);
        
        return {
            off: () => off(event, callback)
        };
    }

    /**
     * 订阅一次性事件
     */
    function once(event, callback, context = null) {
        if (!onceEvents.has(event)) {
            onceEvents.set(event, []);
        }
        
        const subscription = { callback, context };
        onceEvents.get(event).push(subscription);
        
        return {
            off: () => {
                const handlers = onceEvents.get(event);
                if (handlers) {
                    const index = handlers.findIndex(h => h.callback === callback);
                    if (index !== -1) {
                        handlers.splice(index, 1);
                    }
                }
            }
        };
    }

    /**
     * 取消订阅
     */
    function off(event, callback) {
        if (!events.has(event)) return;
        
        const handlers = events.get(event);
        const index = handlers.findIndex(h => h.callback === callback);
        
        if (index !== -1) {
            handlers.splice(index, 1);
        }
        
        if (handlers.length === 0) {
            events.delete(event);
        }
    }

    /**
     * 发布事件
     */
    function emit(event, ...args) {
        // 记录事件历史
        recordEvent(event, args);
        
        // 触发普通事件
        if (events.has(event)) {
            const handlers = [...events.get(event)];
            handlers.forEach(({ callback, context }) => {
                try {
                    callback.apply(context, args);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
        
        // 触发一次性事件
        if (onceEvents.has(event)) {
            const handlers = [...onceEvents.get(event)];
            handlers.forEach(({ callback, context }) => {
                try {
                    callback.apply(context, args);
                } catch (error) {
                    console.error(`Error in once-event handler for "${event}":`, error);
                }
            });
            onceEvents.delete(event);
        }
    }

    /**
     * 记录事件历史
     */
    function recordEvent(event, args) {
        eventHistory.push({
            event,
            args,
            timestamp: Date.now()
        });
        
        if (eventHistory.length > maxHistory) {
            eventHistory.shift();
        }
    }

    /**
     * 获取事件历史
     */
    function getHistory(filter = null) {
        if (filter) {
            return eventHistory.filter(item => item.event === filter);
        }
        return [...eventHistory];
    }

    /**
     * 清空事件
     */
    function clear() {
        events.clear();
        onceEvents.clear();
        eventHistory.length = 0;
    }

    /**
     * 获取订阅数量
     */
    function listenerCount(event) {
        const normalCount = events.has(event) ? events.get(event).length : 0;
        const onceCount = onceEvents.has(event) ? onceEvents.get(event).length : 0;
        return normalCount + onceCount;
    }

    /**
     * 获取所有事件
     */
    function eventNames() {
        return Array.from(events.keys());
    }

    /**
     * 触发事件（带延迟）
     */
    function emitAsync(event, delay = 0, ...args) {
        setTimeout(() => emit(event, ...args), delay);
    }

    /**
     * 批量触发事件
     */
    function emitBatch(eventsToEmit) {
        requestAnimationFrame(() => {
            eventsToEmit.forEach(({ event, args }) => {
                emit(event, ...args);
            });
        });
    }

    /**
     * 事件追踪（调试用）
     */
    function trace(event) {
        on(event, (...args) => {
            console.log(`[EventBus] ${event}:`, ...args);
        });
    }

    /**
     * 创建事件通道
     */
    function createChannel(channelName) {
        return {
            subscribe: (callback) => on(channelName, callback),
            unsubscribe: (callback) => off(channelName, callback),
            publish: (...args) => emit(channelName, ...args),
            publishAsync: (delay, ...args) => emitAsync(channelName, delay, ...args)
        };
    }

    /**
     * 事件中间件
     */
    function use(middleware) {
        const originalEmit = emit;
        emit = function(event, ...args) {
            const result = middleware(event, args, originalEmit);
            if (result !== false) {
                originalEmit(event, ...args);
            }
        };
    }

    /**
     * 事件日志中间件
     */
    function loggingMiddleware(event, args, next) {
        console.log(`[EventBus] Event: ${event}`, args);
        next(event, ...args);
    }

    /**
     * 事件节流中间件
     */
    function throttleMiddleware(event, args, next) {
        const now = Date.now();
        const lastEmit = this.lastEmit || 0;
        
        if (now - lastEmit > 100) { // 100ms 节流
            this.lastEmit = now;
            next(event, ...args);
        }
    }

    // 公开 API
    return {
        on,
        once,
        off,
        emit,
        emitAsync,
        emitBatch,
        clear,
        listenerCount,
        eventNames,
        getHistory,
        trace,
        createChannel,
        use
    };
})();

// 导出到全局作用域
window.EventBus = EventBus;

// 预定义事件常量
window.AppEvents = {
    // 应用生命周期
    APP_INIT: 'app:init',
    APP_BOOT: 'app:boot',
    APP_READY: 'app:ready',
    APP_DESTROY: 'app:destroy',
    
    // 指令执行
    COMMAND_EXECUTE: 'command:execute',
    COMMAND_COMPLETE: 'command:complete',
    COMMAND_ERROR: 'command:error',
    
    // UI 事件
    UI_UPDATE: 'ui:update',
    UI_LOG: 'ui:log',
    UI_BUTTON_CLICK: 'ui:button:click',
    
    // 特效事件
    EFFECT_START: 'effect:start',
    EFFECT_END: 'effect:end',
    EFFECT_ERROR: 'effect:error',
    
    // 音效事件
    AUDIO_PLAY: 'audio:play',
    AUDIO_STOP: 'audio:stop',
    
    // 任务系统
    QUEST_UPDATE: 'quest:update',
    QUEST_COMPLETE: 'quest:complete',
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',
    
    // 设置变更
    SETTINGS_CHANGE: 'settings:change',
    THEME_CHANGE: 'theme:change',
    
    // 性能监控
    PERFORMANCE_LOW: 'performance:low',
    PERFORMANCE_RECOVER: 'performance:recover'
};
