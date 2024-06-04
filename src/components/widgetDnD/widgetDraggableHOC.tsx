import { FC, ReactNode } from "react";
import {
  WidgetTypeEnum,
  useActiveWidgetStore,
} from "../../store/activeWidgetStore";
import { useDraggable } from "@dnd-kit/core";

type WidgetDraggablePropsType = {
  children: ReactNode;
  widgetType: WidgetTypeEnum;
  className?: string;
};

export const WidgetDraggableHOC: FC<WidgetDraggablePropsType> = ({
  children,
  widgetType,
  className,
}) => {
  const widget = useActiveWidgetStore((state) => state.widgets[widgetType]);
  const { activeWidget, setActiveWidget } = useActiveWidgetStore((state) => ({
    activeWidget: state.activeWidget,
    setActiveWidget: state.setActiveWidget,
  }));

  const { setNodeRef, transform } = useDraggable({
    id: widgetType,
    data: widget,
  });
  const style = () => {
    // if (window.matchMedia("(min-width: 768px)").matches) {
      return {
        transform: transform
          ? `translate3d(${widget.x + transform.x}px, ${
              widget.y + transform.y
            }px, 0)`
          : `translate3d(${widget.x}px, ${widget.y}px, 0)`,
      };
    // } else {
    //   return {
    //     transform: "translate(-50%, 0)"
    //   }
    // }
  };

  const handleClick = () => {
    setActiveWidget(widgetType);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ zIndex: activeWidget === widgetType ? "30" : "20", ...style() }}
      onClick={handleClick}
      className={"absolute left-0 top-0 " + className}
      // className={"absolute left-1/2 top-16 md:left-0 md:top-0 " + className}
    >
      {children}
    </div>
  );
};
