/* ==========================================
   模块名称：systems/QuestSystem.js
   功能：任务系统、每日挑战、成就管理
   版本：3.0 - 游戏化功能增强
   ========================================== */

/**
 * 任务系统 - 增强用户粘性和游戏性
 */
const QuestSystem = (function() {
    // 任务配置
    const questConfig = {
        dailyQuests: 3, // 每日任务数量
        maxActiveQuests: 10,
        questResetHour: 5 // 每日 5 点重置
    };

    // 任务类型
    const questTypes = {
        execute: {
            name: '执行指令',
            description: '执行 {count} 次指令',
            check: (data, progress) => progress.executed >= data.count
        },
        combo: {
            name: '连击大师',
            description: '连续执行 {count} 次不同指令',
            check: (data, progress) => progress.combo >= data.count
        },
        explore: {
            name: '探索者',
            description: '尝试所有指令',
            check: (data, progress) => progress.unique >= 26
        },
        time: {
            name: '时间投入',
            description: '使用应用 {minutes} 分钟',
            check: (data, progress) => progress.time >= data.minutes
        },
        effect: {
            name: '特效大师',
            description: '触发 {count} 次特效',
            check: (data, progress) => progress.effects >= data.count
        }
    };

    // 成就配置
    const achievements = {
        'first_step': {
            name: '第一步',
            description: '执行第一次指令',
            icon: '🎯',
            reward: 10,
            condition: { type: 'execute', count: 1 }
        },
        'hacker_novice': {
            name: '新手黑客',
            description: '执行 50 次指令',
            icon: '💻',
            reward: 50,
            condition: { type: 'execute', count: 50 }
        },
        'hacker_expert': {
            name: '黑客专家',
            description: '执行 500 次指令',
            icon: '🔥',
            reward: 200,
            condition: { type: 'execute', count: 500 }
        },
        'combo_master': {
            name: '连击大师',
            description: '连续执行 10 次不同指令',
            icon: '⚡',
            reward: 100,
            condition: { type: 'combo', count: 10 }
        },
        'explorer': {
            name: '探索者',
            description: '尝试所有 26 个字母指令',
            icon: '🌍',
            reward: 150,
            condition: { type: 'explore', count: 1 }
        },
        'effect_master': {
            name: '特效大师',
            description: '触发 100 次特效',
            icon: '✨',
            reward: 120,
            condition: { type: 'effect', count: 100 }
        },
        'dedicated': {
            name: '忠实用户',
            description: '累计使用 60 分钟',
            icon: '⏰',
            reward: 180,
            condition: { type: 'time', minutes: 60 }
        },
        'speed_demon': {
            name: '极速狂魔',
            description: '10 秒内执行 20 次指令',
            icon: '🚀',
            reward: 250,
            condition: { type: 'speed', count: 20, time: 10 }
        }
    };

    // 每日任务模板
    const dailyQuestTemplates = [
        { type: 'execute', count: 10, reward: 20 },
        { type: 'execute', count: 25, reward: 40 },
        { type: 'execute', count: 50, reward: 70 },
        { type: 'combo', count: 5, reward: 30 },
        { type: 'combo', count: 8, reward: 50 },
        { type: 'effect', count: 5, reward: 25 },
        { type: 'effect', count: 10, reward: 45 },
        { type: 'time', minutes: 10, reward: 30 },
        { type: 'time', minutes: 30, reward: 60 }
    ];

    // 玩家数据
    let playerData = {
        quests: [],
        achievements: [],
        progress: {
            executed: 0,
            combo: 0,
            unique: 0,
            time: 0,
            effects: 0,
            lastExecuted: null,
            executedCommands: new Set()
        },
        lastQuestReset: null,
        totalRewards: 0
    };

    /**
     * 初始化任务系统
     */
    function init() {
        loadPlayerData();
        checkDailyReset();
        startTracking();
        console.log("QuestSystem initialized");
    }

    /**
     * 加载玩家数据
     */
    function loadPlayerData() {
        if (window.StorageManager) {
            const saved = StorageManager.load('questData');
            if (saved) {
                playerData = { ...playerData, ...saved };
                playerData.progress.executedCommands = new Set(playerData.progress.executedCommands || []);
            }
        }
    }

    /**
     * 保存玩家数据
     */
    function savePlayerData() {
        if (window.StorageManager) {
            const toSave = {
                ...playerData,
                progress: {
                    ...playerData.progress,
                    executedCommands: Array.from(playerData.progress.executedCommands)
                }
            };
            StorageManager.save('questData', toSave);
        }
    }

    /**
     * 检查每日重置
     */
    function checkDailyReset() {
        const now = new Date();
        const lastReset = playerData.lastQuestReset ? new Date(playerData.lastQuestReset) : null;
        
        if (!lastReset || 
            now.getDate() !== lastReset.getDate() ||
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()) {
            
            if (now.getHours() >= questConfig.questResetHour) {
                resetDailyQuests();
            }
        }
    }

    /**
     * 重置每日任务
     */
    function resetDailyQuests() {
        playerData.quests = generateDailyQuests();
        playerData.lastQuestReset = new Date().toISOString();
        playerData.progress.combo = 0;
        
        savePlayerData();
        
        if (window.Application) {
            Application.addLog('📋 每日任务已刷新！', 'success');
        }
        
        showQuestNotification();
    }

    /**
     * 生成每日任务
     */
    function generateDailyQuests() {
        const quests = [];
        const shuffled = dailyQuestTemplates.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < questConfig.dailyQuests && i < shuffled.length; i++) {
            const template = shuffled[i];
            quests.push({
                id: `daily_${Date.now()}_${i}`,
                type: template.type,
                ...template,
                progress: 0,
                completed: false,
                claimed: false,
                isDaily: true
            });
        }
        
        return quests;
    }

    /**
     * 开始跟踪进度
     */
    function startTracking() {
        // 跟踪执行次数
        setInterval(() => {
            playerData.progress.time += 1;
            checkQuestProgress('time', playerData.progress.time);
            savePlayerData();
        }, 60000); // 每分钟
    }

    /**
     * 跟踪指令执行
     */
    function trackCommand(key) {
        playerData.progress.executed++;
        playerData.progress.executedCommands.add(key);
        playerData.progress.unique = playerData.progress.executedCommands.size;
        
        // 连击检测
        const now = Date.now();
        if (playerData.progress.lastExecuted && now - playerData.progress.lastExecuted < 5000) {
            playerData.progress.combo++;
        } else {
            playerData.progress.combo = 1;
        }
        playerData.progress.lastExecuted = now;
        
        // 检查成就
        checkAchievements();
        
        // 检查任务进度
        checkAllQuests();
        
        savePlayerData();
    }

    /**
     * 跟踪特效触发
     */
    function trackEffect() {
        playerData.progress.effects++;
        checkQuestProgress('effect', playerData.progress.effects);
        savePlayerData();
    }

    /**
     * 检查所有任务
     */
    function checkAllQuests() {
        playerData.quests.forEach(quest => {
            if (!quest.completed && !quest.claimed) {
                checkQuestProgress(quest.type, getProgressForType(quest.type));
            }
        });
    }

    /**
     * 获取类型对应的进度
     */
    function getProgressForType(type) {
        switch(type) {
            case 'execute': return playerData.progress.executed;
            case 'combo': return playerData.progress.combo;
            case 'explore': return playerData.progress.unique;
            case 'time': return playerData.progress.time;
            case 'effect': return playerData.progress.effects;
            default: return 0;
        }
    }

    /**
     * 检查任务进度
     */
    function checkQuestProgress(type, value) {
        playerData.quests.forEach(quest => {
            if (quest.type === type && !quest.completed && !quest.claimed) {
                const target = quest.count || quest.minutes;
                quest.progress = Math.min(value, target);
                
                if (value >= target) {
                    quest.completed = true;
                    showQuestCompleteNotification(quest);
                }
            }
        });
    }

    /**
     * 检查成就
     */
    function checkAchievements() {
        Object.keys(achievements).forEach(id => {
            if (!playerData.achievements.includes(id)) {
                const achievement = achievements[id];
                if (checkAchievementCondition(achievement.condition)) {
                    unlockAchievement(id);
                }
            }
        });
    }

    /**
     * 检查成就条件
     */
    function checkAchievementCondition(condition) {
        switch(condition.type) {
            case 'execute':
                return playerData.progress.executed >= condition.count;
            case 'combo':
                return playerData.progress.combo >= condition.count;
            case 'explore':
                return playerData.progress.unique >= 26;
            case 'time':
                return playerData.progress.time >= condition.minutes;
            case 'effect':
                return playerData.progress.effects >= condition.count;
            default:
                return false;
        }
    }

    /**
     * 解锁成就
     */
    function unlockAchievement(id) {
        playerData.achievements.push(id);
        const achievement = achievements[id];
        
        playerData.totalRewards += achievement.reward;
        
        if (window.Application) {
            Application.addLog(`🏆 成就解锁：${achievement.name}`, 'success');
            Application.addLog(`   奖励：+${achievement.reward} 经验`, 'info');
        }
        
        if (window.StorageManager) {
            StorageManager.addExperience(achievement.reward);
            StorageManager.unlockAchievement(id);
        }
        
        showAchievementNotification(achievement);
        savePlayerData();
    }

    /**
     * 领取任务奖励
     */
    function claimQuestReward(questId) {
        const quest = playerData.quests.find(q => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) {
            return false;
        }
        
        quest.claimed = true;
        playerData.totalRewards += quest.reward;
        
        if (window.Application) {
            Application.addLog(`✅ 领取任务奖励：+${quest.reward} 经验`, 'success');
        }
        
        if (window.StorageManager) {
            StorageManager.addExperience(quest.reward);
        }
        
        savePlayerData();
        return true;
    }

    /**
     * 获取当前任务
     */
    function getQuests() {
        return playerData.quests;
    }

    /**
     * 获取成就列表
     */
    function getAchievements() {
        return {
            unlocked: playerData.achievements,
            total: Object.keys(achievements),
            details: achievements
        };
    }

    /**
     * 获取统计数据
     */
    function getStats() {
        return {
            ...playerData.progress,
            totalRewards: playerData.totalRewards,
            achievementsUnlocked: playerData.achievements.length,
            totalAchievements: Object.keys(achievements).length
        };
    }

    /**
     * 显示任务通知
     */
    function showQuestNotification() {
        if (window.UIModule) {
            UIModule.showTip('📋 每日任务已刷新！查看任务面板', 5000);
        }
    }

    /**
     * 显示任务完成通知
     */
    function showQuestCompleteNotification(quest) {
        if (window.UIModule) {
            UIModule.showTip(`✅ 任务完成！点击领取奖励`, 5000);
        }
    }

    /**
     * 显示成就解锁通知
     */
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 48px;">${achievement.icon}</div>
                <h4 style="color: #00ff00; margin: 10px 0 5px;">成就解锁！</h4>
                <p style="color: #fff; font-size: 18px; margin: 5px 0;">${achievement.name}</p>
                <p style="color: #aaa; font-size: 14px;">${achievement.description}</p>
                <p style="color: #00ff00; font-size: 16px; margin-top: 10px;">+${achievement.reward} 经验</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: -400px;
            width: 350px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.95));
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 20px;
            z-index: 100000;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            transition: right 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.right = '20px', 100);
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    /**
     * 显示任务面板
     */
    function showQuestPanel() {
        const panel = document.createElement('div');
        panel.id = 'quest-panel';
        panel.innerHTML = `
            <div class="quest-panel-content">
                <div class="quest-panel-header">
                    <h2>📋 任务中心</h2>
                    <button class="close-btn" onclick="document.getElementById('quest-panel').remove()">×</button>
                </div>
                <div class="quest-panel-body">
                    <div class="quest-section">
                        <h3>📅 每日任务</h3>
                        ${generateQuestList(playerData.quests.filter(q => q.isDaily))}
                    </div>
                    <div class="quest-section">
                        <h3>🏆 成就进度</h3>
                        <div class="achievements-grid">
                            ${generateAchievementsGrid()}
                        </div>
                    </div>
                    <div class="quest-section">
                        <h3>📊 统计数据</h3>
                        ${generateStatsPanel()}
                    </div>
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
    }

    /**
     * 生成任务列表
     */
    function generateQuestList(quests) {
        return quests.map(quest => `
            <div class="quest-item ${quest.completed ? 'completed' : ''} ${quest.claimed ? 'claimed' : ''}">
                <div class="quest-info">
                    <div class="quest-name">${questTypes[quest.type].name}</div>
                    <div class="quest-desc">${questTypes[quest.type].description.replace('{count}', quest.count || quest.minutes)}</div>
                </div>
                <div class="quest-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(quest.progress / (quest.count || quest.minutes)) * 100}%"></div>
                    </div>
                    <div class="quest-reward">${quest.reward} XP</div>
                    ${quest.completed && !quest.claimed ? `<button onclick="QuestSystem.claimQuestReward('${quest.id}')" class="claim-btn">领取</button>` : ''}
                    ${quest.claimed ? '<span class="claimed-badge">已领取</span>' : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * 生成成就网格
     */
    function generateAchievementsGrid() {
        return Object.entries(achievements).map(([id, achievement]) => {
            const unlocked = playerData.achievements.includes(id);
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 生成统计面板
     */
    function generateStatsPanel() {
        const stats = getStats();
        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.executed}</div>
                    <div class="stat-label">指令执行</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.combo}</div>
                    <div class="stat-label">当前连击</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.unique}/26</div>
                    <div class="stat-label">探索指令</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(stats.time / 60)}m</div>
                    <div class="stat-label">使用时间</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.effects}</div>
                    <div class="stat-label">特效触发</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.totalRewards}</div>
                    <div class="stat-label">总奖励</div>
                </div>
            </div>
        `;
    }

    // 公开 API
    return {
        init,
        trackCommand,
        trackEffect,
        claimQuestReward,
        getQuests,
        getAchievements,
        getStats,
        showQuestPanel
    };
})();

// 导出到全局作用域
window.QuestSystem = QuestSystem;

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuestSystem.init());
} else {
    QuestSystem.init();
}
