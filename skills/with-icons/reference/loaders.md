# with icons: loaders

`@withicons/loaders`: animated loaders in every with icons style, plus morph sequences (library icons that keep
turning into one another). Studio with live preview and copy-ready code: https://withicons.com/loaders.html

## Use

| need | write |
|---|---|
| no code at all | `<img src="https://cdn.jsdelivr.net/npm/@withicons/loaders@latest/dist/svg/<style>/<name>.svg" width="32" height="32" alt="Loading">` |
| colour, speed, morph, done state | `<script src="https://cdn.jsdelivr.net/npm/@withicons/loaders@latest/dist/cdn/loaders.js"></script>` then `<with-loader name="<name>" variant="<style>" color="#hex" speed="1.5" label="Saving"></with-loader>` |
| a custom sequence | `<with-loader morph="package,truck,home" effect="slide-left" hold="1"></with-loader>` (any icon names, loaders too) |
| React / Vue | `import { Loader, Morph } from '@withicons/loaders/react'` (or `/vue`): `<Loader name="orbit" variant="glass" size={40} />`, `<Morph items={['file', 'cloud-upload', 'check-circle']} />` |
| JS string | `import { svg, svgAsync, url, morphAsync, search } from '@withicons/loaders'`: `svg('spinner', { size: 32, color: '#16a34a' })` (line built in; other styles: `await svgAsync(name, { style })`) |
| finished | `el.done('check-circle')` blooms a running `<with-loader>` into an icon and stops; `el.reset()` starts again |

