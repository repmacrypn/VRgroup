import { createSlice, createAsyncThunk, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { ICustomersParams, filterAPI } from '../api/api'
import { ICustomer } from '../models/common/customer.interface'
import { IRecentsArray } from '../models/common/recentsArray.interface'
import { IUserNameResponse } from '../models/responses/userName.interface'
import { ISearchData } from '../models/common/searchData.interface'
import { StatusType } from '../models/common/status.type'

interface IFIlterState {
    status: StatusType;
    customers: ICustomer[];
    recentSearchArray: IRecentsArray[];
    usersFullNameArray: IUserNameResponse[];
    totalCount: number | null;
    itemsPerPage: number;
    isPopUpVisible: boolean;
    pageNumber: number;
    isFiltersClear: boolean;
    currentUser: ICustomer;
    isShortInfoVisible: boolean;
    filterData: ISearchData;
}

const initialState: IFIlterState = {
    status: 'idle',
    customers: [],
    recentSearchArray: [],
    usersFullNameArray: [],
    totalCount: null,
    itemsPerPage: 12,
    isPopUpVisible: false,
    pageNumber: 0,
    filterData: {
        searchValue: '',
        selectLocValue: '',
        selectIndValue: '',
    },
    isFiltersClear: false,
    currentUser: {} as ICustomer,
    isShortInfoVisible: false,
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        showPopUp: (state, action: PayloadAction<boolean>) => {
            state.isPopUpVisible = action.payload
        },
        addRecentSearch: (state, action: PayloadAction<IRecentsArray>) => {
            const currentDataObj = action.payload
            const array: IRecentsArray[] = state.recentSearchArray
            const isInArray = array.find((dataObj: IRecentsArray) => {
                return dataObj.searchValue === currentDataObj.searchValue &&
                    dataObj.locIndex === currentDataObj.locIndex &&
                    dataObj.indIndex === currentDataObj.indIndex
            })

            if (!isInArray) {
                if (array.length === 4) array.shift()
                array.push(action.payload)
            }
        },
        clearCustomers: (state) => {
            state.customers.length = 0
            state.totalCount = null
        },
        setPageNumber: (state, action: PayloadAction<number>) => {
            state.pageNumber = action.payload
        },
        setFilterData: (state, action: PayloadAction<ISearchData>) => {
            state.filterData = action.payload
        },
        setCurrentUser: (state, action: PayloadAction<ICustomer>) => {
            state.currentUser = action.payload
        },
        setIsVisible: (state, action: PayloadAction<boolean>) => {
            state.isShortInfoVisible = action.payload
        },
        clearFilters: (state) => {
            state.isFiltersClear = !state.isFiltersClear
        },
    },
    extraReducers(builder) {
        builder
            .addCase(findCustomers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(findCustomers.fulfilled, (state, action: PayloadAction<{ data: ICustomer[]; total: number; }>) => {
                const { data, total } = action.payload
                state.status = 'succeeded'
                state.customers = data
                state.totalCount = total
            })
            .addCase(getUserName.fulfilled, (state, action: PayloadAction<IUserNameResponse>) => {
                state.status = 'succeeded'
                state.usersFullNameArray.push(action.payload)
            })
    },
})

export const findCustomers = createAsyncThunk('filter/findCustomers',
    async (apiObj: ICustomersParams) => {
        return await filterAPI.findCustomers(apiObj)
    })

export const getUserName = createAsyncThunk('filter/getUserName', async (userId: string) => {
    const data: IUserNameResponse = await filterAPI.getUserName(userId)
    const regExp = /(?=[A-Z])/g
    const namesArr = data.userName.split(regExp)
    const resultString = namesArr.join(' ')

    return { userId, userName: resultString }
})

export const selectUserName = (state: RootState, userId: string) =>
    state.filter.usersFullNameArray.find((obj: IUserNameResponse) => obj.userId === userId)?.userName

export const status = (state: RootState) => state.filter.status
export const selectIsPopUpVisible = (state: RootState) => state.filter.isPopUpVisible
export const selectIsShortInfoVisible = (state: RootState) => state.filter.isShortInfoVisible

export const { showPopUp, addRecentSearch, setCurrentUser, setIsVisible, clearFilters,
    clearCustomers, setPageNumber, setFilterData } = filterSlice.actions

export default filterSlice.reducer