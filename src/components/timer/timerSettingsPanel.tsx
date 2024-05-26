import { useState, ChangeEvent, FC } from "react";
import { Button } from "../button";
import { NumberInput } from "./numberInput";
import { TimerSettingsType, TimerType } from "./timerTypes";
import SoundSVG from "../../assets/svg/sound.svg";
import NoSoundSVG from "../../assets/svg/no_sound.svg";
import { SvgController } from "../svgController";
import { useTimerStore } from "../../store/timerState";

type TimerSettingsPanelPropsType = {
  setIsTimerSettingsOpen: (bool: boolean) => void;
};

export const TimerSettingsPanel: FC<TimerSettingsPanelPropsType> = ({
  setIsTimerSettingsOpen,
}) => { 
  const timerSettings = useTimerStore((state) => state.timerSettings);
  const isSound = useTimerStore((state) => state.isSound);
  const volume = useTimerStore((state) => state.volume);
  const setTimerSettings = useTimerStore((state) => state.setTimerSettings);
  const setIsSound = useTimerStore((state) => state.setIsSound);
  const setVolume = useTimerStore((state) => state.setVolume);

  const [isSettingsChanged, setIsSettingsChanged] = useState(false);
  const [localTimerSettings, setLocalTimerSettings] =
    useState<TimerSettingsType>(timerSettings);

  const handleTimerSettingInputChange = (
    timerType: TimerType,
    value: number
  ) => {
    setLocalTimerSettings((state) => ({ ...state, [timerType]: value * 60 }));
    if (!isSettingsChanged) {
      setIsSettingsChanged(true);
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(event.target.valueAsNumber);
  };

  const handleTimerSettingSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTimerSettings(localTimerSettings);
    setIsSettingsChanged(false);
    setIsTimerSettingsOpen(false);
  };

  return (
    <div className="p-4 px-6">
      <form onSubmit={handleTimerSettingSubmit}>
        <NumberInput
          value={localTimerSettings.work / 60}
          id={TimerType.WORK}
          onHandleChange={handleTimerSettingInputChange}
        >
          Час роботи
        </NumberInput>
        <NumberInput
          value={localTimerSettings.shortBreak / 60}
          id={TimerType.SHORT_BREAK}
          onHandleChange={handleTimerSettingInputChange}
        >
          Коротка перерва
        </NumberInput>
        <NumberInput
          value={localTimerSettings.longBreak / 60}
          id={TimerType.LONG_BREAK}
          onHandleChange={handleTimerSettingInputChange}
        >
          Довга перерва
        </NumberInput>
        <div className="flex gap-2">
          <SvgController
            src={isSound ? SoundSVG : NoSoundSVG}
            alt="Налаштування звуку"
            onClick={setIsSound}
          />
          <input
            className="w-40 border-gray-600 bg-gray-600 text-gray-600"
            type="range"
            min="0"
            max="100"
            value={isSound ? volume : 0}
            onChange={handleVolumeChange}
          />
        </div>
        {isSettingsChanged && (
          <div className="w-full flex justify-center p-2">
            <Button type="submit">Зберегти</Button>
          </div>
        )}
      </form>
    </div>
  );
};
