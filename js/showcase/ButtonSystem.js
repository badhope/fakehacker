/**
 * 按钮交互系统
 * 提供直观的按钮布局和交互功能
 * @module ButtonSystem
 */

class ButtonSystem {
    constructor() {
        this.container = null;
        this.buttons = new Map();
        this.groups = new Map();
        this.currentLayout = 'grid';
        this.onButtonClick = null;
    }

    /**
     * 初始化按钮系统
     * @param {HTMLElement} container - 容器元素
     * @returns {Promise<ButtonSystem>}
     */
    async init(container = null) {
        this.container = container || this.createDefaultContainer();
        this.createLayout();
        this.bindEvents();
        
        console.log('[ButtonSystem] 初始化完成');
        return this;
    }

    /**
     * 创建默认容器
     * @returns {HTMLElement}
     */
    createDefaultContainer() {
        const container = document.createElement('div');
        container.id = 'button-system';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.9));
            padding: 30px;
            z-index: 9000;
        `;
        
        document.body.appendChild(container);
        return container;
    }

    /**
     * 创建布局
     */
    createLayout() {
        if (this.currentLayout === 'grid') {
            this.createGridLayout();
        } else if (this.currentLayout === 'sidebar') {
            this.createSidebarLayout();
        }
    }

    /**
     * 创建网格布局
     */
    createGridLayout() {
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
        this.container.style.gap = '15px';
        this.container.style.padding = '30px';
    }

    /**
     * 创建侧边栏布局
     */
    createSidebarLayout() {
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.gap = '10px';
        this.container.style.width = '200px';
        this.container.style.position = 'fixed';
        this.container.style.left = '0';
        this.container.style.top = '0';
        this.container.style.height = '100%';
        this.container.style.background = 'rgba(0, 0, 0, 0.9)';
        this.container.style.padding = '20px';
        this.container.style.borderRight = '2px solid #00ffff';
    }

    /**
     * 添加按钮
     * @param {string} id - 按钮 ID
     * @param {Object} config - 按钮配置
     */
    addButton(id, config) {
        const button = document.createElement('button');
        button.id = `btn-${id}`;
        button.className = 'effect-button';
        button.dataset.id = id;

        const defaultConfig = {
            label: id,
            icon: '⚡',
            color: '#00ffff',
            size: 'medium',
            group: 'default',
            effects: [],
            shortcut: null,
            description: ''
        };

        const buttonConfig = { ...defaultConfig, ...config };

        button.innerHTML = `
            <span class="button-icon">${buttonConfig.icon}</span>
            <span class="button-label">${buttonConfig.label}</span>
        `;

        this.styleButton(button, buttonConfig);
        
        button.onclick = () => this.handleButtonClick(id, buttonConfig);
        
        if (buttonConfig.shortcut) {
            this.registerShortcut(buttonConfig.shortcut, id);
        }

        this.container.appendChild(button);
        this.buttons.set(id, { element: button, config: buttonConfig });

        if (!this.groups.has(buttonConfig.group)) {
            this.groups.set(buttonConfig.group, []);
        }
        this.groups.get(buttonConfig.group).push(id);

        console.log(`[ButtonSystem] 添加按钮：${id}`);
        return button;
    }

    /**
     * 设置按钮样式
     * @param {HTMLButtonElement} button - 按钮元素
     * @param {Object} config - 按钮配置
     */
    styleButton(button, config) {
        const sizeStyles = {
            small: { padding: '10px 15px', fontSize: '14px' },
            medium: { padding: '15px 20px', fontSize: '16px' },
            large: { padding: '20px 25px', fontSize: '18px' }
        };

        const sizeStyle = sizeStyles[config.size] || sizeStyles.medium;

        Object.assign(button.style, {
            background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
            border: `2px solid ${config.color}`,
            color: config.color,
            padding: sizeStyle.padding,
            fontSize: sizeStyle.fontSize,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'relative',
            overflow: 'hidden'
        });

        button.onmouseenter = () => {
            button.style.transform = 'translateY(-5px) scale(1.05)';
            button.style.boxShadow = `0 10px 30px ${config.color}60`;
        };

        button.onmouseleave = () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        };

        button.onmousedown = () => {
            button.style.transform = 'scale(0.95)';
        };

        button.onmouseup = () => {
            button.style.transform = 'translateY(-5px) scale(1.05)';
        };
    }

    /**
     * 处理按钮点击
     * @param {string} id - 按钮 ID
     * @param {Object} config - 按钮配置
     */
    async handleButtonClick(id, config) {
        console.log(`[ButtonSystem] 按钮点击：${id}`);

        const ripple = this.createRipple(config.color);

        try {
            if (config.effects && config.effects.length > 0) {
                for (const effect of config.effects) {
                    if (window.showcaseEngine) {
                        await window.showcaseEngine.playEffect(effect.id, effect.params || {});
                    }
                }
            }

            if (this.onButtonClick) {
                this.onButtonClick(id, config);
            }
        } catch (error) {
            console.error(`[ButtonSystem] 执行效果失败:`, error);
        }

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * 创建涟漪效果
     * @param {string} color - 颜色
     * @returns {HTMLElement}
     */
    createRipple(color) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${color};
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => style.remove(), 600);
        return ripple;
    }

    /**
     * 注册快捷键
     * @param {string} key - 按键
     * @param {string} buttonId - 按钮 ID
     */
    registerShortcut(key, buttonId) {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === key.toLowerCase() && !e.target.matches('input, textarea')) {
                const button = document.getElementById(`btn-${buttonId}`);
                if (button) {
                    button.click();
                }
            }
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (window.showcaseEngine) {
                    window.showcaseEngine.stopAllEffects();
                }
            }
        });
    }

    /**
     * 移除按钮
     * @param {string} id - 按钮 ID
     */
    removeButton(id) {
        const buttonData = this.buttons.get(id);
        if (buttonData) {
            buttonData.element.remove();
            this.buttons.delete(id);
            
            const group = buttonData.config.group;
            if (this.groups.has(group)) {
                const index = this.groups.get(group).indexOf(id);
                if (index > -1) {
                    this.groups.get(group).splice(index, 1);
                }
            }
            
            console.log(`[ButtonSystem] 移除按钮：${id}`);
        }
    }

    /**
     * 获取按钮
     * @param {string} id - 按钮 ID
     * @returns {Object|null}
     */
    getButton(id) {
        return this.buttons.get(id) || null;
    }

    /**
     * 获取所有按钮
     * @returns {Map}
     */
    getAllButtons() {
        return this.buttons;
    }

    /**
     * 按组获取按钮
     * @param {string} group - 组名
     * @returns {Array}
     */
    getButtonsByGroup(group) {
        const ids = this.groups.get(group) || [];
        return ids.map(id => this.buttons.get(id)).filter(Boolean);
    }

    /**
     * 设置布局
     * @param {string} layout - 布局类型 (grid, sidebar)
     */
    setLayout(layout) {
        this.currentLayout = layout;
        this.container.innerHTML = '';
        this.createLayout();
        
        for (const [id, buttonData] of this.buttons) {
            this.container.appendChild(buttonData.element);
        }
    }

    /**
     * 显示/隐藏
     * @param {boolean} show - 是否显示
     */
    toggle(show) {
        this.container.style.display = show ? 
            (this.currentLayout === 'grid' ? 'grid' : 'flex') : 'none';
    }

    /**
     * 销毁系统
     */
    destroy() {
        this.container.remove();
        this.buttons.clear();
        this.groups.clear();
        console.log('[ButtonSystem] 已销毁');
    }
}

window.ButtonSystem = ButtonSystem;
