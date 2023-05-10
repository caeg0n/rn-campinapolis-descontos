import React, { Component } from "react";
import { AppRegistry, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
});

export default class Cupomcheck extends Component {
    constructor(props) {
        super(props)
        const { uuid } = this.props.route.params;
        ws = new WebSocket('ws://192.168.7.94:3000/cable');
        this.state = {
            hasPermission: null,
            uuid: uuid,
        }
        ws.onopen = function () {
            let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
            ws.send(JSON.stringify(message))
            // message = {
            //     "command": "message",
            //     "identifier": "{\"channel\":\"ControlChannel\"}",
            //     "data": JSON.stringify({ message: '' })
            // }
            // ws.send(JSON.stringify(message))
        }

        this.initialize()

        redirectToHome = function (data) {
            temp = { "command": "checkcupom", "device": uuid, "data": data }
            message = {
                "command": "message",
                "identifier": "{\"channel\":\"ControlChannel\"}",
                "data": JSON.stringify({ message: temp })
            }
            ws.send(JSON.stringify(message))
            props.navigation.navigate("Home")
        }
    }

    componentDidMount() {
    }


    componentWillUnmount() {
    }

    async initialize() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status })
    }

    async handleBarCodeScanned({ data }) {
        this.redirectToHome(data)
    }

    render() {
        return (
            <View style={styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('Cupomcheck', () => Cupomcheck);