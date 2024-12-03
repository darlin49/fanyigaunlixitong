import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/index.vue')
      },
      {
        path: 'words',
        name: 'Words',
        component: () => import('../views/words/index.vue')
      },
      {
        path: '',
        redirect: '/dashboard'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
