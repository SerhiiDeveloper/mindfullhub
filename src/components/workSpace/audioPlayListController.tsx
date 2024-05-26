import { useEffect, useMemo } from "react";
import { useWorkSpaceAudioStore } from "../../store/workSpaceAudioStore";
import { SvgController } from "../svgController";
import DownloadCloud from "../../assets/svg/download_cloud.svg";
import DeleteSVG from "../../assets/svg/delete.svg";
import { useWorkSpaceStore } from "../../store/workSpaceStore";

export const AudioPlayListController = () => {
  const bgAudioPlayListState = useWorkSpaceAudioStore((state) => state.bgAudioList);
  const isOffline = useWorkSpaceStore((state) => state.isOffline);
  const bgAudioPlayList = useMemo(() => {
    if (isOffline) return bgAudioPlayListState.map((group) => {
      const audioPlayList = group.audioPlayList.filter((audioPlayList) => audioPlayList.isCached === true);
      if (audioPlayList.length === 0) return;
      return { ...group, audioPlayList };
    });
    return bgAudioPlayListState;
  }, [isOffline, bgAudioPlayListState]);
  const activeAudioGroupId = useWorkSpaceAudioStore(
    (state) => state.activeAudioGroupId
  );
  const setActiveAudioGroupId = useWorkSpaceAudioStore(
    (state) => state.setActiveAudioGroupId
  );
  const getAudioListFromApi = useWorkSpaceAudioStore(
    (state) => state.getAudioListFromApi
  );
  const setActiveAudioId = useWorkSpaceAudioStore(
    (state) => state.setActiveAudioId
  );
  const activeAudioId = useWorkSpaceAudioStore((state) => state.activeAudioId);
  // const updateAudioCachedById = useWorkSpaceAudioStore(state => state.updateAudioCachedById)
  const deleteFromCacheById = useWorkSpaceAudioStore(state => state.deleteFromCacheById)

  useEffect(() => {
    if (!bgAudioPlayList || bgAudioPlayList.length === 0) getAudioListFromApi();
  }, []);

  const handleGroupClick = (id: string) => () => {
    if (id === activeAudioGroupId) return;
    setActiveAudioGroupId(id);
  };

  const handleAudioClick = (id: string) => () => {
    setActiveAudioId(id);
  };

  const handleAudioCacheClick =
  (id: string, src: string, cached: boolean | undefined) => (event: MouseEvent) => {
    if (cached) {
      event.stopPropagation()
      return deleteFromCacheById(id);
    }
  };

  return bgAudioPlayList.map((audioGroup) => {
    if (!audioGroup) return;
    return (
      <li
        key={audioGroup._id}
        className={
          "p-4 border-2 " +
          (activeAudioGroupId === audioGroup._id
            ? "border-gray-500"
            : "border-white")
        }
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={handleGroupClick(audioGroup._id)}
        >
          <img
            src={audioGroup.icon}
            alt={audioGroup.title}
            className="w-8 h-8"
          />
          <p className="text-sm ml-2">{audioGroup.title}</p>
        </div>
        <ul
          className={
            "transition-transform duration-500 ease-in-out flex flex-col gap-1 " +
            (activeAudioGroupId === audioGroup._id
              ? "scale-y-100 h-auto"
              : "scale-y-0 h-0")
          }
        >
          {audioGroup.audioPlayList.map((audio) => (
            <li
              key={audio._id}
              className={
                "flex flex-row justify-between items-center p-2 border-2 hover:bg-gray-100 cursor-pointer " +
                (activeAudioId === audio._id
                  ? "border-gray-500 "
                  : "border-white ") +
                (audio.isCached === true ? "bg-green-100 " : "bg-white ")
              }
              onClick={handleAudioClick(audio._id)}
            >
              <p>{audio.title}</p>
              <SvgController
                src={audio.isCached === true ? DeleteSVG : DownloadCloud}
                alt={
                  audio.isCached === true
                    ? "Видалити з кешу"
                    : "Завантажити в кеш"
                }
                onClick={handleAudioCacheClick(
                  audio._id,
                  audio.src,
                  audio.isCached
                )}
              />
            </li>
          ))}
        </ul>
      </li>
    );
  });
};
