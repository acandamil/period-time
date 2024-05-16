import { Tabs } from "expo-router";
import { GlobalContext } from "../context";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Period, SymptomDict, SymptomEvent } from "../types";
import { calculateFuturePeriods, getDate } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HOUR = 12;
const MINUTES = 10;
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [state, setState] = useState<T>(initialValue);
  useEffect(() => {
    const f = async () => {
      try {
        //AsyncStorage.clear();
        const jsonValue = await AsyncStorage.getItem(key);
        const value = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (value !== null) {
          setState(value);
        } else {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem(key, jsonValue);
        }
      } catch (e) {
        // TODO
      }
    };
    f();
  }, []);

  const setStorageState = async (value: T) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      setState(value);
    } catch (e) {
      // saving error
    }
  };
  return [state, setStorageState];
}
export default () => {
  //This useEffect is create to be able to throw a notification later
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);
  //setCalendarState is same than setCalendar but in setCalendar we add some necessary steps to throw notification
  const [calendar, setCalendarState] = useStorage<Period[]>("periods", []);

  const setCalendar = async (periods: Period[]) => {
    setCalendarState(periods);
    //Every time calendar changes, cancel all scheduled notifications
    Notifications.cancelAllScheduledNotificationsAsync();
    const futurePeriods = calculateFuturePeriods(periods);
    const nextPeriods = futurePeriods.filter((period) => {
      const notificationDate = getDate(period.start);
      notificationDate.setHours(HOUR, MINUTES);
      return notificationDate > new Date();
    });
    //Take the start of the next period (that is not in the past)
    const jsonTrigger = nextPeriods.at(0)?.start;
    //If the date is not undefined, check if the app has the necessary permissions
    if (jsonTrigger !== undefined) {
      const { granted } = await Notifications.getPermissionsAsync();
      //If the app doesnt have the permissions, then make a request
      if (!granted) {
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      }
      //Create new trigger for the notification
      const trigger = getDate(jsonTrigger);
      trigger.setHours(HOUR, MINUTES);
      //Create the notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Hoy se estima que comienza tu periodo",
        },
        trigger,
      });
    }
  };
  const [symptonItems, setSymptonItem] = useStorage<SymptomDict>(
    "symptoms",
    {}
  );
  const [symptons, setSymptons] = useStorage<SymptomEvent[]>(
    "symptonEvents",
    []
  );
  return (
    <GlobalContext.Provider
      value={{
        calendar,
        setCalendar,
        symptomItems: symptonItems,
        setSymptomItem: setSymptonItem,
        symptomEvents: symptons,
        setSymptomEvents: setSymptons,
      }}
    >
      <Tabs />
    </GlobalContext.Provider>
  );
};
