import axios from "axios"

export const API_URL = 'http://3.65.149.62/test-api/'

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
            const response = await instance.post(`auth/refresh_tokens`, {
                "token": localStorage.getItem('refresh_token')
            })
            localStorage.setItem('access_token', response.data.accessToken)
            return instance.request(originalRequest)
        } catch (e) {
            console.log(e)
        }
    }
    throw error
})

export const authAPI = {
    async login(email, password) {
        try {
            const response = await instance.post(`auth/login`, {
                "email": email,
                "password": password
            });
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    }
}

export const filterAPI = {
    async findCustomers(jobTitle, country, industry) {
        try {
            const response = await instance.get(`contacts?range=[0,11]&filter={"job_title":${jobTitle ? jobTitle : '""'},"country":${country ? country : '""'},"industry":${industry ? industry : '""'}}`)
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    },
    async fetchIndustries() {
        try {
            const response = await instance.get(`contacts/industries`);
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    },
    async fetchCountries() {
        try {
            const response = await instance.get(`contacts/countries`);
            return response.data
        } catch (e) {
            throw new Error(e.response.data.message)
        }
    }
}
