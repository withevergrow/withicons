# @withicons/dynamic

Live icons for **with icons**: icons whose content you set. A calendar shows the date you pass, a clock shows your
time, a badge shows a count, a battery shows its charge, a weather icon shows the temperature, a tag shows a short label.

Each live icon is a small generator. You give it params, it draws the icon, and any of the {{styleCount}} styles renders it:
{{styles}}. Text uses the with icons stroke font, so it takes on each style's look, needs no font files and stays
readable down to 16px. When a value can't be drawn legibly, the icon switches to something that can: "99+" for big
counts, or a level bar in place of a percentage that doesn't fit.

{{count}} live icons, version {{version}}. Browse and edit them at https://withicons.com.

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

`cdn/dynamic.js` is the same script with all {{count}} live icons inline, for pages that call `WithLive.render()` on any
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
{{sizes}}

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

{{table}}

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
