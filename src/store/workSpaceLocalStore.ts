import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BGVideoType } from "./workSpaceVideoStore";
import { BGAudioType } from "./workSpaceAudioStore";
import { saveLocalFileToCache } from "./utils/saveLocalFileToCache";
import { getLocalListFromCache } from "./utils/getLocalListFromCache";

export type BGImageType = {
    _id: string,
    src: string,
    title: string
}

interface IWorkSpaceLocalStore {
    videoList: BGVideoType[]
    audioList: BGAudioType[]
    imageList: BGImageType[]
    activeVideoId: string,
    activeAudioId: string,
    activeImageId: string
    setActiveVideoId: (id: string) => void
    setActiveAudioId: (id: string) => void
    setActiveImageId: (id: string) => void
    addVideo: (file: File, title: string) => void
    addAudio: (file: File, title: string) => void
    getVideoListFromCache: () => void
    getAudioListFromCache: () => void
    deleteVideoById: (id: string) => void
    deleteAudioById: (id: string) => void
}

export const useWorkSpaceLocalStore = create<IWorkSpaceLocalStore>()(persist((set, get) => ({
    videoList: [],
    audioList: [],
    imageList: [],
    activeVideoId: "",
    activeAudioId: "",
    activeImageId: "",
    setActiveVideoId: (id) => set(() => ({ activeVideoId: id })),
    setActiveAudioId: (id) => set(() => ({ activeAudioId: id })),
    setActiveImageId: (id) => set(() => ({ activeImageId: id })),
    addVideo: async (file, title) => {
        const video = {
            _id: Math.random().toString(),
            src: URL.createObjectURL(file),
            title
        }
        saveLocalFileToCache(file, "local-video-cache", video._id, video.title)
        set(state => ({ videoList: [...state.videoList, video], activeVideoId: video._id }))
    },
    addAudio: async (file, title) => {
        const audio = {
            _id: Math.random().toString(),
            src: URL.createObjectURL(file),
            title
        }
        saveLocalFileToCache(file, "local-audio-cache", audio._id, audio.title)
        set(state => ({ audioList: [...state.audioList, audio], activeAudioId: audio._id }))

    },
    getVideoListFromCache: async () => {
        if (get().videoList.length) return
        getLocalListFromCache("local-video-cache").then(list => set(() => ({ videoList: list })))
    },
    getAudioListFromCache: async () => {
        if (get().audioList.length) return
        getLocalListFromCache("local-audio-cache").then(list => set(() => ({ audioList: list })))
    },
    deleteVideoById: (id) => {
        if ("serviceWorker" in navigator && id) navigator.serviceWorker.controller?.postMessage({
            action: "deleteFromCache",
            url: id,
            cacheName: "local-video-cache"
        });
        const newActiveVideoId = get().activeVideoId === id ? "" : get().activeVideoId
        const newVideoList = get().videoList.filter(video => {
            if (video._id === id){
                URL.revokeObjectURL(video.src)
                return false
            }
            return true
        })
        set(() => ({ videoList: newVideoList, activeVideoId: newActiveVideoId }))
    },
    deleteAudioById: (id) => {
        if ("serviceWorker" in navigator && id) navigator.serviceWorker.controller?.postMessage({
            action: "deleteFromCache",
            url: id,
            cacheName: "local-audio-cache"
        });
        const newActiveAudioId = get().activeAudioId === id ? "" : get().activeAudioId
        const newAudioList = get().audioList.filter(audio => {
            if (audio._id === id){
                URL.revokeObjectURL(audio.src)
                return false
            }
            return true
        })
        set(() => ({ audioList: newAudioList, activeAudioId: newActiveAudioId }))
    }
}), {
    name: "workSpaceLocalStore",
    partialize: (state) => ({ activeVideoId: state.activeVideoId, activeAudioId: state.activeAudioId, activeImageId: state.activeImageId })
}));
