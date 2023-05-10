import React, { Component } from "react";
import { AppRegistry, Text, View, TouchableHighlight } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/screens/Home";
import Cupomcheck from "./src/screens/Cupomcheck";

const Stack = createStackNavigator();

export default class WevViewApp extends Component {

  constructor(props) {
    super(props);
    console.clear()
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Cupomcheck" component={Cupomcheck}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

AppRegistry.registerComponent('WevViewApp', () => WevViewApp);