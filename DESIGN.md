# Meridian — DESIGN.md

Cinematic travel editorial on a true-black canvas. Distilled from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — Shopify (night marketing track), Runway (scene-change scrolling), Sanity (mono eyebrows), The Verge (acid accent as hazard tape). Lime is the only chromatic signal.

## Atmosphere

Void-black (`#000000`) like Shopify's canvas-night and Runway's film black. Photography and the night globe carry color. UI stays almost invisible. Scrolling the homepage is a **scene change**, not a feed: each fold is one complete frame.

## Color

| Token | Hex | Role |
|---|---|---|
| void | `#000000` | Canvas, cinema black |
| void-elevated | `#12120c` | Cards on black |
| fg | `#f3f3e8` | Primary type |
| muted | `#8a8a76` | Secondary type |
| accent | `#d4f03c` | Single hazard-tape accent (kickers, CTA, active scene) |
| line | `rgb(232 232 200 / 0.12)` | Hairline, no drop shadow |

Do: accent only on one thing per fold (kicker, or CTA, or scene index).  
Don't: gradients, glows, atmosphere around the globe, extra hues.

## Type

- Display / UI: Inter, weight 400–600, tracking tight on large sizes (`-0.04em` to `-0.02em`), line-height ~0.92–1.0 on heroes.
- Eyebrows / timestamps / scene index: IBM Plex Mono, 11–12px, uppercase, tracking `0.16em`.
- Body: Inter 16px, line-height 1.5–1.6.

Don't use a third family. Don't bold past 600.

## Motion

- Page turn: 720–900ms `cubic-bezier(0.22, 1, 0.36, 1)`. Incoming scene staggers children 80ms (opacity + 18px translateY + 6px blur).
- Wipe: black clip-path curtain with a 1px accent leading edge. Direction follows scroll.
- Interactive: 150–180ms ease, interruptible CSS transitions. Press scale `0.96`.
- Globe zoom: Ctrl/⌘ + wheel only. Plain wheel turns the scene.
- `prefers-reduced-motion`: snap to proximity, no wipe, no blur.

Don't bounce. Don't animate layout. Don't keep the hero sticky over later scenes.

## Layout

- Homepage: `100dvh` scenes, snap-mandatory, snap-stop always.
- Cinematic track: full-bleed photos, 20px radius frames, extreme padding (40–80px).
- Guide pages: reading column inside `max-w-6xl`, sticky section rail as a **router search interface** (`?s=`), never hash links.
- One action per band.

## Components

- Buttons: pill (`9999px`), accent fill on primary, hairline on outline.
- Cards: elevated void, 1px hairline, 16–24px radius. Photo cards are frames, not tiles with drop shadows.
- Scene rail: vertical mono index, right edge, accent on the active scene.

## Do / Don't

Do: let photography and the globe dominate.  
Do: treat each homepage fold as a finished poster.  
Don't: listicle density on the cinema track.  
Don't: blue atmosphere, particle glitter, or a second accent.
