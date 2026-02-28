/* ==========================================
   文件名：js/utils.js
   功能：通用工具函数库
   ========================================== */

const Utils = {
    // --- 1. 时间日期处理 ---
    
    // 格式化时间 (HH:MM:SS)
    formatTime: function(date) {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    // 格式化日期
    formatDate: function(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    // --- 2. 随机数据生成 ---
    
    // 范围内随机整数
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 生成随机ID
    generateId: function(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // 生成随机IPv4地址
    generateIP: function() {
        return `${this.randomInt(1,255)}.${this.randomInt(0,255)}.${this.randomInt(0,255)}.${this.randomInt(0,255)}`;
    },

    // 生成随机IPv6地址
    generateIPv6: function() {
        const parts = [];
        for (let i = 0; i < 8; i++) {
            parts.push(Math.floor(Math.random() * 65535).toString(16).padStart(4, '0'));
        }
        return parts.join(':');
    },

    // 生成随机MAC地址
    generateMAC: function() {
        const hexDigits = "0123456789ABCDEF";
        let mac = "";
        for (let i = 0; i < 6; i++) {
            mac += hexDigits.charAt(Math.round(Math.random() * 15));
            mac += hexDigits.charAt(Math.round(Math.random() * 15));
            if (i !== 5) mac += ":";
        }
        return mac;
    },

    // 生成随机哈希值
    generateHash: function(length = 32) {
        const chars = 'abcdef0123456789';
        let hash = '';
        for (let i = 0; i < length; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    },

    // --- 3. 字符串处理 ---
    
    // 打字机效果 (用于日志输出)
    typeWriter: function(element, text, speed = 50, callback = null) {
        let i = 0;
        element.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        };
        
        type();
    },

    // --- 4. 音频处理 ---
    
    // 生成简单的蜂鸣声 {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume;

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("Audio not supported");
        }
    },

    // --- 5. 浏览器相关 ---
    
    // 全屏切换
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    },

    // 复制文本到剪贴板
    copyToClipboard: function(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        return true;
    }
};
