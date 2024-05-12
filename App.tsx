import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  VirtualizedList,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { UserScreen } from "./components/UserScreen";
import { SymptomsScreen } from "./components/SymptonsScreen";
import { CalendarScreenBeta } from "./components/CalendarScreenBeta";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  calculateFuturePeriods,
  calculateMedianCicle,
  getDate,
  toJsonDate,
} from "./utils";
import { Period, SymptomDict, SymptomEvent } from "./types";
import { GlobalContext } from "./context";

//Main screen, where the status of the user's cycle is displayed.
const HomeScreen = () => {
  //Instead of using props, we have to use Context for the common variables
  const { calendar } = useContext(GlobalContext);
  //Calculation of the next periods, days left for next period and if the user is in her period
  const currentDate = new Date();
  const futurePeriods = calculateFuturePeriods(calendar);
  const allPeriods = [...calendar, ...futurePeriods];
  const nextPeriod = futurePeriods
    .filter((period) => getDate(period.start) > currentDate)
    .at(0);
  const daysLeft =
    nextPeriod === undefined
      ? undefined
      : Math.ceil(
          (getDate(nextPeriod.start).getTime() - new Date().getTime()) /
            (24 * 60 * 60 * 1000)
        );
  const isWithinRange = allPeriods.some(
    (period) =>
      getDate(period.start) <= currentDate && getDate(period.end) >= currentDate
  );
  //The screen has 3 modes: 1. If the user is currently with her period 2. There is not enough data to make an estimation 3. The screen shows the days left for the next period
  return (
    <View style={styles.container}>
      <View style={styles.viewTitle}>
        <Text style={styles.text}>Bienvenida, Aurora</Text>
      </View>
      {isWithinRange ? (
        <View style={styles.viewCircle}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>ESTÁS CON LA REGLA</Text>
          </View>
        </View>
      ) : daysLeft === undefined ? (
        <View style={styles.viewCircle}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>NO HAY SUFUCIENTES DATOS</Text>
          </View>
        </View>
      ) : (
        <View style={styles.viewCircle}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>TE QUEDAN </Text>
            <Text style={styles.circleTextUnderLine}>{daysLeft} DÍAS</Text>
            <Text style={styles.circleText}>PARA TU PRÓXIMO PERIODO</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const Tab = createBottomTabNavigator();

//Functions necessary to make the application's storage (located on the client side) persisten
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [state, setState] = useState<T>(initialValue);
  useEffect(() => {
    const f = async () => {
      try {
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

const App = () => {
  const [calendar, setCalendar] = useStorage<Period[]>("periods", []);
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
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerTintColor: "purple",
            tabBarStyle: {
              backgroundColor: "#E9C0FE",
            },
            tabBarIcon: ({ color, size }) => {
              if (route.name == "Home") {
                return (
                  <Ionicons name="home-outline" size={size} color={color} />
                );
              } else if (route.name == "Calendar") {
                return (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                );
              } else if (route.name == "Symptoms") {
                return (
                  <Ionicons name="fitness-outline" size={size} color={color} />
                );
              } else if (route.name == "User") {
                return (
                  <Ionicons name="person-outline" size={size} color={color} />
                );
              }
            },
            tabBarActiveTintColor: "purple",
            tabBarInactiveTintColor: "black",
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerStyle: { backgroundColor: "#E9C0FE" } }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarScreenBeta}
            options={{ headerStyle: { backgroundColor: "#E9C0FE" } }}
          />
          <Tab.Screen
            name="Symptoms"
            component={SymptomsScreen}
            options={{ headerStyle: { backgroundColor: "#E9C0FE" } }}
          />
          <Tab.Screen
            name="User"
            component={UserScreen}
            options={{ headerStyle: { backgroundColor: "#E9C0FE" } }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2D8FF",
  },
  viewTitle: {
    justifyContent: "flex-start",
  },
  viewCircle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2D8FF",
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#F2D8FF",
    width: 200,
    textAlign: "center",
  },
  circleTextUnderLine: {
    fontSize: 25,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#F2D8FF",
    width: 200,
    textAlign: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#E4C1F7",
  },
  listTitle: {
    textAlign: "center",
    fontWeight: "bold",
    paddingLeft: 20,
    padding: 10,
    fontSize: 20,
    color: "purple",
  },
  textOfList: {
    padding: 2,
    fontSize: 18,
  },
  month: {
    fontSize: 22,
    fontWeight: "bold",
    color: "purple",
  },
  text: {
    textAlign: "left",
    paddingLeft: 20,
    marginTop: 50,
    fontWeight: "bold",
    fontSize: 25,
    color: "purple",
  },
});

export default App;
