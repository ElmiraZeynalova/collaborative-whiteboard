import {apiClient} from './client'

apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken")


    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    
    async (error) => {
        const originalRequest = error.config
        if(error.response.status == 401 && error.config && !error.config._isRetry){
            originalRequest._isRetry = true
            try{
                const {data} = await apiClient.get("/api/auth/refresh")
                localStorage.setItem("accessToken", data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return apiClient.request(originalRequest)
            }catch(e){
                localStorage.removeItem("accessToken")
            }
        }
        throw error
    }
)