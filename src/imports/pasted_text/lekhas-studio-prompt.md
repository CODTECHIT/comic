# LEKHYAS STUDIO — Figma UI Design Prompt
**Comic Publishing & Reading Platform (Digital-Only)**

---

## 1. PROJECT CONTEXT

Design a complete UI for **Lekhyas Studio (Brand: LEKHYAS)** — a digital comic publishing platform where users buy and **read comics online only** (no downloads, no PDFs leave the browser — this protects the subscription model). Visual inspiration: **Marvel's official website**, but reimagined with a **comic-book aesthetic** — bold ink linework, halftone textures, panel-style layouts, dynamic angled sections, and energy that feels like opening an actual comic issue.

Target audience: Kids + Adults (broad). Business type: Comic publisher selling digital single issues AND subscription/membership plans.

---

## 2. DESIGN STYLE DIRECTION

**Aesthetic: "Comic-Type"**
- Bold black ink outlines on key UI elements (cards, buttons, section dividers) — like comic panel borders
- Halftone dot textures and pattern overlays in backgrounds/section transitions (classic Ben-Day dots)
- Speech-bubble shapes used as UI accents (tooltips, callouts, badges like "NEW", "HOT")
- Dynamic diagonal/angled section breaks instead of plain straight horizontal lines
- Comic-style sound-effect typography accents for emphasis (e.g., burst shapes behind key CTAs) — used sparingly, not childish
- Strong color blocking — comic primary palette (deep red, electric blue, golden yellow, jet black, off-white paper tone) but keep it tasteful enough to bridge kids + adult appeal
- Typography: a bold condensed display font for headlines (comic-letterer feel) + clean modern sans for body/UI text (for readability)
- Photography/art treatment: comic cover art and character art are the hero — UI chrome should frame the art, not compete with it

**Tone check:** Bold and energetic like a comic, but UI elements (buttons, nav, forms) must stay clean and modern underneath the styling — this is a real e-commerce + reading platform, not a kids' game.

---

## 3. REAL CATALOG CONTENT — "THE LEKHYAS UNIVERSE"

Lekhyas Studio already has an existing line of comic titles under the shared brand **"Lekhyas Universe"** (similar in concept to "MCU"). Use this as an actual brand pillar in the design — a "Universe" badge/nav item should exist on the site, the same way Marvel uses "MCU."

**Official brand lockup to use across all UI:** "LEKHYAS STUDIO" with the "Ls" monogram badge (circular/banner logo). Use this single consistent lockup in every UI mockup — do not mix in "Lekhyas Universss" or other variants seen on some draft covers; those are inconsistent placeholder versions from earlier cover drafts and should not be replicated in the final UI or treated as the canonical wordmark.

**Existing titles to use as real catalog content in mockups (use these names, price points, and genre flavor — not generic placeholder comic names):**

| Title | Tagline / Issue Note | Genre Flavor | Price (₹) |
|---|---|---|---|
| **War-God: Son of Vayu** | "War for Justice" — multi-issue saga (March, June, Sep issues) | Indian-mythology action/superhero | 1,449 |
| **Jackboy: State Rebel** | "He is *really* crazy! And he's winning!" — set in 1945 India | Period/vigilante comedy-action | 1,249–1,369 |
| **Gilded Jaguar** | "A forest road life of a jaguar face man" | Jungle/mystic action-romance | 1,367 |
| **Starveilers: War of the Pearl** | Team/ensemble superhero title, April issue | Ensemble sci-fi superhero | 1,489 |
| **The Second Bhaime** | "War between mens but not man" | Mythic strength/warrior epic | 1,329 |
| **Cowgirl: Justice Rides** | "Is she a hero, a villain, or somewhere in between?" | Western-fantasy antihero | 1,249 |
| **Surya** ("Not the Original") | Subverted-legacy superhero title | Urban sci-fi superhero | 1,499 |
| **Major Mukund: Way of Independent** | Origin-style tech/armor hero, ongoing volumes | Tech-armor superhero | 1,389 |
| **Bineman** | "Silver Heart Creature" | Eco/nature-powered superhero | 1,379 |

Use these titles and cover art styles (bold painted superhero/mythic illustration, single-character hero pose, dramatic lighting, lightning/energy effects, Hindi-mythology-meets-superhero visual language) as the **actual reference imagery** when mocking up:
- Homepage hero section (rotate between 2–3 of the strongest covers, e.g., War-God: Son of Vayu, Starveilers, Gilded Jaguar)
- New Arrivals / New Collections carousels (use the real titles + price points above instead of "Comic Title 1, 2, 3" placeholders)
- Category rows — group titles by genre flavor (e.g., "Mythic Warriors": War-God, The Second Bhaime; "Urban Heroes": Surya, Major Mukund, Bineman; "Action-Adventure": Jackboy, Gilded Jaguar, Cowgirl; "Team-Up Sagas": Starveilers)
- Comic Detail Page mockup — use "War-God: Son of Vayu" as the primary example detail page
- Pricing on cards should reflect the real ₹1,249–₹1,499 range (helps the designer calibrate card layout for 4-digit pricing with ₹ symbol, not generic $X.XX)

