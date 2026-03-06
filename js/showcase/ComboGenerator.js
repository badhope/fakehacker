/**
 * 效果组合生成器
 * 支持通过代码组合生成复杂的视觉效果序列
 * @module ComboGenerator
 */

class ComboGenerator {
    constructor() {
        this.combos = new Map();
        this.activeCombos = new Set();
        this.templates = new Map();
        this.engine = null;
    }

    /**
     * 初始化组合生成器
     * @param {ShowcaseEngine} engine - 展示引擎实例
     */
    init(engine) {
        this.engine = engine;
        this.registerDefaultCombos();
        console.log('[ComboGenerator] 初始化完成');
    }

    /**
     * 注册默认组合
     */
    registerDefaultCombos() {
        this.registerCombo('cyber_attack', {
            name: '赛博攻击',
            description: '模拟赛博攻击的视觉效果组合',
            steps: [
                { id: 'screen_flash', delay: 0, params: { color: '#ff0000', intensity: 0.5 } },
                { id: 'glitch', delay: 200, params: { intensity: 30, duration: 1000 } },
                { id: 'matrix_rain', delay: 500, params: { color: '#ff0000', speed: 50 } },
                { id: 'particle_explosion', delay: 1500, params: { particleCount: 200, colors: ['#ff0000', '#ff8800'] } },
                { id: 'scanlines', delay: 2000, params: { color: 'rgba(255, 0, 0, 0.2)', speed: 5 } }
            ],
            sync: false,
            loop: false
        });

        this.registerCombo('system_boot', {
            name: '系统启动',
            description: '模拟系统启动的动画序列',
            steps: [
                { id: 'screen_flash', delay: 0, params: { color: '#ffffff', intensity: 0.8 } },
                { id: 'typewriter', delay: 300, params: { text: 'SYSTEM INITIALIZING...', speed: 50 } },
                { id: 'code_rain', delay: 1000, params: { language: 'javascript', speed: 30 } },
                { id: 'network_topology', delay: 2000, params: { nodeCount: 80, color: '#00ff00' } },
                { id: 'pulse', delay: 4000, params: { color: '#00ff00', startRadius: 50, endRadius: 500 } }
            ],
            sync: false,
            loop: false
        });

        this.registerCombo('matrix_dance', {
            name: '矩阵之舞',
            description: '矩阵效果的华丽组合',
            steps: [
                { id: 'matrix_rain', delay: 0, params: { color: '#00ff00', speed: 40 } },
                { id: 'matrix_rain', delay: 500, params: { color: '#00ffff', speed: 30 } },
                { id: 'matrix_rain', delay: 1000, params: { color: '#0088ff', speed: 50 } },
                { id: 'glitch', delay: 2000, params: { intensity: 20, duration: 2000 } },
                { id: 'wave', delay: 3000, params: { color: '#00ffff', amplitude: 100 } }
            ],
            sync: false,
            loop: true
        });

        this.registerCombo('particle_symphony', {
            name: '粒子交响曲',
            description: '粒子效果的华丽展示',
            steps: [
                { id: 'particle_explosion', delay: 0, params: { particleCount: 100, colors: ['#ff0000'] } },
                { id: 'particle_explosion', delay: 300, params: { particleCount: 100, colors: ['#00ff00'] } },
                { id: 'particle_explosion', delay: 600, params: { particleCount: 100, colors: ['#0000ff'] } },
                { id: 'particle_explosion', delay: 900, params: { particleCount: 100, colors: ['#ffff00'] } },
                { id: 'ripple', delay: 1200, params: { color: 'rgba(255, 255, 255, 0.8)' } }
            ],
            sync: false,
            loop: false
        });

        this.registerCombo('glitch_storm', {
            name: '故障风暴',
            description: '强烈的故障效果组合',
            steps: [
                { id: 'glitch', delay: 0, params: { intensity: 50, duration: 500 } },
                { id: 'glitch', delay: 400, params: { intensity: 40, duration: 500 } },
                { id: 'glitch', delay: 800, params: { intensity: 60, duration: 500 } },
                { id: 'screen_flash', delay: 1200, params: { color: '#ffffff', intensity: 1.0 } },
                { id: 'distortion', delay: 1500, params: { amplitude: 50, frequency: 0.1 } }
            ],
            sync: false,
            loop: false
        });

        this.registerCombo('neon_nights', {
            name: '霓虹之夜',
            description: '霓虹色彩的视觉盛宴',
            steps: [
                { id: 'wave', delay: 0, params: { color: '#ff00ff', amplitude: 80 } },
                { id: 'wave', delay: 500, params: { color: '#00ffff', amplitude: 60 } },
                { id: 'pulse', delay: 1000, params: { color: '#ff00ff', startRadius: 100 } },
                { id: 'pulse', delay: 1500, params: { color: '#00ffff', startRadius: 150 } },
                { id: 'network_topology', delay: 2000, params: { nodeCount: 100, color: '#ff00ff' } }
            ],
            sync: false,
            loop: true
        });

        this.registerCombo('code_storm', {
            name: '代码风暴',
            description: '代码相关的效果组合',
            steps: [
                { id: 'code_rain', delay: 0, params: { language: 'javascript', speed: 40 } },
                { id: 'code_rain', delay: 1000, params: { language: 'python', speed: 35 } },
                { id: 'code_rain', delay: 2000, params: { language: 'cpp', speed: 45 } },
                { id: 'typewriter', delay: 3000, params: { text: 'CODE STORM ACTIVATED', speed: 30 } },
                { id: 'glitch', delay: 4000, params: { intensity: 30, duration: 1000 } }
            ],
            sync: false,
            loop: false
        });

        console.log(`[ComboGenerator] 已注册 ${this.combos.size} 个默认组合`);
    }

