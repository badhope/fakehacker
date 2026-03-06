/**
 * Rain Drop Effect
 * 纵向雨滴下落特效
 */

class RainDrop extends BaseEffect {
    constructor(canvas, params = {}) {
        super(canvas, params);
        this.name = 'RainDrop';
        this.drops = [];
        this.maxDrops = 1000;
    }

    get defaultParams() {
        return {
            dropLength: 20,
            dropSpeed: 300,
            dropRate: 50,
            dropWidth: 2,
            baseHue: 200,
            wind: 0,
            splash: true
        };
    }

    async init() {
        this.drops = [];
        for (let i = 0; i < this.maxDrops; i++) {
            this.drops.push(this.createDrop(true));
        }
        this.initialized = true;
    }

    createDrop(randomY = false) {
        return {
            x: Utils.randomRange(0, this.canvas.width),
            y: randomY ? Utils.randomRange(0, this.canvas.height) : -this.params.dropLength,
            speed: Utils.randomRange(this.params.dropSpeed * 0.8, this.params.dropSpeed * 1.2),
            length: Utils.randomRange(this.params.dropLength * 0.8, this.params.dropLength * 1.2),
            width: Utils.randomRange(1, this.params.dropWidth),
            hue: Utils.randomRange(this.params.baseHue - 20, this.params.baseHue + 20)
        };
    }

    update(deltaTime) {
        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            drop.y += drop.speed * deltaTime;
            drop.x += this.params.wind * deltaTime;

            // 雨滴落地
            if (drop.y > this.canvas.height) {
                if (this.params.splash && Math.random() < 0.3) {
                    // 可以添加溅射效果
                }
                this.drops[i] = this.createDrop();
            }
        }
    }

    render(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        this.drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + this.params.wind * 0.1, drop.y - drop.length);
            ctx.strokeStyle = `hsla(${drop.hue}, 70%, 70%, 0.6)`;
            ctx.lineWidth = drop.width;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        ctx.restore();
    }

    onResize() {
        this.init();
    }
}

window.RainDrop = RainDrop;
