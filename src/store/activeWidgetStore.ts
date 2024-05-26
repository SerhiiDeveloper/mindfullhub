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

interface IActiveWidgetStore {
    activeWidget: WidgetTypeEnum
    setActiveWidget: (widget: WidgetTypeEnum) => void
    widgets: WidgetsType
    setWidgetPosition: (x: number, y: number, type: WidgetTypeEnum) => void
}

export const useActiveWidgetStore = create<IActiveWidgetStore>()(persist((set) => ({
    activeWidget: WidgetTypeEnum.TIMER,
    setActiveWidget: (widget) => set(() => ({ activeWidget: widget })),
    widgets: {
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
    },
    setWidgetPosition: (x, y, type) => set(state => ({ widgets: { ...state.widgets, [type]: { x, y } } }))
}), { name: "activeWidget" }))