export type FormSelectItem<T> = {
  value: T[keyof T];
  label: string;
};
