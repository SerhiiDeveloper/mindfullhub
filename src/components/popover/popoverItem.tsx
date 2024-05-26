import { FC, ReactNode, MouseEvent } from "react";
import { usePopoverContext } from "./popoverProvider";
import { TextButton } from "../textButton";

type PopoverItemPropsType = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLLIElement>) => void;
  className?: string;
};
export const PopoverItem: FC<PopoverItemPropsType> = ({
  children,
  onClick,
  className,
}) => {
  const { setClose } = usePopoverContext();
  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    onClick?.(event);
    setClose();
  };
  return (
    <TextButton onClick={handleClick} className={" " + className}>
      {children}
    </TextButton>
  );
};
