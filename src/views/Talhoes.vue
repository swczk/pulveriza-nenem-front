<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Talhões</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          Novo Talhão
        </button>
      </div>

      <!-- Fields Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área (ha)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cultura</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variedade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="talhao in talhoes" :key="talhao.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ talhao.nome }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ talhao.areaHectares }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ talhao.cultura }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ talhao.variedade }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editTalhao(talhao)" class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button @click="deleteTalhao(talhao)" class="text-red-600 hover:text-red-900">
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
            {{ showCreateModal ? 'Novo Talhão' : 'Editar Talhão' }}
          </h3>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <input v-model="form.nome" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Área (hectares)</label>
                <input v-model.number="form.areaHectares" type="number" step="0.01" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Cultura</label>
                <input v-model="form.cultura" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Variedade</label>
                <input v-model="form.variedade" class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Coordenadas Geográficas</label>
                <input v-model="form.coordenadasGeograficas" placeholder="-25.2456,-51.3658" class="input-field" />
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
