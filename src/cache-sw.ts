// import { cacheNames, clientsClaim } from 'workbox-core'
// import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
// import type { StrategyHandler } from 'workbox-strategies'
// import {
//     NetworkFirst,
//     NetworkOnly,
//     Strategy
// } from 'workbox-strategies'
// import type { ManifestEntry } from 'workbox-build'

// declare let self: ServiceWorkerGlobalScope
// declare type ExtendableEvent = any
// declare global {

//     interface ServiceWorkerGlobalScope {
//         location: string
//         skipWaiting: () => void
//         addEventListener: (type: string, listener: (event: ExtendableEvent) => void) => void
//     }
// }

// const data = {
//     race: false,
//     debug: true,
//     credentials: 'same-origin',
//     networkTimeoutSeconds: 0,
//     fallback: 'index.html'
// }

// const cacheName = cacheNames.runtime

// function buildStrategy(): Strategy {
//     if (data.race) {
//         class CacheNetworkRace extends Strategy {
//             _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
//                 const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request)
//                 const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request)

//                 return new Promise((resolve, reject) => {
//                     fetchAndCachePutDone.then(resolve).catch((e) => {
//                         if (data.debug)
//                             console.log(`Cannot fetch resource: ${request.url}`, e)
//                     })
//                     cacheMatchDone.then(response => response && resolve(response))

//                     Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
//                         const [fetchAndCachePutResult, cacheMatchResult] = results
//                         if (fetchAndCachePutResult.status === 'rejected' && !(cacheMatchResult as any).value)
//                             reject(fetchAndCachePutResult.reason)
//                     })
//                 })
//             }
//         }
//         return new CacheNetworkRace()
//     }
//     else {
//         if (data.networkTimeoutSeconds > 0)
//             return new NetworkFirst({ cacheName, networkTimeoutSeconds: data.networkTimeoutSeconds })
//         else
//             return new NetworkFirst({ cacheName })
//     }
// }

// const manifest = self.__WB_MANIFEST as Array<ManifestEntry>

// const cacheEntries: RequestInfo[] = []

// const manifestURLs = manifest.map(
//     (entry) => {
//         const url = new URL(entry.url, self.location)
//         const push = new Request(url.href, {
//             credentials: data.credentials as any
//         })
//         console.log("manifest URL: ", push);
//         cacheEntries.push(push)
//         return url.href
//     }
// )

// self.addEventListener('install', (event: ExtendableEvent) => {
//     event.waitUntil(
//         caches.open(cacheName).then((cache) => {
//             return cache.addAll(cacheEntries)
//         })
//     )
// })

// self.addEventListener('activate', (event: ExtendableEvent) => {
//     event.waitUntil(
//         caches.open("API_CACHE").then(cache => {
//             cache.keys().then(keys => {
//                 console.log("API_CACHE keys: ", keys);
//                 keys.forEach(key => cache.delete(key));
//             })
//         })
//     )

//     event.waitUntil(
//         caches.open(cacheName).then((cache) => {

//             cache.keys().then((keys) => {
//                 console.log("KEYS: ", keys)
//                 keys.forEach((request) => {
//                     data.debug && console.log(`Checking cache entry to be removed: ${request.url}`)
//                     if (!manifestURLs.includes(request.url)) {
//                         cache.delete(request).then((deleted) => {
//                             if (data.debug) {
//                                 if (deleted)
//                                     console.log(`Precached data removed: ${request.url || request}`)
//                                 else
//                                     console.log(`No precache found: ${request.url || request}`)
//                             }
//                         })
//                     }
//                 })
//             })
//         })
//     )
// })
// self.addEventListener('fetch', (event: ExtendableEvent) => {
//     console.log("fetch url: ", event.request.url)
//     if (event.request.url.includes("/api/")) {
//         event.respondWith(
//             (async function () {
//                 const cache = await caches.open("API_CACHE");
//                 const cachedResponse = await cache.match(event.request);
//                 console.log("GET from cache: ", cachedResponse)
//                 // return cachedResponse
//                 if (cachedResponse) return cachedResponse;
//                 const networkResponse = await fetch(event.request)
//                 event.waitUntil(cache.put(event.request, networkResponse.clone()));
//                 console.log("GET from fetch: ", networkResponse)
//                 return networkResponse;

//             })(),
//         );
//     }
//     if (event.request.url.includes(".mp4")) {
//         console.log("mp4 from cache: ", event.request)
//         event.respondWith(caches.match(event.request));
//     }
//     return;
// })

// self.addEventListener('message', event => {
//     if (event.data.action === 'cacheData') {
//         console.log("message: ", event.data)
//         const request = new Request(event.data.url, {

//             method: "GET",
//             headers: {

//                 'Access-Control-Allow-Origin': "*",
//                 "Access-Control-Allow-Credentials": "true"
//             }
//         })
//         fetch(request).then(async (response) => {
//             const cache = await caches.open("VIDEO_CACHE");
//             return cache.put(request, response.clone())
//         }).then(() => {
//             event.source.postMessage("Hi client, i am cached");
//         }).catch(error => {
//             console.log("failed to fetch and cache")
//         })
//     }

// });

// registerRoute(
//     ({ url }) => manifestURLs.includes(url.href),
//     buildStrategy()
// )

// setDefaultHandler(new NetworkOnly())


// setCatchHandler(({ event }): Promise<Response> => {
//     switch (event.request.destination) {
//         case 'document':
//             return caches.match(data.fallback).then((r) => {
//                 return r ? Promise.resolve(r) : Promise.resolve(Response.error())
//             })
//         default:
//             return Promise.resolve(Response.error())
//     }
// })

// self.skipWaiting()
// clientsClaim()