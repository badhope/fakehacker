/**
 * ==========================================
 * 测试文件：tests/Renderer.test.js
 * 功能：Renderer.js 单元测试
 * 覆盖范围：核心功能、边界条件、异常场景
 * ==========================================
 */

// 测试工具函数
const TestUtil = {
    /**
     * 等待指定时间
     * @param {number} ms - 毫秒数
     * @returns {Promise<void>}
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * 创建模拟 Canvas
     * @returns {HTMLCanvasElement}
     */
    createMockCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        return canvas;
    },
    
    /**
     * 清理 DOM
     */
    cleanup() {
        document.querySelectorAll('canvas').forEach(el => el.remove());
        document.querySelectorAll('#effect-canvas').forEach(el => el.remove());
    }
};

// 测试用例类
class TestCase {
    constructor(name, fn) {
        this.name = name;
        this.fn = fn;
        this.passed = false;
        this.error = null;
        this.duration = 0;
    }
    
    async run() {
        const startTime = performance.now();
        try {
            await this.fn();
            this.passed = true;
        } catch (error) {
            this.passed = false;
            this.error = error;
        }
        this.duration = performance.now() - startTime;
    }
}

// 测试套件类
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.setupFn = null;
        this.teardownFn = null;
    }
    
    setup(fn) {
        this.setupFn = fn;
        return this;
    }
    
    teardown(fn) {
        this.teardownFn = fn;
        return this;
    }
    
    test(name, fn) {
        this.tests.push(new TestCase(name, fn));
        return this;
    }
    
    async run() {
        console.log(`\n🧪 运行测试套件：${this.name}`);
        console.log('='.repeat(50));
        
        let passed = 0;
        let failed = 0;
        
        for (const test of this.tests) {
            if (this.setupFn) {
                await this.setupFn();
            }
            
            await test.run();
            
            if (this.teardownFn) {
                await this.teardownFn();
            }
            
            if (test.passed) {
                console.log(`✅ ${test.name} (${test.duration.toFixed(2)}ms)`);
                passed++;
            } else {
                console.log(`❌ ${test.name}`);
                console.log(`   错误：${test.error.message}`);
                console.log(`   堆栈：${test.error.stack}`);
                failed++;
            }
        }
        
        console.log('='.repeat(50));
        console.log(`测试结果：${passed} 通过，${failed} 失败，总计 ${this.tests.length} 个测试`);
        
        return { passed, failed, total: this.tests.length };
    }
}

// 断言函数
const assert = {
    equal(actual, expected, message = '值不相等') {
        if (actual !== expected) {
            throw new Error(`${message} - 期望：${expected}, 实际：${actual}`);
        }
    },
    
    notEqual(actual, expected, message = '值相等了') {
        if (actual === expected) {
            throw new Error(message);
        }
    },
    
    deepEqual(actual, expected, message = '对象不相等') {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            throw new Error(`${message} - 期望：${expectedStr}, 实际：${actualStr}`);
        }
    },
    
    truthy(value, message = '值不真实') {
        if (!value) {
            throw new Error(message);
        }
    },
    
    falsy(value, message = '值应该为假') {
        if (value) {
            throw new Error(message);
        }
    },
    
    null(value, message = '值不为 null') {
        if (value !== null) {
            throw new Error(message);
        }
    },
    
    notNull(value, message = '值不应该为 null') {
        if (value === null) {
            throw new Error(message);
        }
    },
    
    throws(fn, message = '函数没有抛出异常') {
        let threw = false;
        try {
            fn();
        } catch (e) {
            threw = true;
        }
        if (!threw) {
            throw new Error(message);
        }
    },
    
    async doesNotThrow(fn, message = '函数抛出了异常') {
        try {
            await fn();
        } catch (e) {
            throw new Error(message);
        }
    },
    
    instanceOf(actual, expected, message = '类型不匹配') {
        if (!(actual instanceof expected)) {
            throw new Error(message);
        }
    },
    
    arrayIncludes(array, value, message = '数组不包含期望的值') {
        if (!array.includes(value)) {
            throw new Error(message);
        }
    },
    
    length(array, expected, message = '数组长度不匹配') {
        if (array.length !== expected) {
            throw new Error(`${message} - 期望：${expected}, 实际：${array.length}`);
        }
    }
};

