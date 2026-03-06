/**
 * AngularMotion - 角度运动特效
 * 多条斜线以不同角度旋转运动
 */

class AngularMotion extends BaseEffect {
    get name() { return 'AngularMotion'; }
    
    get defaultParams() {
        return {
            lineCount: 12,
            rotationSpeed: 0.5,
            lineLength: 200,
            baseHue: 300,
            glow: true
        };
    }
    
    async init() {
        await super.init();
        this.lines = [];
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        for (let i = 0; i < this.params.lineCount; i++) {
            this.lines.push({
                angle: (i / this.params.lineCount) * Math.PI * 2,
                distance: 50 + i * 20,
                hue: (this.params.baseHue + i * 30) % 360,
                speed: this.params.rotationSpeed * (1 + (i % 2) * 0.5),
                width: 3 - (i / this.params.lineCount) * 2
            });
        }
    }
    
    update(deltaTime) {
        for (const line of this.lines) {
            line.angle += line.speed * deltaTime;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        
        for (const line of this.lines) {
            ctx.save();
            ctx.rotate(line.angle);
            
            if (this.params.glow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${line.hue}, 80%, 60%, 0.5)`;
            }
            
            const gradient = ctx.createLinearGradient(
                -line.lineLength / 2, 0,
                line.lineLength / 2, 0
            );
            
            gradient.addColorStop(0, `hsla(${line.hue}, 80%, 60%, 0)`);
            gradient.addColorStop(0.5, `hsla(${line.hue}, 80%, 60%, 1)`);
            gradient.addColorStop(1, `hsla(${line.hue}, 80%, 60%, 0)`);
            
            ctx.beginPath();
            ctx.moveTo(-line.lineLength / 2, 0);
            ctx.lineTo(line.lineLength / 2, 0);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = line.width;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            ctx.restore();
        }
        
        ctx.restore();
        
        // 中心光晕
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 20, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.params.baseHue}, 80%, 70%, 0.5)`;
        ctx.fill();
    }
    
    onResize() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
}

window.AngularMotion = AngularMotion;
