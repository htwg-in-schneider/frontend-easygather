import {
  fetchAdminDeliveries,
  fetchAdminOrders,
  fetchCategories,
  fetchProducts,
  fetchUsers,
} from '@/api/backend.js'

const ADMIN_SECTION_ROUTES = [
  {
    terms: ['nutzer', 'benutzer', 'benutzerkonten', 'user', 'users'],
    destination: { path: '/admin/users' },
  },
  {
    terms: ['bestellung', 'bestellungen', 'order', 'orders'],
    destination: { path: '/admin/orders' },
  },
  {
    terms: ['lieferung', 'lieferungen', 'lieferauftrag', 'lieferaufträge', 'lieferauftraege', 'delivery', 'deliveries'],
    destination: { path: '/admin/deliveries' },
  },
  {
    terms: ['kategorie', 'kategorien', 'category', 'categories'],
    destination: { path: '/admin/categories' },
  },
  {
    terms: ['produkt', 'produkte', 'product', 'products', 'shop'],
    destination: { path: '/shop' },
  },
]

const SEARCH_PRIORITY = [
  { key: 'orders', path: '/admin/orders', shopQuery: false },
  { key: 'users', path: '/admin/users', shopQuery: false },
  { key: 'deliveries', path: '/admin/deliveries', shopQuery: false },
  { key: 'categories', path: '/admin/categories', shopQuery: false },
  { key: 'products', path: '/shop', shopQuery: true },
]

function normalizeTerm(term) {
  return term.trim().toLowerCase()
}

function resolveAdminSectionKeyword(term) {
  const normalized = normalizeTerm(term)
  if (!normalized) {
    return null
  }
  return ADMIN_SECTION_ROUTES.find((entry) => entry.terms.includes(normalized))?.destination ?? null
}

function looksLikePersonName(term) {
  return /\s/.test(term.trim()) && !/^eg-/i.test(term.trim())
}

function looksLikeUserLookup(term) {
  const normalized = normalizeTerm(term)
  return looksLikePersonName(term) || normalized.includes('@') || normalized === 'kunde' || normalized === 'kunden'
}

function looksLikeSingleName(term) {
  const normalized = normalizeTerm(term)
  return normalized.length > 0 && /^[a-zäöüß-]+$/i.test(normalized)
}

function shouldPreferUsers(q, counts) {
  if (counts.users <= 0) {
    return false
  }
  if (looksLikeUserLookup(q)) {
    return true
  }
  return looksLikeSingleName(q) && (counts.orders === 0 || counts.users >= counts.orders)
}

export async function resolveAdminSearchDestination(term, accessToken) {
  const q = term.trim()
  if (!q) {
    return { path: '/admin' }
  }

  const sectionRoute = resolveAdminSectionKeyword(q)
  if (sectionRoute) {
    return sectionRoute
  }

  const [categories, users, orders, deliveries, products] = await Promise.all([
    fetchCategories({ title: q }).catch(() => []),
    fetchUsers(accessToken, q).catch(() => []),
    fetchAdminOrders(accessToken, q).catch(() => []),
    fetchAdminDeliveries(accessToken, q).catch(() => []),
    fetchProducts({ name: q }).catch(() => []),
  ])

  if (orders.length === 1) {
    return { path: `/admin/orders/${orders[0].id}` }
  }

  if (users.length === 1) {
    return { path: `/admin/users/edit/${users[0].id}` }
  }

  const counts = {
    orders: orders.length,
    deliveries: deliveries.length,
    users: users.length,
    categories: categories.length,
    products: products.length,
  }

  if (shouldPreferUsers(q, counts)) {
    return { path: '/admin/users', query: { q } }
  }

  let best = null
  for (const option of SEARCH_PRIORITY) {
    if (counts[option.key] > 0) {
      if (!best || counts[option.key] > counts[best.key]) {
        best = option
      }
    }
  }

  if (best) {
    return best.shopQuery
      ? { path: best.path, query: { name: q } }
      : { path: best.path, query: { q } }
  }

  if (shouldPreferUsers(q, counts) || looksLikeUserLookup(q)) {
    return { path: '/admin/users', query: { q } }
  }

  return { path: '/admin/orders', query: { q } }
}
