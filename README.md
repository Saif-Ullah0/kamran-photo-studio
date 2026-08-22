# Kamran Photo Studio

A premium, cinematic landing page for a 4K photography/videography studio.
Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion +
React Three Fiber/Drei + Lucide + use-sound.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
app/
  layout.tsx        Fonts (Playfair Display, Inter) + global metadata
  globals.css        Tailwind v4 theme tokens, noise textures, gold glow
  page.tsx            Composes all sections
components/
  Navbar.tsx          Glassmorphism nav + WhatsApp CTA
  HeroSection.tsx      Overlay text/CTAs on top of the 3D scene
  Hero3D.tsx           R3F Canvas, lighting, click-to-flash + shutter sound
  CameraLensModel.tsx  Stylized 3D lens (primitives, no external model file)
  ShowreelSection.tsx  Full-width video banner → opens VideoModal
  VideoModal.tsx        Fullscreen showreel player
  PortfolioGrid.tsx    Masonry grid, category filters, EXIF hover overlay
  Lightbox.tsx          Fullscreen image viewer with next/prev
  Pricing.tsx            3 tiers, gold-glow hover, WhatsApp booking links
  About.tsx               Split bio layout + animated stat counters
  AnimatedCounter.tsx     Spring-driven count-up (useSpring + useInView)
  ContactFooter.tsx      Contact form, Maps embed, socials, footer
lib/
  data.ts   All copy, links, portfolio items, pricing — edit here first
  utils.ts  Small `cn()` classname helper
