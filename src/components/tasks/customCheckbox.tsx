import { FC } from "react";
import styles from "./checkbox.module.css";

type CheckboxPropsType = {
  isChecked?: boolean;
  onCheck?: () => void;
};

export const Checkbox: FC<CheckboxPropsType> = ({
  isChecked = false,
  onCheck,
}) => {
  return (
    <input
      type="checkbox"
      onChange={onCheck}
      checked={isChecked}
      className={styles.checkbox}
    />
  );
};
