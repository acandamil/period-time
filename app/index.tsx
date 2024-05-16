import { useContext } from "react";
import { GlobalContext } from "../context";
import { calculateFuturePeriods, getDate } from "../utils";
import { View, Text, StyleSheet } from "react-native";

export default () => {
  //Instead of using props, we have to use Context for the common variables
  const { calendar } = useContext(GlobalContext);
  //Calculation of the next periods, days left for next period and if the user is in her period
  const currentDate = new Date();
  const futurePeriods = calculateFuturePeriods(calendar);
  const allPeriods = [...calendar, ...futurePeriods];
  const nextPeriod = futurePeriods
    .filter((period) => getDate(period.start) > currentDate)
    .at(0);

  //Days left for the next period
  const daysLeft =
    nextPeriod === undefined
      ? undefined
      : Math.ceil(
          (getDate(nextPeriod.start).getTime() - new Date().getTime()) /
            (24 * 60 * 60 * 1000)
        );

  //Check if current date is in a calculated period or real period
  const isWithinRange = allPeriods.some((period) => {
    const endDate = getDate(period.end);
    endDate.setHours(23, 59);
    return getDate(period.start) <= currentDate && endDate >= currentDate;
  });

  //The screen has 3 modes: 1. If the user is currently with her period 2. There is not enough data to make an estimation 3. The screen shows the days left for the next period
  return (
    <View style={styles.container}>
      <View style={styles.viewTitle}>
        <Text style={styles.text}>Bienvenida</Text>
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
