import { CacheableResponse } from 'workbox-cacheable-response';

const cacheable = new CacheableResponse({
    statuses: [0, 200, 300],
});

type CallFetchAndCacheType = <T>(url: string) => Promise<T>

export const callFetchAndCache: CallFetchAndCacheType = async (url) => {
    const request = new Request(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let listResponse = await fetch(request)
        .then(async (response) => {
            const isCacheble = cacheable.isResponseCacheable(response)
            if (isCacheble && caches) {
                const responseClone = response.clone()
                caches.open('api-cache').then(async cache => {
                    const match = await cache.match(responseClone.url)
                    if (match) {
                        await cache.delete(match.url)
                    }
                    await cache.put(responseClone.url, responseClone);
                })
            }
            return response
        })
        .then(response => response.json())
        .catch(error => {
            console.error("Handle error: ", error)
        })
    if (!listResponse && caches) {
        const cache = await caches.open('api-cache')
        const match = await cache.match(request.url)
        listResponse = !match ? [] : await match.json()
    }
    return listResponse
}