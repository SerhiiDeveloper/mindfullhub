import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string
}
export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={"p-2 px-4 bg-white shadow-lg rounded-3xl text-gray-500 text-base font-semibold " + className}
      {...props}
    >
      {children}
    </button>
  );
};
