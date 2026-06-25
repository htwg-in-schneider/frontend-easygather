import dateKorbImg from './assets/Date-Korb.jpg'
import standardKorbImg from './assets/Standard-Korb.jpg'
import familienKorbImg from './assets/Familien-Korb.jpg'
import lichterketteImg from './assets/Lichterkette.jpg'
import geburtstagsDekoImg from './assets/GeburtstagsDekoSet.jpg'
import schokobrunnenImg from './assets/Schokobrunnen.jpg'
import musikboxImg from './assets/Musikbox.jpg'
import popcornmaschineImg from './assets/Popcornmaschine.jpg'
import sonnenschirmeImg from './assets/Sonnenschirme.jpg'
import sandwichImg from './assets/Sandwich.jpg'
import veganSandwichImg from './assets/VeganSandwich.jpg'
import xxlSpieleImg from './assets/XXLSpiele.png'
import essenImg from './assets/Essen.jpg'
import zitronenlimonadeImg from './assets/Zitronenlimonade.jpg'
import wasserstillImg from './assets/Wasserstill.jpg'
import sprudelwasserImg from './assets/Sprudelwasser.jpg'
import antipastiplatteImg from './assets/Antipastiplatte.jpg'
import obstplatteImg from './assets/Obstplatte.jpg'
import picknickkorbImg from './assets/Picknickkorb.jpg'
import eventsImg from './assets/Events.jpg'
import { CONFIGURABLE_BASKET_TITLE, PICKNICK_ACCESSORY_TITLES, CONFIGURATOR_ONLY_FOOD_TITLES } from './config/basketConfigurator.js'

const NO_IMAGE_PRODUCTS = new Set([
  CONFIGURABLE_BASKET_TITLE,
  ...PICKNICK_ACCESSORY_TITLES,
  ...CONFIGURATOR_ONLY_FOOD_TITLES,
])

const imagesByTitle = {
  'Date-Korb': { imageUrl: dateKorbImg, imageAlt: 'Date Picknickkorb mit Kerze und Wein' },
  'Standard-Korb': { imageUrl: standardKorbImg, imageAlt: 'Standard Picknickkorb auf Picknickdecke' },
  'Familien-Korb': { imageUrl: familienKorbImg, imageAlt: 'Familie beim Picknick im Park' },
  'LED-Lichterkette': { imageUrl: lichterketteImg, imageAlt: 'LED-Lichterkette über einem Picknickplatz' },
  'Geburtstags-Deko Paket': { imageUrl: geburtstagsDekoImg, imageAlt: 'Geburtstagsdeko mit Ballons' },
  'Schokobrunnen-Set': { imageUrl: schokobrunnenImg, imageAlt: '5-stöckiger Schokobrunnen bei einer Gartenfeier' },
  'XXL Outdoor-Spiele-Set': { imageUrl: xxlSpieleImg, imageAlt: 'XXL Outdoor-Spiele: Jenga, Vier gewinnt, Tic-Tac-Toe und Cornhole' },
  'Bluetooth-Musikbox': { imageUrl: musikboxImg, imageAlt: 'Bluetooth-Lautsprecher für Outdoor-Events' },
  'Popcornmaschine': { imageUrl: popcornmaschineImg, imageAlt: 'Popcornmaschine bei einem Outdoor-Event' },
  'Sonnenschirme (groß)': { imageUrl: sonnenschirmeImg, imageAlt: 'Große Sonnenschirme auf einer Wiese' },
  'Pizza Margherita (groß)': { imageUrl: essenImg, imageAlt: 'Große Pizza Margherita' },
  'Salami-Rucola-Sandwich': { imageUrl: sandwichImg, imageAlt: 'Sandwich mit Salami, Rucola und Tomate' },
  'Hausgemachte Zitronenlimonade': { imageUrl: zitronenlimonadeImg, imageAlt: 'Hausgemachte Zitronenlimonade' },
  'Stilles Wasser': { imageUrl: wasserstillImg, imageAlt: 'Stilles Mineralwasser in Glasflaschen' },
  'Sprudelwasser': { imageUrl: sprudelwasserImg, imageAlt: 'Sprudelwasser in Glasflaschen' },
  'Antipasti-Platte': { imageUrl: antipastiplatteImg, imageAlt: 'Antipasti-Platte mit Oliven, Tomaten und Mozzarella' },
  'Obstplatte': { imageUrl: obstplatteImg, imageAlt: 'Frische Obstplatte für Picknick und Events' },
  'Veganes Sandwich': { imageUrl: veganSandwichImg, imageAlt: 'Veganes Sandwich mit Hummus und Gemüse' },
  [CONFIGURABLE_BASKET_TITLE]: { imageUrl: null, imageAlt: 'Eigenen Picknickkorb zusammenstellen' },
}

const imagesByCategory = {
  picknickkoerbe: { imageUrl: picknickkorbImg, imageAlt: 'Picknickkorb mit Brot und Obst' },
  'party-event': { imageUrl: eventsImg, imageAlt: 'Dekorierter Tisch bei einer kleinen Feier' },
  'essen-getraenke': { imageUrl: essenImg, imageAlt: 'Auswahl an Speisen und Getränken auf einem Tisch' },
}

const PLACEHOLDER_IMAGE_PATTERN = /picsum\.photos/

export function isPlaceholderImageUrl(url) {
  return !url || PLACEHOLDER_IMAGE_PATTERN.test(url)
}

export function resolveProductImage(item) {
  if (item.title && NO_IMAGE_PRODUCTS.has(item.title)) {
    return { imageUrl: null, imageAlt: item.title }
  }
  const byTitle = imagesByTitle[item.title]
  if (byTitle) {
    return byTitle
  }
  const shopCategory = item.category?.shopCategory ?? item.category
  if (shopCategory === 'picknickkoerbe') {
    return { imageUrl: null, imageAlt: item.title ?? 'Produktbild' }
  }
  if (shopCategory && imagesByCategory[shopCategory]) {
    return imagesByCategory[shopCategory]
  }
  return { imageUrl: null, imageAlt: item.title ?? 'Produktbild' }
}

/** Shop + Admin: eigenes Bild, sonst Standardbild zum Namen/Kategorie. */
export function getProductDisplayImage(item) {
  if (item.imageUrl && !isPlaceholderImageUrl(item.imageUrl)) {
    return { imageUrl: item.imageUrl, imageAlt: item.title ?? 'Produktbild' }
  }
  return resolveProductImage(item)
}

/** Warenkorb: nur echte Produktbilder, kein Kategorie-Fallback. */
export function getCartItemImage(title) {
  if (!title || NO_IMAGE_PRODUCTS.has(title)) {
    return { imageUrl: null, imageAlt: title ?? '' }
  }
  const byTitle = imagesByTitle[title]
  if (byTitle?.imageUrl) {
    return byTitle
  }
  return { imageUrl: null, imageAlt: title ?? '' }
}
