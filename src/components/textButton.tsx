import React from "react";

interface TextButtonProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}
export const TextButton: React.FC<TextButtonProps> = ({
  children,
  active,
  className = " ",
  ...props
}) => {
  return (
    <span
      className={
        "text-gray-900 text-sm font-normal cursor-pointer hover:bg-gray-100 p-2 " +
        className +
        (active ? "border-b-2 border-gray-500" : "")
      }
      {...props}
    >
      {children}
    </span>
  );
};
