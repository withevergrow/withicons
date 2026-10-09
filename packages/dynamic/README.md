# @withicons/dynamic

Live icons for **with icons**: icons whose content you set. A calendar shows the date you pass, a clock shows your
time, a badge shows a count, a battery shows its charge, a weather icon shows the temperature, a tag shows a short label.

Each live icon is a small generator. You give it params, it draws the icon, and any of the 34 styles renders it:
`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`. Text uses the with icons stroke font, so it takes on each style's look, needs no font files and stays
readable down to 16px. When a value can't be drawn legibly, the icon switches to something that can: "99+" for big
counts, or a level bar in place of a percentage that doesn't fit.

50 live icons, version 0.4.0. Browse and edit them at https://withicons.com.

```bash
npm i @withicons/dynamic
```

## Plain HTML (no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js"></script>

<with-live-icon name="calendar-date" day="17" month="MAR"></with-live-icon>
<with-live-icon name="calendar-date" today variant="glass" size="48" label="Today"></with-live-icon>
```

The script defines `<with-live-icon>` and `window.WithLive`, and downloads only what the page draws: the line style is
built in, each live icon's drawing code is its own small file (`gens/<name>.js` next to `lite.js`), and the first time
you use another style, its file (`styles/<style>.js`) loads. Every name, param and example is known at once
(`WithLive.list()`, `get()`, `validate()`); `WithLive.render()` is sync once the icon and style are loaded
(`await WithLive.loadIcon(name)` and `await WithLive.load(style)`), and `renderAsync()` loads both by itself.

`cdn/dynamic.js` is the same script with all 50 live icons inline, for pages that call `WithLive.render()` on any
icon synchronously. See [Bundle size](#bundle-size).

## The element

```html
<script type="module">import '@withicons/dynamic/element'</script>

<with-live-icon name="battery-level" level="0.42" variant="skeuo" size="64"></with-live-icon>
```

| attribute | default | notes |
|---|---|---|
| `name` | none | live icon name or alias |
| params | the icon's defaults | one attribute per param, in kebab-case (`maxLength` becomes `max-length`). A param that shares a name with a built-in attribute uses a `param-` prefix: `<with-live-icon name="keycap" param-label="A">`. |
| `params` | none | all params as JSON: `params='{"day":9,"month":"MAY"}'` |
| `today` | off | date and time icons read the viewer's clock (day, month, weekday, time) |
| `variant` | `line` | any style (`style` is reserved in HTML) |
| `size` | `24` | a px number or any CSS length |
| `color` | `currentColor` | follows the text colour unless you set it |
| `vars` | none | style colours as JSON: `vars='{"glass-pane":"#cde"}'` |
| `stroke-width`, `absolute-stroke-width` | style default | only for styles drawn with strokes |
| `label` | what it shows | accessible name on the svg (`role="img"`). Without it the icon is named by its values (`describe()`: "Calendar date, March 17"); `label=""` or `aria-hidden="true"` makes it decorative. |
| `animate` | off | value changes move instead of jumping (see [Change values live](#change-values-live)); `animate="900"` sets the duration in ms |

Change any attribute or JS property (`el.variant = 'luxe'`, `el.params = { day: 3 }`) and the icon redraws. After each
draw the element fires a `with-live-render` event.

When the same param comes from more than one place (its own attribute, the JSON `params`, `today`), the one set last
wins. In markup that is the attribute written later; from script, `el.params = { day: 3 }` overrides an earlier
`day="17"`, and setting `day` again afterwards overrides `params`.

Styles that take longer than a frame to draw (see [Performance](#performance)) never block the page: the element keeps
its current drawing, renders the new one in the background, and shows only the newest params when several changes
arrive at once.

## Change values live

The element redraws whenever an attribute changes, so values from an API, a WebSocket, a timer or a click are one
`setAttribute` away. Add `animate` and every change moves to its new value instead of jumping:

```html
<with-live-icon id="unread" name="bell-count" count="3" animate></with-live-icon>
<script>
  const icon = document.getElementById('unread')
  const socket = new WebSocket('wss://example.com/live/bell')
  socket.onmessage = e => icon.setAttribute('count', JSON.parse(e.data).count)   // 3 rolls up to 7
