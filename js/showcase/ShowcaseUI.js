/**
 * 展示平台 UI 管理器
 * 负责管理所有展示相关的界面组件
 * @module ShowcaseUI
 */

class ShowcaseUI {
    constructor() {
        this.container = null;
        this.effectGrid = null;
        this.controlPanel = null;
        this.paramPanel = null;
        this.previewCanvas = null;
        this.isInitialized = false;
    }

    /**
     * 初始化 UI
     * @returns {Promise<ShowcaseUI>}
     */
    async init() {
        this.createContainer();
        this.createEffectGrid();
        this.createControlPanel();
        this.createParamPanel();
        this.createPreviewCanvas();
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('[ShowcaseUI] UI 初始化完成');
        
        return this;
    }

    /**
     * 创建主容器
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'showcase-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;
        
        document.body.appendChild(this.container);
    }

    /**
     * 创建效果网格
     */
    createEffectGrid() {
        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        `;

        this.effectGrid = gridContainer;
        this.container.appendChild(gridContainer);
    }

    /**
     * 创建控制面板
     */
    createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 350px;
            height: 100%;
            background: rgba(20, 20, 40, 0.95);
            border-left: 2px solid #00ffff;
            padding: 20px;
            overflow-y: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10001;
        `;
        panel.id = 'showcase-control-panel';

        panel.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2 style="color: #00ffff; margin: 0 0 10px 0; font-size: 24px;">
                    <span style="color: #ff00ff;">⚡</span> 效果控制台
                </h2>
                <button id="close-panel" style="
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    background: #ff0055;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                    border-radius: 4px;
                    font-weight: bold;
                ">✕ 关闭</button>
            </div>
            
            <div id="effect-info" style="margin-bottom: 30px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">效果详情</h3>
                <div id="effect-details" style="color: #cccccc; line-height: 1.6;"></div>
            </div>
            
            <div id="effect-params" style="margin-bottom: 30px;">
                <h3 style="color: #ffff00; margin-bottom: 10px;">参数设置</h3>
                <div id="params-container"></div>
            </div>
            
            <div style="margin-top: 30px;">
                <button id="play-effect" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(45deg, #00ff00, #00ffff);
                    border: none;
                    color: #000;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    transition: all 0.3s;
                ">▶ 播放效果</button>
                
                <button id="stop-effect" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(45deg, #ff0000, #ff8800);
                    border: none;
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.3s;
                ">⏹ 停止效果</button>
            </div>
        `;

        this.controlPanel = panel;
        document.body.appendChild(panel);
    }

    /**
     * 创建参数面板
     */
    createParamPanel() {
        this.paramPanel = document.getElementById('params-container');
    }

    /**
     * 创建预览 Canvas
     */
    createPreviewCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'effect-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        this.previewCanvas = canvas;
        document.body.appendChild(canvas);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const closeBtn = document.getElementById('close-panel');
        const playBtn = document.getElementById('play-effect');
        const stopBtn = document.getElementById('stop-effect');

        closeBtn.addEventListener('click', () => this.hideControlPanel());
        playBtn.addEventListener('click', () => this.onPlayEffect());
        stopBtn.addEventListener('click', () => this.onStopEffect());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideControlPanel();
            }
        });
    }

    /**
     * 显示效果卡片
     * @param {Array<Object>} effects - 效果列表
     */
    renderEffectCards(effects) {
        this.effectGrid.innerHTML = '';

        for (const effect of effects) {
            const card = this.createEffectCard(effect);
            this.effectGrid.appendChild(card);
        }
    }

    /**
     * 创建效果卡片
     * @param {Object} effect - 效果对象
     * @returns {HTMLElement}
     */
    createEffectCard(effect) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: linear-gradient(135deg, rgba(20, 20, 40, 0.9), rgba(40, 40, 80, 0.9));
            border: 2px solid #00ffff;
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        `;

        card.onmouseenter = () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.3)';
        };

        card.onmouseleave = () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        };

        card.onclick = () => this.showControlPanel(effect);

        const categoryColors = {
            matrix: '#00ff00',
            network: '#00ffff',
            particle: '#ff8800',
            glitch: '#ff00ff',
            overlay: '#ffffff',
            flash: '#ffff00',
            text: '#0088ff',
            code: '#00ff88',
            wave: '#ff0088',
            pulse: '#ff0055',
            ripple: '#00ffff',
            distortion: '#aa00ff'
        };

        const categoryColor = categoryColors[effect.category] || '#00ffff';

