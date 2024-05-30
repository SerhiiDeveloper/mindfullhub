import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BaseURL = "http://13.50.235.0/api/"

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
        set(() => ({ isOffline }))
    }
}), { name: "workSpace" }))