# BrandTogether (SplitCart) — Branded Fashion Group Buying Platform

BrandTogether is a group buying web platform designed for physical retail fashion stores across **Men's**, **Women's**, and **Children's** categories. Customers form local shopping groups to unlock exclusive store deals (Buy 1 Get 1 Free, Buy 2 Get 1 Free, Flat 50% Off), coordinate store visits via group chat, and shop directly at brick-and-mortar brand stores.

---

## 🚀 Key Features

### 🛍️ Shopper Experience
- **3 Dedicated Fashion Sections**:
  - **Men's**: Deep Navy Blue theme (`#1B2A4A`) with pure white content canvas.
  - **Women's**: Deep Mauve/Rose theme (`#7C3D6E`) with pure white content canvas.
  - **Children's**: Forest Green theme (`#2E6B4F`) with pure white content canvas.
- **Auto-Sliding Brand Hero Carousel**: Right-side banner image auto-slides every 3 seconds showcasing top featured brand photos.
- **Search Modes**: Live brand search & location search with zero middleman fee transparency.
- **Mobile Search Modal**: Mobile-first popup search modal with live offer count and city selector.
- **Urgency Badges**: Red urgency indicators for offers expiring within 3 days. Past-expiry offers auto-hide automatically.
- **Group Buying Flow**:
  - Create or join local shopping groups (capacities up to 10 members).
  - Unlocks store directions, phone, WhatsApp contact, and group member real-time chat.
  - **"Notify Store"** feature to alert store owners of incoming group visits (e.g. *"We are 5 people visiting for Summer Sale"*).
  - Group status management (Close Group -> `Complete`, Reopen Group, Exit Group).

### 🏪 Store Partner Panel (`/store/dashboard`)
- **2-Step Registration**:
  - **Step 1**: Store owner account setup with Email & Password or **Continue with Google**.
  - **Step 2**: Store details, address, phone, and **Brand Live Search Dropdown**.
  - **"Add it for Approval"**: If a brand is missing, store owners can request admin approval.
- **Store Status Banners**:
  - 🟡 **Pending**: Waiting for admin review.
  - 🟢 **Approved**: Unlocks "New Offer" creation & store management.
  - 🔴 **Rejected**: Displays admin rejection reason with re-application option.
- **Offer CRUD**: Create, edit, delete, and toggle visibility (👁️ Eye icon) for store offers.
- **Customer Group Notifications**: Live feed of customer group visit notifications.

### 🛡️ Admin Control Panel
- **Access**: Click `© BrandTogether` in website footer.
- **Environment Passkey Security**: Protected by `VITE_ADMIN_PASSWORD` in `.env.local`.
- **6 Management Tabs**:
  1. **Overview**: Key platform metrics & pending store application alerts.
  2. **Stores**: Approve or reject store applications with custom rejection reason modal.
     - **"View Store Data"**: Deep audit modal showing owner details, active offers, ended/hidden offers, and group count.
  3. **Brands**: Master brand directory management — **Add New Brand**, **Edit Brand Name**, **Approve**, and **Delete**.
  4. **Header Ads**: Rotating 6-second header top banner ads with session dismissal capability.
  5. **Tickers**: Bottom rotating review & live customer activity tickers.
  6. **Landing Photos**: Manage up to 10 brand hero images per gender section to filter offers on click.

---

## 🎯 SEO, AEO & GEO Optimization

- **SEO (Search Engine Optimization)**: Open Graph social cards, Twitter Card tags, canonical URLs, and dynamic page titles/descriptions per active section and user role.
- **AEO (Answer Engine Optimization)**: Schema.org `FAQPage` and `ShoppingCenter` JSON-LD structured data for AI search engines (ChatGPT, Perplexity, Google AI Overviews).
- **GEO (Geographic & Generative Optimization)**: Geo region (`IN-OR`), ICBM coordinates (`20.354, 85.815`), and location metadata tailored for local shopping queries.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons.
- **Authentication & Database**: Firebase Auth & Firestore Integration.
- **Theme Architecture**: Pure White (`#FFFFFF`) content background with accent color strips.

---

## 💻 Local Setup & Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/manishsxc/splitcart.git
   cd splitcart
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (`.env.local`):
   ```env
   VITE_ADMIN_PASSWORD=adminPass123!
   VITE_FIREBASE_API_KEY=AIzaSyAEvsnSnDR1Vm7Yw61kjBgnpR9nA12gBrU
   VITE_FIREBASE_AUTH_DOMAIN=fir-caae2.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=fir-caae2
   VITE_FIREBASE_STORAGE_BUCKET=fir-caae2.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=774864576476
   VITE_FIREBASE_APP_ID=1:774864576476:web:a9b558c9ab4929363c3919
   VITE_FIREBASE_MEASUREMENT_ID=G-KBEQMZN5BW
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Typecheck & Production Build**:
   ```bash
   npm run typecheck
   npm run build
   ```

---

## 📄 License
Privately owned for BrandTogether (SplitCart) Group Buying Platform.
