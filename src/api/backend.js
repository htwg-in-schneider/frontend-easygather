import { resolveProductImage } from '@/productImages.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'

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

export async function fetchAllProducts() {
  const response = await fetch(`${API_BASE_URL}/api/product`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data.map(mapBackendProduct)
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

export function buildProductPayload(form) {
  return {
    title: form.title,
    description: form.description,
    price: Number(form.price),
    imageUrl: form.imageUrl,
    category: { id: Number(form.categoryId) },
  }
}

export async function createProduct(payload) {
  const response = await fetch(`${API_BASE_URL}/api/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function updateProduct(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}
