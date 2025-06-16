import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
   state: () => ({
      user: null,
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
      idToken: localStorage.getItem('idToken'),
      username: localStorage.getItem('username')
   }),

   getters: {
      isAuthenticated: (state) => !!state.token,
      isAdmin: (state) => state.user?.role === 'ADMIN'
   },

   actions: {
      async login(credentials) {
         try {
            const response = await api.post('/auth/login', {
               username: credentials.email,
               password: credentials.password
            })

            this.token = response.data.token
            this.refreshToken = response.data.refreshToken
            this.idToken = response.data.idToken
            this.username = credentials.email
            this.user = response.data.user

            localStorage.setItem('token', this.token)
            localStorage.setItem('refreshToken', this.refreshToken)
            localStorage.setItem('idToken', this.idToken)
            localStorage.setItem('username', this.username)

            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

            return response.data
         } catch (error) {
            throw error
         }
      },

      async logout() {
         this.user = null
         this.token = null
         this.refreshToken = null
         this.idToken = null
         this.username = null

         localStorage.removeItem('token')
         localStorage.removeItem('refreshToken')
         localStorage.removeItem('idToken')
         localStorage.removeItem('username')

         delete api.defaults.headers.common['Authorization']
      },

      async refreshAuthToken() {
         try {
            const response = await api.post('/auth/refresh', {
               refreshToken: this.refreshToken,
               idToken: this.idToken,
               username: this.username
            })

            this.token = response.data.token
            localStorage.setItem('token', this.token)
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

            return response.data
         } catch (error) {
            this.logout()
            throw error
         }
      },

      initializeAuth() {
         if (this.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
         }
      }
   }
})
