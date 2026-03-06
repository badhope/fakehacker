/* ==========================================
   模块名称：ui/SettingsPanel.js
   功能：设置面板管理，让用户自定义所有选项
   版本：3.0 - 简单易用的设置界面
   ========================================== */

/**
 * 设置面板模块 - 提供直观的设置界面
 */
const SettingsPanel = (function() {
    // 设置项定义
    const settingsDefinitions = {
        display: {
            title: '显示设置',
            icon: '🖥️',
            settings: [
                {
                    id: 'theme',
                    label: '主题',
                    type: 'select',
                    options: {
                        'dark': '暗色主题',
                        'light': '亮色主题',
                        'cyberpunk': '赛博朋克',
                        'matrix': '矩阵',
                        'solarized': '太阳能'
                    },
                    default: 'dark'
                },
                {
                    id: 'showTooltips',
                    label: '显示提示',
                    type: 'toggle',
                    default: true
                },
                {
                    id: 'visualFeedback',
                    label: '视觉反馈',
                    type: 'toggle',
                    default: true
                }
            ]
        },
        audio: {
            title: '音效设置',
            icon: '🔊',
            settings: [
                {
                    id: 'audioEnabled',
                    label: '启用音效',
                    type: 'toggle',
                    default: true
                },
                {
                    id: 'masterVolume',
                    label: '主音量',
                    type: 'slider',
                    min: 0,
                    max: 100,
                    default: 30
                },
                {
                    id: 'sfxVolume',
                    label: '音效音量',
                    type: 'slider',
                    min: 0,
                    max: 100,
                    default: 50
                }
            ]
        },
        gameplay: {
            title: '游戏设置',
            icon: '🎮',
            settings: [
                {
                    id: 'autoHints',
                    label: '自动提示',
                    type: 'toggle',
                    default: true
                },
                {
                    id: 'simplifiedMode',
                    label: '简化模式',
                    type: 'toggle',
                    default: true
                }
            ]
        },
        system: {
            title: '系统设置',
            icon: '⚙️',
            settings: [
                {
                    id: 'language',
                    label: '语言',
                    type: 'select',
                    options: {
                        'zh-CN': '简体中文',
                        'zh-TW': '繁體中文',
                        'en': 'English'
                    },
                    default: 'zh-CN'
                },
                {
                    id: 'autoSave',
                    label: '自动保存',
                    type: 'toggle',
                    default: true
                }
            ]
        }
    };

    /**
     * 初始化设置面板
     */
    function init() {
        createSettingsButton();
        console.log("SettingsPanel initialized");
    }

    /**
     * 创建设置按钮
     */
    function createSettingsButton() {
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settings-panel-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = '设置';
        settingsBtn.onclick = () => showSettingsPanel();
        
        settingsBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #666, #444);
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.4);
            transition: all 0.3s;
        `;
        
        settingsBtn.onmouseenter = (e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(100, 100, 100, 0.6)';
        };
        
        settingsBtn.onmouseleave = (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(100, 100, 100, 0.4)';
        };
        
        document.body.appendChild(settingsBtn);
    }

    /**
     * 显示设置面板
     */
    function showSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'settings-panel-overlay';
        panel.innerHTML = `
            <div class="settings-panel">
                <div class="settings-header">
                    <h2>⚙️ 设置</h2>
                    <button class="close-btn" onclick="SettingsPanel.closePanel()">×</button>
                </div>
                
                <div class="settings-body">
                    ${generateSettingsTabs()}
                    <div class="settings-content" id="settings-content">
                        ${generateSettingsContent('display')}
                    </div>
                </div>
                
                <div class="settings-footer">
                    <button class="btn-save" onclick="SettingsPanel.saveSettings()">💾 保存设置</button>
                    <button class="btn-reset" onclick="SettingsPanel.resetSettings()">🔄 恢复默认</button>
                </div>
            </div>
        `;
        
        panel.style.cssText = `
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
        
        document.body.appendChild(panel);
        
        // 添加样式
        addSettingsStyles();
    }

    /**
     * 生成设置标签页
     */
    function generateSettingsTabs() {
        let tabs = '<div class="settings-tabs">';
        
        Object.keys(settingsDefinitions).forEach(key => {
            const section = settingsDefinitions[key];
            tabs += `
                <button class="settings-tab ${key === 'display' ? 'active' : ''}" 
                        onclick="SettingsPanel.switchTab('${key}')">
                    ${section.icon} ${section.title}
                </button>
            `;
        });
        
        tabs += '</div>';
        return tabs;
    }

    /**
     * 生成设置内容
     */
    function generateSettingsContent(sectionKey) {
        const section = settingsDefinitions[sectionKey];
        if (!section) return '';
        
        let content = `<div class="settings-section" data-section="${sectionKey}">`;
        
        section.settings.forEach(setting => {
            content += `
                <div class="setting-item">
                    <label for="setting-${setting.id}">${setting.label}</label>
                    ${generateSettingInput(setting)}
                </div>
            `;
        });
        
        content += '</div>';
        return content;
    }

    /**
     * 生成设置输入控件
     */
    function generateSettingInput(setting) {
        switch(setting.type) {
            case 'toggle':
                return `
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-${setting.id}" 
                               ${setting.default ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                `;
            
            case 'slider':
                return `
                    <div class="slider-container">
                        <input type="range" id="setting-${setting.id}" 
                               min="${setting.min}" max="${setting.max}" 
                               value="${setting.default}">
                        <span class="slider-value">${setting.default}</span>
                    </div>
                `;
            
            case 'select':
                const options = Object.entries(setting.options)
                    .map(([value, label]) => `<option value="${value}">${label}</option>`)
                    .join('');
                
                return `<select id="setting-${setting.id}">${options}</select>`;
            
            default:
                return `<input type="text" id="setting-${setting.id}" value="${setting.default}">`;
        }
    }

    /**
     * 切换标签页
     */
    function switchTab(sectionKey) {
        // 更新标签状态
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新内容
        const content = document.getElementById('settings-content');
        content.innerHTML = generateSettingsContent(sectionKey);
        
        // 重新绑定滑块事件
        bindSliderEvents();
    }

    /**
     * 绑定滑块事件
     */
    function bindSliderEvents() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const valueDisplay = slider.parentElement.querySelector('.slider-value');
            if (valueDisplay) {
                slider.addEventListener('input', () => {
                    valueDisplay.textContent = slider.value;
                });
            }
        });
    }

    /**
     * 保存设置
     */
    function saveSettings() {
        const preferences = {};
        
        // 收集所有设置
        Object.keys(settingsDefinitions).forEach(sectionKey => {
            const section = settingsDefinitions[sectionKey];
            section.settings.forEach(setting => {
                const input = document.getElementById(`setting-${setting.id}`);
                if (input) {
                    if (setting.type === 'toggle') {
                        preferences[setting.id] = input.checked;
                    } else if (setting.type === 'slider' || setting.type === 'select') {
                        preferences[setting.id] = input.value;
                    } else {
                        preferences[setting.id] = input.value;
                    }
                }
            });
        });
        
        // 应用设置
        applySettings(preferences);
        
        // 保存
        if (window.StorageManager) {
            StorageManager.save('userPreferences', preferences);
        }
        
        if (window.UserExperience) {
            UserExperience.updateConfig(preferences);
        }
        
        // 显示成功提示
        showSaveSuccess();
        
        // 关闭面板
        closePanel();
    }

    /**
     * 应用设置
     */
    function applySettings(preferences) {
        // 应用主题
        if (preferences.theme && window.ThemeManager) {
            ThemeManager.applyTheme(preferences.theme);
        }
        
        // 应用音效
        if (preferences.audioEnabled !== undefined && window.AudioManager) {
            AudioManager.setEnabled(preferences.audioEnabled);
        }
        
        if (preferences.masterVolume !== undefined && window.AudioManager) {
            AudioManager.setMasterVolume(preferences.masterVolume / 100);
        }
        
        if (preferences.sfxVolume !== undefined && window.AudioManager) {
            AudioManager.setSfxVolume(preferences.sfxVolume / 100);
        }
        
        // 应用提示
        if (preferences.showTooltips !== undefined && window.UserExperience) {
            UserExperience.updateConfig({ showTooltips: preferences.showTooltips });
        }
        
        if (preferences.autoHints !== undefined && window.UserExperience) {
            UserExperience.updateConfig({ autoHints: preferences.autoHints });
        }
    }

    /**
     * 重置设置
     */
    function resetSettings() {
        if (confirm('确定要恢复所有默认设置吗？')) {
            // 关闭面板
            closePanel();
            
            // 重新加载页面
            location.reload();
        }
    }

    /**
     * 关闭面板
     */
    function closePanel() {
        const panel = document.getElementById('settings-panel-overlay');
        if (panel) {
            panel.remove();
        }
    }

    /**
     * 显示保存成功提示
     */
    function showSaveSuccess() {
        const toast = document.createElement('div');
        toast.className = 'save-toast';
        toast.innerHTML = '✅ 设置已保存';
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 255, 0, 0.9);
            color: #000;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 100001;
            box-shadow: 0 4px 20px rgba(0, 255, 0, 0.5);
            animation: toastSlideIn 0.3s ease, toastSlideOut 0.3s ease 2s forwards;
        `;
        
        document.body.appendChild(toast);
        
        // 添加动画
        if (!document.getElementById('toast-animation')) {
            const style = document.createElement('style');
            style.id = 'toast-animation';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => toast.remove(), 2500);
    }

    /**
     * 添加设置面板样式
     */
    function addSettingsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .settings-panel {
                background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
                border: 2px solid #00ff00;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #333;
            }
            
            .settings-header h2 {
                color: #00ff00;
                margin: 0;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 32px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .settings-body {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .settings-tabs {
                width: 200px;
                background: rgba(0, 0, 0, 0.3);
                padding: 20px 10px;
                overflow-y: auto;
            }
            
            .settings-tab {
                display: block;
                width: 100%;
                padding: 12px 15px;
                margin-bottom: 10px;
                background: transparent;
                border: 1px solid #333;
                border-radius: 8px;
                color: #aaa;
                text-align: left;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }
            
            .settings-tab:hover {
                background: rgba(0, 255, 0, 0.1);
                border-color: #00ff00;
            }
            
            .settings-tab.active {
                background: rgba(0, 255, 0, 0.2);
                border-color: #00ff00;
                color: #00ff00;
            }
            
            .settings-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            
            .settings-section {
                max-width: 500px;
            }
            
            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #333;
            }
            
            .setting-item label {
                color: #fff;
                font-size: 15px;
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #333;
                border-radius: 30px;
                transition: 0.3s;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 24px;
                width: 24px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                border-radius: 50%;
                transition: 0.3s;
            }
            
            .toggle-switch input:checked + .toggle-slider {
                background-color: #00ff00;
            }
            
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(30px);
            }
            
            .slider-container {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .slider-container input[type="range"] {
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: #333;
                outline: none;
                -webkit-appearance: none;
            }
            
            .slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #00ff00;
                cursor: pointer;
            }
            
            .slider-value {
                min-width: 40px;
                text-align: right;
                color: #00ff00;
                font-weight: bold;
            }
            
            select {
                padding: 8px 15px;
                background: #1a1a2e;
                border: 1px solid #333;
                border-radius: 8px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
            }
            
            select:focus {
                outline: none;
                border-color: #00ff00;
            }
            
            .settings-footer {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                padding: 20px;
                border-top: 1px solid #333;
            }
            
            .btn-save, .btn-reset {
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.3s;
                border: none;
            }
            
            .btn-save {
                background: linear-gradient(135deg, #00ff00, #00aa00);
                color: #000;
            }
            
            .btn-save:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            }
            
            .btn-reset {
                background: transparent;
                color: #ff4444;
                border: 2px solid #ff4444;
            }
            
            .btn-reset:hover {
                background: rgba(255, 68, 68, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // 公开 API
    return {
        init,
        showSettingsPanel,
        closePanel,
        saveSettings,
        resetSettings,
        switchTab
    };
})();

// 导出到全局作用域
window.SettingsPanel = SettingsPanel;

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SettingsPanel.init());
} else {
    SettingsPanel.init();
}
