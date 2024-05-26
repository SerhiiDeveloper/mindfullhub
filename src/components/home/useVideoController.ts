import { useEffect, useRef } from "react";
import { BGVideoDataType, UpdateCachedType } from "../../store/workSpaceVideoStore";

export const useVideoController = (videoData: BGVideoDataType, updateVideoCached: UpdateCachedType) => {
    const isMounted = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const handleUserInteraction = useRef<() => void>(null!);

    useEffect(() => {
        handleUserInteraction.current = () => {
            if (!videoRef.current) return;
            videoRef.current.play().catch((error) => console.error(error));
            document.removeEventListener("click", handleUserInteraction.current);
        };

        return () => {
            document.removeEventListener("click", handleUserInteraction.current);
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;
        if (!isMounted.current) {
            videoRef.current.load();
            document.addEventListener("click", handleUserInteraction.current);
            isMounted.current = true;
            return;
        }
        videoRef.current.src = videoData.src;
        videoRef.current.load();
        setTimeout(() => videoRef.current?.play().catch((error) => console.error(error)), 1500);
    }, [videoData])

    const handleVideoLoaded = () => {
        console.log("Video loaded")
        // updateVideoCached(videoData._id, videoData.src);
        if (isMounted.current) return;
        document.addEventListener("click", handleUserInteraction.current);
        isMounted.current = true;
    };

    return {
        videoRef,
        handleVideoLoaded
    }
}