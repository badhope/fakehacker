/**
 * FallingStars - 流星坠落特效
 * 流星从天空划过的效果
 */

class FallingStars extends BaseEffect {
    get name() { return 'FallingStars'; }
    
    get defaultParams() {
        return {
            starCount: 30,
            fallSpeed: 200,
            tailLength: 100,
            spawnRate: 0.5,
            baseHue: 280
        };
    }
    
    async init() {
        await super.init();
        this.stars = [];
        this.spawnTimer = 0;
        
        for (let i = 0; i < this.params.starCount; i++) {
            this.stars.push(this.createStar(true));
        }
    }
    
    createStar(initial = false) {
        return {
            x: Math.random() * this.canvas.width,
            y: initial ? Math.random() * this.canvas.height : -10,
            speed: this.params.fallSpeed * (0.5 + Math.random()),
            length: this.params.tailLength * (0.5 + Math.random()),
            width: Math.random() * 2 + 1,
            hue: (this.params.baseHue + Math.random() * 60) % 360,
            brightness: Math.random() * 0.5 + 0.5,
            active: true
        };
    }
    
    update(deltaTime) {
        // 生成新流星
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.params.spawnRate) {
            this.spawnStar();
            this.spawnTimer = 0;
        }
        
        // 更新流星位置
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            
            if (!star.active) continue;
            
            star.y += star.speed * deltaTime;
            
            // 超出底部，重置
            if (star.y - star.length > this.canvas.height) {
                this.stars[i] = this.createStar();
            }
        }
    }
    
    spawnStar() {
        // 找一个不活跃的流星或替换最旧的
        const inactiveStar = this.stars.find(s => !s.active);
        if (inactiveStar) {
            Object.assign(inactiveStar, this.createStar());
        } else {
            this.stars.shift();
            this.stars.push(this.createStar());
        }
    }
    
    render(ctx) {
        for (const star of this.stars) {
            if (!star.active) continue;
            
            const gradient = ctx.createLinearGradient(
                star.x, star.y - star.length,
                star.x, star.y
            );
            
            gradient.addColorStop(0, `hsla(${star.hue}, 80%, 70%, 0)`);
            gradient.addColorStop(0.5, `hsla(${star.hue}, 80%, 70%, ${star.brightness * 0.5})`);
            gradient.addColorStop(1, `hsla(${star.hue}, 80%, 90%, ${star.brightness})`);
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y - star.length);
            ctx.lineTo(star.x, star.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.width;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // 头部光晕
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.width * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${star.hue}, 80%, 90%, ${star.brightness})`;
            ctx.fill();
        }
    }
}

window.FallingStars = FallingStars;
