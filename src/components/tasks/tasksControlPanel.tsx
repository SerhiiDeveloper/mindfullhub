import { useTasksStore } from "../../store/tasksStore";
import { Button } from "../button";
import { Popover } from "../popover";
import { TextButton } from "../textButton";

export const TasksControlPanel = () => {
  const addNewTask = useTasksStore((state) => state.addTask);
  const filter = useTasksStore((state) => state.filterByChecked);
  const setFilter = useTasksStore((state) => state.setFilterByChecked);
  const handleFilterClick = (value: boolean) => () => {
    setFilter(filter === value ? null : value);
  };
  return (
    <div className="p-4 px-6 flex flex-row justify-between items-center gap-3">
      <Popover>
        <Popover.Button>
          <TextButton
            className={
              " text-lg " +
              (filter !== null ? "border-2 border-gray-500 bg-gray-200" : "")
            }
          >
            Фільтр
          </TextButton>
        </Popover.Button>
        <Popover.List className="left-0 top-0 w-max">
          <Popover.Item
            onClick={handleFilterClick(false)}
            className={
              filter === false
                ? "p-1 border-2 border-gray-500 bg-gray-200"
                : "p-1"
            }
          >
            Лише незавершені
          </Popover.Item>
          <Popover.Item
            onClick={handleFilterClick(true)}
            className={
              filter === true
                ? "p-1 border-2 border-gray-500 bg-gray-200"
                : "p-1"
            }
          >
            Лише завершені
          </Popover.Item>
        </Popover.List>
      </Popover>
      <Button onClick={addNewTask} className=" px-2 ">
        + Добавити завдання
      </Button>
    </div>
  );
};
