/* ==========================================
   模块名称：systems/PerformanceManager.js
   功能：性能优化管理、资源调度、缓存策略
   版本：3.0 - 系统性能优化
   ========================================== */

/**
 * 性能管理器 - 全面提升应用性能
 */
const PerformanceManager = (function() {
    // 性能配置
    const config = {
        enableCache: true,
        enableLazyLoad: true,
        enableCompression: true,
        maxCacheSize: 50, // MB
        cacheExpiry: 3600000, // 1 小时
        fpsTarget: 60
    };

    // 性能指标
    const metrics = {
        loadTime: 0,
        fps: 60,
        memoryUsage: 0,
        cacheHits: 0,
        cacheMisses: 0,
        frameCount: 0,
        lastFrameTime: 0
    };

    // 缓存存储
    const cache = new Map();
    const resourceCache = new Map();

    /**
     * 初始化性能管理器
     */
    function init() {
        startPerformanceMonitoring();
        setupResourcePreloading();
        optimizeAnimation();
        console.log("PerformanceManager initialized");
    }

    /**
     * 开始性能监控
     */
    function startPerformanceMonitoring() {
        // 监控 FPS
        let lastTime = performance.now();
        let frames = 0;

        function measureFPS() {
            const now = performance.now();
            frames++;
            
            if (now - lastTime >= 1000) {
                metrics.fps = frames;
                frames = 0;
                lastTime = now;
                
                // 如果 FPS 过低，降低动画质量
                if (metrics.fps < 30) {
                    reduceAnimationQuality();
                }
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        measureFPS();

        // 监控内存使用
        if (window.performance && performance.memory) {
            setInterval(() => {
                metrics.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
            }, 5000);
        }

        // 记录加载时间
        window.addEventListener('load', () => {
            metrics.loadTime = performance.now() - performance.timing.navigationStart;
            console.log(`Page loaded in ${metrics.loadTime.toFixed(2)}ms`);
        });
    }

    /**
     * 设置资源预加载
     */
    function setupResourcePreloading() {
        // 预加载关键资源
        const criticalResources = [
            'css/main.css',
            'css/components.css',
            'css/animations.css',
            'js/config/CONFIG.js',
            'js/core/Application.js'
        ];

        criticalResources.forEach(url => {
            preloadResource(url);
        });
    }

    /**
     * 预加载资源
     */
    function preloadResource(url, type = 'fetch') {
        if (resourceCache.has(url)) {
            return resourceCache.get(url);
        }

        let promise;
        if (type === 'image') {
            promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        } else {
            promise = fetch(url)
                .then(response => response.text())
                .catch(err => {
                    console.warn(`Failed to preload ${url}:`, err);
                    return null;
                });
        }

        resourceCache.set(url, promise);
        return promise;
    }

    /**
     * 优化动画性能
     */
    function optimizeAnimation() {
        // 使用 CSS transforms 代替 top/left
        const style = document.createElement('style');
        style.textContent = `
            .optimized-animation {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);

        // 检测用户是否偏好减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    /**
     * 降低动画质量（当 FPS 过低时）
     */
    function reduceAnimationQuality() {
        document.body.classList.add('low-fps');
        
        const style = document.createElement('style');
        style.textContent = `
            .low-fps .letter-btn::after,
            .low-fps .progress-bar::after {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 缓存数据
     */
    function setCache(key, data, expiry = null) {
        if (!config.enableCache) return;
        
        const item = {
            data: data,
            timestamp: Date.now(),
            expiry: expiry || config.cacheExpiry
        };
        
        cache.set(key, item);
        metrics.cacheHits++;
        
        // 清理过期缓存
        if (cache.size > config.maxCacheSize) {
            cleanupCache();
        }
    }

    /**
     * 获取缓存数据
     */
    function getCache(key) {
        if (!cache.has(key)) {
            metrics.cacheMisses++;
            return null;
        }
        
        const item = cache.get(key);
        const now = Date.now();
        
        if (now - item.timestamp > item.expiry) {
            cache.delete(key);
            metrics.cacheMisses++;
            return null;
        }
        
        metrics.cacheHits++;
        return item.data;
    }

    /**
     * 清理过期缓存
     */
    function cleanupCache() {
        const now = Date.now();
        for (const [key, item] of cache.entries()) {
            if (now - item.timestamp > item.expiry) {
                cache.delete(key);
            }
        }
    }

    /**
     * 懒加载图片
     */
    function lazyLoadImages() {
        if (!config.enableLazyLoad) return;
        
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 批量 DOM 操作
     */
    function batchDOMUpdates(callback) {
        const fragment = document.createDocumentFragment();
        callback(fragment);
        document.body.appendChild(fragment);
    }

    /**
     * 获取性能指标
     */
    function getMetrics() {
        return {
            ...metrics,
            cacheHitRate: metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100,
            cacheSize: cache.size
        };
    }

    /**
     * 性能分析开始
     */
    function startProfile(name) {
        console.time(name);
    }

    /**
     * 性能分析结束
     */
    function endProfile(name) {
        console.timeEnd(name);
    }

    /**
     * 内存清理
     */
    function cleanup() {
        // 清理缓存
        cache.clear();
        resourceCache.clear();
        
        // 清理定时器
        const maxInterval = setInterval(() => {}, 0);
        for (let i = 0; i < maxInterval; i++) {
            clearInterval(i);
        }
        
        // 清理事件监听器（需要手动管理的事件）
        console.log('Memory cleanup completed');
    }

    /**
     * 优化 Canvas 性能
     */
    function optimizeCanvas(canvas) {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // 禁用图像平滑（提升性能）
        ctx.imageSmoothingEnabled = false;
        
        // 使用离屏 Canvas
        const offscreen = document.createElement('canvas');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offscreenCtx = offscreen.getContext('2d');
        
        return {
            canvas: offscreen,
            ctx: offscreenCtx,
            flush: () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreen, 0, 0);
            }
        };
    }

    /**
     * 资源加载进度
     */
    function trackResourceProgress(resources) {
        let loaded = 0;
        const total = resources.length;
        
        resources.forEach(url => {
            preloadResource(url).then(() => {
                loaded++;
                const progress = (loaded / total) * 100;
                console.log(`Resource loading: ${progress.toFixed(1)}%`);
                
                if (loaded === total) {
                    console.log('All resources loaded');
                }
            });
        });
    }

    // 公开 API
    return {
        init,
        setCache,
        getCache,
        lazyLoadImages,
        debounce,
        throttle,
        batchDOMUpdates,
        getMetrics,
        startProfile,
        endProfile,
        cleanup,
        optimizeCanvas,
        preloadResource,
        trackResourceProgress,
        getConfig: () => config
    };
})();

// 导出到全局作用域
window.PerformanceManager = PerformanceManager;

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PerformanceManager.init());
} else {
    PerformanceManager.init();
}
