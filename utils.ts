export type JsonDate = {
  year: number;
  month: number;
  day: number;
};

export const getDate = (date: JsonDate): Date =>
  new Date(Date.UTC(date.year, date.month, date.day));

export const toJsonDate = (date: Date): JsonDate => {
  console.log("converting date", date);
  console.log("day -->", date.getUTCDate());
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
};

export const getMillis = (date: JsonDate) => getDate(date).getTime();
