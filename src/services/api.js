import axios from 'axios'

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || '/api',
   timeout: 10000
})

console.log('🔧 Configuração da API:')
console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🌐 VITE_AUTH_URL:', import.meta.env.VITE_AUTH_URL)
console.log('🌐 Base URL configurada:', api.defaults.baseURL)

// Request interceptor
api.interceptors.request.use(
   (config) => {
      console.log('🚀 Interceptando requisição:')
      console.log('🌐 URL:', config.baseURL + config.url)
      console.log('📋 Método:', config.method?.toUpperCase())
      console.log('📄 Headers antes:', config.headers)
      
      // Garantir que Content-Type está definido para requisições POST/PUT
      if ((config.method === 'post' || config.method === 'put') && config.data) {
         if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
            console.log('✅ Content-Type definido como application/json')
         }
      }
      
      const token = localStorage.getItem('token')
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
         console.log('🔑 Token adicionado aos headers')
      } else {
         console.log('⚠️ Nenhum token encontrado no localStorage')
      }
      
      console.log('📄 Headers depois:', config.headers)
      console.log('📋 Data:', config.data)
      
      return config
   },
   (error) => {
      console.error('❌ Erro no interceptor de request:', error)
      return Promise.reject(error)
   }
)

// Response interceptor
api.interceptors.response.use(
   (response) => {
      console.log('✅ Resposta recebida:')
      console.log('🔢 Status:', response.status)
      console.log('🌐 URL:', response.config.url)
      console.log('📄 Data:', response.data)
      return response
   },
   async (error) => {
      console.error('❌ Erro na resposta:')
      console.error('🔢 Status:', error.response?.status)
      console.error('🌐 URL:', error.config?.url)
      console.error('📄 Error data:', error.response?.data)
      console.error('📄 Error message:', error.message)
      
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
         console.log('🔄 Tentando refresh do token...')
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

               console.log('✅ Token refreshed com sucesso!')
               localStorage.setItem('token', newToken)
               api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
               originalRequest.headers.Authorization = `Bearer ${newToken}`

               return api(originalRequest)
            }
         } catch (refreshError) {
            console.error('❌ Erro ao fazer refresh do token:', refreshError)
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
         }
      }

      return Promise.reject(error)
   }
)

export default api
