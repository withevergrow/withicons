# with icons: animation (`@withicons/motion`)

Animations are optional and ship separately, so icons never pay for them. They animate the element that holds the
icon (an inline `<svg>`, a component, `<with-icon>`, `<i class="with ...">` or any wrapper), so every style and every
package works. Pure CSS; the small JS API is only needed for `inview`, programmatic control and building swaps.

## Install

```bash
npm i @withicons/motion
```

```js
import '@withicons/motion/motion.css'   // the presets
import '@withicons/motion/icons.css'    // each icon's tuned motion, all 500 (~18 KB gzipped; keyed by data-wm)
```

From a CDN, load the presets and only the icons you animate (each icon's file is ~0.3 KB gzipped):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">
```

With `<with-icon motion="loop">` (`<script type="module" src=".../motion@latest/dist/element.js">` after `@withicons/web`'s
`dist/cdn.js`) the element links each animated icon's file by itself. In an unbundled `<script type="module">`, import
`@withicons/motion/runtime` (`dist/runtime.js`) for `motion()` / `swap()`, not `dist/index.js` (it pulls the full spec table).

## Classes

| class / attribute | effect |
|---|---|
| `wm` | base class on the wrapper |
| `data-wm="<icon>"` | use that icon's tuned motion (from `icons/<icon>.css` or `icons.css`) |
| `wm-loop` | continuous animation, calm enough to run forever |
| `wm-hover` | one-shot on hover / focus of the wrapper or of any `.wm-trigger` ancestor (e.g. the button) |
| `wm-once` | plays once on load |
| `wm-inview` | plays when scrolled into view (needs the JS runtime) |
| `wm-paused` | pause |
| `wm-p-<preset>` | choose the preset explicitly (overrides the icon default) |
| `--wm-dur`, `--wm-k` | CSS variables: seconds per cycle, intensity (0.25-2) |
| `wm-swap wm-fx-<effect>` + children `wm-a` / `wm-b` | icon A turns into icon B on `.wm-trigger:hover`, focus, `.is-on` or `aria-pressed="true"` |
| `wm-force` | keep animating under `prefers-reduced-motion` (avoid) |

Presets: spin, spin-once, tick, pulse, beat, breathe, float, bounce, sway, ring, wiggle, shake, nod, nudge, pass, rise,
drop, blink, flicker, twinkle, pop, tada, jelly, flip, rock, tilt, zoom, orbit, glow, draw (stroked styles), type, fill.
Swap effects: fade, scale, rotate, flip, slide-up, slide-down, slide-left, slide-right, blur, spin, morph, draw.

## Examples

```html
<span class="wm wm-loop" data-wm="loader"><svg>…</svg></span>
<button class="wm-trigger" aria-label="Notifications"><span class="wm wm-hover" data-wm="bell"><svg>…</svg></span></button>
<span class="wm-swap wm-fx-morph is-on"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>
```

```js
import { motion, swap, motionFor } from '@withicons/motion'
motion(el, 'bell', { trigger: 'hover' })               // { play(), pause(), destroy() }
swap(el, { from: playSvg, to: pauseSvg, effect: 'morph', trigger: 'click' })   // { toggle(on?), destroy() }
```

Agents: `animate_icon({ name, trigger, preset?, to?, effect?, style?, format })` (MCP), `npx withicons animate <name>`,
or `GET https://withicons.com/api/motion/<name>?trigger=hover&format=react`.

As files (slides, documents, email, social): `npx withicons export <name> --format gif|apng|animated-svg|pptx-animated|lottie`
with `--motion loop|hover|once|swap|<preset>` (MCP: `export_icon`). Frames come from these same keyframes, so a GIF moves
exactly like the icon on the page. GIF: pass the slide colour as `--background`. See SKILL.md section 7a.

## Guidelines

- Motion should explain state or invite action: loading (spin/tick), new notification (ring), like (beat/pop),
  play/pause or menu/close (swap). Keep continuous loops to one or two icons per screen.
- Hover effects belong on interactive elements; put `.wm-trigger` on the button so the whole target plays the icon.
- `prefers-reduced-motion: reduce` disables every animation unless `wm-force` is set. Don't set it.
- The accessible name stays on the control; an animated icon is still decorative.

## Icons with a tuned animation

<!-- motion:start -->
500 icons have a tuned animation (any icon can use any preset).

| icon | loop | hover | swaps to | what it says |
|---|---|---|---|---|
| `accessibility` | pulse | pop | `user`, `accessibility@solid` | the figure opens its arms in a calm welcome inside a steady ring |
| `activity` | draw | beat | `heart-pulse` | traces its pulse like a live monitor; thumps like a heartbeat |
| `address-book` | float | nod | `user`, `phone` | book rests while the contact on its cover nods hello |
| `alarm-clock` | ring | ring | `bell-ring`, `check`, `clock`, `timer` | rattles on its feet like an alarm going off, bells a beat behind |
| `alert-circle` | pulse | pop | `check-circle`, `info-circle`, `alert-circle@solid` | pulses for attention, the mark echoing it; pops up on hover |
| `alert-triangle` | glow | glow | `check-circle`, `alert-triangle@solid` | glows like a warning light, the mark flickering inside |
| `align-center` | pulse | jelly | `align-left`, `align-right`, `align-justify` | its lines gather gently toward the middle |
| `align-justify` | jelly | jelly | `align-left`, `align-center`, `align-right` | its even lines stretch edge to edge |
| `align-left` | nudge | nudge | `align-center`, `align-right`, `align-justify` | its lines slide over to the left edge |
| `align-right` | nudge | nudge | `align-center`, `align-left`, `align-justify` | its lines slide over to the right edge |
| `ambulance` | nudge | pass | `siren`, `truck`, `ambulance@solid` | idles forward, then races off and comes back on hover |
| `anchor` | rock | rock |  | hangs from its ring and rocks gently like a moored ship |
| `angry` | pulse | shake | `meh`, `smile`, `angry@solid` | swells red as it fumes, then shakes with rage on hover |
| `app-window` | pulse | pop | `maximize`, `monitor`, `layout-template` | the window rests while its title-bar dots pulse; pops open on hover |
| `apple` | sway | wiggle |  | hangs from its stem and sways, the leaf fluttering behind |
| `archive` | float | bounce | `package`, `inbox` | rests in storage, drops onto the shelf with a soft bounce |
| `arrow-down-left` | nudge | nudge | `arrow-up-right`, `arrow-down-right` | reaches down and left, its head leading the way |
| `arrow-down-right` | nudge | pass | `arrow-up-left` | pushes down and right to show where it points |
| `arrow-down` | nudge | pass | `arrow-up` | pushes down to show where it points |
| `arrow-left-right` | pulse | pulse | `arrow-up-down`, `swap` | stretches out both ways at once |
| `arrow-left` | nudge | pass | `arrow-right` | pushes left to show where it points |
| `arrow-right` | nudge | nudge | `arrow-left`, `check` | reaches right, its head leading the way it points |
| `arrow-up-down` | pulse | pulse | `arrow-left-right`, `sort` | stretches up and down at once |
| `arrow-up-left` | nudge | nudge | `arrow-down-right` | reaches up and left, its head leading the way |
| `arrow-up-right` | nudge | nudge | `arrow-down-right` | reaches up and right, like a link heading out |
| `arrow-up` | nudge | nudge | `arrow-down` | reaches up, its head leading the way it points |
| `at-sign` | pulse | spin-once | `mail`, `hash` | pings softly, swirls round once when you mention someone |
| `atom` | spin | spin-once |  | electron orbits turn slowly while the nucleus pulses |
| `audio-lines` | jelly | jelly | `microphone`, `microphone-off` | sound bars bounce like a voice is speaking |
| `award` | glow | pop | `award@solid`, `badge-check` | medal shines while its ribbon flutters; pops proudly on hover |
| `backpack` | sway | sway |  | hangs from its top handle and swings, pocket a beat behind |
| `badge-check` | rock | pop | `badge-check@solid` | the seal sways gently while its check stays proud |
| `badge-percent` | rock | spin-once | `percent`, `badge-check`, `badge-percent@solid` | the sale badge rocks gently while its percent pulses; turns on hover |
| `balloon` | float | rise | `balloon@solid`, `party-popper` | bobs gently in the air, then floats up and away on hover |
| `ban` | pulse | shake | `check-circle` | a steady stop sign that pulses calmly, shakes no on hover |
| `bandage` | breathe | jelly | `bandage@solid`, `heart` | breathes gently like a wound healing, squishes down as if stuck on |
| `banknote` | float | flip | `coins`, `wallet`, `credit-card` | drifts like a fresh note in your hand; flips over on hover |
| `barcode` | fill | zoom | `qr-code`, `check` | the bars dim and light like a scanner reading the code |
| `basketball` | bounce | spin-once | `basketball@solid`, `trophy` | dribbles up and down, spins on a finger when touched |
| `bath` | breathe | jelly | `droplet`, `bath@solid`, `toilet` | settles like warm water in the tub, splashing when you hover |
| `battery-charging` | pulse | glow | `battery`, `zap`, `plug` | the bolt flickers with current while the cell charges |
| `battery-low` | pulse | flicker | `battery-charging`, `battery`, `plug` | the last bar blinks to warn that power is running low |
| `battery` | pulse | fill | `battery-charging`, `zap`, `plug` | the cells refill with charge inside a steady case |
| `bed` | pulse | float | `moon`, `sofa`, `bed@solid` | breathes slowly like someone sound asleep, the pillow rising |
| `beer` | rock | rock |  | rocks gently with the foam sloshing a beat behind, swings up for cheers |
| `bell-off` | pulse | shake | `bell`, `bell-ring` | rests muted, the silent clapper drifts; shakes no if you ring |
| `bell-ring` | ring | ring | `bell-off`, `bell` | swings from its hook, clapper lagging, ring marks buzzing |
| `bell` | ring | ring | `bell-off`, `bell-ring`, `bell@solid` | swings from its hook while the clapper rings a beat behind |
| `bike` | float | pass | `bike@solid`, `motorcycle`, `car` | rolls over the road with a light bump, rides off and back on hover |
| `binoculars` | sway | zoom | `eye`, `search` | scans the horizon side to side, then zooms in on what it found |
| `bird` | bounce | bounce | `bird@solid`, `egg` | hops lightly in place like a little songbird |
| `bluetooth` | pulse | glow | `wifi`, `link`, `bluetooth@solid` | pulses softly like it is searching for a device to pair |
| `bold` | pulse | pop | `bold@solid`, `italic`, `underline` | swells with weight like text turning bold |
| `book-open` | float | flip | `book`, `bookmark`, `book-open@solid` | rests open and lifts gently, turns a page when touched |
| `book` | sway | tilt | `book-open`, `bookmark` | leans gently on the shelf, tips toward you when picked |
| `bookmark-plus` | pulse | pop | `bookmark-plus@solid`, `bookmark`, `check` | the ribbon rests while its plus swells, then pops on save |
| `bookmark` | sway | pop | `bookmark@solid` | the ribbon sways from the page top, pops when you save it |
| `bot` | float | float | `brain`, `user` | hovers like a friendly robot, antenna and eyes bobbing a beat behind |
| `braces` | pulse | jelly | `code`, `terminal` | swells softly like a code block wrapping its content |
| `brain` | pulse | glow | `bot`, `lightbulb`, `sparkles` | swells calmly while its folds spark like thoughts firing |
| `briefcase-medical` | sway | sway | `briefcase`, `briefcase-medical@solid` | swings from its handle like a kit being carried to help |
| `briefcase` | rock | ring | `briefcase@solid` | swings from its handle like a bag being carried |
| `bug` | wiggle | wiggle | `check-circle`, `check` | twitches like a little beetle, antennae a beat behind |
| `building` | pulse | glow | `home`, `store`, `landmark` | stands steady while its windows light up for the evening |
| `burger` | jelly | jelly | `burger@solid`, `pizza` | the stacked burger squishes softly, the patty a beat behind, like a bite |
| `bus` | float | zoom | `train`, `car`, `bus@solid` | idles at the stop with a soft engine hum, pulls up close on hover |
| `butterfly` | float | flip | `flower`, `butterfly@solid`, `sprout` | drifts on a breeze and flaps its wings when you come near |
| `cake` | pulse | glow |  | the candle flickers on a steady cake, glowing for a wish |
| `calculator` | pulse | type | `percent`, `receipt` | the keys tap away inside a steady case, adding up a total |
| `calendar-check` | pulse | pop | `calendar`, `calendar-check@solid` | the check stamps onto the page, confirming the date |
| `calendar-days` | pulse | pop | `calendar`, `calendar-check`, `calendar-plus` | the day dots swell softly, a calm month at a glance |
| `calendar-plus` | pulse | pop | `calendar-check`, `calendar`, `calendar-plus@solid` | the plus pops onto the page like a new event being added |
| `calendar` | pulse | nod | `calendar-check`, `calendar-plus`, `calendar-days` | hangs on the wall, binder rings bobbing; nods to a new date on hover |
| `camera-off` | pulse | pop | `camera`, `eye-off`, `video-off` | the lens tries to blink but stays shut: no photos here |
| `camera` | pulse | pop | `image`, `video-camera`, `check`, `camera@solid` | the lens focuses in and out, the shutter snaps on hover |
| `captions` | pulse | pop | `captions@solid`, `type` | subtitle lines fade in one after another like live captions |
| `car` | float | pass | `truck` | idles with a soft engine rumble and drives off on hover |
| `cast` | pulse | pulse | `tv`, `monitor`, `cast@solid` | the screen holds still while signal waves ripple out from its corner |
| `cat` | pulse | nod | `dog`, `cat@solid`, `paw-print` | breathes calmly and gives you a slow, friendly cat blink |
| `chart-area` | fill | fill | `chart-line`, `chart-bar` | area fills in like volume adding up, axes stay put |
| `chart-bar` | jelly | pop | `chart-line`, `chart-pie` | bars stretch up from a steady baseline like live data updating |
| `chart-line` | draw | nudge | `chart-area`, `trending-up`, `chart-bar` | draws its trend line like new data arriving; ticks up on hover |
| `chart-pie` | pulse | pop | `chart-bar`, `chart-pie@solid` | one slice slides out from the pie, then settles back in |
| `check-check` | draw | draw | `check`, `check-check@solid` | one tick, then the second follows, like a message just read |
| `check-circle` | pulse | draw | `check-circle@solid`, `x-circle`, `circle` | the tick writes itself inside a calm ring; draws on hover |
| `check-square` | pulse | draw | `square`, `check-square@solid` | the box rests while its tick snaps in, like a checkbox just checked |
| `check` | draw | nod | `check-circle`, `close` | draws itself in like a tick being written, nods yes on hover |
| `chef-hat` | pulse | jelly | `chef-hat@solid`, `cooking-pot`, `utensils` | the puffy toque rises like dough on a steady band |
| `chevron-down` | nudge | nudge | `chevron-up` | dips down to hint that more opens below |
| `chevron-first` | nudge | nudge | `chevron-last`, `chevron-left`, `skip-back` | chevron runs back and bumps the wall at page one |
| `chevron-last` | nudge | nudge | `chevron-first`, `chevron-right`, `skip-forward` | chevron runs ahead and bumps the wall at the last page |
| `chevron-left` | nudge | nudge | `chevron-right` | steps left to say go back |
| `chevron-right` | nudge | nudge | `chevron-left`, `chevron-down` | steps right to say go forward |
| `chevron-up` | nudge | nudge | `chevron-down` | lifts up to hint that the section collapses |
| `chevrons-down` | nudge | nudge | `chevrons-up`, `chevron-down`, `chevrons-up-down` | steps down for more below, the lower chevron leading |
| `chevrons-left` | nudge | nudge | `chevrons-right`, `chevron-left`, `chevron-first` | jumps back, the lead chevron leaping and the rear one following |
| `chevrons-right` | nudge | nudge | `chevrons-left`, `chevron-right`, `chevron-last` | skips ahead, the front chevron leaping and the back one following |
| `chevrons-up-down` | zoom | pop | `chevron-down`, `sort` | opens and settles, hinting at a list of choices |
| `chevrons-up` | nudge | nudge | `chevrons-down`, `chevron-up`, `chevrons-up-down` | climbs to the top, the upper chevron leaping ahead of the lower |
| `circle-arrow-down` | pulse | pop | `circle-arrow-up`, `circle-arrow-down@solid`, `check` | the arrow dips inside its button, like scroll down or save |
| `circle-arrow-left` | pulse | pop | `circle-arrow-right`, `circle-arrow-left@solid`, `arrow-left` | the arrow steps left inside its button, inviting a tap |
| `circle-arrow-right` | pulse | pop | `circle-arrow-left`, `circle-arrow-right@solid`, `check` | the arrow leads inside its button, saying next, go on |
| `circle-arrow-up` | pulse | pop | `circle-arrow-down`, `circle-arrow-up@solid`, `arrow-up` | the arrow lifts inside its button, like back to top or level up |
| `circle-chevron-down` | pulse | pop | `circle-chevron-right`, `circle-chevron-down@solid`, `chevron-down` | chevron dips inside its ring to hint there is more below |
| `circle-chevron-right` | pulse | pop | `circle-chevron-down`, `circle-chevron-right@solid`, `chevron-right` | chevron steps right inside its ring to invite you onward |
| `circle-dot` | pulse | pop | `circle`, `circle-dot@solid` | the centre dot pulses inside a calm ring, like a selected option |
| `circle-pause` | pulse | pop | `circle-play`, `circle-stop`, `circle-pause@solid` | breathes slowly while playback is on hold |
| `circle-play` | pulse | pop | `circle-pause`, `circle-stop`, `circle-play@solid` | the triangle leans forward inside its ring, inviting a start |
| `circle-stop` | pulse | jelly | `circle-play`, `circle-pause`, `circle-stop@solid` | the square breathes inside its ring, ready to stop |
| `circle` | breathe | jelly | `circle@solid`, `check-circle`, `x-circle` | breathes softly like a live status dot, squishes when pressed |
| `clapperboard` | pop | pop | `film`, `play`, `video-camera` | the clapper stick snaps down on its hinge: action! |
| `clipboard-check` | float | draw | `clipboard-list`, `clipboard`, `clipboard-check@solid` | the check pops on the board now and then, writes itself on hover |
| `clipboard-list` | type | type | `clipboard-check`, `list-checks` | the list jitters like items being ticked off, nods when done |
| `clipboard` | float | nod | `check`, `paste` | the board floats, its clip clamps down a beat later |
| `clock` | pulse | spin-once | `alarm-clock`, `timer`, `history` | the hands tick round a steady face in even steps, like passing time |
| `close` | breathe | spin-once | `menu`, `plus`, `check` | rests calmly, then twists shut on hover to say this will close |
| `cloud-download` | float | nudge | `check`, `loader`, `cloud-upload` | the cloud drifts while the arrow keeps pulling data down |
| `cloud-lightning` | float | shake | `cloud-rain`, `cloud` | storm cloud hangs heavy while the bolt flashes; it strikes on touch |
| `cloud-off` | float | shake | `cloud`, `wifi-off`, `cloud-upload` | drifts quietly, waiting for the connection to come back |
| `cloud-rain` | float | shake | `cloud-snow`, `cloud-lightning`, `cloud` | cloud drifts while rain keeps falling; a shake lets a shower go |
| `cloud-snow` | float | shake | `cloud-rain`, `snowflake`, `cloud` | cloud hangs softly while snow drifts slowly down |
| `cloud-sun` | float | nudge | `sun`, `cloud` | cloud drifts while the sun warms behind it, peeks out on touch |
| `cloud-upload` | float | nudge | `check`, `loader`, `cloud-download` | the cloud drifts while the arrow keeps lifting data up |
| `cloud` | float | jelly | `cloud-sun`, `cloud-rain`, `cloud@solid` | drifts calmly across the sky, squishes softly when touched |
| `code` | type | jelly | `braces`, `terminal`, `file-code` | brackets tick like typing while the slash blinks like a cursor |
| `coffee` | breathe | tilt |  | swells softly like a fresh hot cup, then tips up for a sip |
| `coins` | pulse | nod | `banknote`, `wallet`, `dollar-sign` | the top coin hops on the stack, like coins being counted |
| `columns` | pulse | jelly | `sidebar`, `layout-grid`, `kanban` | the divider slides like a pane being resized |
| `compass` | pulse | pop | `navigation`, `map` | the needle swings and settles on north inside a steady case |
| `cookie` | rock | spin-once |  | rolls slowly back and forth like a cookie on the counter |
| `cooking-pot` | pulse | bounce | `cooking-pot@solid`, `soup`, `chef-hat` | the pot simmers while its lid lifts on the steam |
| `copy` | nudge | nudge | `check`, `paste` | the two sheets spread apart as a copy is made, then settle |
| `corner-down-left` | nudge | nudge | `check`, `corner-down-right` | presses left like the Enter key, the head leading |
| `corner-down-right` | nudge | nudge | `reply`, `corner-down-left` | tucks right under its thread, the head leading like a reply |
| `cpu` | pulse | glow | `server`, `cpu@solid` | the core glows with work while the chip hums |
| `credit-card` | float | flip | `check`, `wallet`, `credit-card@solid` | hovers like a card held to a reader; flips over on hover |
| `crop` | zoom | pop | `maximize`, `image` | the frame tightens around the picture like a crop being set |
| `crosshair` | pulse | zoom | `target`, `map-pin` | the sight holds steady while the centre dot pulses, locked on |
| `crown` | float | tada | `crown@solid` | floats proudly among sparkles, then celebrates a win |
| `cup-soda` | pulse | pop |  | a cold drink: the straw bobs as if someone is sipping |
| `cursor` | tilt | nudge | `mouse` | leans on its tip, then pokes forward like a click |
| `database` | jelly | jelly | `server` | stack squashes on its base, the middle band lagging like data settling |
| `disc` | spin | spin-once | `music-note`, `play`, `disc@solid` | spins on its centre like a record playing, the glint sweeping round |
| `dna` | flip | flip |  | the double helix twists slowly around its axis |
| `dog` | tilt | nod | `cat`, `dog@solid`, `paw-print` | tilts its head to listen, eyes and nose scrunching in a happy blink |
| `dollar-sign` | glow | flip | `coins`, `percent`, `banknote` | shines quietly like money coming in; flips like a coin on hover |
| `donut` | pulse | pop |  | the soft donut swells gently while its sprinkles glint |
| `door-open` | nudge | nudge | `log-in`, `home`, `key` | beckons you through while its handle gives a little turn |
| `download` | nudge | nudge | `check`, `loader`, `upload` | the arrow drops into the tray, which dips as the file lands |
| `drag-handle` | float | nudge | `move`, `menu` | lifts gently off the surface, ready to be dragged |
| `droplet` | drop | jelly | `droplet@solid` | drips like water from a tap, splashes when touched |
| `dumbbell` | float | nod | `dumbbell@solid`, `heart-pulse` | lifts up and down like steady reps, does a quick rep on hover |
| `edit` | sway | wiggle | `check`, `save` | the pencil sways on its tip over a calm page, ready to write |
| `egg` | wiggle | wiggle | `egg@solid` | twitches on its base now and then, as if about to hatch |
| `eraser` | sway | wiggle | `pencil` | rocks on its rubbing edge to wipe the line clean |
| `euro` | flip | flip | `dollar-sign`, `pound-sterling`, `indian-rupee`, `coins` | flips like a euro coin now and then |
| `external-link` | pulse | nudge | `link` | arrow slips out of the box to open somewhere else |
| `eye-off` | pulse | shake | `eye` | rests shut while the slash taps down, keeping things hidden |
| `eye` | blink | blink | `eye-off`, `eye@solid` | blinks now and then like it is watching |
| `factory` | pulse | jelly | `warehouse`, `building`, `factory@solid` | hums on its foundations while the window lights flicker at work |
| `fast-forward` | nudge | nudge | `rewind`, `skip-forward` | the front arrow leads and the back one chases, like scrubbing ahead |
| `file-archive` | breathe | jelly | `file`, `archive` | a zipped page that squeezes snug, wobbles when tapped |
| `file-audio` | sway | beat | `music-note`, `file` | the page sways while its note bops along to the music |
| `file-check` | pulse | pop | `file`, `file-check@solid` | the page rests while its checkmark pops to confirm |
| `file-code` | pulse | wiggle | `code`, `file` | the page rests while its brackets wiggle like code being edited |
| `file-down` | float | nudge | `file-check`, `file-up`, `download` | the page holds steady while its arrow dips, landing on your device |
| `file-image` | pulse | zoom | `image`, `file` | the page rests while its picture slowly zooms like a slideshow |
| `file-lock` | float | shake | `file`, `lock`, `unlock` | rests sealed and safe, the padlock jiggles when you try to open it |
| `file-minus` | float | jelly | `file-plus`, `file` | rests calmly, squishes as a file is taken out of the set |
| `file-pdf` | float | nudge | `download`, `file` | floats like a ready-to-print page, dips down when you grab it |
| `file-plus` | pop | pop | `file-check`, `file` | pops gently now and then, offering a new file |
| `file-search` | orbit | tilt | `search`, `file-check` | drifts in a small circle like a lens scanning the page; leans in on hover |
| `file-spreadsheet` | pulse | fill | `file`, `download` | the page rests while its grid fills in like data loading |
| `file-text` | pulse | draw | `file`, `file-check` | the page rests while its lines write themselves on |
| `file-up` | nudge | nudge | `file-check`, `file-down`, `upload` | the page lifts and settles, heading up to the cloud |
| `file-video` | pulse | pop | `play`, `file` | swells softly like a clip ready to play, pops when you point at it |
| `file-x` | float | shake | `file-check`, `file`, `file-x@solid` | rests quietly, shakes no when a file is rejected |
| `file` | float | pop | `file-plus`, `file-check`, `files` | floats like a loose page, the folded corner trailing a beat behind |
| `files` | float | nudge | `copy`, `file` | floats like a loose stack of papers, slides along when you point at it |
| `film` | type | pass | `video-camera`, `image` | the strip judders like film running through a projector gate |
| `filter` | sway | nod | `sort`, `filter@solid`, `sliders` | the funnel swirls gently as it sifts, then taps down |
| `fingerprint` | glow | draw | `unlock`, `shield-check` | glows like a sensor as its ridges light up for a reading |
| `fish` | sway | nudge | `fish@solid` | swishes its tail from the head and darts ahead when you hover |
| `flag` | sway | sway | `flag@solid` | the cloth ripples in the wind while the pole stands firm |
| `flame` | flicker | flicker | `flame@solid` | flickers from its base, the inner tongue dancing out of step |
| `flask-conical` | rock | wiggle | `flask-conical@solid` | rocks on its base while the liquid inside sloshes behind |
| `flower` | pulse | spin-once | `flower@solid`, `sprout` | the bloom swells softly, its heart pulsing a beat behind |
| `folder-minus` | pulse | jelly | `folder-plus`, `folder` | rests calmly, the minus pinches in as a folder is removed |
| `folder-open` | sway | sway | `folder` | the folder swings open on its hinge as you browse inside |
| `folder-plus` | pulse | pop | `folder`, `check` | the plus pops inside a calm folder, like a new one being made |
| `folder-search` | pulse | zoom | `folder-open`, `search`, `folder` | the lens sweeps side to side searching a still folder, peers closer on hover |
| `folder` | pulse | jelly | `folder-open`, `folder-plus`, `folder@solid` | swells softly on its base, squishes as if being stuffed on hover |
| `football` | spin | bounce | `football@solid`, `trophy` | rolls slowly like a ball in play, bounces when kicked |
| `forward` | nudge | nudge | `reply`, `send`, `check` | pushes ahead to the right, passing the message on |
| `frown` | pulse | nod | `smile`, `meh`, `frown@solid` | sighs slowly, features drooping; hangs its head on hover |
| `fuel` | pulse | pop | `battery-charging`, `droplet`, `fuel@solid` | the pump stands ready while its hose sways on the hook |
| `gallery-horizontal` | nudge | nudge | `images`, `layout-grid`, `image` | the slides glide left like a carousel moving to the next one |
| `gamepad` | rock | wiggle | `trophy`, `play`, `gamepad@solid` | tilts in your hands while the buttons get pressed |
| `gauge` | pulse | pop |  | needle swings to a new reading and settles while the dial holds still |
| `gem` | twinkle | flip | `gem@solid`, `crown` | glints softly like a cut stone, turns to flash its facets on hover |
| `gift` | rock | tada | `gift@solid`, `check-circle`, `package` | rocks with excitement on its base; jumps for joy on hover |
| `git-branch` | draw | draw | `git-merge`, `git-pull-request` | draws the branch forking off the main line |
| `git-commit` | pulse | pop | `check-circle`, `git-branch` | pulses like a new commit landing on the line |
| `git-merge` | draw | nudge | `git-pull-request`, `check-circle`, `git-branch` | draws two branches coming together into one |
| `git-pull-request` | draw | nudge | `git-merge`, `git-branch`, `check-circle` | draws changes being sent back toward the main line |
| `globe` | rock | pop | `language`, `map` | tilts gently on its axis like the world turning slowly |
| `graduation-cap` | float | tada | `graduation-cap@solid` | bobs proudly, then gets tossed in celebration |
| `hammer` | rock | ring | `wrench` | rocks on its grip, then taps a nail with a quick rebound |
| `hand-coins` | float | nudge | `coins`, `banknote`, `wallet`, `hand-heart` | the hand offers, the coin lifting a beat later; a payment on its way |
| `hand-heart` | pulse | pop | `hand-heart@solid`, `heart`, `hand-coins` | the heart beats softly above a steady, open hand |
| `handshake` | nod | nod | `handshake@solid`, `check`, `hand-heart` | the clasped hands pump up and down, sealing the deal |
| `hard-drive` | pulse | jelly | `save`, `database`, `server` | the read arm sweeps across the platter while data moves |
| `hash` | pop | pop | `at-sign`, `tag` | stamps itself down now and then like a fresh tag |
| `heading` | pulse | pop | `type`, `bold` | rises softly from its baseline like a title standing tall |
| `headphones` | beat | jelly | `music-note`, `volume-off`, `headset`, `headphones@solid` | bops to the beat on your head, wobbles when you point at it |
| `headset` | float | nod | `headphones`, `phone-call` | bobs gently while listening, nods when you ask for help |
| `heart-crack` | breathe | shake | `heart`, `heart-crack@solid` | a slow, heavy breath of heartbreak, then it shudders |
| `heart-pulse` | beat | beat | `heart`, `activity`, `heart-pulse@solid` | beats steadily with the heartbeat trace riding along |
| `heart` | beat | beat | `heart@solid`, `heart-pulse` | beats softly like a heart full of love |
| `help-circle` | tilt | wiggle | `info-circle`, `check-circle` | the question mark tilts its head curiously inside a calm circle |
| `hexagon` | pulse | pop | `hexagon@solid` | swells softly like a honeycomb cell, pops when picked |
| `highlighter` | sway | pop | `eraser`, `pencil`, `highlighter@solid` | the marker leans on its tip while the fresh ink glows on |
| `history` | rock | rock | `clock`, `undo`, `rotate-ccw` | winds back and forth, the hands sweeping wider behind it |
| `home` | pulse | pop | `home@solid` | swells warmly on its foundation, welcomes you with a hop |
| `hospital` | glow | pop | `hospital@solid`, `building` | stands still while its cross glows like a beacon of care |
| `hotel` | pulse | pop | `bed`, `building` | stands still while the guest inside breathes softly in their sleep |
| `hourglass` | rock | spin-once | `check`, `loader`, `timer` | rocks gently while the sand runs, turns over on hover |
| `ice-cream` | sway | sway |  | the scoop sways on its cone like a treat held in hand |
| `id-card` | float | flip | `user-check`, `shield-check` | floats like a card held up, flips over to show itself on hover |
| `image-plus` | float | pop | `image`, `check` | the plus badge pulses, inviting you to add a picture |
| `image` | float | zoom | `image-plus`, `film` | the scene drifts gently inside its frame, like a living photo |
| `images` | pulse | zoom | `image`, `gallery-horizontal`, `image-plus`, `images@solid` | the stack rests while the picture slowly zooms in like a slideshow |
| `inbox` | bounce | jelly | `mail`, `check` | the tray bumps softly as mail lands, squishes when you point at it |
| `indent-decrease` | nudge | nudge | `indent-increase`, `align-left` | the arrow pulls the lines back out one tab to the left |
| `indent-increase` | nudge | nudge | `indent-decrease`, `align-left` | the arrow pushes the lines one tab to the right |
| `indian-rupee` | flip | flip | `dollar-sign`, `euro`, `pound-sterling`, `coins` | flips like a rupee coin now and then, its bar a beat behind |
| `info-circle` | pulse | pop | `help-circle`, `x-circle` | the i nods softly inside a steady circle: here is a helpful note |
| `italic` | tilt | tilt | `bold`, `underline`, `type` | leans over like text turning italic, its serifs following |
| `kanban` | pulse | pop | `columns`, `layout-grid`, `table` | the board holds still while its card columns stretch and settle |
| `key` | sway | nudge | `unlock`, `lock` | dangles from its ring, then slides forward as if into a lock |
| `keyboard` | type | type | `type`, `terminal`, `keyboard@solid` | the keys press down as if someone is typing |
| `lamp` | glow | flicker | `lamp@solid`, `lightbulb`, `moon` | glows warmly like a reading lamp, flickering on when you hover |
| `landmark` | pulse | nod | `building`, `banknote` | stands steady like a trusted bank; settles firmly on hover |
| `language` | pulse | flip | `globe`, `message-circle` | the glyph turns over and the translated letter pops in |
| `laptop` | glow | zoom | `monitor`, `tablet`, `smartphone`, `laptop@solid` | its screen glows softly like it just woke up |
| `laugh` | jelly | tada | `smile`, `laugh@solid` | giggles with a happy wobble, then bursts out laughing on hover |
| `layers` | float | nudge | `layers@solid`, `files` | the top sheet floats while the layers below follow a beat later |
| `layout-dashboard` | pulse | pop | `layout-grid`, `layout-list`, `kanban` | panels swell calmly, then pop like a refreshed dashboard |
| `layout-grid` | pulse | jelly | `layout-list`, `layout-dashboard`, `kanban` | tiles swell calmly, then snap into a grid view |
| `layout-list` | pulse | pop | `layout-grid`, `list`, `table` | thumbnails stay put while the text rows slide in beside them |
| `layout-template` | pulse | jelly | `layout-dashboard`, `layout-grid`, `layout-list` | blocks hold still while the text lines fill in like a page loading |
| `leaf` | sway | sway | `leaf@solid` | sways from its stem like a leaf in a breeze |
| `library` | sway | sway | `book-open`, `book` | the leaning book rocks on its corner as if being pulled from the shelf |
| `lightbulb` | glow | glow | `lightbulb@solid` | glows softly as its filament flickers on, like an idea |
| `link` | nudge | jelly | `unlink`, `check` | the two links tug apart and click back together |
| `list-checks` | pulse | draw | `list`, `list-ordered`, `check-square` | its checkmarks tick in one after another like tasks getting done |
| `list-filter` | nudge | nudge | `filter`, `list` | sifts downward, narrowing a long list to what you need |
| `list-music` | pulse | wiggle | `list`, `music-note` | the music note sways to the beat beside the playlist |
| `list-ordered` | pulse | nod | `list`, `list-checks` | its numbers tap out a count while the lines wait in order |
| `list-plus` | pulse | pop | `list-checks`, `list` | the plus pops in, adding one more item to the list |
| `list` | pulse | fill | `list-checks`, `list-ordered` | the lines hold still while their bullets light up like items loading |
| `loader` | tick | spin-once | `check`, `check-circle`, `x-circle` | spokes step round like a spinner while something loads |
| `lock` | nod | nod | `unlock`, `lock@solid` | shackle clicks down into the body; tugs shut on hover |
| `log-in` | nudge | nudge | `log-out`, `user-check` | the arrow steps in through the door while the frame stays put |
| `log-out` | nudge | nudge | `log-in`, `user-x` | the arrow steps out of the door while the frame stays put |
| `luggage` | rock | pass | `backpack`, `briefcase` | rocks on its wheels, then rolls off on a trip |
| `mail-check` | pulse | nod | `mail`, `mail-open`, `mail-check@solid` | the envelope rests while its check pops now and then: mail delivered |
| `mail-open` | float | pop | `mail` | an opened letter drifts gently; pops on hover |
| `mail` | float | wiggle | `mail-open`, `send`, `check` | floats like a letter on its way, wiggles when you point at it |
| `map-pin` | float | bounce | `map-pin@solid`, `navigation` | hovers over the map, then drops and lands on its point |
| `map` | float | jelly | `map-pin`, `route`, `compass` | the paper map flexes gently along its folds |
| `maximize` | zoom | zoom | `minimize`, `zoom-in` | swells outward like a window going fullscreen |
| `medal` | sway | sway | `medal@solid`, `trophy`, `award` | swings from its ribbon, then swings high when awarded |
| `megaphone` | pulse | nudge | `bell-ring`, `volume-off` | pumps out an announcement, kicks back when you shout |
| `meh` | pulse | tilt | `smile`, `frown`, `meh@solid` | glances blankly side to side, then gives a little shrug |
| `menu` | pulse | jelly | `close`, `sidebar` | bars swell quietly, then wobble ready to open navigation |
| `message-circle-more` | pulse | jelly | `message-circle`, `check`, `message-circle-more@solid` | the bubble swells from its tail while the dots pulse like someone typing |
| `message-circle` | pulse | jelly | `messages`, `message-circle@solid` | swells from its tail like a chat waiting, jiggles on new messages |
| `message-square-text` | pulse | pop | `message-square`, `message-square-text@solid`, `check` | the bubble swells from its tail while its lines jitter like text being typed |
| `message-square` | pulse | pop | `messages`, `message-square@solid`, `check` | swells from its tail like a comment waiting, pops on hover |
| `messages` | float | jelly | `message-circle`, `message-square` | two bubbles bob in turn like a back-and-forth chat |
| `microphone-off` | float | shake | `microphone` | the mic rests quietly as the slash strikes it out: you are muted |
| `microphone` | pulse | pop | `microphone-off`, `stop`, `microphone@solid` | the capsule pulses with your voice on a steady stand |
| `microscope` | pulse | nod | `microscope@solid` | the eyepiece tube slides down to focus on the sample |
| `minimize` | pop | pop | `maximize`, `zoom-out` | snaps inward now and then like a window leaving fullscreen |
| `minus-circle` | pulse | pop | `plus-circle`, `x-circle`, `minus-circle@solid` | the bar swells inside a steady ring, pops when you remove an item |
| `minus` | pulse | jelly | `plus` | pulses softly, squashes when something is taken away |
| `monitor` | glow | zoom | `laptop`, `tv`, `smartphone`, `monitor@solid` | its screen glows softly like a display that is on |
| `moon` | breathe | tilt | `sun`, `moon@solid` | glows softly in a calm night sky, rocks on its crescent when touched |
| `more-horizontal` | pulse | jelly | `more-vertical`, `close` | dots swell softly like more is waiting |
| `more-vertical` | pulse | jelly | `more-horizontal`, `close` | dots swell softly like more options are waiting |
| `motorcycle` | float | tilt | `car`, `truck`, `motorcycle@solid` | idles with a light engine purr, pops a wheelie on hover |
| `mountain` | pulse | pop | `flag` | stands calm on the horizon, its peaks rising on hover |
| `mouse` | nod | nod | `cursor`, `keyboard`, `mouse@solid` | clicks softly now and then like a hand resting on it |
| `move` | pulse | pop | `drag-handle` | its four heads reach outward together, ready to drag any way |
| `music-note` | sway | bounce | `volume`, `play` | bops along to the beat from the base of the note |
| `navigation` | nudge | pass | `map-pin`, `compass` | points ahead and edges toward where you are going |
| `network` | pulse | nod | `router`, `server`, `globe` | links light up from the hub out to every device |
| `newspaper` | float | nudge | `file-text`, `newspaper@solid` | floats like the fresh morning paper, slides in when you point at it |
| `notebook` | rock | flip | `book-open`, `notepad-text`, `notebook@solid` | rocks on its spine, the spiral rings trailing, flips open on hover |
| `notepad-text` | type | draw | `sticky-note`, `pencil`, `notepad-text@solid` | the lines jitter like notes being jotted, they write on when hovered |
| `package-open` | pulse | jelly | `package`, `package-open@solid` | the opened box swells from its base, wobbles as you unpack it |
| `package` | bounce | bounce | `check-circle`, `truck`, `package@solid` | hops softly like a parcel being delivered |
| `paintbrush` | sway | wiggle | `palette`, `pencil` | sweeps from the grip like it is painting a stroke |
| `palette` | rock | jelly | `paintbrush`, `palette@solid` | rocks in a painter's thumb hold, wobbles when picked up |
| `palm-tree` | sway | sway | `palm-tree@solid`, `sun` | the palm sways in a warm breeze on its little island |
| `panel-bottom` | nudge | nudge | `panel-right`, `layout-list`, `panel-bottom@solid` | its bottom sheet eases up into view |
| `panel-left-close` | nudge | nudge | `panel-left-open`, `sidebar`, `chevron-left` | the arrow pulls left to fold the sidebar away, the frame stays put |
| `panel-left-open` | nudge | nudge | `panel-left-close`, `sidebar`, `chevron-right` | the arrow pushes right to slide the sidebar open, the frame stays put |
| `panel-right` | nudge | nudge | `sidebar`, `columns`, `panel-right@solid` | its details pane eases in from the right like a drawer |
| `paperclip` | sway | wiggle | `link`, `check` | hangs from its grip and sways, wiggles as it snaps onto a page |
| `parking` | glow | pop | `car`, `map-pin`, `parking@solid` | sign glows softly while the P pulses like a free space |
| `party-popper` | rock | tada | `party-popper@solid`, `gift` | rocks with excitement while confetti bursts from the cone |
| `passport` | float | pop | `id-card`, `globe` | floats ready to travel, pops like a fresh stamp on hover |
| `paste` | float | bounce | `check`, `clipboard` | the page hovers over the board, lands with a bounce on hover |
| `pause` | pulse | pop | `play`, `stop` | the bars pulse slowly, holding their place while playback rests |
| `paw-print` | nod | nod | `paw-print@solid`, `heart` | presses down in a soft step, toes landing a beat after the pad |
| `pen-tool` | sway | draw | `pencil` | the nib sways at its point, then draws a curve on hover |
| `pencil` | sway | wiggle | `eraser`, `check` | sways on its tip like it is about to write, scribbles on hover |
| `percent` | pulse | pop | `tag`, `dollar-sign` | the two dots drift apart and back like a sale badge breathing |
| `person-running` | float | nudge | `person-running@solid`, `timer`, `trophy` | bobs along at a steady jog, dashes ahead on hover |
| `phone-call` | ring | ring | `phone-off`, `phone` | the handset rings while its signal waves pulse outward |
| `phone-incoming` | ring | ring | `phone-call`, `phone-off`, `phone-missed` | rings softly while the arrow dips into the handset |
| `phone-missed` | ring | shake | `phone-outgoing`, `phone-call` | rings unanswered while the missed-call mark pulses for attention |
| `phone-off` | breathe | shake | `phone`, `phone-call` | rests quietly hung up, shakes no when you hover |
| `phone-outgoing` | ring | ring | `phone-call`, `phone-off` | handset buzzes softly while the arrow shoots out, a call heading out |
| `phone` | ring | wiggle | `phone-call`, `phone-off` | rattles softly like it is ringing, jiggles hard on hover |
| `picture-in-picture` | pulse | pop | `maximize`, `minimize`, `monitor` | the screen stays put while the mini player floats in its corner |
| `piggy-bank` | pulse | pop | `coins`, `wallet`, `piggy-bank@solid` | swells with savings and blinks now and then; pops as a coin goes in |
| `pilcrow` | pulse | fill | `pilcrow@solid`, `type`, `wrap-text` | rests while its second stem fades in, like hidden marks being shown |
| `pill` | rock | shake | `pill@solid` | rocks gently, then rattles like a capsule in a bottle |
| `pin` | nudge | nudge | `pin@solid`, `map-pin` | the head presses down its needle, like pinning a note to a board |
| `pizza` | rock | jelly | `pizza@solid`, `burger` | the slice droops from the crust, then wobbles cheesily |
| `plane-landing` | nudge | bounce | `plane-takeoff`, `plane` | glides down onto the runway; the runway stays put, touches down on hover |
| `plane-takeoff` | nudge | pass | `plane-landing`, `plane` | climbs away on departure while the runway streams below |
| `plane` | float | pass | `send` | cruises on steady air and takes off on hover |
| `play` | nudge | nudge | `pause`, `stop`, `play@solid` | leans forward, ready to start playing |
| `plug` | nudge | nudge | `zap`, `battery-charging`, `puzzle-piece`, `plug@solid` | pushes up into the socket and eases back out |
| `plus-circle` | pulse | pop | `minus-circle`, `check-circle`, `x-circle`, `plus-circle@solid` | the plus pulses inside a steady ring, inviting you to add an item |
| `plus` | pulse | pop | `minus`, `close`, `check` | pulses softly, pops forward, ready to add something new |
| `podcast` | pulse | pop | `microphone`, `headphones`, `podcast@solid` | broadcast waves ripple out from the mic like a live show |
| `pound-sterling` | flip | flip | `euro`, `dollar-sign`, `indian-rupee`, `coins` | flips like a pound coin now and then, its bar a beat behind |
| `power` | glow | pop | `power@solid`, `toggle`, `check` | glows softly like a device that is on; pops like a press |
| `presentation` | draw | draw |  | the board appears, then the chart on it draws itself like a pitch |
| `printer` | type | nod | `file-text`, `check`, `printer@solid` | hums while the page feeds out of the tray |
| `puzzle-piece` | float | nudge | `puzzle-piece@solid` | floats, then snaps sideways into place like a fitting piece |
| `qr-code` | pulse | fill | `check`, `barcode`, `qr-code@solid` | the data modules shimmer as if being read; scans on hover |
| `quote` | float | tilt | `message-square`, `message-circle` | floats gently like a cited line of speech |
| `rabbit` | bounce | bounce | `turtle`, `rabbit@solid`, `egg` | hops up and down like a bouncy bunny, with a big hop on hover |
| `radio` | pulse | wiggle | `music-note`, `podcast`, `radio@solid` | bops on the table, its speaker and antenna following the music |
| `rainbow` | breathe | draw | `cloud-rain`, `rainbow@solid` | bands glow in a soft ripple after the rain, arcs draw on when touched |
| `receipt` | pulse | nudge | `check`, `file-text`, `receipt@solid` | the lines print in on a steady slip; feeds out on hover |
| `redo` | nudge | nudge | `undo` | the arrowhead leads the curve forward, stepping the action ahead |
| `refresh` | spin-once | spin-once | `check`, `loader` | turns once to reload, then rests; a quick spin on hover |
| `refrigerator` | pulse | jelly | `snowflake`, `thermometer`, `refrigerator@solid` | stands steady with a quiet hum like a fridge keeping food cold |
| `remove-formatting` | float | shake | `type`, `eraser`, `bold` | the T stays calm while the little x scrubs its styling away |
| `repeat-1` | spin-once | spin-once | `repeat`, `shuffle` | the arrows go round once more while the 1 stays put |
| `repeat` | spin-once | spin-once | `repeat-1`, `shuffle` | goes round once more, then rests, like a track on repeat |
| `reply-all` | nudge | nudge | `reply`, `forward`, `check` | arrowheads lead back to the left, the tail follows: reply to all |
| `reply` | nudge | nudge | `send`, `check` | the arrowhead reaches back to the left, the tail following |
| `rewind` | nudge | pass | `fast-forward`, `skip-back` | rushes back like scrubbing a video backward |
| `rocket` | nudge | pass | `rocket@solid` | hums on the launchpad, then blasts off up and away |
| `rotate-ccw` | tilt | tilt | `rotate-cw`, `undo` | leans back counter-clockwise, like undoing a turn |
| `rotate-cw` | spin-once | spin-once | `rotate-ccw`, `redo` | turns once clockwise, then rests |
| `route` | draw | draw | `map-pin`, `map` | traces the path between its two stops |
| `router` | pulse | jelly | `wifi`, `wifi-off`, `network` | antennas and status lights blink while the box sits steady |
| `rss` | pulse | pulse | `wifi`, `bell-ring` | the source dot pulses and the feed waves light up after it |
| `ruler` | nudge | nudge |  | slides along its edge like it is measuring |
| `salad` | pulse | jelly | `salad@solid`, `soup`, `leaf` | the leaves rustle fresh in a steady bowl, tossed on hover |
| `save` | nod | nod | `check`, `save@solid` | presses down to commit, the label settling a beat later |
| `scale` | rock | rock | `scale@solid` | the beam weighs two options, pans swinging a beat behind |
| `scan-face` | pulse | pop | `user-check`, `shield-check`, `smile` | scan corners focus in and out; the face nods once recognised |
| `school` | pulse | sway |  | stands firm while the flag on its roof flutters in the breeze |
| `scissors` | rock | wiggle | `paste` | the two blades snip open and shut about their pivot |
| `scroll-text` | float | draw | `file-text`, `scroll-text@solid` | an old parchment drifting, its text lagging, writes itself on hover |
| `search` | orbit | tilt | `close`, `zoom-in` | lens sweeps in small circles, scanning for something |
| `send` | nudge | pass | `check`, `mail` | edges forward along its heading, flies off and back on hover |
| `server` | pulse | jelly | `database`, `cloud`, `cpu` | status lights blink while the rack hums along |
| `settings` | spin | spin-once | `settings@solid`, `sliders` | turns slowly like a working gear |
| `share-2` | pulse | nudge | `check`, `share`, `link` | the arrow lifts up out of the box, ready to share |
| `share` | pulse | nudge | `check`, `link` | swells out from the source node toward people and apps |
| `shield-alert` | pulse | pop | `shield-check`, `shield` | shield holds steady while its warning mark throbs for attention |
| `shield-check` | pulse | pop | `shield-alert`, `shield`, `shield-check@solid` | shield rests calmly while its tick nods yes: you are protected |
| `shield-off` | flicker | shake | `shield`, `shield-check`, `shield-alert` | shield flickers weakly, its slash twitches: protection is off |
| `shield-user` | pulse | pop | `shield-check`, `user-check`, `shield-user@solid` | shield rests calmly while the person inside nods, verified |
| `shield` | pulse | pop | `shield-check`, `shield-alert`, `shield@solid` | stands guard with a calm, firm swell; braces with a pop |
| `ship` | rock | pass | `anchor`, `plane`, `ship@solid` | rocks on the waves, then sails off and back on hover |
| `shopping-bag` | ring | ring | `shopping-bag@solid`, `check`, `shopping-cart` | swings from its handle like a bag set down, body a beat behind |
| `shopping-basket` | bounce | bounce | `check`, `shopping-cart`, `shopping-bag`, `shopping-basket@solid` | hops softly as items drop in, handle and slats a beat behind |
| `shopping-cart-plus` | pop | pop | `check`, `shopping-cart`, `shopping-cart-plus@solid` | pops now and then like an item just added to the cart |
| `shopping-cart` | nudge | pass | `shopping-cart-plus`, `check`, `shopping-bag`, `shopping-cart@solid` | rolls forward and back; zooms off on hover |
| `shuffle` | nudge | nudge | `repeat` | the arrowheads push ahead as the tracks cross and mix |
| `sidebar` | nudge | nudge | `columns`, `layout-dashboard`, `menu` | leans toward its rail like a side panel sliding open |
| `signal` | fill | fill | `wifi`, `wifi-off` | bars fill up from the base as the signal gets stronger |
| `signature` | draw | draw | `check`, `pen-tool` | the signature writes itself out above a steady line |
| `signpost` | sway | wiggle | `map`, `route` | leans gently in the breeze from its foot as one post, wiggles on hover |
| `siren` | glow | pop | `bell-ring`, `shield-alert` | dome glows like a flashing light while its rays pulse outward |
| `skip-back` | nudge | nudge | `skip-forward`, `rewind` | the arrow knocks back against the bar: previous track |
| `skip-forward` | nudge | pass | `skip-back`, `play` | the arrow bumps into the bar: on to the next track |
| `sliders` | nudge | nudge | `settings`, `filter`, `toggle` | the knobs glide along their tracks like a setting being tuned |
| `smartphone` | wiggle | shake | `tablet`, `phone` | buzzes softly like a message just came in |
| `smile` | pulse | jelly | `heart`, `smile@solid` | squints a happy blink now and then, wobbles with joy on hover |
| `snowflake` | spin | spin-once | `sun`, `cloud-snow` | turns slowly like a snowflake drifting down |
| `sofa` | jelly | jelly | `bed`, `sofa@solid`, `home` | cushions squish softly now and then, like someone sinking in |
| `sort` | nudge | nudge | `chevrons-up-down`, `filter` | the arrow slides down past the rows as the list reorders |
| `soup` | pulse | jelly | `soup@solid`, `salad`, `cooking-pot` | steam rises from a warm bowl, then the bowl is served |
| `sparkles` | twinkle | twinkle | `wand`, `sparkles@solid` | the big star glints while the small ones twinkle in turn |
| `speaker` | pulse | jelly | `volume-off`, `music-note`, `volume` | the cone thumps to the beat while the cabinet stays put |
| `sprout` | sway | pop | `flower`, `leaf`, `sprout@solid` | sways from the soil and pops up as it grows |
| `square-minus` | pulse | jelly | `square-plus`, `square`, `minus` | the minus squashes like a fold, ready to collapse |
| `square-plus` | pulse | pop | `square-minus`, `square-x`, `plus` | the plus swells inside a calm box, ready to add |
| `square-x` | pulse | shake | `square-plus`, `square`, `close` | the X rocks gently in its box, shakes no on hover |
| `square` | float | pop | `check-square`, `square@solid`, `stop`, `circle` | floats calmly like a selectable box, pops when ticked |
| `star-half` | twinkle | flip | `star@solid`, `star` | twinkles softly, then turns over like a rating being set |
| `star` | twinkle | pop | `star@solid` | twinkles like a little star in the night sky |
| `stethoscope` | sway | beat | `heart-pulse`, `stethoscope@solid` | hangs from its earpieces and swings, thumps like a heartbeat on hover |
| `sticky-note` | sway | wiggle | `check`, `sticky-note@solid` | flutters from its sticky top edge, the peeled corner trailing |
| `stop` | pulse | jelly | `play`, `pause` | stands by with a slow pulse, squashes like a pressed button |
| `store` | pulse | jelly | `store@solid`, `building`, `shopping-bag` | the shop stands calm while its door and awning stripes swell in welcome |
| `strikethrough` | nudge | nudge | `underline`, `bold`, `eraser` | the strike swipes through the letter, marking it done |
| `subscript` | nudge | nudge | `superscript`, `type` | the small 2 dips below the line, like the 2 in H2O |
| `sun-moon` | rock | spin-once | `moon`, `sun`, `sun-moon@solid` | rocks gently between day and night, turns over when touched |
| `sun` | pulse | pop | `moon`, `cloud-sun`, `sun@solid` | the disc glows calmly while only the rays turn; on touch it swells, rays whirl |
| `sunrise` | glow | glow | `sunset`, `sun` | morning light glows as the arrow climbs; the sun lifts on touch |
| `sunset` | glow | glow | `sunrise`, `moon` | golden hour glows as the arrow sinks; the sun drops on touch |
| `superscript` | nudge | nudge | `subscript`, `type` | the small 2 lifts above the line, like a power or footnote |
| `swap` | spin-once | spin-once | `repeat`, `shuffle` | the two arrows circle round and trade places |
| `syringe` | nudge | nudge | `syringe@solid`, `pill` | presses forward along its needle, plunger a beat behind, like a shot |
| `table` | pulse | pop | `layout-grid`, `columns`, `layout-list` | swells gently like a grid of data refreshing |
| `tablet` | float | tilt | `smartphone`, `laptop` | floats gently, then tilts like it is being picked up |
| `tag` | sway | ring | `tag@solid`, `badge-percent`, `check` | swings from its hole like a price tag on a shelf hook |
| `target` | pulse | zoom | `crosshair`, `check-circle` | rings pulse inward like focusing on a goal, then lock on |
| `taxi` | float | pass | `car`, `map-pin`, `taxi@solid` | idles at the kerb with a soft rumble, drives off and back on hover |
| `telescope` | tilt | tilt |  | the tube scans the sky, tilting on a steady tripod |
| `tennis` | rock | ring | `tennis@solid`, `trophy` | swings the racket from its handle like a forehand |
| `tent` | sway | jelly | `mountain` | canvas sways in a light breeze while the door flap flutters |
| `terminal` | pulse | pop | `code` | window rests while the prompt and cursor tick like typing |
| `text-cursor-input` | pulse | type | `type` | the cursor blinks in a still field, then keystrokes land on hover |
| `thermometer` | pulse | nudge | `snowflake`, `sun` | bulb warms while the scale lights up; the reading jumps on touch |
| `thumbs-down` | rock | nudge | `thumbs-down@solid`, `thumbs-up` | the hand dips from the wrist in quiet disapproval |
| `thumbs-up` | rock | nudge | `thumbs-up@solid`, `thumbs-down` | the hand rocks from the wrist, then lifts in approval |
| `ticket` | float | jelly | `check-circle`, `ticket@solid` | floats like a ticket in hand, its tear line pulsing; punched on hover |
| `timer` | pulse | nod | `clock`, `alarm-clock`, `check`, `timer@solid` | counts down with a steady beat, the crown clicks to start |
| `toggle` | jelly | jelly | `toggle@solid`, `sliders` | the knob slides across the track like a switch being flipped |
| `toilet` | jelly | jelly | `bath`, `droplet`, `toilet@solid` | wobbles softly on its base, like a flush just finished |
| `tooth` | glow | jelly | `smile`, `sparkles`, `tooth@solid` | gleams like a freshly brushed tooth, wobbles when tapped |
| `traffic-cone` | jelly | jelly | `alert-triangle`, `ban`, `traffic-cone@solid` | wobbles on its base now and then, jiggles when bumped |
| `train` | float | zoom | `bus`, `plane`, `train@solid` | chugs gently on the rails, pulls into the station on hover |
| `trash` | rock | wiggle | `check`, `trash@solid` | rocks on its base, then wobbles as it is filled |
| `tree-pine` | sway | sway | `tree-pine@solid` | the pine bends gently in the wind over a steady trunk |
| `trending-down` | nudge | nudge | `trending-up` | line dips down and right, its arrowhead following through |
| `trending-up` | nudge | nudge | `trending-down` | line climbs up and right, its arrowhead following through |
| `triangle` | float | nudge | `play`, `triangle@solid` | floats calmly, then nudges up like a rising delta |
| `trophy` | glow | tada | `trophy@solid`, `award` | shines with pride, then celebrates a win |
| `truck` | bounce | pass | `package`, `check-circle`, `map-pin` | rumbles over bumps in the road; drives off on hover |
| `turtle` | rock | nudge | `rabbit`, `turtle@solid` | plods slowly side to side, bobbing its head as it goes |
| `tv` | flicker | jelly | `monitor`, `film` | screen glows softly while the antenna ears jiggle for signal |
| `type` | type | type | `heading`, `keyboard`, `bold` | taps like a key being typed, its foot serif landing a beat later |
| `umbrella` | sway | jelly | `cloud-rain`, `umbrella@solid` | sways gently from the hand as if held in the rain, pops open on touch |
| `underline` | float | nod | `strikethrough`, `italic`, `bold` | the letter bobs while its underline swells beneath it |
| `undo` | nudge | nudge | `redo` | steps back, the arrowhead leading the way |
| `unlink` | pulse | shake | `link` | the links hold apart while the break marks spark |
| `unlock` | float | pop | `lock`, `key` | floats free with its shackle open, unlocked; pops on hover |
| `upload` | nudge | nudge | `check`, `download`, `cloud-upload` | the arrow lifts out of the tray, sending a file up |
| `usb` | nudge | nudge | `plug`, `check` | plugs in: slides up into the port and back |
| `user-check` | float | nod | `user`, `user-x`, `user-minus` | person rests while the check pops now and then: approved |
| `user-circle` | float | nod | `user`, `log-out` | avatar floats softly as one piece, nods hello on hover |
| `user-cog` | float | nod | `settings`, `user`, `user-check` | person floats calmly while only the gear turns slowly: account settings |
| `user-minus` | float | shake | `user-plus`, `user` | person rests while the minus slides away: member removed |
| `user-pen` | pulse | nod | `user-check`, `pencil`, `user` | the pen scribbles beside a calm profile, editing its details |
| `user-plus` | float | pop | `user-check`, `user-minus`, `users` | person rests while the plus pops like an invite, new friend |
| `user-search` | pulse | pop | `user-check`, `search`, `users` | the lens circles, scanning for someone; sweeps once on hover |
| `user-x` | float | shake | `user-check`, `user` | person rests while the X twitches no, shakes no on hover |
| `user` | float | nod | `user-check`, `user-plus`, `user-circle`, `users` | floats calmly like someone present, nods hello on hover |
| `users` | float | nod | `user`, `user-plus` | the front person breathes and the one behind nods along, a team |
| `utensils` | rock | rock | `utensils@solid`, `chef-hat` | fork and knife lean in turn, then clink together, ready for the meal |
| `video-call` | pulse | jelly | `video-camera`, `phone`, `phone-off` | pulses gently like a live call, bounces when you join |
| `video-camera` | pulse | tilt | `camera`, `video-call` | the lens zooms in and out while the camera rolls |
| `video-off` | breathe | shake | `video-camera`, `eye-off`, `microphone-off` | dims quietly while the camera is off, shakes no when tapped |
| `volleyball` | spin | nudge | `volleyball@solid`, `trophy` | turns slowly through the air, pops up like a bump on hover |
| `volume-1` | pulse | pulse | `volume`, `volume-off` | a soft sound wave hums out of the speaker |
| `volume-off` | breathe | shake | `volume`, `volume-1` | sits quietly muted, shakes its head when touched |
| `volume` | pulse | pulse | `volume-off`, `volume-1` | the speaker thumps and its sound waves swell out |
| `wallet` | pulse | pop | `wallet@solid`, `credit-card`, `coins` | rests calmly while its clasp tab eases open; pops on hover |
| `wand` | sway | wiggle | `sparkles`, `wand@solid` | waves from the handle while its sparkles twinkle |
| `warehouse` | pulse | jelly | `store`, `package`, `warehouse@solid` | the depot stands firm while its roller door eases up and down |
| `washing-machine` | type | shake | `droplet`, `check`, `washing-machine@solid` | rumbles on its feet while the drum tumbles round |
| `watch` | pulse | tilt | `clock`, `timer` | hands tick round the dial; tilts like a glance at the wrist |
| `webcam` | sway | zoom | `camera-off`, `video-off`, `video-camera` | looks around on its stand; the lens focuses when you look |
| `webhook` | spin | spin-once | `link` | slowly circles its three hooks like events passing round |
| `wifi-off` | flicker | shake | `wifi`, `signal` | arcs flicker like a dropping connection while the slash holds |
| `wifi` | fill | fill | `wifi-off`, `signal` | arcs light up from the dot like a signal reaching you |
| `wind` | nudge | pass | `cloud`, `leaf` | gusts stream to the right in staggered waves |
| `wine` | rock | rock |  | swirls gently on its stem, the wine sloshing a beat behind |
| `wrap-text` | nudge | nudge | `align-left`, `corner-down-left`, `pilcrow` | the long line bends round and settles onto the next row |
| `wrench` | rock | tilt | `settings`, `hammer` | turns about the nut in its jaw like tightening a bolt |
| `x-circle` | pulse | shake | `check-circle`, `alert-circle` | the X throbs in a steady ring, then shakes no: something went wrong |
| `zap` | flicker | nudge | `zap@solid`, `battery-charging` | crackles with electric energy, then strikes down along its path |
| `zoom-in` | zoom | zoom | `zoom-out`, `search`, `maximize` | the lens magnifies and the plus grows, zooming into the details |
| `zoom-out` | pop | pop | `zoom-in`, `search`, `minimize` | the lens dips back, as if zooming out to see more |
<!-- motion:end -->
