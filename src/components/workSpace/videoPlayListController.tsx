import { useWorkSpaceVideoStore } from "../../store/workSpaceVideoStore";
import { SvgController } from "../svgController";
import HeadRightSVG from "../../assets/svg/head_right.svg";
import DownloadCloud from "../../assets/svg/download_cloud.svg";
import DeleteSVG from "../../assets/svg/delete.svg";
import { useEffect, useMemo } from "react";
import { useWorkSpaceStore } from "../../store/workSpaceStore";

export const VideoPlayListController = () => {
  const bgVideoListState = useWorkSpaceVideoStore((state) => state.bgVideoList);
  const isOffline = useWorkSpaceStore((state) => state.isOffline);
  console.log("isOffline: ", isOffline)
  const bgVideoList = useMemo(() => {
    if (isOffline) return bgVideoListState.map((group) => {
      const video = group.video.filter((video) => video.isCached === true);
      console.log(video)
      if (video.length === 0) return;
      return { ...group, video };
    });
    return bgVideoListState;
  }, [isOffline, bgVideoListState]);

  const activeVideoGroupId = useWorkSpaceVideoStore(
    (state) => state.activeVideoGroupId
  );
  const activeVideoId = useWorkSpaceVideoStore((state) => state.activeVideoId);
  const setActiveVideoGroupId = useWorkSpaceVideoStore(
    (state) => state.setActiveVideoGroupId
  );
  const setNextActiveVideo = useWorkSpaceVideoStore(
    (state) => state.setNextActiveVideo
  );
  const getVideoListFromApi = useWorkSpaceVideoStore(
    (state) => state.getVideoListFromApi
  );
  const deleteFromCacheById = useWorkSpaceVideoStore(
    (state) => state.deleteFromCacheById
  );
  // const updateVideoCached = useWorkSpaceVideoStore(
  //   (state) => state.updateVideoCached
  // );

  useEffect(() => {
    if (!bgVideoList || bgVideoList.length === 0) {
      getVideoListFromApi();
    }
  }, []);

  const handleGroupClick = (id: string) => () => {
    if (id === activeVideoGroupId) return setActiveVideoGroupId("");
    setActiveVideoGroupId(id);
  };

  const handleNextVideoClick = (id: string) => () => {
    if (id !== activeVideoGroupId) {
      setActiveVideoGroupId(id);
    } else {
      setNextActiveVideo();
    }
  };

  const handleVideoClick = (id: string) => () => {
    setNextActiveVideo(activeVideoId === id ? "" : id);
  };

  const handleVideoCacheClick =
    (id: string, src: string, cached: boolean | undefined) => (event: MouseEvent) => {
      if (cached) {
      event.stopPropagation();
      // if (!cached && activeVideoId !== id) {
      //   setNextActiveVideo(id)
        // return updateVideoCached(src, id);
      // }
      return deleteFromCacheById(id);
      }
    };

  return bgVideoList.map((videoGroup) => {
    if (!videoGroup) return;
    return (
      <li
        key={videoGroup._id}
        className={
          "p-4 border-2 " +
          (activeVideoGroupId === videoGroup._id
            ? "border-gray-500"
            : "border-white")
        }
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={handleGroupClick(videoGroup._id)}
        >
          <div className="flex items-center">
            <img
              src={videoGroup.icon}
              alt={videoGroup.title}
              className="w-8 h-8"
            />
            <p className="text-sm ml-2">{videoGroup.title}</p>
          </div>
          <SvgController
            src={HeadRightSVG}
            alt="Наступний відео"
            onClick={handleNextVideoClick(videoGroup._id)}
          />
        </div>
        <ul
          className={
            "transition-transform duration-500 ease-in-out flex flex-col gap-1 " +
            (activeVideoGroupId === videoGroup._id
              ? "scale-y-100 h-auto"
              : "scale-y-0 h-0")
          }
        >
          {videoGroup.video.map((video) => (
            <li
              key={video._id}
              className={
                "flex flex-row justify-between items-center p-2 border-2 cursor-pointer hover:bg-gray-100 " +
                (activeVideoId === video._id
                  ? "border-gray-500 "
                  : "border-white ") +
                (video.isCached === true ? "bg-green-100 " : "bg-white ")
              }
              onClick={handleVideoClick(video._id)}
            >
              <p>{video.title}</p>
              <SvgController
                src={video.isCached === true ? DeleteSVG : DownloadCloud}
                alt={
                  video.isCached === true
                    ? "Видалити з кешу"
                    : "Завантажити в кеш"
                }
                onClick={handleVideoCacheClick(
                  video._id,
                  video.src,
                  video.isCached
                )}
              />
            </li>
          ))}
        </ul>
      </li>
    );
  });
};
