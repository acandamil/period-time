import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { useStorage } from "../App";
import {
  View,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { calculateFuturePeriods, getDate, toJsonDate } from "../utils";
import { JsonDate, SymptonEvent } from "../types";
import { GlobalContext } from "../context";
import { Ionicons } from "@expo/vector-icons";

const getDateId = (day: Date) => day.toISOString().substring(0, 10);
const currentDate = new Date();

const getJsonDateId = (day: JsonDate) =>
  getDate(day).toISOString().substring(0, 10);

export const CalendarScreenBeta = () => {
  const {
    calendar: dates,
    setCalendar,
    symptonItems: symptonItem,
    symptons,
    setSymptons,
  } = useContext(GlobalContext);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const selectedJsonDate =
    selectedDate !== undefined ? toJsonDate(selectedDate) : undefined;
  const [modalVisible, setModalVisible] = useState(false);

  const selectedPeriods = dates.filter(
    (period) =>
      selectedDate !== undefined &&
      getDate(period.start) <= selectedDate &&
      getDate(period.end) >= selectedDate
  );
  const selectedPeriod = selectedPeriods.at(0);

  const days = dates.flatMap((period) => {
    const dates = [];
    const currentDate = getDate(period.start);
    const end = getDate(period.end);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  });

  const dayStrings = days.map(getDateId);
  const markedDatePairs = dayStrings.map((day) => [
    day,
    { selected: true, selectedColor: "#ff8c8c", dots: [] },
  ]);
  const markedDates = Object.fromEntries(markedDatePairs);

  symptons.forEach((sympton) => {
    const dateId = getJsonDateId(sympton.date);
    const dot = {
      key: sympton.symptonId,
      color: symptonItem[sympton.symptonId].colour,
    };
    if (dateId in markedDates) {
      markedDates[dateId].dots.push(dot);
    } else {
      markedDates[dateId] = {
        selected: false,
        selectedColor: "#ff8c8c",
        dots: [dot],
      };
    }
  });

  const futurePeriods = calculateFuturePeriods(dates);
  const daysOfFuturePeriods = futurePeriods.flatMap((period) => {
    const dates = [];
    const currentDate = getDate(period.start);
    const end = getDate(period.end);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  });
  const daysOfFuturePeriodsString = daysOfFuturePeriods.map(getDateId);
  daysOfFuturePeriodsString.forEach((day) => {
    markedDates[day] = {
      selected: true,
      selectedColor: "#a8b0ff",
      dots: [],
    };
  });
  // console.log(">>>>>>>>>>>>");
  // console.log(futurePeriods);
  // console.log(">>>>>>>>>>>>");
  // console.log(daysOfFuturePeriodsString);
  if (selectedDate !== undefined) {
    const selectedDateID = getDateId(selectedDate);
    if (selectedDateID in markedDates) {
      if (markedDates[selectedDateID].selected === true) {
        markedDates[selectedDateID].selectedColor = "#bd2a2a";
      } else {
        markedDates[selectedDateID].selected = true;
        markedDates[selectedDateID].selectedColor = "#c56ff7";
      }
    } else {
      markedDates[selectedDateID] = {
        selected: true,
        selectedColor: "#c56ff7",
      };
    }
  }
  const symptomForSelectedDate =
    selectedDate === undefined
      ? []
      : symptons.filter(
          (symptom) => getJsonDateId(symptom.date) === getDateId(selectedDate)
        );
  const symptomList = Object.entries(symptonItem);
  const symptonIdForSelectedDate = symptomForSelectedDate.map(
    (sympton) => sympton.symptonId
  );
  const symptomsAvailableForSelectedDay = symptomList.filter(
    ([id, symptom]) => !symptonIdForSelectedDate.includes(id)
  );
  const deleteSymptomForASelectedDay = (selectedSympton: SymptonEvent) => {
    const newSymptons = symptons.filter(
      (symptom) =>
        getJsonDateId(symptom.date) !== getJsonDateId(selectedSympton.date) ||
        symptom.symptonId !== selectedSympton.symptonId
    );
    setSymptons(newSymptons);
  };

  return (
    <View style={styles.container}>
      <Modal
        style={styles.centeredView}
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={symptomsAvailableForSelectedDay}
              renderItem={({ item: [id, sympton] }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (selectedJsonDate !== undefined) {
                      const newSympton = {
                        symptonId: id,
                        date: selectedJsonDate,
                      };
                      setSymptons([...symptons, newSympton]);
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.textModal}>{sympton.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={([id, _sympton]) => id}
            />
            <Button
              title="Cancelar"
              color="purple"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <Calendar
        markingType={"multi-dot"}
        markedDates={markedDates}
        onDayPress={(date) => setSelectedDate(new Date(date.timestamp))}
        theme={{
          backgroundColor: "#F2D8FF",
          calendarBackground: "#F2D8FF",
          todayTextColor: "purple",
          arrowColor: "purple",
          textSectionTitleColor: "purple",
        }}
      />
      {selectedDate !== undefined ? (
        <Text style={styles.today}>
          Día {selectedDate.toLocaleDateString("es")}
        </Text>
      ) : (
        <Text style={styles.today}>Selecciona un día</Text>
      )}
      <View style={{ flexDirection: "row", padding: 20 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#ecc0fa",
            borderRadius: 10,
            height: 230,
          }}
        >
          {symptomForSelectedDate.length !== 0 ? (
            <FlatList
              data={symptomForSelectedDate}
              renderItem={({ item }) => (
                <View style={[styles.item, { flexDirection: "row" }]}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 22 / 2,
                      backgroundColor: symptonItem[item.symptonId].colour,
                      marginTop: 5,
                      marginLeft: 1,
                      flex: 1,
                    }}
                  ></View>
                  <Text style={styles.sympton}>
                    {symptonItem[item.symptonId].title}
                  </Text>
                  <TouchableOpacity
                    style={{ alignItems: "center", flex: 1, marginTop: 5 }}
                    onPress={() => deleteSymptomForASelectedDay(item)}
                  >
                    <Ionicons
                      size={25}
                      color="purple"
                      name="trash-outline"
                    ></Ionicons>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.symptonId}
            />
          ) : (
            <Text style={styles.noSymptons}>No hay síntomas</Text>
          )}
        </View>
        {selectedDate !== undefined &&
          selectedDate.getTime() <= currentDate.getTime() && (
            <View style={{ flex: 1 }}>
              {selectedPeriod === undefined ? (
                <View style={styles.button}>
                  <Button
                    title="Nueva Regla"
                    color="white"
                    onPress={() => {
                      if (
                        selectedDate !== undefined &&
                        selectedJsonDate !== undefined
                      ) {
                        const end = new Date(selectedDate);
                        end.setDate(end.getDate() + 6);
                        const newPeriod = {
                          start: selectedJsonDate,
                          end: toJsonDate(end),
                        };
                        setCalendar([...dates, newPeriod]);
                      }
                    }}
                  />
                </View>
              ) : (
                <View style={styles.button}>
                  <Button
                    title="Borrar"
                    color="white"
                    onPress={() => {
                      setCalendar(
                        dates.filter((period) => period !== selectedPeriod)
                      );
                    }}
                  />
                </View>
              )}
              {symptomsAvailableForSelectedDay.length !== 0 && (
                <View style={styles.button}>
                  <Button
                    title="Nuevo síntoma"
                    color="white"
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              )}
            </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2D8FF",
  },
  centeredView: {
    width: 400,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ecc0fa",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginRight: 40,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  sympton: {
    marginRight: 40,
    marginLeft: 10,
    marginTop: 5,
    fontSize: 15,
    flex: 3,
  },
  today: {
    marginRight: 40,
    marginLeft: 20,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    color: "purple",
    fontWeight: "bold",
    width: 300,
  },
  noSymptons: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
    color: "purple",
    fontWeight: "bold",
  },
  button: {
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 4,
    marginTop: 4,
    backgroundColor: "purple",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "purple",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#E4C1F7",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E4C1F7",
  },
  textModal: {
    fontSize: 15,
    padding: 3,
  },
});
