import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/shop',
    name: 'shop',
    component: ProductCatalog,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductDetail,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
