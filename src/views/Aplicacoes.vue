<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">🚜 Sistema de Pulverização</h1>
            <p class="text-blue-100">Gerencie aplicações com rastreamento geográfico em tempo real</p>
          </div>
          <button @click="showCreateModal = true" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <span class="mr-2">+</span> Nova Aplicação
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">📊</div>
            <div>
              <p class="text-sm text-gray-600">Total de Aplicações</p>
              <p class="text-2xl font-bold text-gray-900">{{ aplicacoes.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">✅</div>
            <div>
              <p class="text-sm text-gray-600">Finalizadas</p>
              <p class="text-2xl font-bold text-gray-900">{{ aplicacoesFinalizadas }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div class="flex items-center">
            <div class="text-3xl text-yellow-500 mr-4">⏳</div>
            <div>
              <p class="text-sm text-gray-600">Em Andamento</p>
              <p class="text-2xl font-bold text-gray-900">{{ aplicacoesEmAndamento }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🗺️</div>
            <div>
              <p class="text-sm text-gray-600">Com Dados GPS</p>
              <p class="text-2xl font-bold text-gray-900">{{ aplicacoesComGPS }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <input
              v-model="filters.operador"
              placeholder="Filtrar por operador"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">👤</span>
            </div>
          </div>
          <div class="relative">
            <select v-model="filters.finalizada" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos os status</option>
              <option value="true">Finalizadas</option>
              <option value="false">Em andamento</option>
            </select>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">📋</span>
            </div>
          </div>
          <div class="relative">
            <select v-model="filters.talhao" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos os talhões</option>
              <option v-for="talhao in talhoes" :key="talhao.id" :value="talhao.nome">
                {{ talhao.nome }}
              </option>
            </select>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">🌾</span>
            </div>
          </div>
          <button @click="clearFilters" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Applications Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div v-for="aplicacao in filteredAplicacoes" :key="aplicacao.id" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">🌾</div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ aplicacao.talhao?.nome || 'Talhão não informado' }}</h3>
                  <p class="text-sm text-gray-500">{{ aplicacao.operador }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="aplicacao.finalizada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ aplicacao.finalizada ? '✅ Finalizada' : '⏳ Em andamento' }}
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Dosagem</p>
                <p class="font-semibold text-gray-900">{{ aplicacao.dosagem }} L/ha</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Data Início</p>
                <p class="font-semibold text-gray-900">{{ formatDate(aplicacao.dataInicio) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Equipamento</p>
                <p class="font-semibold text-gray-900">{{ aplicacao.equipamento?.nome || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Tipo</p>
                <p class="font-semibold text-gray-900">{{ aplicacao.tipoAplicacao?.nome || 'N/A' }}</p>
              </div>
            </div>

            <!-- GPS Status -->
            <div class="mb-4">
              <div class="flex items-center text-sm">
                <span class="mr-2">🗺️</span>
                <span :class="aplicacao.dadosGeograficos ? 'text-green-600' : 'text-gray-500'">
                  {{ aplicacao.dadosGeograficos ? 'Com dados GPS' : 'Sem dados GPS' }}
                </span>
              </div>
            </div>

            <!-- Climate and Observations -->
            <div v-if="aplicacao.condicaoClimatica || aplicacao.observacoes" class="mb-4 text-sm">
              <div v-if="aplicacao.condicaoClimatica" class="mb-2">
                <span class="text-gray-500">🌤️ Clima:</span> {{ aplicacao.condicaoClimatica }}
              </div>
              <div v-if="aplicacao.observacoes" class="text-gray-600">
                <span class="text-gray-500">📝</span> {{ aplicacao.observacoes }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-4 border-t border-gray-100">
              <button @click="editAplicacao(aplicacao)" 
                      class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✏️ Editar
              </button>
              <button v-if="!aplicacao.finalizada"
                      @click="finalizarAplicacao(aplicacao)" 
                      class="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✅ Finalizar
              </button>
              <button @click="deleteAplicacao(aplicacao)" 
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAplicacoes.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🌾</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma aplicação encontrada</h3>
        <p class="text-gray-500 mb-4">
          {{ aplicacoes.length === 0 ? 'Comece criando sua primeira aplicação' : 'Tente ajustar os filtros' }}
        </p>
        <button v-if="aplicacoes.length === 0" @click="showCreateModal = true" 
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Criar Primeira Aplicação
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold">
                {{ showCreateModal ? '🚜 Nova Aplicação' : '✏️ Editar Aplicação' }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 text-3xl font-bold">
                &times;
              </button>
            </div>
            <p class="text-blue-100 mt-2">
              {{ showCreateModal ? 'Crie uma nova aplicação com rastreamento GPS' : 'Atualize os dados da aplicação' }}
            </p>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitForm" class="p-6">
            <!-- Step Indicator -->
            <div class="flex mb-6">
              <div class="flex items-center">
                <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <span class="ml-2 text-sm font-medium text-gray-900">Dados Básicos</span>
              </div>
              <div class="flex-1 border-t border-gray-300 mx-4 mt-4"></div>
              <div class="flex items-center">
                <div class="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <span class="ml-2 text-sm font-medium text-gray-500">Localização GPS</span>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column - Basic Data -->
              <div class="space-y-6">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📋 Informações Básicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🌾 Talhão</label>
                  <select v-model="form.talhaoId" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione um talhão</option>
                    <option v-for="talhao in talhoes" :key="talhao.id" :value="talhao.id">
                      {{ talhao.nome }} ({{ talhao.areaHectares }}ha)
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🚜 Equipamento</label>
                  <select v-model="form.equipamentoId" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione um equipamento</option>
                    <option v-for="equipamento in equipamentos" :key="equipamento.id" :value="equipamento.id">
                      {{ equipamento.nome }} - {{ equipamento.modelo }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">💊 Tipo de Aplicação</label>
                  <select v-model="form.tipoAplicacaoId" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione o tipo</option>
                    <option v-for="tipo in tiposAplicacao" :key="tipo.id" :value="tipo.id">
                      {{ tipo.nome }} ({{ tipo.vazaoPadrao }} {{ tipo.unidadeMedida }})
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">👤 Operador</label>
                    <input v-model="form.operador" required placeholder="Nome do operador" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">💧 Dosagem (L/ha)</label>
                    <input v-model.number="form.dosagem" type="number" step="0.1" required placeholder="0.0"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📅 Data de Início</label>
                  <input v-model="form.dataInicio" type="datetime-local" required 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🌤️ Condição Climática</label>
                  <input v-model="form.condicaoClimatica" placeholder="Ex: Ensolarado, vento leve"
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📝 Observações</label>
                  <textarea v-model="form.observacoes" rows="3" placeholder="Observações adicionais sobre a aplicação..."
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
              </div>

              <!-- Right Column - GPS Data -->
              <div class="space-y-6">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">🗺️ Dados de Localização</h4>
                
                <!-- GPS Status -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-gray-700">Status do GPS</span>
                    <span :class="gpsStatus.active ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
                      {{ gpsStatus.active ? '✅ Ativo' : '❌ Inativo' }}
                    </span>
                  </div>
                  <button type="button" @click="toggleGPS" 
                          :class="gpsStatus.active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
                          class="w-full py-2 px-4 rounded-lg font-medium transition-colors">
                    {{ gpsStatus.active ? '⏸️ Parar Rastreamento' : '▶️ Iniciar Rastreamento' }}
                  </button>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ gpsStatus.active ? 'Capturando localização em tempo real' : 'Clique para começar a capturar sua localização' }}
                  </p>
                </div>

                <!-- Current Location -->
                <div v-if="currentLocation" class="bg-blue-50 p-4 rounded-lg">
                  <h5 class="font-medium text-blue-900 mb-2">📍 Localização Atual</h5>
                  <div class="text-sm text-blue-700 space-y-1">
                    <div>Latitude: {{ currentLocation.latitude.toFixed(6) }}</div>
                    <div>Longitude: {{ currentLocation.longitude.toFixed(6) }}</div>
                    <div v-if="currentLocation.accuracy">Precisão: {{ currentLocation.accuracy.toFixed(0) }}m</div>
                    <div class="text-xs text-blue-600 mt-2">
                      Atualizado em {{ new Date(currentLocation.timestamp).toLocaleTimeString() }}
                    </div>
                  </div>
                </div>

                <!-- GPS Points -->
                <div v-if="gpsPoints.length > 0" class="bg-green-50 p-4 rounded-lg">
                  <h5 class="font-medium text-green-900 mb-2">📊 Dados Coletados</h5>
                  <div class="text-sm text-green-700">
                    <div>Pontos capturados: {{ gpsPoints.length }}</div>
                    <div v-if="gpsPoints.length > 1">
                      Distância estimada: {{ calculateDistance() }}m
                    </div>
                    <div class="text-xs text-green-600 mt-2">
                      {{ gpsPoints.length > 1 ? 'Trajetória sendo registrada' : 'Primeiro ponto capturado' }}
                    </div>
                  </div>
                </div>

                <!-- GPS Error -->
                <div v-if="gpsError" class="bg-red-50 p-4 rounded-lg">
                  <h5 class="font-medium text-red-900 mb-2">⚠️ Erro de GPS</h5>
                  <p class="text-sm text-red-700">{{ gpsError }}</p>
                  <button type="button" @click="requestLocation" 
                          class="mt-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                    Tentar Novamente
                  </button>
                </div>

                <!-- Manual GPS Input -->
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <h5 class="font-medium text-yellow-900 mb-3">📝 Inserir Localização Manual</h5>
                  <div class="grid grid-cols-2 gap-3">
                    <input v-model.number="manualLocation.latitude" type="number" step="any" 
                           placeholder="Latitude" class="p-2 border rounded text-sm">
                    <input v-model.number="manualLocation.longitude" type="number" step="any" 
                           placeholder="Longitude" class="p-2 border rounded text-sm">
                  </div>
                  <button type="button" @click="addManualLocation" 
                          class="mt-2 w-full bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 text-sm">
                    Adicionar Ponto Manual
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button type="button" @click="closeModal" 
                      class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                ❌ Cancelar
              </button>
              <button type="submit" 
                      class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 font-medium transition-all transform hover:scale-105">
                {{ showCreateModal ? '✅ Criar Aplicação' : '💾 Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Layout from '../components/Layout.vue'
import { aplicacaoService } from '../services/aplicacaoService'
import { talhaoService } from '../services/talhaoService'
import { equipamentoService } from '../services/equipamentoService'
import { tipoAplicacaoService } from '../services/tipoAplicacaoService'
import { format } from 'date-fns'

const aplicacoes = ref([])
const talhoes = ref([])
const equipamentos = ref([])
const tiposAplicacao = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingAplicacao = ref(null)

const filters = ref({
  operador: '',
  finalizada: '',
  talhao: ''
})

const form = ref({
  talhaoId: '',
  equipamentoId: '',
  tipoAplicacaoId: '',
  operador: '',
  dosagem: '',
  dataInicio: '',
  condicaoClimatica: '',
  observacoes: ''
})

// GPS related state
const gpsStatus = ref({ active: false })
const currentLocation = ref(null)
const gpsPoints = ref([])
const gpsError = ref('')
const gpsWatchId = ref(null)
const manualLocation = ref({ latitude: '', longitude: '' })

// Statistics computed properties
const aplicacoesFinalizadas = computed(() => 
  aplicacoes.value.filter(app => app.finalizada).length
)

const aplicacoesEmAndamento = computed(() => 
  aplicacoes.value.filter(app => !app.finalizada).length
)

const aplicacoesComGPS = computed(() => 
  aplicacoes.value.filter(app => app.dadosGeograficos).length
)

const filteredAplicacoes = computed(() => {
  return aplicacoes.value.filter(aplicacao => {
    const matchOperador = !filters.value.operador ||
      aplicacao.operador.toLowerCase().includes(filters.value.operador.toLowerCase())
    const matchFinalizada = filters.value.finalizada === '' ||
      aplicacao.finalizada.toString() === filters.value.finalizada
    const matchTalhao = !filters.value.talhao ||
      aplicacao.talhao?.nome === filters.value.talhao
    return matchOperador && matchFinalizada && matchTalhao
  })
})

// Utility functions
const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

const clearFilters = () => {
  filters.value = {
    operador: '',
    finalizada: '',
    talhao: ''
  }
}

// GPS Functions
const requestLocation = () => {
  if (!navigator.geolocation) {
    gpsError.value = 'Geolocalização não suportada pelo navegador'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed
      }
      
      currentLocation.value = newLocation
      gpsError.value = ''
      
      // Add to GPS points if tracking is active
      if (gpsStatus.value.active) {
        addGPSPoint(newLocation)
      }
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          gpsError.value = 'Acesso à localização negado. Permita o acesso nas configurações do navegador.'
          break
        case error.POSITION_UNAVAILABLE:
          gpsError.value = 'Localização indisponível. Verifique se o GPS está ativado.'
          break
        case error.TIMEOUT:
          gpsError.value = 'Tempo esgotado para obter localização. Tente novamente.'
          break
        default:
          gpsError.value = 'Erro desconhecido ao obter localização.'
          break
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  )
}

const addGPSPoint = (location) => {
  gpsPoints.value.push({
    latitude: location.latitude,
    longitude: location.longitude,
    timestamp: location.timestamp,
    accuracy: location.accuracy,
    altitude: location.altitude,
    speed: location.speed
  })
}

const toggleGPS = () => {
  if (gpsStatus.value.active) {
    stopGPSTracking()
  } else {
    startGPSTracking()
  }
}

const startGPSTracking = () => {
  if (!navigator.geolocation) {
    gpsError.value = 'Geolocalização não suportada pelo navegador'
    return
  }

  gpsStatus.value.active = true
  gpsError.value = ''

  // Get initial position
  requestLocation()

  // Start watching position
  gpsWatchId.value = navigator.geolocation.watchPosition(
    (position) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed
      }
      
      currentLocation.value = newLocation
      addGPSPoint(newLocation)
    },
    (error) => {
      console.error('GPS Watch Error:', error)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  )
}

const stopGPSTracking = () => {
  gpsStatus.value.active = false
  
  if (gpsWatchId.value) {
    navigator.geolocation.clearWatch(gpsWatchId.value)
    gpsWatchId.value = null
  }
}

const addManualLocation = () => {
  if (manualLocation.value.latitude && manualLocation.value.longitude) {
    const newPoint = {
      latitude: manualLocation.value.latitude,
      longitude: manualLocation.value.longitude,
      timestamp: new Date(),
      accuracy: null,
      altitude: null,
      speed: null
    }
    
    addGPSPoint(newPoint)
    currentLocation.value = newPoint
    
    // Clear manual inputs
    manualLocation.value = { latitude: '', longitude: '' }
  }
}

const calculateDistance = () => {
  if (gpsPoints.value.length < 2) return 0

  let totalDistance = 0
  for (let i = 1; i < gpsPoints.value.length; i++) {
    const prev = gpsPoints.value[i - 1]
    const curr = gpsPoints.value[i]
    totalDistance += getDistanceBetweenPoints(prev, curr)
  }
  
  return Math.round(totalDistance)
}

const getDistanceBetweenPoints = (point1, point2) => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = point1.latitude * Math.PI / 180
  const φ2 = point2.latitude * Math.PI / 180
  const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180
  const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

const loadData = async () => {
  try {
    const [aplicacoesData, talhoesData, equipamentosData, tiposData] = await Promise.all([
      aplicacaoService.getAll(0, 100),
      talhaoService.getAll(0, 100),
      equipamentoService.getAll(0, 100),
      tipoAplicacaoService.getAll(0, 100)
    ])

    aplicacoes.value = aplicacoesData.content || aplicacoesData
    talhoes.value = talhoesData.content || talhoesData
    equipamentos.value = equipamentosData.content || equipamentosData
    tiposAplicacao.value = tiposData.content || tiposData
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const resetForm = () => {
  form.value = {
    talhaoId: '',
    equipamentoId: '',
    tipoAplicacaoId: '',
    operador: '',
    dosagem: '',
    dataInicio: '',
    condicaoClimatica: '',
    observacoes: ''
  }
  
  // Reset GPS data
  stopGPSTracking()
  gpsPoints.value = []
  currentLocation.value = null
  gpsError.value = ''
  manualLocation.value = { latitude: '', longitude: '' }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingAplicacao.value = null
  resetForm()
}

const editAplicacao = (aplicacao) => {
  editingAplicacao.value = aplicacao
  form.value = {
    talhaoId: aplicacao.talhao?.id || '',
    equipamentoId: aplicacao.equipamento?.id || '',
    tipoAplicacaoId: aplicacao.tipoAplicacao?.id || '',
    operador: aplicacao.operador,
    dosagem: aplicacao.dosagem,
    dataInicio: aplicacao.dataInicio?.slice(0, 16) || '',
    condicaoClimatica: aplicacao.condicaoClimatica || '',
    observacoes: aplicacao.observacoes || ''
  }
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    // Stop GPS tracking when submitting
    if (gpsStatus.value.active) {
      stopGPSTracking()
    }

    const data = {
      talhao: { id: form.value.talhaoId },
      equipamento: { id: form.value.equipamentoId },
      tipoAplicacao: { id: form.value.tipoAplicacaoId },
      operador: form.value.operador,
      dosagem: form.value.dosagem,
      dataInicio: form.value.dataInicio,
      condicaoClimatica: form.value.condicaoClimatica,
      observacoes: form.value.observacoes
    }

    // Add GPS data if available
    if (gpsPoints.value.length > 0) {
      const pontoInicial = gpsPoints.value[0]
      const pontoFinal = gpsPoints.value.length > 1 ? gpsPoints.value[gpsPoints.value.length - 1] : null
      
      data.dadosGeograficos = {
        pontoInicial: {
          latitude: pontoInicial.latitude,
          longitude: pontoInicial.longitude,
          timestamp: pontoInicial.timestamp.toISOString(),
          accuracy: pontoInicial.accuracy,
          altitude: pontoInicial.altitude,
          speed: pontoInicial.speed
        },
        trajetoria: gpsPoints.value.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
          timestamp: point.timestamp.toISOString(),
          accuracy: point.accuracy,
          altitude: point.altitude,
          speed: point.speed
        })),
        distanciaPercorrida: calculateDistance()
      }

      if (pontoFinal) {
        data.dadosGeograficos.pontoFinal = {
          latitude: pontoFinal.latitude,
          longitude: pontoFinal.longitude,
          timestamp: pontoFinal.timestamp.toISOString(),
          accuracy: pontoFinal.accuracy,
          altitude: pontoFinal.altitude,
          speed: pontoFinal.speed
        }
      }
    }

    console.log('📤 Enviando aplicação com dados:', data)

    if (showCreateModal.value) {
      await aplicacaoService.create(data)
    } else {
      await aplicacaoService.update(editingAplicacao.value.id, data)
    }

    closeModal()
    loadData()
  } catch (error) {
    console.error('Error saving aplicacao:', error)
    alert('Erro ao salvar aplicação: ' + (error.message || 'Erro desconhecido'))
  }
}

const finalizarAplicacao = async (aplicacao) => {
  try {
    await aplicacaoService.updateStatus(aplicacao.id, true)
    loadData()
  } catch (error) {
    console.error('Error finalizing aplicacao:', error)
  }
}

const deleteAplicacao = async (aplicacao) => {
  if (confirm('Tem certeza que deseja excluir esta aplicação?')) {
    try {
      await aplicacaoService.delete(aplicacao.id)
      loadData()
    } catch (error) {
      console.error('Error deleting aplicacao:', error)
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  loadData()
  // Set default datetime to now
  const now = new Date()
  form.value.dataInicio = now.toISOString().slice(0, 16)
})

onBeforeUnmount(() => {
  // Clean up GPS tracking when component is destroyed
  stopGPSTracking()
})
</script>