        card.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: ${categoryColor};"></div>
            <h3 style="color: ${categoryColor}; margin: 0 0 10px 0; font-size: 20px;">
                ${effect.name}
            </h3>
            <p style="color: #cccccc; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                ${effect.description}
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                ${effect.tags.map(tag => `
                    <span style="
                        background: rgba(0, 255, 255, 0.2);
                        color: ${categoryColor};
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        border: 1px solid ${categoryColor};
                    ">${tag}</span>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888888; font-size: 12px;">
                    持续时间：${effect.duration / 1000}s
                </span>
                <button style="
                    background: ${categoryColor};
                    color: #000;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                ">播放</button>
            </div>
        `;

        return card;
    }

    /**
     * 显示控制面板
     * @param {Object} effect - 效果对象
     */
    showControlPanel(effect) {
        const detailsDiv = document.getElementById('effect-details');
        const paramsContainer = document.getElementById('params-container');

        detailsDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong style="color: #00ffff;">名称:</strong> 
                <span style="color: #ffffff;">${effect.name}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: #00ffff;">分类:</strong> 
                <span style="color: #ffffff;">${effect.category}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: #00ffff;">描述:</strong> 
                <p style="color: #cccccc; margin: 5px 0 0 0;">${effect.description}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: #00ffff;">持续时间:</strong> 
                <span style="color: #ffffff;">${effect.duration / 1000}秒</span>
            </div>
        `;

        paramsContainer.innerHTML = '';
        
        if (effect.params && Object.keys(effect.params).length > 0) {
            for (const [key, param] of Object.entries(effect.params)) {
                const paramDiv = this.createParamInput(key, param, effect.defaultParams[key]);
                paramsContainer.appendChild(paramDiv);
            }
        } else {
            paramsContainer.innerHTML = '<p style="color: #888888;">此效果无自定义参数</p>';
        }

        this.currentEffect = effect;
        const panel = document.getElementById('showcase-control-panel');
        panel.style.transform = 'translateX(0)';
    }

    /**
     * 创建参数输入控件
     * @param {string} key - 参数键
     * @param {Object} param - 参数定义
     * @param {any} defaultValue - 默认值
     * @returns {HTMLElement}
     */
    createParamInput(key, param, defaultValue) {
        const div = document.createElement('div');
        div.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.color = '#00ffff';
        label.style.marginBottom = '5px';
        label.style.fontSize = '14px';
        label.textContent = param.label || key;

        div.appendChild(label);

        let input;

        if (param.type === 'color') {
            input = document.createElement('input');
            input.type = 'color';
            input.value = defaultValue || '#00ff00';
            input.style.cssText = `
                width: 100%;
                height: 40px;
                border: 2px solid #00ffff;
                border-radius: 4px;
                cursor: pointer;
            `;
        } else if (param.type === 'range') {
            const rangeContainer = document.createElement('div');
            rangeContainer.style.display = 'flex';
            rangeContainer.style.alignItems = 'center';
            rangeContainer.style.gap = '10px';

            input = document.createElement('input');
            input.type = 'range';
            input.min = param.min || 0;
            input.max = param.max || 100;
            input.step = param.step || 1;
            input.value = defaultValue !== undefined ? defaultValue : param.default || 50;
            input.style.flex = '1';
            input.style.cssText = `
                -webkit-appearance: none;
                height: 8px;
                background: rgba(0, 255, 255, 0.3);
                border-radius: 4px;
                outline: none;
            `;

            const valueDisplay = document.createElement('span');
            valueDisplay.style.color = '#00ff00';
            valueDisplay.style.fontWeight = 'bold';
            valueDisplay.style.minWidth = '50px';
            valueDisplay.textContent = input.value;

            input.oninput = () => {
                valueDisplay.textContent = input.value;
            };

            rangeContainer.appendChild(input);
            rangeContainer.appendChild(valueDisplay);
            div.appendChild(rangeContainer);
            return div;
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = defaultValue || '';
            input.style.cssText = `
                width: 100%;
                padding: 10px;
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid #00ffff;
                border-radius: 4px;
                color: #ffffff;
                font-size: 14px;
            `;
        }

        div.appendChild(input);
        return div;
    }

    /**
     * 隐藏控制面板
     */
    hideControlPanel() {
        const panel = document.getElementById('showcase-control-panel');
        panel.style.transform = 'translateX(100%)';
    }

    /**
     * 播放效果
     */
    async onPlayEffect() {
        if (!this.currentEffect) return;

        const params = this.collectParams();
        
        try {
            await window.showcaseEngine.playEffect(this.currentEffect.id, params);
        } catch (error) {
            console.error('播放效果失败:', error);
            alert(`播放效果失败：${error.message}`);
        }
    }

    /**
     * 停止效果
     */
    onStopEffect() {
        if (!this.currentEffect) return;

        window.showcaseEngine.stopEffect(this.currentEffect.id);
    }

    /**
     * 收集参数
     * @returns {Object}
     */
    collectParams() {
        const params = {};
        const paramInputs = document.querySelectorAll('#params-container input');

        for (const input of paramInputs) {
            const label = input.parentElement.previousElementSibling;
            if (label) {
                const key = label.textContent.replace(':', '').trim().toLowerCase();
                params[key] = input.type === 'color' ? input.value : 
                             input.type === 'range' ? parseFloat(input.value) : 
                             input.value;
            }
        }

        return params;
    }

    /**
     * 关闭 UI
     */
    close() {
        if (this.container) {
            this.container.remove();
        }
        if (this.controlPanel) {
            this.controlPanel.remove();
        }
        if (this.previewCanvas) {
            this.previewCanvas.remove();
        }
        this.isInitialized = false;
    }
}

window.ShowcaseUI = ShowcaseUI;
