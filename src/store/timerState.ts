import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimerSettingsType, TimerType } from "../components/timer/timerTypes";

interface ITimerStore {
    isTimerShow: boolean;
    setIsTimerShow: () => void
    timerSettings: TimerSettingsType,
    setTimerSettings: (settings: TimerSettingsType) => void
    isRunning: boolean
    setIsRunning: (bool: boolean) => void
    activeTimer: TimerType
    setActiveTimer: (timer: TimerType) => void
    isSound: boolean
    setIsSound: () => void
    volume: number
    setVolume: (volume: number) => void
}

export const useTimerStore = create<ITimerStore>()(persist((set, get) => ({
    isTimerShow: false,
    setIsTimerShow: () => set((state) => ({ isTimerShow: !state.isTimerShow })),
    timerSettings: {
        work: 1200,
        shortBreak: 300,
        longBreak: 900,
    },
    setTimerSettings: (settings) => set(() => ({ timerSettings: settings })),
    isRunning: false,
    setIsRunning: (bool) => set(() => ({ isRunning: bool })),
    activeTimer: TimerType.WORK,
    setActiveTimer: (timer) => {
        if (timer !== get().activeTimer) {
            set(() => ({ activeTimer: timer, isRunning: false }))
        }
    },
    isSound: true,
    setIsSound: () => set(state => ({ isSound: !state.isSound })),
    volume: 80,
    setVolume: (volume) => set(() => ({ volume }))
}), { name: "timer" }));
