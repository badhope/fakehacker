/* ==========================================
   模块名称：ui/QuickActions.js
   功能：快速行动按钮功能实现
   版本：2.0 - 增强交互体验
   ========================================== */

/**
 * 快速行动模块 - 处理右侧控制面板的快速操作按钮
 */
const QuickActions = (function() {
    // 行动配置
    const actions = {
        'panic': {
            name: 'PANIC BUTTON',
            description: 'Emergency system lockdown',
            action: triggerPanic
        },
        'glitch': {
            name: 'GLITCH MODE',
            description: 'Activate visual glitches',
            action: triggerGlitchMode
        },
        'reboot': {
            name: 'REBOOT SYSTEM',
            description: 'Restart the terminal',
            action: triggerReboot
        },
        'fullscreen': {
            name: 'FULLSCREEN',
            description: 'Toggle fullscreen mode',
            action: toggleFullscreen
        },
        'clear': {
            name: 'CLEAR LOGS',
            description: 'Clear terminal logs',
            action: clearLogs
        },
        'matrix': {
            name: 'MATRIX MODE',
            description: 'Activate matrix rain',
            action: triggerMatrixMode
        },
        'theme': {
            name: 'CHANGE THEME',
            description: 'Switch to next theme',
            action: changeTheme
        },
        'audio': {
            name: 'TOGGLE AUDIO',
            description: 'Enable/disable sound',
            action: toggleAudio
        }
    };

    /**
     * 初始化快速行动模块
     */
    function init() {
        bindActionButtons();
        console.log("QuickActions initialized");
    }

    /**
     * 绑定行动按钮事件
     */
    function bindActionButtons() {
        // 为已有的按钮绑定事件
        const buttons = document.querySelectorAll('#quick-actions .action-btn');
        buttons.forEach(btn => {
            const actionName = btn.getAttribute('onclick')?.match(/triggerAction\('([^']+)'\)/)?.[1];
            if (actionName && actions[actionName]) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    executeAction(actionName);
                });
            }
        });
        
        // 添加额外的快速行动按钮
        addExtraActionButtons();
    }

    /**
     * 添加额外的快速行动按钮
     */
    function addExtraActionButtons() {
        const container = document.getElementById('quick-actions');
        if (!container) return;
        
        // 添加全屏按钮
        if (!container.querySelector('[data-action="fullscreen"]')) {
            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.className = 'action-btn';
            fullscreenBtn.dataset.action = 'fullscreen';
            fullscreenBtn.innerText = 'FULLSCREEN';
            fullscreenBtn.addEventListener('click', () => executeAction('fullscreen'));
            container.appendChild(fullscreenBtn);
        }
        
        // 添加清除日志按钮
        if (!container.querySelector('[data-action="clear"]')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'action-btn';
            clearBtn.dataset.action = 'clear';
            clearBtn.innerText = 'CLEAR LOGS';
            clearBtn.addEventListener('click', () => executeAction('clear'));
            container.appendChild(clearBtn);
        }
        
        // 添加矩阵模式按钮
        if (!container.querySelector('[data-action="matrix"]')) {
            const matrixBtn = document.createElement('button');
            matrixBtn.className = 'action-btn';
            matrixBtn.dataset.action = 'matrix';
            matrixBtn.innerText = 'MATRIX MODE';
            matrixBtn.addEventListener('click', () => executeAction('matrix'));
            container.appendChild(matrixBtn);
        }
    }

    /**
     * 执行行动（全局函数，兼容旧版 HTML）
     */
    function triggerAction(actionName) {
        executeAction(actionName);
    }

    /**
     * 执行行动的統一入口
     */
    function executeAction(actionName) {
        const action = actions[actionName];
        if (!action) {
            console.warn(`Action not found: ${actionName}`);
            return;
        }
        
        if (Application) {
            Application.addLog(`Executing: ${action.name}`, 'warning');
        }
        
        action.action();
    }

    // ==================== 具体行动实现 ====================
    
    /**
     * 紧急恐慌按钮
     */
    function triggerPanic() {
        if (window.EffectsEngine) {
            EffectsEngine.flashScreen('#ff0000');
            EffectsEngine.triggerGlitch(1000);
        }
        
        if (Application) {
            Application.addLog("PANIC BUTTON PRESSED!", 'error');
            Application.addLog("INITIATING EMERGENCY PROTOCOLS...", 'error');
            Application.addLog("DELETING SENSITIVE DATA...", 'error');
        }
        
        // 播放警报音效
        if (window.AudioManager) {
            AudioManager.play('error');
            setTimeout(() => AudioManager.play('error'), 300);
            setTimeout(() => AudioManager.play('error'), 600);
        }
    }

    /**
     * 触发故障模式
     */
    function triggerGlitchMode() {
        if (window.EffectsEngine) {
            EffectsEngine.triggerGlitch(2000);
            EffectsEngine.flashScreen('#00ffff');
        }
        
        if (Application) {
            Application.addLog("GLITCH MODE ACTIVATED", 'warning');
        }
        
        // 播放故障音效
        if (window.AudioManager) {
            AudioManager.play('glitch');
        }
    }

    /**
     * 重启系统
     */
    function triggerReboot() {
        if (Application) {
            Application.addLog("SYSTEM REBOOT INITIATED...", 'system');
        }
        
        setTimeout(() => {
            location.reload();
        }, 1500);
    }

    /**
     * 切换全屏模式
     */
    function toggleFullscreen() {
        if (UIModule) {
            UIModule.toggleFullscreen();
        }
    }

    /**
     * 清除日志
     */
    function clearLogs() {
        if (UIModule) {
            UIModule.clearLogs();
        }
    }

    /**
     * 触发矩阵模式
     */
    function triggerMatrixMode() {
        if (window.EffectsEngine) {
            EffectsEngine.triggerMatrix();
        }
    }

    /**
     * 切换主题
     */
    function changeTheme() {
        if (window.ThemeManager) {
            ThemeManager.nextTheme();
        }
    }

    /**
     * 切换音效
     */
    function toggleAudio() {
        if (window.AudioManager) {
            const isEnabled = AudioManager.toggle();
            if (Application) {
                Application.addLog(`Audio ${isEnabled ? 'ENABLED' : 'DISABLED'}`, 'info');
            }
        }
    }

    /**
     * 注册自定义行动
     */
    function registerAction(name, config) {
        actions[name] = config;
        console.log(`Action registered: ${name}`);
    }

    // 公开 API
    return {
        init,
        triggerAction,
        executeAction,
        registerAction
    };
})();

// 导出到全局作用域
window.QuickActions = QuickActions;

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuickActions.init());
} else {
    QuickActions.init();
}
