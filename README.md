# Astro app starter

A free, self-hosted starter for a remedies + yantra + daily horoscope feature.
No paid APIs, no database required for this MVP — content lives in flat JSON
files and is matched by deterministic rules in `lib/matching.ts`.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000

## What's included

- `content/remedies/*.json` — 9 grahas (planets), each with 3 remedy variants,
  a yantra reference, and the dosha triggers that would normally recommend it.
- `content/yantras/*.svg` — original, simple geometric SVGs (not copied from
  any other site). Redraw or refine these before shipping publicly.
- `content/horoscope/*.json` — 12 signs x 4 life areas x 6 snippets each,
  generated from templates. **Replace these placeholder lines with your own
  writing** before launch — they're structurally correct but generic.
- `lib/matching.ts` — the whole "engine". `dailyIndex()` hashes the date + a
  seed string to deterministically pick which snippet/remedy shows today,
  so content rotates daily without randomness or a database.
- `app/remedies` and `app/horoscope` — Next.js App Router pages consuming
  the engine.

## Extending this

1. **Real birth-chart matching**: once you compute a user's actual planetary
   positions (e.g. with the free, MIT-licensed `astronomy-engine` package,
   already in package.json), pass the weak/afflicted planet into
   `getRemedy(planet)` instead of letting the user browse manually.

2. **Real yantra art**: the SVGs here are placeholders with correct traditional
   structure (concentric squares, triangles, lotus petals, bindu point).
   Have a designer redraw them properly before shipping.

3. **Real horoscope copy**: swap the templated snippets in
   `content/horoscope/*.json` for actual astrologer-written or AI-assisted
   copy. Keep the JSON shape (`areas.love`, `areas.career`, etc. as string
   arrays) and the engine keeps working unchanged.

4. **Panchang / kundli**: not included in this starter. That needs real
   astronomical calculation (tithi, nakshatra, rahu kaal etc.) — build it as
   a separate `lib/panchang.ts` using `astronomy-engine`, then feed its output
   into this same remedy-matching engine.
