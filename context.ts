import { createContext } from "react";
import { Period, SymptomDict, SymptomEvent } from "./types";
import { toJsonDate } from "./utils";

type GlobalContextType = {
  calendar: Period[];
  setCalendar: (calendar: Period[]) => void;
  symptomItems: SymptomDict;
  setSymptomItem: (symptomItem: SymptomDict) => void;
  symptomEvents: SymptomEvent[];
  setSymptomEvents: (symptoms: SymptomEvent[]) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  calendar: [],
  setCalendar: () => {},
  symptomItems: {},
  setSymptomItem: () => {},
  symptomEvents: [],
  setSymptomEvents: () => {},
});
