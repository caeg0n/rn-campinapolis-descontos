import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist'

const rootReducer = combineReducers({ userReducer });

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    timeout: null
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const Store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(Store)
