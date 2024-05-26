export enum TimerType {
  WORK = "work",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}

export type TimerSettingsType = {
  [key in TimerType]: number;
};