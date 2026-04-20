// sw.js 文件

// 定义缓存的名字，每次更新应用时，最好修改一下这个版本号
const CACHE_NAME = 'rourouji-cache-v14'; 

// 定义需要被缓存的核心文件列表
const urlsToCache = [
  '/',
  'index.html', 
  // 注意：如果你的CSS和JS是写在单独的文件里，也需要在这里把它们的文件名加进去。
  // 但根据你提供的代码，它们都内嵌在html里了，所以目前这样就够了。
];

// 监听 install 事件，它在Service Worker首次注册时触发
self.addEventListener('install', event => {
  // 执行安装步骤
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // 将核心文件添加到缓存
      })
  );
});

// 监听 fetch 事件，它会拦截应用发出的所有网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    // 采用“缓存优先”策略
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到了匹配的资源，就直接返回它
        if (response) {
          return response;
        }
        // 如果缓存中没有，则从网络请求，并返回请求结果
        return fetch(event.request);
      }
    )
  );
});
