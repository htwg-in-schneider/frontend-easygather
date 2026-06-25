export const CONFIGURABLE_BASKET_TITLE = 'Picknickkorb konfigurieren'

export const FIXED_BASKET_TITLES = ['Date-Korb', 'Standard-Korb', 'Familien-Korb']

export const PICKNICK_ACCESSORY_TITLES = ['Servietten', 'Picknickdecke', 'Kerzen', 'Mehrwegbecher']

export const CONFIGURATOR_ONLY_FOOD_TITLES = ['Gemüsesticks']

export function isConfigurableBasket(product) {
  return product?.title === CONFIGURABLE_BASKET_TITLE
}

export function isPicknickAccessory(product) {
  return PICKNICK_ACCESSORY_TITLES.includes(product?.title)
}

export function isHiddenFromShop(product) {
  return isPicknickAccessory(product) || CONFIGURATOR_ONLY_FOOD_TITLES.includes(product?.title)
}
