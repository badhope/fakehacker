/**
 * 展示平台主控制器
 * 统一管理展示引擎和 UI
 * @module ShowcaseApp
 */

class ShowcaseApp {
    constructor() {
        this.engine = null;
        this.registry = null;
        this.ui = null;
        this.isInitialized = false;
    }

    /**
     * 初始化应用
     * @returns {Promise<ShowcaseApp>}
     */
    async init() {
        console.log('[ShowcaseApp] 开始初始化...');

        try {
            // 初始化展示引擎
            this.engine = new ShowcaseEngine();
            await this.engine.init();

            // 初始化效果注册表
            this.registry = new EffectRegistry(this.engine);
            this.registry.registerAllEffects();

            // 初始化 UI
            this.ui = new ShowcaseUI();
            await this.ui.init();

            // 渲染效果卡片
            this.ui.renderEffectCards(this.engine.getAllEffects());

            this.isInitialized = true;
            console.log('[ShowcaseApp] 初始化完成');

            return this;
        } catch (error) {
            console.error('[ShowcaseApp] 初始化失败:', error);
            throw error;
        }
    }

    /**
     * 打开展示平台
     */
    open() {
        if (!this.isInitialized) {
            console.error('[ShowcaseApp] 应用未初始化');
            return;
        }

        console.log('[ShowcaseApp] 打开展示平台');
    }

    /**
     * 关闭展示平台
     */
    close() {
        if (this.engine) {
            this.engine.stopAllEffects();
        }
        
        if (this.ui) {
            this.ui.close();
        }

        this.isInitialized = false;
        console.log('[ShowcaseApp] 已关闭');
    }

    /**
     * 播放效果
     * @param {string} effectId - 效果 ID
     * @param {Object} params - 参数
     */
    async play(effectId, params = {}) {
        if (!this.isInitialized) {
            console.error('[ShowcaseApp] 应用未初始化');
            return;
        }

        try {
            await this.engine.playEffect(effectId, params);
        } catch (error) {
            console.error('[ShowcaseApp] 播放效果失败:', error);
            throw error;
        }
    }

    /**
     * 停止效果
     * @param {string} effectId - 效果 ID
     */
    stop(effectId) {
        if (!this.isInitialized) return;
        this.engine.stopEffect(effectId);
    }

    /**
     * 播放组合
     * @param {string} comboId - 组合 ID
     */
    async playCombo(comboId) {
        if (!this.isInitialized) return;
        await this.engine.playCombo(comboId);
    }

    /**
     * 搜索效果
     * @param {string} query - 搜索词
     * @returns {Array<Object>}
     */
    search(query) {
        if (!this.isInitialized) return [];
        return this.engine.searchEffects(query);
    }

    /**
     * 获取统计信息
     * @returns {Object}
     */
    getStats() {
        if (!this.isInitialized) return {};
        return this.engine.getStats();
    }
}

window.ShowcaseApp = ShowcaseApp;
