# frontend-easygather

Frontend for EasyGather – Picknick- und Event-Bestellungen.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue?style=for-the-badge)](https://htwg-in-schneider.github.io/frontend-easygather/)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Iterations

### Iteration 0: Getting started

Created new Vue project with `npm create vue@latest`.

### Iteration 1: Static content

Made static product page from mock work as a Vue project:

- Source: index.html from static project
- Images and CSS go into assets folder
- index.html: Google Fonts
- App.vue: Main content goes here. Logo link adapted.

### Iteration 2: GitHub Page deployment

- Added `.github/workflows/build-and-deploy.js.yml` to deploy as GitHub Page.
- Tweaked `vite.config.js` to use correct base URL - otherwise the JS files won't be loaded when hosted as a GitHub page.

### Iteration 3: Dynamic product loading from local data

- Replaced static product cards with dynamic rendering using Vue's `v-for` from local `products` array in `data.js`.
- Categories are also loaded from `data.js`.
- Products are displayed in a grid.
- "Details" button shows product description in an alert.
- Product images, titles, and prices are now populated from array data.

### Iteration 4: High-Level components

- Vue components in `src/components`: `Navbar.vue`, `Footer.vue`, `ProductCard.vue`.
- `App.vue` uses these components for header, footer, and product cards in the shop.
- Component-specific styles moved from `style.css` into `<style scoped>` sections.
- Product card logic (price formatting, alert on „Auswählen“) lives in `ProductCard.vue`.

### Iteration 5: Low-Level components

- `Button.vue`: reusable button with variants `primary` and `secondary` (plus `register` for the nav).
- `FooterLink.vue`: styled footer links used in `Footer.vue`.
- `ProductCard.vue` and `App.vue` use `Button` instead of raw `<button>` / `.btn` classes.
- Button styles removed from global `style.css` and moved into `Button.vue` (`<style scoped>`).

### Iteration 6: Added Vue-Router and product detail view

- Integrated **Vue Router** (`src/router/index.js`) with `createWebHistory(import.meta.env.BASE_URL)` for GitHub Pages.
- `App.vue` uses `<router-view>`; page content moved to views.
- Routes: `/` (home), `/shop` (product catalog), `/product/:id` (product detail).
- `NavButton.vue`: navigation links styled like buttons (`router-link`).
- `Navbar.vue` and category cards use `router-link` instead of manual page state.
- `ProductCard.vue`: „Auswählen“ links to the product detail view instead of an alert.
- `main.js` registers the router; `index.html` loads `./src/main.js` relatively for GitHub Pages.
- Shared `.btn` styles in `style.css` for `Button` and `NavButton`.

### Iteration 7: State management with Pinia

- Integrated **Pinia** for simple global state (banner visibility across views).
- `npm install pinia`
- New store `src/stores/banner.js` with state `isVisible` and action `hideBanner()`.
- Pinia registered in `main.js` via `createPinia()` and `app.use(pinia)`.
- `SpecialBanner.vue` uses `useBannerStore()`; closing the banner calls `hideBanner()` and stays hidden when navigating between routes.
- Banner placed in `App.vue` (visible on all pages until dismissed).

**Hinweis:** Für EasyGather wäre ein globaler **Warenkorb-Store** (Artikelanzahl in der Navbar, „In den Warenkorb“ auf der Detailseite) inhaltlich die passendere bzw. eigenständigere Pinia-Nutzung. Wir orientieren uns in Iteration 7 am Beispielprojekt *saitenweise-frontend* (Banner-Sichtbarkeit). Ein echter Warenkorb mit Pinia ist für eine spätere Iteration vorgesehen und gehört bewusst **nicht** zum Umfang dieser Abgabe.

### Iteration 8a: Dynamic product loading via REST (dummy data)

- Replaced static product list with data from [dummyjson.com/products](https://dummyjson.com/products).
- New helper `src/api/dummyjson.js` maps API fields (`thumbnail` → `imageUrl`, etc.).
- `ProductCatalog.vue` and `ProductDetail.vue` fetch products on mount (`fetch`, basic error handling).
- `data.js` keeps only **categories** for the home page; product array removed.
- Category filter in the shop applies again from iteration 8b (own backend); in 8a the shop shows all API products.
