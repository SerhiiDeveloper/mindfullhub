import { FC } from "react";
import { SvgController } from "../svgController";
import DeleteSVG from "../../assets/svg/delete.svg";

type LocalListItemProps = {
  _id: string;
  activeId: string;
  title: string;
  clickHandler: (id: string) => void;
  deleteHandler: (id: string) => void;
};
export const LocalListItem: FC<LocalListItemProps> = ({
  _id,
  activeId,
  title,
  clickHandler,
  deleteHandler,
}) => {
  const handleItemClick = () => {
    clickHandler(_id);
  };
  const handleDelete = () => {
    deleteHandler(_id);
  };
  return (
    <li
      className={
        "flex flex-row justify-between items-center p-2 border-2 cursor-pointer hover:bg-gray-100 " +
        (activeId === _id ? "border-gray-500" : "border-white")
      }
      onClick={handleItemClick}
    >
      <p>{title}</p>
      <SvgController
        src={DeleteSVG}
        alt="Видалити з кешу"
        onClick={handleDelete}
      />
    </li>
  );
};
