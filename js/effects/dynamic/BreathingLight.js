/**
 * BreathingLight - Enhanced 呼吸灯特效（增强版）
 * 增加了：多核心、颜色循环、脉动模式、旋转、扩散等效果
 */

class BreathingLight extends BaseEffect {
    get name() { return 'BreathingLight'; }
    
    get defaultParams() {
        return {
            coreCount: 1,
            baseRadius: 100,
            breathSpeed: 1,
            baseHue: 180,
            colorCycle: true,
            colorSpeed: 20,
            pulseMode: 'sync',
            pulseOffset: 0.5,
            rotation: false,
            rotationSpeed: 0.2,
            expansion: false,
            expansionSpeed: 50,
            glow: true,
            blendMode: 'lighter'
        };
    }
    
    async init() {
        await super.init();
        this.cores = [];
        this.time = 0;
        
        // 创建多个核心
        for (let i = 0; i < this.params.coreCount; i++) {
            const angle = (i / this.params.coreCount) * Math.PI * 2;
            const distance = 100;
            
            this.cores.push({
                x: this.canvas.width / 2 + Math.cos(angle) * distance,
                y: this.canvas.height / 2 + Math.sin(angle) * distance,
                radius: this.params.baseRadius,
                hue: (this.params.baseHue + i * 60) % 360,
                phase: i * this.params.pulseOffset,
                angle: angle,
                distance: distance
            });
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (const core of this.cores) {
            // 呼吸效果
            const breathFactor = 0.5 + 0.5 * Math.sin(this.time * this.params.breathSpeed * Math.PI + core.phase);
            core.radius = this.params.baseRadius * breathFactor;
            
            // 颜色循环
            if (this.params.colorCycle) {
                core.hue = (core.hue + this.params.colorSpeed * deltaTime) % 360;
            }
            
            // 旋转
            if (this.params.rotation) {
                core.angle += this.params.rotationSpeed * deltaTime;
                core.x = this.canvas.width / 2 + Math.cos(core.angle) * core.distance;
                core.y = this.canvas.height / 2 + Math.sin(core.angle) * core.distance;
            }
            
            // 扩散效果
            if (this.params.expansion) {
                core.distance += this.params.expansionSpeed * deltaTime;
                core.x = this.canvas.width / 2 + Math.cos(core.angle) * core.distance;
                core.y = this.canvas.height / 2 + Math.sin(core.angle) * core.distance;
                
                if (core.distance > Math.max(this.canvas.width, this.canvas.height) / 2) {
                    core.distance = 100;
                }
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = this.params.blendMode;
        
        for (const core of this.cores) {
            // 外光晕
            if (this.params.glow) {
                const outerGradient = ctx.createRadialGradient(
                    core.x, core.y, 0,
                    core.x, core.y, core.radius * 2
                );
                
                outerGradient.addColorStop(0, `hsla(${core.hue}, 80%, 60%, 0.8)`);
                outerGradient.addColorStop(0.5, `hsla(${core.hue}, 80%, 60%, 0.2)`);
                outerGradient.addColorStop(1, `hsla(${core.hue}, 80%, 60%, 0)`);
                
                ctx.beginPath();
                ctx.arc(core.x, core.y, core.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = outerGradient;
                ctx.fill();
            }
            
            // 核心
            const coreGradient = ctx.createRadialGradient(
                core.x, core.y, 0,
                core.x, core.y, core.radius
            );
            
            coreGradient.addColorStop(0, `hsla(${core.hue}, 100%, 80%, 1)`);
            coreGradient.addColorStop(0.5, `hsla(${core.hue}, 80%, 60%, 0.5)`);
            coreGradient.addColorStop(1, `hsla(${core.hue}, 80%, 60%, 0)`);
            
            ctx.beginPath();
            ctx.arc(core.x, core.y, core.radius, 0, Math.PI * 2);
            ctx.fillStyle = coreGradient;
            ctx.fill();
            
            // 光环
            ctx.beginPath();
            ctx.arc(core.x, core.y, core.radius * 0.5, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${core.hue}, 100%, 90%, 0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    onResize() {
        this.init();
    }
}

window.BreathingLight = BreathingLight;
