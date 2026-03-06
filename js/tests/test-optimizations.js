/**
 * tests/test-optimizations.js - 优化功能测试
 * 测试新实现的优化功能
 */

(function() {
    'use strict';
    
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTests);
    } else {
        runTests();
    }
    
    async function runTests() {
        const { describe, it, beforeEach, afterEach, assert, assertEquals, assertDeepEqual, run } = TestRunner;
        
        // ==================== Container 测试 ====================
        describe('Container - 依赖注入', () => {
            beforeEach(() => {
                Container.clear();
            });
            
            it('应该能注册和获取服务', () => {
                Container.register('test', () => ({ name: 'test' }));
                const service = Container.get('test');
                assertEquals(service.name, 'test');
            });
            
            it('应该支持单例模式', () => {
                Container.register('singleton', () => ({ count: 0 }));
                const s1 = Container.get('singleton');
                const s2 = Container.get('singleton');
                assert(s1 === s2, '应该是同一个实例');
            });
            
            it('应该能解析依赖', () => {
                Container.register('db', () => ({ query: () => 'data' }));
                Container.register('repo', (db) => ({ find: () => db.query() }), ['db']);
                const repo = Container.get('repo');
                assertEquals(repo.find(), 'data');
            });
            
            it('应该能检测循环依赖', () => {
                Container.register('a', () => Container.get('b'), ['b']);
                Container.register('b', () => Container.get('a'), ['a']);
                const hasCircular = Container.hasCircularDependency('a');
                assert(hasCircular, '应该检测到循环依赖');
            });
            
            it('应该能验证依赖', () => {
                Container.register('valid', () => {}, ['missing']);
                const validation = Container.validate();
                assert(validation.warnings.length > 0, '应该有警告');
            });
        });
        
        // ==================== SecurityManager 测试 ====================
        describe('SecurityManager - 安全功能', () => {
            it('应该能编码 HTML', () => {
                const encoded = SecurityManager.encodeHTML('<script>alert(1)</script>');
                assert(encoded.includes('&lt;'), '应该编码 < 符号');
                assert(encoded.includes('&gt;'), '应该编码 > 符号');
            });
            
            it('应该能检测 XSS 攻击', () => {
                assert(SecurityManager.detectXSS('<script>alert(1)</script>'), '应该检测 script 标签');
                assert(SecurityManager.detectXSS('javascript:alert(1)'), '应该检测 javascript:协议');
                assert(SecurityManager.detectXSS('<img onerror="alert(1)">'), '应该检测事件处理器');
            });
            
            it('应该不检测正常文本', () => {
                assert(!SecurityManager.detectXSS('normal text'), '正常文本不应被检测为 XSS');
                assert(!SecurityManager.detectXSS('<b>bold</b>'), '简单 HTML 标签不应被检测');
            });
            
            it('应该能验证输入', () => {
                const result1 = SecurityManager.validateInput('test', {
                    maxLength: 10,
                    minLength: 1
                });
                assert(result1.valid, '应该通过验证');
                
                const result2 = SecurityManager.validateInput('a'.repeat(100), {
                    maxLength: 10
                });
                assert(!result2.valid, '应该失败 - 超过最大长度');
            });
            
            it('应该能清理输入', () => {
                const cleaned = SecurityManager.sanitize('<script>alert(1)</script>');
                assert(!cleaned.includes('<'), '应该移除 < 符号');
            });
            
            it('应该能检查权限', () => {
                SecurityManager.setPermissionLevel(SecurityManager.PERMISSION_LEVELS.USER);
                assert(SecurityManager.hasPermission('execute_basic'), '用户应该有基础权限');
                assert(!SecurityManager.hasPermission('clear_logs'), '用户不应该有清除日志权限');
            });
        });
        
        // ==================== Optimizer 测试 ====================
        describe('Optimizer - 性能优化', () => {
            it('debounce 应该防抖', (done) => {
                let callCount = 0;
                const debounced = Optimizer.debounce(() => callCount++, 100);
                
                debounced();
                debounced();
                debounced();
                
                setTimeout(() => {
                    assertEquals(callCount, 1, '应该只调用一次');
                    done();
                }, 150);
            });
            
            it('throttle 应该节流', () => {
                let callCount = 0;
                const throttled = Optimizer.throttle(() => callCount++, 100);
                
                throttled();
                throttled();
                throttled();
                
                assert(callCount <= 2, '调用次数应该受限');
            });
            
            it('LRUCache 应该工作', () => {
                const cache = new Optimizer.LRUCache(2);
                cache.set('a', 1);
                cache.set('b', 2);
                
                assertEquals(cache.get('a'), 1);
                assertEquals(cache.get('b'), 2);
                
                cache.set('c', 3); // 应该淘汰 'a'
                assert(!cache.has('a'), '应该淘汰最久未使用的键');
                assertEquals(cache.size(), 2, '缓存大小应该正确');
            });
            
            it('memoize 应该缓存结果', () => {
                let callCount = 0;
                const memoized = Optimizer.memoize((x) => {
                    callCount++;
                    return x * 2;
                });
                
                assertEquals(memoized(5), 10);
                assertEquals(memoized(5), 10);
                assertEquals(callCount, 1, '应该只调用一次');
            });
        });
        
        // ==================== NotificationSystem 测试 ====================
        describe('NotificationSystem - 通知系统', () => {
            beforeEach(() => {
                NotificationSystem.closeAll();
            });
            
            it('应该能显示通知', () => {
                const notification = NotificationSystem.info('Test', 'Test message');
                assert(notification, '应该返回通知元素');
                assertEquals(NotificationSystem.getActiveCount(), 1, '应该有 1 个活动通知');
            });
            
            it('应该能关闭通知', (done) => {
                const notification = NotificationSystem.success('Test', 'Test message');
                NotificationSystem.close(notification, () => {
                    assertEquals(NotificationSystem.getActiveCount(), 0, '应该没有活动通知');
                    done();
                });
            });
            
            it('应该能自动关闭', (done) => {
                NotificationSystem.info('Auto Close', 'Will close in 100ms', { duration: 100 });
                
                setTimeout(() => {
                    assertEquals(NotificationSystem.getActiveCount(), 0, '应该自动关闭');
                    done();
                }, 200);
            });
        });
        
        // ==================== 集成测试 ====================
        describe('Integration - 集成测试', () => {
            it('Container 应该能注册所有模块', () => {
                Container.clear();
                
                // 注册可用的模块
                if (window.SecurityManager) {
                    Container.singleton('security', SecurityManager);
                }
                
                if (window.NotificationSystem) {
                    Container.singleton('notification', NotificationSystem);
                }
                
                if (window.Optimizer) {
                    Container.singleton('optimizer', Optimizer);
                }
                
                const security = Container.get('security');
                assert(security !== null, '应该能获取安全模块');
            });
            
            it('安全模块应该能保护输入', () => {
                const maliciousInput = '<script>alert("xss")</script>';
                const validation = SecurityManager.validateInput(maliciousInput);
                
                assert(!validation.valid || validation.sanitized !== maliciousInput, 
                    '应该检测或清理恶意输入');
            });
        });
        
        // 运行测试
        await TestRunner.run();
        
        // 显示测试报告到页面
        setTimeout(() => {
            TestRunner.exportToHTML();
        }, 1000);
    }
})();
