import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    userData: null,
    isAuth: false,
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
                state.isAuth = true
            })
            .addCase(login.rejected, (state, action) => {
                let errorMessage = action.error.message

                if (errorMessage === 'Cannot read properties of undefined (reading \'data\')') {
                    errorMessage = 'Bad internet connection. Try again later'
                }

                state.status = 'failed'
                state.error = errorMessage
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded'
                state.error = null
                state.userData = null
                state.isAuth = false
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

export const selectIsAuth = (state) => state.auth.isAuth
export const selectUserData = (state) => state.auth.userData
export const status = (state) => state.auth.status

export default authSlice.reducer