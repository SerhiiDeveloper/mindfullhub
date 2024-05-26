import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IWorkSpaceStore {
    isWidgetShow: boolean;
    setIsWidgetShow: () => void
    isLocal: boolean
    setIsLocal: (isLocal: boolean) => void
    isOffline: boolean
    setIsOffline: (isOffline: boolean) => void
}

export const useWorkSpaceStore = create<IWorkSpaceStore>()(persist((set) => ({
    isWidgetShow: true,
    setIsWidgetShow: () => set((state) => ({ isWidgetShow: !state.isWidgetShow })),
    isLocal: false,
    setIsLocal: (isLocal) => set(() => ({ isLocal })),
    isOffline: false,
    setIsOffline: (isOffline) => {
        console.log("is Offline in store: ", isOffline)
        set(() => ({ isOffline }))
    }
}), { name: "workSpace" }))