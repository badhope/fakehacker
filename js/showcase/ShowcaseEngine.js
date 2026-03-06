/**
 * 展示平台核心引擎
 * 负责统一管理所有效果展示、组合和播放
 * @module ShowcaseEngine
 */

class ShowcaseEngine {
    constructor() {
        this.effects = new Map();
        this.combos = new Map();
        this.activeEffects = new Set();
        this.isPlaying = false;
        this.playbackQueue = [];
        this.eventBus = null;
        this.config = {
            maxConcurrentEffects: 10,
            defaultDuration: 5000,
            transitionDuration: 300,
            enablePreview: true,
            autoStop: true
        };
    }

    /**
     * 初始化展示引擎
     * @param {Object} options - 配置选项
     * @returns {Promise<ShowcaseEngine>}
     */
    async init(options = {}) {
        this.config = { ...this.config, ...options };
        this.eventBus = window.EventBus || new EventBus();
        
        console.log('[ShowcaseEngine] 初始化完成');
        this.eventBus.emit('showcase:ready', { timestamp: Date.now() });
        
        return this;
    }

    /**
     * 注册效果
     * @param {string} id - 效果唯一标识
     * @param {Object} effect - 效果对象
     * @param {string} effect.name - 效果名称
     * @param {string} effect.category - 效果分类
     * @param {Function} effect.play - 播放函数
     * @param {Function} effect.stop - 停止函数
     * @param {Object} effect.params - 参数定义
     */
    registerEffect(id, effect) {
        if (this.effects.has(id)) {
            console.warn(`[ShowcaseEngine] 效果 ${id} 已存在，将被覆盖`);
        }

        const effectData = {
            id,
            name: effect.name || id,
            category: effect.category || 'default',
            description: effect.description || '',
            play: effect.play || (() => {}),
            stop: effect.stop || (() => {}),
            params: effect.params || {},
            defaultParams: effect.defaultParams || {},
            duration: effect.duration || this.config.defaultDuration,
            tags: effect.tags || [],
            thumbnail: effect.thumbnail || null,
            createdAt: Date.now()
        };

        this.effects.set(id, effectData);
        this.eventBus.emit('showcase:effect:registered', { id, effect: effectData });
        
        console.log(`[ShowcaseEngine] 注册效果：${id} (${effectData.name})`);
        return effectData;
    }

    /**
     * 获取效果
     * @param {string} id - 效果 ID
     * @returns {Object|null}
     */
    getEffect(id) {
        return this.effects.get(id) || null;
    }

    /**
     * 移除效果
     * @param {string} id - 效果 ID
     * @returns {boolean}
     */
    removeEffect(id) {
        if (this.effects.has(id)) {
            const effect = this.effects.get(id);
            if (this.activeEffects.has(id)) {
                this.stopEffect(id);
            }
            this.effects.delete(id);
            this.eventBus.emit('showcase:effect:removed', { id });
            return true;
        }
        return false;
    }

    /**
     * 获取所有效果
     * @returns {Array<Object>}
     */
    getAllEffects() {
        return Array.from(this.effects.values());
    }

    /**
     * 按分类获取效果
     * @param {string} category - 分类名称
     * @returns {Array<Object>}
     */
    getEffectsByCategory(category) {
        return Array.from(this.effects.values()).filter(
            effect => effect.category === category
        );
    }

    /**
     * 播放效果
     * @param {string} id - 效果 ID
     * @param {Object} params - 播放参数
     * @returns {Promise<Object>}
     */
    async playEffect(id, params = {}) {
        const effect = this.effects.get(id);
        if (!effect) {
            throw new Error(`效果不存在：${id}`);
        }

        if (this.activeEffects.size >= this.config.maxConcurrentEffects) {
            console.warn('[ShowcaseEngine] 达到最大并发效果数');
        }

        const mergedParams = { ...effect.defaultParams, ...params };
        
        console.log(`[ShowcaseEngine] 播放效果：${id}`, mergedParams);
        
        this.activeEffects.add(id);
        this.eventBus.emit('showcase:effect:playing', { id, params: mergedParams });

        try {
            const result = await effect.play(mergedParams);
            
            if (this.config.autoStop && effect.duration > 0) {
                setTimeout(() => this.stopEffect(id), effect.duration);
            }

            this.eventBus.emit('showcase:effect:played', { id, result });
            return result;
        } catch (error) {
            console.error(`[ShowcaseEngine] 播放效果失败：${id}`, error);
            this.activeEffects.delete(id);
            this.eventBus.emit('showcase:effect:error', { id, error });
            throw error;
        }
    }

    /**
     * 停止效果
     * @param {string} id - 效果 ID
     * @returns {boolean}
     */
    stopEffect(id) {
        const effect = this.effects.get(id);
        if (!effect) return false;

        if (!this.activeEffects.has(id)) return false;

        console.log(`[ShowcaseEngine] 停止效果：${id}`);
        
        try {
            effect.stop();
            this.activeEffects.delete(id);
            this.eventBus.emit('showcase:effect:stopped', { id });
            return true;
        } catch (error) {
            console.error(`[ShowcaseEngine] 停止效果失败：${id}`, error);
            return false;
        }
    }

