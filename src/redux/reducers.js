import { SET_DEVICE_ID } from "./actions";
import { SET_USER_INFO } from "./actions";

const initialState = {
    deviceId: "",
    user_info: {}
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DEVICE_ID:
            return { ...state, deviceId: action.payload };
        case SET_USER_INFO:
            return { ...state, user_info: action.payload };
        default:
            return state;
    }
};

export default userReducer;
