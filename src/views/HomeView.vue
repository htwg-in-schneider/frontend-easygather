<script setup>
import { categories } from '@/data.js'
import freundePicknickImg from '@/assets/FreundePicknick.jpg'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

function getCategories() {
  return categories
}

function noop(event) {
  event?.preventDefault()
}
</script>

<template>
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
        <NavButton to="/shop" variant="primary">Shop durchsuchen</NavButton>
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
      <router-link
        v-for="category in getCategories()"
        :key="category.id"
        :to="{ path: '/shop', query: { category: category.shopCategory } }"
        class="card category-card category-link"
        :aria-label="category.ariaLabel"
      >
        <img :src="category.imageUrl" :alt="category.imageAlt" />
        <h3>{{ category.title }}</h3>
        <p>{{ category.description }}</p>
        <span class="meta">{{ category.meta }}</span>
      </router-link>
    </div>
  </section>
</template>
