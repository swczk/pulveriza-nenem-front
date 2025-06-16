import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: '/login',
         name: 'Login',
         component: () => import('../views/Login.vue')
      },
      {
         path: '/',
         name: 'Dashboard',
         component: () => import('../views/Dashboard.vue'),
         meta: { requiresAuth: true }
      },
      {
         path: '/aplicacoes',
         name: 'Aplicacoes',
         component: () => import('../views/Aplicacoes.vue'),
         meta: { requiresAuth: true }
      },
      {
         path: '/talhoes',
         name: 'Talhoes',
         component: () => import('../views/Talhoes.vue'),
         meta: { requiresAuth: true }
      },
      {
         path: '/equipamentos',
         name: 'Equipamentos',
         component: () => import('../views/Equipamentos.vue'),
         meta: { requiresAuth: true }
      },
      {
         path: '/tipos-aplicacao',
         name: 'TiposAplicacao',
         component: () => import('../views/TiposAplicacao.vue'),
         meta: { requiresAuth: true }
      },
      {
         path: '/usuarios',
         name: 'Usuarios',
         component: () => import('../views/Usuarios.vue'),
         meta: { requiresAuth: true, requiresAdmin: true }
      }
   ]
})

router.beforeEach((to, from, next) => {
   const authStore = useAuthStore()

   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
   } else if (to.meta.requiresAdmin && authStore.user?.role !== 'ADMIN') {
      next('/')
   } else if (to.name === 'Login' && authStore.isAuthenticated) {
      next('/')
   } else {
      next()
   }
})

export default router
