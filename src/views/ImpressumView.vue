<script setup>
import NavButton from '@/components/NavButton.vue'
</script>

<template>
  <section class="legal-page">
    <h2>Impressum</h2>
    <p>Angaben gemäß § 5 TMG</p>

    <h3>EasyGather</h3>
    <p>
      Ardonesa Maloku, Leah Reinbold<br />
      Alfred-Wachtel-Straße 8<br />
      78462 Konstanz
    </p>

    <h3>Kontakt</h3>
    <p>
      E-Mail:
      <a href="mailto:kontakt@easygather.de">kontakt@easygather.de</a>
    </p>

    <h3>Verantwortlich für den Inhalt</h3>
    <p>Ardonesa Maloku, Leah Reinbold (HTWG Konstanz, Web Technologies)</p>

    <h3>Hinweis</h3>
    <p>
      EasyGather ist ein studentisches Übungsprojekt im Rahmen der Vorlesung Web Technologies an der HTWG
      Konstanz. Es handelt sich nicht um ein echtes gewerbliches Angebot.
    </p>

    <div class="legal-page-actions">
      <NavButton to="/">Zur Startseite</NavButton>
    </div>
  </section>
</template>
