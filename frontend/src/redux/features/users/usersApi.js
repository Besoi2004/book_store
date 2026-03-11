import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/users',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        fetchAllUsers: builder.query({
            query: () => '/',
            providesTags: ['Users'],   
        }),
        fetchUserByEmail: builder.query({
            query: (email) => `/${email}`,
            providesTags: (result, error, email) => [{ type: 'Users', email }], 
        }),
        updateUserProfile: builder.mutation({
            query: ({ email, ...data }) => ({
                url: `/${email}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'], 
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/${id}/role`,
                method: 'PUT',
                body: { role },
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Users'], 
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'], 
        }),
        addRewardPoints: builder.mutation({
            query: ({ email, rewardPoints }) => ({
                url: `/${email}/rewardPoints`,
                method: 'PUT',
                body: { rewardPoints },
            }),
            invalidatesTags: ['Users'], 
        }),
        getUserFavorites: builder.query({
            query: (email) => `/${email}/favorites`,
            providesTags: (result, error, email) => [{ type: 'Users', email }], 
        }),
        toggleFavoriteBook: builder.mutation({
            query: ({ email, bookId }) => ({
                url: `/${email}/favorites/${bookId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Users'], 
        }),
        revealRankCoupon: builder.mutation({
            query: ({ email, rankId }) => ({
                url: `/${email}/reveal-rank-coupon`,
                method: 'POST',
                body: { rankId },
            }),
            invalidatesTags: ['Users'], 
        }),
    }),
});

export const { 
    useFetchAllUsersQuery,
    useFetchUserByEmailQuery,
    useUpdateUserProfileMutation,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useAddRewardPointsMutation,
    useGetUserFavoritesQuery,
    useToggleFavoriteBookMutation,
    useRevealRankCouponMutation
} = usersApi;

export default usersApi;
