/**
 * Visual Effects Lab - Utility Functions
 * 常用工具函数和数学辅助方法
 */

const Utils = {
    /**
     * 生成范围内的随机数
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * 生成高斯分布随机数
     */
    randomGaussian(mean = 0, stddev = 1) {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stddev + mean;
    },

    /**
     * 角度转弧度
     */
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * 弧度转角度
     */
    radToDeg(radians) {
        return radians * 180 / Math.PI;
    },

    /**
     * 限制值在范围内
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * 线性插值
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * 平滑缓动
     */
    smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    },

    /**
     * 更平滑的缓动
     */
    smootherstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    /**
     * 生成 HSL 颜色
     */
    hsl(h, s, l, a = 1) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    },

    /**
     * 生成 RGB 颜色
     */
    rgb(r, g, b, a = 1) {
        return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
    },

    /**
     * 颜色插值
     */
    colorLerp(color1, color2, t) {
        // 简化版本，实际使用需要解析颜色字符串
        return t < 0.5 ? color1 : color2;
    },

    /**
     * 创建粒子对象
     */
    createParticle(x, y, options = {}) {
        return {
            x: x,
            y: y,
            vx: options.vx || 0,
            vy: options.vy || 0,
            life: options.life || 1,
            maxLife: options.maxLife || 1,
            size: options.size || 2,
            color: options.color || '#ffffff',
            ...options
        };
    },

    /**
     * 向量加法
     */
    vec2Add(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y };
    },

    /**
     * 向量乘法
     */
    vec2Mult(v, scalar) {
        return { x: v.x * scalar, y: v.y * scalar };
    },

    /**
     * 向量长度
     */
    vec2Length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    },

    /**
     * 向量归一化
     */
    vec2Normalize(v) {
        const len = this.vec2Length(v);
        return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
    },

    /**
     * 两点间距离
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * 正弦波
     */
    sine(time, frequency = 1, amplitude = 1, phase = 0) {
        return Math.sin(time * frequency * Math.PI * 2 + phase) * amplitude;
    },

    /**
     * 余弦波
     */
    cosine(time, frequency = 1, amplitude = 1, phase = 0) {
        return Math.cos(time * frequency * Math.PI * 2 + phase) * amplitude;
    },

    /**
     * 噪声函数 (简化版 Perlin)
     */
    noise(x, y = 0) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        return Math.sin(X * 12.9898 + Y * 78.233) * 43758.5453 - Math.floor(Math.sin(X * 12.9898 + Y * 78.233) * 43758.5453);
    },

    /**
     * 映射值到另一个范围
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
};

// 导出到全局
window.Utils = Utils;
