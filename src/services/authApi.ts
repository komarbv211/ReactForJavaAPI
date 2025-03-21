// Створюємо API Slice
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../env";
import {AuthResponse, IUserLoginRequest, IUserRegisterRequest, LoginGoogleRequest} from "../pages/auth/types.ts";
import {setCredentials} from "../store/slices/userSlice.ts";


export const authApi = createApi({
    reducerPath: 'authApi', // Унікальний шлях для цього API у Redux Store
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}auth` }), // Базовий URL
    tagTypes: ["AuthUser"], // Додаємо tag для категорій
    endpoints: (builder) => ({

        registerUser: builder.mutation<void, IUserRegisterRequest>({
            query: (userRegister) => ({
                url: "register",
                method: "POST",
                body: userRegister,
            }),
            //invalidatesTags: ["AuthUser"], // Інвалідовуємо "Category" після створення
        }),
        loginUser: builder.mutation<AuthResponse, IUserLoginRequest>({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: {
                    username: data.username, 
                    password: data.password
                },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Auth user", arg);
                    if (result.data && result.data.token) {
                        dispatch(setCredentials({ token: result.data.token }));

                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        googleLoginUser: builder.mutation<AuthResponse, LoginGoogleRequest>({
            query: (userGoogle) => ({
                url: "google",
                method: "POST",
                body: userGoogle,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Google auth user", arg);
                    if (result.data && result.data.token) {
                        dispatch(setCredentials({ token: result.data.token }));

                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
    }),
});

// Автоматично згенерований хук
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginUserMutation } = authApi;