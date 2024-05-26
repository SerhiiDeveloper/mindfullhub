import { SvgController } from "../svgController";
import SoundSVG from "../../assets/svg/sound.svg";
import NoSoundSVG from "../../assets/svg/no_sound.svg";
import HeadRightSVG from "../../assets/svg/head_right.svg";
import HeadLeftSVG from "../../assets/svg/head_left.svg";
import LoopSVG from "../../assets/svg/loop.svg";
import { AudioType, useAudioController } from "./useAudioController";
import { useWorkSpaceAudioStore } from "../../store/workSpaceAudioStore";
import { useMemo } from "react";

export const AudioController = () => {
  const audioPlayList = useWorkSpaceAudioStore((state) => state.bgAudioList);
  const activeAudioId = useWorkSpaceAudioStore((state) => state.activeAudioId);
  const activeAudioGroupId = useWorkSpaceAudioStore(
    (state) => state.activeAudioGroupId
  );
  const setActiveAudioId = useWorkSpaceAudioStore(
    (state) => state.setActiveAudioId
  );
  const memoAudioGroup = useMemo(
    () =>
      audioPlayList.find((item) => item._id === activeAudioGroupId) || {
        audioPlayList: [],
        _id: "",
        icon: "",
        title: "",
      },
    [activeAudioGroupId, audioPlayList.length]
  );
  const updateAudioCachedById = useWorkSpaceAudioStore(
    (state) => state.updateAudioCachedById
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
  } = useAudioController(
    memoAudioGroup.audioPlayList,
    activeAudioId,
    setActiveAudioId
  );

  const handleOnLoaded = (track: AudioType) => () => {
    // updateAudioCachedById(track._id, track.src);
  };

  if (!currentTrack) return;
  return (
    <div className="p-4 px-6">
      <audio
        onEnded={handleAudioEnded}
        ref={audioRef}
        loop={isLoop}
        onLoadedData={handleOnLoaded(currentTrack)}
      >
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
