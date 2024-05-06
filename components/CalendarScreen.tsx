import React from "react";
import { View, Text, ScrollView, FlatList, StyleSheet, Button, Pressable} from "react-native"; 
import { Period, SymptomDict, SymptonItem } from "../App";


type CalendarProps={
  dates : Period[];
  setCalendar : (calendar: Period[]) => void;
  symptonItem : SymptomDict[];
}

export const CalendarScreen = ({dates, setCalendar, symptonItem}: CalendarProps) => {
  function addPeriod (){
    const newPeriodDate = new Date();
    const newEndPeriodDate = new Date();
    newEndPeriodDate.setDate(newPeriodDate.getDate() + 7);
    const newKey = "March_2024";
    const newMonth = 'Marzo 2024';
    const newPeriod = {key: newKey, start: newPeriodDate, end: newEndPeriodDate, month: newMonth};
    const periodsNew = [...dates, newPeriod]
    setCalendar(periodsNew)
  }
  const datesString = dates.map(period => {
    return {
      ...period,
      start: period.start.toISOString().split('T')[0],
      end: period.end.toISOString().split('T')[0],
    };
  });
   return ( <View style={styles.container}>
        <Text style={styles.listTitle}>Tus últimos periodos</Text>
        <View style={styles.screenButton}>
          <Button title="Nuevo periodo" color = 'white' onPress={()=>addPeriod()} />
        </View>
        <ScrollView>
          <FlatList
          data={datesString}
          renderItem={({item}) => <Item month= {item.month} start={item.start}  end={item.end}/>}
          keyExtractor={item => item.key}
          />
        </ScrollView> 
    </View>
  )};

  const Item = ({ month, start, end }: { month: string; start: string; end: string }) => (
    <View style={styles.item}>
      <Text style={styles.month}>{month}</Text>
      <Text style={styles.textOfList}>Inicio: {start}</Text>
      <Text style={styles.textOfList}>Final: {end}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2D8FF', 
    },
    viewTitle:{
      textAlign: 'left'
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#E4C1F7',
    },
    listTitle:{
      textAlign: "center",
      fontWeight: 'bold',
      paddingLeft:20,
      padding:10,
      fontSize: 20,
      color: 'purple'
    },
    textOfList:{
      padding:2,
      fontSize: 18,
    },
    month:{
      fontSize: 22,
      fontWeight: 'bold',
      color: 'purple',
    },
    text:{
      textAlign: "left",
      paddingLeft: 20,
      marginTop:50,   
      fontWeight: 'bold',
      fontSize: 25, 
      color: 'purple'
    },
    screenButton:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'purple',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'
    },
    buttonText:{
        color:'#E4C1F7',
        textAlign:'center',
        fontSize: 20,
        paddingLeft : 10,
        paddingRight : 10
    }
  });