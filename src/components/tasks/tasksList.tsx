import { TaskComponent } from "./taskComponent";
import { useTasksStore } from "../../store/tasksStore";

export const TasksList = () => {
  const tasksList = useTasksStore((state) => state.tasksList);
  const filterByChecked = useTasksStore((state) => state.filterByChecked);

  return (
    <div className="p-4 px-4 flex flex-row justify-between items-center overflow-y-auto">
      <ul className="w-full h-full  max-h-80 min-h-20">
        {tasksList.map((task) => {
          if (filterByChecked === null) {
            return (
              <TaskComponent
                key={task.id}
                text={task.text}
                checked={task.checked}
                id={task.id}
              />
            );
          }
          if (filterByChecked === task.checked) {
            return (
              <TaskComponent
                key={task.id}
                text={task.text}
                checked={task.checked}
                id={task.id}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};
