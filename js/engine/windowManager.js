class WindowManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeWindow = null;
        this.zIndexCounter = 100;
    }

    /**
     * 创建一个新窗口
     * @param {string} id - 窗口唯一ID
     * @param {string} title - 窗口标题
     * @param {string} content - HTML内容字符串
     * @param {object} options - 配置项 (宽度、高度等)
     */
    createWindow(id, title, content, options = {}) {
        // 如果窗口已存在，直接聚焦
        const existing = document.getElementById(id);
        if (existing) {
            this.focusWindow(existing);
            return existing;
        }

        const win = document.createElement('div');
        win.className = 'window-container';
        win.id = id;
        
        // 设置默认尺寸和位置
        const width = options.width || 500;
        const height = options.height || 400;
        win.style.width = width + 'px';
        win.style.height = height + 'px';
        
        // 随机位置，避免完全重叠
        const left = (this.container.offsetWidth - width) / 2 + Math.random() * 100 - 50;
        const top = (this.container.offsetHeight - height) / 2 + Math.random() * 100 - 50;
        win.style.left = Math.max(0, left) + 'px';
        win.style.top = Math.max(0, top) + 'px';

        win.innerHTML = `
            <div class="window-header">
                <span class="window-title">${title}</span>
                <div class="window-controls">
                    <div class="window-btn btn-close" onclick="windowManager.closeWindow('${id}')"></div>
                    <div class="window-btn btn-minimize"></div>
                    <div class="window-btn btn-maximize"></div>
                </div>
            </div>
            <div class="window-content">${content}</div>
            <div class="status-bar">
                <span>Status: Ready</span>
                <span id="status-${id}">Idle</span>
            </div>
        `;

        this.container.appendChild(win);
        this.makeDraggable(win);
        this.focusWindow(win);

        return win;
    }

    closeWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.transform = 'scale(0.9)';
            win.style.opacity = '0';
            setTimeout(() => win.remove(), 200);
        }
    }

    focusWindow(win) {
        if (this.activeWindow) {
            this.activeWindow.style.zIndex = parseInt(this.activeWindow.style.zIndex) || 100;
        }
        win.style.zIndex = ++this.zIndexCounter;
        this.activeWindow = win;
    }

    makeDraggable(win) {
        const header = win.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return; // 忽略按钮点击
            isDragging = true;
            this.focusWindow(win);
            
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = win.offsetLeft;
            initialTop = win.offsetTop;
            
            // 防止拖动时选中文本
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            win.style.left = `${initialLeft + dx}px`;
            win.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

// 初始化全局窗口管理器
const windowManager = new WindowManager('windows-container');
