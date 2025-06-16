<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Total de Aplicações</h3>
          <p class="text-3xl font-bold text-blue-600">{{ stats.totalAplicacoes }}</p>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aplicações Hoje</h3>
          <p class="text-3xl font-bold text-green-600">{{ stats.aplicacoesHoje }}</p>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Talhões Ativos</h3>
          <p class="text-3xl font-bold text-purple-600">{{ stats.talhoesAtivos }}</p>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Equipamentos</h3>
          <p class="text-3xl font-bold text-orange-600">{{ stats.equipamentos }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Aplicações Recentes</h3>
          <div class="space-y-3">
            <div v-for="aplicacao in recentAplicacoes" :key="aplicacao.id" class="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p class="font-medium">{{ aplicacao.talhao?.nome }}</p>
                <p class="text-sm text-gray-600">{{ aplicacao.operador }}</p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="aplicacao.finalizada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ aplicacao.finalizada ? 'Finalizada' : 'Em andamento' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Talhões por Cultura</h3>
          <div class="space-y-3">
            <div v-for="cultura in culturas" :key="cultura.nome" class="flex justify-between items-center">
              <span>{{ cultura.nome }}</span>
              <span class="font-medium">{{ cultura.total }}</span>
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

const stats = ref({
  totalAplicacoes: 0,
  aplicacoesHoje: 0,
  talhoesAtivos: 0,
  equipamentos: 0
})

const recentAplicacoes = ref([])
const culturas = ref([])

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
