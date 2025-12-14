
self.addEventListener('push', function (event) {
    if (!event.data) {
        console.log('Push event but no data');
        return;
    }

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon.png', // Ensure these exist
        badge: '/icon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/dashboard/log'
        },
        actions: [
            {
                action: 'log',
                title: 'Log Now'
            },
            {
                action: 'snooze',
                title: 'Snooze 10m'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'AG-Fit Nudge', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    let urlToOpen = event.notification.data.url;

    if (event.action === 'log') {
        urlToOpen = '/dashboard/log';
    } else if (event.action === 'snooze') {
        // TODO: Handle snooze logic (maybe silent fetch to API)
        return;
    }

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function (clientList) {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus().then(() => client.navigate(urlToOpen));
            }
            return clients.openWindow(urlToOpen);
        })
    );
});
