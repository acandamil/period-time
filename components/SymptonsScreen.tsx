import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, FlatList, Text, Alert} from "react-native";
import { SymptonItem } from "../App";

  type SymptomsProps = {
    symptonItems : SymptonItem[];
    setSymptonItem: (symptonItems: SymptonItem[] ) => void;
  }

  export const SymptomsScreen = ({symptonItems, setSymptonItem}: SymptomsProps) =>{
    const [sympton, setSympton] = useState<string>('')
    
    const handleButtonPress = () =>{
      if (symptonItems.length >= 10) {
        Alert.alert('Ya has añadido 10 síntomas');
      } else if(sympton.trim() !== ''){
            const newItem: SymptonItem = {
                id: String(symptonItems.length + 1),
                title: sympton,
                colour: '#'+ Math.floor(Math.random() * 16777215).toString(16),
            }
            const alreadyExist = symptonItems.find(item => item.title === newItem.title)
            if(alreadyExist){
              Alert.alert('No puedes añadir dos síntomas con el mismo nombre');
            }else{
            setSymptonItem([...symptonItems, newItem]);
            setSympton('');
            }
        }
    };

    type ItemComponentProps = {title: string, id:string, colour: string};
    
    const deleteItem = ({id}: {id: string}) => {
        const filteredItems = symptonItems.filter(symptonItems => symptonItems.id !== id)
        setSymptonItem(filteredItems)
        };
  
    const ItemComponent = ({title, id, colour}: ItemComponentProps) => (
      <View style={styles.item}>
        <View style={{width: 22, height: 22, borderRadius: 22/2, backgroundColor : colour, marginTop: 20, marginLeft:1}}></View>
        <Text style={styles.title}>{title}</Text>
            <View style = {styles.button}>       
                <Button title = "Borrar" color='white' onPress={() => deleteItem({id})}/>
            </View>
      </View>
      );
    

    return (
    <View style={styles.container}>
       <TextInput
        style = {styles.textUser}
        placeholder = "Escribe aquí tu síntoma"
        onChangeText = {newSympton => setSympton(newSympton)}
        maxLength={15}
       />
       <View style= {styles.screenButton}>
        <Button title = "Guardar" color='white' onPress={handleButtonPress}/>
      </View>
      <FlatList
        data={symptonItems}
        renderItem={({item}) => <ItemComponent title={item.title} id={item.id} colour={item.colour}/>}
        keyExtractor={item => item.id}
      />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2D8FF', 
    },
    textUser:{
        textAlign: "left",
        paddingLeft: 20,
        paddingRight: 50,
        marginTop:50,   
        fontWeight: 'bold',
        fontSize: 20, 
        color: 'purple'
      },
      screenButton:{
        marginRight:40,
        marginLeft:40,
        marginTop:30,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'purple',
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff'
      },
      buttonText:{
          color:'#E4C1F7',
          textAlign:'center',
          fontSize: 10,
          paddingLeft : 10,
          paddingRight : 10
      },
      item: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: '#E4C1F7',
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#E4C1F7'
      },
      button:{
        marginRight:10,
        marginLeft:10,
        paddingTop:4,
        marginTop:4,
        backgroundColor:'purple',
        borderRadius:5,
        borderWidth: 1,
        borderColor: 'purple'

      },
      title: {
        marginRight:40,
        marginLeft:10,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        fontSize: 20,
        fontWeight: 'bold',

      },
      circle: {
        width: 44,
        height: 44,
        borderRadius: 44/2,
    
     }
  });