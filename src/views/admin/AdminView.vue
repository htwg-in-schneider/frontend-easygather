<script setup>
import { onMounted } from 'vue'
import NavButton from '@/components/NavButton.vue'
import { useAdminAccess } from '@/composables/useAdminAccess.js'

const { ensureAdmin } = useAdminAccess()

const sections = [
  {
    title: 'Produkte',
    description: 'Produktkatalog verwalten, anlegen und bearbeiten.',
    to: '/shop',
    cta: 'Zum Shop',
  },
  {
    title: 'Kategorien',
    description: 'Shop-Kategorien pflegen und Produkte strukturieren.',
    to: '/admin/categories',
    cta: 'Kategorien öffnen',
  },
  {
    title: 'Nutzer',
    description: 'Benutzerkonten anzeigen und Rollen bearbeiten.',
    to: '/admin/users',
    cta: 'Nutzer verwalten',
  },
  {
    title: 'Bestellungen',
    description: 'Alle Kundenbestellungen einsehen und nachvollziehen.',
    to: '/admin/orders',
    cta: 'Bestellungen anzeigen',
  },
]

onMounted(async () => {
  await ensureAdmin()
})
</script>

<template>
  <section class="admin-page">
    <header class="admin-header">
      <p class="eyebrow">Administration</p>
      <h2>Stammdaten verwalten</h2>
      <p class="section-text">
        Verwalte Produkte, Kategorien, Nutzer und Bestellungen zentral an einem Ort.
      </p>
    </header>

    <div class="admin-grid">
      <article v-for="section in sections" :key="section.title" class="admin-card card">
        <h3>{{ section.title }}</h3>
        <p>{{ section.description }}</p>
        <NavButton :to="section.to" variant="primary">{{ section.cta }}</NavButton>
      </article>
    </div>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.admin-header {
  margin-bottom: 1.25rem;
}

.admin-header h2 {
  margin: 0.2rem 0 0.45rem;
}

.admin-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .admin-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.admin-card {
  padding: 1.1rem;
  display: grid;
  gap: 0.65rem;
  align-content: start;
}

.admin-card h3 {
  margin: 0;
  font-size: 1.15rem;
}

.admin-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
  flex: 1;
}
</style>
