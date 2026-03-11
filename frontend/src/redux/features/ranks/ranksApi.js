import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/ranks`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const ranksApi = createApi({
    reducerPath: 'ranksApi',
    baseQuery,
    tagTypes: ['Ranks'],
    endpoints: (builder) => ({
        // Get all ranks (public)
        fetchAllRanks: builder.query({
            query: () => '/',
            providesTags: ['Ranks']
        }),
        
        // Get rank by ID
        fetchRankById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Ranks']
        }),
        
        // Get rank by points
        fetchRankByPoints: builder.query({
            query: (points) => `/by-points?points=${points}`,
            providesTags: ['Ranks']
        }),
        
        // Initialize default ranks (admin)
        initializeRanks: builder.mutation({
            query: () => ({
                url: '/initialize',
                method: 'POST'
            }),
            invalidatesTags: ['Ranks']
        }),
        
        // Create rank (admin)
        createRank: builder.mutation({
            query: (rankData) => ({
                url: '/',
                method: 'POST',
                body: rankData
            }),
            invalidatesTags: ['Ranks']
        }),
        
        // Update rank (admin)
        updateRank: builder.mutation({
            query: ({ id, ...rankData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: rankData
            }),
            invalidatesTags: ['Ranks']
        }),
        
        // Delete rank (admin)
        deleteRank: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Ranks']
        })
    })
});

export const {
    useFetchAllRanksQuery,
    useFetchRankByIdQuery,
    useFetchRankByPointsQuery,
    useInitializeRanksMutation,
    useCreateRankMutation,
    useUpdateRankMutation,
    useDeleteRankMutation
} = ranksApi;

export default ranksApi;
