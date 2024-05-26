import { useEffect, useRef } from "react";

type CallbackType = (event: MouseEvent | TouchEvent) => void

export const useClickOutside = (callback: CallbackType) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            callback(event)
        }
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        }
    }, [callback])

    return ref
}