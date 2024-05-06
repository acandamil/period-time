import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Period, SymptomDict, SymptonItem } from "../App";
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
import { useState } from "react";

const getDateId = (day: Date) => day.toISOString().substring(0, 10);

type SymptonEvent = {
  symptonId: string;
  date: Date;
};
type CalendarProps = {
  dates: Period[];
  setCalendar: (calendar: Period[]) => void;
  symptonItem: SymptomDict;
};
export const CalendarScreenBeta = ({
  dates,
  setCalendar,
  symptonItem,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [symptons, setSymptons] = useState<SymptonEvent[]>([
    {
      symptonId: "1",
      date: new Date(2024, 5, 6),
    },
    {
      symptonId: "2",
      date: new Date(2024, 5, 6),
    },
    {
      symptonId: "1",
      date: new Date(2024, 5, 7),
    },
  ]);
  const selectedPeriods = dates.filter(
    (period) =>
      selectedDate !== undefined &&
      period.start <= selectedDate &&
      period.end >= selectedDate
  );
  const selectedPeriod = selectedPeriods.at(0);

  const days = dates.flatMap((period) => {
    const dates = [];
    const currentDate = new Date(period.start);
    while (currentDate <= period.end) {
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
    const dateId = getDateId(sympton.date);
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

  const symptomForSelectedDate =
    selectedDate === undefined
      ? []
      : symptons.filter(
          (symptom) => getDateId(symptom.date) === getDateId(selectedDate)
        );
  console.log({ symptomForSelectedDate });
  const symptomList = Object.entries(symptonItem);
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
              data={symptomList}
              renderItem={({ item: [id, sympton] }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (selectedDate !== undefined) {
                      const newSympton = {
                        symptonId: id,
                        date: selectedDate,
                      };
                      setSymptons([...symptons, newSympton]);
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text>{sympton.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={([id, _sympton]) => id}
            />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Calendar
        markingType={"multi-dot"}
        markedDates={markedDates}
        onDayPress={(date) => setSelectedDate(new Date(date.timestamp))}
      />
      {selectedPeriod === undefined ? (
        <Button
          title="Nueva Regla"
          onPress={() => {
            if (selectedDate !== undefined) {
              const end = new Date(selectedDate);
              end.setDate(end.getDate() + 6);
              const newPeriod = {
                start: selectedDate,
                end,
              };
              setCalendar([...dates, newPeriod]);
            }
          }}
        />
      ) : (
        <Button
          title="Borrar"
          onPress={() => {
            setCalendar(dates.filter((period) => period !== selectedPeriod));
          }}
        />
      )}
      <Button title="Nuevo síntoma" onPress={() => setModalVisible(true)} />
      <FlatList
        data={symptomForSelectedDate}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 22 / 2,
                backgroundColor: symptonItem[item.symptonId].colour,
                marginTop: 20,
                marginLeft: 1,
              }}
            ></View>
            <Text style={styles.title}>
              {symptonItem[item.symptonId].title}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.symptonId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2D8FF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
    width: 160,
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
    width: 70,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#E4C1F7",
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E4C1F7",
  },
});
