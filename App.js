import React, { Component } from 'react';
import { Alert, StyleSheet, Text, SafeAreaView, ScrollView, TextInput, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from "expo-splash-screen";


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@height:key';
const BMIKey = '@Bmi:key';

export default class App extends Component {
  state = {
    BMI: '',
    weight: '',
    height: '',
  };

  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const BMI = await AsyncStorage.getItem(BMIKey);
      const height = await AsyncStorage.getItem(heightKey);
      this.setState({BMI, height});
    } catch (error) {
      Alert.alert('Error', 'Error has occurred while loading data')
    }
  }

  calculateBMI = async () => {
    const { height, weight } = this.state;
    const BMI = ((weight / (height * height)) * 703).toFixed(1);
    this.setState({BMI});
    try {
      await AsyncStorage.setItem(heightKey, height);
      await AsyncStorage.setItem(BMIKey, BMI);
    } catch (error) {
      Alert.alert('Error', 'Error saving data to device')
    }
  }

  onChangeWeight = (weight) => {this.setState({weight});}
  onChangeHeight = (height) => {this.setState({height});}

  render(){
    const {BMI, weight, height} = this.state;

    return(
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput style={styles.input} onChangeText={this.onChangeWeight} value={weight} placeholder="Weight in Pounds"/>
          <TextInput style={styles.input} onChangeText={this.onChangeHeight} value={height} placeholder="Height in inches"/>
          <Pressable onPress={this.calculateBMI}>
            <Text style={styles.button}>Compute BMI</Text>
          </Pressable>
          <TextInput style={styles.BMI} value={BMI ? 'Body Mass Index is ' + BMI : ''} editable={false} />
          <Text style={styles.assessment}>Assessing Your BMI</Text>
          <Text style={styles.assessment}>  Underweight: less than 18.5</Text>
          <Text style={styles.assessment}>  Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assessment}>  Overweight: 25.0 to 29.9</Text>
          <Text style={styles.assessment}>  Obese: 30.0 or higher</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding:20,
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#34495e',
    color: '#fff',
    fontSize: 24,
    padding: 10,
    borderRadius: 3,
    textAlign: 'center',
  },
  BMI: {
    flex: 1,
    fontSize: 28,
    width: 300,
    color: '#000',
    margin: 60,
  },
  assessment: {
    fontSize: 20,
    flex: 1,
  }
});
