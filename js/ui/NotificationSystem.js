/**
 * NotificationSystem.js - 通知系统
 * 功能：提供用户友好的消息通知、支持多种类型、自动管理
 * 版本：v4.0
 * 作者：QHT System
 */

const NotificationSystem = (function() {
    'use strict';
    
    // 配置
    const config = {
        duration: 5000,              // 默认持续时间（毫秒）
        maxNotifications: 5,         // 最大通知数量
        position: 'top-right',       // 位置：top-right, top-left, bottom-right, bottom-left
        enableSound: true,           // 启用音效
        enableAnimation: true,       // 启用动画
        closeOnClick: true,          // 点击关闭
        showProgressBar: true        // 显示进度条
    };
    
    // 通知队列
    const queue = [];
    
    // 当前显示的通知
    const activeNotifications = [];
    
    // 音效
    const sounds = {
        info: null,
        success: null,
        warning: null,
        error: null
    };
    
    /**
     * 初始化通知系统
     */
    function init() {
        createContainer();
        loadSounds();
        console.log('[NotificationSystem] Initialized');
    }
    
    /**
     * 创建通知容器
     */
    function createContainer() {
        if (document.getElementById('notification-container')) {
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            ${config.position.includes('top') ? 'top' : 'bottom'}: 20px;
            ${config.position.includes('right') ? 'right' : 'left'}: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            pointer-events: none;
        `;
        
        document.body.appendChild(container);
    }
    
    /**
     * 加载音效
     */
    function loadSounds() {
        if (!config.enableSound) return;
        
        const soundFiles = {
            info: 'notification-info.mp3',
            success: 'notification-success.mp3',
            warning: 'notification-warning.mp3',
            error: 'notification-error.mp3'
        };
        
        Object.entries(soundFiles).forEach(([type, file]) => {
            const audio = new Audio(`assets/audio/${file}`);
            audio.volume = 0.3;
            sounds[type] = audio;
        });
    }
    
    /**
     * 播放音效
     * @param {string} type - 通知类型
     */
    function playSound(type) {
        if (!config.enableSound || !sounds[type]) return;
        
        sounds[type].currentTime = 0;
        sounds[type].play().catch(() => {
            // 忽略自动播放限制错误
        });
    }
    
    /**
     * 显示通知
     * @param {Object} options - 通知选项
     * @returns {HTMLElement} 通知元素
     */
    function show(options) {
        const {
            title = '通知',
            message = '',
            type = 'info',           // info, success, warning, error
            duration = config.duration,
            icon,
            onClick,
            onClose,
            closable = true,
            sound = true
        } = options;
        
        // 创建通知元素
        const notification = createNotification(title, message, type, icon, closable);
        
        // 添加到容器
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        // 添加到活动列表
        activeNotifications.push(notification);
        
        // 播放音效
        if (sound) {
            playSound(type);
        }
        
        // 点击事件
        if (onClick) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', (e) => {
                if (config.closeOnClick && e.target.tagName !== 'BUTTON') {
                    close(notification, onClose);
                }
                onClick(notification);
            });
        }
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn && closable) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                close(notification, onClose);
            });
        }
        
        // 自动关闭
        if (duration > 0) {
            if (config.showProgressBar) {
                const progressBar = notification.querySelector('.notification-progress');
                if (progressBar) {
                    progressBar.style.transition = `width ${duration}ms linear`;
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                    }, 10);
                }
            }
            
            setTimeout(() => {
                if (notification.parentNode) {
                    close(notification, onClose);
                }
            }, duration);
        }
        
        // 限制通知数量
        if (activeNotifications.length > config.maxNotifications) {
            const oldest = activeNotifications[0];
            close(oldest);
        }
        
        return notification;
    }
    
    /**
     * 创建通知元素
     */
    function createNotification(title, message, type, customIcon, closable) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // 图标映射
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        const colors = {
            info: '#00ffff',
            success: '#00ff00',
            warning: '#ffaa00',
            error: '#ff0044'
        };
        
        const icon = customIcon || icons[type];
        const color = colors[type];
        
        notification.style.cssText = `
            min-width: 300px;
            padding: 15px;
            background: rgba(5, 5, 5, 0.95);
            border: 2px solid ${color};
            border-radius: 8px;
            color: #e0e0e0;
            font-family: var(--font-mono);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            pointer-events: auto;
            position: relative;
            overflow: hidden;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 20px; flex-shrink: 0;">${icon}</span>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="color: ${color}; font-size: 14px;">${title}</strong>
                        ${closable ? `
                            <button class="notification-close" style="
                                background: transparent;
                                border: none;
                                color: #666;
                                font-size: 18px;
                                cursor: pointer;
                                padding: 0;
                                line-height: 1;
                            ">&times;</button>
                        ` : ''}
                    </div>
                    <div style="font-size: 13px; line-height: 1.5; color: #ccc;">${message}</div>
                    ${config.showProgressBar ? `
                        <div class="notification-progress" style="
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            height: 2px;
                            background: ${color};
                            width: 100%;
                            transition: width 0.3s;
                        "></div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return notification;
    }
    
    /**
     * 关闭通知
     * @param {HTMLElement} notification - 通知元素
     * @param {Function} callback - 回调函数
     */
    function close(notification, callback) {
        if (!notification || !notification.parentNode) return;
        
        // 播放关闭动画
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        
        // 从活动列表移除
        const index = activeNotifications.indexOf(notification);
        if (index > -1) {
            activeNotifications.splice(index, 1);
        }
        
        // 移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (callback) {
                callback(notification);
            }
        }, 300);
    }
    
    /**
     * 关闭所有通知
     */
    function closeAll() {
        [...activeNotifications].forEach(notification => {
            close(notification);
        });
    }
    
    /**
     * 便捷方法 - 信息通知
     */
    function info(title, message, options = {}) {
        return show({ title, message, type: 'info', ...options });
    }
    
    /**
     * 便捷方法 - 成功通知
     */
    function success(title, message, options = {}) {
        return show({ title, message, type: 'success', ...options });
    }
    
    /**
     * 便捷方法 - 警告通知
     */
    function warning(title, message, options = {}) {
        return show({ title, message, type: 'warning', ...options });
    }
    
    /**
     * 便捷方法 - 错误通知
     */
    function error(title, message, options = {}) {
        return show({ title, message, type: 'error', ...options });
    }
    
    /**
     * 获取活动通知数量
     * @returns {number}
     */
    function getActiveCount() {
        return activeNotifications.length;
    }
    
    /**
     * 更新配置
     * @param {Object} newConfig - 新配置
     */
    function updateConfig(newConfig) {
        Object.assign(config, newConfig);
        console.log('[NotificationSystem] Configuration updated:', config);
    }
    
    /**
     * 获取配置
     * @returns {Object}
     */
    function getConfig() {
        return { ...config };
    }
    
    // 添加 CSS 动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 公开 API
    return {
        init,
        show,
        close,
        closeAll,
        info,
        success,
        warning,
        error,
        getActiveCount,
        updateConfig,
        getConfig
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.NotificationSystem = NotificationSystem;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => NotificationSystem.init());
    } else {
        NotificationSystem.init();
    }
}