**Note on a recurring brand motif:** Several covers use a "BUY & WIN" diamond/starburst badge as a promotional callout. Treat this as an existing Lekhyas brand element — design it as a reusable badge component (alongside "NEW" and "MOST POPULAR" badges) rather than inventing a new promo badge style from scratch.

**Pre-launch content note (not a design task, just flag to client):** A few existing cover drafts have inconsistent logo lockups ("Lekhyas Studio" vs "Lekhyas Universss") and a couple of placeholder/sample marks (e.g., diagonal "2nd READ" sample band) that should be replaced with final print-ready art before these go live as real product images — but the design mockups can still reference the titles/art direction now.

---

## 4. SITE MAP — SCREENS TO DESIGN

### A. Public / Customer-Facing
1. **Homepage**
2. **Browse / Catalog Page** (all comics, filterable by category)
3. **Category Page** (e.g., "Action", "Fantasy", "Kids" — categories are admin-defined, dynamic)
4. **Comic Detail Page** (single issue/title page)
5. **In-Browser Comic Reader** (the core reading experience)
6. **Subscription / Membership Plans Page**
7. **Cart / Checkout Flow** (single purchase)
8. **Login / Sign Up / Account Page**
9. **User Library** ("My Comics" — purchased + subscribed content)
10. **Terms & Conditions Page**
11. **Privacy Policy Page**
12. **Contact Us / Help Page**

