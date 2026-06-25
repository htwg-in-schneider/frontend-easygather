<script setup>
import FooterLink from '@/components/FooterLink.vue'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <h4>Informationen</h4>
        <ul>
          <li><FooterLink text="Impressum" to="/impressum" /></li>
          <li><FooterLink text="Datenschutz" to="/datenschutz" /></li>
        </ul>
      </div>
      <div>
        <h4>EasyGather</h4>
        <ul>
          <li><FooterLink text="Shop" to="/shop" /></li>
          <li><FooterLink text="Kontakt" :to="{ path: '/', hash: '#kontakt' }" /></li>
        </ul>
      </div>
      <div>
        <h4>Konto</h4>
        <ul>
          <li><FooterLink text="Meine Bestellungen" to="/orders" /></li>
          <li><FooterLink text="Mein Profil" to="/profile" /></li>
        </ul>
      </div>
    </div>
    <p class="footer-note">Picknick- und Event-Lieferung in Konstanz und Umgebung.</p>
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

.footer-note {
  max-width: 72rem;
  margin: 1rem auto 0;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(61, 107, 79, 0.08);
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