</script>
```

`el.animateTo({ count: 7 }, { ms: 900 })` (or `animateTo(el, values, options)` from `@withicons/dynamic/element`, and
`WithLive.animateTo` in the CDN script) animates one change without the attribute and resolves once the new values are
drawn. Several attributes set in the same task become one transition, and a new value mid-way retargets from what is on
screen.

| value | motion |
|---|---|
| numbers (counts, temperatures, prices) | roll through every value between, like an odometer |
| levels (battery, progress, signal) | ease in on a light spring |
| analogue clock hands | the short way round the 12-hour face: 10:10 to 03:00 goes forward 4 h 50 min |
| digital clock times | the short way round 24 hours |
| choices, text, switches | cross-fade once |

The last frame is always exactly the new value. Cheap styles (line, duo, blueprint, sketch, pixel) move every frame;
slower styles draw a few frames ahead in the render worker and play them from the cache, so a transition never blocks
the page. With `prefers-reduced-motion: reduce` (or `setMotion({ reduced: true })`) values change at once.
In React and Vue, pass `animate` (or a duration in ms) to `<LiveIcon>` and change the props.

For your own painting, `transition(name, from, to, style, { ms, paint(params), done })` runs the same planner and
`interpolate(name, from, to, t)` returns the params at any point.

## JavaScript

```js
import { render, list, get, defaults, validate } from '@withicons/dynamic'

render('calendar-date', { day: 9, month: 'MAY' })                      // '<svg ...>' in line
render('calendar-date', { day: 9, month: 'MAY' }, 'glass', { size: 48, label: '9 May' })
render('bell-count', { count: 120 }, 'sticker')                        // shows 99+
list()                     // every live icon name
get('calendar-date')       // { title, category, params, examples, defaults, aliases, ... }
validate('calendar-date', { day: 40 })   // ['day=40: outside 1..31']
```

- `render(name, params, style = 'line', options)` returns an SVG string. It runs synchronously and caches results.
  Params are lenient: missing ones use the defaults, numbers are clamped, and text is upper-cased and cut to length.
  Options: `size`, `color`, `vars`, `label`, `class`, `strokeWidth`, `absoluteStrokeWidth`, and `flat`. `flat`
  resolves CSS variables to plain colours for `<img>`, canvas and email.
- `dataUri(...)` takes the same arguments and returns a `data:` URI.
- `renderAsync(...)` loads the style first if it isn't loaded yet, and draws rich styles off the main thread. Pass
  `{ latest: true }` for sliders and live previews: only the newest pending call per icon and style is drawn, and the
  replaced ones reject with code `WITH_SUPERSEDED`.
- `warm(name, params, style)` draws in the background so a later `render()` is instant; `cached(...)` tells you if it
  already is.
- `loaded(style)` says whether the style's renderer runs on this thread. In the lite and CDN builds a rich style can be
  drawn only by the render workers, so `loaded(style)` can stay `false` while `renderAsync()` and `<with-live-icon>`
  draw it fine; check `cached(...)` (or await `renderAsync()`) rather than `loaded()` before a sync `render()`.
- Metadata: `list()`, `catalog()`, `get(name)`, `defaults(name)`, `paramsOf(name)`.
- Params: `resolve(name, params)` fills in and corrects values; `validate(name, params)` checks them strictly.
- `now()` returns today's params `{ day, month, weekday, year, time }`, for example `render('calendar-date', now())`.
- `describe(name, params)` says what the icon shows: `'Calendar date, March 17'` (the default accessible name).
- Motion: `transition()`, `plan()`, `interpolate()`, `setMotion()`, `reducedMotion()` (see [Change values live](#change-values-live)).
- `skeleton(name, params)` returns the raw drawing, and `nodes(name, params, style)` returns the `[tag, attrs]` list.

### Bundle size

`@withicons/dynamic` has every style built in, so `render()` always works synchronously, in Node and in the browser.
Use `@withicons/dynamic/lite` to keep a page small: it has only the line style, and other styles load the first time you
use them.

```js
import { load, render, renderAsync } from '@withicons/dynamic/lite'
await load('kawaii')                                  // or: import '@withicons/dynamic/styles/kawaii'
render('weather', { condition: 'rain', temperature: 12 }, 'kawaii')
await renderAsync('battery-level', { level: 0.2 }, 'luxe')
```

| file | what | size | gzip |
|---|---|---|---|
| `index.js` | full runtime, all 34 styles, sync render() | 2052 KB | 743 KB |
| `lite.js` | core + line; other styles load on first use | 172 KB | 62.8 KB |
| `element.js` | `<with-live-icon>` on lite | 179 KB | 65.8 KB |
| `react.js` | `<LiveIcon>` on lite (react not included) | 174 KB | 63.9 KB |
| `vue.js` | `<LiveIcon>` on lite (vue not included) | 173 KB | 63.7 KB |
| `styles/<style>.js` | one style chunk: smallest `duo`, largest `gothic` (225 KB / 74.1 KB gzip) | 3.9 KB | 2.0 KB |
| `cdn/lite.js` | classic script: `window.WithLive` + element, line inline; each live icon loads its own `cdn/gens/<name>.js` on first draw | 125 KB | 43.6 KB |
| `cdn/gens/<name>.js` | one live icon's drawing code (typical `price-tag`; largest `cart-count` 9.9 KB / 4.5 KB gzip) | 3.9 KB | 2.0 KB |
| `cdn/dynamic.js` | classic script: `window.WithLive` + element, line and every live icon inline (sync `render()` of any icon) | 180 KB | 65.1 KB |

## Performance

Every result is cached, so a repeat render is free. A new render costs what its style costs: stroke styles draw in a
few milliseconds, while the rich styles build whole-icon geometry (fields, bevels, boolean layers).

| style | one new render, typical |
|---|---|
| `line`, `duo`, `blueprint`, `sketch`, `pixel` | under 10 ms |
| `engrave`, `kawaii`, `solid` | 15 to 30 ms |
| `anime`, `plush`, `retro`, `pastel`, `sticker`, `coquette`, `skeuo`, `bauhaus` | 45 to 100 ms |
| `gloss`, `luxe`, `glass`, `gothic` | 100 to 160 ms |

Medians over the 50 live icons on a laptop; the largest icons (alarm clock, gauges) take two to three times as long.

`cost(style)` returns the current estimate, a moving average of what this device measured. In the browser,
`<with-live-icon>` and `renderAsync()` send any style slower than a frame to a render worker (`dist/worker.js` for the
ES module builds, the CDN script itself for the classic build). The result is byte-identical to a main-thread render.
If a worker cannot start (a `file://` page, a CSP without `worker-src blob:`, or Node), renders run on the main thread
one per task, so the page still paints and takes input between icons. Synchronous `render()` always runs where you
call it: for many rich icons, prefer the element, `renderAsync()` or `warm()`, or render on the server.

