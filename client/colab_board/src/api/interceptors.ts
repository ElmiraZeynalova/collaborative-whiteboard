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

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry &&
            !originalRequest.url?.includes('/api/auth/refresh')
        ) {
            originalRequest._isRetry = true

            try {
                const { data } = await apiClient.get('/api/auth/refresh')

                localStorage.setItem('accessToken', data.accessToken)

                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`

                return apiClient.request(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                window.dispatchEvent(new Event('auth:logout'))
                throw refreshError
            }
        }

        throw error
    }
)