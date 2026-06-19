import { configureStore } from "@reduxjs/toolkit";
import { apiSlice as api } from "./apiSlice";
import rootReducer from "./rootReducer";
import type { RootState } from "./rootReducer";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: import.meta.env.DEV,
});

export type { RootState };
export type AppDispatch = typeof store.dispatch;
