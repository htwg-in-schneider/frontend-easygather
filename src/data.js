import dateKorbImg from './assets/Date-Korb.jpg'
import standardKorbImg from './assets/Standard-Korb.jpg'
import familienKorbImg from './assets/Familien-Korb.jpg'
import lichterketteImg from './assets/Lichterkette.jpg'
import geburtstagsDekoImg from './assets/GeburtstagsDekoSet.jpg'
import essenImg from './assets/Essen.jpg'
import zitronenlimonadeImg from './assets/Zitronenlimonade.jpg'
import picknickkorbImg from './assets/Picknickkorb.jpg'
import eventsImg from './assets/Events.jpg'

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
    meta: '3 Produkte →',
    ariaLabel: 'Kategorie Picknickkörbe im Shop öffnen',
    shopCategory: 'picknickkoerbe',
  },
  {
    id: 2,
    title: 'Party & Event',
    description: 'Dekor, Spiele und passendes Zubehör für Geburtstage und kleine Feiern.',
    imageUrl: eventsImg,
    imageAlt: 'Dekorierter Tisch bei einer kleinen Feier',
    meta: '2 Produkte →',
    ariaLabel: 'Kategorie Party und Event im Shop öffnen',
    shopCategory: 'party-event',
  },
  {
    id: 3,
    title: 'Essen & Getränke',
    description: 'Pizza, Snacks, Salate und Getränke für jeden Anlass und jede Gruppengröße.',
    imageUrl: essenImg,
    imageAlt: 'Auswahl an Speisen und Getränken auf einem Tisch',
    meta: '2 Produkte →',
    ariaLabel: 'Kategorie Essen und Getränke im Shop öffnen',
    shopCategory: 'essen-getraenke',
  },
]

export const products = [
  {
    id: 1,
    title: 'Date-Korb',
    description:
      'Kleine, stilvolle Auswahl für zwei Personen mit süßen und herzhaften Highlights.',
    price: 29.9,
    priceFrom: false,
    imageUrl: dateKorbImg,
    imageAlt: 'Date Picknickkorb mit Kerze und Wein',
    category: 'picknickkoerbe',
    includedItems: [
      '2 Sandwiches',
      'Obst',
      'Zitronenlimonade (2x 0,33l)',
      'Servietten',
      'Picknickdecke inkl. Kerzen',
    ],
  },
  {
    id: 2,
    title: 'Standard-Korb',
    description: 'Der flexible Allrounder für Treffen im Park oder am See.',
    price: 39.9,
    priceFrom: false,
    imageUrl: standardKorbImg,
    imageAlt: 'Standard Picknickkorb auf Picknickdecke',
    category: 'picknickkoerbe',
    includedItems: ['Antipasti', 'Brot & Dip', 'Wasser & Saft', 'Picknickdecke'],
  },
  {
    id: 3,
    title: 'Familien-Korb',
    description: 'Großer Mix für Groß und Klein mit Snacks, Getränken und unkomplizierten Klassikern.',
    price: 49.9,
    priceFrom: false,
    imageUrl: familienKorbImg,
    imageAlt: 'Familie beim Picknick im Park',
    category: 'picknickkoerbe',
    includedItems: ['Snacks für Kinder', 'Obst & Gemüse', 'Limonade (4x)', 'Servietten & Becher'],
  },
  {
    id: 4,
    title: 'LED-Lichterkette',
    description: 'Stimmungsvolle Lichterkette für Abende im Garten, auf der Terrasse oder beim Picknick.',
    price: 14.9,
    priceFrom: false,
    imageUrl: lichterketteImg,
    imageAlt: 'LED-Lichterkette über einem Picknickplatz',
    category: 'party-event',
  },
  {
    id: 5,
    title: 'Geburtstags-Deko Paket',
    description: 'Tischdeko, Banner und Servietten für eine stimmige Party-Atmosphäre.',
    price: 24.9,
    priceFrom: false,
    imageUrl: geburtstagsDekoImg,
    imageAlt: 'Geburtstagsdeko mit Ballons',
    category: 'party-event',
  },
  {
    id: 6,
    title: 'Pizza Margherita (groß)',
    description: 'Frische Pizza zum Teilen – ideal für Picknick und kleine Runden.',
    price: 12.9,
    priceFrom: false,
    imageUrl: essenImg,
    imageAlt: 'Große Pizza Margherita',
    category: 'essen-getraenke',
  },
  {
    id: 7,
    title: 'Hausgemachte Zitronenlimonade',
    description: 'Erfrischend und nicht zu süß – 1 Liter, perfekt für unterwegs.',
    price: 4.9,
    priceFrom: false,
    imageUrl: zitronenlimonadeImg,
    imageAlt: 'Gläser mit Zitronenlimonade',
    category: 'essen-getraenke',
  },
]