The worker starts on the first render of a rich style, never at load: a page that only shows cheap styles (`line`,
`duo`, `blueprint`...) never downloads it. Inside the worker each style is a separate chunk loaded on demand.

**Vite**: bundle workers as ES modules, so those style chunks stay separate files (with Vite's default `iife` worker
format every style is inlined into one large worker file, and the build is much slower):

```js
// vite.config.js
export default { worker: { format: 'es' } }
```

webpack 5 keeps the worker's chunks split by default.

## React

```jsx
import { LiveIcon } from '@withicons/dynamic/react'

<LiveIcon name="calendar-date" day={17} month="MAR" variant="glass" size={48} />
<LiveIcon name="calendar-date" today label="Today" />
<LiveIcon name="bell-count" count={unread} className="nav-icon" onClick={open} />
<LiveIcon name="battery-level" level={charge} animate />          // moves to each new level
```

The icon's params are props. A param with the same name as a wrapper prop (for example `label` on `keycap`) goes in `params={{ label: 'A' }}`. Other props (`className`, `style`, `onClick`, `aria-*`, `data-*`) go on the `<svg>`.
Styles other than line load on first use, and an empty svg of the same size holds the space until then. With server
rendering, import the styles you use (`import '@withicons/dynamic/styles/glass'`) so the first render is complete.

## Vue

```vue
<script setup>
import { LiveIcon } from '@withicons/dynamic/vue'
</script>

<template>
  <LiveIcon name="calendar-date" :day="17" month="MAR" variant="glass" :size="48" />
  <LiveIcon name="clock-time" time="10:10" variant="bauhaus" />
  <LiveIcon name="bell-count" :count="unread" animate />
</template>
```

## Live icons and their params

Each table row gives a param's name, type, range or options, default, and what it does.

### charts

