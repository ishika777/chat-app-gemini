import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    PAUSE,
    REHYDRATE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Ensure this is correctly imported

import userReducer from './user-slice';
import projectReducer from './project-slice';

const persistConfig = {
    key: "root", // Key for storing data in local storage
    version: 1, // Version of the persisted state
    storage // Local storage to persist the state
};

const rootReducer = combineReducers({
    user: userReducer,
    project: projectReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore specific actions
            },
        }),
});

export default store;
