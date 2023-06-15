import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    userData: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.userData = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded'
                state.userData = null
            })
    }
})

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    const data = await authAPI.login(email, password)

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)

    return data.user
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authAPI.logout()
})

export const selectIsAuth = (state) => state.auth.userData

/* export const { } = authSlice.actions */

export default authSlice.reducer