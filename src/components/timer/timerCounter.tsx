import { Button } from "../button";
import { SvgController } from "../svgController";
import { formatTime } from "./helper";
import { TimerSound } from "./timerAudio";
import RepeatSVG from "../../assets/svg/repeat.svg";
import { useEffect, useState } from "react";
import { TimerType } from "./timerTypes";
import { useTimerStore } from "../../store/timerState";

export const TimerCounter = () => {
  const timerSettings = useTimerStore((state) => state.timerSettings);
  const activeTimer = useTimerStore((state) => state.activeTimer);
  const setActiveTimer = useTimerStore((state) => state.setActiveTimer);
  const isRunning = useTimerStore((state) => state.isRunning);
  const setIsRunning = useTimerStore((state) => state.setIsRunning);
  const isSound = useTimerStore((state) => state.isSound);
  const volume = useTimerStore((state) => state.volume);

  const [seconds, setSeconds] = useState(timerSettings[TimerType.WORK]);
  const [isPlaySound, setIsPlaySound] = useState(false);

  useEffect(() => {
    setSeconds(timerSettings[activeTimer]);
  }, [activeTimer, timerSettings]);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    if (seconds === 3) {
      setIsPlaySound(true);
    }
    if (seconds !== 0) {
      return;
    }
    if (activeTimer === TimerType.WORK) {
      setActiveTimer(TimerType.SHORT_BREAK);
      setSeconds(timerSettings.shortBreak);
    } else if (activeTimer === TimerType.SHORT_BREAK) {
      setActiveTimer(TimerType.WORK);
      setSeconds(timerSettings.work);
    } else if (activeTimer === TimerType.LONG_BREAK) {
      setActiveTimer(TimerType.WORK);
      setSeconds(timerSettings.work);
    }
    setIsRunning(true);
    setIsPlaySound(false);
  }, [seconds, isRunning]);

  const handleStartPauseClick = () => {
    setIsRunning(!isRunning);
    setIsPlaySound(false);
  };
  const handleResetClick = () => {
    setSeconds(timerSettings[activeTimer]);
    setIsRunning(false);
    setIsPlaySound(false);
  };

  return (
    <div className="p-4 px-6 flex flex-row justify-between items-center">
      <TimerSound isPlay={isPlaySound} isSound={isSound} volume={volume} />
      <p className="text-3xl">{formatTime(seconds)}</p>
      <div className="flex flex-row items-center gap-5">
        <Button onClick={handleStartPauseClick}>
          {isRunning ? "Пауза" : "Розпочати"}
        </Button>
        <SvgController
          src={RepeatSVG}
          alt="Повторити"
          onClick={handleResetClick}
        />
      </div>
    </div>
  );
};
