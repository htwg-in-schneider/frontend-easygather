<script setup>
import { ref, onMounted } from 'vue'
import { fetchCategories } from '@/api/backend.js'
import { mapCategoryForHome } from '@/categoryImages.js'
import { categories as fallbackCategories } from '@/data.js'
import freundePicknickImg from '@/assets/FreundePicknick.jpg'
import Button from '@/components/Button.vue'
import NavButton from '@/components/NavButton.vue'

const contactForm = ref({
  name: '',
  email: '',
  message: '',
})

const homeCategories = ref([...fallbackCategories])

const contactEmail = 'kontakt@easygather.de'

onMounted(async () => {
  try {
    const data = await fetchCategories()
    if (data.length) {
      homeCategories.value = data.map(mapCategoryForHome)
    }
  } catch (err) {
    console.error('Could not load categories for home:', err)
  }
})

function submitContact() {
  const subject = encodeURIComponent(`Kontaktanfrage von ${contactForm.value.name}`)
  const body = encodeURIComponent(
    `Name: ${contactForm.value.name}\nE-Mail: ${contactForm.value.email}\n\n${contactForm.value.message}`,
  )
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  contactForm.value = { name: '', email: '', message: '' }
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
        <Button variant="secondary" href="#kontakt">Kontakt aufnehmen</Button>
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
        v-for="category in homeCategories"
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

  <section id="kontakt">
    <h2>Kontakt</h2>
    <p class="section-text">
      Du hast Fragen zu EasyGather oder zu deiner Bestellung? Schreib uns – wir melden uns so schnell wie möglich.
    </p>
    <form class="product-form contact-form" @submit.prevent="submitContact">
      <div class="product-form-field">
        <label for="contactName">Name</label>
        <input id="contactName" v-model="contactForm.name" type="text" required />
      </div>
      <div class="product-form-field">
        <label for="contactEmail">E-Mail</label>
        <input id="contactEmail" v-model="contactForm.email" type="email" required />
      </div>
      <div class="product-form-field">
        <label for="contactMessage">Nachricht</label>
        <textarea id="contactMessage" v-model="contactForm.message" rows="4" required />
      </div>
      <Button type="submit" variant="primary">Nachricht senden</Button>
    </form>
  </section>
</template>
