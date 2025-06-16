import api from './api'

export const talhaoService = {
   async getAll(page = 0, size = 10) {
      const response = await api.get(`/api/talhoes?page=${page}&size=${size}`)
      return response.data
   },

   async getById(id) {
      const response = await api.get(`/api/talhoes/${id}`)
      return response.data
   },

   async create(data) {
      const response = await api.post('/api/talhoes', data)
      return response.data
   },

   async update(id, data) {
      const response = await api.put(`/api/talhoes/${id}`, data)
      return response.data
   },

   async delete(id) {
      await api.delete(`/api/talhoes/${id}`)
   }
}
