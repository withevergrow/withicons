# with icons: live icons (`@withicons/dynamic`)

Live icons draw a value you set inside the icon (a date, a time, a count, a level, a short label). Each one is a
generator that builds a normal skeleton, so it renders in every style. Quick start is in SKILL.md section 7b; this file
has every live icon with its params, bundler setup, bundle sizes and recipes.

## Pick the right one

Read the "what it shows" column: neighbours differ on purpose. `battery-level` draws the charge as a fill bar (and a
warning mark when low); `battery-percent` writes the number inside; `battery-vertical` is a standing battery;
`battery-charging-level` adds the bolt. `bell-count`, `mail-count`, `inbox-count`, `chat-count` and `cart-count` all
show a count badge on a different object; `app-badge` is a rounded app tile with a badge. `clock-time` (hands),
`digital-clock` (digits), `watch-time` (wristwatch) and `alarm-clock-time` (twin bells) all take `time`.
Text params are short on purpose (2 to 4 characters) so they stay legible at 24 px; counts above 99 show "99+".

## Setup

| where | how |
|---|---|
| no build (CDN) | `<script src="https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js"></script>` then `<with-live-icon name="…">` |
| bundler, element | `import '@withicons/dynamic/element'` |
| React / Vue | `import { LiveIcon } from '@withicons/dynamic/react'` (or `/vue`) |
| pure function (Node, SSR, canvas) | `import { render, now } from '@withicons/dynamic'`; `render(name, params, style, { size, label })` returns an SVG string |

**Vite**: add `worker: { format: 'es' }` to `vite.config`. The runtime starts its render worker with
`new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })`; Vite's default worker format (`iife`) cannot
split code, so it pulls every style into one worker file (about 1.5 MB) and slows the build a lot. With `es` the
worker loads each style on first use, like the page does. The first `es` build can still take ~90 s while Vite
bundles the worker graph; later builds take a couple of seconds. Each style chunk then appears twice in `dist` (once
for the page, once for the worker): that is expected, and a page downloads only the styles it shows.
The worker starts on the first render of a slow (rich) style, never at load: a page that only shows cheap styles (line,
duo, blueprint …) never downloads it. webpack 5 (and Next.js) keep the worker's chunks split with no extra config.
If a worker cannot start (a `file://` page, a CSP without `worker-src`, Node), rendering falls back to the main thread
one icon per task, so nothing breaks; only rich styles on many icons get slower.

**Server rendering** (Next.js, Nuxt): styles other than line load on first use, and an empty svg of the same size holds
the space until then. Import the styles you use (`import '@withicons/dynamic/styles/glass'`) so the server HTML is complete.

## Sizes (gzipped, 0.2.2)

| piece | size |
|---|---|
| `cdn/lite.js` (no build: runtime, element, line style) | ~40 KB, then each live icon (`gens/<name>.js`) and each style on first use |
| `@withicons/dynamic/react`, `/vue`, `/element` (runtime + line style + every live icon) | ~58 to 61 KB |
| `dist/worker.js` (render worker, same runtime) | ~57 KB, loaded only when a slow style renders |
| each extra style, loaded on first use | duo ~1 KB, solid / engrave / sketch / retro ~7 to 9 KB, glass / gloss / luxe / kawaii / sticker / blueprint ~10 to 13 KB, skeuo ~18 KB, pixel ~26 KB, pastel / coquette / bauhaus ~48 KB, plush ~57 KB, anime ~64 KB, gothic ~70 KB |
| `@withicons/dynamic` root import | imports every style up front (~520 KB): use it on a server or in a script, not in a page bundle |

## Values that change, and animation

- Set the attribute or the prop; add `animate` (attribute, or `animate` / `animate={900}` on `LiveIcon`; the number is the transition in ms, and it takes that long) so the change
  moves: numbers roll, levels ease, hands take the short way round, words cross-fade. Reduced motion makes it instant.
- **What "roll" looks like.** The whole transition takes the `animate` time (default 650 ms) whatever the distance, eased
  in and out. A number steps through the values in between (3 to 7 shows 4, 5, 6; 0 to 99 skips some at full speed),
  so a change of 1 is a single swap at the end of that time, not a visible roll. Cheap styles (line, duo …) draw every
  frame; rich styles draw a handful of frames ahead in the render worker, and with no worker only the final drawing,
  cross-faded.
- One change from JS: `el.animateTo({ count: 7 }, { ms: 900 })`.
- **React: never change the `key` of a `LiveIcon` (or of its parent) to replay an animation.** A new key remounts the
  component, so the new value appears at once instead of animating from the old one. Keep the element mounted and change
  the prop; to replay a motion, toggle a class on a wrapper instead.
