import { configureStore } from '@reduxjs/toolkit';
import { apiCategory } from '../services/apiCategory.ts';
import { apiProduct } from '../services/apiProduct.ts';
import {authApi} from "../services/authApi.ts";
import userReducer from './slices/userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        user: userReducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer,
        [authApi.reducerPath]: authApi.reducer, // Додаємо API reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, apiProduct.middleware,
            authApi.middleware), // Додаємо API middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector