import { ChangeEvent, FC, useEffect, useRef } from "react";
import { useTasksStore } from "../../store/tasksStore";

type TaskTextInputPropsType = {
  text: string;
  checked: boolean;
  id: string;
};

export const TaskTextInput: FC<TaskTextInputPropsType> = ({
  text,
  checked,
  id,
}) => {
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (text !== "") return;
    inputRef.current?.focus();
  }, [text]);

  const handleFocusLeave = (event: ChangeEvent<HTMLDivElement>) => {
    const newText = event.currentTarget.textContent;
    if (newText === "") {
      return deleteTask(id);
    }
    if (newText && text !== newText) {
      return updateTask(id, newText);
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={handleFocusLeave}
      ref={inputRef}
      className={
        "w-full p-1 hover:bg-gray-100 focus:bg-gray-100 border-none outline-none cursor-text " +
        (checked ? "line-through" : "")
      }
    >
      {text}
    </div>
  );
};
