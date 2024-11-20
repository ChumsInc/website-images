import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import filesReducer from '../features/files/index';
import alertsReducer from "../features/alerts";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    files: filesReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                'files/sendFile/pending', 'files/sendFile/fulfilled', 'files/sendFile/rejected',
                'files/sendFiles/pending', 'files/sendFiles/fulfilled', 'files/sendFiles/rejected' ],
            ignoredActionPaths: ['payload.error'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
