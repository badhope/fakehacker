/* ==========================================
   模块名称：systems/ThemeManager.js
   功能：主题管理系统，支持多主题切换
   版本：2.0 - 新增主题系统
   ========================================== */

/**
 * 主题管理器 - 管理多主题切换和自定义
 */
const ThemeManager = (function() {
    // 当前主题
    let currentTheme = 'dark';
    
    // 可用主题列表
    const themes = {
        'dark': {
            name: '暗色主题',
            file: 'css/themes/dark.css',
            colors: {
                primary: '#00ff00',
                bg: '#050505',
                accent: '#00ffff'
            }
        },
        'light': {
            name: '亮色主题',
            file: null, // 使用 CSS 变量
            colors: {
                primary: '#00aa00',
                bg: '#f0f0f0',
                accent: '#0066cc'
            }
        },
        'cyberpunk': {
            name: '赛博朋克',
            file: null,
            colors: {
                primary: '#ff00ff',
                bg: '#0a0a1a',
                accent: '#00ffff'
            }
        },
        'matrix': {
            name: '矩阵',
            file: null,
            colors: {
                primary: '#00ff00',
                bg: '#000000',
                accent: '#00ff00'
            }
        },
        'solarized': {
            name: '太阳能',
            file: null,
            colors: {
                primary: '#859900',
                bg: '#002b36',
                accent: '#2aa198'
            }
        }
    };

    /**
     * 初始化主题管理器
     */
    function init() {
        // 从存储中加载主题
        if (window.StorageManager) {
            currentTheme = StorageManager.getSetting('theme', 'dark');
        }
        
        applyTheme(currentTheme);
        console.log("ThemeManager initialized");
    }

    /**
     * 应用主题
     */
    function applyTheme(themeId) {
        const theme = themes[themeId];
        if (!theme) {
            console.warn(`Theme not found: ${themeId}`);
            return false;
        }
        
        // 设置 HTML 的 data-theme 属性
        document.documentElement.setAttribute('data-theme', themeId);
        
        // 更新主题链接
        if (theme.file) {
            const themeLink = document.getElementById('theme-link');
            if (themeLink) {
                themeLink.href = theme.file;
            }
        }
        
        // 更新 CSS 变量
        if (theme.colors) {
            const root = document.documentElement;
            root.style.setProperty('--main-color', theme.colors.primary);
            root.style.setProperty('--bg-color', theme.colors.bg);
            root.style.setProperty('--accent-color', theme.colors.accent);
        }
        
        currentTheme = themeId;
        
        // 保存主题设置
        if (window.StorageManager) {
            StorageManager.setSetting('theme', themeId);
        }
        
        if (window.Application) {
            Application.addLog(`Theme changed to: ${theme.name}`, 'success');
        }
        
        return true;
    }

    /**
     * 获取当前主题
     */
    function getCurrentTheme() {
        return currentTheme;
    }

    /**
     * 获取所有可用主题
     */
    function getAvailableThemes() {
        return Object.keys(themes).map(key => ({
            id: key,
            name: themes[key].name,
            colors: themes[key].colors
        }));
    }

    /**
     * 切换下一个主题
     */
    function nextTheme() {
        const themeIds = Object.keys(themes);
        const currentIndex = themeIds.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeIds.length;
        applyTheme(themeIds[nextIndex]);
    }

    /**
     * 注册新主题
     */
    function registerTheme(id, config) {
        themes[id] = config;
        console.log(`Theme registered: ${id}`);
    }

    /**
     * 自定义主题颜色
     */
    function customizeTheme(themeId, colors) {
        if (!themes[themeId]) {
            console.warn(`Theme not found: ${themeId}`);
            return false;
        }
        
        themes[themeId].colors = { ...themes[themeId].colors, ...colors };
        
        if (currentTheme === themeId) {
            applyTheme(themeId);
        }
        
        return true;
    }

    /**
     * 重置为主题默认值
     */
    function resetTheme(themeId) {
        if (!themes[themeId]) return false;
        
        // 这里可以从存储中读取默认值并重置
        applyTheme(themeId);
        return true;
    }

    // 公开 API
    return {
        init,
        applyTheme,
        getCurrentTheme,
        getAvailableThemes,
        nextTheme,
        registerTheme,
        customizeTheme,
        resetTheme
    };
})();

// 导出到全局作用域
window.ThemeManager = ThemeManager;
