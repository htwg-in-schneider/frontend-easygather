import { getCartItemImage } from '@/productImages.js'

export function resolveOrderItemImage(item) {
  return getCartItemImage(item.productTitle ?? item.title ?? '')
}
