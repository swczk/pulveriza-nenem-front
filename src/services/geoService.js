import axios from 'axios'

const graphqlApi = axios.create({
  baseURL: 'http://localhost:8081/graphql',
  headers: {
    'Content-Type': 'application/json',
  }
})

export const geoService = {
  async createGeoTrajetoria(aplicacaoId, geoData) {
    const mutation = `
      mutation CreateGeoTrajetoria($input: GeoTrajetoriaInput!) {
        createGeoTrajetoria(input: $input) {
          aplicacaoId
          pontoInicial {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          pontoFinal {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          trajetoria {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          areaCobertura
          distanciaPercorrida
          createdAt
          updatedAt
        }
      }
    `
    
    const variables = {
      input: {
        aplicacaoId,
        ...geoData
      }
    }

    const response = await graphqlApi.post('', {
      query: mutation,
      variables
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data.createGeoTrajetoria
  },

  async getGeoTrajetoria(aplicacaoId) {
    const query = `
      query GetGeoTrajetoria($aplicacaoId: String!) {
        geoTrajetoria(aplicacaoId: $aplicacaoId) {
          aplicacaoId
          pontoInicial {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          pontoFinal {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          trajetoria {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          areaCobertura
          distanciaPercorrida
          createdAt
          updatedAt
        }
      }
    `

    const variables = { aplicacaoId }

    const response = await graphqlApi.post('', {
      query,
      variables
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data.geoTrajetoria
  },

  async getAllGeoTrajetorias(limit = 10, offset = 0) {
    const query = `
      query GetGeoTrajetorias($limit: Int, $offset: Int) {
        geoTrajetorias(limit: $limit, offset: $offset) {
          aplicacaoId
          pontoInicial {
            latitude
            longitude
            timestamp
          }
          pontoFinal {
            latitude
            longitude
            timestamp
          }
          areaCobertura
          distanciaPercorrida
          createdAt
        }
      }
    `

    const variables = { limit, offset }

    const response = await graphqlApi.post('', {
      query,
      variables
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data.geoTrajetorias
  },

  async updateGeoTrajetoria(aplicacaoId, updateData) {
    const mutation = `
      mutation UpdateGeoTrajetoria($aplicacaoId: String!, $input: GeoTrajetoriaUpdateInput!) {
        updateGeoTrajetoria(aplicacaoId: $aplicacaoId, input: $input) {
          aplicacaoId
          pontoFinal {
            latitude
            longitude
            timestamp
            altitude
            speed
            accuracy
          }
          areaCobertura
          distanciaPercorrida
          updatedAt
        }
      }
    `

    const variables = {
      aplicacaoId,
      input: updateData
    }

    const response = await graphqlApi.post('', {
      query: mutation,
      variables
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data.updateGeoTrajetoria
  },

  async deleteGeoTrajetoria(aplicacaoId) {
    const mutation = `
      mutation DeleteGeoTrajetoria($aplicacaoId: String!) {
        deleteGeoTrajetoria(aplicacaoId: $aplicacaoId)
      }
    `

    const variables = { aplicacaoId }

    const response = await graphqlApi.post('', {
      query: mutation,
      variables
    })

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data.deleteGeoTrajetoria
  }
}