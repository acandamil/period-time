import { createContext } from "react";
import { Period, SymptomDict, SymptonEvent } from "./types";
import { toJsonDate } from "./utils";

type GlobalContextType = {
  calendar: Period[];
  setCalendar: (calendar: Period[]) => void;
  symptonItems: SymptomDict;
  setSymptonItem: (symptonItem: SymptomDict) => void;
  symptons: SymptonEvent[];
  setSymptons: (symptons: SymptonEvent[]) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  calendar: [],
  setCalendar: () => {},
  symptonItems: {},
  setSymptonItem: () => {},
  symptons: [],
  setSymptons: () => {},
});
