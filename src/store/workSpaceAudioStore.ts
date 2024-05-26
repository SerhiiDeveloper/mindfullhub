import { create } from "zustand";
import { persist } from "zustand/middleware";
import { callFetchAndCache } from "./utils/callFetchAndCache";
import { addIsCachedToAudioList } from "./utils/addIsCachedToAudioList";
import { UpdateCachedType } from "./workSpaceVideoStore";

export type BGAudioType = {
    src: string;
    _id: string;
    title: string;
    isCached?: boolean;
}
export type BGAudioGroupType = {
    audioPlayList: BGAudioType[],
    _id: string
    icon: string
    title: string
}

interface IWorkSpaceAudioStore {
    bgAudioList: BGAudioGroupType[]
    activeAudioGroupId: string
    activeAudioId: string
    setActiveAudioGroupId: (id: string) => void
    setActiveAudioId: (id: string) => void
    getAudioListFromApi: () => void
    updateAudioCachedById: UpdateCachedType
    deleteFromCacheById: (id: string) => void
}

export const useWorkSpaceAudioStore = create<IWorkSpaceAudioStore>()(persist((set, get) => ({
    getAudioListFromApi: async () => {
        let audioList = await callFetchAndCache<BGAudioGroupType[]>("/api/audio-list")
        audioList = await addIsCachedToAudioList('music-api-cache', audioList)

        const activeAudioId = get().activeAudioId
        const activeAudioGroupId = get().activeAudioGroupId
        const isExist = audioList.find(group => group?._id === activeAudioGroupId)
        if (activeAudioId && activeAudioGroupId && isExist) {
            set(() => ({ bgAudioList: audioList }))
            return
        }

        set(() => ({ bgAudioList: audioList, activeAudioGroupId: audioList[0]?._id || "", activeAudioId: audioList[0]?.audioPlayList?.[0]?._id || "" }))
    },
    bgAudioList: [],
    activeAudioGroupId: "",
    activeAudioId: "",
    setActiveAudioGroupId: (id) => set(() => ({ activeAudioGroupId: id, activeAudioId: get().bgAudioList.find(group => group._id === id)?.audioPlayList?.[0]?._id || "" })),
    setActiveAudioId: (id) => set(() => ({ activeAudioId: id })),
    updateAudioCachedById: async (src) => {
        // let isCached = true
        // if (id) {
        //    isCached = await checkIsCachedBySrc('music-api-cache', src)
        // }
        const bgAudioList = get().bgAudioList.map(group => {
            const audio = group.audioPlayList.map(item => item.src === src ? { ...item, isCached: true } : item)
            return { ...group, audioPlayList: audio }
        })
        set(() => ({ bgAudioList }))
    },
    deleteFromCacheById: (id) => {
        let url;
        const bgAudioList = get().bgAudioList.map(group => {
            const audioPlayList = group.audioPlayList.map(item => {
                if (item._id === id) {
                    url = item.src
                    return { ...item, isCached: false }
                }
                return item
            })
            return { ...group, audioPlayList }
        })
        if ("serviceWorker" in navigator && url) navigator.serviceWorker.controller?.postMessage({
            action: "deleteFromCache",
            url,
            cacheName: "music-api-cache"
        });

        set(() => ({ bgAudioList, activeAudioId: ""}))
    }
}), {
    name: "workSpaceAudioStore",
    partialize: (state) => ({ activeAudioId: state.activeAudioId, activeAudioGroupId: state.activeAudioGroupId })
}));
