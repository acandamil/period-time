export interface Period {
  start: JsonDate;
  end: JsonDate;
}
export type JsonDate = {
  year: number;
  month: number;
  day: number;
};
export type SymptonEvent = {
  symptonId: string;
  date: JsonDate;
};
export interface SymptonItem {
  title: string;
  colour: string;
}
export type SymptomDict = {
  [key in string]: SymptonItem;
};
