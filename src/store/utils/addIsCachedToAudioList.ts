import { BGAudioGroupType } from "../workSpaceAudioStore";

type AddIsCachedToListType = (cacheName: string, list: BGAudioGroupType[]) => Promise<BGAudioGroupType[]>

export const addIsCachedToAudioList: AddIsCachedToListType = async (cacheName, list) => {
    if (!list) return [];
    const cache = await caches.open(cacheName);
    const isCachedListPromises = list.map(async (group) => {
        const isCachedListedPropertyPromises = group.audioPlayList.map((item) => {
            return cache.match(item.src).then(res => res ? {...item, isCached: true} : {...item, isCached: false})
        })
        return {...group, audioPlayList: await Promise.all(isCachedListedPropertyPromises)}
    })
    const isCachedList = await Promise.all(isCachedListPromises)
    
    return isCachedList || list
}