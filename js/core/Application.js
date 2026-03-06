/* ==========================================
   模块名称：core/Application.js
   功能：核心应用控制器，负责初始化、状态管理、事件调度
   版本：2.0 (模块化重构版)
   ========================================== */

/**
 * 应用主类 - 单例模式
 * 负责整个应用的生命周期管理和状态协调
 */
const Application = (function() {
    // 私有状态
    const state = {
        isBooted: false,
        currentMode: 'simple',
        uptime: 0,
        statsInterval: null,
        audioEnabled: true,
        initialized: false
    };

    // 模块引用
    const modules = {
        ui: null,
        effects: null,
        commands: null,
        audio: null,
        storage: null
    };

    /**
     * 1. 初始化入口
     * 负责加载所有模块并启动应用
     */
    function init() {
        if (state.initialized) return;
        
        console.log("QUANTUM HACK TERMINAL v2.0 Initializing...");
        
        // 注册模块（按依赖顺序）
        registerModules();
        
        // 绑定启动画面事件
        bindBootSequence();
        
        // 预加载资源
        preloadResources();
        
        state.initialized = true;
    }

    /**
     * 注册所有模块
     */
    function registerModules() {
        // UI 模块
        if (typeof UIModule !== 'undefined') {
            modules.ui = UIModule;
            modules.ui.init();
        }
        
        // 特效模块
        if (typeof EffectsEngine !== 'undefined') {
            modules.effects = EffectsEngine;
            modules.effects.init();
        }
        
        // 指令模块
        if (typeof CommandSystem !== 'undefined') {
            modules.commands = CommandSystem;
            modules.commands.init();
        }
        
        // 音效模块
        if (typeof AudioManager !== 'undefined') {
            modules.audio = AudioManager;
            modules.audio.init();
        }
        
        // 存储模块
        if (typeof StorageManager !== 'undefined') {
            modules.storage = StorageManager;
            modules.storage.init();
        }
    }

    /**
     * 绑定启动画面点击事件
     */
    function bindBootSequence() {
        const bootScreen = document.getElementById('boot-sequence');
        if (bootScreen) {
            bootScreen.addEventListener('click', boot);
        }
    }

    /**
     * 预加载资源（音效、图片等）
     */
    function preloadResources() {
        // 预加载音效
        if (modules.audio) {
            modules.audio.preload(['key-press', 'success', 'error', 'glitch']);
        }
    }

    /**
     * 2. 系统启动序列
     */
    function boot() {
        if (state.isBooted) return;
        state.isBooted = true;

        const bootScreen = document.getElementById('boot-sequence');
        const mainContainer = document.getElementById('main-container');
        
        // 隐藏启动画面
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            mainContainer.style.display = 'flex';
            
            // 运行启动日志序列
            runBootSequence(() => {
                // 启动完成后的初始化
                postBootInit();
            });
        }, 1000);
    }

    /**
     * 启动后初始化
     */
    function postBootInit() {
        // 生成按钮
        if (modules.ui) {
            modules.ui.generateButtons();
        }
        
        // 绑定全局事件
        bindGlobalEvents();
        
        // 启动状态更新
        startStats();
        
        // 聚焦输入框
        focusInput();
        
        console.log("System boot complete.");
    }

    /**
     * 运行启动日志序列
     */
    function runBootSequence(callback) {
        const bootLogs = CONFIG.system.bootSequence;
        let i = 0;

        const interval = setInterval(() => {
            if (i < bootLogs.length) {
                addLog(bootLogs[i], 'system');
                i++;
            } else {
                clearInterval(interval);
                addLog("SYSTEM READY.", 'success');
                if (callback) callback();
            }
        }, 300);
    }

    /**
     * 绑定全局事件
     */
    function bindGlobalEvents() {
        // 键盘事件
        document.addEventListener('keydown', handleKeyDown);
        
        // 高级输入框事件
        const input = document.getElementById('advanced-input');
        if (input) {
            input.addEventListener('keydown', handleAdvancedInput);
        }
        
        // 点击页面保持焦点
        document.getElementById('main-container').addEventListener('click', (e) => {
            if (!e.target.closest('.letter-btn') && !e.target.closest('.action-btn')) {
                focusInput();
            }
        });
        
        // 窗口大小变化时调整 Canvas
        window.addEventListener('resize', () => {
            if (modules.effects) {
                modules.effects.resizeCanvas();
            }
        });
    }

    /**
     * 键盘按下事件处理
     */
    function handleKeyDown(e) {
        const key = e.key.toUpperCase();
        
        // 字母键 A-Z
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
            // 如果焦点在输入框则不拦截
            if (document.activeElement.id === 'advanced-input') return;
            
            executeCommand('letter', key);
        }
    }

    /**
     * 高级输入框事件处理
     */
    function handleAdvancedInput(e) {
        if (e.key === 'Enter') {
            const value = e.target.value.trim();
            if (value) {
                executeCommand('number', value);
                e.target.value = '';
                e.target.blur();
                setTimeout(() => focusInput(), 100);
            }
        }
    }

    /**
     * 执行指令的统一入口
     * @param {string} type - 指令类型：'letter' | 'number' | 'custom'
     * @param {any} value - 指令值
     */
    function executeCommand(type, value) {
        // 播放音效
        if (modules.audio) {
            modules.audio.play('key-press');
        }
        
        // 执行对应类型的指令
        if (modules.commands) {
            modules.commands.execute(type, value);
        }
        
        // UI 反馈
        if (modules.ui) {
            modules.ui.highlightButton(value);
        }
        
        // 跟踪任务进度
        if (type === 'letter' && window.QuestSystem) {
            QuestSystem.trackCommand(value);
        }
    }

    /**
     * 执行字母指令
     */
    function executeLetterCommand(letter) {
        executeCommand('letter', letter);
    }

    /**
     * 执行数字指令
     */
    function executeNumberCommand(value) {
        executeCommand('number', value);
    }

    /**
     * 添加日志（代理到 UI 模块）
     */
    function addLog(text, type = 'info') {
        if (modules.ui) {
            modules.ui.addLog(text, type);
        }
    }

    /**
     * 高亮按钮（代理到 UI 模块）
     */
    function highlightButton(key) {
        if (modules.ui) {
            modules.ui.highlightButton(key);
        }
    }

    /**
     * 聚焦输入框
     */
    function focusInput() {
        const input = document.getElementById('advanced-input');
        if (input) {
            input.focus();
        }
    }

    /**
     * 启动状态栏更新
     */
    function startStats() {
        // 更新时间
        setInterval(() => {
            const timeEl = document.getElementById('current-time');
            if (timeEl) {
                timeEl.innerText = new Date().toLocaleTimeString('en-US', {hour12: false});
            }
        }, 1000);

        // 更新运行时间
        setInterval(() => {
            state.uptime++;
            const h = Math.floor(state.uptime / 3600);
            const m = Math.floor((state.uptime % 3600) / 60);
            const s = state.uptime % 60;
            const uptimeEl = document.getElementById('uptime');
            if (uptimeEl) {
                uptimeEl.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);

        // 模拟 CPU/内存波动
        setInterval(() => {
            const cpuEl = document.getElementById('cpu-usage');
            const memEl = document.getElementById('mem-usage');
            const latencyEl = document.getElementById('latency');
            const packetEl = document.getElementById('packet-count');
            
            if (cpuEl) cpuEl.innerText = `${Math.floor(Math.random() * 30 + 10)}%`;
            if (memEl) memEl.innerText = `${(Math.random() * 2 + 2.5).toFixed(1)}GB`;
            if (latencyEl) latencyEl.innerText = `${Math.floor(Math.random() * 50 + 10)}ms`;
            if (packetEl) packetEl.innerText = Math.floor(Math.random() * 1000);
        }, 2000);
    }

    /**
     * 获取模块引用
     */
    function getModule(name) {
        return modules[name] || null;
    }

    /**
     * 获取应用状态
     */
    function getState() {
        return { ...state };
    }

    /**
     * 切换音效开关
     */
    function toggleAudio(enabled) {
        state.audioEnabled = enabled;
        if (modules.audio) {
            modules.audio.setEnabled(enabled);
        }
    }

    // 公开 API
    return {
        init,
        boot,
        executeCommand,
        executeLetterCommand,
        executeNumberCommand,
        addLog,
        highlightButton,
        focusInput,
        getModule,
        getState,
        toggleAudio
    };
})();

// 导出到全局作用域
window.Application = Application;