// ==================== Renderer 测试套件 ====================

const rendererSuite = new TestSuite('Renderer 核心功能测试');

rendererSuite
    .setup(() => {
        TestUtil.cleanup();
    })
    .teardown(() => {
        TestUtil.cleanup();
    })
    
    // 测试 1: 渲染器初始化
    .test('应该成功初始化渲染器', async () => {
        const renderer = await window.Renderer.init({
            mode: 'canvas',
            quality: { level: 'medium' }
        });
        
        assert.notNull(renderer, '渲染器应该被初始化');
        assert.notNull(renderer.canvas, 'Canvas 应该被创建');
        assert.notNull(renderer.ctx, 'Canvas 上下文应该被创建');
        assert.equal(renderer.canvas.id, 'effect-canvas', 'Canvas ID 应该正确');
    })
    
    // 测试 2: 渲染层创建
    .test('应该成功创建渲染层', async () => {
        const renderer = await window.Renderer.init();
        
        const layer = renderer.createLayer('test-layer', {
            zIndex: 5,
            opacity: 0.8
        });
        
        assert.notNull(layer, '层应该被创建');
        assert.equal(layer.name, 'test-layer', '层名称应该正确');
        assert.equal(layer.zIndex, 5, 'Z 轴顺序应该正确');
        assert.equal(layer.opacity, 0.8, '透明度应该正确');
        assert.truthy(layer.canvas, '层 Canvas 应该存在');
        assert.truthy(layer.ctx, '层上下文应该存在');
    })
    
    // 测试 3: 获取渲染层
    .test('应该成功获取渲染层', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.createLayer('background', { zIndex: 0 });
        const bgLayer = renderer.getLayer('background');
        
        assert.notNull(bgLayer, '应该获取到背景层');
        assert.equal(bgLayer.name, 'background', '层名称应该匹配');
    })
    
    // 测试 4: 移除渲染层
    .test('应该成功移除渲染层', async () => {
        const renderer = await window.Renderer.init();
        
        const layer = renderer.createLayer('temp-layer', {});
        const layerCountBefore = renderer.layers.size;
        
        renderer.removeLayer('temp-layer');
        const layerCountAfter = renderer.layers.size;
        
        assert.equal(layerCountBefore, 4, '移除前应该有 4 个层');
        assert.equal(layerCountAfter, 3, '移除后应该有 3 个层');
        assert.equal(renderer.getLayer('temp-layer'), undefined, '层应该被移除');
    })
    
    // 测试 5: 渲染层透明度设置
    .test('应该正确设置层透明度', async () => {
        const renderer = await window.Renderer.init();
        
        const layer = renderer.createLayer('opacity-test', {});
        
        layer.setOpacity(0.5);
        assert.equal(layer.opacity, 0.5, '透明度应该更新为 0.5');
        assert.equal(layer.canvas.style.opacity, '0.5', 'Canvas 样式应该更新');
        
        layer.setOpacity(1.0);
        assert.equal(layer.opacity, 1.0, '透明度应该更新为 1.0');
        
        layer.setOpacity(1.5);
        assert.equal(layer.opacity, 1.0, '透明度应该被限制在 1.0');
        
        layer.setOpacity(-0.5);
        assert.equal(layer.opacity, 0, '透明度应该被限制在 0');
    })
    
    // 测试 6: 渲染层显示/隐藏
    .test('应该正确控制层显示/隐藏', async () => {
        const renderer = await window.Renderer.init();
        
        const layer = renderer.createLayer('visibility-test', {});
        
        layer.hide();
        assert.falsy(layer.visible, '层应该被隐藏');
        assert.equal(layer.canvas.style.display, 'none', 'Canvas 应该被隐藏');
        
        layer.show();
        assert.truthy(layer.visible, '层应该被显示');
        assert.equal(layer.canvas.style.display, 'block', 'Canvas 应该被显示');
    })
    
    // 测试 7: 渲染层 Z 轴顺序调整
    .test('应该正确调整层 Z 轴顺序', async () => {
        const renderer = await window.Renderer.init();
        
        const layer = renderer.createLayer('zindex-test', { zIndex: 0 });
        
        layer.toFront(999);
        assert.equal(layer.zIndex, 999, 'Z 轴顺序应该更新为 999');
        assert.equal(layer.canvas.style.zIndex, '999', 'Canvas 样式应该更新');
        
        layer.toBack(0);
        assert.equal(layer.zIndex, 0, 'Z 轴顺序应该更新为 0');
    })
    
    // 测试 8: 渲染器尺寸调整
    .test('应该正确调整渲染器尺寸', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.resize(1024, 768);
        
        assert.equal(renderer.canvas.width, 1024, 'Canvas 宽度应该更新');
        assert.equal(renderer.canvas.height, 768, 'Canvas 高度应该更新');
        
        const bgLayer = renderer.getLayer('background');
        assert.equal(bgLayer.canvas.width, 1024, '背景层宽度应该同步更新');
        assert.equal(bgLayer.canvas.height, 768, '背景层高度应该同步更新');
    })
    
    // 测试 9: 渲染器启动/停止
    .test('应该正确控制渲染循环', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.start();
        assert.truthy(renderer.isRunning, '渲染器应该正在运行');
        assert.notNull(renderer.animationFrameId, '应该有动画帧 ID');
        
        await TestUtil.wait(100);
        
        renderer.stop();
        assert.falsy(renderer.isRunning, '渲染器应该已停止');
        assert.null(renderer.animationFrameId, '动画帧 ID 应该被清除');
    })
    
    // 测试 10: 粒子添加与更新
    .test('应该正确添加和更新粒子', async () => {
        const renderer = await window.Renderer.init();
        
        const particle = new window.Renderer.Particle(100, 100, {
            vx: 2,
            vy: 2,
            life: 1.0,
            size: 5
        });
        
        assert.equal(particle.x, 100, '粒子 X 坐标应该正确');
        assert.equal(particle.y, 100, '粒子 Y 坐标应该正确');
        assert.equal(particle.life, 1.0, '粒子生命应该正确');
        
        renderer.addParticle(particle);
        assert.equal(renderer.particles.length, 1, '粒子应该被添加');
        
        particle.update();
        assert.equal(particle.x, 102, '粒子 X 坐标应该更新');
        assert.equal(particle.y, 102, '粒子 Y 坐标应该更新');
        assert.lessThan(particle.life, 1.0, '粒子生命应该减少');
    })
    
    // 测试 11: 粒子生命周期
    .test('应该正确检测粒子死亡', async () => {
        const particle = new window.Renderer.Particle(0, 0, {
            life: 0.1
        });
        
        assert.falsy(particle.isDead(), '粒子初始时应该存活');
        
        for (let i = 0; i < 10; i++) {
            particle.update();
        }
        
        assert.truthy(particle.isDead(), '粒子应该死亡');
    })
    
    // 测试 12: 爆炸效果
    .test('应该正确添加爆炸效果', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.addExplosion(400, 300, {
            count: 20,
            color: '#ff0000'
        });
        
        assert.equal(renderer.particles.length, 20, '应该生成 20 个粒子');
        
        renderer.particles.forEach(particle => {
            assert.equal(particle.color, '#ff0000', '粒子颜色应该正确');
        });
    })
    
    // 测试 13: 动画创建
    .test('应该正确创建动画', async () => {
        const renderer = await window.Renderer.init();
        
        let updateCount = 0;
        let completeCalled = false;
        
        const animation = renderer.createAnimation('test-anim', {
            duration: 500,
            onUpdate: (progress) => {
                updateCount++;
            },
            onComplete: () => {
                completeCalled = true;
            }
        });
        
        assert.notNull(animation, '动画应该被创建');
        assert.equal(animation.name, 'test-anim', '动画名称应该正确');
        assert.equal(animation.duration, 500, '动画时长应该正确');
        assert.falsy(animation.isPlaying, '动画初始不应该播放');
    })
    
    // 测试 14: 动画播放
    .test('应该正确播放动画', async () => {
        const renderer = await window.Renderer.init();
        
        let progressValue = 0;
        
        const animation = renderer.createAnimation('play-test', {
            duration: 200,
            onUpdate: (progress) => {
                progressValue = progress;
            }
        });
        
        renderer.playAnimation('play-test');
        assert.truthy(animation.isPlaying, '动画应该正在播放');
        
        await TestUtil.wait(300);
        
        assert.equal(progressValue, 1, '动画进度应该完成');
        assert.truthy(completeCalled, '完成回调应该被调用');
    })
    
    // 测试 15: 动画暂停/恢复
    .test('应该正确暂停和恢复动画', async () => {
        const renderer = await window.Renderer.init();
        
        let progressAtPause = 0;
        
        const animation = renderer.createAnimation('pause-test', {
            duration: 500,
            onUpdate: (progress) => {
                if (progress >= 0.5 && progressAtPause === 0) {
                    progressAtPause = progress;
                    renderer.pauseAnimation('pause-test');
                }
            }
        });
        
        renderer.playAnimation('pause-test');
        
        await TestUtil.wait(400);
        
        assert.truthy(animation.isPaused, '动画应该被暂停');
        
        renderer.resumeAnimation('pause-test');
        assert.falsy(animation.isPaused, '动画应该已恢复');
    })
    
    // 测试 16: 特效注册与启用
    .test('应该正确注册和启用特效', async () => {
        const renderer = await window.Renderer.init();
        
        const testEffect = {
            onStart: () => {},
            onUpdate: () => {},
            onRender: () => {}
        };
        
        renderer.registerEffect('test-effect', testEffect);
        
        const effect = renderer.effects.get('test-effect');
        assert.notNull(effect, '特效应该被注册');
        assert.equal(effect, testEffect, '特效对象应该匹配');
        
        renderer.enableEffect('test-effect');
        assert.truthy(renderer.activeEffects.has('test-effect'), '特效应该被启用');
    })
    
    // 测试 17: 特效禁用
    .test('应该正确禁用特效', async () => {
        const renderer = await window.Renderer.init();
        
        const testEffect = {
            onStart: () => {},
            onStop: () => {},
            onUpdate: () => {},
            onRender: () => {}
        };
        
        renderer.registerEffect('disable-test', testEffect);
        renderer.enableEffect('disable-test');
        
        assert.truthy(renderer.activeEffects.has('disable-test'), '特效应该已启用');
        
        renderer.disableEffect('disable-test');
        assert.falsy(renderer.activeEffects.has('disable-test'), '特效应该被禁用');
    })
    
    // 测试 18: 故障效果触发
    .test('应该正确触发故障效果', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.triggerGlitch(500);
        
        assert.truthy(renderer.activeEffects.has('glitch'), '故障效果应该被启用');
        
        await TestUtil.wait(600);
        
        assert.falsy(renderer.activeEffects.has('glitch'), '故障效果应该自动禁用');
    })
    
    // 测试 19: 矩阵雨效果触发
    .test('应该正确触发矩阵雨效果', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.triggerMatrixRain(1000);
        
        assert.truthy(renderer.activeEffects.has('matrixRain'), '矩阵雨效果应该被启用');
        
        await TestUtil.wait(1100);
        
        assert.falsy(renderer.activeEffects.has('matrixRain'), '矩阵雨效果应该自动禁用');
    })
    
    // 测试 20: 扫描线效果
    .test('应该正确添加扫描线效果', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.addScanline();
        
        assert.truthy(renderer.activeEffects.has('scanline'), '扫描线效果应该被启用');
        
        const scanlineEffect = renderer.effects.get('scanline');
        assert.notNull(scanlineEffect, '扫描线特效应该存在');
        assert.equal(scanlineEffect.y, 0, '扫描线初始 Y 坐标应该为 0');
    })
    
    // 测试 21: 性能监控
    .test('应该正确监控性能', async () => {
        const renderer = await window.Renderer.init();
        
        const stats = renderer.getPerformanceStats();
        
        assert.property(stats, 'fps', '性能统计应该包含 FPS');
        assert.property(stats, 'frameTime', '性能统计应该包含帧时间');
        assert.property(stats, 'avgFrameTime', '性能统计应该包含平均帧时间');
    })
    
    // 测试 22: 性能监控器更新
    .test('应该正确更新性能统计', async () => {
        const monitor = new window.Renderer.PerformanceMonitor();
        
        for (let i = 0; i < 10; i++) {
            monitor.begin();
            await TestUtil.wait(10);
            monitor.end();
        }
        
        const stats = monitor.getStats();
        
        assert.greaterThan(stats.fps, 0, 'FPS 应该大于 0');
        assert.greaterThan(stats.frameTime, 0, '帧时间应该大于 0');
    })
    
    // 测试 23: 渲染器配置
    .test('应该正确配置渲染器', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.configure({
            enableParticles: true,
            quality: {
                particleLimit: 500
            }
        });
        
        assert.truthy(renderer.config.enableParticles, '粒子应该被启用');
        assert.equal(renderer.config.quality.particleLimit, 500, '粒子限制应该更新');
    })
    
    // 测试 24: 层清除
    .test('应该正确清除层', async () => {
        const renderer = await window.Renderer.init();
        
        const bgLayer = renderer.getLayer('background');
        bgLayer.ctx.fillStyle = '#ff0000';
        bgLayer.ctx.fillRect(0, 0, 100, 100);
        
        bgLayer.clear();
        
        const imageData = bgLayer.ctx.getImageData(0, 0, 1, 1);
        assert.equal(imageData.data[3], 0, '像素应该被清除（透明）');
    })
    
    // 测试 25: 渲染器销毁
    .test('应该正确销毁渲染器', async () => {
        const renderer = await window.Renderer.init();
        
        renderer.createLayer('temp', {});
        renderer.start();
        
        await TestUtil.wait(50);
        
        renderer.dispose();
        
        assert.falsy(renderer.isRunning, '渲染器应该已停止');
        assert.equal(renderer.layers.size, 0, '所有层应该被移除');
        assert.equal(renderer.particles.length, 0, '所有粒子应该被清除');
        assert.equal(renderer.animations.size, 0, '所有动画应该被清除');
        assert.null(renderer.canvas, 'Canvas 引用应该被清除');
    });

// ==================== 运行测试 ====================

async function runAllTests() {
    console.log('🚀 开始运行 Renderer.js 单元测试');
    console.log('='.repeat(60));
    
    const results = await rendererSuite.run();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试总结');
    console.log('='.repeat(60));
    console.log(`总测试数：${results.total}`);
    console.log(`✅ 通过：${results.passed}`);
    console.log(`❌ 失败：${results.failed}`);
    console.log(`📈 通过率：${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));
    
    if (results.failed === 0) {
        console.log('🎉 所有测试通过！');
        return true;
    } else {
        console.log('⚠️  部分测试失败，请检查错误信息');
        return false;
    }
}

// 导出测试运行器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, TestSuite, TestCase, assert };
} else {
    window.RendererTests = { runAllTests, TestSuite, TestCase, assert };
}

// 自动运行测试（如果在浏览器环境）
if (typeof window !== 'undefined' && document.readyState === 'complete') {
    setTimeout(() => {
        runAllTests();
    }, 1000);
}
