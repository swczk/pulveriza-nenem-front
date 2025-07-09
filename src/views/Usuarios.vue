<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 mb-8 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">👥 Usuários</h1>
            <p class="text-blue-100">Gerencie usuários e permissões do sistema</p>
          </div>
          <button @click="showCreateModal = true" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <span class="mr-2">+</span> Novo Usuário
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="text-3xl text-blue-500 mr-4">👥</div>
            <div>
              <p class="text-sm text-gray-600">Total de Usuários</p>
              <p class="text-2xl font-bold text-gray-900">{{ usuarios.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="text-3xl text-green-500 mr-4">✅</div>
            <div>
              <p class="text-sm text-gray-600">Usuários Ativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ usuariosAtivos }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="text-3xl text-purple-500 mr-4">🔑</div>
            <div>
              <p class="text-sm text-gray-600">Administradores</p>
              <p class="text-2xl font-bold text-gray-900">{{ usuariosAdmin }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div class="flex items-center">
            <div class="text-3xl text-orange-500 mr-4">👷</div>
            <div>
              <p class="text-sm text-gray-600">Operadores</p>
              <p class="text-2xl font-bold text-gray-900">{{ usuariosOperadores }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div v-for="usuario in usuarios" :key="usuario.id" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">👤</div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ usuario.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ usuario.email }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ usuario.ativo ? '✅ Ativo' : '❌ Inativo' }}
              </span>
            </div>

            <!-- Role Badge -->
            <div class="mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getRoleClass(usuario.role)">
                {{ getRoleIcon(usuario.role) }} {{ getRoleLabel(usuario.role) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-4 border-t border-gray-100">
              <button @click="editUsuario(usuario)" 
                      class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ✏️ Editar
              </button>
              <button @click="toggleUserStatus(usuario)"
                      :class="usuario.ativo ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                      class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                {{ usuario.ativo ? '⏸️' : '▶️' }}
              </button>
              <button @click="deleteUsuario(usuario)" 
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="usuarios.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
        <p class="text-gray-500 mb-4">Comece criando seu primeiro usuário</p>
        <button @click="showCreateModal = true" 
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Criar Primeiro Usuário
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold">
                {{ showCreateModal ? '👥 Novo Usuário' : '✏️ Editar Usuário' }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 text-3xl font-bold">
                &times;
              </button>
            </div>
            <p class="text-blue-100 mt-2">
              {{ showCreateModal ? 'Cadastre um novo usuário no sistema' : 'Atualize as informações do usuário' }}
            </p>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">📋 Informações Pessoais</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🏷️ Nome Completo</label>
                  <input v-model="form.nome" required placeholder="Ex: João Silva" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">📧 Email</label>
                  <input v-model="form.email" type="email" required placeholder="joao@empresa.com" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div v-if="showCreateModal">
                  <label class="block text-sm font-medium text-gray-700 mb-2">🔒 Senha</label>
                  <input v-model="form.senha" type="password" required placeholder="Senha segura" 
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <p class="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 border-b pb-2">🔑 Permissões</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">🎭 Nível de Acesso</label>
                  <select v-model="form.role" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione o nível</option>
                    <option value="ADMIN">🔑 Administrador</option>
                    <option value="TECNICO">🔧 Técnico</option>
                    <option value="OPERADOR">👷 Operador</option>
                  </select>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h5 class="font-medium text-gray-900 mb-3">Descrição dos Níveis:</h5>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center">
                      <span class="mr-2">🔑</span>
                      <span class="text-gray-600"><strong>Admin:</strong> Acesso total ao sistema</span>
                    </div>
                    <div class="flex items-center">
                      <span class="mr-2">🔧</span>
                      <span class="text-gray-600"><strong>Técnico:</strong> Gerencia operações e relatórios</span>
                    </div>
                    <div class="flex items-center">
                      <span class="mr-2">👷</span>
                      <span class="text-gray-600"><strong>Operador:</strong> Executa aplicações</span>
                    </div>
                  </div>
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
                {{ showCreateModal ? '✅ Criar Usuário' : '💾 Salvar Alterações' }}
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
import { usuarioService } from '../services/usuarioService'

const usuarios = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUsuario = ref(null)

const form = ref({
  nome: '',
  email: '',
  senha: '',
  role: ''
})

// Computed properties for statistics
const usuariosAtivos = computed(() => {
  return usuarios.value.filter(u => u.ativo).length
})

const usuariosAdmin = computed(() => {
  return usuarios.value.filter(u => u.role === 'ADMIN').length
})

const usuariosOperadores = computed(() => {
  return usuarios.value.filter(u => u.role === 'OPERADOR').length
})

// Utility functions
const getRoleClass = (role) => {
  switch (role) {
    case 'ADMIN': return 'bg-purple-100 text-purple-800'
    case 'TECNICO': return 'bg-blue-100 text-blue-800'
    case 'OPERADOR': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRoleIcon = (role) => {
  switch (role) {
    case 'ADMIN': return '🔑'
    case 'TECNICO': return '🔧'
    case 'OPERADOR': return '👷'
    default: return '👤'
  }
}

const getRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN': return 'Administrador'
    case 'TECNICO': return 'Técnico'
    case 'OPERADOR': return 'Operador'
    default: return role
  }
}

const loadUsuarios = async () => {
  try {
    const data = await usuarioService.getAll(0, 100)
    usuarios.value = data.content || data
  } catch (error) {
    console.error('Error loading usuarios:', error)
  }
}

const resetForm = () => {
  form.value = {
    nome: '',
    email: '',
    senha: '',
    role: ''
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUsuario.value = null
  resetForm()
}

const editUsuario = (usuario) => {
  editingUsuario.value = usuario
  form.value = {
    nome: usuario.nome,
    email: usuario.email,
    senha: '',
    role: usuario.role
  }
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    if (showCreateModal.value) {
      await usuarioService.create(form.value)
    } else {
      const updateData = { ...form.value }
      if (!updateData.senha) {
        delete updateData.senha
      }
      await usuarioService.update(editingUsuario.value.id, updateData)
    }

    closeModal()
    loadUsuarios()
  } catch (error) {
    console.error('Error saving usuario:', error)
  }
}

const toggleUserStatus = async (usuario) => {
  try {
    await usuarioService.updateStatus(usuario.id, !usuario.ativo)
    loadUsuarios()
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

const deleteUsuario = async (usuario) => {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    try {
      await usuarioService.delete(usuario.id)
      loadUsuarios()
    } catch (error) {
      console.error('Error deleting usuario:', error)
    }
  }
}

onMounted(loadUsuarios)
</script>
