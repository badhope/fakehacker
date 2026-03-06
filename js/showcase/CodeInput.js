/**
 * 代码输入交互系统
 * 允许用户输入代码并触发对应效果
 * @module CodeInput
 */

class CodeInput {
    constructor() {
        this.container = null;
        this.editor = null;
        this.output = null;
        this.history = [];
        this.historyIndex = -1;
        this.suggestions = [];
        this.onCodeExecute = null;
        this.isExpanded = false;
    }

    /**
     * 初始化代码输入
     * @returns {Promise<CodeInput>}
     */
    async init() {
        this.createContainer();
        this.createEditor();
        this.createOutput();
        this.bindEvents();
        
        console.log('[CodeInput] 初始化完成');
        return this;
    }

    /**
     * 创建容器
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 600px;
            max-width: calc(100vw - 40px);
            background: rgba(10, 10, 30, 0.95);
            border: 2px solid #00ffff;
            border-radius: 8px;
            z-index: 9500;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(this.container);
    }

    /**
     * 创建编辑器
     */
    createEditor() {
        const editorContainer = document.createElement('div');
        editorContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;

        header.innerHTML = `
            <h3 style="color: #00ffff; margin: 0; font-size: 18px;">
                💻 代码输入
            </h3>
            <div style="display: flex; gap: 10px;">
                <button id="clear-btn" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">清空</button>
                <button id="history-btn" style="
                    background: #00ff00;
                    color: black;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">历史</button>
            </div>
        `;

        this.editor = document.createElement('textarea');
        this.editor.style.cssText = `
            width: 100%;
            min-height: 200px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff00;
            border-radius: 4px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            padding: 15px;
            resize: vertical;
            outline: none;
            line-height: 1.5;
        `;

        this.editor.placeholder = `// 输入代码或效果指令
// 示例:
// play('matrix_rain')
// play('particle_explosion', { particleCount: 200 })
// combo('cyber_attack')

// 支持的效果:
${this.getAvailableEffectsComment()}`;

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        `;

        controls.innerHTML = `
            <button id="execute-btn" style="
                background: linear-gradient(45deg, #00ff00, #00ffff);
                color: black;
                border: none;
                padding: 12px 30px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
            ">▶ 执行 (Ctrl+Enter)</button>
        `;

        editorContainer.appendChild(header);
        editorContainer.appendChild(this.editor);
        editorContainer.appendChild(controls);
        this.container.appendChild(editorContainer);

        this.bindEditorButtons();
    }

    /**
     * 获取可用效果注释
     * @returns {string}
     */
    getAvailableEffectsComment() {
        if (!window.showcaseEngine) return '// 效果引擎未加载';
        
        const effects = showcaseEngine.getAllEffects();
        return effects.slice(0, 5).map(effect => 
            `// - ${effect.id}: ${effect.name}`
        ).join('\n');
    }

    /**
     * 绑定编辑器按钮
     */
    bindEditorButtons() {
        document.getElementById('clear-btn').onclick = () => {
            this.editor.value = '';
            this.editor.focus();
        };

        document.getElementById('history-btn').onclick = () => {
            this.toggleHistory();
        };

        document.getElementById('execute-btn').onclick = () => {
            this.execute();
        };
    }

