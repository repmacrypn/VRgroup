import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import filterSlice from './filterSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        filter: filterSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch