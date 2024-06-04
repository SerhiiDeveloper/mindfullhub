import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum WidgetTypeEnum {
    TIMER = "Timer",
    TASKS = "Tasks",
    WORK_SPACE = "WorkSpace",
    BREATH = "Breath"
}

type WidgetsType = {
    [key in WidgetTypeEnum]: {
        x: number,
        y: number,
    }
}

const desktopInitialWidgetPosition = {
    [WidgetTypeEnum.TIMER]: {
        x: 320,
        y: 0,
    },
    [WidgetTypeEnum.TASKS]: {
        x: 50,
        y: 100,
    },
    [WidgetTypeEnum.WORK_SPACE]: {
        x: 0,
        y: 0,
    },
    [WidgetTypeEnum.BREATH]: {
        x: 0,
        y: 0,
    },
}

const mobileInitialWidgetPosition = {
    [WidgetTypeEnum.TIMER]: {
        x: 64,
        y: 64,
    },
    [WidgetTypeEnum.TASKS]: {
        x: 64,
        y: 64,
    },
    [WidgetTypeEnum.WORK_SPACE]: {
        x: 64,
        y: 64,
    },
    [WidgetTypeEnum.BREATH]: {
        x: 0,
        y: 0,
    },
}

interface IActiveWidgetStore {
    activeWidget: WidgetTypeEnum
    setActiveWidget: (widget: WidgetTypeEnum) => void
    widgets: WidgetsType
    setWidgetPosition: (x: number, y: number, type: WidgetTypeEnum) => void
}

export const useActiveWidgetStore = create<IActiveWidgetStore>()(persist((set) => ({
    activeWidget: WidgetTypeEnum.TIMER,
    setActiveWidget: (widget) => set(() => ({ activeWidget: widget })),
    widgets: window.matchMedia("(min-width: 768px)").matches ? desktopInitialWidgetPosition : mobileInitialWidgetPosition,
    setWidgetPosition: (x, y, type) => set(state => ({ widgets: { ...state.widgets, [type]: { x, y } } }))
}), { name: "activeWidget" }))