import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../../utils/baseURL.js";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${getBaseURL()}/api/orders`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: '/',
                method: 'POST',
                body: newOrder,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders'],
        }),
        getOrdersByEmail: builder.query({
            query: (email) => `/email/${email}`,
            providesTags: ['Orders'],
        }),
        updateOrder: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updateData,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders'],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `/${id}/cancel`,
                method: 'POST',
                credentials: 'include',
            }),
            invalidatesTags: ['Orders'],
        }),
        // Admin endpoints
        getAllOrders: builder.query({
            query: () => '/',
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Orders'],
        }),
        bulkUpdateOrderStatus: builder.mutation({
            query: ({ orderIds, status }) => ({
                url: '/bulk-update',
                method: 'PATCH',
                body: { orderIds, status },
            }),
            invalidatesTags: ['Orders'],
        }),
    })
});

export const { 
    useCreateOrderMutation, 
    useGetOrdersByEmailQuery,
    useUpdateOrderMutation,
    useCancelOrderMutation,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useBulkUpdateOrderStatusMutation
} = ordersApi;
export default ordersApi;