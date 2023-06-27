import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    userData: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
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
            .addCase(changeUserCreds.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(changeUserCreds.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.userData = action.payload
            })
    },
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

export const changeUserCreds = createAsyncThunk('auth/changeUserCreds', async ({ name, surname }) => {
    return await authAPI.changeUserCreds(name, surname)
})

export const selectIsAuth = (state) => state.auth.userData
export const status = (state) => state.auth.status

export default authSlice.reducer