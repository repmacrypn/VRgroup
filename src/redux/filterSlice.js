import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { filterAPI } from '../api/api'

const initialState = {
    status: 'idle',
    error: null,
    customers: [],
    countries: [],
    industries: [],
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
    currentUser: {},
    isShortInfoVisible: false,
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        showPopUp: (state, action) => {
            state.isPopUpVisible = action.payload
        },
        addRecentSearch: {
            reducer(state, action) {
                const currentDataObj = action.payload
                const array = state.recentSearchArray
                const isInArray = array.find(dataObj => {
                    return dataObj.searchValue === currentDataObj.searchValue &&
                        dataObj.locIndex === currentDataObj.locIndex &&
                        dataObj.indIndex === currentDataObj.indIndex
                })

                if (!isInArray) {
                    if (array.length === 4) array.shift()
                    array.push(action.payload)
                }
            },
            prepare(payloadObj) {
                return {
                    payload: {
                        id: nanoid(),
                        ...payloadObj,
                    },
                }
            },
        },
        clearCustomers: (state) => {
            state.customers.length = 0
            state.totalCount = null
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        setIsVisible: (state, action) => {
            state.isShortInfoVisible = action.payload
        },
    },
    extraReducers(builder) {
        builder
            .addCase(findCustomers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(findCustomers.fulfilled, (state, action) => {
                const { data, total } = action.payload
                state.status = 'succeeded'
                state.customers = data
                state.totalCount = total
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
            .addCase(getUserName.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.usersFullNameArray.push(action.payload)
            })
    },
})

export const fetchCountries = createAsyncThunk('filter/fetchCountries', async () => {
    return await filterAPI.fetchCountries()
})

export const fetchIndustries = createAsyncThunk('filter/fetchIndustries', async () => {
    return await filterAPI.fetchIndustries()
})

export const findCustomers = createAsyncThunk('filter/findCustomers',
    async (apiObj) => {
        return await filterAPI.findCustomers(apiObj)
    })

export const getUserName = createAsyncThunk('filter/getUserName', async (userId) => {
    const data = await filterAPI.getUserName(userId)
    const regExp = /(?=[A-Z])/g
    const namesArr = data.split(regExp)
    const resultString = namesArr.join(' ')

    return { userId, userName: resultString }
})

export const selectUserName = (state, userId) =>
    state.filter.usersFullNameArray.find(obj => obj.userId === userId)?.userName
export const status = (state) => state.filter.status

export const { showPopUp, addRecentSearch, setCurrentUser, setIsVisible,
    clearCustomers, setPageNumber, setFilterData } = filterSlice.actions

export default filterSlice.reducer