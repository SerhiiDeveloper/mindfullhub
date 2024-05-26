import { FC, ReactNode, useState } from "react";
import { PopoverContext } from "./popoverProvider";
import { PopoverButton } from "./popoverButton";
import { PopoverList } from "./popoverList";
import { PopoverItem } from "./popoverItem";

type PopoverComponentPropsType = {
  children: ReactNode;
};

export const PopoverComponent: FC<PopoverComponentPropsType> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setOpen = () => setIsOpen(true);
  const setClose = () => setIsOpen(false);
  return (
    <PopoverContext.Provider
      value={{ isOpen, setOpen, setClose }}
    >
      <div className="relative z-20">{children}</div>
    </PopoverContext.Provider>
  );
};

export const Popover = Object.assign(PopoverComponent, {
  Button: PopoverButton,
  List: PopoverList,
  Item: PopoverItem,
});
