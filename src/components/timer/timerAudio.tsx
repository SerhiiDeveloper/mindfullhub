import { FC, useRef, useEffect } from "react";
import AudioURL from "../../assets/audio/timer.mp3";

type TimerTypeProps = {
    isPlay: boolean;
    isSound: boolean;
    volume: number;
}

export const TimerSound: FC<TimerTypeProps> = ({isPlay, isSound, volume}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && isPlay && isSound) {
        audioRef.current.play();
    }
  }, [isPlay])

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume / 100;
    }
  }, [volume])

  return (
    <div style={{ display: "none" }}>
      <audio ref={audioRef}>
        <source src={AudioURL} type="audio/mp3" />
        {/* Add additional <source> elements for other audio formats if needed */}
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};
