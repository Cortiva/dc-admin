import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import rootReducer from "./rootReducer";

const nodeEnv = import.meta.env.NODE_ENV;

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: nodeEnv !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
