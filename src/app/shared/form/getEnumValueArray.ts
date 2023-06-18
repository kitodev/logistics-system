export function getEnumValueArray<T>(enumInput: T): Array<T[keyof T]> {
  return Object.keys(enumInput).map((value) => enumInput[value]);
}
