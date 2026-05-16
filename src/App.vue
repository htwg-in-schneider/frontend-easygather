<script setup></script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a href="#" class="logo">EasyGather</a>
      <nav class="nav-main">
        <a href="#">Liefergebiet</a>
        <a href="#">Shop</a>
        <a href="#">Warenkorb</a>
        <a href="#">Anmelden</a>
        <a href="#" class="nav-register">Registrieren</a>
      </nav>
    </div>
  </header>

  <main>
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
          <a href="#" class="btn btn-primary">Shop durchsuchen</a>
          <a href="#" class="btn btn-secondary">Liefergebiet auswählen</a>
        </div>
      </div>

      <div class="hero-visual">
        <img src="./assets/FreundePicknick.jpg" alt="Freunde genießen ein Picknick im Park" />
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
        <a href="#" class="card category-card category-link" aria-label="Kategorie Picknickkörbe öffnen">
          <img src="./assets/Picknickkorb.jpg" alt="Picknickkorb mit Brot und Obst" />
          <h3>Picknickkörbe</h3>
          <p>Kuratierte Körbe für Dates, Familienausflüge und spontane Treffen im Freien.</p>
          <span class="meta">12 Produkte →</span>
        </a>
        <a href="#" class="card category-card category-link" aria-label="Kategorie Party und Event öffnen">
          <img src="./assets/Events.jpg" alt="Dekorierter Tisch bei einer kleinen Feier" />
          <h3>Party & Event</h3>
          <p>Dekor, Spiele und passendes Zubehör für Geburtstage und kleine Feiern.</p>
          <span class="meta">12 Produkte →</span>
        </a>
        <a href="#" class="card category-card category-link" aria-label="Kategorie Essen und Getränke öffnen">
          <img src="./assets/Essen.jpg" alt="Auswahl an Speisen und Getränken auf einem Tisch" />
          <h3>Essen & Getränke</h3>
          <p>Pizza, Snacks, Salate und Getränke für jeden Anlass und jede Gruppengröße.</p>
          <span class="meta">12 Produkte →</span>
        </a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <h4>Informationen</h4>
        <ul>
          <li><a href="#">AGB</a></li>
          <li><a href="#">Datenschutz</a></li>
          <li><a href="#">Widerrufsrecht</a></li>
        </ul>
      </div>
      <div>
        <h4>EasyGather</h4>
        <ul>
          <li><a href="#">Über uns</a></li>
          <li><a href="#">Kontakt</a></li>
          <li><a href="#">Hilfe</a></li>
        </ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><a href="#">Liefergebiet</a></li>
          <li><a href="#">Bestellstatus</a></li>
          <li><a href="#">Newsletter</a></li>
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
