import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    authData: {}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.authData = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    const data = await authAPI.login(email, password)
    return data
})

/* export const { } = authSlice.actions */

export default authSlice.reducer