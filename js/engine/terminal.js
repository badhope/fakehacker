class TerminalEngine {
    constructor(outputElement, inputElement) {
        this.output = outputElement;
        this.input = inputElement;
        this.history = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(e) {
        // 播放键盘音效
        try { document.getElementById('audio-keypress').cloneNode(true).play(); } catch(e) {}
        
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim();
            this.input.value = '';
            if (cmd) {
                this.history.push(cmd);
                this.historyIndex = this.history.length;
                this.execute(cmd);
            }
        } else if (e.key === 'ArrowUp') {
            // 历史命令向上
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            // 历史命令向下
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.input.value = '';
            }
            e.preventDefault();
        }
    }

    execute(cmd) {
        this.print(`root@system:~$ ${cmd}`, 'info'); // 打印用户输入
        
        // 简单的命令解析
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // 这里我们将调用在 app.js 或其他模块中定义的全局命令函数
        if (typeof Commands !== 'undefined' && Commands[command]) {
            Commands[command](args, this);
        } else {
            this.print(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }
        
        this.scrollToBottom();
    }

    print(text, type = 'normal') {
        const div = document.createElement('div');
        div.className = `line ${type}`;
        div.innerText = text;
        this.output.appendChild(div);
        
        // 限制行数，防止卡顿
        if (this.output.childNodes.length > 200) {
            this.output.removeChild(this.output.childNodes[0]);
        }
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    clear() {
        this.output.innerHTML = '';
    }
}
