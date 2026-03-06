/* ==========================================
   模块名称：ui/ModernUI.js
   功能：现代化用户界面管理，本地化应用体验
   版本：3.0 - 极致易用性设计
   ========================================== */

/**
 * 现代化 UI 模块 - 打造本地应用般的体验
 */
const ModernUI = (function() {
    // 应用状态
    const appState = {
        isFirstLaunch: true,
        currentMode: 'simple', // simple, demo, expert
        tutorialStep: 0,
        windowPosition: { x: 0, y: 0 },
        isFullscreen: false
    };

    /**
     * 初始化现代化 UI
     */
    function init() {
        checkFirstLaunch();
        setupNativeWindow();
        createModernInterface();
        bindModernEvents();
        console.log("ModernUI initialized");
    }

    /**
     * 检查是否首次启动
     */
    function checkFirstLaunch() {
        if (window.StorageManager) {
            const hasLaunched = StorageManager.getSetting('hasLaunched', false);
            appState.isFirstLaunch = !hasLaunched;
            
            if (!hasLaunched) {
                StorageManager.setSetting('hasLaunched', true);
            }
        }
    }

    /**
     * 设置本地窗口样式（模拟本地应用）
     */
    function setupNativeWindow() {
        // 隐藏浏览器默认行为
        document.documentElement.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        // 禁止右键菜单（模拟本地应用）
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showCustomContextMenu(e);
            return false;
        });
        
        // 禁止文本选择（除了输入框）
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
        
        // 禁止拖拽
        document.addEventListener('dragstart', (e) => e.preventDefault());
        
        // 禁用浏览器快捷键
        document.addEventListener('keydown', (e) => {
            // 允许 F12（开发者工具）
            if (e.key === 'F12') return;
            
            // 禁用 F5 刷新
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
            }
            
            // 禁用 Ctrl+N 新窗口
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
            }
        });
        
        // 设置应用标题栏
        createTitleBar();
    }

    /**
     * 创建自定义标题栏（模拟本地应用）
     */
    function createTitleBar() {
        const titleBar = document.createElement('div');
        titleBar.id = 'native-title-bar';
        titleBar.innerHTML = `
            <div class="title-bar-left">
                <div class="app-icon">🔐</div>
                <span class="app-title">量子黑客终端</span>
            </div>
            <div class="title-bar-center">
                <div class="window-controls">
                    <button class="control-btn minimize" title="最小化">─</button>
                    <button class="control-btn maximize" title="最大化">□</button>
                    <button class="control-btn close" title="关闭">×</button>
                </div>
            </div>
            <div class="title-bar-right">
                <div class="mode-selector">
                    <select id="app-mode">
                        <option value="simple">简单模式</option>
                        <option value="demo">演示模式</option>
                        <option value="expert">专家模式</option>
                    </select>
                </div>
            </div>
        `;
        
        titleBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            z-index: 10000;
            user-select: none;
            -webkit-app-region: drag;
        `;
        
        document.body.appendChild(titleBar);
        
        // 绑定窗口控制事件
        bindWindowControls(titleBar);
    }

    /**
     * 绑定窗口控制按钮
     */
    function bindWindowControls(titleBar) {
        // 最小化
        const minimizeBtn = titleBar.querySelector('.minimize');
        minimizeBtn.addEventListener('click', () => {
            // 模拟最小化（实际是隐藏）
            document.body.style.display = 'none';
            setTimeout(() => {
                document.body.style.display = 'block';
            }, 1000);
        });
        
        // 最大化/还原
        const maximizeBtn = titleBar.querySelector('.maximize');
        maximizeBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        // 关闭（显示确认对话框）
        const closeBtn = titleBar.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            showCloseConfirm();
        });
        
        // 模式选择
        const modeSelect = titleBar.querySelector('#app-mode');
        modeSelect.addEventListener('change', (e) => {
            switchMode(e.target.value);
        });
    }

    /**
     * 创建现代化界面
     */
    function createModernInterface() {
        // 添加启动向导（如果是首次使用）
        if (appState.isFirstLaunch) {
            createWelcomeWizard();
        }
        
        // 添加工具提示容器
        createTooltipContainer();
        
        // 添加帮助按钮
        createHelpButton();
        
        // 优化现有界面
        enhanceExistingUI();
    }

    /**
     * 创建欢迎向导（首次使用）
     */
    function createWelcomeWizard() {
        const wizard = document.createElement('div');
        wizard.id = 'welcome-wizard';
        wizard.innerHTML = `
            <div class="wizard-content">
                <div class="wizard-header">
                    <h1>🎉 欢迎使用量子黑客终端</h1>
                    <p>这是一款超酷的黑客风格模拟器，完全免费且安全！</p>
                </div>
                
                <div class="wizard-steps">
                    <div class="step active" data-step="1">
                        <div class="step-icon">⌨️</div>
                        <h3>简单操作</h3>
                        <p>只需按键盘上的字母键，就能体验黑客攻击的快感</p>
                    </div>
                    <div class="step" data-step="2">
                        <div class="step-icon">🎨</div>
                        <h3>炫酷效果</h3>
                        <p>矩阵雨、网络拓扑图、故障艺术... 视觉效果拉满</p>
                    </div>
                    <div class="step" data-step="3">
                        <div class="step-icon">🎮</div>
                        <h3>娱乐至上</h3>
                        <p>纯娱乐用途，不会真的黑客攻击，放心玩耍</p>
                    </div>
                </div>
                
                <div class="wizard-actions">
                    <button class="btn-primary" onclick="ModernUI.startTutorial()">
                        🚀 开始教程
                    </button>
                    <button class="btn-secondary" onclick="ModernUI.skipTutorial()">
                        ⏭️ 跳过教程，直接使用
                    </button>
                </div>
            </div>
        `;
        
        wizard.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        
        document.body.appendChild(wizard);
        
        // 添加样式
        addWizardStyles();
    }

    /**
     * 添加工具提示容器
     */
    function createTooltipContainer() {
        const tooltip = document.createElement('div');
        tooltip.id = 'modern-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            max-width: 300px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff00;
            border-radius: 8px;
            color: #fff;
            font-size: 13px;
            z-index: 100000;
            display: none;
            box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
    }

    /**
     * 创建帮助按钮
     */
    function createHelpButton() {
        const helpBtn = document.createElement('button');
        helpBtn.id = 'modern-help-btn';
        helpBtn.innerHTML = '❓';
        helpBtn.title = '帮助';
        helpBtn.onclick = () => showHelpPanel();
        
        helpBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ff00, #00aa00);
            border: none;
            color: #000;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4);
            transition: all 0.3s;
        `;
        
        helpBtn.onmouseenter = (e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.6)';
        };
        
        helpBtn.onmouseleave = (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.4)';
        };
        
        document.body.appendChild(helpBtn);
    }

    /**
     * 增强现有 UI
     */
    function enhanceExistingUI() {
        // 为大按钮添加更大的点击区域
        const buttons = document.querySelectorAll('.letter-btn');
        buttons.forEach(btn => {
            btn.style.padding = '15px 10px';
            btn.style.fontSize = '18px';
            
            // 添加中文提示
            const key = btn.dataset.key;
            const config = window.CONFIG?.letterCommands?.[key];
            if (config) {
                btn.title = `${config.name}\n${config.desc}\n\n点击或按 ${key} 键执行`;
            }
        });
        
        // 优化输入框
        const input = document.getElementById('advanced-input');
        if (input) {
            input.placeholder = '输入数字 1-9 执行组合指令...';
            input.style.fontSize = '16px';
            input.style.padding = '12px';
        }
        
        // 添加操作提示
        addQuickTips();
    }

    /**
     * 添加快速提示
     */
    function addQuickTips() {
        const tipBar = document.createElement('div');
        tipBar.id = 'quick-tip-bar';
        tipBar.innerHTML = `
            <div class="tip-item">💡 按任意字母键开始</div>
            <div class="tip-item">💡 输入数字 1-9 执行组合技</div>
            <div class="tip-item">💡 点击右下角 ❓ 获取帮助</div>
        `;
        
        tipBar.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff00;
            border-radius: 10px;
            padding: 15px 30px;
            display: flex;
            gap: 30px;
            z-index: 9998;
            animation: tipFloat 3s ease-in-out infinite;
        `;
        
        document.body.appendChild(tipBar);
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tipFloat {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        // 30 秒后自动隐藏
        setTimeout(() => {
            tipBar.style.transition = 'opacity 0.5s';
            tipBar.style.opacity = '0';
            setTimeout(() => tipBar.remove(), 500);
        }, 30000);
    }

    /**
     * 绑定现代化事件
     */
    function bindModernEvents() {
        // 按钮悬停提示
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('letter-btn') || 
                e.target.classList.contains('action-btn')) {
                showButtonTooltip(e.target);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('letter-btn') || 
                e.target.classList.contains('action-btn')) {
                hideTooltip();
            }
        });
        
        // 点击反馈
        document.addEventListener('click', (e) => {
            createClickEffect(e.clientX, e.clientY);
        });
    }

    /**
     * 显示按钮工具提示
     */
    function showButtonTooltip(button) {
        const tooltip = document.getElementById('modern-tooltip');
        const key = button.dataset.key;
        const config = window.CONFIG?.letterCommands?.[key];
        
        if (config) {
            tooltip.innerHTML = `
                <strong style="color: #00ff00; font-size: 16px;">${config.name}</strong><br>
                <span style="color: #aaa;">${config.desc}</span><br>
                <span style="color: #888; font-size: 12px;">类型：${translateType(config.type)}</span>
            `;
            
            tooltip.style.display = 'block';
            tooltip.style.left = (button.offsetLeft + button.offsetWidth + 10) + 'px';
            tooltip.style.top = button.offsetTop + 'px';
        }
    }

    /**
     * 隐藏工具提示
     */
    function hideTooltip() {
        const tooltip = document.getElementById('modern-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * 创建点击效果
     */
    function createClickEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(0, 255, 0, 0.5);
            transform: translate(-50%, -50%);
            animation: clickRipple 0.5s ease-out forwards;
            pointer-events: none;
            z-index: 99999;
        `;
        
        document.body.appendChild(ripple);
        
        // 添加动画样式
        if (!document.getElementById('click-effect-style')) {
            const style = document.createElement('style');
            style.id = 'click-effect-style';
            style.textContent = `
                @keyframes clickRipple {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => ripple.remove(), 500);
    }

    /**
     * 显示自定义右键菜单
     */
    function showCustomContextMenu(e) {
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 10px 0;
            min-width: 200px;
            z-index: 100000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        menu.innerHTML = `
            <div class="menu-item" onclick="ModernUI.toggleFullscreen()">📺 全屏模式</div>
            <div class="menu-item" onclick="ModernUI.showHelpPanel()">❓ 帮助</div>
            <div class="menu-item" onclick="ModernUI.switchMode('simple')">🎯 简单模式</div>
            <div class="menu-item" onclick="ModernUI.switchMode('demo')">🎬 演示模式</div>
            <div class="menu-item" onclick="ModernUI.switchMode('expert')">⚡ 专家模式</div>
            <div style="border-top: 1px solid #333; margin: 5px 0;"></div>
            <div class="menu-item" onclick="location.reload()">🔄 刷新页面</div>
        `;
        
        // 添加菜单项样式
        const menuItems = menu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.cssText = `
                padding: 8px 20px;
                cursor: pointer;
                color: #fff;
                font-size: 13px;
                transition: background 0.2s;
            `;
            item.onmouseover = (e) => {
                e.target.style.background = 'rgba(0, 255, 0, 0.2)';
            };
            item.onmouseout = (e) => {
                e.target.style.background = 'transparent';
            };
        });
        
        document.body.appendChild(menu);
        
        // 点击其他地方关闭菜单
        const closeMenu = () => {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    /**
     * 切换全屏
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            appState.isFullscreen = true;
        } else {
            document.exitFullscreen();
            appState.isFullscreen = false;
        }
    }

    /**
     * 切换模式
     */
    function switchMode(mode) {
        appState.currentMode = mode;
        
        if (window.Application) {
            Application.addLog(`切换到${getModeName(mode)}模式`, 'info');
        }
        
        // 根据模式调整界面
        adjustMode(mode);
    }

    /**
     * 调整模式界面
     */
    function adjustMode(mode) {
        const buttons = document.querySelectorAll('.letter-btn');
        
        if (mode === 'simple') {
            // 简单模式：显示所有按钮和提示
            buttons.forEach(btn => btn.style.display = 'flex');
        } else if (mode === 'demo') {
            // 演示模式：自动播放
            startDemoMode();
        } else if (mode === 'expert') {
            // 专家模式：隐藏提示，显示更多信息
            buttons.forEach(btn => {
                const desc = btn.querySelector('.desc');
                if (desc) desc.style.display = 'none';
            });
        }
    }

    /**
     * 启动演示模式
     */
    function startDemoMode() {
        if (window.Application) {
            Application.addLog('演示模式启动', 'info');
            
            // 自动执行一些炫酷的操作
            const demoSequence = ['A', 'C', 'E', 'F', 'M', 'R'];
            let index = 0;
            
            const interval = setInterval(() => {
                if (index >= demoSequence.length) {
                    clearInterval(interval);
                    return;
                }
                
                const key = demoSequence[index];
                if (window.Application) {
                    Application.executeLetterCommand(key);
                    Application.highlightButton(key);
                }
                index++;
            }, 1500);
        }
    }

    /**
     * 显示帮助面板
     */
    function showHelpPanel() {
        const helpPanel = document.createElement('div');
        helpPanel.id = 'help-panel';
        helpPanel.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h2>❓ 帮助中心</h2>
                    <button class="close-btn" onclick="this.closest('#help-panel').remove()">×</button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <h3>🎮 如何开始？</h3>
                        <p>超级简单！只需按键盘上的任意字母键（A-Z），或者用鼠标点击左侧的按钮即可。</p>
                    </div>
                    <div class="help-section">
                        <h3>🔢 高级玩法</h3>
                        <p>在右侧的输入框中输入数字 1-9，可以执行组合指令，一次完成多个操作！</p>
                    </div>
                    <div class="help-section">
                        <h3>🎨 切换主题</h3>
                        <p>点击顶部的"CHANGE THEME"按钮，或者按右键菜单切换主题。</p>
                    </div>
                    <div class="help-section">
                        <h3>⚙️ 模式说明</h3>
                        <ul>
                            <li><strong>简单模式：</strong>适合新手，有详细提示</li>
                            <li><strong>演示模式：</strong>自动演示炫酷效果</li>
                            <li><strong>专家模式：</strong>简洁界面，适合老手</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h3>💡 常见问题</h3>
                        <p><strong>Q: 这是真的黑客工具吗？</strong><br>A: 不是哦！这只是一个娱乐模拟器，不会真的进行黑客攻击。</p>
                        <p><strong>Q: 如何保存进度？</strong><br>A: 系统会自动保存你的数据和成就。</p>
                    </div>
                </div>
            </div>
        `;
        
        helpPanel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 100000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        document.body.appendChild(helpPanel);
    }

    /**
     * 开始教程
     */
    function startTutorial() {
        const wizard = document.getElementById('welcome-wizard');
        if (wizard) {
            wizard.remove();
        }
        
        // 启动交互式教程
        startInteractiveTutorial();
    }

    /**
     * 跳过教程
     */
    function skipTutorial() {
        const wizard = document.getElementById('welcome-wizard');
        if (wizard) {
            wizard.remove();
        }
        
        if (window.Application) {
            Application.addLog('欢迎使用！按任意字母键开始...', 'success');
        }
    }

    /**
     * 启动交互式教程
     */
    function startInteractiveTutorial() {
        const steps = [
            {
                text: '欢迎来到量子黑客终端！让我们先熟悉一下界面。',
                action: 'none'
            },
            {
                text: '这里是按钮面板，每个按钮代表一个黑客功能。试试点击第一个按钮（A）！',
                target: '.letter-btn[data-key="A"]',
                action: 'click'
            },
            {
                text: '太棒了！现在试试按键盘上的 B 键。',
                target: '.letter-btn[data-key="B"]',
                action: 'keypress'
            },
            {
                text: '这里是日志输出区，会显示所有操作的详细信息。',
                target: '#log-container',
                action: 'highlight'
            },
            {
                text: '右侧是高级输入区，输入数字 1-9 可以执行组合指令。',
                target: '#advanced-input',
                action: 'highlight'
            },
            {
                text: '🎉 恭喜！你已经学会了基本操作。开始你的黑客之旅吧！',
                action: 'finish'
            }
        ];
        
        let currentStep = 0;
        
        function showStep(stepIndex) {
            if (stepIndex >= steps.length) return;
            
            const step = steps[stepIndex];
            
            // 创建教程提示框
            const tutorialBox = document.createElement('div');
            tutorialBox.className = 'tutorial-box';
            tutorialBox.innerHTML = `
                <div class="tutorial-text">${step.text}</div>
                ${stepIndex < steps.length - 1 ? '<button class="tutorial-next" onclick="ModernUI.nextTutorialStep()">下一步 →</button>' : ''}
            `;
            
            tutorialBox.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #00ff00;
                border-radius: 15px;
                padding: 20px 40px;
                z-index: 100001;
                text-align: center;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            `;
            
            document.body.appendChild(tutorialBox);
            
            // 高亮目标元素
            if (step.target) {
                const targetEl = document.querySelector(step.target);
                if (targetEl) {
                    targetEl.style.transition = 'all 0.3s';
                    targetEl.style.boxShadow = '0 0 20px #00ff00';
                    targetEl.style.zIndex = '100002';
                }
            }
        }
        
        window.currentTutorialStep = currentStep;
        window.showTutorialStep = showStep;
        showStep(0);
    }

    /**
     * 进入下一步教程
     */
    function nextTutorialStep() {
        window.currentTutorialStep++;
        
        // 移除当前的教程框
        const currentBox = document.querySelector('.tutorial-box');
        if (currentBox) {
            currentBox.remove();
        }
        
        // 移除之前的高亮
        document.querySelectorAll('*').forEach(el => {
            el.style.boxShadow = '';
            el.style.zIndex = '';
        });
        
        window.showTutorialStep(window.currentTutorialStep);
    }

    /**
     * 显示关闭确认
     */
    function showCloseConfirm() {
        if (confirm('确定要关闭应用吗？\n\n点击"确定"关闭，点击"取消"继续使用。')) {
            window.close(); // 尝试关闭窗口
            // 如果关闭失败，显示告别消息
            document.body.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #00ff00; font-family: monospace; text-align: center;">
                    <div>
                        <h1>👋 再见！</h1>
                        <p>欢迎下次回来，黑客！</p>
                        <p style="margin-top: 20px; color: #888;">（你可以关闭这个标签页了）</p>
                    </div>
                </div>
            `;
        }
    }

    // 工具函数
    function translateType(type) {
        const types = {
            'attack': '攻击',
            'scan': '扫描',
            'util': '工具',
            'system': '系统'
        };
        return types[type] || type;
    }

    function getModeName(mode) {
        const modes = {
            'simple': '简单',
            'demo': '演示',
            'expert': '专家'
        };
        return modes[mode] || mode;
    }

    function addWizardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .wizard-content {
                background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
                border: 2px solid #00ff00;
                border-radius: 20px;
                padding: 40px;
                max-width: 800px;
                text-align: center;
                box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
            }
            
            .wizard-header h1 {
                color: #00ff00;
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .wizard-header p {
                color: #aaa;
                font-size: 16px;
                margin-bottom: 30px;
            }
            
            .wizard-steps {
                display: flex;
                gap: 20px;
                justify-content: center;
                margin-bottom: 30px;
            }
            
            .step {
                flex: 1;
                padding: 20px;
                background: rgba(0, 255, 0, 0.1);
                border-radius: 10px;
                transition: all 0.3s;
            }
            
            .step.active {
                background: rgba(0, 255, 0, 0.2);
                transform: scale(1.05);
            }
            
            .step-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .step h3 {
                color: #00ff00;
                font-size: 18px;
                margin-bottom: 10px;
            }
            
            .step p {
                color: #aaa;
                font-size: 14px;
            }
            
            .wizard-actions {
                display: flex;
                gap: 20px;
                justify-content: center;
            }
            
            .btn-primary, .btn-secondary {
                padding: 15px 40px;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s;
                border: none;
                font-family: 'Microsoft YaHei', sans-serif;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #00ff00, #00aa00);
                color: #000;
            }
            
            .btn-primary:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            }
            
            .btn-secondary {
                background: transparent;
                color: #00ff00;
                border: 2px solid #00ff00;
            }
            
            .btn-secondary:hover {
                background: rgba(0, 255, 0, 0.1);
            }
            
            .menu-item:hover {
                background: rgba(0, 255, 0, 0.2) !important;
            }
            
            #help-panel .help-content {
                background: #1a1a2e;
                border: 2px solid #00ff00;
                border-radius: 15px;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            #help-panel .help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #333;
            }
            
            #help-panel .help-header h2 {
                color: #00ff00;
                margin: 0;
            }
            
            #help-panel .close-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 32px;
                cursor: pointer;
            }
            
            #help-panel .help-body {
                padding: 20px;
            }
            
            #help-panel .help-section {
                margin-bottom: 25px;
            }
            
            #help-panel .help-section h3 {
                color: #00ff00;
                margin-bottom: 10px;
            }
            
            #help-panel .help-section p,
            #help-panel .help-section li {
                color: #aaa;
                line-height: 1.6;
            }
            
            #help-panel .help-section ul {
                margin: 10px 0;
                padding-left: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    // 公开 API
    return {
        init,
        startTutorial,
        skipTutorial,
        nextTutorialStep,
        toggleFullscreen,
        switchMode,
        showHelpPanel,
        enhanceExistingUI
    };
})();

// 导出到全局作用域
window.ModernUI = ModernUI;

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModernUI.init());
} else {
    ModernUI.init();
}
