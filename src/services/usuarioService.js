import api from './api'

export const usuarioService = {
   async getAll(page = 0, size = 10) {
      const response = await api.get(`/api/usuarios?page=${page}&size=${size}`)
      return response.data
   },

   async getById(id) {
      const response = await api.get(`/api/usuarios/${id}`)
      return response.data
   },

   async create(data) {
      const response = await api.post('/api/usuarios', data)
      return response.data
   },

   async update(id, data) {
      const response = await api.put(`/api/usuarios/${id}`, data)
      return response.data
   },

   async delete(id) {
      await api.delete(`/api/usuarios/${id}`)
   },

   async updateStatus(id, ativo) {
      const response = await api.patch(`/api/usuarios/${id}/status`, { ativo })
      return response.data
   }
}
