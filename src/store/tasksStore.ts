import { create } from "zustand";
import { persist } from 'zustand/middleware'

export type TaskType = {
    checked: boolean
    text: string
    id: string
    position?: number
}

interface ITasksStore {
    isTasksShow: boolean;
    setIsTasksShow: () => void
    tasksList: Array<TaskType>
    checkTask: (id: string) => void
    updateTask: (id: string, text: string) => void
    deleteTask: (id: string) => void
    repeatTask: (id: string) => void
    addTask: () => void
    deleteAllCompleted: () => void
    deleteAllTasks: () => void
    filterByChecked: null | boolean,
    setFilterByChecked: (value: null | boolean) => void
}

export const useTasksStore = create<ITasksStore>()(persist((set, get) => ({
    isTasksShow: false,
    setIsTasksShow: () => set((state) => ({ isTasksShow: !state.isTasksShow })),
    tasksList: [],
    checkTask: (id) => set(state => ({ tasksList: state.tasksList.map(task => task.id === id ? { ...task, checked: !task.checked } : task) })),
    updateTask: (id, text) => set((state) => ({
        tasksList: state.tasksList.map(task => {
            if (task.id === id) {
                return { ...task, text }
            }
            return task
        })
    }
    )),
    deleteTask: (id) => set(state => ({ tasksList: state.tasksList.filter(task => task.id !== id) })),
    repeatTask: (id) => set(state => ({ tasksList: [{ checked: false, text: state.tasksList.find(task => task.id === id)!.text, id: Math.random().toString(16).slice(2) }, ...state.tasksList] })),
    addTask: () => set(state => ({ tasksList: [{ checked: false, text: "", id: Math.random().toString(16).slice(2) }, ...state.tasksList] })),
    deleteAllCompleted: () => set(state => ({ tasksList: state.tasksList.filter(task => !task.checked) })),
    deleteAllTasks: () => set(() => ({ tasksList: [] })),
    filterByChecked: null,
    setFilterByChecked: (value) => set(() => ({ filterByChecked: value })),
}), { name: "tasksList" }));
