import { useMemo } from "react";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";
import { useWorkSpaceVideoStore } from "../../store/workSpaceVideoStore";
import { BG_Video } from "./bg_video";
import { useWorkSpaceStore } from "../../store/workSpaceStore";

const defaultVideoObject = { src: "", _id: "", poster: "", title: "" }

const BG_VideoWrapper = () => {
    const bgVideoList = useWorkSpaceVideoStore((state) => state.bgVideoList);
    const activeVideoGroupId = useWorkSpaceVideoStore(state => state.activeVideoGroupId)
    const activeVideoId = useWorkSpaceVideoStore(state => state.activeVideoId)
    const isLocal = useWorkSpaceStore(state => state.isLocal)
    const localVideoDataList = useWorkSpaceLocalStore(state => state.videoList)
    const localActiveVideoId = useWorkSpaceLocalStore(state => state.activeVideoId)

    const videoData = useMemo(
        () => {
            const activeGroup = bgVideoList.find(group => group._id === activeVideoGroupId)
            if (activeGroup) {
                const activeVideo = activeGroup.video.find(video => video._id === activeVideoId) || defaultVideoObject
                return { ...activeVideo, poster: activeGroup.poster }
            }
            return defaultVideoObject
        }, [activeVideoGroupId, activeVideoId, bgVideoList.length]
    )
    const localVideoData = useMemo(() => localVideoDataList.find(video => video._id === localActiveVideoId) || defaultVideoObject, [localActiveVideoId])

    if (isLocal) return (
        <BG_Video videoData={localVideoData} />
    )
    return (
        <BG_Video videoData={videoData} />
    )
}

export default BG_VideoWrapper