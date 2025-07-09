<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">🌾 Talhões</h1>
            <p class="text-blue-100">Gerencie os talhões e suas culturas</p>
          </div>
          <button @click="showCreateModal = true" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <span class="mr-2">+</span> Novo Talhão
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">🌾</div>
            <div>
              <p class="text-sm text-gray-600">Total de Talhões</p>
              <p class="text-2xl font-bold text-gray-900">{{ talhoes.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">📊</div>
            <div>
              <p class="text-sm text-gray-600">Área Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalArea }}ha</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🌱</div>
            <div>
              <p class="text-sm text-gray-600">Culturas</p>
              <p class="text-2xl font-bold text-gray-900">{{ uniqueCulturas }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div class="flex items-center">
            <div class="text-3xl text-orange-500 mr-4">📍</div>
            <div>
              <p class="text-sm text-gray-600">Com GPS</p>
              <p class="text-2xl font-bold text-gray-900">{{ talhoesComGPS }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Talhoes Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div v-for="talhao in talhoes" :key="talhao.id" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">🌾</div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ talhao.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ talhao.cultura }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Ativo
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Área</p>
                <p class="font-semibold text-gray-900">{{ talhao.areaHectares }}ha</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Variedade</p>
                <p class="font-semibold text-gray-900">{{ talhao.variedade || 'N/A' }}</p>
              </div>
            </div>

            <!-- GPS Coordinates -->
            <div v-if="talhao.coordenadasGeograficas" class="mb-4">
              <div class="flex items-center text-sm">
                <span class="mr-2">📍</span>
                <span class="text-gray-500">GPS: {{ talhao.coordenadasGeograficas }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-4 border-t border-gray-100">
              <button @click="editTalhao(talhao)" 
                      class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✏️ Editar
              </button>
              <button @click="deleteTalhao(talhao)" 
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="talhoes.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🌾</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum talhão encontrado</h3>
        <p class="text-gray-500 mb-4">Comece criando seu primeiro talhão</p>
        <button @click="showCreateModal = true" 
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Criar Primeiro Talhão
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold">
                {{ showCreateModal ? '🌾 Novo Talhão' : '✏️ Editar Talhão' }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 text-3xl font-bold">
                &times;
              </button>
            </div>
            <p class="text-blue-100 mt-2">
              {{ showCreateModal ? 'Cadastre um novo talhão no sistema' : 'Atualize as informações do talhão' }}
            </p>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📋 Informações Básicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🏷️ Nome</label>
                  <input v-model="form.nome" required placeholder="Ex: Talhão A1" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📊 Área (hectares)</label>
                  <input v-model.number="form.areaHectares" type="number" step="0.01" required placeholder="25.5" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🌱 Cultura</label>
                  <input v-model="form.cultura" required placeholder="Ex: Soja" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📏 Detalhes Adicionais</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🌿 Variedade</label>
                  <input v-model="form.variedade" placeholder="Ex: TMG 7062" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📍 Coordenadas GPS</label>
                  <input v-model="form.coordenadasGeograficas" placeholder="-25.2456,-51.3658" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <p class="text-xs text-gray-500 mt-1">Formato: latitude,longitude</p>
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
                {{ showCreateModal ? '✅ Criar Talhão' : '💾 Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { talhaoService } from '../services/talhaoService'

const talhoes = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTalhao = ref(null)

const form = ref({
  nome: '',
  areaHectares: '',
  cultura: '',
  variedade: '',
  coordenadasGeograficas: ''
})

// Computed properties for statistics
const totalArea = computed(() => {
  return talhoes.value.reduce((total, talhao) => total + (talhao.areaHectares || 0), 0).toFixed(2)
})

const uniqueCulturas = computed(() => {
  const culturas = new Set(talhoes.value.map(t => t.cultura).filter(Boolean))
  return culturas.size
})

const talhoesComGPS = computed(() => {
  return talhoes.value.filter(t => t.coordenadasGeograficas).length
})

const loadTalhoes = async () => {
  try {
    const data = await talhaoService.getAll(0, 100)
    talhoes.value = data.content || data
  } catch (error) {
    console.error('Error loading talhoes:', error)
  }
}

const resetForm = () => {
  form.value = {
    nome: '',
    areaHectares: '',
    cultura: '',
    variedade: '',
    coordenadasGeograficas: ''
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTalhao.value = null
  resetForm()
}

const editTalhao = (talhao) => {
  editingTalhao.value = talhao
  form.value = { ...talhao }
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    if (showCreateModal.value) {
      await talhaoService.create(form.value)
    } else {
      await talhaoService.update(editingTalhao.value.id, form.value)
    }

    closeModal()
    loadTalhoes()
  } catch (error) {
    console.error('Error saving talhao:', error)
  }
}

const deleteTalhao = async (talhao) => {
  if (confirm('Tem certeza que deseja excluir este talhão?')) {
    try {
      await talhaoService.delete(talhao.id)
      loadTalhoes()
    } catch (error) {
      console.error('Error deleting talhao:', error)
    }
  }
}

onMounted(loadTalhoes)
</script>