- `today` fills date and time params from the viewer's clock (`<with-live-icon today>` redraws each minute;
  `LiveIcon` reads the clock when it renders).

## Live icons with `@withicons/motion`

A live icon's svg is a plain inline svg with the same part tags as the regular icons (`wm-a` moving part, `wm-s` badge),
so a `.wm` wrapper with the base icon's tuned motion animates it part by part. Checked: `data-wm="bell"` on a wrapper
around `bell-count` swings the bell, its clapper a beat behind, and the badge swings with it.

Recipe: a bell that rings once and rolls its count when a notification arrives (React):

```jsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons/bell.css'          // or icons.css (all tuned icons)
import { LiveIcon } from '@withicons/dynamic/react'
import { useEffect, useRef } from 'react'

function Alerts({ unread }) {
  const ring = useRef(null)
  useEffect(() => {                                   // replay the ring on each new count, without remounting
    const el = ring.current
    if (!el || !unread) return
    el.classList.remove('wm-once'); void el.offsetWidth; el.classList.add('wm-once')
  }, [unread])
  return (
    <button type="button" aria-label={`${unread} unread notifications`}>
      <span ref={ring} className="wm" data-wm="bell">
        <LiveIcon name="bell-count" count={unread} animate label="" size={24} />
      </span>
    </button>
  )
}
```

`label=""` keeps the icon decorative because the button carries the name. Plain HTML: the same wrapper around
`<with-live-icon>` moves only the element's box (its svg is in a shadow root), so for part motion render the svg inline
(`render()`) or accept a whole-icon ring.

## All live icons

<!-- live:start -->
50 live icons. Params are kebab-case attributes on `<with-live-icon>` (as listed) and camelCase props on `LiveIcon` / keys for `render()`; the default is in brackets.

| name | what it shows | params |
|---|---|---|
| `alarm-clock-time` | A twin-bell alarm clock whose hands show the wake-up time you choose, optionally ringing. | `time` "HH:MM" ("07:00"): Alarm time (HH:MM)<br>`ringing` true / false (false): Ringing |
| `app-badge` | An app tile with a home-screen notification badge: a number, "99+", a dot, or a plain tile at zero. | `count` 0 to 9999 (4): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner |
| `avatar-initials` | A profile avatar showing one or two initials, round or squircle, with an optional online or offline dot. | `initials` text, up to 2, uppercased ("JD"): Initials<br>`shape` circle / square ("circle"): Shape<br>`status` none / online / offline ("none"): Status dot |
| `badge-text` | A pill badge with a short word such as NEW, PRO, BETA or HOT. | `text` text, up to 4, uppercased ("NEW"): Text<br>`shape` pill / rounded ("pill"): Shape |
| `bar-values` | A small bar chart with three to five bars whose heights you choose. | `bars` 3 to 5 (4): Number of bars<br>`bar1` 0 to 1 (or "80%") (0.45): Bar 1 height<br>`bar2` 0 to 1 (or "80%") (0.75): Bar 2 height<br>`bar3` 0 to 1 (or "80%") (0.55): Bar 3 height<br>`bar4` 0 to 1 (or "80%") (1): Bar 4 height<br>`bar5` 0 to 1 (or "80%") (0.7): Bar 5 height<br>`baseline` true / false (true): Show the baseline |
| `battery-charging-level` | A charging battery with a lightning bolt at its terminal end and a fill showing the current level. | `level` 0 to 1 (or "80%") (0.55): Charge |
| `battery-level` | A battery filled to the charge level you choose; at low charge the fill gives way to a warning mark. | `level` 0 to 1 (or "80%") (0.7): Charge<br>`warn-at` 0 to 50 (15): Show a warning at or below (%): 0 turns it off |
| `battery-percent` | A battery with its charge written inside as a number, with the % sign whenever it fits. | `level` 0 to 1 (or "80%") (0.8): Charge (0-1, or "80%"), written as a percentage<br>`percent` true / false (true): Add the % sign when it fits |
| `battery-vertical` | An upright battery that fills from the bottom to the charge you choose, with a warning mark when low. | `level` 0 to 1 (or "80%") (0.6): Charge<br>`warn-at` 0 to 50 (15): Show a warning at or below (%): 0 turns it off |
| `bell-count` | A notification bell with an unread count badge: a number, "99+", a dot, or nothing at zero. | `count` 0 to 9999 (3): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner |
| `calendar-date` | A calendar tile showing a month and a day of the month you choose, for due dates, events and today. | `day` 1 to 31 (17): Day of the month<br>`month` JAN / FEB / MAR / APR / MAY / JUN / JUL / AUG / SEP / OCT / NOV / DEC ("MAR"): Month<br>`rings` true / false (true): Binder rings |
| `calendar-event` | A calendar day with an event under it: a dot, several dots, an event bar or a short label like DUE. | `day` 1 to 31 (17): Day of the month<br>`marker` dot / dots / bar / label ("dot"): Event marker<br>`param-label` text, up to 3, uppercased ("DUE"): Label, up to 3 characters (when the marker is a label)<br>`rings` true / false (true): Binder rings |
| `calendar-month` | A month calendar: the month name over a small grid of days, with one day marked if you like. | `month` JAN / FEB / MAR / APR / MAY / JUN / JUL / AUG / SEP / OCT / NOV / DEC ("MAR"): Month<br>`marked` 0 to 6 (5): Highlighted dot in the grid (1-6, 0 = none)<br>`rings` true / false (true): Binder rings |
| `calendar-range` | A date range on a calendar tile: the first and last day on a little timeline, for trips, stays and sprints. | `from` 1 to 31 (12): First day<br>`to` 1 to 31 (18): Last day<br>`rings` true / false (true): Binder rings |
| `calendar-tear` | A tear-off desk calendar page with the day you choose and a torn bottom edge. | `day` 1 to 31 (17): Day of the month<br>`torn` true / false (true): Torn bottom edge |
| `calendar-weekday` | A calendar tile showing the day of the week and the day of the month, like a phone calendar app. | `day` 1 to 31 (17): Day of the month<br>`weekday` MON / TUE / WED / THU / FRI / SAT / SUN ("TUE"): Day of the week<br>`rings` true / false (true): Binder rings |
| `cart-count` | A shopping cart with the number of items in it: a number, "99+", a dot, or an empty cart at zero. | `count` 0 to 9999 (2): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner |
| `cellular-tech` | The mobile network type you choose, such as 5G, LTE or 4G+, set in a rounded chip. | `tech` text, up to 4, uppercased ("5G"): Network (up to 4 characters)<br>`chip` true / false (true): Set it in a chip |
| `chat-count` | A chat bubble with an unread-message count badge: a number, "99+", a dot, or nothing at zero. | `count` 0 to 9999 (7): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner<br>`bubble` round / square ("round"): Bubble shape |
| `clock-time` | An analogue clock whose hands show the exact time you choose; the hour hand moves with the minutes. | `time` "HH:MM" ("10:10"): Time (HH:MM)<br>`shape` round / square ("round"): Clock shape |
| `dice` | A die showing the face you choose, one to six pips, flat or tossed at an angle. | `value` 1 to 6 (5): Face (1-6)<br>`tilt` true / false (false): Tossed at an angle |
| `digital-clock` | A digital clock with the hours stacked over the minutes, in 24- or 12-hour format, framed or bare. | `time` "HH:MM" ("09:41"): Time (HH:MM)<br>`format` 24h / 12h ("24h"): Hour format<br>`frame` true / false (true): Show the display frame |
| `file-type` | A document labelled with its file type, such as PDF, DOC, CSV or ZIP. | `type` text, up to 4, uppercased ("PDF"): File type |
| `folder-label` | A folder with a short label on its front, such as a year, a letter range or a project code. | `text` text, up to 4, uppercased ("DOCS"): Label |
| `gauge-value` | A dial whose needle points at the value you set, with the reading written under the hub. | `value` 0 to 999 (72): Value<br>`max` 1 to 999 (100): Scale maximum<br>`reading` true / false (true): Show the value |
| `humidity` | Relative humidity as a water drop with the percentage inside, or a drop filled to that level. | `humidity` 0 to 100 (64): Humidity (%)<br>`display` number / level ("number"): Show as |
| `inbox-count` | An inbox tray with the number of new items: a number, "99+", a dot, or an empty tray at zero. | `count` 0 to 9999 (8): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner |
| `keycap` | A keyboard key showing a letter, a key name such as ESC, or a modifier symbol such as command or shift. | `param-label` text, up to 4, uppercased ("A"): Key label<br>`symbol` none / command / shift / option / enter / backspace / tab / up / down / left / right / space ("none"): Symbol (replaces the label) |
| `mail-count` | An envelope with an unread-mail count badge: a number, "99+", a dot, or nothing at zero. | `count` 0 to 9999 (5): Count (0 hides the badge)<br>`dot-only` true / false (false): Dot only (no number)<br>`limit` 99+ / 9+ ("99+"): Biggest number shown<br>`corner` top-right / bottom-right ("top-right"): Badge corner |
| `map-pin-number` | A map pin with a number or letter in its head, for numbered stops, results and places. | `param-label` text, up to 2, uppercased ("3"): Number or letter |
| `percent-badge` | A pill-shaped badge with the percentage you choose, for discounts, changes and scores. | `value` 0 to 100 (20): Percent<br>`sign` none / minus / plus ("none"): Sign |
| `price-tag` | A shop price tag with a currency sign and an amount you choose. | `amount` 0 to 999 (9): Amount<br>`currency` usd / eur / gbp / inr / none ("usd"): Currency sign |
| `progress-ring` | A circular progress indicator: the ring fills clockwise to the percentage written inside it. | `value` 0 to 100 (68): Progress (%)<br>`number` true / false (true): Show the number<br>`track` true / false (true): Show the remaining track |
| `rating-stars` | A rating out of five: five stars in a compact two-row layout (half stars included), or one star over the score. | `rating` 0 to 5, step 0.5 (3.5): Rating (out of 5)<br>`layout` stars / score ("stars"): Layout<br>`empty` dots / small stars / hidden ("dots"): Stars not earned |
| `ribbon-label` | A hanging ribbon banner with a notched tail and a short word such as BEST, TOP, #1 or NEW. | `text` text, up to 4, uppercased ("BEST"): Text |
| `sale-sticker` | A starburst sale sticker with a discount or word such as -50%, SALE or HOT. | `text` text, up to 4, uppercased ("-50%"): Text<br>`points` 8 to 20 (14): Number of points |
| `signal-bars` | Four rising signal bars with as many lit as you choose; the rest stay as dotted ghosts. | `bars` 0 to 4 (3): Bars lit<br>`ghost` true / false (true): Show unlit bars as dots<br>`no-signal` true / false (true): Cross at zero bars |
| `speech-bubble-text` | A chat bubble with a short word, reaction or symbol inside: HI, OK, LOL, ?, ! or a typing "...". | `text` text, up to 3, uppercased ("HI"): Text (up to 3 characters)<br>`tail` left / right ("left"): Tail side |
| `step-number` | A step marker with the number you choose, or a check mark when the step is complete. | `step` 0 to 99 (1): Step number<br>`done` true / false (false): Completed (show a check)<br>`shape` circle / square ("circle"): Shape |
| `stopwatch` | A stopwatch whose sweep hand has swept out the seconds you choose, from 0 to a full minute. | `seconds` 0 to 60 (15): Elapsed seconds (of a minute) |
| `tag-label` | A hanging label tag with a short word such as SALE, NEW, VIP or GIFT. | `text` text, up to 4, uppercased ("SALE"): Text |
| `thermometer-level` | A thermometer filled to the level you choose, with an optional reading such as 37° beside it. | `level` 0 to 1 (or "80%") (0.65): Level<br>`value` -99 to 199 (37): Reading<br>`unit` degree / celsius / fahrenheit / none ("degree"): Unit<br>`show-value` true / false (true): Show the reading<br>`scale` auto / manual ("auto"): Level: follow the reading (auto) or use Level (manual) |
| `ticket-number` | A ticket with a number on it, for queue numbers, raffles, seats, orders and support tickets. | `number` 0 to 999 (42): Number<br>`hash` true / false (false): Show # before the number |
| `timer-ring` | A countdown timer: the ring shows how much of the time is left and the number inside says how much. | `left` 0 to 99 (45): Time left (number shown)<br>`total` 1 to 99 (60): Out of (full ring)<br>`number` true / false (true): Show the number |
| `uv-index` | The UV index (0 to 11 and above) written inside a rayed sun. | `index` 0 to 20 (6): UV index |
| `volume-level` | A speaker with as many sound waves as you choose, from silent to loud, or muted. | `waves` 0 to 3 (2): Sound waves<br>`ghost` true / false (false): Show silent waves as dots<br>`muted` true / false (false): Muted (cross instead of waves) |
| `watch-time` | A wristwatch with a round or square case whose hands show the time you choose. | `time` "HH:MM" ("10:10"): Time (HH:MM)<br>`shape` round / square ("round"): Case shape |
| `weather` | The current weather: a condition (sun, cloud, rain, storm, snow, fog or night) with the temperature written under it. | `condition` sunny / partly / cloudy / rain / storm / snow / fog / night ("partly"): Condition<br>`temperature` -99 to 199 (21): Temperature<br>`unit` degree / celsius / fahrenheit / none ("degree"): Unit after the number<br>`show-temperature` true / false (true): Show the temperature |
| `wifi-strength` | The Wi-Fi fan with as many arcs lit as you choose; the rest stay as dotted ghosts. | `strength` 0 to 3 (2): Arcs lit<br>`ghost` true / false (true): Show unlit arcs as dots |
| `wind-speed` | Wind speed written under two curling gusts, with an optional unit such as KT or MPH. | `speed` 0 to 999 (12): Speed<br>`unit` none / kt / mph / kmh / ms / bft ("none"): Unit |
<!-- live:end -->
