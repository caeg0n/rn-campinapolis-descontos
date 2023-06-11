import React, { Component } from "react";
//import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/screens/Home";
import Cupomcheck from "./src/screens/Cupomcheck";
import { Text } from "react-native";

// persistence
import { Provider } from "react-redux";
import { Store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";


const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <PersistGate loading={<Text>Aguarde...</Text>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="Cupomcheck" component={Cupomcheck}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate >
    </Provider>
  );
}

// export default class WevViewApp extends Component {

//   constructor(props) {
//     super(props);
//     console.clear()
//   }

//   render() {
//     return (
//       <Provider store={Store}>
//         <PersistGate loading={<Text>Aguarde...</Text>} persistor={persistor}>
//           <NavigationContainer>
//             <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
//               <Stack.Screen name="Home" component={Home}></Stack.Screen>
//               <Stack.Screen name="Cupomcheck" component={Cupomcheck}></Stack.Screen>
//             </Stack.Navigator>
//           </NavigationContainer>
//         </PersistGate >
//       </Provider>
//     );
//   }
// }

// AppRegistry.registerComponent('WevViewApp', () => WevViewApp);