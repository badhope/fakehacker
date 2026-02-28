/* ==========================================
   文件名：js/app.js
   功能：主控制器，负责初始化、事件绑定、调度
   ========================================== */

// --- 主应用对象 ---
const App = {
    // 系统状态
    state: {
        isBooted: false,
        currentMode: 'simple', // simple 或 advanced
        uptime: 0,
        statsInterval: null,
        audioEnabled: true
    },

    // --- 1. 初始化入口 ---
    init: function() {
        console.log("System initializing...");
        
        // 绑定启动画面点击事件
        const bootScreen = document.getElementById('boot-sequence');
        bootScreen.addEventListener('click', () => this.boot());
        
        // 预加载音效（可选）
        this.preloadAudio();
    },

    // --- 2. 系统启动序列 ---
    boot: function() {
        if (this.state.isBooted) return;
        this.state.isBooted = true;

        const bootScreen = document.getElementById('boot-sequence');
        const mainContainer = document.getElementById('main-container');
        
        // 隐藏启动画面
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            mainContainer.style.display = 'flex';
            
            // 显示启动日志
            this.runBootSequence(() => {
                // 启动完成后的初始化
                this.generateButtons(); // 生成26个字母按钮
                this.bindEvents();      // 绑定键盘和输入事件
                this.startStats();      // 启动状态更新
                this.focusInput();      // 聚焦输入框
            });
        }, 1000);
    },

    // 运行启动动画日志
    runBootSequence: function(callback) {
        const logContainer = document.getElementById('log-container');
        const bootLogs = CONFIG.system.bootSequence;
        let i = 0;

        const interval = setInterval(() => {
            if (i < bootLogs.length) {
                this.addLog(bootLogs[i], 'system');
                i++;
            } else {
                clearInterval(interval);
                this.addLog("SYSTEM READY.", 'success');
                if (callback) callback();
            }
        }, 300);
    },

    // --- 3. 生成26个字母按钮 ---
    generateButtons: function() {
        const grid = document.getElementById('buttons-grid');
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        grid.innerHTML = ''; // 清空现有内容

        for (let letter of letters) {
            const cmdConfig = CONFIG.letterCommands[letter];
            
            // 创建按钮元素
            const btn = document.createElement('button');
            btn.className = `letter-btn`;
            btn.dataset.key = letter; // 存储键值
            btn.dataset.type = cmdConfig.type; // 存储类型用于着色
            
            // 按钮内容
            btn.innerHTML = `
                <span class="key">${letter}</span>
                <span class="desc">${cmdConfig.name}</span>
            `;

            // 绑定点击事件
            btn.addEventListener('click', () => {
                this.playSound('key-press'); // 播放音效
                this.executeLetterCommand(letter);
                this.addButtonEffect(btn); // 添加视觉反馈
            });

            grid.appendChild(btn);
        }
    },

    // --- 4. 绑定全局事件 ---
    bindEvents: function() {
        // 键盘按下事件 (简单玩法)
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            
            // 如果是字母键 A-Z
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                // 检查是否焦点在输入框，如果是则不拦截
                if (document.activeElement.id === 'advanced-input') return;
                
                this.executeLetterCommand(key);
                this.highlightButton(key); // 高亮对应按钮
                this.playSound('key-press');
            }
        });

        // 高级输入框事件 (高级玩法)
        const input = document.getElementById('advanced-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value) {
                    this.executeNumberCommand(value);
                    input.value = ''; // 清空输入
                    input.blur(); // 失去焦点以便键盘快捷键继续工作
                    setTimeout(() => this.focusInput(), 100); // 短暂延迟后重新聚焦
                }
            }
        });

        // 点击页面任意位置保持输入框焦点
        document.getElementById('main-container').addEventListener('click', (e) => {
            // 如果点击的不是按钮
            if (!e.target.closest('.letter-btn') && !e.target.closest('.action-btn')) {
                this.focusInput();
            }
        });
    },

    // --- 5. 指令执行逻辑 ---

    // 执行字母指令 (简单玩法)
    executeLetterCommand: function(letter) {
        const cmdConfig = CONFIG.letterCommands[letter];
        if (!cmdConfig) return;

        // 1. 显示日志
        this.addLog(`Executing command: ${cmdConfig.name} [${letter}]`, 'info');
        
        // 2. 随机显示该功能的日志消息
        if (cmdConfig.logMessages && cmdConfig.logMessages.length > 0) {
            const msg = cmdConfig.logMessages[Math.floor(Math.random() * cmdConfig.logMessages.length)];
            // 模拟打字延迟
            setTimeout(() => this.addLog(msg, 'warning'), 200);
        }

        // 3. 触发具体功能 (如果存在)
        // 功能定义在 simple-commands.js 中
        if (typeof SimpleCommands !== 'undefined' && SimpleCommands[cmdConfig.action]) {
            setTimeout(() => {
                SimpleCommands[cmdConfig.action](cmdConfig);
            }, 500);
        }
    },

    // 执行数字指令 (高级玩法)
    executeNumberCommand: function(value) {
        const num = value.trim();
        const cmdConfig = CONFIG.numberCommands[num];

        if (cmdConfig) {
            this.addLog(`ADVANCED MODE: Initiating ${cmdConfig.name}`, 'system');
            
            // 执行序列
            let delay = 0;
            cmdConfig.sequence.forEach(letter => {
                setTimeout(() => {
                    this.executeLetterCommand(letter);
                    this.highlightButton(letter);
                }, delay);
                delay += 800; // 每个动作间隔0.8秒
            });

            // 序列结束后的消息
            setTimeout(() => {
                this.addLog(cmdConfig.finalMessage, 'success');
                // 执行最终动作（如自毁）
                if (cmdConfig.finalAction) {
                    cmdConfig.finalAction();
                }
            }, delay + 500);

        } else {
            this.addLog(`ERROR: Invalid code sequence '${num}'`, 'error');
            document.getElementById('advanced-input').classList.add('shake');
            setTimeout(() => {
                document.getElementById('advanced-input').classList.remove('shake');
            }, 500);
        }
    },

    // --- 6. UI 辅助功能 ---

    // 添加日志
    addLog: function(text, type = 'info') {
        const container = document.getElementById('log-container');
        const line = document.createElement('div');
        line.className = `log-entry ${type}`;
        line.innerText = `> ${text}`;
        
        container.appendChild(line);
        
        // 自动滚动到底部
        container.scrollTop = container.scrollHeight;
        
        // 限制行数
        while (container.childNodes.length > 100) {
            container.removeChild(container.childNodes[0]);
        }
    },

    // 高亮按钮
    highlightButton: function(key) {
        const btn = document.querySelector(`.letter-btn[data-key="${key}"]`);
        if (btn) {
            this.addButtonEffect(btn);
        }
    },

    // 添加按钮点击效果
    addButtonEffect: function(btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    },

    // 聚焦输入框
    focusInput: function() {
        document.getElementById('advanced-input').focus();
    },

    // --- 7. 状态栏更新 ---
    startStats: function() {
        // 更新时间
        setInterval(() => {
            document.getElementById('current-time').innerText = new Date().toLocaleTimeString('en-US', {hour12: false});
        }, 1000);

        // 更新运行时间
        setInterval(() => {
            this.state.uptime++;
            const h = Math.floor(this.state.uptime / 3600);
            const m = Math.floor((this.state.uptime % 3600) / 60);
            const s = this.state.uptime % 60;
            document.getElementById('uptime').innerText = 
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }, 1000);

        // 模拟CPU/内存波动
        setInterval(() => {
            document.getElementById('cpu-usage').innerText = `${Math.floor(Math.random() * 30 + 10)}%`;
            document.getElementById('mem-usage').innerText = `${(Math.random() * 2 + 2.5).toFixed(1)}GB`;
            document.getElementById('latency').innerText = `${Math.floor(Math.random() * 50 + 10)}ms`;
            document.getElementById('packet-count').innerText = Math.floor(Math.random() * 1000);
        }, 2000);
    },

    // --- 8. 音效处理 ---
    preloadAudio: function() {
        // 这里可以预加载音频文件
        // 目前使用Web Audio API生成简单的蜂鸣声
    },

    playSound: function(type) {
        if (!this.state.audioEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'square';
            oscillator.frequency.value = 440; // A4音符
            gainNode.gain.value = 0.05; // 音量

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05); // 短促的滴声
        } catch (e) {
            // 忽略音频错误
        }
    }
};

// --- 页面加载完成后初始化 ---
window.onload = () => App.init();
