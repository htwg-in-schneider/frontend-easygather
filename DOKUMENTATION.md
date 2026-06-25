# EasyGather – Projektdokumentation (Abgabe 5)

**Team:** Ardonesa Maloku, Leah Reinbold  
**Projekt:** EasyGather – Picknick- und Event-Bestellungen  
**Repositories:** [frontend-easygather](https://github.com/htwg-in-schneider/frontend-easygather) · [easygather-backend](https://github.com/htwg-in-schneider/easygather-backend)

> Die **schrittweise Entwicklung** (Iterationen 0–22) bleibt im [README.md](./README.md) erhalten – bitte beide Dokumente lesen.

**Backend-Doku:** [easygather-backend/DOKUMENTATION.md](https://github.com/htwg-in-schneider/easygather-backend/blob/main/DOKUMENTATION.md) (API, Datenbank, Deployment, Sicherheit)

---

## Inhaltsverzeichnis

1. [Kurzüberblick](#1-kurzüberblick)
2. [Spezifikation und Design (Original)](#2-spezifikation-und-design-original)
3. [Abweichungen zur ursprünglichen Spezifikation](#3-abweichungen-zur-ursprünglichen-spezifikation)
4. [Implementierung der Use Cases](#4-implementierung-der-use-cases)
5. [Weitere Anforderungen (Aufgabe 5)](#5-weitere-anforderungen-aufgabe-5)
6. [Bereitstellung und Testzugänge](#6-bereitstellung-und-testzugänge)
7. [Technische Architektur (Kurz)](#7-technische-architektur-kurz)
8. [Verweise](#8-verweise)

---

## 1. Kurzüberblick

EasyGather ist eine Webanwendung, mit der Nutzer:innen Picknickkörbe, Essen & Getränke sowie Party- und Event-Artikel auswählen und in **einer Bestellung** bestellen können. Ziel ist weniger Planungsaufwand bei spontanen Treffen, Geburtstagen oder Picknicks im Freien.

| Schicht | Technologie |
|--------|-------------|
| Frontend | Vue 3, Vue Router, Pinia, Auth0, Vite |
| Backend | Spring Boot, Spring Data JPA, Spring Security (OAuth2/JWT) |
| Datenbank lokal | H2 |
| Datenbank Produktion | MariaDB (HTWG Cloud) |
| Auth | Auth0 (Resource Server im Backend) |
| Deployment Frontend | GitHub Pages (GitHub Actions) |
| Deployment Backend | Render.com (Docker) |

**Live-URLs**

| Umgebung | URL |
|----------|-----|
| Frontend (GitHub Pages) | https://htwg-in-schneider.github.io/frontend-easygather/ |
| Backend (Render) | https://easygather-backend.onrender.com |

---

## 2. Spezifikation und Design (Original)

Die folgenden Inhalte stammen aus den Projektarbeitsblättern (Blatt 1–3) und dem Figma-Wireflow. Sie beschreiben die **ursprüngliche Planung**. Abschnitt [3](#3-abweichungen-zur-ursprünglichen-spezifikation) dokumentiert, was sich in der Umsetzung geändert hat.

### 2.1 Problemstellung und Ziele

**Probleme (Original)**

- Planung von Picknicks, Geburtstagen oder kleinen Feiern ist oft aufwendig.
- Essen, Getränke und Zubehör müssen häufig bei verschiedenen Anbietern gesucht und bestellt werden.
- Es fehlen einfache, vorkonfigurierte Angebote für spontane Anlässe.
- Auswahl und Bestellung mit Lieferung an einen Wunschort ist umständlich.

**Ziele der Webanwendung (Original)**

- Planung von Picknicks, kleinen Feiern und spontanen Treffen vereinfachen.
- Zentrale, übersichtliche Lösung für passende Angebote (Essen, Getränke, Zubehör).
- Weg von der Planung bis zur Bestellung einfach, verständlich und digital unterstützen.
- Gemeinsame Momente flexibel und ortsunabhängig organisieren.

### 2.2 Personas

**Lisa Becker (28)** – Marketing, organisiert spontane Treffen und kleine Geburtstage, nutzt viel das Smartphone, will schnell passende Angebote finden und möglichst alles in einer Bestellung kombinieren.

**Thomas Weber (61)** – gelegentlich Familienfeiern/Gartenrunden, bevorzugt klare Websites, vorsichtig bei Online-Bestellungen, will verständliche Schritte und verlässliche Bestätigung.

Das UI (klare Navigation, Schritt-für-Schritt-Checkout, deutsche Texte, große Klickflächen) orientiert sich an diesen Personas.

### 2.3 Design (Style Tile)

| Element | Umsetzung |
|---------|-----------|
| Stil | gemütlich, warm, freundlich, natürlich, unkompliziert |
| Schrift Überschriften | **Fraunces** (Serif) |
| Schrift Fließtext / UI | System-Sans / **DM Sans**-ähnlich |
| Farben | Moosgrün `#3D6B4F`, Dunkel `#1F2D24` / `#2A4A36`, Creme `#FAF6EF`, Beige `#EBE4D6`, Terrakotta `#C96B4A` |
| Seitenstruktur | Header mit Navigation, Hero, Kategorie-Karten, Kontaktbereich, mehrspaltiger Footer |

CSS-Variablen in `src/assets/style.css` (`--moss`, `--cream`, `--terracotta`, …).

### 2.4 Use-Case-Übersicht (Original)

| Akteur | Use Cases (geplant) |
|--------|---------------------|
| **Besucher** | Produkt suchen, Produktdetails anzeigen, Liefergebiet auswählen, Konto registrieren |
| **Kunde** | wie Besucher + Warenkorb, Bestellung, Zahlung, Bestellhistorie, An-/Abmelden, Profil ändern |
| **Fahrer** | Lieferaufträge anzeigen, Bestellstatus ändern, An-/Abmelden |

**Zusätzlich in der Abgabe gefordert (nicht im ursprünglichen UC-Diagramm):**

| Akteur | Funktion |
|--------|----------|
| **Administrator** | Stammdaten verwalten (Produkte, Kategorien), Nutzer bearbeiten, Bestellungen und Lieferungen einsehen/zuweisen |

### 2.5 Datenmodell (Original UML)

Geplant waren u. a. **Konto**, **Warenkorb**, **Warenkorbposition**, **Produkt**, **Kategorie**, **Bestellung**, **Bestellposition**, **Zahlung**, **Lieferauftrag**, **Lieferadresse** mit Enums für Kontotyp, Bestellstatus, Zahlungsart und Lieferstatus.

**Umsetzung heute (vereinfacht):**

- Auth0 + `User` im Backend (Rolle: `KUNDE`, `FAHRER`, `ADMIN`) statt eigenem Passwort-Hash im System.
- Warenkorb nur im **Frontend** (Pinia + `localStorage`, pro Auth0-Konto), nicht als persistente Backend-Entität.
- `Order` / `OrderItem` im Backend; Lieferadresse und Zahlungsart werden mit der Bestellung gespeichert.
- `DeliveryOrder` mit Status-Workflow und Fahrer-Zuweisung.
- Details: [Backend-DOKUMENTATION.md](https://github.com/htwg-in-schneider/easygather-backend/blob/main/DOKUMENTATION.md#datenmodell)

### 2.6 Hinweis aus dem Figma-Wireflow (Original)

Im Wireflow waren viele Aktionen nur für eingeloggte Kund:innen sichtbar. Geplant war später: **Produkte und Warenkorb auch als Besucher**, Login erst beim Checkout. Das ist in der finalen Anwendung so umgesetzt (siehe [UC 2](#use-case-2--benutzer-an--abmelden)).

---

## 3. Abweichungen zur ursprünglichen Spezifikation

| Thema | Spezifikation | Umsetzung |
|-------|---------------|-----------|
| **Registrierung (UC 1)** | Besucher kann Konto anlegen | **Nicht implementiert** – laut Aufgabenstellung 5b nicht erforderlich; Konten in Auth0 + `DataLoader` |
| **Liefergebiet (UC 5)** | Liefergebiet wählen, Angebote filtern | **Nicht umgesetzt** – bewusst weggelassen (Wireflow-Hinweis: evtl. zu komplex); Lieferadresse im Checkout |
| **Liefergebiet in Navigation** | Link/Button vorhanden | Entfernt (Iteration 22), keine toten Links |
| **Registrieren-Button** | im Wireflow | Entfernt; nur **Anmelden** |
| **Gast-Warenkorb** | später geplant | Shop und Warenkorb ohne Login; Login ab Checkout (`authGuard`) |
| **Zahlungs-UI** | Formular unter Bezahlen | Zahlungsdetails **direkt unter** der gewählten Methode (Karte / PayPal / Rechnung) |
| **Picknickkorb konfigurieren** | nicht in Original-UCs | Zusatzfeature: eigener Konfigurator (`/picknickkorb/konfigurieren`, Iteration 21) |
| **Admin-Bereich** | nicht im UC-Diagramm | Vollständig für Abgabe 5d: `/admin`, Stammdaten, Bestellungen, Lieferungen |
| **E-Mail-Bestätigung** | implizit erwünscht | Auf Render **kein SMTP** – Bestellungen werden gespeichert, E-Mail-Versand in Produktion nicht möglich (Backend-README) |

---

## 4. Implementierung der Use Cases

Für jeden Use Case: **Zusammenfassung (Original)** → **Umsetzung (Ist)** mit Routen und zentralen Dateien.

### Use Case 1 – Konto registrieren

**Original:** Besucher legt Konto mit E-Mail/Passwort an; optional Kunde oder Fahrer.

**Umsetzung:** **Entfällt.** Testkonten sind in Auth0 angelegt und werden beim ersten Login über `ProfileController` / `DataLoader` mit der Backend-Rolle verknüpft.

---

### Use Case 2 – Benutzer an-/abmelden

**Original:** Login mit E-Mail/Passwort; Fehlermeldung bei falschen Daten; Logout.

**Umsetzung:**

- **Anmelden:** grüner Button in `Navbar.vue` → Auth0 `loginWithRedirect` (`useAuthLogin.js`)
- **Abmelden:** Auth0 `logout` mit Rückkehr zur GitHub-Pages-URL
- **Rollen:** nach Login lädt `useUserProfile.js` das Profil (`GET /api/profile`); Navigation je nach `KUNDE` / `FAHRER` / `ADMIN`
- **Rückkehr nach Login:** z. B. Warenkorb/Checkout über `sessionStorage` (`auth0_return_to`)

| Rolle | Startseite nach Login |
|-------|------------------------|
| Kunde | `/` (Home) |
| Fahrer | `/lieferauftraege` |
| Admin | `/admin` |

---

### Use Case 3 – Produkt suchen

**Original:** Suche und Filter (Kategorie, Preis); Rückmeldung wenn nichts gefunden.

**Umsetzung:**

- Route `/shop` → `ProductCatalog.vue`
- Suche in der Navbar (`?name=`) und Filter-Panel (`ProductFilterPanel.vue`: Kategorie, Max-Preis)
- API: `GET /api/product?name=&shopCategory=&maxPrice=`
- Admin: Globalsuche über Stammdaten (`useAdminGlobalSearch.js`, Iteration 20)

---

### Use Case 4 – Produktdetails anzeigen

**Original:** Beschreibung, Preis, enthaltene Artikel; „In den Warenkorb“.

**Umsetzung:**

- Route `/product/view/:id` → `ProductDetail.vue`
- `includedItems` aus dem Backend; Bilder über `productImages.js` / Upload (Admin)
- **Picknickkorb konfigurieren:** eigene Route `/picknickkorb/konfigurieren` → `ConfigureBasketView.vue` (Banner in Picknickkörbe-Kategorie)

---

### Use Case 5 – Liefergebiet auswählen

**Original:** Liefergebiet wählen, Angebote danach filtern.

**Umsetzung:** **Nicht gebaut** (siehe Abschnitt 3). Stattdessen: Lieferadresse in `CheckoutDeliveryView.vue` (Straße, PLZ, Ort, Name, Telefon).

---

### Use Case 6 – Warenkorb verwalten

**Original:** Produkte hinzufügen/entfernen, Menge ändern, Gesamtpreis.

**Umsetzung:**

- Route `/cart` → `CartView.vue`
- Pinia-Store `stores/cart.js` (pro Auth0-`sub` in `localStorage`; Gäste-Warenkorb bis Login)
- Mengenänderung, Entfernen mit `ConfirmModal.vue`, Gutschein **EASY10** (`CouponField.vue`)
- Konfigurator: `addToCartWithQuantity()` – mehrere Positionen auf einmal

---

### Use Case 7 – Bestellung durchführen

**Original:** Lieferadresse und Pflichtdaten; Validierung vor Zahlung.

**Umsetzung (mehrseitiger Checkout):**

1. `/cart` – Warenkorb prüfen  
2. `/checkout/delivery` – `CheckoutDeliveryView.vue` (Schritt 1, aus Profil vorausgefüllt)  
3. `/checkout/payment` – `CheckoutPaymentView.vue` (Schritt 2)  
4. `POST /api/order` → `/order/confirmation/:id`

Checkout-Routen mit `authGuard` (Login erforderlich).

---

### Use Case 8 – Zahlung durchführen

**Original:** Zahlungsmethode wählen, Daten eingeben, bezahlen, Bestätigung.

**Umsetzung:**

- `CheckoutPaymentView.vue`: **Kreditkarte**, **PayPal**, **Rechnung** (simuliert, keine echte Zahlungsanbindung)
- Formularfelder erscheinen **unter der jeweiligen Radio-Option**
- Client-Validierung (`validatePaymentForm()`); Backend speichert `paymentMethod` an der Bestellung
- Button „Jetzt bezahlen“ → Bestellung anlegen, Warenkorb leeren

---

### Use Case 9 – Bestellungen anzeigen

**Original:** Kunde sieht frühere Bestellungen mit Datum, Inhalt, Status.

**Umsetzung:**

- `/orders` → `OrdersView.vue` (Liste)
- `/orders/:id` → `OrderDetailView.vue` (Detail, „Erneut bestellen“)
- API: `GET /api/order`, `GET /api/order/{id}`
- Bestellnummern z. B. `EG-0001`

---

### Use Case 10 – Profil ändern

**Original:** Name, Kontakt; Passwort ändern mit Validierung.

**Umsetzung:**

- `/profile` → `ProfileView.vue` (`authGuard`)
- Bearbeitbar: Vorname, Nachname, Straße, PLZ, Ort
- E-Mail und Rolle: nur Anzeige
- Passwort: Link/Anfrage über Auth0 (kein eigenes Passwort-Backend)
- API: `PUT /api/profile`

---

### Use Case 11 – Lieferaufträge anzeigen

**Original:** Fahrer sieht zugewiesene Aufträge mit Adresse und Inhalt.

**Umsetzung:**

- `/lieferauftraege` → `DriverDashboardView.vue`
- API: `GET /api/delivery` (eigene Lieferungen des eingeloggten Fahrers)
- Filter nach Status (`DeliveryFilterPanel.vue`)
- Fahrer: keine Shop-/Warenkorb-Navigation

---

### Use Case 12 – Bestellstatus ändern

**Original:** Fahrer setzt Status (z. B. unterwegs, geliefert).

**Umsetzung:**

- Status-Dropdown im Fahrer-Dashboard
- API: `PUT /api/delivery/{id}/status`
- Workflow: `EINGEGANGEN` → `ANGENOMMEN` → `UNTERWEGS` → `GELIEFERT` (Fahrer-Annahme, Iteration 12/17)
- Admin kann Fahrer zuweisen: `DeliveriesAdminView.vue`, `/admin/deliveries`

---

### Admin – Stammdaten und Transaktionen (Aufgabe 5d)

| Bereich | Route | Funktion |
|---------|-------|----------|
| Admin-Hub | `/admin` | `AdminView.vue` |
| Produkte | `/shop` + `/product/create`, `/product/edit/:id` | CRUD, Suche, Bild-Upload |
| Kategorien | `/admin/categories` | CRUD, Suche |
| Nutzer | `/admin/users`, `/admin/users/edit/:id` | **Anzeigen + Bearbeiten**, kein Anlegen |
| Bestellungen | `/admin/orders`, `/admin/orders/:id` | Suche, Detail |
| Lieferungen | `/admin/deliveries` | Suche, Fahrer zu-/abweisen |

Schutz: `authGuard` + `useAdminAccess.js` / Backend-Rolle `ADMIN`.

---

## 5. Weitere Anforderungen (Aufgabe 5)

| Punkt | Erfüllung |
|-------|-----------|
| **a) Startseite** | `HomeView.vue`: Hero, Kategorien, Kontaktformular (`mailto:`), Impressum/Datenschutz im Footer; responsive |
| **b) Benutzerverwaltung** | Öffentlich / Kunde / Admin (+ Fahrer); Login via Auth0; Profil selbst bearbeiten; keine Registrierung |
| **c) Komplexe Vorgänge** | Checkout über mehrere Views; Admin verfolgt Bestellungen & Lieferungen |
| **d) Stammdaten** | Admin-CRUD + Suche; Nutzer nur Edit |
| **e) Consistency / Usability** | Einheitliches Design; nur funktionierende Links (Iteration 22); responsive inkl. Admin |
| **f) Security** | JWT im Backend, `SecurityConfig`; Validierung FE+BE (Checkout, Profil, Produkte, Bestellungen) |
| **g) Deployment** | GitHub Pages + Render + MariaDB; `DataLoader` mit Testdaten |
| **h) Code-Qualität** | Router, Komponenten, Pinia; README-Iterationen; Hardcoded-Werte dokumentiert (unten) |
| **i) Dokumentation** | Diese Datei + Backend-[DOKUMENTATION.md](https://github.com/htwg-in-schneider/easygather-backend/blob/main/DOKUMENTATION.md) + README-Iterationen |

### Hardcodierte Werte (Frontend)

| Was | Wo | Hinweis |
|-----|-----|---------|
| Versand **4,90 €** | `stores/cart.js` → `SHIPPING_COST` | Muss zu `OrderController.SHIPPING_COST` passen |
| Gutschein **EASY10** (10 %) | `stores/cart.js` | Muss zu Backend `VALID_COUPON_CODE` passen |
| Startseiten-Kategorie-Kacheln | `data.js` | Marketing; Shop-Daten aus API |
| Auth0 / API-URL | `.env.development`, `.env.production` | `VITE_*` Variablen |

Vollständige Tabelle auch im [README.md](./README.md) (Abschnitt „Configuration notes“).

---

## 6. Bereitstellung und Testzugänge

### 6.1 URLs

| Komponente | URL |
|------------|-----|
| **Webanwendung** | https://htwg-in-schneider.github.io/frontend-easygather/ |
| **REST-API** | https://easygather-backend.onrender.com |
| **API Produkte (Test)** | https://easygather-backend.onrender.com/api/product |

**Hinweis Render (Free Tier):** Nach längerer Inaktivität kann der erste API-Aufruf **30–60 Sekunden** dauern (Cold Start). Danach antwortet die API normal. Das Frontend wartet bis zu 90 Sekunden (`API_FETCH_TIMEOUT_MS` in `backend.js`).

**Deployment automatisch:** Push auf `main` → GitHub Actions (Frontend) bzw. Render Auto-Deploy (Backend). Details in den README-Iterationen 13/18 (Backend) und 18 (Frontend).

### 6.2 Testzugänge (Auth0)

Passwörter werden in **Auth0** verwaltet (nicht im Quellcode). Folgende Konten sind für die Prüfung vorgesehen:

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| **Kunde** | `maloku.ardonesa+kunde@gmail.com` | `testk123!` |
| **Administrator** | `maloku.ardonesa+admin@gmail.com` | `testa123!` |
| **Fahrer** | `maloku.ardonesa+fahrer@gmail.com` | `testf123!` |
| **Fahrer** (zweites Konto) | `maloku.ardonesa+fahrer2@gmail.com` | `testf123!` |

Die Zuordnung zur Backend-Rolle erfolgt in `DataLoader.java` (`loadInitialUsers`). Beim **ersten Login** wird das Profil in der Datenbank angelegt bzw. verknüpft.

**Empfohlener Prüfpfad**

1. Als **Gast:** Shop öffnen, Produkt in Warenkorb.  
2. Als **Kunde:** Checkout durchspielen → „Meine Bestellungen“.  
3. Als **Admin:** Bestellung unter `/admin/orders` prüfen; ggf. Fahrer unter `/admin/deliveries` zuweisen.  
4. Als **Fahrer:** `/lieferauftraege` → Status ändern.

---

## 7. Technische Architektur (Kurz)

```
Browser (Vue 3 SPA)
    │  HTTPS
    ├─► GitHub Pages (statisches Frontend)
    │
    └─► Render (Spring Boot)
            │
            └─► MariaDB (Produktion) / H2 (lokal)
                    ▲
            Auth0 JWT (Resource Server)
```

- Öffentliche Lese-API: `GET /api/product`, `GET /api/category` (ohne Token, eigene Security-Chain)
- Geschützt: Profil, Bestellungen, Lieferungen, Admin-APIs, Schreibzugriffe auf Produkte/Kategorien

---

## 8. Verweise

| Dokument | Inhalt |
|----------|--------|
| [README.md](./README.md) | **Iterationen 0–22** – chronologische Entwicklung Frontend |
| [easygather-backend/DOKUMENTATION.md](https://github.com/htwg-in-schneider/easygather-backend/blob/main/DOKUMENTATION.md) | API, Datenbank, Sicherheit, Backend-Deployment |
| [easygather-backend/README.md](https://github.com/htwg-in-schneider/easygather-backend/blob/main/README.md) | **Iterationen 0–15** Backend |

**Autoren:** Ardonesa Maloku, Leah Reinbold · HTWG Konstanz · Webtechnologien · EasyGather
