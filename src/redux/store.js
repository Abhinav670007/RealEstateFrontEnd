import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  userSlice from "./userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({user:userSlice})

const persistConfig={
    key:'root',
    storage,
    version:1
}

const persisistReducer = persistReducer(persistConfig , rootReducer)


export  const store = configureStore({
    reducer:persisistReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
    })
})

export const persistor = persistStore(store)