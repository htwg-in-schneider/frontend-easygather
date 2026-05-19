<script setup>
import { ref, computed } from 'vue'
import { categories, products } from './data.js'
import freundePicknickImg from './assets/FreundePicknick.jpg'

const currentPage = ref('home')
const searchQuery = ref('')
const filterCategory = ref('alle')

function getCategories() {
  return categories
}

function goHome(event) {
  event?.preventDefault()
  currentPage.value = 'home'
  searchQuery.value = ''
  resetFilters()
}

function goShop(event, category = 'alle') {
  event?.preventDefault()
  currentPage.value = 'shop'
  filterCategory.value = category
}

function runSearch() {
  if (searchQuery.value.trim()) {
    currentPage.value = 'search'
  }
}

function resetFilters() {
  filterCategory.value = 'alle'
}

const displayedProducts = computed(() => {
  let list = products

  if (currentPage.value === 'search') {
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(q) || product.description.toLowerCase().includes(q),
      )
    }
  }

  if (filterCategory.value !== 'alle') {
    list = list.filter((product) => product.category === filterCategory.value)
  }

  return list
})

function formatPrice(product) {
  const amount = `${product.price.toFixed(2).replace('.', ',')} EUR`
  return product.priceFrom ? `ab ${amount}` : amount
}

function showProductAlert(product) {
  const items = product.includedItems?.length
    ? '\n\nEnthaltene Artikel:\n• ' + product.includedItems.join('\n• ')
    : ''
  alert(product.description + items)
}

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a href="#" class="logo" @click="goHome">EasyGather</a>
      <nav class="nav-main">
        <a href="#" @click="noop">Liefergebiet</a>
        <a
          href="#"
          :class="{ 'nav-active': currentPage === 'shop' || currentPage === 'search' }"
          @click="goShop"
        >
          Shop
        </a>
        <a href="#" @click="noop">Warenkorb</a>
        <a href="#" @click="noop">Anmelden</a>
        <a href="#" class="nav-register" @click="noop">Registrieren</a>
      </nav>
    </div>
  </header>

  <main>
    <template v-if="currentPage === 'home'">
      <section class="hero-grid">
        <div>
          <p class="eyebrow">Für Picknick, Geburtstage und kleine Feiern</p>
          <h1>Alles für entspannte Treffen mit Freunden - in einer Bestellung.</h1>
          <p class="lead">
            Ob spontanes Picknick im Park, ein gemütlicher Pizza-Abend oder eine kleine Geburtstagsrunde: Mit
            EasyGather planst du weniger und genießt mehr. Wir machen es dir leicht, gemeinsame Momente unkompliziert
            und stressfrei auf die Beine zu stellen.
          </p>
          <div class="cta-row">
            <a href="#" class="btn btn-primary" @click="goShop">Shop durchsuchen</a>
            <a href="#" class="btn btn-secondary" @click="noop">Liefergebiet auswählen</a>
          </div>
        </div>

        <div class="hero-visual">
          <img :src="freundePicknickImg" alt="Freunde genießen ein Picknick im Park" />
          <p>
            Von der Idee bis zur Lieferung: Wähle passende Angebote, lege deinen Lieferort fest und behalte jede
            Bestellung transparent im Blick.
          </p>
        </div>
      </section>

      <section>
        <h2>Kategorien</h2>
        <p class="section-text">Picknickkörbe, Speisen & Getränke sowie Party- und Eventzubehör.</p>
        <div class="category-grid">
          <a
            v-for="category in getCategories()"
            :key="category.id"
            href="#"
            class="card category-card category-link"
            :aria-label="category.ariaLabel"
            @click.prevent="goShop($event, category.shopCategory)"
          >
            <img :src="category.imageUrl" :alt="category.imageAlt" />
            <h3>{{ category.title }}</h3>
            <p>{{ category.description }}</p>
            <span class="meta">{{ category.meta }}</span>
          </a>
        </div>
      </section>
    </template>

    <template v-else>
      <section id="shop-produkte">
        <div v-if="currentPage === 'search'" class="shop-section-intro">
          <h2>
            Suchergebnisse<span v-if="searchQuery.trim()"> für „{{ searchQuery.trim() }}“</span>
          </h2>
        </div>
        <div v-else class="shop-section-header">
          <div class="shop-section-intro">
            <h2>Produkte</h2>
            <p class="section-text">
              Picknickkörbe, Party & Event sowie Essen & Getränke – alles in einer Bestellung.
            </p>
          </div>
          <button
            type="button"
            class="btn btn-secondary basket-filter-toggle"
            title="Filter folgt in einer späteren Iteration"
            @click.prevent="noop"
          >
            Filter
          </button>
        </div>
        <p v-if="displayedProducts.length === 0" class="section-text">
          Keine Produkte gefunden.
        </p>

        <div v-if="displayedProducts.length" class="basket-grid">
          <article v-for="product in displayedProducts" :key="product.id" class="card basket-card">
            <img :src="product.imageUrl" :alt="product.imageAlt" />
            <h3>{{ product.title }}</h3>
            <p>{{ product.description }}</p>
            <span class="meta">{{ formatPrice(product) }}</span>
            <a href="#" class="btn btn-secondary basket-btn" @click.prevent="showProductAlert(product)">
              Auswählen
            </a>
          </article>
        </div>
      </section>
    </template>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <h4>Informationen</h4>
        <ul>
          <li><a href="#" @click="noop">AGB</a></li>
          <li><a href="#" @click="noop">Datenschutz</a></li>
          <li><a href="#" @click="noop">Widerrufsrecht</a></li>
        </ul>
      </div>
      <div>
        <h4>EasyGather</h4>
        <ul>
          <li><a href="#" @click="noop">Über uns</a></li>
          <li><a href="#" @click="noop">Kontakt</a></li>
          <li><a href="#" @click="noop">Hilfe</a></li>
        </ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><a href="#" @click="noop">Liefergebiet</a></li>
          <li><a href="#" @click="noop">Bestellstatus</a></li>
          <li><a href="#" @click="noop">Newsletter</a></li>
        </ul>
      </div>
      <div>
        <h4>Folge uns</h4>
        <p>Instagram<br />Facebook<br />TikTok</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
