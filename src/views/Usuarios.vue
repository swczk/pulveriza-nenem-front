<template>
  <Layout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Usuários</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          Novo Usuário
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ usuario.nome }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ usuario.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getRoleClass(usuario.role)">
                    {{ usuario.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editUsuario(usuario)" class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button
                    @click="toggleUserStatus(usuario)"
                    :class="usuario.ativo ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                    class="mr-3"
                  >
                    {{ usuario.ativo ? 'Desativar' : 'Ativar' }}
                  </button>
                  <button @click="deleteUsuario(usuario)" class="text-red-600 hover:text-red-900">
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
            {{ showCreateModal ? 'Novo Usuário' : 'Editar Usuário' }}
          </h3>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <input v-model="form.nome" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="form.email" type="email" required class="input-field" />
              </div>

              <div v-if="showCreateModal">
                <label class="block text-sm font-medium text-gray-700">Senha</label>
                <input v-model="form.senha" type="password" required class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <select v-model="form.role" required class="input-field">
                  <option value="">Selecione a role</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="TECNICO">Técnico</option>
                  <option value="OPERADOR">Operador</option>
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

const getRoleClass = (role) => {
  switch (role) {
    case 'ADMIN': return 'bg-purple-100 text-purple-800'
    case 'TECNICO': return 'bg-blue-100 text-blue-800'
    case 'OPERADOR': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
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
