import { resolveProductImage } from '@/productImages.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'

function authHeaders(accessToken) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

export function mapBackendProduct(item) {
  const { imageUrl, imageAlt } = resolveProductImage(item)
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    priceFrom: false,
    imageUrl,
    imageAlt,
    category: item.category?.shopCategory ?? null,
    categoryTitle: item.category?.title ?? null,
  }
}

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.name?.trim()) {
    params.append('name', filters.name.trim())
  }
  if (filters.shopCategory) {
    params.append('shopCategory', filters.shopCategory)
  }
  if (filters.maxPrice != null && filters.maxPrice !== '') {
    params.append('maxPrice', String(filters.maxPrice))
  }

  const query = params.toString()
  const url = query ? `${API_BASE_URL}/api/product?${query}` : `${API_BASE_URL}/api/product`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data.map(mapBackendProduct)
}

export async function fetchAllProducts() {
  return fetchProducts()
}

export async function fetchProductById(id) {
  const data = await fetchRawProductById(id)
  return mapBackendProduct(data)
}

export async function fetchRawProductById(id) {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/api/category`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchCategoryTranslations() {
  const response = await fetch(`${API_BASE_URL}/api/category/translation`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchProfile(accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export function buildProfilePayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    street: form.street.trim(),
    postalCode: form.postalCode.trim(),
    city: form.city.trim(),
  }
}

export async function updateProfile(form, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify(buildProfilePayload(form)),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export function buildProductPayload(form) {
  return {
    title: form.title,
    description: form.description,
    price: Number(form.price),
    imageUrl: form.imageUrl,
    category: { id: Number(form.categoryId) },
  }
}

export async function createProduct(payload, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/product`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function updateProduct(id, payload, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function deleteProduct(id, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

export function buildOrderPayload(cartItems, checkout, appliedCoupon = '') {
  const payload = {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    address: {
      street: checkout.delivery.street.trim(),
      postalCode: checkout.delivery.postalCode.trim(),
      city: checkout.delivery.city.trim(),
    },
    paymentMethod: checkout.paymentMethod,
  }
  if (appliedCoupon) {
    payload.couponCode = appliedCoupon
  }
  return payload
}

export async function placeOrder(payload, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/order`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchMyOrders(accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/order`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchOrderById(id, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/order/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchDriverDashboard(accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/delivery/assigned`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function acceptDelivery(id, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/delivery/${id}/accept`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 409) {
    throw new Error('DELIVERY_ALREADY_ACCEPTED')
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function updateDeliveryStatus(id, status, accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/delivery/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}