```

## Before you launch — replace these placeholders

Everything below lives in `lib/data.ts` unless noted otherwise.

**Already wired in with your real details:** WhatsApp number, phone, email,
address (and a live Google Maps embed generated from that address — no API
key needed), and your studio tagline (shown in the hero and usable
elsewhere).

| What | Where | Notes |
|---|---|---|
| Instagram / YouTube links | `SITE.instagram`, `SITE.youtube` | Still placeholder handles — send me the real ones |
| Portfolio images + EXIF captions | `PORTFOLIO_ITEMS` | Currently Unsplash placeholders |
| Hero marquee images | `HERO_IMAGES_LEFT`, `HERO_IMAGES_RIGHT` | Currently Unsplash South Asian wedding placeholders — swap for real Kamran Photo Studio shoots when ready |
| Drone/cinema showreel videos | `MEDIA.showreelBackground`, `MEDIA.showreelFull` | Currently free-license Pixabay clips (drone aerial + wedding cinema) — replaced the earlier broken/slow placeholders |
| Shutter click sound | `public/sounds/shutter-click.mp3` | File does not exist yet — add a short (<1s) mechanical shutter click; the flash effect works without it, the sound will just fail silently |
| Pricing (currency, amounts, inclusions) | `PRICING_TIERS` | Currently PKR placeholder pricing |
| Contact form backend | `components/ContactFooter.tsx` `handleSubmit` | Currently opens a `mailto:` link client-side; wire to an API route or a service like Resend/Formspree if you want server-side lead capture |
| **Logo** | `public/logo.svg` (or `.png`) | **Not added yet.** Drop your logo file into the chat and I'll place it and wire it into `Navbar.tsx` for you. If doing it yourself: save it as `public/logo.svg` (preferred, scales crisply) or `public/logo.png` at roughly 400×120px transparent background, then swap the text wordmark in `Navbar.tsx` for an `<Image src="/logo.svg" alt="Kamran Photo Studio" width={160} height={48} />` |

## Your own files — where they go

All instructions now live only here — I'd previously scattered a
`README.txt` into `public/videos/`, `public/team/`, and `public/sounds/`
too, which just cluttered those folders. Removed; everything's below.

| File | Exact path | Wired to |
|---|---|---|
| Logo (already added) | `public/logo.jpeg` | Navbar, replacing the text wordmark |
| Intro reel | `public/videos/intro-reel.mp4` | `MEDIA.showreelBackground` + `MEDIA.showreelFull` — the looping background *and* the fullscreen modal video in the "4K Drone & Cinema Showcase" section |
| Kamran's photo | `public/team/kamran.jpeg` | His card/profile in the Team section |

`ABOUT_IMAGE` (the About section's photo) is intentionally a separate,
still-placeholder Unsplash URL — not tied to Kamran's team photo — so swap
it independently if/when you want a real photo there; see the comment
above `ABOUT_IMAGE` in `lib/data.ts`.

The other three team members (Ayesha, Bilal, Sara) are still placeholder
Unsplash photos — same pattern (add the file to `public/team/`, update
that person's `image` field in `TEAM_MEMBERS`) once you have real photos.

### About the intro reel specifically

The file must actually **be** MP4 (H.264 video), not just named `.mp4`.
Browsers check the actual encoded video data, not the filename — renaming
an `.mpg` file to `.mp4` (or the reverse) does not make it playable either
way, since the underlying MPEG-1/MPEG-2 encoding still can't be decoded by
any browser's `<video>` tag.

To actually convert it: upload to a converter like
[FreeConvert.com](https://www.freeconvert.com/mpg-to-mp4) or
[CloudConvert.com](https://cloudconvert.com/mpg-to-mp4) (both free, no
signup, no software install), download the result, rename it to
`intro-reel.mp4`, and drop it into `public/videos/`.

Also worth compressing while you're at it — 25MB is heavy for a video
that autoplays on page load. On FreeConvert/CloudConvert you can usually
set a lower quality/bitrate before converting; aim for roughly 3–8MB for
a short (10–20s) looping clip. If the video is ever missing or fails to
load, the site now shows a fallback photo instead of a black box, so
nothing breaks while you're sorting this out.

## Camera model — now an actual camera

`CameraLensModel.tsx` was previously just the lens barrel, all dark
neutrals, which read as a black blob rather than "a camera." It's now a
small stylized body (tan leather, chrome top plate, viewfinder hump, gold
shutter button, a small red tally light) with the lens barrel mounted on
the front — same click-for-flash interaction, now it actually looks like a
camera. `HeroLensBadge.tsx`'s Canvas camera was pulled back and widened to
frame the larger model.

## Animation fix

The hero's two image columns and the team row use CSS-only infinite-loop
animations. If they looked completely static even after images were
loading, the most likely cause was `globals.css`'s
`prefers-reduced-motion` rule — it was forcing **every** animation on the
page to near-zero duration, which is correct behavior for entrance/hover
animations but also silently froze the continuous marquees. That rule now
explicitly excludes `.animate-marquee`, `.animate-scroll-down`, and
`.animate-scroll-up`, so the two hero columns and the team row keep
scrolling regardless of that OS/browser accessibility setting. The two
vertical scroll animations were also moved into the same `--animate-*`
theme-token mechanism the team marquee already used successfully, for
consistency.

## Team section & profile pages

`TeamMarquee.tsx` renders a horizontally auto-scrolling row of team photos on
the homepage (pauses on hover) — each one links to `/team/[slug]`, a full
profile page with their story, specialties, and a WhatsApp CTA that names
them directly. Team data lives in `TEAM_MEMBERS` in `lib/data.ts`; add,
remove, or edit members there and the marquee + pages update automatically
(pages are statically generated per member via `generateStaticParams`).
Currently 4 placeholder people (Kamran + 3 team roles) with free-license
Unsplash headshots — swap in real names, roles, bios, and photos when ready.

## Performance notes

- `next.config.ts` sets `images.unoptimized: true`. Next's built-in image
  optimizer was proxying every Unsplash image through the dev server and
  timing out on some networks; this skips that proxy and loads images
  directly from Unsplash's own (already-compressed) CDN.
- Hero/portfolio/team images request smaller widths from Unsplash's URL API
  (`w=560–900`, `q=70–75`) to keep payload down.
- The showreel background video uses a lighter Pixabay render (`_medium`)
  with an instant-paint poster frame, rather than the full 4K file, so the
  section never sits blank while it buffers.

## Pricing / Packages section

`Pricing.tsx` has two tabs — Photography and Videography — each revealing
three duration tiers (1/2/3 Day) with their own price and inclusions,
sourced from `PACKAGES` in `lib/data.ts`. Switching tabs animates with a
sliding pill + crossfade.



The hero is a 3-column layout: two vertical, infinitely-scrolling photo
columns (`HeroImageColumn.tsx`, one scrolling down, one scrolling up, pure
CSS animation — no JS scroll listeners) flanking a centered text column.
On mobile the side columns are hidden and a single dimmed background photo
takes their place so the section is never flat black.

The 3D camera lens from the original brief is still there — `HeroLensBadge.tsx`
renders it small and self-contained in the middle of the hero (click it for
a flash + shutter-click sound) instead of as a full-bleed background, which
was rendering as an empty black area for you before. `CameraLensModel.tsx`
(the actual Three.js geometry) is unchanged and reusable if you want to
scale the 3D element back up later.