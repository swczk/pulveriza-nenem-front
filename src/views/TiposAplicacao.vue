<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Tipos de Aplicação</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          Novo Tipo
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Produto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vazão Padrão</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tipo in tiposAplicacao" :key="tipo.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ tipo.nome }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tipo.tipoProduto }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tipo.vazaoPadrao }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tipo.unidadeMedida }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editTipo(tipo)" class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button @click="deleteTipo(tipo)" class="text-red-600 hover:text-red-900">
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            {{ showCreateModal ? 'Novo Tipo de Aplicação' : 'Editar Tipo de Aplicação' }}
          </h3>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <input v-model="form.nome" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea v-model="form.descricao" rows="3" class="input-field"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Produto</label>
                <select v-model="form.tipoProduto" required class="input-field">
                  <option value="">Selecione o tipo</option>
                  <option value="Herbicida">Herbicida</option>
                  <option value="Fungicida">Fungicida</option>
                  <option value="Inseticida">Inseticida</option>
                  <option value="Adubo">Adubo</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Vazão Padrão</label>
                <input v-model.number="form.vazaoPadrao" type="number" step="0.1" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Unidade de Medida</label>
                <select v-model="form.unidadeMedida" required class="input-field">
                  <option value="">Selecione a unidade</option>
                  <option value="L/ha">L/ha</option>
                  <option value="kg/ha">kg/ha</option>
                  <option value="g/ha">g/ha</option>
                  <option value="ml/ha">ml/ha</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ showCreateModal ? 'Criar' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