    /**
     * 停止所有效果
     */
    stopAllEffects() {
        console.log('[ShowcaseEngine] 停止所有效果');
        for (const id of this.activeEffects) {
            this.stopEffect(id);
        }
    }

    /**
     * 注册效果组合
     * @param {string} id - 组合 ID
     * @param {Array<Object>} steps - 效果步骤
     * @param {Object} options - 组合选项
     */
    registerCombo(id, steps, options = {}) {
        const combo = {
            id,
            name: options.name || id,
            description: options.description || '',
            steps,
            loop: options.loop || false,
            sync: options.sync || false,
            totalDuration: this.calculateComboDuration(steps)
        };

        this.combos.set(id, combo);
        this.eventBus.emit('showcase:combo:registered', { id, combo });
        
        console.log(`[ShowcaseEngine] 注册组合：${id}`);
        return combo;
    }

    /**
     * 计算组合总时长
     * @param {Array<Object>} steps - 效果步骤
     * @returns {number}
     */
    calculateComboDuration(steps) {
        if (steps.length === 0) return 0;
        
        const lastStep = steps[steps.length - 1];
        const lastEffect = this.effects.get(lastStep.id);
        const lastDuration = lastEffect ? lastEffect.duration : this.config.defaultDuration;
        
        return lastStep.delay + lastDuration;
    }

    /**
     * 播放组合
     * @param {string} id - 组合 ID
     * @returns {Promise<void>}
     */
    async playCombo(id) {
        const combo = this.combos.get(id);
        if (!combo) {
            throw new Error(`组合不存在：${id}`);
        }

        console.log(`[ShowcaseEngine] 播放组合：${id}`);
        this.eventBus.emit('showcase:combo:playing', { id });

        try {
            if (combo.sync) {
                await this.playComboSync(combo);
            } else {
                await this.playComboAsync(combo);
            }

            this.eventBus.emit('showcase:combo:played', { id });
        } catch (error) {
            console.error(`[ShowcaseEngine] 播放组合失败：${id}`, error);
            this.eventBus.emit('showcase:combo:error', { id, error });
            throw error;
        }
    }

    /**
     * 同步播放组合（按顺序等待完成）
     * @param {Object} combo - 组合对象
     */
    async playComboSync(combo) {
        for (const step of combo.steps) {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await this.playEffect(step.id, step.params);
                    resolve();
                }, step.delay || 0);
            });
        }
    }

    /**
     * 异步播放组合（同时播放）
     * @param {Object} combo - 组合对象
     */
    async playComboAsync(combo) {
        const promises = combo.steps.map(async step => {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await this.playEffect(step.id, step.params);
                    resolve();
                }, step.delay || 0);
            });
        });

        await Promise.all(promises);
    }

    /**
     * 停止组合
     * @param {string} id - 组合 ID
     */
    stopCombo(id) {
        const combo = this.combos.get(id);
        if (!combo) return false;

        console.log(`[ShowcaseEngine] 停止组合：${id}`);
        this.stopAllEffects();
        this.eventBus.emit('showcase:combo:stopped', { id });
        return true;
    }

    /**
     * 获取所有组合
     * @returns {Array<Object>}
     */
    getAllCombos() {
        return Array.from(this.combos.values());
    }

    /**
     * 获取活跃效果列表
     * @returns {Set<string>}
     */
    getActiveEffects() {
        return new Set(this.activeEffects);
    }

    /**
     * 获取统计信息
     * @returns {Object}
     */
    getStats() {
        return {
            totalEffects: this.effects.size,
            activeEffects: this.activeEffects.size,
            totalCombos: this.combos.size,
            categories: this.getCategories(),
            isPlaying: this.isPlaying
        };
    }

    /**
     * 获取所有分类
     * @returns {Array<string>}
     */
    getCategories() {
        const categories = new Set();
        for (const effect of this.effects.values()) {
            categories.add(effect.category);
        }
        return Array.from(categories);
    }

    /**
     * 搜索效果
     * @param {string} query - 搜索关键词
     * @returns {Array<Object>}
     */
    searchEffects(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.effects.values()).filter(effect => {
            return effect.name.toLowerCase().includes(lowerQuery) ||
                   effect.description.toLowerCase().includes(lowerQuery) ||
                   effect.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        });
    }

    /**
     * 导出配置
     * @returns {Object}
     */
    exportConfig() {
        return {
            effects: this.getAllEffects(),
            combos: this.getAllCombos(),
            config: this.config,
            exportedAt: Date.now()
        };
    }

    /**
     * 导入配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        if (config.effects) {
            for (const effectData of config.effects) {
                this.registerEffect(effectData.id, effectData);
            }
        }
        if (config.combos) {
            for (const comboData of config.combos) {
                this.registerCombo(comboData.id, comboData.steps, comboData);
            }
        }
        if (config.config) {
            this.config = { ...this.config, ...config.config };
        }
        console.log('[ShowcaseEngine] 配置导入完成');
    }

    /**
     * 销毁引擎
     */
    dispose() {
        this.stopAllEffects();
        this.effects.clear();
        this.combos.clear();
        this.activeEffects.clear();
        this.eventBus = null;
        console.log('[ShowcaseEngine] 引擎已销毁');
    }
}

window.ShowcaseEngine = ShowcaseEngine;
