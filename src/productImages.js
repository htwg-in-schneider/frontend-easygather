import dateKorbImg from './assets/Date-Korb.jpg'
import standardKorbImg from './assets/Standard-Korb.jpg'
import familienKorbImg from './assets/Familien-Korb.jpg'
import lichterketteImg from './assets/Lichterkette.jpg'
import geburtstagsDekoImg from './assets/GeburtstagsDekoSet.jpg'
import essenImg from './assets/Essen.jpg'
import zitronenlimonadeImg from './assets/Zitronenlimonade.jpg'
import picknickkorbImg from './assets/Picknickkorb.jpg'
import eventsImg from './assets/Events.jpg'

const imagesByTitle = {
  'Date-Korb': { imageUrl: dateKorbImg, imageAlt: 'Date Picknickkorb mit Kerze und Wein' },
  'Standard-Korb': { imageUrl: standardKorbImg, imageAlt: 'Standard Picknickkorb auf Picknickdecke' },
  'Familien-Korb': { imageUrl: familienKorbImg, imageAlt: 'Familie beim Picknick im Park' },
  'LED-Lichterkette': { imageUrl: lichterketteImg, imageAlt: 'LED-Lichterkette über einem Picknickplatz' },
  'Geburtstags-Deko Paket': { imageUrl: geburtstagsDekoImg, imageAlt: 'Geburtstagsdeko mit Ballons' },
  'Pizza Margherita (groß)': { imageUrl: essenImg, imageAlt: 'Große Pizza Margherita' },
  'Hausgemachte Zitronenlimonade': { imageUrl: zitronenlimonadeImg, imageAlt: 'Hausgemachte Zitronenlimonade' },
}

const imagesByCategory = {
  picknickkoerbe: { imageUrl: picknickkorbImg, imageAlt: 'Picknickkorb mit Brot und Obst' },
  'party-event': { imageUrl: eventsImg, imageAlt: 'Dekorierter Tisch bei einer kleinen Feier' },
  'essen-getraenke': { imageUrl: essenImg, imageAlt: 'Auswahl an Speisen und Getränken auf einem Tisch' },
}

export function resolveProductImage(item) {
  const byTitle = imagesByTitle[item.title]
  if (byTitle) {
    return byTitle
  }
  const shopCategory = item.category?.shopCategory
  if (shopCategory && imagesByCategory[shopCategory]) {
    return imagesByCategory[shopCategory]
  }
  return { imageUrl: picknickkorbImg, imageAlt: item.title ?? 'Produktbild' }
}
