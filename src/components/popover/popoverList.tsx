import { FC, ReactNode } from "react";
import { usePopoverContext } from "./popoverProvider";
import { useClickOutside } from "./useClickOutside";

type PopoverListPropsType = {
  children: ReactNode;
  className?: string 
};
export const PopoverList: FC<PopoverListPropsType> = ({ children, className }) => {
  const { isOpen, setClose } = usePopoverContext();
  const ref = useClickOutside(setClose);
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className={"bg-white absolute p-2 rounded shadow flex flex-col justify-start items-start " + className}
    >
      {children}
    </div>
  );
};
