/**
 * Visual Effects Lab - Base Effect Class
 * 所有特效的基类
 */

class BaseEffect {
    constructor(canvas, params = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.params = {
            ...this.defaultParams,
            ...params
        };
        this.name = 'BaseEffect';
        this.initialized = false;
    }

    /**
     * 默认参数（子类重写）
     */
    get defaultParams() {
        return {};
    }

    /**
     * 初始化（子类重写）
     */
    async init() {
        this.initialized = true;
        console.log(`[Effect] ${this.name} 初始化完成`);
    }

    /**
     * 更新逻辑（子类重写）
     */
    update(deltaTime) {
        // 子类实现
    }

    /**
     * 渲染逻辑（子类重写）
     */
    render(ctx) {
        // 子类实现
    }

    /**
     * Canvas 尺寸变化时的处理
     */
    onResize() {
        // 子类实现
    }

    /**
     * 清理资源（子类重写）
     */
    destroy() {
        this.initialized = false;
    }

    /**
     * 更新参数（带验证）
     */
    updateParams(newParams) {
        const validatedParams = {};
        
        for (const [key, value] of Object.entries(newParams)) {
            const defaultVal = this.defaultParams[key];
            
            // 检查参数是否存在于默认参数中
            if (defaultVal === undefined) {
                console.warn(`[BaseEffect] 未知参数：${key}`);
                continue;
            }
            
            // 类型检查
            if (typeof value !== typeof defaultVal) {
                console.warn(`[BaseEffect] 参数 ${key} 类型错误：期望 ${typeof defaultVal}，得到 ${typeof value}`);
                continue;
            }
            
            // 数值验证
            if (typeof value === 'number') {
                if (isNaN(value) || !isFinite(value)) {
                    console.warn(`[BaseEffect] 参数 ${key} 值无效：${value}`);
                    continue;
                }
            }
            
            validatedParams[key] = value;
        }
        
        this.params = { ...this.params, ...validatedParams };
        
        // 触发参数变化事件
        if (this.onParamsChange) {
            this.onParamsChange(validatedParams);
        }
    }

    /**
     * 获取参数
     */
    getParams() {
        return { ...this.params };
    }

    /**
     * 重置到初始状态
     */
    reset() {
        this.params = { ...this.defaultParams };
    }
}

// 导出到全局
window.BaseEffect = BaseEffect;
