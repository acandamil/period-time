import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, VirtualizedList} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarScreen } from './components/CalendarScreen';
import { UserScreen } from './components/UserScreen';
import { SymptomsScreen } from './components/SymptonsScreen';

type HomeProps={
  daysLeft: number;
  calendar : Period[];
}

const HomeScreen = ({daysLeft, calendar}: HomeProps) => {
  const currentDate = new Date();
  const isWithinRange = currentDate >= calendar[0].start && currentDate <= calendar[0].end;
  //T0-D0: CHECK IF THE SECOND VIEW HAS THE PROPER STYLE
  return(
    <View style={styles.container}>
      <View style={styles.viewTitle}>
        <Text style = {styles.text}>Bienvenida, Aurora</Text>
      </View>
      {isWithinRange ? (
        <View style={styles.viewCircle}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>ESTÁS CON LA REGLA</Text>
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

export interface Period {
  key: string;
  start: Date;
  end: Date;
  month: string;
}
const PERIODOS: Period[] = [
  {key:'February_2024', start: new Date("2024-1-29"), end: new Date ("2024-2-5"), month: 'Febrero 2024'},
  {key:'January_2024', start: new Date("2024-1-1"), end: new Date ("2024-1-7"), month: 'Enero 2024'},
  {key: 'December_2023:', start: new Date("2023-12-1"), end: new Date("2023-12-7"), month: 'Diciembre 2023'},
  {key: 'November_2023:', start: new Date("2023-11-1"), end: new Date("2023-11-7"), month: 'Noviembre 2023'},
  {key: 'October_2023:', start: new Date("2023-10-1"), end: new Date("2023-10-7"), month: 'Octubre 2023'},
  {key: 'September_2023:', start: new Date("2023-9-1"), end: new Date("2023-9-7"), month: 'Septiembre 2023'},
  {key: 'August_2023:', start: new Date("2023-8-1"), end: new Date("2023-8-7"), month: 'Agosto 2023'},
];

const Tab = createBottomTabNavigator();

const App = () => {
  const [calendar, setCalendar] = useState(PERIODOS);   
  const dateLastPeriod: Date = calendar[0].start;
  let estimatedNextPeriod: Date = new Date(dateLastPeriod);
  estimatedNextPeriod.setDate(estimatedNextPeriod.getDate() + 28);
  let daysLeft: number = Math.ceil((estimatedNextPeriod.getTime()-new Date().getTime()) / (24 * 60 * 60 * 1000));
 
  return (
  <NavigationContainer>
    <Tab.Navigator
    screenOptions={({route}) =>
    ({
      headerTintColor: 'purple',
      tabBarStyle: {
        backgroundColor : '#E9C0FE'
      },
      tabBarIcon: ({color, size}) => {
      if(route.name == 'Home'){
        return(
          <Ionicons 
            name = "home-outline"
            size = {size}
            color = {color}
          />
        );
      }else if(route.name == 'Calendar'){
        return(
          <Ionicons 
            name = "calendar-outline"
            size = {size}
            color = {color}
          />
        );
      }else if(route.name == 'Symptoms'){
        return(
          <Ionicons 
            name = "fitness-outline"
            size = {size}
            color = {color}
          />
        ); 
      }else if(route.name == 'User'){
        return(
          <Ionicons 
            name = "person-outline"
            size = {size}
            color = {color}
          />
        );
      } 
    }, 
    tabBarActiveTintColor: 'purple',
    tabBarInactiveTintColor: 'black'
    })
    
    }>
      
      <Tab.Screen name="Home" component={()=><HomeScreen daysLeft={daysLeft} calendar={calendar}/>} options={{headerStyle: {backgroundColor: '#E9C0FE'}}}/>
      <Tab.Screen name="Calendar" component={()=><CalendarScreen dates = {calendar} setCalendar = {setCalendar}/>} options={{headerStyle: {backgroundColor: '#E9C0FE'}}} />
      <Tab.Screen name="Symptoms" component={()=><SymptomsScreen/>} options={ {headerStyle: { backgroundColor: '#E9C0FE' } }} />
      <Tab.Screen name="User" component={() => <UserScreen calendar={calendar} />} options={{ headerStyle: { backgroundColor: '#E9C0FE' } }} />
    </Tab.Navigator>
  </NavigationContainer>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D8FF', 
  },
  viewTitle:{
    justifyContent: 'flex-start'
  },
  viewCircle:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2D8FF'
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    backgroundColor: "purple",
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#F2D8FF',
    width: 200,
    textAlign: 'center'
  },
  circleTextUnderLine: {
    fontSize: 25,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#F2D8FF',
    width: 200,
    textAlign: 'center'
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

export default App;
