<script setup>
import FooterLink from '@/components/FooterLink.vue'

const emit = defineEmits(['noop'])

function onNoop(event) {
  emit('noop', event)
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <h4>Informationen</h4>
        <ul>
          <li><FooterLink text="Impressum" label="Impressum" to="/impressum" /></li>
          <li><FooterLink text="Datenschutz" label="Datenschutz" to="/datenschutz" /></li>
          <li><FooterLink text="AGB" @click="onNoop" /></li>
          <li><FooterLink text="Widerrufsrecht" @click="onNoop" /></li>
        </ul>
      </div>
      <div>
        <h4>EasyGather</h4>
        <ul>
          <li><FooterLink text="Über uns" @click="onNoop" /></li>
          <li><FooterLink text="Kontakt" label="Kontakt" :to="{ path: '/', hash: '#kontakt' }" /></li>
          <li><FooterLink text="Hilfe" @click="onNoop" /></li>
        </ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><FooterLink text="Liefergebiet" @click="onNoop" /></li>
          <li><FooterLink text="Bestellstatus" @click="onNoop" /></li>
          <li><FooterLink text="Newsletter" @click="onNoop" /></li>
        </ul>
      </div>
      <div>
        <h4>Folge uns</h4>
        <p>Instagram<br />Facebook<br />TikTok</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 1.4rem;
  border-top: 1px solid rgba(61, 107, 79, 0.1);
  background: rgba(235, 228, 214, 0.55);
  padding: 1.2rem 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.footer-inner {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .footer-inner {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.footer-inner h4 {
  margin: 0 0 0.45rem;
  font-family: "Fraunces", Georgia, serif;
  color: var(--moss-dark);
  font-size: 1rem;
}

.footer-inner ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.3rem;
}

.footer-inner p {
  margin: 0;
  line-height: 1.55;
}
</style>
