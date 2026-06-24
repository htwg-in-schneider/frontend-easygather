<script setup>
import NavButton from '@/components/NavButton.vue'
</script>

<template>
  <section class="legal-page">
    <h2>Datenschutzerklärung</h2>
    <p>
      Der Schutz deiner personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir dich über die
      Verarbeitung im Rahmen des EasyGather-Projekts.
    </p>

    <h3>Verantwortliche</h3>
    <p>
      Ardonesa Maloku, Leah Reinbold<br />
      Alfred-Wachtel-Straße 8, 78462 Konstanz<br />
      E-Mail:
      <a href="mailto:kontakt@easygather.de">kontakt@easygather.de</a>
    </p>

    <h3>Anmeldung und Authentifizierung</h3>
    <p>
      Für Login und Registrierung nutzen wir Auth0. Dabei werden Anmeldedaten (z. B. E-Mail-Adresse) bei Auth0
      verarbeitet. Details findest du in der
      <a href="https://auth0.com/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung von Auth0</a>.
    </p>

    <h3>Bestell- und Profildaten</h3>
    <p>
      Wenn du eingeloggt bist, können Bestell- und Profildaten in unserem Backend gespeichert werden, um den
      Bestellablauf und dein Nutzerprofil bereitzustellen.
    </p>

    <h3>Kontaktformular</h3>
    <p>
      Über das Kontaktformular auf der Startseite öffnest du dein E-Mail-Programm (mailto). Die Nachricht wird
      nicht auf unseren Servern gespeichert, sondern direkt von deinem Gerät versendet.
    </p>

    <h3>Deine Rechte</h3>
    <p>
      Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner personenbezogenen Daten. Wende dich dazu
      an die oben genannte Kontaktadresse.
    </p>

    <div class="legal-page-actions">
      <NavButton to="/">Zur Startseite</NavButton>
    </div>
  </section>
</template>
