import axios from 'axios'

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || '/api',
   timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token')
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }
      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

// Response interceptor
api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true

         try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
               const authApi = axios.create({
                  baseURL: import.meta.env.VITE_AUTH_URL || '/auth'
               })

               const idToken = localStorage.getItem('idToken')
               const username = localStorage.getItem('username')
               const response = await authApi.post('/refresh', { 
                  refreshToken, 
                  idToken, 
                  username 
               })
               const newToken = response.data.token

               localStorage.setItem('token', newToken)
               api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
               originalRequest.headers.Authorization = `Bearer ${newToken}`

               return api(originalRequest)
            }
         } catch (refreshError) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
         }
      }

      return Promise.reject(error)
   }
)

export default api
