import { SizeType, SvgController } from "../svgController";
import TimerIcon from "../../assets/svg/timer_icon.svg";
import LogoIcon from "../../assets/svg/relax.svg";
import TasksIcon from "../../assets/svg/tasks.svg";
import WorkSpace from "../../assets/svg/work_space.svg";
import BreathIcon from "../../assets/svg/breath.svg";
import MenuSVG from "../../assets/svg/menu.svg";
import MinusSVG from "../../assets/svg/minus.svg";
import { useTimerStore } from "../../store/timerState";
import { useTasksStore } from "../../store/tasksStore";
import {
  WidgetTypeEnum,
  useActiveWidgetStore,
} from "../../store/activeWidgetStore";
import { useBreathWidgetStore } from "../../store/breathWidgetStore";
import { Tooltip } from "../tooltip/tooltip";
import { useWorkSpaceStore } from "../../store/workSpaceStore";
import { useState } from "react";

type WidgetStateType = {
  isOpen: boolean;
  setIsOpen: () => void;
  type: WidgetTypeEnum;
};

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setActiveWidget = useActiveWidgetStore(
    (state) => state.setActiveWidget
  );
  const timerState: WidgetStateType = useTimerStore((state) => ({
    isOpen: state.isTimerShow,
    setIsOpen: state.setIsTimerShow,
    type: WidgetTypeEnum.TIMER,
  }));
  const taskState: WidgetStateType = useTasksStore((state) => ({
    isOpen: state.isTasksShow,
    setIsOpen: state.setIsTasksShow,
    type: WidgetTypeEnum.TASKS,
  }));
  const workSpaceState = useWorkSpaceStore((state) => ({
    isOpen: state.isWidgetShow,
    setIsOpen: state.setIsWidgetShow,
    type: WidgetTypeEnum.WORK_SPACE,
  }));
  const breathState = useBreathWidgetStore((state) => ({
    isOpen: state.isWidgetShow,
    setIsOpen: state.setIsWidgetShow,
    type: WidgetTypeEnum.BREATH,
  }));

  const handleTabClick = (widget: WidgetStateType) => () => {
    setActiveWidget(widget.type);
    if (window.innerWidth < 768) {
      setIsOpen(false);
      [timerState, taskState, workSpaceState, breathState].forEach((item) => {
        if (item.type !== widget.type && item.isOpen) {
          item.setIsOpen();
        }
      });
    }
    widget.setIsOpen();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="md:hidden absolute left-1 top-1 bg-white z-50 rounded-full">
        <SvgController
          src={isOpen ? MinusSVG : MenuSVG}
          alt="Меню"
          size={SizeType.LG}
          onClick={toggleMenu}
          className="border-none"
        />
      </div>
      <div
        className={
          "absolute left-0 right-0 pt-14 md:relative md:pt-0 h-screen w-full md:w-16 bg-white border-r-2 border-r-gray-600 text-white z-40 md:flex flex-col items-center " +
          (isOpen ? "block" : "hidden")
        }
      >
        <nav className="gap-3 flex flex-col items-center">
          <div
            className="py-5 mb-5 flex items-center gap-2 w-48 md:w-auto"
            onClick={toggleMenu}
          >
            <SvgController
              src={LogoIcon}
              alt="Mindfull Hub логотип"
              size={SizeType.LG}
            />
            <span className="text-gray-600 text-sm md:hidden">
              Mindfull Hub
            </span>
          </div>

          <div
            className="flex items-center gap-3 w-48 md:w-auto"
            onClick={handleTabClick(workSpaceState)}
          >
            <Tooltip text="Робоче місце">
              <SvgController
                src={WorkSpace}
                alt="Робоче місце"
                size={SizeType.MD}
                active={workSpaceState.isOpen}
              />
            </Tooltip>
            <span className="text-gray-600 text-sm md:hidden">
              Робоче місце
            </span>
          </div>

          <div
            className="flex items-center gap-3 w-48 md:w-auto"
            onClick={handleTabClick(timerState)}
          >
            <Tooltip text="Вікно таймера">
              <SvgController
                src={TimerIcon}
                alt="Вікно таймера"
                size={SizeType.MD}
                active={timerState.isOpen}
              />
            </Tooltip>
            <span className="text-gray-600 text-sm md:hidden">Таймер</span>
          </div>

          <div
            className="flex items-center gap-3 w-48 md:w-auto"
            onClick={handleTabClick(taskState)}
          >
            <Tooltip text="Менеджер завдань">
              <SvgController
                src={TasksIcon}
                alt="Менеджер завдань"
                size={SizeType.MD}
                active={taskState.isOpen}
              />
            </Tooltip>
            <span className="text-gray-600 text-sm md:hidden">
              Менеджер завдань
            </span>
          </div>

          <div
            className="flex items-center gap-3 w-48 md:w-auto"
            onClick={handleTabClick(breathState)}
          >
            <Tooltip text="Дихальні вправи">
              <SvgController
                src={BreathIcon}
                alt="Дихальні вправи"
                size={SizeType.MD}
                active={breathState.isOpen}
              />
            </Tooltip>
            <span className="text-gray-600 text-sm md:hidden">
              Дихальні вправи
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
};
