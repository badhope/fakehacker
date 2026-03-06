/* ==========================================
   模块名称：systems/StorageManager.js
   功能：本地存储管理，保存用户数据、设置、进度等
   版本：2.0 - 新增存储系统
   ========================================== */

/**
 * 存储管理器 - 统一管理本地存储数据
 */
const StorageManager = (function() {
    // 存储键前缀
    const STORAGE_PREFIX = 'qht_';
    
    // 内存缓存
    const cache = {};
    
    // 默认设置
    const defaultSettings = {
        audioEnabled: true,
        masterVolume: 0.3,
        sfxVolume: 0.5,
        theme: 'dark',
        language: 'zh-CN',
        showTips: true,
        autoSave: true
    };
    
    // 默认玩家数据
    const defaultPlayerData = {
        level: 1,
        experience: 0,
        totalCommands: 0,
        successfulHacks: 0,
        failedHacks: 0,
        achievements: [],
        unlockedThemes: ['dark'],
        unlockedEffects: ['matrix'],
        lastPlayTime: null,
        totalPlayTime: 0
    };

    /**
     * 初始化存储管理器
     */
    function init() {
        // 加载设置
        const settings = load('settings');
        if (!settings) {
            save('settings', defaultSettings);
        }
        
        // 加载玩家数据
        const playerData = load('playerData');
        if (!playerData) {
            save('playerData', defaultPlayerData);
        }
        
        console.log("StorageManager initialized");
    }

    /**
     * 保存数据
     */
    function save(key, data) {
        try {
            const storageKey = STORAGE_PREFIX + key;
            cache[key] = data;
            localStorage.setItem(storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn("Storage save error:", e);
            return false;
        }
    }

    /**
     * 加载数据
     */
    function load(key, defaultValue = null) {
        try {
            // 先尝试缓存
            if (cache[key] !== undefined) {
                return cache[key];
            }
            
            // 从 localStorage 加载
            const storageKey = STORAGE_PREFIX + key;
            const item = localStorage.getItem(storageKey);
            
            if (item) {
                const data = JSON.parse(item);
                cache[key] = data;
                return data;
            }
            
            return defaultValue;
        } catch (e) {
            console.warn("Storage load error:", e);
            return defaultValue;
        }
    }

    /**
     * 删除数据
     */
    function remove(key) {
        try {
            const storageKey = STORAGE_PREFIX + key;
            localStorage.removeItem(storageKey);
            delete cache[key];
            return true;
        } catch (e) {
            console.warn("Storage remove error:", e);
            return false;
        }
    }

    /**
     * 清空所有数据
     */
    function clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            Object.keys(cache).forEach(key => {
                delete cache[key];
            });
            return true;
        } catch (e) {
            console.warn("Storage clear error:", e);
            return false;
        }
    }

    // ==================== 设置相关 ====================
    
    /**
     * 获取设置
     */
    function getSettings() {
        return load('settings', defaultSettings);
    }

    /**
     * 更新设置
     */
    function updateSettings(updates) {
        const settings = getSettings();
        Object.assign(settings, updates);
        save('settings', settings);
        return settings;
    }

    /**
     * 获取单个设置项
     */
    function getSetting(key, defaultValue = null) {
        const settings = getSettings();
        return key in settings ? settings[key] : defaultValue;
    }

    /**
     * 设置单个设置项
     */
    function setSetting(key, value) {
        return updateSettings({ [key]: value });
    }

    // ==================== 玩家数据相关 ====================
    
    /**
     * 获取玩家数据
     */
    function getPlayerData() {
        return load('playerData', defaultPlayerData);
    }

    /**
     * 更新玩家数据
     */
    function updatePlayerData(updates) {
        const playerData = getPlayerData();
        Object.assign(playerData, updates);
        save('playerData', playerData);
        return playerData;
    }

    /**
     * 增加经验值
     */
    function addExperience(amount) {
        const playerData = getPlayerData();
        playerData.experience += amount;
        
        // 检查升级
        const levelUpThreshold = playerData.level * 100;
        if (playerData.experience >= levelUpThreshold) {
            playerData.experience -= levelUpThreshold;
            playerData.level++;
            
            if (Application) {
                Application.addLog(`LEVEL UP! You are now level ${playerData.level}`, 'success');
            }
            
            // 播放升级音效
            if (window.AudioManager) {
                AudioManager.play('power-up');
            }
        }
        
        save('playerData', playerData);
        return playerData;
    }

    /**
     * 增加命令执行次数
     */
    function incrementCommandCount(success = true) {
        const playerData = getPlayerData();
        playerData.totalCommands++;
        
        if (success) {
            playerData.successfulHacks++;
        } else {
            playerData.failedHacks++;
        }
        
        save('playerData', playerData);
    }

    /**
     * 解锁成就
     */
    function unlockAchievement(achievementId) {
        const playerData = getPlayerData();
        
        if (!playerData.achievements.includes(achievementId)) {
            playerData.achievements.push(achievementId);
            save('playerData', playerData);
            
            if (Application) {
                Application.addLog(`ACHIEVEMENT UNLOCKED: ${achievementId}`, 'success');
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * 检查成就是否已解锁
     */
    function hasAchievement(achievementId) {
        const playerData = getPlayerData();
        return playerData.achievements.includes(achievementId);
    }

    /**
     * 解锁主题
     */
    function unlockTheme(themeId) {
        const playerData = getPlayerData();
        
        if (!playerData.unlockedThemes.includes(themeId)) {
            playerData.unlockedThemes.push(themeId);
            save('playerData', playerData);
            return true;
        }
        
        return false;
    }

    /**
     * 更新最后游玩时间
     */
    function updateLastPlayTime() {
        const playerData = getPlayerData();
        const now = Date.now();
        
        if (playerData.lastPlayTime) {
            // 计算总游玩时间（秒）
            const delta = Math.floor((now - playerData.lastPlayTime) / 1000);
            playerData.totalPlayTime += delta;
        }
        
        playerData.lastPlayTime = now;
        save('playerData', playerData);
    }

    /**
     * 获取统计数据
     */
    function getStats() {
        const playerData = getPlayerData();
        return {
            level: playerData.level,
            experience: playerData.experience,
            totalCommands: playerData.totalCommands,
            successfulHacks: playerData.successfulHacks,
            failedHacks: playerData.failedHacks,
            achievements: playerData.achievements.length,
            totalPlayTime: playerData.totalPlayTime
        };
    }

    // 公开 API
    return {
        init,
        save,
        load,
        remove,
        clear,
        getSettings,
        updateSettings,
        getSetting,
        setSetting,
        getPlayerData,
        updatePlayerData,
        addExperience,
        incrementCommandCount,
        unlockAchievement,
        hasAchievement,
        unlockTheme,
        updateLastPlayTime,
        getStats
    };
})();

// 导出到全局作用域
window.StorageManager = StorageManager;
