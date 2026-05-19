import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CreateProduct from '@/views/CreateProduct.vue'
import EditProduct from '@/views/EditProduct.vue'

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
    path: '/product/view/:id',
    name: 'product',
    component: ProductDetail,
  },
  {
    path: '/product/create',
    name: 'product-create',
    component: CreateProduct,
  },
  {
    path: '/product/edit/:id',
    name: 'product-edit',
    component: EditProduct,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
