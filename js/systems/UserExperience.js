/* ==========================================
   模块名称：systems/UserExperience.js
   功能：用户体验优化系统，简化操作、智能提示
   版本：3.0 - 极致易用性
   ========================================== */

/**
 * 用户体验优化系统
 * 目标：让零基础用户也能轻松上手
 */
const UserExperience = (function() {
    // 配置选项
    const config = {
        showTooltips: true,
        autoHints: true,
        simplifiedMode: true,
        soundEffects: true,
        visualFeedback: true
    };

    // 用户行为统计
    const userStats = {
        commandsExecuted: 0,
        errorsEncountered: 0,
        timeSpent: 0,
        favoriteCommands: []
    };

    /**
     * 初始化用户体验系统
     */
    function init() {
        loadUserPreferences();
        setupSmartHints();
        optimizeInteractions();
        console.log("UserExperience initialized");
    }

    /**
     * 加载用户偏好设置
     */
    function loadUserPreferences() {
        if (window.StorageManager) {
            const prefs = StorageManager.load('userPreferences', config);
            Object.assign(config, prefs);
        }
    }

    /**
     * 设置智能提示
     */
    function setupSmartHints() {
        // 新手引导提示
        if (config.showTooltips) {
            enableTooltips();
        }
        
        // 自动提示系统
        if (config.autoHints) {
            enableAutoHints();
        }
    }

    /**
     * 启用工具提示
     */
    function enableTooltips() {
        // 为所有可交互元素添加提示
        const interactiveElements = document.querySelectorAll('button, .letter-btn, .action-btn, input');
        
        interactiveElements.forEach(el => {
            if (!el.hasAttribute('data-tooltip')) {
                const tooltip = getTooltipText(el);
                if (tooltip) {
                    el.setAttribute('data-tooltip', tooltip);
                    el.setAttribute('title', tooltip);
                }
            }
        });
    }

    /**
     * 获取元素的提示文本
     */
    function getTooltipText(element) {
        // 字母按钮
        if (element.classList.contains('letter-btn')) {
            const key = element.dataset.key;
            const cmdConfig = window.CONFIG?.letterCommands?.[key];
            if (cmdConfig) {
                return `${cmdConfig.name} - ${cmdConfig.desc}\n点击或按${key}键执行`;
            }
        }
        
        // 快速行动按钮
        if (element.classList.contains('action-btn')) {
            const text = element.innerText;
            const actions = {
                'PANIC': '紧急模式 - 触发红色警报和故障效果',
                'GLITCH': '故障模式 - 屏幕故障特效',
                'REBOOT': '重启系统 - 刷新页面',
                'CHANGE THEME': '切换主题 - 更换界面颜色',
                'TOGGLE AUDIO': '开关音效 - 启用/禁用声音',
                'FULLSCREEN': '全屏模式 - 切换全屏显示',
                'CLEAR LOGS': '清除日志 - 清空所有日志',
                'MATRIX MODE': '矩阵模式 - 显示矩阵雨特效'
            };
            return actions[text] || text;
        }
        
        // 输入框
        if (element.id === 'advanced-input') {
            return '高级输入框 - 输入数字 1-9 执行组合指令';
        }
        
        return '';
    }

    /**
     * 启用自动提示
     */
    function enableAutoHints() {
        let idleTime = 0;
        
        // 检测用户空闲时间
        const activities = ['mousemove', 'keydown', 'click', 'touchstart'];
        activities.forEach(event => {
            document.addEventListener(event, () => {
                idleTime = 0;
            });
        });
        
        // 每秒检查一次
        setInterval(() => {
            idleTime++;
            
            // 如果用户空闲 10 秒，显示提示
            if (idleTime === 10 && userStats.commandsExecuted === 0) {
                showBeginnerHint();
            }
            
            // 如果用户空闲 30 秒，显示更多提示
            if (idleTime === 30) {
                showAdvancedHint();
            }
        }, 1000);
    }

    /**
     * 显示新手提示
     */
    function showBeginnerHint() {
        const hints = [
            '💡 试试按键盘上的任意字母键开始！',
            '💡 点击左侧的按钮也能执行操作哦~',
            '💡 每个字母都代表一个黑客功能，探索一下吧！',
            '💡 不知道按哪个？试试按"A"键开始！'
        ];
        
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        showFloatingHint(randomHint);
    }

    /**
     * 显示高级提示
     */
    function showAdvancedHint() {
        const hints = [
            '🎯 输入数字 1-9 可以执行组合指令！',
            '🎯 试试右键点击屏幕，有惊喜哦~',
            '🎯 点击右下角的 ❓ 按钮查看帮助',
            '🎯 顶部可以切换简单/演示/专家模式'
        ];
        
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        showFloatingHint(randomHint);
    }

    /**
     * 显示浮动提示
     */
    function showFloatingHint(text) {
        const hint = document.createElement('div');
        hint.className = 'floating-hint';
        hint.innerHTML = text;
        
        hint.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.9), rgba(0, 170, 0, 0.9));
            color: #000;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 4px 20px rgba(0, 255, 0, 0.5);
            animation: hintFadeIn 0.5s ease, hintFadeOut 0.5s ease 4.5s forwards;
        `;
        
        document.body.appendChild(hint);
        
        // 添加动画
        if (!document.getElementById('hint-animation')) {
            const style = document.createElement('style');
            style.id = 'hint-animation';
            style.textContent = `
                @keyframes hintFadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes hintFadeOut {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 5 秒后移除
        setTimeout(() => hint.remove(), 5000);
    }

    /**
     * 优化交互
     */
    function optimizeInteractions() {
        // 优化按钮点击区域
        optimizeClickAreas();
        
        // 添加键盘快捷键
        setupKeyboardShortcuts();
        
        // 优化输入体验
        optimizeInputExperience();
    }

    /**
     * 优化点击区域
     */
    function optimizeClickAreas() {
        // 让按钮更容易点击
        const style = document.createElement('style');
        style.textContent = `
            .letter-btn {
                min-width: 60px;
                min-height: 60px;
                margin: 5px;
            }
            
            .action-btn {
                min-height: 40px;
                padding: 10px 15px;
            }
            
            #advanced-input {
                min-height: 45px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 设置键盘快捷键
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+H = 显示帮助
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                if (window.ModernUI) ModernUI.showHelpPanel();
            }
            
            // Ctrl+F = 全屏
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                if (window.ModernUI) ModernUI.toggleFullscreen();
            }
            
            // F1 = 帮助
            if (e.key === 'F1') {
                e.preventDefault();
                if (window.ModernUI) ModernUI.showHelpPanel();
            }
            
            // F11 = 切换模式
            if (e.key === 'F11') {
                e.preventDefault();
                cycleMode();
            }
            
            // Esc = 停止所有音效
            if (e.key === 'Escape') {
                if (window.AudioManager) {
                    AudioManager.setEnabled(false);
                    showFloatingHint('音效已静音，再按一次 Esc 恢复');
                }
            }
        });
    }

    /**
     * 循环切换模式
     */
    function cycleMode() {
        const modes = ['simple', 'demo', 'expert'];
        const modeSelect = document.getElementById('app-mode');
        
        if (modeSelect) {
            const currentIndex = modes.indexOf(modeSelect.value);
            const nextIndex = (currentIndex + 1) % modes.length;
            modeSelect.value = modes[nextIndex];
            
            if (window.ModernUI) {
                ModernUI.switchMode(modes[nextIndex]);
            }
        }
    }

    /**
     * 优化输入体验
     */
    function optimizeInputExperience() {
        const input = document.getElementById('advanced-input');
        if (!input) return;
        
        // 自动聚焦
        input.addEventListener('blur', () => {
            setTimeout(() => {
                // 如果不是因为点击其他按钮，重新聚焦
                if (!document.activeElement.classList.contains('action-btn')) {
                    input.focus();
                }
            }, 100);
        });
        
        // 输入验证
        input.addEventListener('input', (e) => {
            // 只允许输入数字
            e.target.value = e.target.value.replace(/[^1-9]/g, '');
        });
        
        // 回车确认
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = e.target.value.trim();
                if (value && window.Application) {
                    Application.executeNumberCommand(value);
                    e.target.value = '';
                }
            }
        });
    }

    /**
     * 记录用户行为
     */
    function trackAction(actionType, data) {
        userStats.commandsExecuted++;
        
        // 记录常用指令
        if (data.command) {
            const index = userStats.favoriteCommands.indexOf(data.command);
            if (index === -1) {
                userStats.favoriteCommands.push(data.command);
            } else {
                // 移到前面
                userStats.favoriteCommands.splice(index, 1);
                userStats.favoriteCommands.unshift(data.command);
            }
        }
        
        // 保存到存储
        if (window.StorageManager) {
            StorageManager.save('userStats', userStats);
        }
    }

    /**
     * 获取推荐指令
     */
    function getRecommendedCommands() {
        // 基于用户行为推荐
        if (userStats.favoriteCommands.length > 0) {
            return userStats.favoriteCommands.slice(0, 3);
        }
        
        // 默认推荐（最炫酷的指令）
        return ['A', 'C', 'F', 'M', 'R'];
    }

    /**
     * 显示推荐指令
     */
    function showRecommendedCommands() {
        const recommended = getRecommendedCommands();
        
        // 高亮推荐按钮
        recommended.forEach(cmd => {
            const btn = document.querySelector(`.letter-btn[data-key="${cmd}"]`);
            if (btn) {
                btn.style.animation = 'recommendedPulse 2s infinite';
            }
        });
        
        // 添加动画
        if (!document.getElementById('recommended-style')) {
            const style = document.createElement('style');
            style.id = 'recommended-style';
            style.textContent = `
                @keyframes recommendedPulse {
                    0%, 100% { box-shadow: 0 0 10px #00ff00; }
                    50% { box-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 一键演示
     */
    function oneClickDemo() {
        if (window.Application) {
            Application.addLog('启动快速演示...', 'info');
            
            // 执行一组预设的炫酷操作
            const demoSequence = [
                { key: 'A', delay: 0 },
                { key: 'C', delay: 1000 },
                { key: 'F', delay: 2000 },
                { key: 'M', delay: 3000 },
                { key: 'R', delay: 4000 }
            ];
            
            demoSequence.forEach(item => {
                setTimeout(() => {
                    if (window.Application) {
                        Application.executeLetterCommand(item.key);
                        Application.highlightButton(item.key);
                    }
                }, item.delay);
            });
        }
    }

    /**
     * 重置用户数据
     */
    function resetUserData() {
        if (confirm('确定要重置所有用户数据吗？\n\n这将清除：\n- 游戏进度\n- 成就\n- 设置\n\n此操作不可恢复！')) {
            if (window.StorageManager) {
                StorageManager.clear();
            }
            location.reload();
        }
    }

    /**
     * 导出用户数据
     */
    function exportUserData() {
        const data = {
            stats: userStats,
            preferences: config,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `qht-backup-${new Date().getTime()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        showFloatingHint('✅ 数据已导出');
    }

    /**
     * 导入用户数据
     */
    function importUserData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.stats) {
                    Object.assign(userStats, data.stats);
                }
                
                if (data.preferences) {
                    Object.assign(config, data.preferences);
                }
                
                if (window.StorageManager) {
                    StorageManager.save('userStats', userStats);
                    StorageManager.save('userPreferences', config);
                }
                
                showFloatingHint('✅ 数据已导入');
                location.reload();
            } catch (err) {
                showFloatingHint('❌ 导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
    }

    // 公开 API
    return {
        init,
        trackAction,
        showRecommendedCommands,
        oneClickDemo,
        resetUserData,
        exportUserData,
        importUserData,
        getConfig: () => config,
        updateConfig: (newConfig) => Object.assign(config, newConfig)
    };
})();

// 导出到全局作用域
window.UserExperience = UserExperience;

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UserExperience.init());
} else {
    UserExperience.init();
}
