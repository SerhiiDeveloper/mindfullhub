import { useState } from "react";
import { useTimerStore } from "../../store/timerState";
import { WidgetControlPanel } from "../widgetDnD/widgetControlPanel";
import { WidgetDraggableHOC } from "../widgetDnD/widgetDraggableHOC";
import { TimerCounter } from "./timerCounter";
import { ActiveTimerController } from "./activeTimerController";
import { TimerSettingsPanel } from "./timerSettingsPanel";
import { WidgetTypeEnum } from "../../store/activeWidgetStore";

export const Timer = () => {
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);

  const setIsTimerShow = useTimerStore((state) => state.setIsTimerShow);
  const isTimerShow = useTimerStore((state) => state.isTimerShow);

  const handleTimerSettingsClick = () => {
    setIsTimerSettingsOpen(
      (prevIsTimerSettingsOpen) => !prevIsTimerSettingsOpen
    );
  };

  return (
    <WidgetDraggableHOC
      widgetType={WidgetTypeEnum.TIMER}
      className={!isTimerShow ? "hidden" : ""}
    >
      <div className={"w-80 rounded-md bg-white shadow"}>
        <WidgetControlPanel
          header="Таймер"
          handleClick={setIsTimerShow}
          widgetType={WidgetTypeEnum.TIMER}
        />
        <TimerCounter />

        <ActiveTimerController
          handleTimerSettingsClick={handleTimerSettingsClick}
        />

        {isTimerSettingsOpen && (
          <TimerSettingsPanel setIsTimerSettingsOpen={setIsTimerSettingsOpen} />
        )}
      </div>
    </WidgetDraggableHOC>
  );
};
