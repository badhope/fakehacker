/**
 * Toast 通知系统
 * 提供用户友好的消息提示
 */

const Toast = {
    container: null,
    timeout: 3000,
    
    /**
     * 初始化 Toast 容器
     */
    init() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    },
    
    /**
     * 显示 Toast 消息
     */
    show(message, type = 'info', duration = null) {
        if (!this.container) this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            padding: 12px 20px;
            background: ${this.getTypeColor(type)};
            color: #ffffff;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            border-left: 4px solid ${this.getTypeAccent(type)};
            font-size: 14px;
            pointer-events: auto;
            opacity: 0;
            transform: translateX(400px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            min-width: 250px;
            max-width: 400px;
        `;
        
        toast.textContent = message;
        this.container.appendChild(toast);
        
        // 触发动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });
        
        // 自动移除
        const removeDelay = duration || this.timeout;
        setTimeout(() => {
            this.remove(toast);
        }, removeDelay);
        
        // 点击移除
        toast.addEventListener('click', () => {
            this.remove(toast);
        });
        
        return toast;
    },
    
    /**
     * 移除 Toast
     */
    remove(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },
    
    /**
     * 获取类型对应颜色
     */
    getTypeColor(type) {
        const colors = {
            'info': 'rgba(0, 255, 255, 0.9)',
            'success': 'rgba(0, 255, 0, 0.9)',
            'warning': 'rgba(255, 255, 0, 0.9)',
            'error': 'rgba(255, 0, 0, 0.9)'
        };
        return colors[type] || colors['info'];
    },
    
    /**
     * 获取类型对应强调色
     */
    getTypeAccent(type) {
        const colors = {
            'info': '#00ffff',
            'success': '#00ff00',
            'warning': '#ffff00',
            'error': '#ff0000'
        };
        return colors[type] || colors['info'];
    },
    
    /**
     * 快捷方法
     */
    info(message) { return this.show(message, 'info'); }
    success(message) { return this.show(message, 'success'); }
    warning(message) { return this.show(message, 'warning'); }
    error(message) { return this.show(message, 'error'); }
};

// 导出到全局
window.Toast = Toast;
