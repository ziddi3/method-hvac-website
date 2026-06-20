# Method HVAC repository instructions

## Brand assets are authoritative

Use the supplied assets in `public/branding/`. Do not generate, redraw, replace, reinterpret, recolor, or substitute any company logo, seal, badge, or slogan artwork.

Approved asset roles:

- `/branding/method-hvac-primary.svg` — primary Method HVAC logo for the header, mobile navigation, homepage hero, and footer.
- `/branding/method-hvac-tagline.svg` — hero slogan artwork: “IT'S ALL IN THE METHOD”.
- `/branding/method-alliance-seal.svg` — trust / membership badge. Use in credibility, partner, or ecosystem sections; never as the primary company logo.
- `/branding/hvac-bob-powered-by-gemini.svg` — HVAC Bob badge. Use only inside or beside the customer quote-builder experience.
- `/branding/method-media-designer.svg` — Method Media design credit. Use only in an understated footer or credits area.

## Rendering rules

- Preserve the original aspect ratio.
- Use transparent backgrounds; do not place a white or black rectangle behind an asset.
- Use `object-fit: contain` and never crop the artwork.
- Do not add filters that materially change the supplied colors.
- Do not place body copy over the artwork.
- Supply meaningful `alt` text.
- Keep the primary logo legible on mobile.

## Brand hierarchy

1. Method HVAC is the customer-facing company.
2. “IT'S ALL IN THE METHOD” is the primary slogan.
3. HVAC Bob powers the transparent quote-builder experience.
4. Method Alliance / Member of the Method is a trust marker.
5. Method Hub is ecosystem navigation only and should appear as a visible return link, not as the primary brand.
6. Method Media may receive a small design credit in the footer.

## Visual direction

Use a premium industrial HVAC aesthetic: deep black and navy surfaces, steel and silver typography, controlled blue-flame accents, restrained warm orange highlights, and selective antique-gold trust accents. The site must remain professional, accessible, fast, responsive, and suitable for Canadian residential customers.

## Product direction

The build-your-own transparent quote experience is the main product feature. Keep quote calculations modular and prepare submissions for GoHighLevel without hardcoding secrets. Use environment variables for all CRM credentials and IDs.
