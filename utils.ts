export type JsonDate = {
  year: number;
  month: number;
  day: number;
};

export const getDate = (date: JsonDate): Date =>
  new Date(date.year, date.month, date.day);

export const toJsonDate = (date: Date): JsonDate => {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

export const getMillis = (date: JsonDate) => getDate(date).getTime();
