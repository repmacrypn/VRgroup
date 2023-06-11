import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { filterAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    totalCount: 0,
    currentPage: 0,
    customers: [],
    countries: [],
    industries: []
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(findCustomers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(findCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.customers = action.payload
            })
            .addCase(findCustomers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.countries = action.payload
            })
            .addCase(fetchIndustries.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.industries = action.payload
            })
    }
})

export const fetchCountries = createAsyncThunk('filter/fetchCountries', async () => {
    return await filterAPI.fetchCountries()
})

export const fetchIndustries = createAsyncThunk('filter/fetchIndustries', async () => {
    return await filterAPI.fetchIndustries()
})

export const findCustomers = createAsyncThunk('filter/findCustomers',
    async ({ searchValue, selectLocValue, selectIndValue }) => {
        return await filterAPI.findCustomers(searchValue, selectLocValue, selectIndValue)
    })

/* export const { } = filterSlice.actions */

export default filterSlice.reducer