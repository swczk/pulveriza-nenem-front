import api from './api'

export const aplicacaoService = {
   async getAll(page = 0, size = 10) {
      const response = await api.get(`/api/aplicacoes?page=${page}&size=${size}`)
      return response.data
   },

   async getById(id) {
      const response = await api.get(`/api/aplicacoes/${id}`)
      return response.data
   },

   async create(data) {
      const response = await api.post('/api/aplicacoes', data)
      return response.data
   },

   async update(id, data) {
      const response = await api.put(`/api/aplicacoes/${id}`, data)
      return response.data
   },

   async delete(id) {
      await api.delete(`/api/aplicacoes/${id}`)
   },

   async updateStatus(id, finalizada) {
      const response = await api.patch(`/api/aplicacoes/${id}/status`, { finalizada })
      return response.data
   },

   async getByTalhao(talhaoId, page = 0, size = 10) {
      const response = await api.get(`/api/aplicacoes/talhao/${talhaoId}?page=${page}&size=${size}`)
      return response.data
   }
}
