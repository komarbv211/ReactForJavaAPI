import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_ENV } from "../env";
import { IPhotoUserPutRequest } from "./types.ts";

export const apiUser = createApi({
    reducerPath: 'apiUser',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}auth` }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        // Отримання фото користувача
        getPhotoUser: builder.query<{ photo: string }, number>({
            query: (id) => ({
                url: `users/${id}/photo`,
                method: 'GET'
            }),
            providesTags: ["User"]
        }),
        // Існуючі методи
        createPhotoUser: builder.mutation<void, IPhotoUserPutRequest>({
            query: ({ userId, photo }) => {
                const formData = new FormData();
                formData.append("photo", photo);
                formData.append("userId", userId.toString());
            
                return {
                    url: `${userId}/photo`,
                    method: "POST",
                    body: formData,
                };
            },            
            invalidatesTags: ["User"],
        }),
        removePhotoUser: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `${id}/photo`,
                method: 'DELETE',
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

// Експорт хуків
export const {
    useGetPhotoUserQuery,
    useCreatePhotoUserMutation,
    useRemovePhotoUserMutation 
} = apiUser;