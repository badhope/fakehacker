/**
 * CollapsibleUI.js - 可折叠界面管理系统
 * 功能：管理顶部导航栏、侧边按钮区域、底部日志区域的折叠/展开
 * 版本：v1.0
 * 作者：QHT System
 */

(function(global) {
    'use strict';

    // 配置
    const config = {
        animationDuration: 300,
        defaultCollapsed: false,
        keyboardShortcuts: {
            toggleTop: 'KeyT',
            toggleLeft: 'KeyL',
            toggleRight: 'KeyR',
            toggleBottom: 'KeyB',
            toggleAll: 'KeyF',
            showHelp: 'KeyH'
        },
        storageKey: 'qht_collapsible_state'
    };

    // 状态管理
    let state = {
        topCollapsed: false,
        leftCollapsed: false,
        rightCollapsed: false,
        bottomCollapsed: false,
        initialized: false
    };

    // DOM 元素缓存
    let elements = {};

    /**
     * 初始化折叠系统
     */
    function init() {
        if (state.initialized) {
            console.warn('CollapsibleUI already initialized');
            return;
        }

        cacheElements();
        loadState();
        setupEventListeners();
        setupKeyboardShortcuts();
        updateLayout();
        
        state.initialized = true;
        console.log('[CollapsibleUI] System initialized');
    }

    /**
     * 缓存 DOM 元素
     */
    function cacheElements() {
        elements = {
            statusBar: document.getElementById('status-bar'),
            buttonPanel: document.getElementById('button-panel'),
            controlPanel: document.getElementById('control-panel'),
            infoBar: document.getElementById('info-bar'),
            mainLayout: document.getElementById('main-layout'),
            displayArea: document.getElementById('display-area'),
            terminalOutput: document.getElementById('terminal-output')
        };

        // 添加折叠控制按钮
        addCollapseButtons();
    }

    /**
     * 添加折叠控制按钮到各个区域
     */
    function addCollapseButtons() {
        // 顶部导航栏控制按钮
        const topToggle = document.createElement('button');
        topToggle.className = 'collapse-toggle collapse-top-toggle';
        topToggle.innerHTML = '▲';
        topToggle.title = '折叠顶部导航栏 (T)';
        topToggle.onclick = () => toggleTop();
        if (elements.statusBar) {
            elements.statusBar.appendChild(topToggle);
        }

        // 左侧按钮面板控制按钮
        const leftToggle = document.createElement('button');
        leftToggle.className = 'collapse-toggle collapse-left-toggle';
        leftToggle.innerHTML = '◀';
        leftToggle.title = '折叠左侧按钮区 (L)';
        leftToggle.onclick = () => toggleLeft();
        if (elements.buttonPanel) {
            const header = elements.buttonPanel.querySelector('.panel-header');
            if (header) {
                header.appendChild(leftToggle);
            }
        }

        // 右侧控制面板控制按钮
        const rightToggle = document.createElement('button');
        rightToggle.className = 'collapse-toggle collapse-right-toggle';
        rightToggle.innerHTML = '▶';
        rightToggle.title = '折叠右侧控制面板 (R)';
        rightToggle.onclick = () => toggleRight();
        if (elements.controlPanel) {
            const section = elements.controlPanel.querySelector('.panel-section:first-child');
            if (section) {
                const header = section.querySelector('h3');
                if (header) {
                    header.appendChild(rightToggle);
                }
            }
        }

        // 底部信息栏控制按钮
        const bottomToggle = document.createElement('button');
        bottomToggle.className = 'collapse-toggle collapse-bottom-toggle';
        bottomToggle.innerHTML = '▼';
        bottomToggle.title = '折叠底部信息栏 (B)';
        bottomToggle.onclick = () => toggleBottom();
        if (elements.infoBar) {
            elements.infoBar.appendChild(bottomToggle);
        }
    }

    /**
     * 设置事件监听
     */
    function setupEventListeners() {
        // 监听窗口大小变化
        window.addEventListener('resize', debounce(updateLayout, 200));

        // 保存状态到 localStorage
        window.addEventListener('beforeunload', saveState);
    }

    /**
     * 设置键盘快捷键
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // 忽略输入框中的按键
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // 忽略 Ctrl/Cmd/Alt/Shift 组合键
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            const key = event.code;

            switch (key) {
                case config.keyboardShortcuts.toggleTop:
                    event.preventDefault();
                    toggleTop();
                    break;
                case config.keyboardShortcuts.toggleLeft:
                    event.preventDefault();
                    toggleLeft();
                    break;
                case config.keyboardShortcuts.toggleRight:
                    event.preventDefault();
                    toggleRight();
                    break;
                case config.keyboardShortcuts.toggleBottom:
                    event.preventDefault();
                    toggleBottom();
                    break;
                case config.keyboardShortcuts.toggleAll:
                    event.preventDefault();
                    toggleAll();
                    break;
                case config.keyboardShortcuts.showHelp:
                    event.preventDefault();
                    showHelp();
                    break;
            }
        });
    }

    /**
     * 从 localStorage 加载状态
     */
    function loadState() {
        try {
            const saved = localStorage.getItem(config.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                state.topCollapsed = parsed.topCollapsed || false;
                state.leftCollapsed = parsed.leftCollapsed || false;
                state.rightCollapsed = parsed.rightCollapsed || false;
                state.bottomCollapsed = parsed.bottomCollapsed || false;
            }
        } catch (e) {
            console.warn('[CollapsibleUI] Failed to load state:', e);
        }
    }

    /**
     * 保存状态到 localStorage
     */
    function saveState() {
        try {
            const stateData = {
                topCollapsed: state.topCollapsed,
                leftCollapsed: state.leftCollapsed,
                rightCollapsed: state.rightCollapsed,
                bottomCollapsed: state.bottomCollapsed
            };
            localStorage.setItem(config.storageKey, JSON.stringify(stateData));
        } catch (e) {
            console.warn('[CollapsibleUI] Failed to save state:', e);
        }
    }

    /**
     * 更新布局
     */
    function updateLayout() {
        applyCollapse(elements.statusBar, state.topCollapsed, 'collapsed-top');
        applyCollapse(elements.buttonPanel, state.leftCollapsed, 'collapsed-left');
        applyCollapse(elements.controlPanel, state.rightCollapsed, 'collapsed-right');
        applyCollapse(elements.infoBar, state.bottomCollapsed, 'collapsed-bottom');

        // 更新按钮图标
        updateToggleButtons();

        // 触发自定义事件
        const event = new CustomEvent('collapsible:layoutUpdate', {
            detail: { ...state }
        });
        document.dispatchEvent(event);
    }

    /**
     * 应用折叠状态
     */
    function applyCollapse(element, collapsed, className) {
        if (!element) return;

        if (collapsed) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    /**
     * 更新切换按钮图标
     */
    function updateToggleButtons() {
        const toggles = document.querySelectorAll('.collapse-toggle');
        toggles.forEach(toggle => {
            if (toggle.classList.contains('collapse-top-toggle')) {
                toggle.innerHTML = state.topCollapsed ? '▼' : '▲';
                toggle.title = state.topCollapsed ? '展开顶部导航栏 (T)' : '折叠顶部导航栏 (T)';
            } else if (toggle.classList.contains('collapse-left-toggle')) {
                toggle.innerHTML = state.leftCollapsed ? '▶' : '◀';
                toggle.title = state.leftCollapsed ? '展开左侧按钮区 (L)' : '折叠左侧按钮区 (L)';
            } else if (toggle.classList.contains('collapse-right-toggle')) {
                toggle.innerHTML = state.rightCollapsed ? '◀' : '▶';
                toggle.title = state.rightCollapsed ? '展开右侧控制面板 (R)' : '折叠右侧控制面板 (R)';
            } else if (toggle.classList.contains('collapse-bottom-toggle')) {
                toggle.innerHTML = state.bottomCollapsed ? '▲' : '▼';
                toggle.title = state.bottomCollapsed ? '展开底部信息栏 (B)' : '折叠底部信息栏 (B)';
            }
        });
    }

    /**
     * 切换顶部导航栏
     */
    function toggleTop() {
        state.topCollapsed = !state.topCollapsed;
        updateLayout();
        saveState();
        console.log('[CollapsibleUI] Top bar:', state.topCollapsed ? 'collapsed' : 'expanded');
    }

    /**
     * 切换左侧按钮区域
     */
    function toggleLeft() {
        state.leftCollapsed = !state.leftCollapsed;
        updateLayout();
        saveState();
        console.log('[CollapsibleUI] Left panel:', state.leftCollapsed ? 'collapsed' : 'expanded');
    }

    /**
     * 切换右侧控制面板
     */
    function toggleRight() {
        state.rightCollapsed = !state.rightCollapsed;
        updateLayout();
        saveState();
        console.log('[CollapsibleUI] Right panel:', state.rightCollapsed ? 'collapsed' : 'expanded');
    }

    /**
     * 切换底部信息栏
     */
    function toggleBottom() {
        state.bottomCollapsed = !state.bottomCollapsed;
        updateLayout();
        saveState();
        console.log('[CollapsibleUI] Bottom bar:', state.bottomCollapsed ? 'collapsed' : 'expanded');
    }

    /**
     * 切换所有区域
     */
    function toggleAll() {
        const allCollapsed = state.topCollapsed && state.leftCollapsed && 
                            state.rightCollapsed && state.bottomCollapsed;
        
        state.topCollapsed = !allCollapsed;
        state.leftCollapsed = !allCollapsed;
        state.rightCollapsed = !allCollapsed;
        state.bottomCollapsed = !allCollapsed;
        
        updateLayout();
        saveState();
        console.log('[CollapsibleUI] All panels:', allCollapsed ? 'expanded' : 'collapsed');
    }

    /**
     * 显示帮助信息
     */
    function showHelp() {
        const helpContent = `
<div style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(5, 5, 5, 0.98);
    border: 2px solid #00ff00;
    border-radius: 12px;
    padding: 30px;
    z-index: 10000;
    max-width: 600px;
    box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
">
    <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #333;
        padding-bottom: 15px;
    ">
        <h2 style="color: #00ff00; margin: 0; font-size: 24px;">📋 界面折叠控制帮助</h2>
        <button onclick="CollapsibleUI.closeHelp()" style="
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        ">✕ 关闭</button>
    </div>
    
    <div style="color: #e0e0e0; line-height: 1.8;">
        <h3 style="color: #00ffff; margin: 15px 0 10px 0;">⌨️ 键盘快捷键</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">T</td>
                <td style="padding: 10px;">切换顶部导航栏</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">L</td>
                <td style="padding: 10px;">切换左侧按钮区域</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">R</td>
                <td style="padding: 10px;">切换右侧控制面板</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">B</td>
                <td style="padding: 10px;">切换底部信息栏</td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">F</td>
                <td style="padding: 10px;">切换所有区域（全屏模式）</td>
            </tr>
            <tr>
                <td style="padding: 10px; color: #00ff00; font-family: monospace;">H</td>
                <td style="padding: 10px;">显示此帮助信息</td>
            </tr>
        </table>

        <h3 style="color: #00ffff; margin: 15px 0 10px 0;">🖱️ 鼠标控制</h3>
        <p style="margin: 10px 0;">点击各个区域的折叠按钮（▲ ▼ ◀ ▶）即可切换显示状态。</p>

        <h3 style="color: #00ffff; margin: 15px 0 10px 0;">💾 自动保存</h3>
        <p style="margin: 10px 0;">您的折叠偏好会自动保存，下次打开时会自动恢复。</p>
    </div>
    
    <div style="
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #333;
        text-align: center;
        color: #666;
        font-size: 12px;
    ">
        按 <span style="color: #00ff00; font-family: monospace;">H</span> 键或点击右上角按钮关闭此帮助
    </div>
</div>
<div id="help-overlay" onclick="CollapsibleUI.closeHelp()" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
"></div>
`;
        document.body.insertAdjacentHTML('beforeend', helpContent);
    }

    /**
     * 关闭帮助
     */
    function closeHelp() {
        const help = document.querySelector('div[style*="max-width: 600px"]');
        const overlay = document.getElementById('help-overlay');
        if (help) help.remove();
        if (overlay) overlay.remove();
    }

    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 获取当前状态
     */
    function getState() {
        return { ...state };
    }

    /**
     * 设置折叠状态
     */
    function setState(newState) {
        if (newState.topCollapsed !== undefined) state.topCollapsed = newState.topCollapsed;
        if (newState.leftCollapsed !== undefined) state.leftCollapsed = newState.leftCollapsed;
        if (newState.rightCollapsed !== undefined) state.rightCollapsed = newState.rightCollapsed;
        if (newState.bottomCollapsed !== undefined) state.bottomCollapsed = newState.bottomCollapsed;
        updateLayout();
        saveState();
    }

    // 导出公共 API
    global.CollapsibleUI = {
        init,
        toggleTop,
        toggleLeft,
        toggleRight,
        toggleBottom,
        toggleAll,
        showHelp,
        closeHelp,
        getState,
        setState
    };

})(typeof window !== 'undefined' ? window : this);

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.CollapsibleUI.init();
    }, 100);
});
