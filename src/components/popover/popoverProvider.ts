import { createContext, useContext } from "react";

interface IPopoverProviderProps {
    isOpen: boolean
    setOpen: () => void
    setClose: () => void
}

export const PopoverContext = createContext<IPopoverProviderProps>(null!)

export const usePopoverContext = () => {
    const props = useContext(PopoverContext)
    if (!props) throw new Error("no context found")
    return props
}