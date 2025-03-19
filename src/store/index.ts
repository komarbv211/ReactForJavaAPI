import { configureStore } from '@reduxjs/toolkit';
import { apiCategory } from '../services/apiCategory.ts';
import { apiProduct } from '../services/apiProduct.ts';
import { authApi } from '../services/authApi.ts';

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer, 
        [authApi.reducerPath]: authApi.reducer, 
     
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        apiCategory.middleware, 
        apiProduct.middleware,
        authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
