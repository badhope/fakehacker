/* ==========================================
   Service Worker - PWA 离线支持
   版本：3.0
   ========================================== */

const CACHE_NAME = 'qht-cache-v3';
const CACHE_VERSION = '3.0.0';

// 需要缓存的资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css',
  '/css/animations.css',
  '/css/enhanced.css',
  '/js/config/CONFIG.js',
  '/js/core/EventBus.js',
  '/js/core/Application.js',
  '/js/ui/UIModule.js',
  '/js/ui/QuickActions.js',
  '/js/ui/ModernUI.js',
  '/js/ui/SettingsPanel.js',
  '/js/effects/EffectsEngine.js',
  '/js/commands/CommandSystem.js',
  '/js/commands/LetterCommands.js',
  '/js/systems/AudioManager.js',
  '/js/systems/StorageManager.js',
  '/js/systems/ThemeManager.js',
  '/js/systems/UserExperience.js',
  '/js/systems/PerformanceManager.js',
  '/js/systems/QuestSystem.js',
  '/js/utils.js'
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// 获取事件
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;
  
  // 跳过跨域请求
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 返回缓存并异步更新
          event.waitUntil(updateCache(event.request));
          return cachedResponse;
        }
        
        // 缓存未命中，从网络获取
        return fetchAndCache(event.request);
      })
      .catch((error) => {
        console.error('[ServiceWorker] Fetch failed:', error);
        // 离线时的回退方案
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      })
  );
});

// 从网络获取并缓存
async function fetchAndCache(request) {
  const response = await fetch(request);
  
  // 只缓存成功响应
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  
  return response;
}

// 异步更新缓存
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response);
    }
  } catch (error) {
    // 忽略更新错误
  }
}

// 后台同步
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Sync event:', event.tag);
  
  if (event.tag === 'sync-quests') {
    event.waitUntil(syncQuestData());
  }
});

// 同步任务数据
async function syncQuestData() {
  // 实现任务数据同步逻辑
  console.log('[ServiceWorker] Syncing quest data...');
}

// 推送通知
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  const options = {
    body: event.data ? event.data.text() : '新任务已更新！',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: '查看',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('量子黑客终端', options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received');
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/?action=quests')
    );
  }
});

// 消息处理
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      })
    );
  }
});

// 定期后台更新
async function backgroundUpdate() {
  const cache = await caches.open(CACHE_NAME);
  
  // 检查关键资源是否有更新
  for (const url of STATIC_ASSETS) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      // 忽略错误
    }
  }
}

// 每 6 小时检查一次更新
setInterval(backgroundUpdate, 6 * 60 * 60 * 1000);