- An `<img>` cannot take a colour or speed (it uses the style's colours, black ink): use the tag or a component for those.
- Inline SVG reads CSS from any parent: `--wl-speed: 2` (twice as fast), `--wl-state: paused`, the ink from `color`, style
  colours from `--with-<style>-<role>` (same roles as icons, see styles.md).
- Accessibility: the tag and components are `role="progressbar"` with `aria-label` (default "Loading"); `label=""` hides
  a decorative one. Reduced motion slows every loader (it never freezes: a frozen loader reads as a hang).
- Morph effects: bloom (default), spin, flip, slide-up, slide-left, drop, zoom, fade.
- Pick by what is loading: an upload → `morph-upload`, an AI answer → `ai-sparkle` or `morph-ai`, a payment → `morph-payment`,
  a festival page → its festival loader in its holiday style (diya in utsav, ghost in halloween …).

## Every loader

<!-- loaders:start -->
50 loaders + 15 morph sequences, each in all 34 styles.

### Everyday

| name | says | also |
|---|---|---|
| `bars-equalizer` | audio is playing, listening, or processing a stream | equalizer, audio-bars, sound-bars, eq-loader |
| `chat-typing` | a reply is being written | typing-indicator, typing-bubble, chat-dots-loader, someone-is-typing |
| `clock` | time is passing, it will not be long | clock-loader, time-lapse-clock, clock-spinner, ticking-clock |
| `dots-bounce` | cheerful, springy waiting: almost there | bouncing-dots, hopping-dots, jumping-dots, bounce-loader |
| `dots-typing` | someone (or an AI) is composing a reply | typing-dots, ellipsis-loader, thinking-dots, composing-dots |
| `dots-wave` | a steady flow: data streaming, a signal coming through | wave-dots, sine-dots, flowing-dots, dot-wave-loader |
| `download` | something is coming down to you | download-loader, download-progress-arrow, arrow-into-tray, downloading-arrow |
| `grid-pulse` | lots of small pieces being processed in order | pulsing-grid, grid-wave, nine-squares-loader, tile-wave-loader |
| `hourglass` | this takes a little time: waiting, a timer, patience | sand-timer-loader, hourglass-loader, egg-timer-loader, sand-glass-flip |
| `orbit` | something is in progress, round and round, calmly | planet-orbit, satellite-loader, moon-orbit, orbit-spinner |
| `progress-bar` | working on it, no idea how long: keep going | indeterminate-progress, linear-progress, progress-track, loading-bar |
| `refresh` | reloading, syncing: fresh data on its way | refresh-loader, reload-spinner, sync-arrows, refresh-arrows |
| `ring-dual` | two things working together: syncing, handshaking, processing | dual-ring, double-ring-spinner, counter-rotating-rings, concentric-spinner |
| `ripple` | live, listening, broadcasting or searching nearby | sonar, pulse-rings, radar-pulse, live-pulse |
| `search-scan` | looking through everything to find it | magnifier-scan, search-loader, scanning-magnifier, lens-sweep |
| `spinner` | the default: something is working, steadily and with purpose | loading-spinner, arc-spinner, circular-progress, indeterminate-spinner |
| `spinner-dots` | the everyday activity indicator, softer and rounder | activity-indicator, dots-spinner, ios-spinner, ring-dots |
| `spinner-spokes` | the classic system activity indicator, crisp and quiet | spoke-spinner, activity-spokes, radial-lines-spinner, system-spinner |
| `square-flip` | steady, crisp work: turning things over one by one | flip-square, flipping-card, card-flip-loader, square-flip-spinner |
| `upload` | your file is going up | upload-loader, upload-progress-arrow, arrow-out-of-tray, uploading-arrow |

### Creative

| name | says | also |
|---|---|---|
| `ai-sparkle` | the AI is thinking: generating, with a little magic | ai-thinking, ai-loader, sparkle-loader, magic-sparkle-loader |
| `atom` | science at work: computing, analysing, crunching | atom-loader, electron-orbit-loader, science-loader, atomic-spinner |
| `battery-charge` | charging up, powering on, filling to full | charging-battery, battery-filling, power-up-loader, battery-level-loader |
| `blocks-stack` | building something up, piece by piece | stacking-blocks, toy-blocks-loader, tower-building, block-tower |
| `book` | reading, learning, or content being turned page by page | page-flip, book-pages-turning, reading-loader, flipping-book |
| `bubbles` | fizzing along: light, playful, something is bubbling up | bubbles-loader, rising-bubbles, fizz-loader, soap-bubbles-loader |
| `coffee` | brewing: sit back, it is nearly ready | coffee-loader, steaming-cup, brewing-loader, hot-drink-loader |
| `day-night` | time passing: a whole day goes by while you wait | sun-moon-cycle, day-night-cycle, sunrise-sunset-loader, time-passing-loader |
| `dna` | life science at work: analysing, sequencing, growing | dna-loader, double-helix-loader, helix-spinner, genome-loader |
| `fireflies` | quiet, gentle waiting on a warm summer night | firefly-jar, glowing-fireflies, lightning-bugs, firefly-loader |
| `gears` | the machine is working on it, steadily | meshing-gears, gear-train, cogs-turning, machinery-loader |
| `icon-morph` | work in progress that tells a tiny story: idea, energy, launch, done | morphing-icons, icon-sequence, story-loader, sparkle-to-check |
| `infinity` | endless, smooth progress: it keeps going until it is done | infinity-loader, figure-eight-loader, lemniscate-loader, endless-loop-loader |
| `ink-drop` | a moment of patience: something is being absorbed and settling in | water-drop-ripple, droplet-splash, ink-drop-ripple, drip-loader |
| `newton-cradle` | steady back-and-forth work, momentum carrying through | newtons-cradle, pendulum-balls, cradle-loader, momentum-loader |
| `paper-plane` | sending: your message is on its way | paper-plane-loader, sending-loader, loop-the-loop, message-sending |
| `plant-grow` | something is growing: patient progress that ends in a bloom | seed-to-flower, growing-plant, sprouting-seed, blooming-loader |
| `radar` | scanning, searching, looking for something nearby | radar-sweep, radar-scan, sonar-loader, scanning-radar |
| `rocket` | launching: building, shipping, lift-off is close | rocket-loader, rocket-launch-loader, hovering-rocket, liftoff-loader |
| `shape-shift` | playful waiting that never looks the same twice | morphing-shapes, shape-morph, shapes-loader, transforming-shape |

### Festival

| name | says | also |
|---|---|---|
| `christmas-tree` | cosy holiday cheer: the lights are coming on | xmas-tree-loader, christmas-lights-loader, tree-lights, holiday-tree-loader |
| `confetti` | celebration incoming: something worth a party is nearly ready | confetti-loader, party-loader, party-popper-loader, celebration-loader |
| `crescent` | a calm, blessed night: peaceful patience for Eid and Ramadan | eid-loader, ramadan-loader, crescent-moon-loader, moon-and-stars |
| `diya` | a warm, living flame: festive patience | diwali-loader, oil-lamp-loader, deepavali-loader, diya-flame |
| `fireworks` | celebration on its way: something good is about to happen | fireworks-loader, firework-burst, new-year-fireworks, diwali-fireworks |
| `ghost` | spooky-cute Halloween waiting: boo, almost there | ghost-loader, halloween-loader, floating-ghost, boo-loader |
| `gift` | a surprise is coming: excitement you can feel | gift-loader, present-loader, gift-box-open, surprise-loader |
| `hearts` | made with love: warm, alive and patient | heartbeat-loader, valentine-loader, love-loader, beating-heart |
| `lantern` | a festive, unhurried sway: good fortune is on its way | lunar-new-year-loader, red-lantern-loader, chinese-new-year-loader, swinging-lantern |
| `snowfall` | quiet winter calm: settle in, it is on its way | snow-loader, snowflake-loader, falling-snow, winter-loader |

### Morph sequences (library icons, in order)

| name | says | also |
|---|---|---|
| `morph-upload` | file → cloud-upload → check-circle: a file travels to the cloud and lands safely | uploading, upload-sequence, file-to-cloud |
| `morph-download` | cloud → cloud-download → file-check: something comes down from the cloud to you | downloading, download-sequence, cloud-to-file |
| `morph-payment` | credit-card → wallet → badge-check: the card is charged and the payment confirmed | paying, checkout-loader, payment-processing |
| `morph-ai` | sparkles → brain → bot → message-circle-more: an assistant thinks, then answers | ai-loader, generating, assistant-thinking |
| `morph-send` | pencil → mail → send → mail-check: a message is written, sealed, sent and delivered | sending, send-sequence, mail-sending |
| `morph-secure` | key → lock → shield-check: keys turn and the connection is secured | securing, encrypting, secure-sequence |
| `morph-search` | search → scan-search → file-search → check: looking everywhere until it is found | searching-sequence, finding, lookup-loader |
| `morph-weather` | sun → cloud-sun → cloud-rain → rainbow: the forecast is on its way | forecast-loader, weather-sequence, sky-changing |
| `morph-delivery` | package → truck → home: the parcel is packed, on the road and home | shipping-loader, order-tracking, delivery-sequence |
| `morph-music` | music-note → headphones → audio-waveform → disc: the track is loading, the beat is coming | audio-loader, music-sequence, buffering-music |
| `morph-photo` | camera → image → sparkles: a photo is taken, developed and enhanced | image-processing, photo-sequence, enhancing |
| `morph-build` | wrench → settings → rocket: it is built, tuned and launched | building, deploying, build-sequence |
| `morph-diwali` | diya → sparkler → firecracker → rangoli-pattern: lamps, sparklers and colour: Diwali is loading | diwali-sequence, festival-of-lights, deepavali-loader |
| `morph-winter` | snowflake → christmas-tree → gift → star: snow, the tree, presents and the star on top | christmas-sequence, holiday-season, winter-loader |
| `morph-celebrate` | party-popper → gift → cake → heart: a little party while you wait | celebration-loader, birthday-sequence, party-sequence |
<!-- loaders:end -->
