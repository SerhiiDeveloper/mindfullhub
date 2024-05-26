import { FC, useMemo } from "react";
import { BGVideoDataType } from "../../store/workSpaceVideoStore";
import { useVideoController } from "./useVideoController";
import DefaultPoster from "../../assets/default_poster.webp";

type BG_VideoPropsType = {
  videoData: BGVideoDataType
}

export const BG_Video: FC<BG_VideoPropsType> = ({videoData}) => {
  const memoVideoData = useMemo(() => videoData, [videoData._id, videoData.poster]);
  const { videoRef, handleVideoLoaded } = useVideoController(memoVideoData);

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
