import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"


declare let self: ServiceWorkerGlobalScope
declare global {
    interface ServiceWorkerGlobalScope {
        location: string
    }
}

self.addEventListener('message', (event) => {
    console.log(event.data)
    if (!caches) return;
    switch (event.data.action) {
        case "deleteFromCache":
            caches.open(event.data.cacheName).then(cache => {
                cache.delete(event.data.url)
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            action: "deletedFromCache",
                            cacheName: event.data.cacheName,
                            url: event.data.url
                        })
                    })
                })
            })
            break;

        default:
            break;
    }
})


self.skipWaiting();
clientsClaim();

precacheAndRoute([...self.__WB_MANIFEST,], {});

cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), {
    allowlist: [/^\/$/]
}));
registerRoute(/\.(?:png|jpg|jpeg|svg|webp)$/, new CacheFirst({
    "cacheName": "app-image-cache",
    plugins: [new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 604800
    })]
}), 'GET');
registerRoute(/\.(?:mp3)$/, new CacheFirst({
    "cacheName": "app-audio-cache",
    plugins: [new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 604800
    })]
}), 'GET');
registerRoute(
    ({ url }) =>
        url.origin === 'https://mindfullhubbucket.s3.eu-north-1.amazonaws.com' &&
        url.pathname.startsWith('/image/'),
    new CacheFirst({
        cacheName: 'image-api-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200, 300],
            }),
        ],
    })
);
registerRoute(
    ({ url }) =>
        url.origin === 'https://mindfullhubbucket.s3.eu-north-1.amazonaws.com' &&
        url.pathname.startsWith('/icon/'),
    new CacheFirst({
        cacheName: 'icon-api-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200, 300],
            }),
        ],
    })
);

const AudioCacheableResponse = new CacheableResponsePlugin({
    statuses: [0, 200, 300]
})
AudioCacheableResponse.cacheWillUpdate = async ({ request, response }) => {
    if (response) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    action: "cacheAPIAudioData",
                    url: request.url
                })
            })
        })
    }
    return response
}
registerRoute(
    ({ url }) =>
        url.origin === 'https://mindfullhubbucket.s3.eu-north-1.amazonaws.com' &&
        url.pathname.startsWith('/music/'),
    new CacheFirst({
        cacheName: 'music-api-cache',
        plugins: [
            AudioCacheableResponse
        ],
    })
);

const VideoCacheableResponse = new CacheableResponsePlugin({
    statuses: [0, 200, 300]
})
VideoCacheableResponse.cacheWillUpdate = async ({ request, response }) => {
    if (response) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    action: "cacheAPIVideoData",
                    url: request.url
                })
            })
        })
    }
    return response
}
registerRoute(
    ({ url }) =>
        url.origin === 'https://mindfullhubbucket.s3.eu-north-1.amazonaws.com' &&
        url.pathname.startsWith('/video/'),
    new CacheFirst({
        cacheName: 'video-api-cache',
        plugins: [
            VideoCacheableResponse,
        ],
    })
);
