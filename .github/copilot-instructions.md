# Method HVAC repository instructions

## Approved branding only

Use the supplied files in `public/branding/`. Do not generate, redraw, replace, reinterpret, recolor, or substitute any company logo, seal, badge, or slogan artwork.

Canonical asset roles:

- `/branding/method-hvac-logo.png` — primary Method HVAC logo for the header, mobile navigation, homepage hero, and footer.
- `/branding/method-media-tagline.png` — primary slogan artwork: “IT'S ALL IN THE METHOD”.
- `/branding/method-hub-seal.png` — Method Alliance / Member of the Method trust badge. Despite the historical filename, treat this as the alliance membership seal.
- `/branding/method-hvac-seal.png` — secondary Method HVAC ecosystem seal. Use only in trust, heritage, or partner sections.
- `/branding/hvac-bob-powered-by-gemini.svg` — HVAC Bob badge. Use only inside or beside the customer quote-builder experience.

## Rendering rules

- Preserve original aspect ratios.
- Use transparent backgrounds; never add a white or black rectangle behind the supplied art.
- Use `object-fit: contain`; never crop the artwork.
- Do not apply filters that materially change the supplied colors.
- Do not place body copy over a logo or seal.
- Add meaningful `alt` text.
- Keep the primary logo legible on mobile.

## Brand hierarchy

1. Method HVAC is the customer-facing company.
2. “IT'S ALL IN THE METHOD” is the primary slogan.
3. HVAC Bob powers the transparent quote-builder experience.
4. Method Alliance / Member of the Method is a trust marker.
5. Method Hub is ecosystem navigation only and should appear as a visible return link, not as the primary business brand.
6. Method Media may receive a small design credit in the footer when appropriate.

## Visual direction

Use a premium industrial HVAC aesthetic: deep black and navy surfaces, steel and silver typography, controlled blue-flame accents, restrained warm orange highlights, and selective antique-gold trust accents. The site must remain professional, accessible, fast, responsive, and suitable for Canadian residential customers.

## Product direction

The transparent build-your-own quote experience is the site's main feature. Keep pricing calculations modular and prepare quote submissions for GoHighLevel without hardcoding secrets. Use environment variables for all CRM credentials and IDs.
