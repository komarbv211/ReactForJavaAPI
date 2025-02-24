import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env/index.ts";
import { IProductItem, IProductPostRequest, IProductPutRequest } from './types.ts';


// Define the API slice
export const apiProduct = createApi({
    reducerPath: 'product',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}` }), 
    tagTypes: ["Product"], 
    endpoints: (builder) => ({
        getProducts: builder.query<IProductItem[], void>({
            query: () => 'products', 
            providesTags: ["Product"],
        }),
        getProduct: builder.query<IProductItem, number>({
            query: (id) => `products/${id}`,
            providesTags: (_, __, id) => [{ type: 'Product', id }],
        }),
        createProduct:builder.mutation<IProductPostRequest, FormData>({
            query: (formData) => ({
                url: 'products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ["Product"], 
        }),
        updateProduct: builder.mutation<IProductPutRequest, FormData>({
            query: ( formData) => ({
                url: `products/${formData.get("id")}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Product"],
        }),

    }),
});
export const { 
  useGetProductsQuery, 
  useGetProductQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} = apiProduct;