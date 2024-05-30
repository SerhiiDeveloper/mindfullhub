import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BGVideoType } from "./workSpaceVideoStore";
import { BGAudioType } from "./workSpaceAudioStore";

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
    getBGData: () => BGImageType | BGVideoType | undefined
    addVideo: (file: File, title: string) => void
    getVideoListFromCache: () => void
    deleteVideoById: (id: string) => void
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
    getBGData: () => {
        const activeImageId = get().activeImageId
        if (activeImageId) return get().imageList.find(image => image._id === activeImageId)
        return get().videoList.find(video => video._id === get().activeVideoId)
    },
    addVideo: async (file, title) => {
        const video = {
            _id: new Date().toString(),
            src: URL.createObjectURL(file),
            title
        }
        if (caches) {
            const cache = await caches.open("local-video-cache")
            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadedFile = new Blob([e.target!.result!], { type: file.type });
                const headers = new Headers({ "Content-Type": "video/mp4", "_id": video._id, "title": btoa(unescape(encodeURIComponent(video.title))), "src": video.src });
                cache.put(video._id, new Response(uploadedFile, { headers }));
            };
            reader.readAsArrayBuffer(file);
            set(state => ({ videoList: [...state.videoList, video], activeVideoId: video._id }))
        }
    },
    getVideoListFromCache: async () => {
        if (get().videoList.length) return
        const cache = await caches.open("local-video-cache")
        const responses = await cache.matchAll();
        if (responses) {
            const videoList: BGVideoType[] = []
            const videoListBlob = await Promise.all(responses.map(response => {
                videoList.push({
                    src: "",
                    _id: response.headers.get("_id") || "",
                    title: decodeURIComponent(escape(atob(response.headers.get("title") || ""))),
                })
                return response.blob()
            }))
            videoListBlob.forEach((item, index) => {
                videoList[index].src = URL.createObjectURL(item)
            })

            set(() => ({ videoList }))
        }
    },
    deleteVideoById: (id) => {
        if (caches) {
            caches.open("local-video-cache").then(cache => cache.delete(id))
            const newActiveVideoId = get().activeVideoId === id ? "" : get().activeVideoId
            const newVideoList = get().videoList.filter(video => {
                URL.revokeObjectURL(video.src)
                return video._id !== id
            })
            set(() => ({ videoList: newVideoList, activeVideoId: newActiveVideoId }))
        }
    }
}), {
    name: "workSpaceLocalStore",
    partialize: (state => ({ activeVideoId: state.activeVideoId, activeAudioId: state.activeAudioId, activeImageId: state.activeImageId }))
}));
