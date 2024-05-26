import { FC, ReactNode } from "react";
import { usePopoverContext } from "./popoverProvider";

type PopoverButtonPropsType = {
  children: ReactNode;
};
export const PopoverButton: FC<PopoverButtonPropsType> = ({ children }) => {
  const { isOpen, setOpen, setClose } = usePopoverContext();
  const handleClick = () => {
    if (isOpen) return setClose();
    return setOpen();
  };
  return <span onClick={handleClick} className="cursor-pointer">{children}</span>;
};
