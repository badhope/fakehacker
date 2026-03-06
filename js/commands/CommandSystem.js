/* ==========================================
   模块名称：commands/CommandSystem.js
   功能：指令系统中枢，协调字母指令、数字指令的执行
   版本：2.0 (模块化重构版)
   ========================================== */

/**
 * 指令系统 - 统一管理所有命令的执行
 */
const CommandSystem = (function() {
    // 指令执行队列
    const executionQueue = [];
    let isExecuting = false;

    /**
     * 初始化指令系统
     */
    function init() {
        console.log("CommandSystem initialized");
    }

    /**
     * 执行指令的统一入口
     * @param {string} type - 指令类型：'letter' | 'number' | 'custom'
     * @param {any} value - 指令值
     */
    function execute(type, value) {
        switch(type) {
            case 'letter':
                executeLetterCommand(value);
                break;
            case 'number':
                executeNumberCommand(value);
                break;
            case 'custom':
                executeCustomCommand(value);
                break;
            default:
                if (Application) Application.addLog(`Unknown command type: ${type}`, 'error');
        }
    }

    /**
     * 执行字母指令
     */
    function executeLetterCommand(letter) {
        const cmdConfig = CONFIG.letterCommands[letter];
        if (!cmdConfig) {
            if (Application) Application.addLog(`Unknown command: ${letter}`, 'error');
            return;
        }

        // 1. 显示日志
        if (Application) {
            Application.addLog(`Executing command: ${cmdConfig.name} [${letter}]`, 'info');
        }
        
        // 2. 随机显示该功能的日志消息
        if (cmdConfig.logMessages && cmdConfig.logMessages.length > 0) {
            const msg = cmdConfig.logMessages[Math.floor(Math.random() * cmdConfig.logMessages.length)];
            setTimeout(() => {
                if (Application) Application.addLog(msg, 'warning');
            }, 200);
        }

        // 3. 触发具体功能
        if (cmdConfig.action) {
            setTimeout(() => {
                const commandFunc = getCommandFunction(cmdConfig.action);
                if (commandFunc) {
                    commandFunc(cmdConfig);
                } else {
                    if (Application) Application.addLog(`Command function not found: ${cmdConfig.action}`, 'error');
                }
            }, 500);
        }
    }

    /**
     * 执行数字指令（高级玩法）
     */
    function executeNumberCommand(value) {
        const num = value.trim();
        const cmdConfig = CONFIG.numberCommands[num];

        if (cmdConfig) {
            if (Application) {
                Application.addLog(`ADVANCED MODE: Initiating ${cmdConfig.name}`, 'system');
            }
            
            // 执行序列
            let delay = 0;
            cmdConfig.sequence.forEach(letter => {
                setTimeout(() => {
                    executeLetterCommand(letter);
                    if (Application) Application.highlightButton(letter);
                }, delay);
                delay += 800; // 每个动作间隔 0.8 秒
            });

            // 序列结束后的消息
            setTimeout(() => {
                if (Application) Application.addLog(cmdConfig.finalMessage, 'success');
                // 执行最终动作
                if (cmdConfig.finalAction) {
                    cmdConfig.finalAction();
                }
            }, delay + 500);

        } else {
            if (Application) {
                Application.addLog(`ERROR: Invalid code sequence '${num}'`, 'error');
            }
            // 输入框震动效果
            const input = document.getElementById('advanced-input');
            if (input) {
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        }
    }

    /**
     * 执行自定义指令
     */
    function executeCustomCommand(config) {
        if (typeof config === 'function') {
            config();
        } else if (config.action) {
            const commandFunc = getCommandFunction(config.action);
            if (commandFunc) {
                commandFunc(config);
            }
        }
    }

    /**
     * 获取指令函数
     */
    function getCommandFunction(actionName) {
        // 从 LetterCommands 中查找
        if (LetterCommands && LetterCommands[actionName]) {
            return LetterCommands[actionName];
        }
        
        // 从全局作用域查找
        if (window[actionName]) {
            return window[actionName];
        }
        
        return null;
    }

    /**
     * 将指令加入执行队列
     */
    function queueCommand(type, value, delay = 0) {
        executionQueue.push({
            type,
            value,
            delay,
            executeAt: Date.now() + delay
        });
        
        if (!isExecuting) {
            processQueue();
        }
    }

    /**
     * 处理指令队列
     */
    function processQueue() {
        if (executionQueue.length === 0) {
            isExecuting = false;
            return;
        }
        
        isExecuting = true;
        const now = Date.now();
        const nextCommand = executionQueue.find(cmd => cmd.executeAt <= now);
        
        if (nextCommand) {
            executionQueue.shift();
            execute(nextCommand.type, nextCommand.value);
            setTimeout(() => processQueue(), 100);
        } else {
            setTimeout(() => processQueue(), 50);
        }
    }

    /**
     * 清空指令队列
     */
    function clearQueue() {
        executionQueue.length = 0;
        isExecuting = false;
    }

    /**
     * 获取队列状态
     */
    function getQueueStatus() {
        return {
            length: executionQueue.length,
            isExecuting
        };
    }

    /**
     * 注册新的指令函数
     */
    function registerCommand(name, func) {
        if (!LetterCommands) {
            window.LetterCommands = {};
        }
        LetterCommands[name] = func;
        console.log(`Command registered: ${name}`);
    }

    // 公开 API
    return {
        init,
        execute,
        executeLetterCommand,
        executeNumberCommand,
        executeCustomCommand,
        queueCommand,
        clearQueue,
        getQueueStatus,
        registerCommand
    };
})();

// 导出到全局作用域
window.CommandSystem = CommandSystem;
