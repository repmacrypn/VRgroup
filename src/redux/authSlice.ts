import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { RootState } from './store'
import { authAPI } from '../api/api'
import { ILoginResponse, IUserData } from '../models/responses/login.interface'
import { StatusType } from '../models/common/status.type'

interface IAuthState {
    status: StatusType;
    userData: IUserData | null;
    isAuth: boolean;
    error: string | null;
}

const initialState: IAuthState = {
    status: 'idle',
    error: null,
    userData: null,
    isAuth: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<IUserData>) => {
                state.status = 'succeeded'
                state.userData = action.payload
                state.isAuth = true
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                let errorMessage = action.error.message
                if (errorMessage) state.error = errorMessage
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
            .addCase(changeUserCreds.fulfilled, (state, action: PayloadAction<IUserData>) => {
                state.status = 'succeeded'
                state.userData = action.payload
            })
    },
})

interface ILoginParams {
    email: string;
    password: string;
}

export const login = createAsyncThunk('auth/login', async ({ email, password }: ILoginParams) => {
    const data: ILoginResponse = await authAPI.login(email, password)

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)

    return data.user
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authAPI.logout()
})

export const changeUserCreds = createAsyncThunk('auth/changeUserCreds', async ({ firstName, lastName }: IUserData) => {
    return await authAPI.changeUserCreds(firstName, lastName)
})

export const selectIsAuth = (state: RootState) => state.auth.isAuth
export const selectUserData = (state: RootState) => state.auth.userData
export const status = (state: RootState) => state.auth.status

export default authSlice.reducer