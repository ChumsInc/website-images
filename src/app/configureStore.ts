import {combineReducers} from "redux";
import {default as filesReducer} from '../features/files';
import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {default as alertsReducer} from "chums-connected-components/dist/alerts";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    files: filesReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['app/files/sendFile/pending', 'app/files/sendFile/fulfilled', 'app/files/sendFile/rejected', ],
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
