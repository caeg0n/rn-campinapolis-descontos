import React, { Component } from "react";
import { AppRegistry, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { v4 } from "uuid";

export default class Home extends Component {

    constructor(props) {
        super(props);
        const tempUuid = v4()
        this.navigate = this.props.navigation.navigate;
        this.state = {
            uuid: tempUuid,
            url: 'http://192.168.7.94:3000/home/' + tempUuid
        }
    }

    componentDidMount() {
        var state = this.state
        var navigate = this.navigate
        var t = this
        var ws = new WebSocket('ws://192.168.7.94:3000/cable');
        ws.onopen = function (event) {
            let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
            ws.send(JSON.stringify(message))
        }
        ws.onmessage = async function (event) {
            const data = JSON.parse(event.data)
            const device_id = data.message?.device_id
            const notice = data.message?.flash?.flashes?.notice
            const alert = data.message?.flash?.flashes?.alert
            const command = data.message?.command
            if (device_id && (notice || alert)) {
                if (notice == "Signed in successfully." || alert == "You are already signed in.") {
                    if (state.uuid == device_id) {
                        navigate("Cupomcheck", { uuid: state.uuid })
                    }
                }
            }
            if (device_id && command) {
                if (state.uuid == device_id && command == 'redirect_with_coupon_check_success') {
                    t.setState({ url: 'http://192.168.7.94:3000/coupon/check_success' })
                }
                if (state.uuid == device_id && command == 'redirect_with_coupon_check_fail') {
                    t.setState({ url: 'http://192.168.7.94:3000/coupon/check_fail' })
                }
            }
        }
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <Text>{this.uuid}</Text> */}
                {/* <TouchableHighlight style={{ padding: 10, backgroundColor: 'blue', marginTop: 20 }} onPress={() => this.sendPostMessage()}>
                    <Text style={{ color: 'white' }}>Send post message from react native</Text>
                </TouchableHighlight> */}
                <WebView
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                    source={{ uri: this.state.url }}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('Home', () => Home);