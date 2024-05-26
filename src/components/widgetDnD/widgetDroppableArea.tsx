import { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type WidgetDroppableAreaPropsType = {
  children?: ReactNode;
};
export const WidgetDroppableArea: FC<WidgetDroppableAreaPropsType> = ({
  children,
}) => {
  const { setNodeRef } = useDroppable({
    id: "widget-droppable-area",
  });
  return <div ref={setNodeRef} className="absolute z-10 bg-black opacity-0 w-full h-full flex items-center">{children}</div>;
};
