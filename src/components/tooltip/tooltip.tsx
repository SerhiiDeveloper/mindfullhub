import { FC, useState } from "react";

type TooltipPropsType = {
  text: string;
  children: React.ReactNode;
};

export const Tooltip: FC<TooltipPropsType> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {children}
      {showTooltip && (
        <div className="hidden md:block absolute bottom-2 right-2 rounded z-50 bg-black opacity-75 text-white translate-x-full translate-y-full p-2">
          {text}
        </div>
      )}
    </div>
  );
};
