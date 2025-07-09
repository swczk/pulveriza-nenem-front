<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">⚙️ Equipamentos</h1>
            <p class="text-blue-100">Gerencie os equipamentos de pulverização</p>
          </div>
          <button @click="showCreateModal = true" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <span class="mr-2">+</span> Novo Equipamento
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">⚙️</div>
            <div>
              <p class="text-sm text-gray-600">Total de Equipamentos</p>
              <p class="text-2xl font-bold text-gray-900">{{ equipamentos.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">📊</div>
            <div>
              <p class="text-sm text-gray-600">Capacidade Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalCapacidade }}L</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🏭</div>
            <div>
              <p class="text-sm text-gray-600">Fabricantes</p>
              <p class="text-2xl font-bold text-gray-900">{{ uniqueFabricantes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Equipment Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div v-for="equipamento in equipamentos" :key="equipamento.id" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">🚜</div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ equipamento.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ equipamento.modelo }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Ativo
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Fabricante</p>
                <p class="font-semibold text-gray-900">{{ equipamento.fabricante }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Ano</p>
                <p class="font-semibold text-gray-900">{{ equipamento.anoFabricacao }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Capacidade</p>
                <p class="font-semibold text-gray-900">{{ equipamento.capacidadeTanque }}L</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Largura Barra</p>
                <p class="font-semibold text-gray-900">{{ equipamento.larguraBarra }}m</p>
              </div>
            </div>

            <!-- Serial Number -->
            <div v-if="equipamento.numeroSerie" class="mb-4">
              <div class="flex items-center text-sm">
                <span class="mr-2">🔢</span>
                <span class="text-gray-500">Série: {{ equipamento.numeroSerie }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-4 border-t border-gray-100">
              <button @click="editEquipamento(equipamento)" 
                      class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✏️ Editar
              </button>
              <button @click="deleteEquipamento(equipamento)" 
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="equipamentos.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">⚙️</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum equipamento encontrado</h3>
        <p class="text-gray-500 mb-4">Comece criando seu primeiro equipamento</p>
        <button @click="showCreateModal = true" 
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Criar Primeiro Equipamento
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold">
                {{ showCreateModal ? '⚙️ Novo Equipamento' : '✏️ Editar Equipamento' }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 text-3xl font-bold">
                &times;
              </button>
            </div>
            <p class="text-blue-100 mt-2">
              {{ showCreateModal ? 'Cadastre um novo equipamento para o sistema' : 'Atualize as informações do equipamento' }}
            </p>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📋 Informações Básicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🏷️ Nome</label>
                  <input v-model="form.nome" required placeholder="Ex: Pulverizador A1" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🚜 Modelo</label>
                  <input v-model="form.modelo" required placeholder="Ex: PL-2000" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🏭 Fabricante</label>
                  <input v-model="form.fabricante" required placeholder="Ex: John Deere" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📅 Ano de Fabricação</label>
                  <input v-model.number="form.anoFabricacao" type="number" required placeholder="2023" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📊 Especificações Técnicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📏 Largura da Barra (m)</label>
                  <input v-model.number="form.larguraBarra" type="number" step="0.1" placeholder="12.0" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🛢️ Capacidade do Tanque (L)</label>
                  <input v-model.number="form.capacidadeTanque" type="number" step="0.1" required placeholder="2000" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🔢 Número de Série</label>
                  <input v-model="form.numeroSerie" placeholder="Ex: JD2023001" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
                {{ showCreateModal ? '✅ Criar Equipamento' : '💾 Salvar Alterações' }}
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
import { equipamentoService } from '../services/equipamentoService'

const equipamentos = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingEquipamento = ref(null)

const form = ref({
  nome: '',
  modelo: '',
  fabricante: '',
  anoFabricacao: '',
  larguraBarra: '',
  capacidadeTanque: '',
  numeroSerie: ''
})

// Computed properties for statistics
const totalCapacidade = computed(() => {
  return equipamentos.value.reduce((total, eq) => total + (eq.capacidadeTanque || 0), 0)
})

const uniqueFabricantes = computed(() => {
  const fabricantes = new Set(equipamentos.value.map(eq => eq.fabricante).filter(Boolean))
  return fabricantes.size
})

const loadEquipamentos = async () => {
  try {
    const data = await equipamentoService.getAll(0, 100)
    equipamentos.value = data.content || data
  } catch (error) {
    console.error('Error loading equipamentos:', error)
  }
}

const resetForm = () => {
  form.value = {
    nome: '',
    modelo: '',
    fabricante: '',
    anoFabricacao: '',
    larguraBarra: '',
    capacidadeTanque: '',
    numeroSerie: ''
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingEquipamento.value = null
  resetForm()
}

const editEquipamento = (equipamento) => {
  editingEquipamento.value = equipamento
  form.value = { ...equipamento }
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    if (showCreateModal.value) {
      await equipamentoService.create(form.value)
    } else {
      await equipamentoService.update(editingEquipamento.value.id, form.value)
    }

    closeModal()
    loadEquipamentos()
  } catch (error) {
    console.error('Error saving equipamento:', error)
  }
}

const deleteEquipamento = async (equipamento) => {
  if (confirm('Tem certeza que deseja excluir este equipamento?')) {
    try {
      await equipamentoService.delete(equipamento.id)
      loadEquipamentos()
    } catch (error) {
      console.error('Error deleting equipamento:', error)
    }
  }
}

onMounted(loadEquipamentos)
</script>
