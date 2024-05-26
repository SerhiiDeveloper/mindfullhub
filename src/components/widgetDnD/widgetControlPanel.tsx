import { FC } from "react";
import { SvgController } from "../svgController";
import MinusSVG from "../../assets/svg/minus.svg";
import { WidgetTypeEnum } from "../../store/activeWidgetStore";
import { useDraggable } from "@dnd-kit/core";

type WidgetControlPropsType = {
  header: string;
  handleClick: () => void;
  widgetType: WidgetTypeEnum;
};
export const WidgetControlPanel: FC<WidgetControlPropsType> = ({
  header,
  handleClick,
  widgetType,
}) => {
  const { attributes, listeners } = useDraggable({
    id: widgetType,
  });

  return (
    <div
      {...listeners}
      {...attributes}
      className="p-4 px-6 border-b-2 border-gray-300 flex flex-row justify-between items-center cursor-grab"
    >
      <h2 className="text-lg font-semibold">{header}</h2>
      <SvgController src={MinusSVG} alt="Згорнути" onClick={handleClick} />
    </div>
  );
};
