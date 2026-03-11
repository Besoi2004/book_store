import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/coupons',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const couponsApi = createApi({
    reducerPath: 'couponsApi',
    baseQuery,
    tagTypes: ['Coupons'],
    endpoints: (builder) => ({
        fetchAllCoupons: builder.query({
            query: () => '/',
            providesTags: ['Coupons'],   
        }),
        fetchActiveCoupons: builder.query({
            query: () => '/active',
            providesTags: ['Coupons'],   
        }),
        validateCoupon: builder.query({
            query: (code) => `/validate/${code}`,
        }),
        applyCoupon: builder.mutation({
            query: (data) => ({
                url: '/apply',
                method: 'POST',
                body: data,
            }),
        }),
        createCoupon: builder.mutation({
            query: (newCoupon) => ({
                url: '/',
                method: 'POST',
                body: newCoupon,
            }),
            invalidatesTags: ['Coupons'], 
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Coupons'], 
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupons'], 
        }),
        toggleCouponStatus: builder.mutation({
            query: (id) => ({
                url: `/${id}/toggle`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Coupons'], 
        }),
    }),
});

export const { 
    useFetchAllCouponsQuery,
    useFetchActiveCouponsQuery,
    useValidateCouponQuery,
    useApplyCouponMutation,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponStatusMutation
} = couponsApi;

export default couponsApi;
