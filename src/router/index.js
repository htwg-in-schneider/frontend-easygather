import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import HomeView from '@/views/HomeView.vue'
import ImpressumView from '@/views/ImpressumView.vue'
import DatenschutzView from '@/views/DatenschutzView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutDeliveryView from '@/views/CheckoutDeliveryView.vue'
import CheckoutPaymentView from '@/views/CheckoutPaymentView.vue'
import OrderConfirmationView from '@/views/OrderConfirmationView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import OrdersView from '@/views/OrdersView.vue'
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CreateProduct from '@/views/CreateProduct.vue'
import EditProduct from '@/views/EditProduct.vue'
import DriverDashboardView from '@/views/DriverDashboardView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import CategoriesAdminView from '@/views/admin/CategoriesAdminView.vue'
import CreateCategoryView from '@/views/admin/CreateCategoryView.vue'
import EditCategoryView from '@/views/admin/EditCategoryView.vue'
import UsersAdminView from '@/views/admin/UsersAdminView.vue'
import EditUserView from '@/views/admin/EditUserView.vue'
import AdminOrdersView from '@/views/admin/AdminOrdersView.vue'

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
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: authGuard,
  },
  {
    path: '/lieferauftraege',
    name: 'driver-dashboard',
    component: DriverDashboardView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: CategoriesAdminView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/categories/create',
    name: 'admin-category-create',
    component: CreateCategoryView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/categories/edit/:id',
    name: 'admin-category-edit',
    component: EditCategoryView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UsersAdminView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/users/edit/:id',
    name: 'admin-user-edit',
    component: EditUserView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: AdminOrdersView,
    beforeEnter: authGuard,
  },
  {
    path: '/admin/orders/:id',
    name: 'admin-order-detail',
    component: OrderDetailView,
    beforeEnter: authGuard,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },
  {
    path: '/checkout/delivery',
    name: 'checkout-delivery',
    component: CheckoutDeliveryView,
    beforeEnter: authGuard,
  },
  {
    path: '/checkout/payment',
    name: 'checkout-payment',
    component: CheckoutPaymentView,
    beforeEnter: authGuard,
  },
  {
    path: '/order/confirmation/:id',
    name: 'order-confirmation',
    component: OrderConfirmationView,
    beforeEnter: authGuard,
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView,
    beforeEnter: authGuard,
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: OrderDetailView,
    beforeEnter: authGuard,
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
    beforeEnter: authGuard,
  },
  {
    path: '/product/edit/:id',
    name: 'product-edit',
    component: EditProduct,
    beforeEnter: authGuard,
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
