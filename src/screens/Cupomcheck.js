import { useFocusEffect } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet } from 'react-native';
import { DEV_API_BASE_WS } from '@env'
import { View } from "react-native";
import { JWT_SECRET } from '@env'
import JWT from 'expo-jwt';

export default function Cupomcheck({ navigation }) {
    const { deviceId } = useSelector((state) => state.userReducer);
    const [permission, setPermission] = useState(null);
    const ws = new WebSocket(DEV_API_BASE_WS + '/cable');

    ws.onopen = function () {
        let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
        ws.send(JSON.stringify(message))
    }

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                ws.close();
            }
        }, [])
    );

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setPermission({ permission: status })
    }

    async function handleBarCodeScanned({ data }) {
        redirectToHome(data)
    }

    function redirectToHome(data) {
        temp = { "command": "checkcupon", "data": data }
        payload = JWT.encode(temp, JWT_SECRET);
        message = {
            "identifier": "{\"channel\":\"ControlChannel\"}",
            "command": "message",
            "device_id": deviceId,
            "data": JSON.stringify({ "token": payload })
        }
        ws.send(JSON.stringify(message))
        navigation.navigate("Home")
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
});



// AppRegistry.registerComponent('Cupomcheck', () => Cupomcheck);

// constructor(props) {
//     super(props)
//     const { uuid } = this.props.route.params;
//     ws = new WebSocket('ws://192.168.7.94:3000/cable');
//     this.state = {
//         hasPermission: null,
//         uuid: uuid,
//     }
//     ws.onopen = function () {
//         let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
//         ws.send(JSON.stringify(message))
//         // message = {
//         //     "command": "message",
//         //     "identifier": "{\"channel\":\"ControlChannel\"}",
//         //     "data": JSON.stringify({ message: '' })
//         // }
//         // ws.send(JSON.stringify(message))
//     }

//     this.initialize()

//     redirectToHome = function (data) {
//         temp = { "command": "checkcupom", "device": uuid, "data": data }
//         message = {
//             "command": "message",
//             "identifier": "{\"channel\":\"ControlChannel\"}",
//             "data": JSON.stringify({ message: temp })
//         }
//         ws.send(JSON.stringify(message))
//         props.navigation.navigate("Home")
//     }
// }
