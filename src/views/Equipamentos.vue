<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Equipamentos</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          Novo Equipamento
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fabricante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="equipamento in equipamentos" :key="equipamento.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ equipamento.nome }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ equipamento.modelo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ equipamento.fabricante }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ equipamento.anoFabricacao }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ equipamento.capacidadeTanque }}L
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editEquipamento(equipamento)" class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button @click="deleteEquipamento(equipamento)" class="text-red-600 hover:text-red-900">
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
            {{ showCreateModal ? 'Novo Equipamento' : 'Editar Equipamento' }}
          </h3>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <input v-model="form.nome" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Modelo</label>
                <input v-model="form.modelo" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Fabricante</label>
                <input v-model="form.fabricante" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Ano de Fabricação</label>
                <input v-model.number="form.anoFabricacao" type="number" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Largura da Barra (m)</label>
                <input v-model.number="form.larguraBarra" type="number" step="0.1" class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Capacidade do Tanque (L)</label>
                <input v-model.number="form.capacidadeTanque" type="number" step="0.1" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Número de Série</label>
                <input v-model="form.numeroSerie" class="input-field" />
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
