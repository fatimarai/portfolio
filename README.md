# Fatima Rai — Radiographer Portfolio

Personal portfolio site for Fatima Rai, radiographer.

## Stack
- Plain HTML/CSS/JS (no build step)
- Shared design system in `assets/`
- Hosted on Vercel
- Domain: fatimarai.com

## File Structure
```
├── index.html              # Main portfolio
├── assets/
│   ├── styles.css          # Shared design system + light/dark themes
│   ├── scripts.js          # Theme toggle, cursor, scroll reveals, hero canvas, lightbox
│   └── blog.css            # Blog article layout + clinical components
├── blog/
│   ├── liver-ultrasound.html
│   └── abdominal-ultrasound.html
└── images/
    └── ovary-follicles.jpeg
```

## Features
- Smooth light / dark mode toggle with system preference fallback
- Editorial "medical atelier" aesthetic (warm palette, grain, ambient motion)
- Scroll-triggered reveal animations
- Custom cursor (desktop)
- Interactive particle canvas in hero
- 3D-tilt expertise cards
- Accessible keyboard navigation and focus states
- Responsive across all viewport sizes

## Local preview
Open `index.html` in any browser, or:
```bash
npx serve .
```
