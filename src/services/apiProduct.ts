import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env/index.ts";
import { IProductItem, IProductPostRequest, IProductPutRequest } from './types.ts';
import {serialize} from "object-to-formdata";


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
        createProduct:builder.mutation<IProductItem, IProductPostRequest>({
            query: (model) => ({
                url: 'products',
                method: 'POST',
                body: serialize(model),
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<IProductItem, IProductPutRequest>({
            query: ({ id, ...updateProduct }) => {
                            try {
                                const formData = serialize(updateProduct);
                                return {
                                    url: `products/${id}`,
                                    method: 'PUT', 
                                    body: formData,
                                };
                            } catch {
                                throw new Error("Error serializing the form data.");
                            }
                        },
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