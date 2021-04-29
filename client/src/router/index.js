import { createRouter, createWebHistory } from 'vue-router'
import index from '../views/index'

const routes = [
  {
    path: '/',
    name: 'index',
    component:index
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
