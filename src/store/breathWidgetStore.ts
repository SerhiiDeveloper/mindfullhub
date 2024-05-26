import { create } from "zustand";

interface IBreathWidgetStore {
    isWidgetShow: boolean;
    setIsWidgetShow: () => void
}

export const useBreathWidgetStore = create<IBreathWidgetStore>()((set) => ({
    isWidgetShow: false,
    setIsWidgetShow: () => set((state) => ({ isWidgetShow: !state.isWidgetShow })),
}))