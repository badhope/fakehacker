/**
 * MorphingShape - 变形几何特效
 * 几何形状在圆形、方形、三角形之间平滑变形
 */

class MorphingShape extends BaseEffect {
    get name() { return 'MorphingShape'; }
    
    get defaultParams() {
        return {
            morphSpeed: 0.3,
            baseSize: 100,
            sides: 3,
            rotationSpeed: 0.2,
            baseHue: 260
        };
    }
    
    async init() {
        await super.init();
        this.time = 0;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.currentSides = 3;
        this.targetSides = 3;
        this.morphProgress = 0;
        this.sidesTimer = 0;
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // 定期改变边数
        this.sidesTimer += deltaTime;
        if (this.sidesTimer >= 3) {
            this.sidesTimer = 0;
            this.currentSides = this.targetSides;
            this.targetSides = Math.floor(Math.random() * 5) + 3; // 3-7 边形
            this.morphProgress = 0;
        }
        
        // 平滑变形
        if (this.currentSides !== this.targetSides) {
            this.morphProgress += deltaTime * this.params.morphSpeed;
            if (this.morphProgress >= 1) {
                this.morphProgress = 1;
                this.currentSides = this.targetSides;
            }
        }
    }
    
    render(ctx) {
        const currentSize = this.params.baseSize + Math.sin(this.time * 2) * 20;
        const rotation = this.time * this.params.rotationSpeed;
        
        // 计算当前边数（带平滑过渡）
        const sides = this.currentSides + (this.targetSides - this.currentSides) * this.morphProgress;
        
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(rotation);
        
        // 绘制多层形状
        for (let layer = 0; layer < 3; layer++) {
            const layerSize = currentSize * (1 - layer * 0.2);
            const hue = (this.params.baseHue + layer * 40 + this.time * 20) % 360;
            
            ctx.beginPath();
            
            for (let i = 0; i <= sides; i++) {
                const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * layerSize;
                const y = Math.sin(angle) * layerSize;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            
            // 渐变填充
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerSize);
            gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.3)`);
            gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0.1)`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 描边
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
            ctx.lineWidth = 3 - layer;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // 中心装饰
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 10, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.params.baseHue}, 80%, 80%, 0.8)`;
        ctx.fill();
    }
    
    onResize() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
}

window.MorphingShape = MorphingShape;