    /**
     * 创建输出区域
     */
    createOutput() {
        this.output = document.createElement('div');
        this.output.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.9);
            border-top: 1px solid #00ff00;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #00ff00;
            display: none;
        `;

        this.container.appendChild(this.output);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.execute();
            }

            if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.editor.value = this.history[this.historyIndex];
                }
            }

            if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.editor.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.editor.value = '';
                }
            }
        });

        this.editor.addEventListener('input', () => {
            this.showSuggestions();
        });
    }

    /**
     * 执行代码
     */
    async execute() {
        const code = this.editor.value.trim();
        if (!code) return;

        this.addToHistory(code);
        this.showOutput(`> ${code}`, 'command');

        try {
            const result = await this.parseAndExecute(code);
            this.showOutput(`✓ 执行成功`, 'success');
            
            if (result) {
                this.showOutput(JSON.stringify(result, null, 2), 'result');
            }

            if (this.onCodeExecute) {
                this.onCodeExecute(code, result);
            }
        } catch (error) {
            this.showOutput(`✗ 错误：${error.message}`, 'error');
        }
    }

    /**
     * 解析并执行代码
     * @param {string} code - 代码
     * @returns {Promise<any>}
     */
    async parseAndExecute(code) {
        const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
        const results = [];

        for (const line of lines) {
            const result = await this.executeLine(line.trim());
            if (result !== undefined) {
                results.push(result);
            }
        }

        return results.length > 0 ? results : null;
    }

    /**
     * 执行单行代码
     * @param {string} line - 代码行
     * @returns {Promise<any>}
     */
    async executeLine(line) {
        const playMatch = line.match(/play\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*(.+))?\s*\)/);
        const comboMatch = line.match(/combo\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        const stopMatch = line.match(/stop\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        const stopAllMatch = line.match(/stopAll\s*\(\s*\)/);

        if (playMatch) {
            const effectId = playMatch[1];
            const paramsStr = playMatch[2];
            const params = paramsStr ? JSON.parse(`{${paramsStr}}`) : {};
            
            if (window.showcaseEngine) {
                return await showcaseEngine.playEffect(effectId, params);
            }
        }

        if (comboMatch) {
            const comboId = comboMatch[1];
            if (window.showcaseEngine) {
                return await showcaseEngine.playCombo(comboId);
            }
        }

        if (stopMatch) {
            const effectId = stopMatch[1];
            if (window.showcaseEngine) {
                return showcaseEngine.stopEffect(effectId);
            }
        }

        if (stopAllMatch) {
            if (window.showcaseEngine) {
                return showcaseEngine.stopAllEffects();
            }
        }

        throw new Error(`未知命令：${line}`);
    }

    /**
     * 添加到历史
     * @param {string} code - 代码
     */
    addToHistory(code) {
        this.history.push(code);
        this.historyIndex = this.history.length;
        
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    /**
     * 显示输出
     * @param {string} message - 消息
     * @param {string} type - 类型 (command, success, error, result)
     */
    showOutput(message, type = 'info') {
        this.output.style.display = 'block';

        const colors = {
            command: '#00ffff',
            success: '#00ff00',
            error: '#ff4444',
            result: '#ffff00',
            info: '#00ff00'
        };

        const line = document.createElement('div');
        line.style.color = colors[type] || colors.info;
        line.style.marginBottom = '5px';
        line.style.whiteSpace = 'pre-wrap';
        line.textContent = message;

        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;

        setTimeout(() => {
            if (this.output.children.length > 20) {
                this.output.removeChild(this.output.firstChild);
            }
        }, 5000);
    }

    /**
     * 切换历史记录
     */
    toggleHistory() {
        if (this.history.length === 0) {
            alert('暂无历史记录');
            return;
        }

        const historyText = this.history.map((code, index) => 
            `${index + 1}. ${code.split('\n')[0].substring(0, 50)}...`
        ).join('\n');

        alert(`历史记录:\n\n${historyText}`);
    }

    /**
     * 显示建议
     */
    showSuggestions() {
        // TODO: 实现代码补全建议
    }

    /**
     * 展开/收起
     */
    toggle() {
        this.isExpanded = !this.isExpanded;
        this.container.style.display = this.isExpanded ? 'block' : 'none';
    }

    /**
     * 显示
     */
    show() {
        this.container.style.display = 'block';
        this.isExpanded = true;
    }

    /**
     * 隐藏
     */
    hide() {
        this.container.style.display = 'none';
        this.isExpanded = false;
    }

    /**
     * 销毁
     */
    destroy() {
        this.container.remove();
        console.log('[CodeInput] 已销毁');
    }
}

window.CodeInput = CodeInput;
