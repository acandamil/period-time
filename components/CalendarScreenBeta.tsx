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
import {
  calculateDurationInDays,
  calculateFuturePeriods,
  getDate,
  toJsonDate,
} from "../utils";
import { JsonDate, SymptomEvent } from "../types";
import { GlobalContext } from "../context";
import { Ionicons } from "@expo/vector-icons";

const getDateId = (day: Date) => day.toISOString().substring(0, 10);
const currentDate = new Date();

const getJsonDateId = (day: JsonDate) =>
  getDate(day).toISOString().substring(0, 10);

export const CalendarScreenBeta = () => {
  const {
    calendar: periods,
    setCalendar,
    symptomItems,
    symptomEvents,
    setSymptomEvents,
  } = useContext(GlobalContext);

  //State to storage the selected date in teh calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const selectedJsonDate =
    selectedDate !== undefined ? toJsonDate(selectedDate) : undefined;
  //State to storage if the modal is open
  const [modalVisible, setModalVisible] = useState(false);

  //Select if the are any period in the select day
  const selectedPeriod = periods
    .filter(
      (period) =>
        selectedDate !== undefined &&
        getDate(period.start) <= selectedDate &&
        getDate(period.end) >= selectedDate
    )
    .at(0);

  //Transforms the periods (Period type) in an array of individual dates, which contains each day the user has had bleeding
  const days = periods.flatMap((period) => {
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

  //MarkedDates is the variable that the calendar later needs to know which days to mark. Initially, we the bleeding days.
  const markedDatePairs = dayStrings.map((day) => [
    day,
    { selected: true, selectedColor: "#ff8c8c", dots: [] },
  ]);
  const markedDates = Object.fromEntries(markedDatePairs);

  //Now we add to markesDates the symptoms for the dots. We cheek if its a bleeding day or not
  symptomEvents.forEach((sympton) => {
    const dateId = getJsonDateId(sympton.date);
    const dot = {
      key: sympton.symptomId,
      color: symptomItems[sympton.symptomId].colour,
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

  //We calculate and add now to the calendar the future periods in a different color
  const futurePeriods = calculateFuturePeriods(periods);
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

  //Now we add to markedDate the day selected, checking the corresponding color
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
      : symptomEvents.filter(
          (symptom) => getJsonDateId(symptom.date) === getDateId(selectedDate)
        );
  const symptomList = Object.entries(symptomItems);
  const symptonIdForSelectedDate = symptomForSelectedDate.map(
    (sympton) => sympton.symptomId
  );
  //Checking which symptoms are already selected in a day, so we dont show the symptoms in the new symptom list
  const symptomsAvailableForSelectedDay = symptomList.filter(
    ([id, symptom]) => !symptonIdForSelectedDate.includes(id)
  );

  //function to delete symptom in a day
  const deleteSymptomForASelectedDay = (selectedSympton: SymptomEvent) => {
    const newSymptons = symptomEvents.filter(
      (symptom) =>
        getJsonDateId(symptom.date) !== getJsonDateId(selectedSympton.date) ||
        symptom.symptomId !== selectedSympton.symptomId
    );
    setSymptomEvents(newSymptons);
  };

  const selectedPeriodDuration =
    selectedPeriod !== undefined
      ? calculateDurationInDays(
          getDate(selectedPeriod.start),
          getDate(selectedPeriod.end)
        )
      : 0;
  const incrementDay = (increment: number) => {
    if (selectedPeriod !== undefined) {
      const newEnd = new Date(getDate(selectedPeriod.end));
      newEnd.setDate(newEnd.getDate() + increment);
      const newPeriods = periods.filter(
        (period) => period.start !== selectedPeriod.start
      );
      const newPeriod = {
        ...selectedPeriod,
        end: toJsonDate(newEnd),
      };
      setCalendar([...newPeriods, newPeriod]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal for new symptoms */}
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
                        symptomId: id,
                        date: selectedJsonDate,
                      };
                      setSymptomEvents([...symptomEvents, newSympton]);
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
      {/* Calendar */}
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
      {/* Message for the front of the calendar, 2 options: there is a day select and there isnt */}
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
          {/* List of the already selected symptoms for the selected date */}
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
                      backgroundColor: symptomItems[item.symptomId].colour,
                      marginTop: 5,
                      marginLeft: 1,
                      flex: 1,
                    }}
                  ></View>
                  <Text style={styles.sympton}>
                    {symptomItems[item.symptomId].title}
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
              keyExtractor={(item) => item.symptomId}
            />
          ) : (
            <Text style={styles.noSymptons}>No hay síntomas</Text>
          )}
        </View>
        {/* Button of register a new period o delete the current period */}
        {selectedDate !== undefined &&
          selectedDate.getTime() <= currentDate.getTime() && (
            <View style={{ flex: 1 }}>
              {/* Button of new symptom*/}
              {symptomsAvailableForSelectedDay.length !== 0 && (
                <TouchableOpacity
                  style={styles.touchButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={{ color: "white", fontSize: 17, marginTop: 4 }}>
                    Nuevo síntoma
                  </Text>
                </TouchableOpacity>
              )}
              {selectedPeriod === undefined ? (
                <TouchableOpacity
                  style={styles.touchButton}
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
                      setCalendar([...periods, newPeriod]);
                    }
                  }}
                >
                  <Text style={{ color: "white", fontSize: 17, marginTop: 4 }}>
                    Nueva Regla
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.touchButton}
                    onPress={() => {
                      setCalendar(
                        periods.filter((period) => period !== selectedPeriod)
                      );
                    }}
                  >
                    <Text
                      style={{ color: "white", fontSize: 17, marginTop: 4 }}
                    >
                      Borrar
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "#ecc0fa",
                      marginLeft: 10,
                      marginRight: 10,
                      marginTop: 6,
                      borderRadius: 10,
                      height: 129,
                      flexDirection: "column",
                      padding: 10,
                    }}
                  >
                    <Text style={[styles.duration, { flex: 1 }]}>Duración</Text>
                    <Text style={[styles.duration, { flex: 1 }]}>
                      {selectedPeriodDuration} días
                    </Text>
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        flex: 2,
                        alignItems: "baseline",
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          {
                            //flex: 1,
                            borderRadius: 200,
                            width: 35,
                            height: 35,
                            backgroundColor: "purple",
                            marginRight: 15,
                          },
                        ]}
                        disabled={selectedPeriodDuration <= 1}
                        onPress={() => incrementDay(-1)}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 17,
                            alignSelf: "center",
                            marginTop: 5,
                          }}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                      {/* <View
                        style={[
                          {
                            //flex: 1,
                            borderRadius: 200,
                            width: 35,
                            height: 35,
                            backgroundColor: "purple",
                            marginRight: 15,
                          },
                        ]}
                      >
                        <Button
                          title="-"
                          color="white"
                          disabled={selectedPeriodDuration <= 1}
                          onPress={() => incrementDay(-1)}
                        />
                      </View> */}
                      <TouchableOpacity
                        style={[
                          {
                            //flex: 1,
                            borderRadius: 200,
                            width: 35,
                            height: 35,
                            backgroundColor: "purple",
                          },
                        ]}
                        onPress={() => incrementDay(1)}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 17,
                            alignSelf: "center",
                            marginTop: 5,
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
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
  touchButton: {
    alignItems: "center",
    height: 40,
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
  duration: {
    textAlign: "center",
    fontSize: 18,
    padding: 3,
    color: "purple",
  },
});
