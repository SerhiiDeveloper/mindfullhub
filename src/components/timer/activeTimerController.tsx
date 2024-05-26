import { useTimerStore } from "../../store/timerState";
import { SvgController } from "../svgController";
import { TextButton } from "../textButton";
import { TimerType } from "./timerTypes";
import GearSVG from "../../assets/svg/gear.svg";
import { FC } from "react";

type ActiveTimerControllerPropsType = {
  handleTimerSettingsClick: () => void;
};

export const ActiveTimerController: FC<ActiveTimerControllerPropsType> = ({
  handleTimerSettingsClick,
}) => {
  const activeTimer = useTimerStore((state) => state.activeTimer);
  const setActiveTimer = useTimerStore((state) => state.setActiveTimer);

  const handleTimerTypeChange = (timerType: TimerType) => () => {
    setActiveTimer(timerType);
  };

  return (
    <ul className="p-4 px-6 flex flex-row justify-between items-center">
      <TextButton
        active={activeTimer === TimerType.WORK}
        onClick={handleTimerTypeChange(TimerType.WORK)}
      >
        Робота
      </TextButton>
      <TextButton
        active={activeTimer === TimerType.SHORT_BREAK}
        onClick={handleTimerTypeChange(TimerType.SHORT_BREAK)}
      >
        Коротка
        <br />
        перерва
      </TextButton>
      <TextButton
        active={activeTimer === TimerType.LONG_BREAK}
        onClick={handleTimerTypeChange(TimerType.LONG_BREAK)}
      >
        Довга
        <br />
        перерва
      </TextButton>
      <SvgController
        src={GearSVG}
        alt="Налаштування таймера"
        onClick={handleTimerSettingsClick}
      />
    </ul>
  );
};