| icon | params | element |
|---|---|---|
| `bar-values`<br>Bar chart values | `bars` int 3–5, default `4` — Number of bars<br>`bar1` level 0–1, default `0.45` — Bar 1 height<br>`bar2` level 0–1, default `0.75` — Bar 2 height<br>`bar3` level 0–1, default `0.55` — Bar 3 height<br>`bar4` level 0–1, default `1` — Bar 4 height<br>`bar5` level 0–1, default `0.7` — Bar 5 height<br>`baseline` bool, default `true` — Show the baseline | `<with-live-icon name="bar-values" bars="3" bar1="0.35" bar2="0.65" bar3="1">` |
| `gauge-value`<br>Gauge with value | `value` int 0–999, default `72` — Value<br>`max` int 1–999, default `100` — Scale maximum<br>`reading` bool, default `true` — Show the value | `<with-live-icon name="gauge-value" value="0">` |

### commerce

| icon | params | element |
|---|---|---|
| `cart-count`<br>Cart with count | `count` int 0–9999, default `2` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner | `<with-live-icon name="cart-count" count="0">` |
| `percent-badge`<br>Percent badge | `value` int 0–100, default `20` — Percent<br>`sign` enum: none, minus, plus, default `none` — Sign | `<with-live-icon name="percent-badge" value="20">` |
| `price-tag`<br>Price tag | `amount` int 0–999, default `9` — Amount<br>`currency` enum: usd, eur, gbp, inr, none, default `usd` — Currency sign | `<with-live-icon name="price-tag" amount="9">` |
| `ribbon-label`<br>Ribbon banner | `text` text (up to 4), default `BEST` — Text | `<with-live-icon name="ribbon-label" text="BEST">` |
| `sale-sticker`<br>Sale sticker | `text` text (up to 4), default `-50%` — Text<br>`points` int 8–20, default `14` — Number of points | `<with-live-icon name="sale-sticker" text="-50%">` |
| `tag-label`<br>Label tag | `text` text (up to 4), default `SALE` — Text | `<with-live-icon name="tag-label" text="SALE">` |
| `ticket-number`<br>Ticket number | `number` int 0–999, default `42` — Number<br>`hash` bool, default `false` — Show # before the number | `<with-live-icon name="ticket-number" number="1">` |

### communication

| icon | params | element |
|---|---|---|
| `bell-count`<br>Bell with count | `count` int 0–9999, default `3` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner | `<with-live-icon name="bell-count" count="0">` |
| `chat-count`<br>Chat with count | `count` int 0–9999, default `7` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner<br>`bubble` enum: round, square, default `round` — Bubble shape | `<with-live-icon name="chat-count" count="0">` |
| `inbox-count`<br>Inbox with count | `count` int 0–9999, default `8` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner | `<with-live-icon name="inbox-count" count="0">` |
| `mail-count`<br>Mail with count | `count` int 0–9999, default `5` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner | `<with-live-icon name="mail-count" count="0">` |
| `speech-bubble-text`<br>Speech bubble text | `text` text (up to 3), default `HI` — Text (up to 3 characters)<br>`tail` enum: left, right, default `left` — Tail side | `<with-live-icon name="speech-bubble-text" text="HI">` |

### devices

| icon | params | element |
|---|---|---|
| `battery-charging-level`<br>Charging battery level | `level` level 0–1, default `0.55` — Charge | `<with-live-icon name="battery-charging-level" level="1">` |
| `battery-level`<br>Battery level | `level` level 0–1, default `0.7` — Charge<br>`warnAt` int 0–50, default `15` — Show a warning at or below (%) — 0 turns it off | `<with-live-icon name="battery-level" level="1">` |
| `battery-percent`<br>Battery percentage | `level` level 0–1, default `0.8` — Charge (0-1, or "80%"), written as a percentage<br>`percent` bool, default `true` — Add the % sign when it fits | `<with-live-icon name="battery-percent" level="1">` |
| `battery-vertical`<br>Battery level (upright) | `level` level 0–1, default `0.6` — Charge<br>`warnAt` int 0–50, default `15` — Show a warning at or below (%) — 0 turns it off | `<with-live-icon name="battery-vertical" level="1">` |
| `cellular-tech`<br>Network type | `tech` text (up to 4), default `5G` — Network (up to 4 characters)<br>`chip` bool, default `true` — Set it in a chip | `<with-live-icon name="cellular-tech" tech="5G">` |
| `keycap`<br>Keycap | `label` text (up to 4), default `A` — Key label<br>`symbol` enum: none, command, shift, option, enter, backspace, tab, up, down, left, right, space, default `none` — Symbol (replaces the label) | `<with-live-icon name="keycap" param-label="A">` |
| `signal-bars`<br>Signal strength | `bars` int 0–4, default `3` — Bars lit<br>`ghost` bool, default `true` — Show unlit bars as dots<br>`noSignal` bool, default `true` — Cross at zero bars | `<with-live-icon name="signal-bars" bars="4">` |
| `wifi-strength`<br>Wi-Fi strength | `strength` int 0–3, default `2` — Arcs lit<br>`ghost` bool, default `true` — Show unlit arcs as dots | `<with-live-icon name="wifi-strength" strength="3">` |

