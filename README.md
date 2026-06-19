# Method HVAC Website

Customer-facing Method HVAC website with transparent build-your-own quote flow, service pages, and GoHighLevel-ready lead capture.

> _"It's all in the Method."_

## Stack

- [Vite](https://vitejs.dev/) + React 19
- React Router for client-side routing
- Mobile-first responsive CSS (design tokens + modular component CSS)
- Modular architecture ready for Method ecosystem integration

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

## Project structure

```
src/
├── components/        # Reusable UI building blocks
│   ├── layout/        # Header, Footer, MethodHubLink
│   ├── ui/            # Button, Card, Section, etc.
│   └── quote/         # Quote builder wizard steps
├── pages/             # Route-level pages
├── data/              # Materials catalog, package tiers, testimonials, FAQ
├── lib/               # Pricing engine, formatters, integrations
│   └── integrations/  # GoHighLevel stub
├── styles/            # Design tokens + global CSS
└── App.jsx            # Router
```

## Build Your Quote

The quote wizard mirrors our internal HVAC worker app workflow:

1. **Service type** — AC install, furnace install, service & repair, maintenance plan
2. **Home profile** — square footage / system size
3. **Package tier** — Budget, Standard, Premium
4. **Materials** — pulled from the shared materials catalog (`src/data/materials.js`)
5. **Labor** — calculated from job complexity + tier
6. **GST** — 5% Alberta GST applied transparently
7. **Contact** — customer details
8. **Summary** — itemized total, ready to submit

All pricing math lives in `src/lib/pricing.js` so the same engine can be reused by the worker app.

## GoHighLevel integration

Quote submissions are routed through `src/lib/integrations/gohighlevel.js`, which builds the contact + opportunity payload. The current implementation logs locally and resolves successfully; swap in a real fetch call to the GHL webhook / API when credentials are available.

## Method Hub

Every page has a visible **Return to Method Hub** link in the header so this site composes cleanly into the wider Method ecosystem. The hub URL is centralized in `src/config/site.js`.
