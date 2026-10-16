# @withicons/loaders

**50 animated loaders** (20 common, 20 creative, 10 festival) and **15 morph
sequences** (library icons that keep turning into one another while something loads), each pre-rendered in **all 34
[with icons](https://withicons.com) styles**. Every loader is one small self-contained SVG animated with CSS
(transform + opacity only, so it runs on the compositor at 60 fps), honours `prefers-reduced-motion`, and needs no JavaScript.

Design your own in the **Loader Studio**: https://withicons.com/loaders.html

## The one-liner (no install, no JS)

```html
<img src="https://cdn.jsdelivr.net/npm/@withicons/loaders@0.5.0/dist/svg/line/spinner.svg" width="32" height="32" alt="Loading">
```

Swap `line` for any style (line, solid, duo, gloss, engrave, blueprint, sketch, glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush, clay, bento, suite, dock, liquid, chrome, soft3d, brutal, utsav, rangoli, halloween, christmas, lunar, valentine) and `spinner` for any loader name below.

## Web component (themeable, any framework)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/loaders@0.5.0/dist/cdn/loaders.js"></script>
<with-loader name="orbit" variant="glass" size="48" speed="1.2" color="#7c5cff"></with-loader>
<with-loader morph="file,cloud-upload,check-circle" effect="slide-up"></with-loader>
```

`el.done('check-circle')` turns a running loader into a finished icon; `el.reset()` starts it again; `paused` pauses.

## npm

```bash
npm i @withicons/loaders
```

```js
import { svg, svgAsync, url, morphAsync, search } from '@withicons/loaders'
el.innerHTML = svg('spinner', { size: 32, color: '#16a34a', label: 'Saving' })   // line is built in (sync)
el.innerHTML = await svgAsync('fireworks', { style: 'utsav', size: 64 })          // other styles load on demand
search('ai thinking')     // -> [{ name: 'ai-sparkle', … }, { name: 'morph-ai', … }]
```

React / Vue:

```jsx
import { Loader, Morph } from '@withicons/loaders/react'   // or '@withicons/loaders/vue'
<Loader name="dots-typing" variant="kawaii" size={40} />
<Morph items={['package', 'truck', 'home']} effect="slide-left" />
```

## Control

| knob | how |
|---|---|
| colour | `color` (currentColor ink) and style colours `--with-<style>-<role>` |
| speed | `speed` option / attribute, or CSS `--wl-speed: 1.5` on any ancestor |
| pause | `paused`, or CSS `--wl-state: paused` |
| size | any number or CSS length; the drawing is a 24-unit grid that stays crisp |
| a11y | `label` (default "Loading"); `label=""` makes it decorative. Reduced motion slows it, never freezes it |

## Loaders

### Common
| name | title | says |
|---|---|---|
| `bars-equalizer` | Equalizer bars | audio is playing, listening, or processing a stream |
| `chat-typing` | Typing | a reply is being written |
| `clock` | Clock | time is passing, it will not be long |
| `dots-bounce` | Bouncing dots | cheerful, springy waiting: almost there |
| `dots-typing` | Typing dots | someone (or an AI) is composing a reply |
| `dots-wave` | Dot wave | a steady flow: data streaming, a signal coming through |
| `download` | Download | something is coming down to you |
| `grid-pulse` | Grid pulse | lots of small pieces being processed in order |
| `hourglass` | Hourglass | this takes a little time: waiting, a timer, patience |
| `orbit` | Orbit | something is in progress, round and round, calmly |
| `progress-bar` | Progress bar | working on it, no idea how long: keep going |
| `refresh` | Refresh | reloading, syncing: fresh data on its way |
| `ring-dual` | Dual ring | two things working together: syncing, handshaking, processing |
| `ripple` | Ripple | live, listening, broadcasting or searching nearby |
| `search-scan` | Scanning search | looking through everything to find it |
| `spinner` | Spinner | the default: something is working, steadily and with purpose |
| `spinner-dots` | Dot spinner | the everyday activity indicator, softer and rounder |
| `spinner-spokes` | Spoke spinner | the classic system activity indicator, crisp and quiet |
| `square-flip` | Flipping square | steady, crisp work: turning things over one by one |
| `upload` | Upload | your file is going up |

### Creative
| name | title | says |
|---|---|---|
| `ai-sparkle` | AI sparkle | the AI is thinking: generating, with a little magic |
| `atom` | Atom | science at work: computing, analysing, crunching |
| `battery-charge` | Battery charge | charging up, powering on, filling to full |
| `blocks-stack` | Stacking blocks | building something up, piece by piece |
| `book` | Book | reading, learning, or content being turned page by page |
| `bubbles` | Bubbles | fizzing along: light, playful, something is bubbling up |
| `coffee` | Coffee | brewing: sit back, it is nearly ready |
| `day-night` | Day and night | time passing: a whole day goes by while you wait |
| `dna` | DNA helix | life science at work: analysing, sequencing, growing |
| `fireflies` | Fireflies | quiet, gentle waiting on a warm summer night |
| `gears` | Gears | the machine is working on it, steadily |
| `icon-morph` | Icon morph | work in progress that tells a tiny story: idea, energy, launch, done |
| `infinity` | Infinity | endless, smooth progress: it keeps going until it is done |
| `ink-drop` | Ink drop | a moment of patience: something is being absorbed and settling in |
| `newton-cradle` | Newton's cradle | steady back-and-forth work, momentum carrying through |
| `paper-plane` | Paper plane | sending: your message is on its way |
| `plant-grow` | Plant grow | something is growing: patient progress that ends in a bloom |
| `radar` | Radar | scanning, searching, looking for something nearby |
| `rocket` | Rocket | launching: building, shipping, lift-off is close |
| `shape-shift` | Shape shift | playful waiting that never looks the same twice |

### Festival
| name | title | says |
|---|---|---|
| `christmas-tree` | Christmas tree | cosy holiday cheer: the lights are coming on |
| `confetti` | Confetti | celebration incoming: something worth a party is nearly ready |
| `crescent` | Crescent moon | a calm, blessed night: peaceful patience for Eid and Ramadan |
| `diya` | Diya | a warm, living flame: festive patience |
| `fireworks` | Fireworks | celebration on its way: something good is about to happen |
| `ghost` | Ghost | spooky-cute Halloween waiting: boo, almost there |
| `gift` | Gift | a surprise is coming: excitement you can feel |
| `hearts` | Hearts | made with love: warm, alive and patient |
| `lantern` | Red lantern | a festive, unhurried sway: good fortune is on its way |
| `snowfall` | Snowfall | quiet winter calm: settle in, it is on its way |

### Morph sequences
| name | title | says |
|---|---|---|
| `morph-ai` | AI thinking | an assistant thinks, then answers |
| `morph-build` | Build | it is built, tuned and launched |
| `morph-celebrate` | Celebrate | a little party while you wait |
| `morph-delivery` | Delivery | the parcel is packed, on the road and home |
| `morph-diwali` | Diwali | lamps, sparklers and colour: Diwali is loading |
| `morph-download` | Download | something comes down from the cloud to you |
| `morph-music` | Music | the track is loading, the beat is coming |
| `morph-payment` | Payment | the card is charged and the payment confirmed |
| `morph-photo` | Photo | a photo is taken, developed and enhanced |
| `morph-search` | Searching | looking everywhere until it is found |
| `morph-secure` | Securing | keys turn and the connection is secured |
| `morph-send` | Send message | a message is written, sealed, sent and delivered |
| `morph-upload` | Upload | a file travels to the cloud and lands safely |
| `morph-weather` | Weather | the forecast is on its way |
| `morph-winter` | Winter holidays | snow, the tree, presents and the star on top |

Morph effects: bloom, spin, flip, slide-up, slide-left, drop, zoom, fade.

MIT. Powered by Evergrow.
