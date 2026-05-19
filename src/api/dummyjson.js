const PRODUCTS_URL = 'https://dummyjson.com/products'

export function mapDummyJsonProduct(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    priceFrom: false,
    imageUrl: item.thumbnail,
    imageAlt: item.title,
  }
}

export async function fetchAllProducts() {
  const response = await fetch(`${PRODUCTS_URL}?limit=30`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data.products.map(mapDummyJsonProduct)
}

export async function fetchProductById(id) {
  const response = await fetch(`${PRODUCTS_URL}/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return mapDummyJsonProduct(data)
}
