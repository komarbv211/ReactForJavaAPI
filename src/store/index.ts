import { configureStore } from '@reduxjs/toolkit';
import { apiCategory } from '../services/apiCategory.ts';
import { apiProduct } from '../services/apiProduct.ts';
import {authApi} from "../services/authApi.ts";
import userReducer from './slices/userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiUser } from '../services/apiUser.ts';

export const store = configureStore({
    reducer: {
        user: userReducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiCategory.middleware, 
            apiProduct.middleware,
            authApi.middleware,
            apiUser.middleware
        ), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector