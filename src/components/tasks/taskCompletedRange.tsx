import { Popover } from "../popover";
import { SvgController } from "../svgController";
import DotsSvg from "../../assets/svg/dots.svg";
import { TaskType, useTasksStore } from "../../store/tasksStore";
import { useMemo } from "react";

export const TaskCompletedRange = () => {
  const deleteAllCompleted = useTasksStore((state) => state.deleteAllCompleted);
  const deleteAllTasks = useTasksStore((state) => state.deleteAllTasks);
  const tasksList = useTasksStore((state) => state.tasksList);

  const allCompletedCount = useMemo(
    () =>
      tasksList.reduce((count, task) => (task.checked ? count + 1 : count), 0),
    [tasksList]
  );
  const getAllTasksCount = useMemo(() => tasksList.length, [tasksList.length]);

  return (
    <div className="flex gap-2 justify-between items-center p-4">
      <Popover>
        <Popover.Button>
          <SvgController src={DotsSvg} alt="Керування завданнями" />
        </Popover.Button>
        <Popover.List className="left-0 bottom-0 w-max">
          <Popover.Item onClick={deleteAllTasks}>Видалити всі</Popover.Item>
          <Popover.Item onClick={deleteAllCompleted}>
            Видалити всі завершені
          </Popover.Item>
        </Popover.List>
      </Popover>
      <input
        className="w-40 border-gray-600 bg-gray-600 text-gray-600"
        type="range"
        min="0"
        max={getAllTasksCount}
        value={allCompletedCount}
        onChange={() => {}}
      />
      <div>
        <span>{allCompletedCount}</span>/<span>{getAllTasksCount}</span>
      </div>
    </div>
  );
};
