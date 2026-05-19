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
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return mapBackendProduct(data)
}
