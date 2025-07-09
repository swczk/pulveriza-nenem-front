<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">📊 Dashboard</h1>
            <p class="text-blue-100">Visão geral das operações de pulverização</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-blue-100">Última atualização</div>
            <div class="text-lg font-semibold">{{ formatDate(new Date()) }}</div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">🚜</div>
            <div>
              <p class="text-sm text-gray-600">Total de Aplicações</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalAplicacoes }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">📅</div>
            <div>
              <p class="text-sm text-gray-600">Aplicações Hoje</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.aplicacoesHoje }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🌾</div>
            <div>
              <p class="text-sm text-gray-600">Talhões Ativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.talhoesAtivos }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div class="flex items-center">
            <div class="text-3xl text-orange-500 mr-4">⚙️</div>
            <div>
              <p class="text-sm text-gray-600">Equipamentos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.equipamentos }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Applications -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="text-2xl mr-2">📋</span>
            Aplicações Recentes
          </h3>
          <div class="space-y-3">
            <div v-for="aplicacao in recentAplicacoes" :key="aplicacao.id" 
                 class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center">
                <div class="text-2xl mr-3">🌾</div>
                <div>
                  <p class="font-semibold text-gray-900">{{ aplicacao.talhao?.nome || 'Talhão não informado' }}</p>
                  <p class="text-sm text-gray-600">{{ aplicacao.operador }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(aplicacao.dataInicio) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="aplicacao.finalizada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ aplicacao.finalizada ? '✅ Finalizada' : '⏳ Em andamento' }}
              </span>
            </div>
            <div v-if="recentAplicacoes.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">🌾</div>
              <p class="text-gray-500">Nenhuma aplicação recente</p>
            </div>
          </div>
        </div>

        <!-- Cultures Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="text-2xl mr-2">🌱</span>
            Talhões por Cultura
          </h3>
          <div class="space-y-3">
            <div v-for="cultura in culturas" :key="cultura.nome" 
                 class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="text-xl mr-3">🌿</div>
                <span class="font-medium text-gray-900">{{ cultura.nome }}</span>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ cultura.total }}
              </span>
            </div>
            <div v-if="culturas.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">🌱</div>
              <p class="text-gray-500">Nenhuma cultura cadastrada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { aplicacaoService } from '../services/aplicacaoService'
import { talhaoService } from '../services/talhaoService'
import { equipamentoService } from '../services/equipamentoService'
import { format } from 'date-fns'

const stats = ref({
  totalAplicacoes: 0,
  aplicacoesHoje: 0,
  talhoesAtivos: 0,
  equipamentos: 0
})

const recentAplicacoes = ref([])
const culturas = ref([])

// Utility functions
const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

onMounted(async () => {
  try {
    // Load stats
    const [aplicacoes, talhoes, equipamentos] = await Promise.all([
      aplicacaoService.getAll(0, 100),
      talhaoService.getAll(0, 100),
      equipamentoService.getAll(0, 100)
    ])

    stats.value.totalAplicacoes = aplicacoes.totalElements || aplicacoes.length
    stats.value.talhoesAtivos = talhoes.totalElements || talhoes.length
    stats.value.equipamentos = equipamentos.totalElements || equipamentos.length

    // Recent applications
    recentAplicacoes.value = (aplicacoes.content || aplicacoes).slice(0, 5)

    // Group by culture
    const talhoesList = talhoes.content || talhoes
    const culturaMap = {}
    talhoesList.forEach(talhao => {
      if (talhao.cultura) {
        culturaMap[talhao.cultura] = (culturaMap[talhao.cultura] || 0) + 1
      }
    })

    culturas.value = Object.entries(culturaMap).map(([nome, total]) => ({
      nome,
      total
    }))

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>
