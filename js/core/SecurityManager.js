/**
 * SecurityManager.js - 安全管理器
 * 功能：输入验证、XSS 防护、权限控制、数据加密
 * 版本：v4.0
 * 作者：QHT System
 */

const SecurityManager = (function() {
    'use strict';
    
    // 配置
    const config = {
        enableXSSProtection: true,
        enableInputValidation: true,
        enablePermissionCheck: true,
        maxInputLength: 500,
        allowedTags: ['b', 'i', 'em', 'strong', 'span'],
        debug: false
    };
    
    // 权限级别
    const PERMISSION_LEVELS = {
        GUEST: 0,
        USER: 1,
        ADVANCED: 2,
        ADMIN: 3,
        DEVELOPER: 4
    };
    
    // 当前用户权限级别
    let currentPermissionLevel = PERMISSION_LEVELS.USER;
    
    // 功能权限映射
    const PERMISSION_MAP = {
        // 基础功能
        'execute_basic': PERMISSION_LEVELS.USER,
        'execute_letter': PERMISSION_LEVELS.USER,
        
        // 高级功能
        'execute_advanced': PERMISSION_LEVELS.ADVANCED,
        'execute_number': PERMISSION_LEVELS.ADVANCED,
        
        // 系统功能
        'access_settings': PERMISSION_LEVELS.USER,
        'modify_settings': PERMISSION_LEVELS.ADVANCED,
        'clear_logs': PERMISSION_LEVELS.ADMIN,
        'reset_system': PERMISSION_LEVELS.ADMIN,
        
        // 开发功能
        'debug_mode': PERMISSION_LEVELS.DEVELOPER,
        'dev_tools': PERMISSION_LEVELS.DEVELOPER
    };
    
    /**
     * HTML 实体编码（防 XSS）
     * @param {string} str - 输入字符串
     * @returns {string} 编码后的字符串
     */
    function encodeHTML(str) {
        if (typeof str !== 'string') {
            return str;
        }
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * HTML 实体解码
     * @param {string} str - 编码后的字符串
     * @returns {string} 解码后的字符串
     */
    function decodeHTML(str) {
        if (typeof str !== 'string') {
            return str;
        }
        
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent;
    }
    
    /**
     * 检测 XSS 攻击
     * @param {string} input - 输入字符串
     * @returns {boolean} 是否检测到 XSS
     */
    function detectXSS(input) {
        if (!config.enableXSSProtection) {
            return false;
        }
        
        const xssPatterns = [
            /<script\b/i,
            /<\/script>/i,
            /javascript:/i,
            /vbscript:/i,
            /on\w+\s*=/i,  // onclick=, onerror= 等
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /<svg.*onload/i,
            /<img.*onerror/i,
            /expression\s*\(/i,
            /url\s*\(/i,
            /data:\s*text\/html/i,
            /<meta/i,
            /<link/i,
            /<style/i,
            /document\./i,
            /window\./i,
            /eval\s*\(/i,
            /alert\s*\(/i
        ];
        
        return xssPatterns.some(pattern => pattern.test(input));
    }
    
    /**
     * 清理输入（移除危险标签）
     * @param {string} input - 输入字符串
     * @returns {string} 清理后的字符串
     */
    function sanitize(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        // 移除所有 HTML 标签
        let sanitized = input.replace(/<[^>]*>/g, '');
        
        // 移除特殊字符
        sanitized = sanitized.replace(/[<>\"'&]/g, '');
        
        return sanitized;
    }
    
    /**
     * 验证输入
     * @param {string} input - 输入字符串
     * @param {Object} rules - 验证规则
     * @returns {Object} 验证结果
     */
    function validateInput(input, rules = {}) {
        if (!config.enableInputValidation) {
            return {
                valid: true,
                sanitized: input,
                errors: []
            };
        }
        
        const errors = [];
        
        // 类型检查
        if (rules.type) {
            switch (rules.type) {
                case 'string':
                    if (typeof input !== 'string') {
                        errors.push('输入必须是字符串');
                    }
                    break;
                case 'number':
                    if (isNaN(Number(input))) {
                        errors.push('输入必须是数字');
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input)) {
                        errors.push('邮箱格式不正确');
                    }
                    break;
                case 'alphanumeric':
                    if (!/^[a-zA-Z0-9]+$/.test(input)) {
                        errors.push('只能包含字母和数字');
                    }
                    break;
            }
        }
        
        // 长度验证
        const maxLength = rules.maxLength || config.maxInputLength;
        const minLength = rules.minLength || 0;
        
        if (input && input.length > maxLength) {
            errors.push(`输入长度不能超过 ${maxLength} 个字符`);
        }
        
        if (input && input.length < minLength) {
            errors.push(`输入长度不能少于 ${minLength} 个字符`);
        }
        
        // 格式验证
        if (rules.pattern && !rules.pattern.test(input)) {
            errors.push('输入格式不正确');
        }
        
        // XSS 检测
        if (rules.xss !== false && detectXSS(input)) {
            errors.push('检测到潜在的安全威胁');
        }
        
        // 空值验证
        if (rules.required && (!input || input.trim() === '')) {
            errors.push('此项为必填项');
        }
        
        return {
            valid: errors.length === 0,
            sanitized: sanitize(input),
            encoded: encodeHTML(input),
            errors,
            input
        };
    }
    
    /**
     * 检查权限
     * @param {string} feature - 功能名称
     * @returns {boolean} 是否有权限
     */
    function hasPermission(feature) {
        if (!config.enablePermissionCheck) {
            return true;
        }
        
        const required = PERMISSION_MAP[feature];
        
        if (required === undefined) {
            if (config.debug) {
                console.warn(`[Security] 未定义的功能权限：${feature}`);
            }
            return false;
        }
        
        return currentPermissionLevel >= required;
    }
    
    /**
     * 检查权限并执行回调
     * @param {string} feature - 功能名称
     * @param {Function} callback - 回调函数
     * @param {Function} onDenied - 拒绝时的回调
     * @returns {boolean} 是否有权限
     */
    function checkPermission(feature, callback, onDenied) {
        if (hasPermission(feature)) {
            if (callback) {
                callback();
            }
            return true;
        } else {
            if (onDenied) {
                onDenied();
            } else {
                showPermissionDenied(feature);
            }
            return false;
        }
    }
    
    /**
     * 显示权限拒绝提示
     * @param {string} feature - 功能名称
     */
    function showPermissionDenied(feature) {
        const messages = {
            'execute_advanced': '需要高级用户权限',
            'execute_number': '需要高级用户权限',
            'modify_settings': '需要高级用户权限',
            'clear_logs': '需要管理员权限',
            'reset_system': '需要管理员权限',
            'debug_mode': '需要开发者权限',
            'dev_tools': '需要开发者权限'
        };
        
        const message = messages[feature] || '权限不足，无法执行此操作';
        
        // 使用通知系统
        if (window.NotificationSystem) {
            NotificationSystem.warning('⚠️ 权限不足', message);
        }
        
        // 添加到日志
        if (window.Application) {
            Application.addLog(`⚠️ ${message}`, 'warning');
        }
        
        console.warn(`[Security] Permission denied for: ${feature}`);
    }
    
    /**
     * 设置用户权限级别
     * @param {number} level - 权限级别
     */
    function setPermissionLevel(level) {
        currentPermissionLevel = level;
        console.log(`[Security] Permission level set to: ${getPermissionLevelName(level)}`);
        
        // 更新 UI
        updateUIByPermission();
    }
    
    /**
     * 获取权限级别名称
     * @param {number} level - 权限级别
     * @returns {string}
     */
    function getPermissionLevelName(level) {
        const names = {
            [PERMISSION_LEVELS.GUEST]: '访客',
            [PERMISSION_LEVELS.USER]: '用户',
            [PERMISSION_LEVELS.ADVANCED]: '高级用户',
            [PERMISSION_LEVELS.ADMIN]: '管理员',
            [PERMISSION_LEVELS.DEVELOPER]: '开发者'
        };
        return names[level] || '未知';
    }
    
    /**
     * 根据权限更新 UI
     */
    function updateUIByPermission() {
        // 禁用无权限的功能
        document.querySelectorAll('[data-permission]').forEach(el => {
            const permission = el.dataset.permission;
            const hasPerm = hasPermission(permission);
            
            if (!hasPerm) {
                el.disabled = true;
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
                el.title = '权限不足';
            }
        });
        
        // 隐藏无权限的功能
        document.querySelectorAll('[data-requires-permission]').forEach(el => {
            const permission = el.dataset.requiresPermission;
            const hasPerm = hasPermission(permission);
            
            el.style.display = hasPerm ? '' : 'none';
        });
    }
    
    /**
     * 安全地添加日志
     * @param {string} text - 日志文本
     * @param {string} type - 日志类型
     */
    function addSafeLog(text, type = 'info') {
        const safeText = encodeHTML(text);
        
        if (window.Application) {
            Application.addLog(safeText, type);
        } else if (window.UIModule) {
            UIModule.addLog(safeText, type);
        }
    }
    
    /**
     * 生成安全令牌
     * @param {number} length - 令牌长度
     * @returns {string}
     */
    function generateToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            for (let i = 0; i < length; i++) {
                token += chars[array[i] % chars.length];
            }
        } else {
            for (let i = 0; i < length; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        return token;
    }
    
    /**
     * 简单的数据加密（Base64 + 异或）
     * @param {string} data - 原始数据
     * @returns {string} 加密后的数据
     */
    function encrypt(data) {
        const key = 'QHT_SECURITY_KEY_V4';
        let encrypted = '';
        
        for (let i = 0; i < data.length; i++) {
            const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }
        
        return btoa(encrypted);
    }
    
    /**
     * 数据解密
     * @param {string} encrypted - 加密后的数据
     * @returns {string} 原始数据
     */
    function decrypt(encrypted) {
        const key = 'QHT_SECURITY_KEY_V4';
        const decoded = atob(encrypted);
        let decrypted = '';
        
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        
        return decrypted;
    }
    
    /**
     * 获取安全配置
     * @returns {Object}
     */
    function getConfig() {
        return { ...config };
    }
    
    /**
     * 更新安全配置
     * @param {Object} newConfig - 新配置
     */
    function updateConfig(newConfig) {
        Object.assign(config, newConfig);
        console.log('[Security] Configuration updated:', config);
    }
    
    /**
     * 导出安全报告
     * @returns {Object}
     */
    function exportReport() {
        return {
            config: getConfig(),
            permissionLevel: getPermissionLevelName(currentPermissionLevel),
            features: Object.keys(PERMISSION_MAP),
            securityChecks: {
                xssProtection: config.enableXSSProtection,
                inputValidation: config.enableInputValidation,
                permissionCheck: config.enablePermissionCheck
            }
        };
    }
    
    // 公开 API
    return {
        // 初始化
        init: function() {
            console.log('[SecurityManager] Initialized');
            updateUIByPermission();
        },
        
        // 输入验证
        encodeHTML,
        decodeHTML,
        detectXSS,
        sanitize,
        validateInput,
        addSafeLog,
        
        // 权限控制
        hasPermission,
        checkPermission,
        setPermissionLevel,
        getPermissionLevelName,
        updateUIByPermission,
        
        // 加密解密
        generateToken,
        encrypt,
        decrypt,
        
        // 配置管理
        getConfig,
        updateConfig,
        exportReport,
        
        // 权限级别常量
        PERMISSION_LEVELS
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.SecurityManager = SecurityManager;
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SecurityManager.init());
    } else {
        SecurityManager.init();
    }
}
