<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Aplicações</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          Nova Aplicação
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="filters.operador"
            placeholder="Filtrar por operador"
            class="input-field"
          />
          <select v-model="filters.finalizada" class="input-field">
            <option value="">Todos os status</option>
            <option value="true">Finalizadas</option>
            <option value="false">Em andamento</option>
          </select>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talhão</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosagem</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="aplicacao in filteredAplicacoes" :key="aplicacao.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ aplicacao.talhao?.nome }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ aplicacao.operador }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ aplicacao.dosagem }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(aplicacao.dataInicio) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="aplicacao.finalizada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ aplicacao.finalizada ? 'Finalizada' : 'Em andamento' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editAplicacao(aplicacao)" class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button
                    v-if="!aplicacao.finalizada"
                    @click="finalizarAplicacao(aplicacao)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    Finalizar
                  </button>
                  <button @click="deleteAplicacao(aplicacao)" class="text-red-600 hover:text-red-900">
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
            {{ showCreateModal ? 'Nova Aplicação' : 'Editar Aplicação' }}
          </h3>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Talhão</label>
                <select v-model="form.talhaoId" required class="input-field">
                  <option value="">Selecione um talhão</option>
                  <option v-for="talhao in talhoes" :key="talhao.id" :value="talhao.id">
                    {{ talhao.nome }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Equipamento</label>
                <select v-model="form.equipamentoId" required class="input-field">
                  <option value="">Selecione um equipamento</option>
                  <option v-for="equipamento in equipamentos" :key="equipamento.id" :value="equipamento.id">
                    {{ equipamento.nome }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Aplicação</label>
                <select v-model="form.tipoAplicacaoId" required class="input-field">
                  <option value="">Selecione o tipo</option>
                  <option v-for="tipo in tiposAplicacao" :key="tipo.id" :value="tipo.id">
                    {{ tipo.nome }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Operador</label>
                <input v-model="form.operador" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Dosagem</label>
                <input v-model.number="form.dosagem" type="number" step="0.1" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Data de Início</label>
                <input v-model="form.dataInicio" type="datetime-local" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Condição Climática</label>
                <input v-model="form.condicaoClimatica" class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Observações</label>
                <textarea v-model="form.observacoes" rows="3" class="input-field"></textarea>
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
import { ref, computed, onMounted } from 'vue'
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
  finalizada: ''
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

const filteredAplicacoes = computed(() => {
  return aplicacoes.value.filter(aplicacao => {
    const matchOperador = !filters.value.operador ||
      aplicacao.operador.toLowerCase().includes(filters.value.operador.toLowerCase())
    const matchFinalizada = filters.value.finalizada === '' ||
      aplicacao.finalizada.toString() === filters.value.finalizada
    return matchOperador && matchFinalizada
  })
})

const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
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

    if (showCreateModal.value) {
      await aplicacaoService.create(data)
    } else {
      await aplicacaoService.update(editingAplicacao.value.id, data)
    }

    closeModal()
    loadData()
  } catch (error) {
    console.error('Error saving aplicacao:', error)
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

onMounted(loadData)
</script>
