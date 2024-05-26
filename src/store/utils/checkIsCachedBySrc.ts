type CheckIsCachedBySrcType = (cacheName: string, src: string) => Promise<boolean>

export const checkIsCachedBySrc: CheckIsCachedBySrcType = async (cacheName, src) => {
    const cache = await caches.open(cacheName);
    const match = await cache.match(src)

    return Boolean(match)
}