import { resolveProductImage } from '@/productImages.js'

export function resolveOrderItemImage(item) {
  return resolveProductImage({ title: item.productTitle ?? item.title ?? '' })
}
