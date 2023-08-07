import axios, { AxiosResponse } from 'axios'
import { ICustomer } from '../models/common/customer.interface'
import { IUserNameResponse } from '../models/responses/userName.interface'
import { ILoginResponse, IUserData } from '../models/responses/login.interface'

export const API_URL = 'http://3.65.149.62/test-api/'

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use((config) => {
    const access = localStorage.getItem('access_token')

    if (access) {
        config.headers.Authorization = `Bearer ${access}`
    }

    return config
})

instance.interceptors.response.use((config) => {
    return config
}, async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await instance.post<{ accessToken: string }>('auth/refresh-tokens', {
                'token': localStorage.getItem('refresh_token'),
            })
            localStorage.setItem('access_token', response.data.accessToken)
            return instance.request(originalRequest)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    }
    throw error
})

export const authAPI = {
    async login(email: string, password: string): Promise<ILoginResponse> {
        const response: AxiosResponse<ILoginResponse> = await instance.post<ILoginResponse>('auth/login', {
            'email': email,
            'password': password,
        })
        return response.data
    },
    async logout(): Promise<void> {
        await instance.post('auth/logout', {
            'token': localStorage.getItem('refresh_token'),
        })
    },
    async changeUserCreds(name: string, surname: string): Promise<IUserData> {
        const response = await instance.put<IUserData>('profile', {
            'firstName': name,
            'lastName': surname,
        })
        return response.data
    },
}

export interface ICustomersParams {
    searchValue: string;
    selectLocValue: string;
    selectIndValue: string;
    from: number;
    to: number;
}

export const filterAPI = {
    async findCustomers({ searchValue, selectLocValue, selectIndValue, from, to }: ICustomersParams): Promise<{ data: ICustomer[], total: number }> {
        // eslint-disable-next-line max-len
        const response: AxiosResponse<ICustomer[]> = await instance.get<ICustomer[]>
            (`contacts?range=[${from},${Number(to) - 1}]&filter={"job_title":${searchValue ? '"' + searchValue + '"' : '""'},"country":${selectLocValue ? selectLocValue : '""'},"industry":${selectIndValue ? selectIndValue : '""'}}`)
        const splitArr: string[] = response.headers['content-range'].split('/')

        return {
            data: response.data,
            total: Number(splitArr[1]),
        }
    },
    async getUserName(id: string): Promise<IUserNameResponse> {
        const response: AxiosResponse<IUserNameResponse> =
            await instance.post<IUserNameResponse>(`contacts/${id}/open?contactId=${id}`)
        return response.data
    },
}
