import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {ICategoryItem, ICategoryPostRequest, ICategoryPutRequest} from "./types.ts";
import {serialize} from "object-to-formdata";


export const apiCategory = createApi({
    reducerPath: 'category',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}` }), 
    tagTypes: ["Category"], 
    endpoints: (builder) => ({
        getCategories: builder.query<ICategoryItem[], void>({
            query: () => 'categories', 
            providesTags: ["Category"], 
        }),
        getCategory: builder.query<ICategoryItem, number>({
            query: (id) => `categories/${id}`,
            providesTags: (_, __, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation<ICategoryItem, ICategoryPostRequest>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: 'categories',
                        method: 'POST',
                        body: formData,
                    }
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation<ICategoryItem, ICategoryPutRequest>({
            query: ({ id, ...updatedCategory }) => {
                try {
                    const formData = serialize(updatedCategory);
                    return {
                        url: `categories/${id}`,
                        method: 'PUT', 
                        body: formData,
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Category"],
        }),
        
        deleteCategory: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Category"],
        }),

    }),
});

// Export the auto-generated hook
export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation, } = apiCategory;