/**
 * 对象池系统
 * 用于优化频繁创建/销毁对象的场景（如粒子系统）
 */

class ObjectPool {
    /**
     * @param {Function} createFn - 创建对象的函数
     * @param {Function} resetFn - 重置对象的函数
     * @param {number} initialSize - 初始对象数量
     */
    constructor(createFn, resetFn, initialSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.available = [];
        this.inUse = [];
        
        // 预分配对象
        for (let i = 0; i < initialSize; i++) {
            this.available.push(createFn());
        }
        
        console.log(`[ObjectPool] 创建对象池，初始大小：${initialSize}`);
    }
    
    /**
     * 获取对象
     */
    acquire() {
        if (this.available.length > 0) {
            const obj = this.available.pop();
            this.inUse.push(obj);
            return obj;
        } else {
            // 池子为空，创建新对象
            const obj = this.createFn();
            this.inUse.push(obj);
            return obj;
        }
    }
    
    /**
     * 释放对象
     */
    release(obj) {
        const index = this.inUse.indexOf(obj);
        if (index !== -1) {
            this.inUse.splice(index, 1);
            this.resetFn(obj);
            this.available.push(obj);
        }
    }
    
    /**
     * 释放所有对象
     */
    releaseAll() {
        while (this.inUse.length > 0) {
            const obj = this.inUse.pop();
            this.resetFn(obj);
            this.available.push(obj);
        }
    }
    
    /**
     * 获取池子状态
     */
    getStatus() {
        return {
            available: this.available.length,
            inUse: this.inUse.length,
            total: this.available.length + this.inUse.length
        };
    }
    
    /**
     * 扩展池子大小
     */
    expand(count = 50) {
        for (let i = 0; i < count; i++) {
            this.available.push(this.createFn());
        }
        console.log(`[ObjectPool] 扩展池子，新增：${count}`);
    }
}

// 预定义的常见对象池工厂
const PoolFactory = {
    /**
     * 创建粒子池
     */
    createParticlePool(size = 500) {
        return new ObjectPool(
            () => ({
                x: 0, y: 0,
                vx: 0, vy: 0,
                life: 1, maxLife: 1,
                size: 2,
                color: '#ffffff',
                active: false
            }),
            (p) => {
                p.x = 0; p.y = 0;
                p.vx = 0; p.vy = 0;
                p.life = 1; p.maxLife = 1;
                p.size = 2;
                p.color = '#ffffff';
                p.active = false;
            },
            size
        );
    },
    
    /**
     * 创建雨滴池
     */
    createDropPool(size = 1000) {
        return new ObjectPool(
            () => ({
                x: 0, y: 0,
                speed: 0, length: 0, width: 0,
                hue: 0, active: false
            }),
            (d) => {
                d.x = 0; d.y = 0;
                d.speed = 0; d.length = 0; d.width = 0;
                d.hue = 0;
                d.active = false;
            },
            size
        );
    },
    
    /**
     * 创建波浪池
     */
    createWavePool(size = 20) {
        return new ObjectPool(
            () => ({
                phase: 0,
                amplitude: 0,
                frequency: 0,
                speed: 0,
                hue: 0
            }),
            (w) => {
                w.phase = 0;
                w.amplitude = 0;
                w.frequency = 0;
                w.speed = 0;
                w.hue = 0;
            },
            size
        );
    }
};

// 导出到全局
window.ObjectPool = ObjectPool;
window.PoolFactory = PoolFactory;
