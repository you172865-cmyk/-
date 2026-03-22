// push-manager.js

// 请求通知权限
function requestNotificationPermission() {
    return new Promise((resolve, reject) => {
        if (!('Notification' in window)) {
            alert('抱歉，你的浏览器不支持桌面通知。');
            return reject('unsupported');
        }
        if (Notification.permission === 'granted') {
            return resolve('granted');
        }
        if (Notification.permission === 'denied') {
            alert('你已经拒绝了通知权限。请在浏览器设置中手动开启。');
            return reject('denied');
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('通知权限已获取！');
                resolve('granted');
            } else {
                console.log('用户拒绝了通知权限。');
                reject('denied');
            }
        });
    });
}

// 显示一个本地测试通知
function showTestNotification() {
    requestNotificationPermission().then(permission => {
        if (permission === 'granted') {
            const options = {
                body: '如果能看到这条消息，说明你的设备支持通知功能！',
                icon: config.aiAvatar || 'https://img.heliar.top/file/1774020720552_IMG_5899.jpeg', // 使用AI头像或默认图标
                badge: 'https://img.heliar.top/file/1774020720552_IMG_5899.jpeg', // 小图标
                vibrate: [200, 100, 200], // 震动模式
            };
            // 尝试通过 Service Worker 显示通知，这样更强大
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('肉肉机推送测试 🚀', options);
                });
            } else {
                // 降级使用普通通知
                new Notification('肉肉机推送测试 🚀', options);
            }
            alert('推送请求已发送！\n请检查你的手机/电脑通知栏。');
        }
    }).catch(err => {
        console.error('显示测试通知失败:', err);
    });
}