    /**
     * 注册组合
     * @param {string} id - 组合 ID
     * @param {Object} config - 组合配置
     */
    registerCombo(id, config) {
        const combo = {
            id,
            name: config.name || id,
            description: config.description || '',
            steps: config.steps || [],
            sync: config.sync || false,
            loop: config.loop || false,
            tags: config.tags || [],
            author: config.author || 'System',
            createdAt: Date.now(),
            duration: this.calculateDuration(config.steps)
        };

        this.combos.set(id, combo);
        console.log(`[ComboGenerator] 注册组合：${id}`);
        return combo;
    }

    /**
     * 计算组合时长
     * @param {Array<Object>} steps - 步骤
     * @returns {number}
     */
    calculateDuration(steps) {
        if (steps.length === 0) return 0;
        
        const lastStep = steps[steps.length - 1];
        const lastDelay = lastStep.delay || 0;
        const effect = this.engine ? this.engine.getEffect(lastStep.id) : null;
        const effectDuration = effect ? effect.duration : 5000;
        
        return lastDelay + effectDuration;
    }

    /**
     * 获取组合
     * @param {string} id - 组合 ID
     * @returns {Object|null}
     */
    getCombo(id) {
        return this.combos.get(id) || null;
    }

    /**
     * 获取所有组合
     * @returns {Array<Object>}
     */
    getAllCombos() {
        return Array.from(this.combos.values());
    }

    /**
     * 播放组合
     * @param {string} id - 组合 ID
     * @param {Object} options - 选项
     */
    async play(id, options = {}) {
        const combo = this.combos.get(id);
        if (!combo) {
            throw new Error(`组合不存在：${id}`);
        }

        if (this.activeCombos.has(id) && !options.force) {
            console.warn(`[ComboGenerator] 组合 ${id} 正在播放中`);
            return;
        }

        console.log(`[ComboGenerator] 播放组合：${id}`);
        this.activeCombos.add(id);

        try {
            if (combo.sync) {
                await this.playSync(combo, options);
            } else {
                await this.playAsync(combo, options);
            }

            if (combo.loop && !options.stopRequested) {
                setTimeout(() => this.play(id, options), combo.duration);
            }
        } catch (error) {
            console.error(`[ComboGenerator] 播放组合失败:`, error);
            throw error;
        } finally {
            this.activeCombos.delete(id);
        }
    }

    /**
     * 同步播放组合
     * @param {Object} combo - 组合对象
     * @param {Object} options - 选项
     */
    async playSync(combo, options) {
        for (const step of combo.steps) {
            if (options.stopRequested) break;
            
            await this.delay(step.delay || 0);
            
            if (step.id && this.engine) {
                await this.engine.playEffect(step.id, step.params || {});
            }
            
            if (step.action) {
                await this.executeAction(step.action);
            }
        }
    }

    /**
     * 异步播放组合
     * @param {Object} combo - 组合对象
     * @param {Object} options - 选项
     */
    async playAsync(combo, options) {
        const promises = combo.steps.map(async step => {
            await this.delay(step.delay || 0);
            
            if (options.stopRequested) return;
            
            if (step.id && this.engine) {
                return this.engine.playEffect(step.id, step.params || {});
            }
            
            if (step.action) {
                return this.executeAction(step.action);
            }
        });

        await Promise.all(promises);
    }

    /**
     * 停止组合
     * @param {string} id - 组合 ID
     */
    stop(id) {
        const combo = this.combos.get(id);
        if (!combo) return false;

        console.log(`[ComboGenerator] 停止组合：${id}`);
        
        for (const step of combo.steps) {
            if (step.id && this.engine) {
                this.engine.stopEffect(step.id);
            }
        }

        this.activeCombos.delete(id);
        return true;
    }

