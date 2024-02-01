import React from "react";
import { View, Text, ScrollView, FlatList, StyleSheet} from "react-native";


export const periods = [
    {key:'February_2024', start: new Date("2024-1-29"), end: new Date ("2024-2-6"), month: 'Febrero 2024'},
    {key:'January_2024', start: new Date("2024-1-1"), end: new Date ("2023-1-7"), month: 'Enero 2024'},
    {key: 'December_2023:', start: new Date("2023-12-1"), end: new Date("2023-12-7"), month: 'Diciembre 2023'},
    {key: 'November_2023:', start: new Date("2023-11-1"), end: new Date("2023-11-7"), month: 'Noviembre 2023'},
    {key: 'October_2023:', start: new Date("2023-10-1"), end: new Date("2023-10-7"), month: 'Octubre 2023'},
    {key: 'September_2023:', start: new Date("2023-9-1"), end: new Date("2023-9-7"), month: 'Septiembre 2023'},
    {key: 'August_2023:', start: new Date("2023-8-1"), end: new Date("2023-8-7"), month: 'Agosto 2023'},
  ];
  
const periodsString = periods.map(period => {
    return {
      ...period,
      start: period.start.toISOString().split('T')[0],
      end: period.end.toISOString().split('T')[0],
    };
  });

export const CalendarScreen = () => (
    <View style={styles.container}>
        <Text style={styles.listTitle}>Tus últimos periodos</Text>
        <ScrollView>
          <FlatList
          data={periodsString}
          renderItem={({item}) => <Item month= {item.month} start={item.start}  end={item.end}/>}
          keyExtractor={item => item.key}
          />
        </ScrollView> 
    </View>
  );

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
    }
  });