import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ImpressumView from '@/views/ImpressumView.vue'
import DatenschutzView from '@/views/DatenschutzView.vue'
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
    path: '/impressum',
    name: 'impressum',
    component: ImpressumView,
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: DatenschutzView,
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
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const target = document.querySelector(to.hash)
          if (!target) {
            resolve({ top: 0 })
            return
          }
          const header = document.querySelector('.site-header')
          const offset = header ? header.getBoundingClientRect().height + 12 : 160
          const top = target.getBoundingClientRect().top + window.scrollY - offset
          resolve({ top, behavior: 'smooth' })
        }, 50)
      })
    }
    return { top: 0 }
  },
})

export default router
