import { FC, useMemo } from "react";
import { BGVideoDataType, useWorkSpaceVideoStore } from "../../store/workSpaceVideoStore";
import { useVideoController } from "./useVideoController";
import DefaultPoster from "../../assets/default_poster.webp";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";

type BG_VideoPropsType = {
  videoData: BGVideoDataType
  isLocal: boolean
}

export const BG_Video: FC<BG_VideoPropsType> = ({videoData, isLocal}) => {
  const deleteFromCacheById = useWorkSpaceVideoStore(state => state.deleteFromCacheById)
  const deleteFromLocalCache = useWorkSpaceLocalStore(state => state.deleteVideoById)
  const memoVideoData = useMemo(() => videoData, [videoData._id, videoData.poster]);
  const { videoRef, handleVideoLoaded } = useVideoController(memoVideoData, isLocal ? deleteFromLocalCache : deleteFromCacheById);

  return (
    <div className="flex items-center justify-center h-full w-full z-0 absolute">
      <video
        ref={videoRef}
        onLoadedData={handleVideoLoaded}
        loop
        muted
        id={memoVideoData._id}
        className="h-full w-full object-cover"
        poster={memoVideoData.poster || DefaultPoster}
      >
        <source src={memoVideoData.src} type="video/mp4"/>
      </video>
    </div>
  );
};
