import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../env";
import {IUserLoginRequest, IUserRegisterRequest, IAuthResponse} from "../pages/auth/types.ts";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}auth/` }),
    tagTypes: ["AuthUser"],
    endpoints: (builder) => ({
        registerUser: builder.mutation<void, IUserRegisterRequest>({
            query: (userRegister) => ({
                url: "register",
                method: "POST",
                body: userRegister,
            }),
        }),
          
        loginUser: builder.mutation<IAuthResponse, IUserLoginRequest>({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: {
                    username: data.username, 
                    password: data.password
                },
            }),
        }),
        
        loginGoogle: builder.mutation<IAuthResponse, { token: string }>({
            query: (googleToken) => ({
                url: "google",
                method: "POST",
                body: googleToken,
            }),
        })
    }),
});

export const {useRegisterUserMutation, useLoginUserMutation, useLoginGoogleMutation} = authApi;