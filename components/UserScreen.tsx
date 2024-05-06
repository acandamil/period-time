import React from "react";
import { View, Text, ScrollView, StyleSheet} from "react-native";
import { Period } from "../App";


/*function calculateAverage(periods: Period[]): number {
    let sum: number = 0;

    for (let i = 0; i < periods.length; i++) {
      let days = Math.ceil((periods[i].end.getTime() - periods[i].start.getTime()) / (24 * 60 * 60 * 1000));
      sum = sum + days;
    }
  
    return Math.round(sum / periods.length);
  }*/

  function calculateMedian(periods: Period[]): number {
    const durations: number[] = [];
  
    for (let i = 0; i < periods.length; i++) {
      const days = Math.ceil((periods[i].end.getTime() - periods[i].start.getTime()) / (24 * 60 * 60 * 1000));
      durations.push(days);
    }
  
    durations.sort((a, b) => a - b);
  
    const mid = Math.floor(durations.length / 2);
  
    if (durations.length % 2 === 0) {
      return Math.round((durations[mid - 1] + durations[mid]) / 2);
    } else {
      return durations[mid];
    }
  }

  function calculateMedianCicle(periods: Period[]): number {
    var i = 0;
    const durations: number[] = [];
    if(periods.length > 24){
      i = periods.length - 24;
    }
    while(i < periods.length - 1){
      const days = Math.ceil((periods[i].start.getTime() - periods[i+1].start.getTime()) / (24 * 60 * 60 * 1000));
      durations.push(days);
      i++;
    }
    durations.sort((a, b) => a - b);
  
    const mid = Math.floor(durations.length / 2);
  
    if (durations.length % 2 === 0) {
      return Math.round((durations[mid - 1] + durations[mid]) / 2);
    } else {
      return durations[mid];
    }
    
  }

  function calculateMedianEndStart(periods: Period[]): number {
    var i = 0;
    const durations: number[] = [];
    if(periods.length > 24){
      i = periods.length - 24;
    }
    while(i < periods.length - 1){
      const days = Math.ceil((periods[i].start.getTime() - periods[i+1].end.getTime()) / (24 * 60 * 60 * 1000));
      durations.push(days);
      i++;
    }
    durations.sort((a, b) => a - b);
  
    const mid = Math.floor(durations.length / 2);
  
    if (durations.length % 2 === 0) {
      return Math.round((durations[mid - 1] + durations[mid]) / 2);
    } else {
      return durations[mid];
    }
    
  }
 
  type UserProps={
    calendar : Period[];
  }
  
  export const UserScreen = ({calendar}: UserProps) => (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.viewOfInfo}>
          <Text style={styles.textUser}>Ciclo medio: {calculateMedianCicle(calendar)} </Text>
        </View>
        <View style={styles.viewOfInfo}>
          <Text style={styles.textUser}>Días medios entre final de un ciclo y comienzo del otro: {calculateMedianEndStart(calendar)}</Text>
        </View>
        <View style={styles.viewOfInfo}>
          <Text style={styles.textUser}>Periódo medio: {calculateMedian(calendar)}</Text>
        </View>
        {calendar.length <= 5 ?(
            <Text style={styles.textInfo}>Esta información esta calculada con menos de 5 meses, por lo tanto es muy poco fiable</Text>  
          ):(
            <Text style={styles.textInfo}>Esta información es aproximada. Pregunte siempre a su médico especialista si tiene dudas.</Text>  
                )
        }
      </ScrollView> 
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2D8FF', 
    },
    textUser:{
        textAlign: "center",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop:5,  
        marginBottom:5, 
        fontWeight: 'bold',
        fontSize: 25, 
        color: 'purple',
      },
    textInfo:{
      textAlign: "center",
      paddingLeft: 40,
      paddingRight: 40,
      marginTop:50,   
      fontSize: 15, 
      color: 'a83248',
    
    },
    viewOfInfo: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#E4C1F7',
      borderRadius:5,
      borderWidth: 1,
      borderColor:'#E4C1F7'
    }
  });