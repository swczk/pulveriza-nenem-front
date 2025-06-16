<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Sistema de Pulverização</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'Dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/aplicacoes"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'Aplicacoes' }"
              >
                Aplicações
              </router-link>
              <router-link
                to="/talhoes"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'Talhoes' }"
              >
                Talhões
              </router-link>
              <router-link
                to="/equipamentos"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'Equipamentos' }"
              >
                Equipamentos
              </router-link>
              <router-link
                to="/tipos-aplicacao"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'TiposAplicacao' }"
              >
                Tipos de Aplicação
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/usuarios"
                class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                :class="{ 'border-blue-500 text-blue-600': $route.name === 'Usuarios' }"
              >
                Usuários
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-sm text-gray-700 mr-4">{{ authStore.user?.nome }}</span>
              <button
                @click="logout"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
