import React from "react";

type SvgControllerProps = {
  src: string;
  alt: string;
  onClick?: (event?: any) => void;
  size?: SizeType;
  active?: boolean;
  className?: string;
};

export enum SizeType {
  SM = "w-7 h-7",
  MD = "w-12 h-12",
  LG = "w-14 h-14",
}

export const SvgController: React.FC<SvgControllerProps> = ({
  src,
  alt,
  size = SizeType.SM,
  active = false,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={
        "cursor-pointer p-1 border-2 shrink-0 " +
        size +
        (active ? " border-gray-500 " : " border-white  ") +
        className
      }
      onClick={onClick}
      {...props}
    >
      <img src={src} alt={alt} />
    </div>
  );
};
