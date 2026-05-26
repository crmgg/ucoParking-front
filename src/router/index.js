import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import { hasTabAuth } from '@/services/tabAuthSession'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export async function requireTabAuth(to) {
  if (to.query.code && to.query.state) {
    return true
  }
  if (!to.meta.requiresAuth) {
    return true
  }
  if (!hasTabAuth()) {
    return { name: 'login' }
  }
  return authGuard(to)
}

export default router
