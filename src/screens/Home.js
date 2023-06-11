import { DEV_API_BASE_WS, DEV_API_BASE, JWT_SECRET } from '@env'
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { setDeviceId } from "../redux/actions";
import { setUserInfo } from "../redux/actions";
import { View } from "react-native";
import JWT from 'expo-jwt';
import { v4 } from "uuid";

export default function Home({ navigation }) {
    const dispatch = useDispatch();
    const uuid = v4()
    const { deviceId } = useSelector((state) => state.userReducer);
    const [url, setUrl] = useState(DEV_API_BASE + '/home/' + (deviceId == undefined ? uuid : deviceId));
    const ws = new WebSocket(DEV_API_BASE_WS + '/cable');

    ws.onopen = function () {
        let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
        ws.send(JSON.stringify(message))
    }

    ws.onmessage = async function (event) {
        const data = JSON.parse(event.data)
        const device_id = data.message?.device_id
        const command = data.message?.command
        if (device_id == deviceId && command) {
            var token = data.message?.data;
            var payload = JWT.decode(token, JWT_SECRET);
        }
        if (device_id == deviceId && command == "login" && payload.user_id > 0) {
            dispatch(setUserInfo(payload));
        }
        if (device_id == deviceId && command == "validate" && payload.user_id > 0) {
            navigation.navigate('Cupomcheck');
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            //codigo aqui ira rodar quando 
            //o component perder o foco
            return () => {
                ws.close();
            }
        }, [])
    );

    useEffect(() => {
        if (deviceId == undefined) {
            dispatch(setDeviceId(uuid));
        }
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <WebView
                style={{ flex: 1 }}
                startInLoadingState={true}
                originWhitelist={['*']}
                source={{ uri: url }}
            />
        </View>
    );

}
// export default class Home extends Component {

//     constructor(props) {
//         super(props);
//         const tempUuid = v4()
//         this.navigate = this.props.navigation.navigate;
//         this.state = {
//             uuid: tempUuid,
//             url: 'http://192.168.7.94:3000/home/' + tempUuid
//         }
//     }

//     componentDidMount() {
//         var state = this.state
//         var navigate = this.navigate
//         var t = this
//         var ws = new WebSocket('ws://192.168.7.94:3000/cable');
//         ws.onopen = function (event) {
//             let message = { "command": "subscribe", "identifier": "{\"channel\":\"ControlChannel\"}" }
//             ws.send(JSON.stringify(message))
//         }
//         ws.onmessage = async function (event) {
//             const data = JSON.parse(event.data)
//             const device_id = data.message?.device_id
//             const notice = data.message?.flash?.flashes?.notice
//             const alert = data.message?.flash?.flashes?.alert
//             const command = data.message?.command
//             if (device_id && (notice || alert)) {
//                 if (notice == "Signed in successfully." || alert == "You are already signed in.") {
//                     if (state.uuid == device_id) {
//                         navigate("Cupomcheck", { uuid: state.uuid })
//                     }
//                 }
//             }
//             if (device_id && command) {
//                 if (state.uuid == device_id && command == 'redirect_with_coupon_check_success') {
//                     t.setState({ url: 'http://192.168.7.94:3000/coupon/check_success' })
//                 }
//                 if (state.uuid == device_id && command == 'redirect_with_coupon_check_fail') {
//                     t.setState({ url: 'http://192.168.7.94:3000/coupon/check_fail' })
//                 }
//             }
//         }
//     }

//     componentWillUnmount() {
//     }

//     render() {
//         return (
//             <View style={{ flex: 1 }}>
//                 {/* <Text>{this.uuid}</Text> */}
//                 {/* <TouchableHighlight style={{ padding: 10, backgroundColor: 'blue', marginTop: 20 }} onPress={() => this.sendPostMessage()}>
//                     <Text style={{ color: 'white' }}>Send post message from react native</Text>
//                 </TouchableHighlight> */}
//                 <WebView
//                     style={{ flex: 1 }}
//                     startInLoadingState={true}
//                     originWhitelist={['*']}
//                     source={{ uri: this.state.url }}
//                 />
//             </View>
//         );
//     }
// }

// AppRegistry.registerComponent('Home', () => Home);