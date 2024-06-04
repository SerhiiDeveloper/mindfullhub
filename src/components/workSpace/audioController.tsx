import { SvgController } from "../svgController";
import SoundSVG from "../../assets/svg/sound.svg";
import NoSoundSVG from "../../assets/svg/no_sound.svg";
import HeadRightSVG from "../../assets/svg/head_right.svg";
import HeadLeftSVG from "../../assets/svg/head_left.svg";
import LoopSVG from "../../assets/svg/loop.svg";
import { useAudioController } from "./useAudioController";
import { BGAudioType, useWorkSpaceAudioStore } from "../../store/workSpaceAudioStore";
import { FC, useCallback, useMemo } from "react";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";

type AudioControllerPropsType = {
  isLocal: boolean;
};

export const AudioController: FC<AudioControllerPropsType> = ({ isLocal }) => {
  const audioPlayList = useWorkSpaceAudioStore((state) => state.bgAudioList);
  const localAudioPlayList = useWorkSpaceLocalStore((state) => state.audioList);
  const activeAudioId = useWorkSpaceAudioStore((state) => state.activeAudioId);
  const localActiveAudioId = useWorkSpaceLocalStore(
    (state) => state.activeAudioId
  );
  const activeAudioGroupId = useWorkSpaceAudioStore(
    (state) => state.activeAudioGroupId
  );
  const setActiveAudioId = useWorkSpaceAudioStore(
    (state) => state.setActiveAudioId
  );
  const setLocalActiveAudioId = useWorkSpaceLocalStore(
    (state) => state.setActiveAudioId
  );
  const deleteFromAPICache = useWorkSpaceAudioStore(state => state.deleteFromCacheById)
  const deleteFromLocalCache = useWorkSpaceLocalStore(state => state.deleteAudioById)

  const setActiveId = useCallback(
    isLocal ? setLocalActiveAudioId : setActiveAudioId,
    [isLocal]
  );
  const deleteFromCacheById = useCallback(
    isLocal ? deleteFromLocalCache : deleteFromAPICache,
    [isLocal]
  );
  const memoAudioGroup = useMemo<BGAudioType[]>(
    () =>
      isLocal
        ? localAudioPlayList
        : audioPlayList.find((item) => item._id === activeAudioGroupId)
            ?.audioPlayList || [],
    [
      activeAudioGroupId,
      audioPlayList.length,
      isLocal,
      localAudioPlayList.length,
      localActiveAudioId,
    ]
  );
  const {
    currentTrack,
    volume,
    isSound,
    audioRef,
    playNextTrack,
    playPreviousTrack,
    handleIsSoundChange,
    handleVolumeChange,
    handleAudioEnded,
    handleIsLoopChange,
    isLoop,
  } = useAudioController(memoAudioGroup, isLocal ? localActiveAudioId : activeAudioId, setActiveId, deleteFromCacheById);

  if (!currentTrack) return;
  return (
    <div className="p-4 px-6">
      <audio onEnded={handleAudioEnded} ref={audioRef} loop={isLoop}>
        <source src={currentTrack.src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex gap-2 justify-start items-center mb-2">
        <SvgController
          src={isSound ? SoundSVG : NoSoundSVG}
          alt="Налаштування звуку"
          onClick={handleIsSoundChange}
        />
        <input
          className="w-40 border-gray-600 bg-gray-600 text-gray-600"
          type="range"
          min="0"
          max="100"
          value={isSound ? volume : 0}
          onChange={handleVolumeChange}
        />
        <SvgController
          src={LoopSVG}
          alt="Повторювати трек"
          onClick={handleIsLoopChange}
          active={isLoop}
        />
      </div>
      <div className="flex gap-2 justify-between items-center">
        <SvgController
          src={HeadLeftSVG}
          alt="Попередній трек"
          onClick={playPreviousTrack}
        />
        <span>{currentTrack.title}</span>
        <SvgController
          src={HeadRightSVG}
          alt="Наступний трек"
          onClick={playNextTrack}
        />
      </div>
    </div>
  );
};
