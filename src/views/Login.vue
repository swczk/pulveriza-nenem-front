<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Pulverização
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Faça login para acessar o sistema
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  console.log('🎯 Login form - iniciando processo...')
  console.log('📧 Email do form:', email.value)

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })

    console.log('✅ Login form - sucesso! Redirecionando...')
    router.push('/')
  } catch (err) {
    console.error('❌ Login form - erro capturado:')
    console.error('🔢 Status do erro:', err.response?.status)
    console.error('📄 Dados do erro:', err.response?.data)
    console.error('🛠️ Erro completo:', err)
    
    // Mostrar erro mais específico baseado no status
    if (err.response?.status === 401) {
      error.value = 'Email ou senha inválidos'
    } else if (err.response?.status === 500) {
      error.value = 'Erro interno do servidor. Tente novamente.'
    } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
      error.value = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
    } else {
      error.value = `Erro: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`
    }
  } finally {
    loading.value = false
  }
}
</script>
