import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseURL from '../../../utils/baseURL'

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/contacts`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const contactsApi = createApi({
    reducerPath: 'contactsApi',
    baseQuery,
    tagTypes: ['Contacts'],
    endpoints: (builder) => ({
        // Public endpoint - Create contact request (no auth needed)
        createContact: builder.mutation({
            query: (contactData) => ({
                url: '/',
                method: 'POST',
                body: contactData,
            }),
        }),
        
        // Admin endpoints - require authentication
        fetchAllContacts: builder.query({
            query: (status) => status ? `/?status=${status}` : '/',
            providesTags: ['Contacts'],   
        }),
        fetchContactById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Contacts'],
        }),
        fetchContactStats: builder.query({
            query: () => '/stats',
            providesTags: ['Contacts'],
        }),
        updateContact: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Contacts'], 
        }),
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Contacts'], 
        }),
    }),
});

export const {
    useCreateContactMutation,
    useFetchAllContactsQuery,
    useFetchContactByIdQuery,
    useFetchContactStatsQuery,
    useUpdateContactMutation,
    useDeleteContactMutation,
} = contactsApi;

export default contactsApi;
