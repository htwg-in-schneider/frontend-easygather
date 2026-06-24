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

### Iteration 8b: Dynamic product loading via REST backend (real data)

- Replaced dummyjson with data from our REST backend (`http://localhost:8081/api/product`).
- New helper `src/api/backend.js` – loads title, price, description, category from the API.
- Product images use local files from `src/assets` via `src/productImages.js` (backend `imageUrl` are placeholders only).
- `ProductCatalog.vue` and `ProductDetail.vue` use `fetchAllProducts` / `fetchProductById` from the backend API.
- Backend must be running (`.\mvnw.cmd spring-boot:run` in `easygather-backend`).
- Optional: `VITE_API_BASE_URL` in `.env` for another API host (default: `http://localhost:8081`).
- Filter UI in the shop was added in iteration 10a; backend also supports `maxPrice` for later use.

### Iteration 10a: Product Search and Filter

- **Search:** search field in the **navbar** next to the logo (`Enter` → `/shop?name=...`, then `GET /api/product?name=...`).
- **Filter:** **Filter** button opens a panel (`ProductFilterPanel.vue`): category dropdown, free **max price** input, **Filter anwenden** / **Zurücksetzen**.
- **Homepage:** category cards link to `/shop?category=...`; the shop applies that category filter automatically.
- Categories and translations from `GET /api/category` and `GET /api/category/translation`.
- `fetchProducts()` in `backend.js` builds the query (`name`, `shopCategory`).

### Iteration 9: Complete CRUD of products via REST

- New views `CreateProduct.vue` and `EditProduct.vue` with forms for create, update, and delete.
- Categories and translations loaded from `GET /api/category` and `GET /api/category/translation`.
- API calls via `src/api/backend.js`: `POST /api/product`, `PUT /api/product/:id`, `DELETE /api/product/:id` (category sent as `{ id }` for the EasyGather backend).
- `ProductCatalog`: button **Neues Produkt** → `/product/create`.
- `ProductCard`: **Bearbeiten** → `/product/edit/:id`; **Auswählen** → `/product/view/:id`.
- Success and error feedback with simple `alert()` dialogs.

### Iteration 11: User authentication with Auth0

- Added `@auth0/auth0-vue` and Auth0 configuration in `.env.development` (`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`)
- `main.js`: registered Auth0 plugin with audience and redirect URI (GitHub Pages compatible via `BASE_URL`)
- `Navbar.vue`: real login via `loginWithRedirect()`, logout with return URL; shows user email when logged in; „Registrieren“ remains a placeholder
- `backend.js`: `fetchProfile(accessToken)`; create/update/delete product send `Authorization: Bearer` header
- `ProductCatalog.vue`: loads profile after login; shows „Neues Produkt“ and „Bearbeiten“ only for `ADMIN` role
- `CreateProduct.vue` / `EditProduct.vue`: obtain access token via `getAccessTokenSilently()` for protected API calls

### Iteration 12: Start page with contact, imprint and privacy

- `HomeView.vue`: new contact section with form (name, e-mail, message); submit opens `mailto:` with prefilled subject and body; form fields reset after submit
- New views `ImpressumView.vue` and `DatenschutzView.vue` with static legal content
- `router/index.js`: routes `/impressum` and `/datenschutz`; `scrollBehavior` scrolls to `#kontakt` below the sticky header
- `FooterLink.vue`: optional `to` prop for internal `router-link` (like prof `FooterLink` with `href`, adapted for Vue Router)
- `Footer.vue`: **Informationen** links Impressum and Datenschutz; **Kontakt** links to `/#kontakt`; AGB, Widerrufsrecht and other footer links remain placeholders for later iterations

### Iteration 13: User profile page and profile update

- New `ProfileView.vue` at `/profile` (protected with `authGuard`): edit first name, last name, street, postal code, and city
- E-mail and role are read-only; password section requests Auth0 change-password e-mail via Auth0 API
- `backend.js`: `updateProfile()` via `PUT /api/profile`
- `Navbar.vue`: **Mein Profil** link when logged in (removed e-mail display in the nav)

### Iteration 14: Checkout and order process

- **Shopping cart** with Pinia (`cart.js`): add/remove items on product detail, quantity controls, cart badge in navbar; cart stored **per Auth0 account** in `localStorage`. Guest cart merges into the account cart on login; on logout the visible cart is cleared (each account keeps its own saved cart)
- **Checkout flow** across multiple views (login required at checkout via `authGuard` + `useAuthLogin` return path):
  - `CartView` – review items, remove confirmation, link to product detail
  - `CheckoutDeliveryView` – delivery address (prefilled from profile), required fields for order
  - `CheckoutPaymentView` – payment method selection (card / PayPal / invoice, simulated UI only)
  - `OrderConfirmationView` – success page after `POST /api/order`
- **My orders:** `OrdersView` and `OrderDetailView` (`GET /api/order`, `GET /api/order/{id}`), reorder link to product detail
- `AppAlert.vue` for success/error feedback instead of browser `alert()`; `ConfirmModal.vue` for cart item removal
- Optional coupon code **EASY10** (10 % on subtotal) in cart and payment summary
- Routes: `/cart`, `/checkout/delivery`, `/checkout/payment`, `/order/confirmation/:id`, `/orders`, `/orders/:id`

### Iteration 15: Driver dashboard (initial setup with sample orders)

- New `DriverDashboardView.vue` at `/lieferauftraege` (protected with `authGuard`): shows assigned delivery orders with address, content summary, and status dropdown (`offen`, `unterwegs`, `geliefert`)
- `useUserProfile.js`: loads profile after login; FAHRER users are redirected from `/` and `/shop` to `/lieferauftraege`
- `Navbar.vue`: role-based navigation for FAHRER (Lieferaufträge, greeting, logout; no shop, cart, or search)
- `App.vue`: promotional banner hidden for FAHRER and on the driver route
- `DeliveryFilterPanel.vue`: status filter (same panel style as shop filter); default option **Alle Lieferaufträge**
- Delivered orders (`geliefert`) are sorted to the end of the list automatically
- `backend.js`: `fetchAssignedDeliveries()`, `updateDeliveryStatus()` via `/api/delivery/assigned` and `PUT /api/delivery/:id/status`
- **Scope note:** orders are **sample data** seeded in the backend for the test driver account (`maloku.ardonesa+fahrer@gmail.com`). Linking to real customer checkout, multi-driver accept flow, and admin assignment is planned for a later iteration.

### Iteration 16: Admin area for master data (UC – Stammdaten)

- New admin hub at `/admin` (protected with `authGuard` + admin role check via `useAdminAccess.js`)
- **Categories:** list with search, create, edit, delete (`ConfirmModal` warns when products will be removed); routes `/admin/categories`, `/admin/categories/create`, `/admin/categories/edit/:id`
- **Users:** list with search (name/e-mail), edit name, address, and role (`KUNDE` / `FAHRER` / `ADMIN`); routes `/admin/users`, `/admin/users/edit/:id`
- **Orders (admin):** all customer orders with search at `/admin/orders`; detail reuses `OrderDetailView` at `/admin/orders/:id` with customer info
- `Navbar.vue`: **Administration** link for `ADMIN` role; product create/edit routes now require login
- `ProductCatalog.vue` uses shared `useUserProfile()` for admin buttons
- `backend.js`: category/user/admin-order API helpers
