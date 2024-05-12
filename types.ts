export interface Period {
  start: JsonDate;
  end: JsonDate;
}
//We need to use JsonDate so we can use the storage without losing information, going from dates to string
export type JsonDate = {
  year: number;
  month: number;
  day: number;
};
//This type represent the combination of one specific date and one symptom
export type SymptomEvent = {
  symptomId: string;
  date: JsonDate;
};
//This type represent a symptom in general
export interface SymptomItem {
  title: string;
  colour: string;
}
//This type represent a diccionary of SymptomItem
export type SymptomDict = {
  [key in string]: SymptomItem;
};
