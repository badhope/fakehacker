/**
 * 单元测试 - BaseEffect 参数验证
 */

(function() {
    console.log('🧪 开始运行 BaseEffect 参数验证测试...');
    
    let passed = 0;
    let failed = 0;
    
    function assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            passed++;
        } else {
            console.error(`❌ ${testName}`);
            failed++;
        }
    }
    
    // 创建测试特效
    class TestEffect extends BaseEffect {
        get name() { return 'TestEffect'; }
        get defaultParams() {
            return {
                speed: 50,
                count: 100,
                color: '#ffffff',
                enabled: true
            };
        }
    }
    
    const canvas = document.createElement('canvas');
    const effect = new TestEffect(canvas);
    
    // 测试正常参数更新
    effect.updateParams({ speed: 80 });
    assert(effect.params.speed === 80, '正常数值参数更新');
    
    // 测试 NaN 拒绝
    const oldSpeed = effect.params.speed;
    effect.updateParams({ speed: NaN });
    assert(effect.params.speed === oldSpeed, '拒绝 NaN 值');
    
    // 测试 Infinity 拒绝
    effect.updateParams({ speed: Infinity });
    assert(effect.params.speed === oldSpeed, '拒绝 Infinity 值');
    
    // 测试类型检查
    effect.updateParams({ speed: 'invalid' });
    assert(effect.params.speed === oldSpeed, '拒绝错误类型');
    
    // 测试未知参数
    effect.updateParams({ unknownParam: 123 });
    assert(effect.params.unknownParam === undefined, '忽略未知参数');
    
    // 测试多参数更新
    effect.updateParams({ speed: 60, count: 200 });
    assert(effect.params.speed === 60 && effect.params.count === 200, '多参数同时更新');
    
    // 测试 reset 功能
    effect.updateParams({ speed: 999 });
    effect.reset();
    assert(effect.params.speed === 50, 'reset 恢复默认值');
    
    // 测试 getParams
    const params = effect.getParams();
    assert(params.speed === 50 && params.count === 100, 'getParams 返回正确参数');
    
    console.log('\n=================================');
    console.log(`测试结果：${passed} 通过，${failed} 失败`);
    console.log('=================================\n');
    
    if (failed > 0) {
        throw new Error(`有 ${failed} 个测试失败`);
    }
})();
