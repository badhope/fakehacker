/**
 * TextScroll - 横向滚动文字特效
 * 从右向左滚动的文字流
 */

class TextScroll extends BaseEffect {
    get name() { return 'TextScroll'; }
    
    get defaultParams() {
        return {
            scrollSpeed: 50,
            fontSize: 24,
            text: 'VISUAL EFFECTS LAB',
            spacing: 300,
            baseHue: 180,
            glow: true
        };
    }
    
    async init() {
        await super.init();
        this.texts = [];
        this.font = `bold ${this.params.fontSize}px 'Courier New', monospace`;
        
        // 初始化文字
        const textCount = Math.ceil(this.canvas.width / this.params.spacing) + 2;
        for (let i = 0; i < textCount; i++) {
            this.texts.push({
                x: i * this.params.spacing,
                y: this.canvas.height / 2,
                text: this.params.text,
                hue: (this.params.baseHue + i * 20) % 360
            });
        }
    }
    
    update(deltaTime) {
        // 移动文字
        for (const text of this.texts) {
            text.x -= this.params.scrollSpeed * deltaTime;
        }
        
        // 循环文字
        const textWidth = this.ctx.measureText(this.params.text).width;
        for (let i = 0; i < this.texts.length; i++) {
            if (this.texts[i].x + textWidth < 0) {
                const lastText = this.texts[this.texts.length - 1];
                this.texts[i].x = lastText.x + this.params.spacing;
                this.texts[i].hue = (lastText.hue + 20) % 360;
            }
        }
    }
    
    render(ctx) {
        ctx.font = this.font;
        ctx.textBaseline = 'middle';
        
        for (const text of this.texts) {
            if (this.params.glow) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsla(${text.hue}, 80%, 60%, 0.8)`;
            }
            
            const gradient = ctx.createLinearGradient(
                text.x, text.y - 20,
                text.x, text.y + 20
            );
            gradient.addColorStop(0, `hsla(${text.hue}, 80%, 70%, 0)`);
            gradient.addColorStop(0.5, `hsla(${text.hue}, 80%, 60%, 1)`);
            gradient.addColorStop(1, `hsla(${text.hue}, 80%, 70%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillText(text.text, text.x, text.y);
        }
        
        ctx.shadowBlur = 0;
    }
    
    onResize() {
        const textCount = Math.ceil(this.canvas.width / this.params.spacing) + 2;
        if (this.texts.length < textCount) {
            for (let i = this.texts.length; i < textCount; i++) {
                const lastText = this.texts[this.texts.length - 1];
                this.texts.push({
                    x: lastText.x + this.params.spacing,
                    y: this.canvas.height / 2,
                    text: this.params.text,
                    hue: (lastText.hue + 20) % 360
                });
            }
        }
    }
}

window.TextScroll = TextScroll;
