import { create } from "zustand";
import { persist } from "zustand/middleware";
import { callFetchAndCache } from "./utils/callFetchAndCache.ts";
import { addIsCachedToVideoList } from "./utils/addIsCachedToVideoList.ts"
import { checkIsCachedBySrc } from "./utils/checkIsCachedBySrc.ts";

export type BGVideoType = {
    src: string;
    _id: string;
    isCached?: boolean
    title: string
}
export type BGVideoGroupType = {
    video: BGVideoType[],
    poster: string
    _id: string
    icon: string
    title: string
}

export type BGVideoDataType = BGVideoType & {
    poster?: string
}

export type UpdateCachedType = (src: string) => void

interface IWorkSpaceVideoStore {
    getVideoListFromApi: () => void
    bgVideoList: BGVideoGroupType[]
    activeVideoId: string
    activeVideoGroupId: string
    setNextActiveVideo: (id?: string) => void
    setActiveVideoGroupId: (id: string) => void
    updateVideoCached: UpdateCachedType
    deleteFromCacheById: (id: string) => void
}

export const useWorkSpaceVideoStore = create<IWorkSpaceVideoStore>()(persist((set, get) => ({
    getVideoListFromApi: async () => {
        let videoList = await callFetchAndCache<BGVideoGroupType[]>("http://localhost:8080/api/video-list")
        videoList = await addIsCachedToVideoList('video-api-cache', videoList)

        const activeVideoId = get().activeVideoId
        const activeVideoGroupId = get().activeVideoGroupId
        const isExist = videoList.find(group => group?._id === activeVideoGroupId)
        if (activeVideoId && activeVideoGroupId && isExist) {
            set(() => ({ bgVideoList: videoList }))
            return
        }

        const newActiveVideoGroupId = videoList[0]?._id || ""
        const newActiveVideoId = videoList[0]?.video[0]?._id || ""
        set(() => ({ bgVideoList: videoList, activeVideoId: newActiveVideoId, activeVideoGroupId: newActiveVideoGroupId }))
    },
    bgVideoList: [],
    activeVideoId: "",
    activeVideoGroupId: "",
    setNextActiveVideo: (id) => {
        if (id === "") {
            set(() => ({ activeVideoId: "" }))
        }
        else if (!id) {
            const activeGroup = get().bgVideoList.find(group => group._id === get().activeVideoGroupId)!
            const activeVideoIndex = activeGroup.video.findIndex(video => video._id === get().activeVideoId)
            const nextVideoIndex = activeVideoIndex === activeGroup.video.length - 1 ? 0 : activeVideoIndex + 1
            set(() => ({ activeVideoId: activeGroup.video[nextVideoIndex]._id }))
        } else {
            set(() => ({ activeVideoId: id }))
        }
    },
    setActiveVideoGroupId: (id) => {
        if (id === "") {
            set(() => ({ activeVideoGroupId: "", activeVideoId: "" }))
        }
        else {
            set(() => ({ activeVideoGroupId: id, activeVideoId: get().bgVideoList.find(group => group._id === id)!.video[0]._id }))
        }
    },
    updateVideoCached: async (src) => {
        console.log("updateVideoCached: ", src);
        // let isCached = true
        // if (id) {
        //    isCached = await checkIsCachedBySrc('video-api-cache', src)
        // }
        const bgVideoList = get().bgVideoList.map(group => {
            const video = group.video.map(item => item.src === src ? { ...item, isCached: true } : item)
            return { ...group, video }
        })
        console.log("updateVideoCached: ", bgVideoList)
        set(() => ({ bgVideoList }))
    },
    deleteFromCacheById: (id) => {
        let url;
        const bgVideoList = get().bgVideoList.map(group => {
            const video = group.video.map(item => {
                if (item._id === id) {
                    url = item.src
                    return { ...item, isCached: false }
                }
                return item
            })
            return { ...group, video }
        })
        if ("serviceWorker" in navigator && url) navigator.serviceWorker.controller?.postMessage({
            action: "deleteFromCache",
            url,
            cacheName: "video-api-cache"
        });

        set(() => ({ bgVideoList, activeVideoId: ""}))
    }
}), { 
    name: "workSpaceVideoStore",
    partialize: (state) => ({activeVideoId: state.activeVideoId, activeVideoGroupId: state.activeVideoGroupId}),
 }));
