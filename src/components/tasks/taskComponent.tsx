import { SvgController } from "../svgController";
import { Checkbox } from "./customCheckbox";
import DotsSvg from "../../assets/svg/dots.svg";
import { FC } from "react";
import { useTasksStore } from "../../store/tasksStore";
import { TaskTextInput } from "./taskTextInput";
import { Popover } from "../popover";

type TaskComponentPropsType = {
  text: string;
  id: string;
  checked: boolean;
};

export const TaskComponent: FC<TaskComponentPropsType> = ({
  text,
  id,
  checked,
}) => {
  const checkTask = useTasksStore((state) => state.checkTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const repeatTask = useTasksStore((state) => state.repeatTask);

  const handleCheck: () => void = () => {
    checkTask(id);
  };

  const handleDeleteTask: () => void = () => {
    deleteTask(id);
  };

  const handleRepeatTask: () => void = () => {
    repeatTask(id);
  };

  return (
    <li
      className="flex flex-row justify-center items-center gap-2 p-2 group border-2 border-white hover:border-gray-300"
    >
      <Checkbox isChecked={checked} onCheck={handleCheck} />
      <TaskTextInput text={text} checked={checked} id={id} />
      <Popover>
        <Popover.Button>
          <SvgController
            className="opacity-0 group-hover:opacity-100"
            src={DotsSvg}
            alt="Керування завданням"
          />
        </Popover.Button>
        <Popover.List className="right-0 top-0 ">
          <Popover.Item onClick={handleRepeatTask}>Дублювати</Popover.Item>
          <Popover.Item onClick={handleDeleteTask}>Видалити</Popover.Item>
        </Popover.List>
      </Popover>
    </li>
  );
};
