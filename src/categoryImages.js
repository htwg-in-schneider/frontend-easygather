import picknickkorbImg from './assets/Picknickkorb.jpg'
import eventsImg from './assets/Events.jpg'
import essenImg from './assets/Essen.jpg'
import { isPlaceholderImageUrl } from './productImages.js'

const imagesByShopCategory = {
  picknickkoerbe: { imageUrl: picknickkorbImg, imageAlt: 'Picknickkorb mit Brot und Obst' },
  'party-event': { imageUrl: eventsImg, imageAlt: 'Dekorierter Tisch bei einer kleinen Feier' },
  'essen-getraenke': { imageUrl: essenImg, imageAlt: 'Auswahl an Speisen und Getränken auf einem Tisch' },
}

/** Teaser-Texte für die Startseite (Bild kommt aus API oder Standard). */
export const categoryHomeMeta = {
  picknickkoerbe: {
    description: 'Kuratierte Körbe für Dates, Familienausflüge und spontane Treffen im Freien.',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Picknickkörbe im Shop öffnen',
  },
  'party-event': {
    description: 'Dekor, Spiele und passendes Zubehör für Geburtstage und kleine Feiern.',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Party und Event im Shop öffnen',
  },
  'essen-getraenke': {
    description: 'Pizza, Snacks, Salate und Getränke für jeden Anlass und jede Gruppengröße.',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Essen und Getränke im Shop öffnen',
  },
}

export function resolveCategoryImage(category) {
  const key = category?.shopCategory
  if (key && imagesByShopCategory[key]) {
    return imagesByShopCategory[key]
  }
  return { imageUrl: picknickkorbImg, imageAlt: category?.title ?? 'Kategorie' }
}

export function getCategoryDisplayImage(category) {
  if (category?.imageUrl && !isPlaceholderImageUrl(category.imageUrl)) {
    return { imageUrl: category.imageUrl, imageAlt: category.title ?? 'Kategorie' }
  }
  return resolveCategoryImage(category)
}

export function mapCategoryForHome(category) {
  const meta = categoryHomeMeta[category.shopCategory] ?? {}
  const { imageUrl, imageAlt } = getCategoryDisplayImage(category)
  return {
    id: category.id,
    title: category.title,
    shopCategory: category.shopCategory,
    description: meta.description ?? '',
    imageUrl,
    imageAlt,
    meta: meta.meta ?? 'Shop öffnen →',
    ariaLabel: meta.ariaLabel ?? `Kategorie ${category.title} im Shop öffnen`,
  }
}
