<script setup>
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
          <li><a href="#" @click="onNoop">AGB</a></li>
          <li><a href="#" @click="onNoop">Datenschutz</a></li>
          <li><a href="#" @click="onNoop">Widerrufsrecht</a></li>
        </ul>
      </div>
      <div>
        <h4>EasyGather</h4>
        <ul>
          <li><a href="#" @click="onNoop">Über uns</a></li>
          <li><a href="#" @click="onNoop">Kontakt</a></li>
          <li><a href="#" @click="onNoop">Hilfe</a></li>
        </ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><a href="#" @click="onNoop">Liefergebiet</a></li>
          <li><a href="#" @click="onNoop">Bestellstatus</a></li>
          <li><a href="#" @click="onNoop">Newsletter</a></li>
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

.footer-inner a {
  color: var(--muted);
  text-decoration: none;
}

.footer-inner a:hover {
  color: var(--terracotta);
}

.footer-inner p {
  margin: 0;
  line-height: 1.55;
}
</style>
