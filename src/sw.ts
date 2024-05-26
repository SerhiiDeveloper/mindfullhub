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
    switch (event.data.action) {
        case "deleteFromCache":
            caches.open(event.data.cacheName).then(cache => {
                cache.delete(event.data.url)
            })
            break;

        default:
            if (event.data.action === 'cacheData') {
                Promise.all([
                    caches.open("local-image-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("local-image-cache keys: ", keys);
                        })
                    }),
                    caches.open("local-audio-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("audio-cache keys: ", keys);
                        })
                    }),
                    caches.open("api-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("api-cache keys: ", keys);
                        })
                    }),
                    caches.open("image-api-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("image-api-cache keys: ", keys);
                        })
                    }),
                    caches.open("icon-api-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("icon-api-cache keys: ", keys);
                        })
                    }),
                    caches.open("music-api-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("music-api-cache keys: ", keys);
                        })
                    }),
                    caches.open("video-api-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("video-api-cache keys: ", keys);
                        })
                    }),
                    caches.open("local-video-cache").then(cache => {
                        cache.keys().then(keys => {
                            console.log("local-video-cache keys: ", keys);
                        })
                    }),
                ])
            }
            break;
    }
})


self.skipWaiting();
clientsClaim();

precacheAndRoute([...self.__WB_MANIFEST,
//      {
//     "url": "index.html",
//     "revision": new Date().toString()
// }
], {});

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
AudioCacheableResponse.cacheWillUpdate =  async ({ request, response }) => {
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
VideoCacheableResponse.cacheWillUpdate =  async ({ request, response }) => {
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
