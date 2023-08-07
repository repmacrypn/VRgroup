import axios from 'axios'

export const API_URL = 'https://cors-anywhere.herokuapp.com/http://3.65.149.62/test-api/'
/* export const API_URL = 'http://3.65.149.62/test-api/' */

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
            const response = await instance.post('auth/refresh-tokens', {
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
    async login(email, password) {
        const response = await instance.post('auth/login', {
            'email': email,
            'password': password,
        })
        return response.data
    },
    async logout() {
        const response = await instance.post('auth/logout', {
            'token': localStorage.getItem('refresh_token'),
        })
        return response.data

    },
    async changeUserCreds(name, surname) {
        const response = await instance.put('profile', {
            'firstName': name,
            'lastName': surname,
        })
        return response.data
    },
}

export const filterAPI = {
    async findCustomers({ searchValue, selectLocValue, selectIndValue, from, to }) {
        // eslint-disable-next-line max-len
        const response = await instance.get(`contacts?range=[${from},${Number(to) - 1}]&filter={"job_title":${searchValue ? '"' + searchValue + '"' : '""'},"country":${selectLocValue ? selectLocValue : '""'},"industry":${selectIndValue ? selectIndValue : '""'}}`)
        const splitArr = response.headers['content-range'].split('/')

        return {
            data: response.data,
            total: splitArr[1],
        }
    },
    async fetchIndustries() {
        const response = await instance.get('contacts/industries')
        return response.data
    },
    async fetchCountries() {
        const response = await instance.get('contacts/countries')
        return response.data
    },
    async getUserName(id) {
        const response = await instance.post(`contacts/${id}/open?contactId=${id}`)
        return response.data
    },
}
