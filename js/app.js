// 全局命令对象，将在 app.js 中扩展
const Commands = {};

const App = {
    isBooted: false,
    
    // 启动函数
    boot: function() {
        if (this.isBooted) return;
        this.isBooted = true;

        const bootScreen = document.getElementById('boot-sequence');
        const desktop = document.getElementById('desktop');
        const scanlines = document.getElementById('scanlines');

        // 播放启动音效逻辑可在此添加
        
        // 淡出启动屏
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            desktop.style.display = 'block';
            scanlines.style.display = 'block'; // 开启扫描线
            
            this.initTerminal();
            this.runBootSequence();
        }, 500);
    },

    initTerminal: function() {
        const output = document.getElementById('terminal-output');
        const input = document.getElementById('terminal-input');
        
        // 初始化终端引擎
        window.terminal = new TerminalEngine(output, input);
        
        // 注册基础命令
        this.registerCommands();
    },

    runBootSequence: function() {
        terminal.print("SYSTEM BOOT SEQUENCE INITIATED...", 'warning');
        let count = 0;
        const bootInterval = setInterval(() => {
            terminal.print(CONFIG.logs[Math.floor(Math.random() * CONFIG.logs.length)]);
            count++;
            if (count > 10) {
                clearInterval(bootInterval);
                terminal.print("SYSTEM READY. TYPE 'HELP' FOR COMMANDS.", 'success');
            }
            terminal.scrollToBottom();
        }, 100);
    },

    registerCommands: function() {
        // Help 命令
        Commands.help = function() {
            terminal.print("Available Commands:", 'info');
            terminal.print("  help      - Display this help message");
            terminal.print("  clear     - Clear the terminal screen");
            terminal.print("  hack [ip] - Begin hacking sequence on target IP");
            terminal.print("  scan      - Launch network port scanner");
            terminal.print("  theme     - Change UI theme (matrix/cyberpunk)");
            terminal.print("  matrix    - The legendary code rain");
            terminal.print("  about     - About this system");
        };

        // Clear 命令
        Commands.clear = function() {
            terminal.clear();
        };

        // Hack 命令 (恶搞核心)
        Commands.hack = function(args) {
            const target = args[0] || "127.0.0.1";
            terminal.print(`INITIATING HACK SEQUENCE ON: ${target}`, 'warning');
            terminal.print("Bypassing firewall...", 'info');
            
            let progress = 0;
            const hackInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5;
                if (progress >= 100) {
                    clearInterval(hackInterval);
                    terminal.print("ACCESS GRANTED.", 'success');
                    // 随机返回一个恶搞结果
                    terminal.print(CONFIG.hackResults[Math.floor(Math.random() * CONFIG.hackResults.length)], 'warning');
                    
                    // 触发一个屏幕特效
                    App.effects.flash();
                } else {
                    terminal.print(`Decryption progress: ${progress}%`);
                }
            }, 150);
        };

        // Matrix 代码雨命令
        Commands.matrix = function() {
            App.effects.matrix();
            terminal.print("Launching Matrix sequence...", 'info');
        };

        // Theme 切换命令
        Commands.theme = function(args) {
            const theme = args[0] || 'matrix';
            if (theme === 'cyberpunk') {
                document.documentElement.style.setProperty('--main-color', '#ff00ff');
                document.documentElement.style.setProperty('--accent-color', '#00ffff');
                terminal.print("Theme changed to CYBERPUNK.", 'success');
            } else {
                document.documentElement.style.setProperty('--main-color', '#00ff00');
                document.documentElement.style.setProperty('--accent-color', '#00ffff');
                terminal.print("Theme changed to MATRIX (Default).", 'success');
            }
        };

        // About 命令
        Commands.about = function() {
            terminal.print("SYSTEM: " + CONFIG.systemName + " v" + CONFIG.version, 'info');
            terminal.print("STATUS: FULLY OPERATIONAL", 'success');
            terminal.print("CREATOR: BADHOPE (Enhanced by AI)", 'info');
        };
    },

    // 特效模块
    effects: {
        flash: function() {
            const flash = document.createElement('div');
            flash.className = 'flash-overlay';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
        },
        
        matrix: function() {
            const canvas = document.getElementById('effect-layer');
            const ctx = canvas.getContext('2d');
            canvas.style.display = 'block';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const columns = Math.floor(canvas.width / 20);
            const drops = Array(columns).fill(1);
            const chars = "ABCDEF0123456789@#$%";
            
            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#0F0'; // 绿色
                ctx.font = '20px monospace';
                
                for(let i=0; i<drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i*20, drops[i]*20);
                    
                    if(drops[i]*20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            };
            
            const matrixAnim = setInterval(draw, 33);
            // 5秒后自动关闭
            setTimeout(() => {
                clearInterval(matrixAnim);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
            }, 5000);
        }
    }
};
