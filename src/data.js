import picknickkorbImg from './assets/Picknickkorb.jpg'
import eventsImg from './assets/Events.jpg'
import essenImg from './assets/Essen.jpg'

/** Kategorien für Filter & 1:n-Beziehung (eine Kategorie → viele Produkte) */
export const productCategories = [
  { id: 'picknickkoerbe', label: 'Picknickkörbe' },
  { id: 'party-event', label: 'Party & Event' },
  { id: 'essen-getraenke', label: 'Essen & Getränke' },
]

export const categories = [
  {
    id: 1,
    title: 'Picknickkörbe',
    description: 'Kuratierte Körbe für Dates, Familienausflüge und spontane Treffen im Freien.',
    imageUrl: picknickkorbImg,
    imageAlt: 'Picknickkorb mit Brot und Obst',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Picknickkörbe im Shop öffnen',
    shopCategory: 'picknickkoerbe',
  },
  {
    id: 2,
    title: 'Party & Event',
    description: 'Dekor, Spiele und passendes Zubehör für Geburtstage und kleine Feiern.',
    imageUrl: eventsImg,
    imageAlt: 'Dekorierter Tisch bei einer kleinen Feier',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Party und Event im Shop öffnen',
    shopCategory: 'party-event',
  },
  {
    id: 3,
    title: 'Essen & Getränke',
    description: 'Pizza, Snacks, Salate und Getränke für jeden Anlass und jede Gruppengröße.',
    imageUrl: essenImg,
    imageAlt: 'Auswahl an Speisen und Getränken auf einem Tisch',
    meta: 'Shop öffnen →',
    ariaLabel: 'Kategorie Essen und Getränke im Shop öffnen',
    shopCategory: 'essen-getraenke',
  },
]
