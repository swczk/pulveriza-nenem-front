<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">💦 Tipos de Aplicação</h1>
            <p class="text-blue-100">Gerencie os tipos de produtos e suas configurações</p>
          </div>
          <button @click="showCreateModal = true" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <span class="mr-2">+</span> Novo Tipo
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">💦</div>
            <div>
              <p class="text-sm text-gray-600">Total de Tipos</p>
              <p class="text-2xl font-bold text-gray-900">{{ tiposAplicacao.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">🌿</div>
            <div>
              <p class="text-sm text-gray-600">Herbicidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ tiposPorCategoria.Herbicida || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🐛</div>
            <div>
              <p class="text-sm text-gray-600">Inseticidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ tiposPorCategoria.Inseticida || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div class="flex items-center">
            <div class="text-3xl text-orange-500 mr-4">🍄</div>
            <div>
              <p class="text-sm text-gray-600">Fungicidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ tiposPorCategoria.Fungicida || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Types Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div v-for="tipo in tiposAplicacao" :key="tipo.id" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">{{ getTipoIcon(tipo.tipoProduto) }}</div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ tipo.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ tipo.tipoProduto }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTipoClass(tipo.tipoProduto)">
                {{ tipo.tipoProduto }}
              </span>
            </div>

            <!-- Description -->
            <div v-if="tipo.descricao" class="mb-4">
              <p class="text-sm text-gray-600">{{ tipo.descricao }}</p>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Vazão Padrão</p>
                <p class="font-semibold text-gray-900">{{ tipo.vazaoPadrao }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Unidade</p>
                <p class="font-semibold text-gray-900">{{ tipo.unidadeMedida }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-4 border-t border-gray-100">
              <button @click="editTipo(tipo)" 
                      class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✏️ Editar
              </button>
              <button @click="deleteTipo(tipo)" 
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="tiposAplicacao.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💦</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum tipo de aplicação encontrado</h3>
        <p class="text-gray-500 mb-4">Comece criando seu primeiro tipo de aplicação</p>
        <button @click="showCreateModal = true" 
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Criar Primeiro Tipo
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold">
                {{ showCreateModal ? '💦 Novo Tipo de Aplicação' : '✏️ Editar Tipo de Aplicação' }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 text-3xl font-bold">
                &times;
              </button>
            </div>
            <p class="text-blue-100 mt-2">
              {{ showCreateModal ? 'Cadastre um novo tipo de aplicação' : 'Atualize as informações do tipo' }}
            </p>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📋 Informações Básicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🏷️ Nome</label>
                  <input v-model="form.nome" required placeholder="Ex: Herbicida Sistematico" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📝 Descrição</label>
                  <textarea v-model="form.descricao" rows="3" placeholder="Descreva o tipo de aplicação..." 
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🌱 Tipo de Produto</label>
                  <select v-model="form.tipoProduto" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione o tipo</option>
                    <option value="Herbicida">🌿 Herbicida</option>
                    <option value="Fungicida">🍄 Fungicida</option>
                    <option value="Inseticida">🐛 Inseticida</option>
                    <option value="Adubo">🌱 Adubo</option>
                    <option value="Outros">📦 Outros</option>
                  </select>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📏 Especificações Técnicas</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">💧 Vazão Padrão</label>
                  <input v-model.number="form.vazaoPadrao" type="number" step="0.1" required placeholder="2.5" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📌 Unidade de Medida</label>
                  <select v-model="form.unidadeMedida" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione a unidade</option>
                    <option value="L/ha">L/ha (Litros por hectare)</option>
                    <option value="kg/ha">kg/ha (Quilos por hectare)</option>
                    <option value="g/ha">g/ha (Gramas por hectare)</option>
                    <option value="ml/ha">ml/ha (Mililitros por hectare)</option>
                  </select>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h5 class="font-medium text-gray-900 mb-2">📊 Exemplo de Uso:</h5>
                  <p class="text-sm text-gray-600">
                    Para uma aplicação de {{ form.vazaoPadrao || 'X' }} {{ form.unidadeMedida || 'unidade' }} 
                    em um talhão de 10 hectares, será necessário {{ (form.vazaoPadrao * 10) || 'X' }} 
                    {{ form.unidadeMedida?.split('/')[0] || 'unidades' }} do produto.
                  </p>
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
                {{ showCreateModal ? '✅ Criar Tipo' : '💾 Salvar Alterações' }}
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
import { tipoAplicacaoService } from '../services/tipoAplicacaoService'

const tiposAplicacao = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTipo = ref(null)

const form = ref({
  nome: '',
  descricao: '',
  tipoProduto: '',
  vazaoPadrao: '',
  unidadeMedida: ''
})

// Computed properties for statistics
const tiposPorCategoria = computed(() => {
  const categorias = {}
  tiposAplicacao.value.forEach(tipo => {
    if (tipo.tipoProduto) {
      categorias[tipo.tipoProduto] = (categorias[tipo.tipoProduto] || 0) + 1
    }
  })
  return categorias
})

// Utility functions
const getTipoIcon = (tipoProduto) => {
  switch (tipoProduto) {
    case 'Herbicida': return '🌿'
    case 'Fungicida': return '🍄'
    case 'Inseticida': return '🐛'
    case 'Adubo': return '🌱'
    default: return '📦'
  }
}

const getTipoClass = (tipoProduto) => {
  switch (tipoProduto) {
    case 'Herbicida': return 'bg-green-100 text-green-800'
    case 'Fungicida': return 'bg-orange-100 text-orange-800'
    case 'Inseticida': return 'bg-purple-100 text-purple-800'
    case 'Adubo': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const loadTipos = async () => {
  try {
    const data = await tipoAplicacaoService.getAll(0, 100)
    tiposAplicacao.value = data.content || data
  } catch (error) {
    console.error('Error loading tipos aplicacao:', error)
  }
}

const resetForm = () => {
  form.value = {
    nome: '',
    descricao: '',
    tipoProduto: '',
    vazaoPadrao: '',
    unidadeMedida: ''
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTipo.value = null
  resetForm()
}

const editTipo = (tipo) => {
  editingTipo.value = tipo
  form.value = { ...tipo }
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    if (showCreateModal.value) {
      await tipoAplicacaoService.create(form.value)
    } else {
      await tipoAplicacaoService.update(editingTipo.value.id, form.value)
    }

    closeModal()
    loadTipos()
  } catch (error) {
    console.error('Error saving tipo aplicacao:', error)
  }
}

const deleteTipo = async (tipo) => {
  if (confirm('Tem certeza que deseja excluir este tipo de aplicação?')) {
    try {
      await tipoAplicacaoService.delete(tipo.id)
      loadTipos()
    } catch (error) {
      console.error('Error deleting tipo aplicacao:', error)
    }
  }
}

onMounted(loadTipos)
</script>
