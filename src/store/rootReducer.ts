import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import type { UnknownAction } from "redux";
import authReducer from "../modules/auth/authSlice";

export type RootState = ReturnType<typeof appReducer>;

// Combine all reducers in the app
const appReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
});

// Create a root reducer that handles the reset action
const rootReducer = (state: RootState | undefined, action: UnknownAction) => {
    if (action.type === "auth/logout") {
        // Reset the state to undefined to clear all data
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