    /**
     * 停止所有组合
     */
    stopAll() {
        console.log('[ComboGenerator] 停止所有组合');
        
        for (const id of this.activeCombos) {
            this.stop(id);
        }

        this.activeCombos.clear();
    }

    /**
     * 创建组合（可视化编辑器）
     * @param {Object} config - 组合配置
     * @returns {Object}
     */
    createCombo(config) {
        const id = config.id || `combo_${Date.now()}`;
        return this.registerCombo(id, config);
    }

    /**
     * 删除组合
     * @param {string} id - 组合 ID
     * @returns {boolean}
     */
    deleteCombo(id) {
        return this.combos.delete(id);
    }

    /**
     * 导出组合
     * @param {string} id - 组合 ID
     * @returns {Object}
     */
    exportCombo(id) {
        const combo = this.combos.get(id);
        if (!combo) return null;

        return {
            id: combo.id,
            name: combo.name,
            description: combo.description,
            steps: combo.steps,
            sync: combo.sync,
            loop: combo.loop,
            duration: combo.duration
        };
    }

    /**
     * 导入组合
     * @param {Object} data - 组合数据
     * @returns {Object}
     */
    importCombo(data) {
        return this.registerCombo(data.id, {
            name: data.name,
            description: data.description,
            steps: data.steps,
            sync: data.sync,
            loop: data.loop,
            tags: data.tags
        });
    }

    /**
     * 导出所有组合
     * @returns {Object}
     */
    exportAll() {
        const combos = {};
        for (const [id, combo] of this.combos) {
            combos[id] = this.exportCombo(id);
        }
        return combos;
    }

    /**
     * 导入组合列表
     * @param {Object} combosData - 组合数据对象
     */
    importAll(combosData) {
        for (const [id, data] of Object.entries(combosData)) {
            this.importCombo(data);
        }
    }

    /**
     * 延迟函数
     * @param {number} ms - 毫秒数
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 执行动作
     * @param {Object} action - 动作对象
     */
    async executeAction(action) {
        switch (action.type) {
            case 'log':
                console.log('[ComboGenerator]', action.message);
                break;
            case 'flash':
                this.triggerFlash(action.color, action.intensity);
                break;
            case 'shake':
                this.triggerShake(action.intensity);
                break;
            default:
                console.warn('[ComboGenerator] 未知动作类型:', action.type);
        }
    }

    /**
     * 触发闪烁
     * @param {string} color - 颜色
     * @param {number} intensity - 强度
     */
    triggerFlash(color = '#ffffff', intensity = 0.5) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: ${intensity};
            pointer-events: none;
            z-index: 99999;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 50);
    }

    /**
     * 触发抖动
     * @param {number} intensity - 强度
     */
    triggerShake(intensity = 10) {
        const container = document.body;
        const originalTransform = container.style.transform;
        
        let shakeTimes = 0;
        const maxShakes = 10;
        
        const shake = () => {
            if (shakeTimes >= maxShakes) {
                container.style.transform = originalTransform;
                return;
            }
            
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            container.style.transform = `translate(${x}px, ${y}px)`;
            
            shakeTimes++;
            setTimeout(shake, 50);
        };
        
        shake();
    }

    /**
     * 获取统计信息
     * @returns {Object}
     */
    getStats() {
        return {
            totalCombos: this.combos.size,
            activeCombos: this.activeCombos.size,
            comboIds: Array.from(this.combos.keys())
        };
    }

    /**
     * 搜索组合
     * @param {string} query - 搜索词
     * @returns {Array<Object>}
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.combos.values()).filter(combo => {
            return combo.name.toLowerCase().includes(lowerQuery) ||
                   combo.description.toLowerCase().includes(lowerQuery) ||
                   (combo.tags && combo.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));
        });
    }

    /**
     * 注册模板
     * @param {string} id - 模板 ID
     * @param {Object} template - 模板对象
     */
    registerTemplate(id, template) {
        this.templates.set(id, template);
        console.log(`[ComboGenerator] 注册模板：${id}`);
    }

    /**
     * 从模板创建组合
     * @param {string} templateId - 模板 ID
     * @param {Object} params - 参数
     * @returns {Object}
     */
    createFromTemplate(templateId, params = {}) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`模板不存在：${templateId}`);
        }

        const combo = { ...template };
        
        for (const step of combo.steps) {
            if (step.params && params.stepParams) {
                step.params = { ...step.params, ...params.stepParams[step.id] };
            }
        }

        return this.createCombo(combo);
    }
}

window.ComboGenerator = ComboGenerator;