### files

| icon | params | element |
|---|---|---|
| `file-type`<br>File type | `type` text (up to 4), default `PDF` — File type | `<with-live-icon name="file-type" type="PDF">` |
| `folder-label`<br>Labelled folder | `text` text (up to 4), default `DOCS` — Label | `<with-live-icon name="folder-label" text="DOCS">` |

### layout

| icon | params | element |
|---|---|---|
| `app-badge`<br>App with badge | `count` int 0–9999, default `4` — Count (0 hides the badge)<br>`dotOnly` bool, default `false` — Dot only (no number)<br>`limit` enum: 99+, 9+, default `99+` — Biggest number shown<br>`corner` enum: top-right, bottom-right, default `top-right` — Badge corner | `<with-live-icon name="app-badge" count="0">` |

### maps

| icon | params | element |
|---|---|---|
| `map-pin-number`<br>Map pin number | `label` text (up to 2), default `3` — Number or letter | `<with-live-icon name="map-pin-number" param-label="1">` |

### media

| icon | params | element |
|---|---|---|
| `volume-level`<br>Volume level | `waves` int 0–3, default `2` — Sound waves<br>`ghost` bool, default `false` — Show silent waves as dots<br>`muted` bool, default `false` — Muted (cross instead of waves) | `<with-live-icon name="volume-level" waves="3">` |

### objects

| icon | params | element |
|---|---|---|
| `dice`<br>Dice | `value` int 1–6, default `5` — Face (1-6)<br>`tilt` bool, default `false` — Tossed at an angle | `<with-live-icon name="dice" value="1">` |

### status

| icon | params | element |
|---|---|---|
| `badge-text`<br>Text badge | `text` text (up to 4), default `NEW` — Text<br>`shape` enum: pill, rounded, default `pill` — Shape | `<with-live-icon name="badge-text" text="NEW">` |
| `progress-ring`<br>Progress ring | `value` int 0–100, default `68` — Progress (%)<br>`number` bool, default `true` — Show the number<br>`track` bool, default `true` — Show the remaining track | `<with-live-icon name="progress-ring" value="0">` |
| `rating-stars`<br>Star rating | `rating` number 0–5, default `3.5` — Rating (out of 5)<br>`layout` enum: stars, score, default `stars` — Layout<br>`empty` enum: dots, small stars, hidden, default `dots` — Stars not earned | `<with-live-icon name="rating-stars" rating="0">` |
| `step-number`<br>Numbered step | `step` int 0–99, default `1` — Step number<br>`done` bool, default `false` — Completed (show a check)<br>`shape` enum: circle, square, default `circle` — Shape | `<with-live-icon name="step-number" step="1">` |

### time

