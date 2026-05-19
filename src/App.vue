<script setup>
import { ref, computed } from 'vue'
import { categories, products } from './data.js'
import freundePicknickImg from './assets/FreundePicknick.jpg'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import Button from '@/components/Button.vue'

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

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
  <Navbar
    :shop-active="currentPage === 'shop' || currentPage === 'search'"
    @home="goHome"
    @shop="goShop"
    @noop="noop"
  />

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
            <Button variant="primary" href="#" @click="goShop">Shop durchsuchen</Button>
            <Button variant="secondary" href="#" @click="noop">Liefergebiet auswählen</Button>
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
          <Button
            variant="secondary"
            class="basket-filter-toggle"
            title="Filter folgt in einer späteren Iteration"
            @click="noop"
          >
            Filter
          </Button>
        </div>
        <p v-if="displayedProducts.length === 0" class="section-text">
          Keine Produkte gefunden.
        </p>

        <div v-if="displayedProducts.length" class="basket-grid">
          <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
        </div>
      </section>
    </template>
  </main>

  <Footer @noop="noop" />
</template>

<style scoped></style>
