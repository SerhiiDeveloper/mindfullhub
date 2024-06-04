import { WidgetTypeEnum } from "../../store/activeWidgetStore";
import { useTasksStore } from "../../store/tasksStore";
import { WidgetControlPanel } from "../widgetDnD/widgetControlPanel";
import { WidgetDraggableHOC } from "../widgetDnD/widgetDraggableHOC";
import { TaskCompletedRange } from "./taskCompletedRange";
import { TasksControlPanel } from "./tasksControlPanel";
import { TasksList } from "./tasksList";

export const Tasks = () => {
  const isTasksShow = useTasksStore((state) => state.isTasksShow);
  const setIsTasksShow = useTasksStore((state) => state.setIsTasksShow);

  // if (!isTasksShow) return;
  return (
    <WidgetDraggableHOC
      widgetType={WidgetTypeEnum.TASKS}
      className={!isTasksShow ? "hidden" : ""}
    >
      <div className={"w-80 rounded-md bg-white shadow"}>
        <WidgetControlPanel
          header="Список завдань"
          handleClick={setIsTasksShow}
          widgetType={WidgetTypeEnum.TASKS}
        />
          <div>
            <TasksControlPanel />
            <TasksList />
            <TaskCompletedRange />
          </div>
      </div>
    </WidgetDraggableHOC>
  );
};