| icon | params | element |
|---|---|---|
| `alarm-clock-time`<br>Alarm clock showing a time | `time` time HH:MM, default `07:00` — Alarm time (HH:MM)<br>`ringing` bool, default `false` — Ringing | `<with-live-icon name="alarm-clock-time" time="07:00">` |
| `calendar-date`<br>Calendar date | `day` int 1–31, default `17` — Day of the month<br>`month` enum: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC, default `MAR` — Month<br>`rings` bool, default `true` — Binder rings | `<with-live-icon name="calendar-date" day="17">` |
| `calendar-event`<br>Calendar event | `day` int 1–31, default `17` — Day of the month<br>`marker` enum: dot, dots, bar, label, default `dot` — Event marker<br>`label` text (up to 3), default `DUE` — Label, up to 3 characters (when the marker is a label)<br>`rings` bool, default `true` — Binder rings | `<with-live-icon name="calendar-event" day="17">` |
| `calendar-month`<br>Calendar month | `month` enum: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC, default `MAR` — Month<br>`marked` int 0–6, default `5` — Highlighted dot in the grid (1-6, 0 = none)<br>`rings` bool, default `true` — Binder rings | `<with-live-icon name="calendar-month" month="MAR">` |
| `calendar-range`<br>Calendar range | `from` int 1–31, default `12` — First day<br>`to` int 1–31, default `18` — Last day<br>`rings` bool, default `true` — Binder rings | `<with-live-icon name="calendar-range" from="12">` |
| `calendar-tear`<br>Tear-off calendar | `day` int 1–31, default `17` — Day of the month<br>`torn` bool, default `true` — Torn bottom edge | `<with-live-icon name="calendar-tear" day="17">` |
| `calendar-weekday`<br>Calendar weekday | `day` int 1–31, default `17` — Day of the month<br>`weekday` enum: MON, TUE, WED, THU, FRI, SAT, SUN, default `TUE` — Day of the week<br>`rings` bool, default `true` — Binder rings | `<with-live-icon name="calendar-weekday" day="17">` |
| `clock-time`<br>Clock showing a time | `time` time HH:MM, default `10:10` — Time (HH:MM)<br>`shape` enum: round, square, default `round` — Clock shape | `<with-live-icon name="clock-time" time="10:10">` |
| `digital-clock`<br>Digital clock | `time` time HH:MM, default `09:41` — Time (HH:MM)<br>`format` enum: 24h, 12h, default `24h` — Hour format<br>`frame` bool, default `true` — Show the display frame | `<with-live-icon name="digital-clock" time="09:41">` |
| `stopwatch`<br>Stopwatch with elapsed time | `seconds` int 0–60, default `15` — Elapsed seconds (of a minute) | `<with-live-icon name="stopwatch" seconds="0">` |
| `timer-ring`<br>Countdown timer | `left` int 0–99, default `45` — Time left (number shown)<br>`total` int 1–99, default `60` — Out of (full ring)<br>`number` bool, default `true` — Show the number | `<with-live-icon name="timer-ring" left="45">` |
| `watch-time`<br>Wristwatch showing a time | `time` time HH:MM, default `10:10` — Time (HH:MM)<br>`shape` enum: round, square, default `round` — Case shape | `<with-live-icon name="watch-time" time="10:10">` |

### users

| icon | params | element |
|---|---|---|
| `avatar-initials`<br>Avatar initials | `initials` text (up to 2), default `JD` — Initials<br>`shape` enum: circle, square, default `circle` — Shape<br>`status` enum: none, online, offline, default `none` — Status dot | `<with-live-icon name="avatar-initials" initials="JD">` |

### weather

| icon | params | element |
|---|---|---|
| `humidity`<br>Humidity | `humidity` int 0–100, default `64` — Humidity (%)<br>`display` enum: number, level, default `number` — Show as | `<with-live-icon name="humidity" humidity="64">` |
| `thermometer-level`<br>Thermometer level | `level` level 0–1, default `0.65` — Level<br>`value` int -99–199, default `37` — Reading<br>`unit` enum: degree, celsius, fahrenheit, none, default `degree` — Unit<br>`showValue` bool, default `true` — Show the reading<br>`scale` enum: auto, manual, default `auto` — Level: follow the reading (auto) or use Level (manual) | `<with-live-icon name="thermometer-level" unit="celsius">` |
| `uv-index`<br>UV index | `index` int 0–20, default `6` — UV index | `<with-live-icon name="uv-index" index="6">` |
| `weather`<br>Weather now | `condition` enum: sunny, partly, cloudy, rain, storm, snow, fog, night, default `partly` — Condition<br>`temperature` int -99–199, default `21` — Temperature<br>`unit` enum: degree, celsius, fahrenheit, none, default `degree` — Unit after the number<br>`showTemperature` bool, default `true` — Show the temperature | `<with-live-icon name="weather" condition="sunny" temperature="31">` |
| `wind-speed`<br>Wind speed | `speed` int 0–999, default `12` — Speed<br>`unit` enum: none, kt, mph, kmh, ms, bft, default `none` — Unit | `<with-live-icon name="wind-speed" speed="12">` |

## Params, in plain words

| type | what you pass |
|---|---|
| `int` / `number` | a number. Out-of-range values are clamped. |
| `level` | 0 to 1, or a string such as `"40%"` |
| `time` | `"HH:MM"`, 24-hour |
| `enum` | one of the listed options (case does not matter) |
| `text` | up to 4 characters from `0-9 A-Z % ° : - + / . , ! ? $ € £ ₹ # & * '` |
| `bool` | `true` / `false` (in HTML, the attribute present, or `"true"` / `"false"`) |

## License

MIT. Part of [with icons](https://withicons.com), powered by Evergrow.
