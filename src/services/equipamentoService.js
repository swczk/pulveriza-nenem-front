import api from './api'

export const equipamentoService = {
   async getAll(page = 0, size = 10) {
      const response = await api.get(`/api/equipamentos?page=${page}&size=${size}`)
      return response.data
   },

   async getById(id) {
      const response = await api.get(`/api/equipamentos/${id}`)
      return response.data
   },

   async create(data) {
      const response = await api.post('/api/equipamentos', data)
      return response.data
   },

   async update(id, data) {
      const response = await api.put(`/api/equipamentos/${id}`, data)
      return response.data
   },

   async delete(id) {
      await api.delete(`/api/equipamentos/${id}`)
   }
}