### B. Admin Panel
13. **Admin Dashboard** (overview: sales, active subscribers, recent orders)
14. **Manage Comics** (add/edit/delete comic, upload pages, set pricing)
15. **Manage Categories** (admin creates/edits categories — fully dynamic, not fixed)
16. **Manage Subscription Plans** (create/edit pricing tiers, what's included)
17. **Orders & Sales** (transaction history, revenue)
18. **Hero/Banner Manager** (control homepage hero content, featured/new arrivals)
19. **Site Settings** (domain/hosting info panel, payment gateway config)

---

## 5. SCREEN-BY-SCREEN BRIEF

### 1. Homepage
- **Hero Section**: Full-width, high-impact. Large comic cover art or character splash art as background/focal visual. Bold headline (e.g., tagline for Lekhyas Studio), a primary CTA ("Start Reading" / "Explore Comics"), comic-panel-style framing around the hero art (like the art is "breaking out" of a panel border)
- Below hero: **"New Arrivals"** horizontal scroll/carousel of comic covers (cards with halftone-bordered frame, "NEW" speech-bubble badge)
- **"New Collections"** section — similar card treatment, maybe grouped in a themed panel layout
- **Category-wise rows** — each category (admin-defined) gets its own horizontal row of comic covers, section header styled like a comic chapter title
- **Subscription teaser banner** — bold CTA strip pushing toward the membership plans page
- Footer: standard links (T&C, Privacy, Contact, social), styled with comic-strip-style thin panel border

### 2. Browse/Catalog Page
- Grid of comic cover cards (poster-style, portrait orientation, like comic covers)
- Left sidebar or top filter bar: filter by category, sort by (new, price, popularity)
- Each card: cover art, title, price, "Read Sample" or category tag badge

### 3. Category Page
- Same card grid as catalog but scoped to one category, with a bold category banner header at top (illustrated/halftone background)

### 4. Comic Detail Page
- Large cover art on one side, details on the other (title, synopsis, author/creator credit if any, price, age rating/audience tag like "Kids" or "Mature")
- Primary CTA: "Buy & Read" or "Read with Subscription"
- Secondary: preview/sample pages (a few free pages teaser, styled as small thumbnail strip)
- "You might also like" — related comics row at bottom

### 5. In-Browser Comic Reader ⭐ (Most important screen)
- **Full-screen immersive reading mode** — minimal chrome, dark surrounding background so the comic page is the focus
- **Page-flip animation** between pages (book-style turn, like Marvel Unlimited) — design at least 2 states: page mid-flip (showing curl/shadow effect) and settled page
- Thin top bar (auto-hide on scroll/read): back button, comic title, page number indicator (e.g., "12 / 48")
- Bottom thin bar: page navigation arrows, thumbnail page-jump strip (optional), zoom control
- **No download/save/print icon anywhere** — explicitly exclude any export affordance
- Subtle watermark or protective overlay treatment (visual only, communicates "view-only" without being intrusive)
- Loading state: comic-style "loading" animation (e.g., panel wipe transition) between pages

### 6. Subscription/Membership Plans Page
- 2–4 pricing tier cards side by side (e.g., Basic / Plus / Premium — name these in comic-flavored language if possible)
- Each card: price, billing cycle, feature list (number of comics/month, exclusive titles, early access, etc.), CTA button
- Comparison highlight on the recommended/most-popular tier (badge like "MOST POPULAR" styled as a burst/star shape)
- FAQ accordion section below (billing questions, cancellation policy)

### 7. Cart/Checkout Flow
- Simple, clean checkout — order summary (comic title, price), Razorpay payment button
- Trust badges/security note near payment button
- Confirmation screen post-payment: "Your comic is ready to read" CTA straight into the reader

### 8. Login/Sign Up/Account Page
- Clean split-screen or centered card layout, comic art as side/background visual
- Standard fields: email/phone, password, OR social/OTP login
- Account page: profile info, subscription status, payment history link

### 9. User Library ("My Comics")
- Grid of purchased/subscribed comics (cover thumbnails), each opens directly into the reader
- Tab or filter: "Purchased" vs "Subscription Access" vs "Reading History" (continue reading with progress indicator)

### 10–12. T&C / Privacy Policy / Contact Pages
- Simple, readable long-form text layout — comic-style header banner at top for brand consistency, but body content stays clean and legible (no heavy texture behind paragraphs)
- Contact page: simple form (name, email, message) + WhatsApp contact button (since WhatsApp number is a primary contact channel for this business)

### 13. Admin Dashboard
- Clean, functional, data-first layout — less "comic," more usable SaaS dashboard
- KPI cards at top: total sales, active subscribers, comics published, this month's revenue
- Recent orders table, quick links to "Add New Comic" and "Manage Plans"

### 14. Manage Comics (Admin)
- Table/list view of all comics with thumbnail, title, category, price, status (published/draft)
- "Add Comic" flow: title, description, cover upload, page images upload (bulk), category assignment, pricing input, audience tag
- Page-order management (drag to reorder uploaded pages)

### 15. Manage Categories (Admin)
- Simple list/table: category name, comic count, add/edit/delete — admin has full freedom to create new categories anytime (this is dynamic, not hardcoded)

### 16. Manage Subscription Plans (Admin)
- List of current plans (cards or table), edit pricing/features per plan, create new plan, activate/deactivate plan

### 17. Orders & Sales (Admin)
- Transaction table: date, customer, comic/plan purchased, amount, payment status
- Basic revenue chart (line/bar) by week/month

### 18. Hero/Banner Manager (Admin)
- Upload/edit homepage hero image + headline + CTA link
- Manage "New Arrivals" and "New Collections" featured selections (pick which comics appear)

### 19. Site Settings (Admin)
- Domain/hosting info display, payment gateway (Razorpay) credentials/config section, general site info (business name, contact, address — pull from the business details already provided)

---

## 6. COMPONENT LIBRARY TO BUILD IN FIGMA

Build these as reusable components/variants first, then assemble screens:
- Comic cover card (default, hover, "new" badge variant, "sale" badge variant)
- Primary button (comic-ink-outline style), secondary/ghost button
- Category pill/tag
- Navigation bar (public site — logo, nav links, search icon, cart icon, login/account icon)
- Admin sidebar navigation
- Pricing tier card
- Speech-bubble badge component (for "NEW", "HOT", "MOST POPULAR" labels)
- Page-flip reader control bar (top + bottom)
- Form input fields (text, email, password) in the comic-meets-clean style
- Footer

---

## 7. DELIVERABLE EXPECTATIONS

- Design at **desktop width (1440px)** primarily; mobile responsive versions for Homepage, Catalog, Comic Detail, and Reader screens at minimum (these are the highest-traffic screens)
- Use Figma Auto Layout throughout for responsiveness
- Organize as a Figma page-per-section structure: "Public Site," "Admin Panel," "Components"
- Maintain a consistent color/type style guide (Figma Styles) applied across all screens before final screens are built

---

## 8. KEY CONSTRAINTS TO REMEMBER WHILE DESIGNING

- **No download/export UI anywhere in the reader** — this is a hard business rule (subscription model depends on it)
- **Categories must look admin-manageable** — don't hardcode visual treatment that implies fixed categories
- **Audience spans kids + adults** — keep the comic styling fun but not childish; should feel credible to an adult reader too
- **Payment is online-only** — no COD/offline payment UI needed anywhere
- **Subscription + single-purchase coexist** — both purchase paths need clear, non-confusing entry points throughout (don't force users into only one model)
