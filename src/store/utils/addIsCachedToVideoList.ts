import { BGVideoGroupType } from "../workSpaceVideoStore";

type AddIsCachedToListType = (cacheName: string, list: BGVideoGroupType[]) => Promise<BGVideoGroupType[]>

export const addIsCachedToVideoList: AddIsCachedToListType = async (cacheName, list) => {
    if (!list) return [];
    if (!caches) return list;
    const cache = await caches.open(cacheName);
    const isCachedListPromises = list.map(async (group) => {
        const isCachedListedPropertyPromises = group.video.map((item) => {
            return cache.match(item.src).then(res => res ? { ...item, isCached: true } : { ...item, isCached: false })
        })
        return { ...group, video: await Promise.all(isCachedListedPropertyPromises) }
    })
    const isCachedList = await Promise.all(isCachedListPromises)

    return isCachedList || list
}