import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SymptomDict, SymptomItem } from "../types";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import { GlobalContext } from "../context";

export default () => {
  //Adding the context
  const { symptomItems, setSymptomItem, symptomEvents, setSymptomEvents } =
    useContext(GlobalContext);

  const [symptom, setSymptom] = useState<string>("");
  const symptomList = Object.entries(symptomItems);

  //Fuction for when the user press "Guardar"
  const handleButtonPress = () => {
    if (symptomList.length >= 10) {
      Alert.alert("Ya has añadido 10 síntomas");
    } else if (symptom.trim() !== "") {
      //The system asigns a ramdon color to the new symptom
      const newItem: SymptomItem = {
        title: symptom,
        colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };
      //Check that the symptom doesn't exit already
      const alreadyExist = symptomList.find(
        ([id, symptom]) => symptom.title === newItem.title
      );
      if (alreadyExist) {
        Alert.alert("No puedes añadir dos síntomas con el mismo nombre");
      } else {
        //Adding the new symptom, to symptomItem as a SymptomDict (id, title, color)
        const id = uuid.v4().toString();
        setSymptomItem({
          ...symptomItems,
          [id]: newItem,
        });
        setSymptom("");
      }
    }
  };

  //Delete symptom: delete from symptomItem as a SymptomDict so the symptom doesnt exits anymore but also all the symptom events (symptom + date), so that the calendar updates accordingly
  const deleteItem = ({ id }: { id: string }) => {
    const newSymptoms = symptomEvents.filter(
      (symptom) => symptom.symptomId !== id
    );
    setSymptomEvents(newSymptoms);
    const { [id]: _symptom, ...rest } = symptomItems;
    setSymptomItem(rest);
  };

  type ItemComponentProps = { title: string; id: string; colour: string };
  //Every symptom in the screen shows the color, title and a delete button.
  const ItemComponent = ({ title, id, colour }: ItemComponentProps) => (
    <View style={[styles.item, { flexDirection: "row" }]}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 22 / 2,
          backgroundColor: colour,
          marginTop: 10,
          marginLeft: 1,
          flex: 1,
        }}
      ></View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.button}>
        <TouchableOpacity
          style={{ alignItems: "center", flex: 1 }}
          onPress={() => deleteItem({ id })}
        >
          <Ionicons size={25} color="purple" name="trash-outline"></Ionicons>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textUser}
        placeholder="Escribe aquí tu síntoma"
        onChangeText={(newSymptom) => setSymptom(newSymptom)}
        maxLength={15}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleButtonPress}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Guardar
        </Text>
      </TouchableOpacity>

      <FlatList
        data={symptomList}
        renderItem={({ item: [id, symptom] }) => (
          <ItemComponent
            title={symptom.title}
            id={id}
            colour={symptom.colour}
          />
        )}
        keyExtractor={([id, symptom]) => id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2D8FF",
  },
  textUser: {
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 50,
    marginTop: 50,
    fontWeight: "bold",
    fontSize: 20,
    color: "purple",
  },
  screenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 30,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "purple",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#E4C1F7",
    textAlign: "center",
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10,
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
  button: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 7,
    flex: 1,
  },
  saveButton: {
    margin: 10,
    marginTop: 20,
    height: 50,
    borderRadius: 10,
    backgroundColor: "purple",
    alignContent: "center",
  },
  title: {
    marginRight: 40,
    marginLeft: 10,
    //marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    flex: 10,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
});
