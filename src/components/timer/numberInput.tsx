import React, { ChangeEvent, ReactNode } from "react";
import { TimerType } from "./timerTypes";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  value: number;
  id: TimerType;
  onHandleChange: (type: TimerType, value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  children,
  value,
  id,
  onHandleChange,
  minValue = 0,
  maxValue = 1440,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (/^\d*$/.test(inputValue)) {
      if (inputValue === "") {
        return onHandleChange(id, 0);
      }

      if (
        parseInt(inputValue) >= minValue &&
        parseInt(inputValue) <= maxValue
      ) {
        return onHandleChange(id, parseInt(inputValue));
      }
    }
  };

  return (
    <div className="flex flex-col items-start mb-3">
      <label
        htmlFor={id}
        className="text-gray-900 text-sm font-normal cursor-pointer"
      >
        {children}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Введіть число"
        className="p-1 bg-white rounded-md border-2 border-gray-300 focus:border-gray-600"
      />
    </div>
  );
};
