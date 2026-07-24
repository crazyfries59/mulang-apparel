# Mulang Apparel — Premium Streetwear Website

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, marquee, stats, featured products, brand story, lookbook teaser, CTA |
| `/about` | Brand story, timeline, team, factory capabilities |
| `/products` | Filterable product grid with quick-view modal |
| `/services` | OEM/ODM services, decoration techniques, process steps |
| `/lookbook` | Masonry gallery with lightbox slider, collection filters |
| `/contact` | Contact form, WhatsApp CTA, business hours |

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — scroll animations, parallax, page transitions
- **Lucide React** — icons

## Key Features

- Parallax hero with scroll-triggered opacity fade
- Custom animated cursor (desktop)
- Dark mode toggle (system preference + manual)
- Animated marquee ticker
- Product quick-view modal
- Masonry lookbook grid with fullscreen lightbox
- Responsive mobile navigation with full-screen overlay
- Scroll-triggered fade-in animations on all sections
- Hover card lift and image zoom effects

## Customization

1. **Accent color** — Change `--accent: #c8a96e` in `app/globals.css`
2. **Images** — Replace Unsplash URLs with your product/campaign photos
3. **Contact** — Update WhatsApp number and email in `Footer.tsx` and `contact/page.tsx`
4. **Brand copy** — Update text throughout each page file

## Production Build

```bash
npm run build
npm start
```
