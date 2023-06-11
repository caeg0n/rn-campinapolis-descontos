import { DEV_API_BASE, PROD_API_BASE } from "@env";

export const SET_DEVICE_ID = "SET_DEVICE_ID";
export const SET_USER_INFO = "SET_USER_INFO";

if (__DEV__) {
    // var UUID_URL = DEV_API_BASE + "/is_registered";
} else {
    // var UUID_URL = PROD_API_BASE + "/is_registered";
}


export const setDeviceId = (uuid) => (dispatch) => {
    dispatch({
        type: SET_DEVICE_ID,
        payload: uuid,
    });
};

export const setUserInfo = (info) => (dispatch) => {
    dispatch({
        type: SET_USER_INFO,
        payload: info,
    });
};
