# Dense scrapbook homepage redesign

## Goal
Recompose the existing public homepage into the approved handmade digital scrapbook while preserving the working owner CMS, public pages, and current content model.

## Implementation
1. Run the two focused regressions only: publish one temporary owner post and verify it anonymously on the Blog and post pages; upload one visible photo and verify it anonymously on Home; then remove both.
2. Replace the homepage’s conventional hero-plus-columns flow with a denser collage:
   - compact full-width brand collage and crooked navigation
   - first-screen three-part composition with overlapping Polaroids, a central torn featured-story clipping, and a tall ornate About tarot card
   - separate pinned notebook “Currently…” sheet and scattered CMS notes
3. Rework later homepage bands:
   - layered horizontal “Explore the Chaos” category strip
   - broad pale torn-paper recent-post spread with varied clipping details
   - more paper seams, washi tape, staples, celestial marks, owl/crow/web/potion details, and handwritten labels throughout
4. Keep all text and collections driven by existing editable content. Use neutral empty-state prompts where Laurel has not added content.
5. Preserve the calm admin styling and all current routes. Keep the desktop composition richly overlapped; simplify it into a readable vertical scrapbook on phones.
6. Capture desktop and mobile screenshots, compare against the requested composition, make at least one correction pass, and check build/runtime/console output before finishing.

## Technical details
- Update the homepage route structure and shared public header markup only where needed.
- Extend the existing semantic color/token system and scrapbook CSS; no new heavy background assets.
- Reuse the existing generated crow image and custom SVG doodles, adding lightweight SVG motifs only where the composition needs them.
- Do not publish or deploy.