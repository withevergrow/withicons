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
import '@withicons/motion/icons.css'    // each icon's tuned motion: pivot, direction, timing (keyed by data-wm)
```

CDN: `https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css` and `.../dist/icons.css`.

## Classes

| class / attribute | effect |
|---|---|
| `wm` | base class on the wrapper |
| `data-wm="<icon>"` | use that icon's tuned motion (from `icons.css`) |
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
| `accessibility` | pulse | jelly | `user`, `accessibility@solid` | opens its arms in a calm welcome, wobbles happily when you reach for it |
| `activity` | draw | draw | `heart-pulse` | traces its pulse line like a live monitor |
| `address-book` | rock | tilt | `user`, `phone` | opens up a little like you're flipping to a contact |
| `alarm-clock` | ring | ring | `bell-ring`, `check`, `clock`, `timer` | rattles on its feet like an alarm going off |
| `alert-circle` | pulse | shake | `check-circle`, `info-circle`, `alert-circle@solid` | pulses to draw attention, shakes on hover |
| `alert-triangle` | pulse | shake | `check-circle`, `alert-triangle@solid` | glows like a warning light, shakes on hover |
| `align-center` | breathe | jelly | `align-left`, `align-right`, `align-justify` | settles its lines toward the middle |
| `align-justify` | breathe | jelly | `align-left`, `align-center`, `align-right` | stretches its even lines edge to edge |
| `align-left` | nudge | nudge | `align-center`, `align-right`, `align-justify` | slides its lines over to the left edge |
| `align-right` | nudge | nudge | `align-center`, `align-left`, `align-justify` | slides its lines over to the right edge |
| `ambulance` | nudge | pass | `siren`, `truck`, `ambulance@solid` | idles forward, then races off and comes back on hover |
| `anchor` | rock | rock |  | rocks gently on its chain like a moored ship |
| `angry` | pulse | shake | `meh`, `smile`, `angry@solid` | fumes quietly, then shakes with rage when you poke it |
| `app-window` | breathe | pop | `maximize`, `monitor`, `layout-template` | pops open like an app window launching |
| `apple` | sway | bounce |  | sways like fresh fruit hanging from its stem |
| `archive` | float | bounce | `package`, `inbox` | settles into storage with a soft bounce |
| `arrow-down-left` | nudge | pass | `arrow-up-right`, `arrow-down-right` | nudges down and left to show where it points |
| `arrow-down-right` | nudge | pass | `arrow-up-left` | nudges down and right to show where it points |
| `arrow-down` | nudge | pass | `arrow-up` | nudges down to show where it points |
| `arrow-left-right` | nudge | shake | `arrow-up-down`, `swap` | rocks side to side to show it goes both ways |
| `arrow-left` | nudge | pass | `arrow-right` | nudges left to show where it points |
| `arrow-right` | nudge | pass | `arrow-left`, `check` | nudges right to show where it points |
| `arrow-up-down` | float | nod | `arrow-left-right`, `sort` | bobs up and down to show it goes both ways |
| `arrow-up-left` | nudge | pass | `arrow-down-right` | nudges up and left to show where it points |
| `arrow-up-right` | nudge | pass | `arrow-down-right` | nudges up and right to show where it points |
| `arrow-up` | nudge | pass | `arrow-down` | nudges up to show where it points |
| `at-sign` | breathe | spin-once | `mail`, `hash` | breathes calmly, spins round when you mention someone |
| `atom` | spin | spin-once |  | electron orbits turn slowly around the nucleus |
| `audio-lines` | jelly | pulse | `microphone`, `microphone-off` | sound bars bounce like a voice is speaking |
| `award` | glow | tada | `award@solid`, `badge-check` | shines like a medal, then celebrates a win |
| `backpack` | sway | ring |  | swings gently from its top handle |
| `badge-check` | breathe | pop | `badge-check@solid` | swells proudly, a verified seal of approval |
| `badge-percent` | pulse | tada | `percent`, `badge-check`, `badge-percent@solid` | pulses like a sale sticker that wants your attention |
| `balloon` | float | rise | `balloon@solid`, `party-popper` | bobs gently in the air, then floats up and away on hover |
| `ban` | pulse | shake | `check-circle` | shakes no: this is blocked or not allowed |
| `bandage` | breathe | pop | `bandage@solid`, `heart` | breathes gently like a wound healing, pops on as if stuck down |
| `banknote` | float | flip | `coins`, `wallet`, `credit-card` | flutters like fresh cash in your hand |
| `barcode` | fill | flicker | `qr-code`, `check` | flickers like a scanner reading the code |
| `basketball` | bounce | spin-once | `basketball@solid`, `trophy` | dribbles up and down, spins on a finger when touched |
| `bath` | rock | jelly | `droplet`, `bath@solid`, `toilet` | rocks gently like warm water settling in the tub |
| `battery-charging` | fill | flicker | `battery`, `zap`, `plug` | fills with power while the bolt flickers |
| `battery-low` | fill | shake | `battery-charging`, `battery`, `plug` | fades in and out to warn that power is running low |
| `battery` | fill | nudge | `battery-charging`, `zap`, `plug` | fills up with charge, cell by cell |
| `bed` | breathe | jelly | `moon`, `sofa`, `bed@solid` | breathes slowly like someone sound asleep |
| `beer` | rock | tilt |  | rocks gently, then tips like a mug raised for cheers |
| `bell-off` | breathe | shake | `bell`, `bell-ring` | stays quietly muted, shakes softly if you try to ring it |
| `bell-ring` | ring | ring | `bell-off`, `bell` | rings from its hook like a fresh notification |
| `bell` | ring | ring | `bell-off`, `bell-ring`, `bell@solid` | rings from its hook like a notification just arrived |
| `bike` | pass | nudge | `bike@solid`, `motorcycle`, `car` | rides along the road, rolls forward when you point at it |
| `binoculars` | tilt | zoom | `eye`, `search` | scans the horizon, then zooms in on what it found |
| `bird` | bounce | tilt | `bird@solid`, `egg` | hops lightly in place like a little songbird |
| `bluetooth` | pulse | glow | `wifi`, `link`, `bluetooth@solid` | pulses like it is searching for a device to pair |
| `bold` | pulse | pop | `bold@solid`, `italic`, `underline` | swells with weight like text turning bold |
| `book-open` | float | flip | `book`, `bookmark`, `book-open@solid` | rests open and lifts gently, ready to be read |
| `book` | sway | tilt | `book-open`, `bookmark` | leans gently like a book on a shelf |
| `bookmark-plus` | float | pop | `bookmark-plus@solid`, `bookmark`, `check` | floats gently, then pops when you save it |
| `bookmark` | float | pop | `bookmark@solid` | floats gently, then pops when you save it |
| `bot` | float | blink | `brain`, `user` | hovers like a friendly robot and blinks at you |
| `braces` | breathe | jelly | `code`, `terminal` | opens up softly like a code block wrapping content |
| `brain` | breathe | glow | `bot`, `lightbulb`, `sparkles` | glows softly as if it is thinking |
| `briefcase-medical` | sway | rock | `briefcase`, `briefcase-medical@solid` | sways from its handle like a kit being carried to help |
| `briefcase` | rock | ring | `briefcase@solid` | swings from its handle like a bag being carried |
| `bug` | wiggle | wiggle | `check-circle`, `check` | twitches like a little beetle on the move |
| `building` | breathe | pop | `home`, `store`, `landmark` | stands tall with a calm presence, rises on hover |
| `burger` | jelly | bounce | `burger@solid`, `pizza` | the stacked burger squishes softly like a juicy bite |
| `bus` | bounce | zoom | `train`, `car`, `bus@solid` | idles at the stop with a gentle engine hum, then pulls up close on hover |
| `butterfly` | float | jelly | `flower`, `butterfly@solid`, `sprout` | flutters gently on a breeze |
| `cake` | flicker | tada |  | candle flickers softly, like a birthday wish is coming |
| `calculator` | type | type | `percent`, `receipt` | taps away like keys adding up a total |
| `calendar-check` | pulse | draw | `calendar`, `calendar-check@solid` | pulses gently, ticks the date off on hover |
| `calendar-days` | breathe | flip | `calendar`, `calendar-check`, `calendar-plus` | breathes calmly, flips to the month on hover |
| `calendar-plus` | pulse | pop | `calendar-check`, `calendar`, `calendar-plus@solid` | pulses like an invite, pops when you add an event |
| `calendar` | breathe | flip | `calendar-check`, `calendar-plus`, `calendar-days` | turns its page like a new day arriving |
| `camera-off` | breathe | shake | `camera`, `eye-off`, `video-off` | dims quietly: no photos here |
| `camera` | breathe | pop | `image`, `video-camera`, `check`, `camera@solid` | snaps like a photo being taken |
| `captions` | type | pop | `captions@solid`, `type` | subtitle lines flicker in like captions being typed |
| `car` | nudge | pass | `truck` | idles forward and drives off on hover |
| `cast` | fill | nudge | `tv`, `monitor`, `cast@solid` | sends signal waves out to the screen |
| `cat` | blink | tilt | `dog`, `cat@solid`, `paw-print` | gives you a slow, friendly cat blink |
| `chart-area` | fill | pop | `chart-line`, `chart-bar` | fills in like volume adding up over time |
| `chart-bar` | fill | jelly | `chart-line`, `chart-pie` | fills up like a live dashboard and springs from its baseline |
| `chart-line` | draw | draw | `chart-area`, `trending-up`, `chart-bar` | draws its trend line left to right like new data arriving |
| `chart-pie` | spin | spin-once | `chart-bar`, `chart-pie@solid` | turns slowly like shares settling into place |
| `check-check` | draw | draw | `check`, `check-check@solid` | both ticks draw in, like a message that was just read |
| `check-circle` | breathe | draw | `check-circle@solid`, `x-circle`, `circle` | draws its tick as a task completes |
| `check-square` | breathe | draw | `square`, `check-square@solid` | ticks itself like a checkbox being checked |
| `check` | draw | draw | `check-circle`, `close` | draws itself in like a tick being written |
| `chef-hat` | sway | jelly | `chef-hat@solid`, `cooking-pot`, `utensils` | the puffy toque sways and wobbles like a busy chef |
| `chevron-down` | nudge | nudge | `chevron-up` | nudges down to hint that more opens below |
| `chevron-first` | nudge | nudge | `chevron-last`, `chevron-left`, `skip-back` | leans back toward the start, like it's heading to page one |
| `chevron-last` | nudge | nudge | `chevron-first`, `chevron-right`, `skip-forward` | leans ahead toward the end, like it's jumping to the last page |
| `chevron-left` | nudge | nudge | `chevron-right` | nudges left to say go back |
| `chevron-right` | nudge | nudge | `chevron-left`, `chevron-down` | nudges right to say go forward |
| `chevron-up` | nudge | nudge | `chevron-down` | nudges up to hint that the section collapses |
| `chevrons-down` | nudge | pass | `chevrons-up`, `chevron-down`, `chevrons-up-down` | nudges downward to say there is more below |
| `chevrons-left` | nudge | pass | `chevrons-right`, `chevron-left`, `chevron-first` | nudges left to say jump back |
| `chevrons-right` | nudge | pass | `chevrons-left`, `chevron-right`, `chevron-last` | nudges right to say skip ahead |
| `chevrons-up-down` | zoom | jelly | `chevron-down`, `sort` | breathes open and closed, hinting at a list of choices |
| `chevrons-up` | nudge | pass | `chevrons-down`, `chevron-up`, `chevrons-up-down` | nudges upward to say back to top |
| `circle-arrow-down` | nudge | nudge | `circle-arrow-up`, `circle-arrow-down@solid`, `check` | dips downward, like scroll down or save to your device |
| `circle-arrow-left` | nudge | nudge | `circle-arrow-right`, `circle-arrow-left@solid`, `arrow-left` | nudges left like a back button inviting a tap |
| `circle-arrow-right` | nudge | nudge | `circle-arrow-left`, `circle-arrow-right@solid`, `check` | nudges right like a next button saying go on |
| `circle-arrow-up` | nudge | nudge | `circle-arrow-down`, `circle-arrow-up@solid`, `arrow-up` | lifts gently upward, like back to top or level up |
| `circle-chevron-down` | nudge | nudge | `circle-chevron-right`, `circle-chevron-down@solid`, `chevron-down` | bobs downward to hint there is more to open |
| `circle-chevron-right` | nudge | nudge | `circle-chevron-down`, `circle-chevron-right@solid`, `chevron-right` | nudges right to invite you to continue or open details |
| `circle-dot` | pulse | pop | `circle`, `circle-dot@solid` | pulses softly like a selected option or a live recording point |
| `circle-pause` | breathe | pop | `circle-play`, `circle-stop`, `circle-pause@solid` | breathes slowly while playback is on hold |
| `circle-play` | pulse | pop | `circle-pause`, `circle-stop`, `circle-play@solid` | gently pulses like a play button inviting you to start |
| `circle-stop` | pulse | jelly | `circle-play`, `circle-pause`, `circle-stop@solid` | pulses softly like a recording you can stop |
| `circle` | pulse | pop | `circle@solid`, `check-circle`, `x-circle` | pulses softly like a live status dot |
| `clapperboard` | ring | ring | `film`, `play`, `video-camera` | snaps shut like a scene starting: action! |
| `clipboard-check` | breathe | draw | `clipboard-list`, `clipboard`, `clipboard-check@solid` | the check mark writes itself on, like a task just signed off |
| `clipboard-list` | type | nod | `clipboard-check`, `list-checks` | ticks through its list like someone checking items off |
| `clipboard` | float | nod | `check`, `paste` | floats gently and nods when something lands on it |
| `clock` | tick | spin-once | `alarm-clock`, `timer`, `history` | its hands tick round the face like passing time |
| `close` | breathe | spin-once | `menu`, `plus`, `check` | spins away on hover to say this will close |
| `cloud-download` | float | nudge | `check`, `loader`, `cloud-upload` | pulls data down from the cloud |
| `cloud-lightning` | flicker | shake | `cloud-rain`, `cloud` | flashes like a storm cloud about to strike |
| `cloud-off` | float | shake | `cloud`, `wifi-off`, `cloud-upload` | drifts quietly, waiting for the connection to come back |
| `cloud-rain` | float | drop | `cloud-snow`, `cloud-lightning`, `cloud` | floats while it rains, then shakes loose a shower |
| `cloud-snow` | float | drop | `cloud-rain`, `snowflake`, `cloud` | hangs softly in the air while snow drifts down |
| `cloud-sun` | float | glow | `sun`, `cloud` | sun glows behind a drifting cloud |
| `cloud-upload` | float | nudge | `check`, `loader`, `cloud-download` | lifts data up into the cloud |
| `cloud` | float | nudge | `cloud-sun`, `cloud-rain`, `cloud@solid` | drifts gently like a cloud in the sky |
| `code` | type | jelly | `braces`, `terminal`, `file-code` | ticks along like code being typed |
| `coffee` | breathe | tilt |  | steams gently like a fresh hot cup |
| `coins` | float | flip | `banknote`, `wallet`, `dollar-sign` | spins and glints like coins being counted |
| `columns` | breathe | jelly | `sidebar`, `layout-grid`, `kanban` | panes breathe gently, then jiggle like a resized layout |
| `compass` | rock | spin-once | `navigation`, `map` | swings around like a needle settling on north |
| `cookie` | rock | spin-once |  | rolls slowly like a cookie on the counter |
| `cooking-pot` | breathe | shake | `cooking-pot@solid`, `soup`, `chef-hat` | the pot simmers softly, then its lid rattles at the boil |
| `copy` | breathe | pop | `check`, `paste` | breathes softly, pops when you copy |
| `corner-down-left` | nudge | nudge | `check`, `corner-down-right` | nudges left like pressing Enter |
| `corner-down-right` | nudge | nudge | `reply` | steps right, like a reply tucking in under its thread |
| `cpu` | pulse | glow | `server`, `cpu@solid` | hums with a steady pulse like a working processor |
| `credit-card` | float | flip | `check`, `wallet`, `credit-card@solid` | flips over like a card being tapped to pay |
| `crop` | zoom | zoom | `maximize`, `image` | the frame tightens in like you are cropping a photo |
| `crosshair` | pulse | zoom | `target`, `map-pin` | pulses as it locks on to a target |
| `crown` | float | tada | `crown@solid` | floats proudly, then celebrates when you point at it |
| `cup-soda` | float | wiggle |  | fizzes with a gentle bob, like a cold drink ready to sip |
| `cursor` | tilt | nudge | `mouse` | leans in like it is about to click |
| `database` | breathe | bounce | `server` | breathes like stored data, then settles on its base |
| `disc` | spin | spin-once | `music-note`, `play`, `disc@solid` | spins like a record playing |
| `dna` | flip | flip |  | the double helix twists around its axis |
| `dog` | tilt | nod | `cat`, `dog@solid`, `paw-print` | tilts its head like a puppy listening to you |
| `dollar-sign` | flip | tada | `coins`, `percent`, `banknote` | spins like a coin, money coming in |
| `donut` | spin | spin-once |  | turns slowly to show off its sprinkles |
| `door-open` | nudge | nudge | `log-in`, `home`, `key` | beckons you through, like a door inviting you in |
| `download` | drop | nudge | `check`, `loader`, `upload` | drops into the tray like a file arriving |
| `drag-handle` | nudge | nudge | `move`, `menu` | lifts up and down to show it can be dragged |
| `droplet` | drop | jelly | `droplet@solid` | drips like water falling from a tap |
| `dumbbell` | float | nod | `dumbbell@solid`, `heart-pulse` | lifts up and down like steady reps at the gym |
| `edit` | sway | wiggle | `check`, `save` | the pencil sways at its tip, ready to write |
| `egg` | rock | wiggle | `egg@solid` | the egg rocks on its base as if about to hatch |
| `eraser` | rock | shake | `pencil` | rubs back and forth to wipe something clean |
| `euro` | flip | tada | `dollar-sign`, `pound-sterling`, `indian-rupee`, `coins` | spins like a euro coin, money changing hands |
| `external-link` | nudge | nudge | `link` | arrow heads out of the box to open elsewhere |
| `eye-off` | blink | shake | `eye` | blinks slowly, keeping things hidden |
| `eye` | blink | blink | `eye-off`, `eye@solid` | blinks now and then like it is watching |
| `factory` | pulse | jelly | `warehouse`, `building`, `factory@solid` | hums with a steady pulse like a working production line |
| `fast-forward` | nudge | pass | `rewind`, `skip-forward` | races ahead like scrubbing a video forward |
| `file-archive` | breathe | jelly | `file`, `archive` | squeezes down like a zipped bundle |
| `file-audio` | sway | bounce | `music-note`, `file` | sways and bops along to the music |
| `file-check` | breathe | nod | `file`, `file-check@solid` | nods yes when the document is approved |
| `file-code` | type | wiggle | `code`, `file` | ticks like code being typed |
| `file-down` | drop | nudge | `file-check`, `file-up`, `download` | drops gently, like a file landing on your device |
| `file-image` | float | zoom | `image`, `file` | floats like a photo, zooms in when you look |
| `file-lock` | breathe | shake | `file`, `lock`, `unlock` | jiggles like a locked door when you try to open it |
| `file-minus` | breathe | jelly | `file-plus`, `file` | squashes softly as a file is taken out |
| `file-pdf` | float | pop | `download`, `file` | floats like a ready-to-print page |
| `file-plus` | pulse | pop | `file-check`, `file` | pops a new file into being |
| `file-search` | tilt | tilt | `search`, `file-check` | tilts like it is scanning the page |
| `file-spreadsheet` | fill | pop | `file`, `download` | fills in like rows of data loading |
| `file-text` | type | draw | `file`, `file-check` | writes itself line by line |
| `file-up` | rise | nudge | `file-check`, `file-down`, `upload` | lifts gently, like a file heading up to the cloud |
| `file-video` | pulse | pop | `play`, `file` | pulses like a video ready to play |
| `file-x` | breathe | shake | `file-check`, `file`, `file-x@solid` | shakes no when a file is rejected |
| `file` | float | pop | `file-plus`, `file-check`, `files` | floats like a fresh page, pops when picked |
| `files` | float | pop | `copy`, `file` | floats like a stack of papers, pops when picked |
| `film` | pass | flip | `video-camera`, `image` | film strip rolls past like a movie reel |
| `filter` | drop | nod | `sort`, `filter@solid`, `sliders` | sifts items down through the funnel |
| `fingerprint` | glow | draw | `unlock`, `shield-check` | glows like a sensor reading your fingerprint |
| `fish` | sway | nudge | `fish@solid` | swishes its tail as it swims along |
| `flag` | sway | sway | `flag@solid` | sways in the wind from the foot of its pole |
| `flame` | flicker | sway | `flame@solid` | flickers and dances like a real flame |
| `flask-conical` | rock | wiggle | `flask-conical@solid` | swirls the liquid like a reaction is brewing |
| `flower` | breathe | spin-once | `flower@solid`, `sprout` | breathes softly like a bloom opening, twirls when touched |
| `folder-minus` | breathe | jelly | `folder-plus`, `folder` | squashes softly as a folder is removed or collapsed |
| `folder-open` | float | bounce | `folder` | hovers open, bounces as you browse inside |
| `folder-plus` | pulse | pop | `folder`, `check` | gently pulses, pops when you create a folder |
| `folder-search` | tilt | tilt | `folder-open`, `search`, `folder` | tilts its lens, looking through the folder |
| `folder` | breathe | jelly | `folder-open`, `folder-plus`, `folder@solid` | rests calmly, squishes open when you point at it |
| `football` | spin | bounce | `football@solid`, `trophy` | rolls slowly like a ball in play, bounces when kicked |
| `forward` | nudge | nudge | `reply`, `send`, `check` | pushes ahead to the right like a message passed along |
| `frown` | breathe | nod | `smile`, `meh`, `frown@solid` | sighs slowly, then droops its head when you point at it |
| `fuel` | fill | wiggle | `battery-charging`, `droplet`, `fuel@solid` | fills up like a tank being refuelled |
| `gallery-horizontal` | pass | nudge | `images`, `layout-grid`, `image` | slides sideways like a carousel moving to the next slide |
| `gamepad` | rock | wiggle | `trophy`, `play`, `gamepad@solid` | jiggles in your hands like a game in play |
| `gauge` | rock | tilt |  | needle sways across the dial like a live reading |
| `gem` | twinkle | flip | `gem@solid`, `crown` | sparkles softly, then turns to flash its facets on hover |
| `gift` | rock | tada | `gift@solid`, `check-circle`, `package` | rocks with excitement, a present waiting to be opened |
| `git-branch` | draw | draw | `git-merge`, `git-pull-request` | draws the branch forking off the main line |
| `git-commit` | pulse | pop | `check-circle`, `git-branch` | pulses like a new commit landing on the line |
| `git-merge` | draw | nudge | `git-pull-request`, `check-circle`, `git-branch` | draws two branches coming together into one |
| `git-pull-request` | draw | nudge | `git-merge`, `git-branch`, `check-circle` | sends changes back toward the main line |
| `globe` | spin | spin-once | `language`, `map` | turns slowly like the world spinning |
| `graduation-cap` | float | tada | `graduation-cap@solid` | bobs proudly, then gets tossed in celebration |
| `hammer` | rock | wiggle | `wrench` | swings from the handle like it's tapping a nail |
| `hand-coins` | float | nudge | `coins`, `banknote`, `wallet`, `hand-heart` | offers up a coin, a payment on its way |
| `hand-heart` | beat | beat | `hand-heart@solid`, `heart`, `hand-coins` | the heart beats softly in an open, caring hand |
| `handshake` | nod | nod | `handshake@solid`, `check`, `hand-heart` | the hands pump up and down, sealing the deal |
| `hard-drive` | type | jelly | `save`, `database`, `server` | hums softly while reading and writing data |
| `hash` | sway | wiggle | `at-sign`, `tag` | wiggles like a fresh tag being added |
| `heading` | breathe | pop | `type`, `bold` | stands up tall like a title on the page |
| `headphones` | beat | jelly | `music-note`, `volume-off`, `headset`, `headphones@solid` | bops along to the beat of the music |
| `headset` | float | tilt | `headphones`, `phone-call` | bobs gently while a support call is live |
| `heart-crack` | breathe | shake | `heart`, `heart-crack@solid` | aches with a slow, heavy breath, then shudders as it breaks |
| `heart-pulse` | beat | beat | `heart`, `activity`, `heart-pulse@solid` | beats steadily like a healthy heart |
| `heart` | beat | beat | `heart@solid`, `heart-pulse` | beats like a heart full of love |
| `help-circle` | tilt | wiggle | `info-circle`, `check-circle` | question mark tilts curiously, asking if you need help |
| `hexagon` | spin | spin-once | `hexagon@solid` | turns slowly like a nut or a honeycomb cell |
| `highlighter` | sway | wiggle | `eraser`, `pencil`, `highlighter@solid` | swipes its tip back and forth as if marking a line of text |
| `history` | rock | spin-once | `clock`, `undo`, `rotate-ccw` | winds back like rewinding time |
| `home` | breathe | pop | `home@solid` | settles in with a soft welcoming bounce |
| `hospital` | glow | pop | `hospital@solid`, `building` | glows softly like a beacon of care, pops when pointed at |
| `hotel` | breathe | pop | `bed`, `building` | breathes softly like a guest asleep inside |
| `hourglass` | rock | spin-once | `check`, `loader`, `timer` | rocks and turns over while you wait, like sand running out |
| `ice-cream` | sway | jelly |  | sways gently from the cone tip, like a treat held in hand |
| `id-card` | float | flip | `user-check`, `shield-check` | flips over like a card being shown at the door |
| `image-plus` | pulse | pop | `image`, `check` | pops softly, inviting you to add a picture |
| `image` | breathe | zoom | `image-plus`, `film` | picture gently zooms in like a photo coming into focus |
| `images` | float | tilt | `image`, `gallery-horizontal`, `image-plus`, `images@solid` | drifts softly like a stack of photos |
| `inbox` | drop | bounce | `mail`, `check` | new mail drops softly into the tray |
| `indent-decrease` | nudge | nudge | `indent-increase`, `align-left` | pulls the lines back out, one tab to the left |
| `indent-increase` | nudge | nudge | `indent-decrease`, `align-left` | pushes the lines inward, one tab to the right |
| `indian-rupee` | flip | tada | `dollar-sign`, `euro`, `pound-sterling`, `coins` | spins like a rupee coin, money changing hands |
| `info-circle` | pulse | pop | `help-circle`, `x-circle` | gently pulses to draw your eye to a helpful note |
| `italic` | tilt | tilt | `bold`, `underline`, `type` | leans over like text turning italic |
| `kanban` | breathe | jelly | `columns`, `layout-grid`, `table` | the board breathes calmly, then bounces like a moved card |
| `key` | sway | nudge | `unlock`, `lock` | sways from its ring and slides in like entering a lock |
| `keyboard` | type | type | `type`, `terminal`, `keyboard@solid` | jitters softly like keys being typed |
| `lamp` | glow | flicker | `lamp@solid`, `lightbulb`, `moon` | glows warmly like a reading lamp switched on |
| `landmark` | breathe | pop | `building`, `banknote` | stands steady and calm like a trusted bank |
| `language` | breathe | flip | `globe`, `message-circle` | flips between scripts like a word being translated |
| `laptop` | breathe | nod | `monitor`, `tablet`, `smartphone`, `laptop@solid` | glows softly like a screen waking up |
| `laugh` | jelly | tada | `smile`, `laugh@solid` | giggles with a happy wobble, then bursts out laughing on hover |
| `layers` | float | bounce | `layers@solid`, `files` | the stack floats like sheets settling on each other |
| `layout-dashboard` | breathe | pop | `layout-grid`, `layout-list`, `kanban` | panels breathe gently, then pop like a refreshed dashboard |
| `layout-grid` | breathe | pop | `layout-list`, `layout-dashboard`, `kanban` | tiles breathe calmly, then pop into a grid view |
| `layout-list` | breathe | pop | `layout-grid`, `list`, `table` | rows breathe calmly, then pop into a list view |
| `layout-template` | jelly | jelly | `layout-dashboard`, `layout-grid`, `layout-list` | blocks settle into place like a page being laid out |
| `leaf` | sway | sway | `leaf@solid` | sways from its stem like a leaf in a breeze |
| `library` | rock | tilt | `book-open`, `book` | the leaning book rocks on the shelf as if being pulled out |
| `lightbulb` | glow | glow | `lightbulb@solid` | glows softly, like an idea switching on |
| `link` | rock | jelly | `unlink`, `check` | rocks gently, snaps together on hover |
| `list-checks` | nod | draw | `list`, `list-ordered`, `check-square` | ticks off tasks like a to-do list getting done |
| `list-filter` | nudge | nudge | `filter`, `list` | sifts downward, narrowing a long list to what you need |
| `list-music` | sway | wiggle | `list`, `music-note` | the music note sways gently to the beat of the playlist |
| `list-ordered` | nudge | nod | `list`, `list-checks` | steps down its numbered items one by one |
| `list-plus` | pulse | pop | `list-checks`, `list` | the plus pops in, adding one more item to the list |
| `list` | fill | draw | `list-checks`, `list-ordered` | lines fill in like items loading into the list |
| `loader` | tick | spin-once | `check`, `check-circle`, `x-circle` | spins step by step while something loads |
| `lock` | breathe | shake | `unlock`, `lock@solid` | rests calmly, then shakes when access is denied |
| `log-in` | nudge | pass | `log-out`, `user-check` | steps through the door like someone signing in |
| `log-out` | nudge | pass | `log-in`, `user-x` | steps out the door like someone signing out |
| `luggage` | rock | pass | `backpack`, `briefcase` | rocks on its wheels, then rolls off on a trip |
| `mail-check` | breathe | nod | `mail`, `mail-open`, `mail-check@solid` | breathes calmly like mail that's done, nods yes on hover |
| `mail-open` | breathe | pop | `mail` | breathes softly as a read letter, pops when opened |
| `mail` | float | wiggle | `mail-open`, `send`, `check` | floats like a letter on its way, wiggles when new |
| `map-pin` | bounce | bounce | `map-pin@solid`, `navigation` | drops onto the map and settles on its point |
| `map` | breathe | flip | `map-pin`, `route`, `compass` | unfolds and settles like a paper map |
| `maximize` | zoom | zoom | `minimize`, `zoom-in` | grows outward like a window going fullscreen |
| `medal` | sway | tada | `medal@solid`, `trophy`, `award` | swings gently from its ribbon, then celebrates a win |
| `megaphone` | pulse | wiggle | `bell-ring`, `volume-off` | pulses like it's announcing, kicks back when you shout |
| `meh` | blink | tilt | `smile`, `frown`, `meh@solid` | blinks blankly, then gives an unimpressed little shrug |
| `menu` | breathe | jelly | `close`, `sidebar` | bars wobble softly, ready to open navigation |
| `message-circle-more` | type | jelly | `message-circle`, `check`, `message-circle-more@solid` | jitters like someone typing, wobbles from its tail on hover |
| `message-circle` | breathe | jelly | `messages`, `message-circle@solid` | breathes like a chat waiting, jiggles on a new message |
| `message-square-text` | type | pop | `message-square`, `message-square-text@solid`, `check` | quivers like text being typed, pops from its tail on hover |
| `message-square` | breathe | pop | `messages`, `message-square@solid`, `check` | breathes like a comment waiting, pops from its tail |
| `messages` | float | jelly | `message-circle`, `message-square` | bubbles bob like a lively conversation |
| `microphone-off` | breathe | shake | `microphone` | stays quiet with a small shake: you are muted |
| `microphone` | pulse | pop | `microphone-off`, `stop`, `microphone@solid` | pulses like it is picking up your voice |
| `microscope` | tilt | nod | `microscope@solid` | nods down to focus on the sample |
| `minimize` | breathe | pop | `maximize`, `zoom-out` | draws inward like a window leaving fullscreen |
| `minus-circle` | breathe | pop | `plus-circle`, `x-circle`, `minus-circle@solid` | breathes softly, pops when you remove an item |
| `minus` | breathe | pop | `plus` | breathes softly, pops when something is taken away |
| `monitor` | breathe | zoom | `laptop`, `tv`, `smartphone`, `monitor@solid` | glows softly like a screen that is on |
| `moon` | breathe | tilt | `sun`, `moon@solid` | glows softly like a calm night sky |
| `more-horizontal` | type | jelly | `more-vertical`, `close` | dots ripple like more is waiting |
| `more-vertical` | type | jelly | `more-horizontal`, `close` | dots ripple like more options are waiting |
| `motorcycle` | nudge | tilt | `car`, `truck`, `motorcycle@solid` | revs in place, then pops a wheelie on hover |
| `mountain` | breathe | pop | `flag` | stands still and calm, pops on hover |
| `mouse` | float | nod | `cursor`, `keyboard`, `mouse@solid` | clicks and glides like it is being moved |
| `move` | orbit | zoom | `drag-handle` | drifts in a small circle, ready to be dragged anywhere |
| `music-note` | sway | bounce | `volume`, `play` | bops along to the beat of a song |
| `navigation` | nudge | pass | `map-pin`, `compass` | heads forward toward where you are going |
| `network` | pulse | nod | `router`, `server`, `globe` | pulses from the hub out to every connected device |
| `newspaper` | float | nudge | `file-text`, `newspaper@solid` | slides in like the morning paper landing on the doorstep |
| `notebook` | rock | flip | `book-open`, `notepad-text`, `notebook@solid` | rocks gently on its spine, ready for new notes |
| `notepad-text` | type | wiggle | `sticky-note`, `pencil`, `notepad-text@solid` | jitters softly like notes being typed out |
| `package-open` | float | bounce | `package`, `package-open@solid` | bobs gently like a freshly opened box |
| `package` | bounce | bounce | `check-circle`, `truck`, `package@solid` | bounces softly like a parcel being delivered |
| `paintbrush` | sway | wiggle | `palette`, `pencil` | sweeps gently like it's painting a stroke |
| `palette` | rock | jelly | `paintbrush`, `palette@solid` | sways softly like a palette in an artist's hand |
| `palm-tree` | sway | sway | `palm-tree@solid`, `sun` | sways in a warm island breeze |
| `panel-bottom` | nudge | nudge | `panel-right`, `layout-list`, `panel-bottom@solid` | eases down toward its bottom pane like a sheet rising into view |
| `panel-left-close` | nudge | nudge | `panel-left-open`, `sidebar`, `chevron-left` | pulls left to fold the sidebar away |
| `panel-left-open` | nudge | nudge | `panel-left-close`, `sidebar`, `chevron-right` | pushes right to slide the sidebar open |
| `panel-right` | nudge | nudge | `sidebar`, `columns`, `panel-right@solid` | eases toward its right pane like a details drawer sliding in |
| `paperclip` | sway | wiggle | `link`, `check` | sways like a clip on a page, wiggles to attach |
| `parking` | pulse | pop | `car`, `map-pin`, `parking@solid` | pulses softly like a sign showing a free space |
| `party-popper` | rock | tada | `party-popper@solid`, `gift` | rocks with excitement, then pops a celebration when you point at it |
| `passport` | float | flip | `id-card`, `globe` | flips open at the border, then rests ready to travel |
| `paste` | float | bounce | `check`, `clipboard` | floats gently, the page lands with a bounce on hover |
| `pause` | breathe | pop | `play`, `stop` | bars breathe gently while playback rests |
| `paw-print` | bounce | pop | `paw-print@solid`, `heart` | pads along softly like a pet taking a step |
| `pen-tool` | sway | draw | `pencil` | the nib sways at its point, then draws a curve on hover |
| `pencil` | sway | wiggle | `eraser`, `check` | sways at its tip like it is about to write |
| `percent` | pulse | spin-once | `tag`, `dollar-sign` | pulses like a sale badge, turns on hover |
| `person-running` | float | nudge | `person-running@solid`, `timer`, `trophy` | bobs along at a steady jog, dashes forward on hover |
| `phone-call` | ring | wiggle | `phone-off`, `phone` | rings like an incoming call |
| `phone-incoming` | ring | nudge | `phone-call`, `phone-off`, `phone-missed` | rings gently like a call coming in, the arrow dips in on hover |
| `phone-missed` | pulse | shake | `phone-outgoing`, `phone-call` | pulses softly like a missed call waiting, shakes no on hover |
| `phone-off` | breathe | shake | `phone`, `phone-call` | rests quietly hung up, shakes no when you hover |
| `phone-outgoing` | nudge | nudge | `phone-call`, `phone-off` | leans out toward the arrow like a call heading out |
| `phone` | ring | wiggle | `phone-call`, `phone-off` | rocks softly like it's ringing, rattles when you hover |
| `picture-in-picture` | float | zoom | `maximize`, `minimize`, `monitor` | the screen gently drifts like a floating mini player |
| `piggy-bank` | breathe | bounce | `coins`, `wallet`, `piggy-bank@solid` | swells with savings, hops when a coin goes in |
| `pilcrow` | breathe | pop | `pilcrow@solid`, `type`, `wrap-text` | fades softly in and out like hidden marks being shown |
| `pill` | rock | wiggle | `pill@solid` | rocks gently, then rattles like a capsule in a bottle |
| `pin` | bounce | nudge | `pin@solid`, `map-pin` | presses in gently, like pinning a note to a board |
| `pizza` | rock | jelly | `pizza@solid`, `burger` | the slice tips gently from its point, then wobbles cheesily |
| `plane-landing` | nudge | bounce | `plane-takeoff`, `plane` | glides down toward the runway and touches down |
| `plane-takeoff` | nudge | pass | `plane-landing`, `plane` | climbs away from the runway on departure |
| `plane` | float | pass | `send` | cruises through the air and takes off on hover |
| `play` | pulse | nudge | `pause`, `stop` | pulses forward, ready to start playing |
| `plug` | nudge | nudge | `zap`, `battery-charging`, `puzzle-piece`, `plug@solid` | pushes up like it is plugging into the socket |
| `plus-circle` | breathe | pop | `minus-circle`, `check-circle`, `x-circle`, `plus-circle@solid` | swells softly, inviting you to add an item |
| `plus` | pulse | pop | `minus`, `close`, `check` | pops forward, ready to add something new |
| `podcast` | pulse | pop | `microphone`, `headphones`, `podcast@solid` | pulses like a show broadcasting live |
| `pound-sterling` | flip | tada | `euro`, `dollar-sign`, `indian-rupee`, `coins` | spins like a pound coin, money changing hands |
| `power` | glow | pop | `power@solid`, `toggle`, `check` | glows like a device switching on |
| `presentation` | draw | draw |  | the chart on the board draws itself like a live pitch |
| `printer` | type | nod | `file-text`, `check`, `printer@solid` | chugs gently like a page is printing |
| `puzzle-piece` | float | nudge | `puzzle-piece@solid` | floats, then snaps into place like a fitting piece |
| `qr-code` | breathe | zoom | `check`, `barcode`, `qr-code@solid` | glows softly, ready to be scanned |
| `quote` | float | tilt | `message-square`, `message-circle` | floats gently like a cited line of speech |
| `rabbit` | bounce | bounce | `turtle`, `rabbit@solid`, `egg` | hops up and down like a bouncy bunny |
| `radio` | pulse | wiggle | `music-note`, `podcast`, `radio@solid` | thumps gently like music playing from its speaker |
| `rainbow` | breathe | draw | `cloud-rain`, `rainbow@solid` | glows softly after the rain, arcs draw on when touched |
| `receipt` | float | draw | `check`, `file-text`, `receipt@solid` | floats gently, prints its lines on hover |
| `redo` | nudge | nudge | `undo` | leans forward, stepping the last action ahead again |
| `refresh` | spin | spin-once | `check`, `loader` | spins around to reload, one full turn on hover |
| `refrigerator` | breathe | shake | `snowflake`, `thermometer`, `refrigerator@solid` | hums quietly like a fridge keeping food cold |
| `remove-formatting` | breathe | shake | `type`, `eraser`, `bold` | shakes off its styling, back to plain text |
| `repeat-1` | spin | spin-once | `repeat`, `shuffle` | turns around and around like a song on repeat |
| `repeat` | spin | spin-once | `shuffle` | turns around again, playing on repeat |
| `reply-all` | nudge | nudge | `reply`, `forward`, `check` | sweeps back to the left like an answer sent to everyone |
| `reply` | nudge | nudge | `send`, `check` | swoops back to the left like an answer heading home |
| `rewind` | nudge | pass | `fast-forward`, `skip-back` | rushes back like scrubbing a video backward |
| `rocket` | nudge | pass | `rocket@solid` | hums on the launchpad, then blasts off up and away |
| `rotate-ccw` | rock | rock | `rotate-cw`, `undo` | rocks back and forth to undo the last turn |
| `rotate-cw` | spin | spin-once | `rotate-ccw`, `redo` | turns clockwise, one full spin on hover |
| `route` | draw | draw | `map-pin`, `map` | traces the path from start to finish |
| `router` | fill | jelly | `wifi`, `wifi-off`, `network` | status lights blink as the internet comes and goes |
| `rss` | fill | pulse | `wifi`, `bell-ring` | broadcasts waves outward like a live feed |
| `ruler` | nudge | nudge |  | slides along its edge like it's measuring |
| `salad` | sway | wiggle | `salad@solid`, `soup`, `leaf` | the leafy bowl sways fresh, then gets a quick toss |
| `save` | breathe | nod | `check`, `save@solid` | presses down like a save button being committed |
| `scale` | rock | tilt | `scale@solid` | rocks its beam gently like weighing two options |
| `scan-face` | pulse | zoom | `user-check`, `shield-check`, `smile` | pulses gently like a face scan in progress |
| `school` | sway | tada |  | the flag flutters gently over the school |
| `scissors` | nudge | wiggle | `paste` | snips about the blade pivot, cutting forward |
| `scroll-text` | float | zoom | `file-text`, `scroll-text@solid` | floats like an old parchment, unrolling its message |
| `search` | orbit | tilt | `close`, `zoom-in` | lens tilts and scans as if looking for something |
| `send` | nudge | pass | `check`, `mail` | flies off along its path like a message being sent |
| `server` | flicker | jelly | `database`, `cloud`, `cpu` | blinks its status lights like a busy server |
| `settings` | spin | spin-once | `settings@solid`, `sliders` | turns slowly like a working gear |
| `share-2` | nudge | nudge | `check`, `share`, `link` | the arrow lifts up out of the box, ready to share |
| `share` | breathe | nudge | `check`, `link` | sends a little push outward to people and apps |
| `shield-alert` | pulse | shake | `shield-check`, `shield` | pulses like a security warning that needs attention |
| `shield-check` | glow | draw | `shield-alert`, `shield`, `shield-check@solid` | glows softly and draws its tick to show you are protected |
| `shield-off` | flicker | shake | `shield`, `shield-check`, `shield-alert` | flickers weakly like protection that has been switched off |
| `shield-user` | breathe | nod | `shield-check`, `user-check`, `shield-user@solid` | breathes calmly to show the account is protected |
| `shield` | breathe | pop | `shield-check`, `shield-alert`, `shield@solid` | breathes calmly like a guard on duty |
| `ship` | rock | pass | `anchor`, `plane`, `ship@solid` | rocks on the waves, then sails off and back on hover |
| `shopping-bag` | sway | ring | `shopping-bag@solid`, `check`, `shopping-cart` | swings from its handle like a bag being carried |
| `shopping-basket` | bounce | bounce | `check`, `shopping-cart`, `shopping-bag`, `shopping-basket@solid` | hops softly as items drop into the basket |
| `shopping-cart-plus` | nudge | pop | `check`, `shopping-cart`, `shopping-cart-plus@solid` | rolls along, then pops as an item is added |
| `shopping-cart` | nudge | pass | `check`, `shopping-bag`, `shopping-cart@solid` | rolls forward, then zooms off on hover |
| `shuffle` | nudge | jelly | `repeat` | arrows cross and mix things up |
| `sidebar` | nudge | nudge | `columns`, `layout-dashboard`, `menu` | leans toward its rail like a panel sliding open |
| `signal` | fill | fill | `wifi`, `wifi-off` | bars fill up as the signal gets stronger |
| `signature` | draw | draw | `check`, `pen-tool` | the signature writes itself out, as if signed live |
| `signpost` | sway | rock | `map`, `route` | sways on its post while pointing the way |
| `siren` | glow | flicker | `bell-ring`, `shield-alert` | flashes its light like an alarm going off |
| `skip-back` | nudge | nudge | `skip-forward`, `rewind` | jumps back to the start of the previous track |
| `skip-forward` | nudge | pass | `skip-back`, `play` | jumps ahead to the next track |
| `sliders` | nudge | wiggle | `settings`, `filter`, `toggle` | knobs slide side to side like a setting being tuned |
| `smartphone` | wiggle | shake | `tablet`, `phone` | buzzes softly like a phone getting a message |
| `smile` | blink | jelly | `heart`, `smile@solid` | blinks and grins like a happy friend |
| `snowflake` | spin | spin-once | `sun`, `cloud-snow` | turns slowly like a snowflake drifting down |
| `sofa` | breathe | jelly | `bed`, `sofa@solid`, `home` | sinks softly like someone just sat down to relax |
| `sort` | nudge | nudge | `chevrons-up-down`, `filter` | nudges downward as the list reorders |
| `soup` | breathe | jelly | `soup@solid`, `salad`, `cooking-pot` | a warm bowl breathes out steam, then lifts like it is served |
| `sparkles` | twinkle | twinkle | `wand`, `sparkles@solid` | twinkles like a fresh bit of magic |
| `speaker` | beat | pulse | `volume-off`, `music-note`, `volume` | thumps gently to the beat, like music is playing |
| `sprout` | sway | zoom | `flower`, `leaf`, `sprout@solid` | sways from the soil and springs up as it grows |
| `square-minus` | breathe | pop | `square-plus`, `square`, `minus` | presses in gently, ready to remove or collapse |
| `square-plus` | pulse | pop | `square-minus`, `square-x`, `plus` | pops forward, ready to add a new item |
| `square-x` | breathe | shake | `square-plus`, `square`, `close` | shakes its head no, ready to close or cancel |
| `square` | pulse | pop | `check-square`, `square@solid`, `stop`, `circle` | pulses softly like a selectable box |
| `star-half` | twinkle | pop | `star@solid`, `star` | twinkles softly, halfway to a full rating |
| `star` | twinkle | pop | `star@solid` | twinkles like a little star in the night sky |
| `stethoscope` | sway | beat | `heart-pulse`, `stethoscope@solid` | swings from the earpieces, then thumps like it hears a heartbeat |
| `sticky-note` | sway | wiggle | `check`, `sticky-note@solid` | flutters from its top edge like a stuck-on note |
| `stop` | pulse | pop | `play`, `pause` | pulses softly while something runs, stops with a firm tap |
| `store` | breathe | jelly | `store@solid`, `building`, `shopping-bag` | breathes calmly like a shop open for business |
| `strikethrough` | breathe | draw | `underline`, `bold`, `eraser` | strikes a line through text marked as done |
| `subscript` | nudge | bounce | `superscript`, `type` | dips down below the line, like the 2 in H2O |
| `sun-moon` | rock | spin-once | `moon`, `sun`, `sun-moon@solid` | rocks between day and night, turns over when touched |
| `sun` | spin | glow | `moon`, `cloud-sun`, `sun@solid` | rays turn slowly as the sun shines |
| `sunrise` | glow | nudge | `sunset`, `sun` | warms with morning light and lifts up when touched |
| `sunset` | glow | nudge | `sunrise`, `moon` | glows like golden hour and sinks down when touched |
| `superscript` | float | nudge | `subscript`, `type` | lifts up above the line, like a power or footnote |
| `swap` | flip | flip | `repeat`, `shuffle` | flips over to trade places, back and forth |
| `syringe` | nudge | nudge | `syringe@solid`, `pill` | pushes forward along its needle like giving a shot |
| `table` | breathe | pop | `layout-grid`, `columns`, `layout-list` | breathes gently like a grid of data refreshing |
| `tablet` | float | tilt | `smartphone`, `laptop` | floats gently, then tilts like it is being picked up |
| `tag` | sway | ring | `tag@solid`, `percent`, `check` | swings from its hole like a price tag on a shelf |
| `target` | pulse | zoom | `crosshair`, `check-circle` | pulses like a goal in focus, then locks on |
| `taxi` | nudge | pass | `car`, `map-pin`, `taxi@solid` | idles at the kerb, then drives off and comes back on hover |
| `telescope` | tilt | tilt |  | scans the sky, tilting on its tripod |
| `tennis` | rock | ring | `tennis@solid`, `trophy` | swings the racket from its handle like a forehand |
| `tent` | sway | jelly | `mountain` | canvas sways in a light breeze at camp |
| `terminal` | type | type | `code` | jitters like keys being typed at the prompt |
| `text-cursor-input` | type | type | `type` | twitches like keystrokes landing in the field as you type |
| `thermometer` | fill | nudge | `snowflake`, `sun` | reading rises and falls like a changing temperature |
| `thumbs-down` | rock | nudge | `thumbs-down@solid`, `thumbs-up` | gives a little shake of disapproval |
| `thumbs-up` | rock | nudge | `thumbs-up@solid`, `thumbs-down` | gives an approving nod and a little lift |
| `ticket` | float | jelly | `check-circle`, `ticket@solid` | floats gently, wobbles like a ticket being punched |
| `timer` | pulse | ring | `clock`, `alarm-clock`, `check`, `timer@solid` | pulses like a stopwatch counting down |
| `toggle` | jelly | jelly | `toggle@solid`, `sliders` | squishes like a switch being flipped |
| `toilet` | breathe | jelly | `bath`, `droplet`, `toilet@solid` | wobbles softly on its base, like a flush just finished |
| `tooth` | twinkle | jelly | `smile`, `sparkles`, `tooth@solid` | sparkles like a freshly cleaned tooth |
| `traffic-cone` | rock | wiggle | `alert-triangle`, `ban`, `traffic-cone@solid` | wobbles on its base, a calm under-construction sign |
| `train` | shake | zoom | `bus`, `plane`, `train@solid` | rumbles gently on the rails, then pulls into the station on hover |
| `trash` | rock | wiggle | `check`, `trash@solid` | rocks on its base, then wiggles like it is being emptied |
| `tree-pine` | sway | sway | `tree-pine@solid` | sways gently from its trunk like a pine in the wind |
| `trending-down` | nudge | draw | `trending-up` | line dips down and to the right, showing a drop |
| `trending-up` | nudge | draw | `trending-down` | line climbs up and to the right, showing growth |
| `triangle` | breathe | spin-once | `play`, `triangle@solid` | breathes calmly, then spins round on its centre |
| `trophy` | glow | tada | `trophy@solid`, `award` | shines with pride, then celebrates a win |
| `truck` | nudge | pass | `package`, `check-circle`, `map-pin` | rolls along the road, drives off on hover |
| `turtle` | rock | nudge | `rabbit`, `turtle@solid` | plods along slowly and steadily, side to side |
| `tv` | flicker | jelly | `monitor`, `film` | screen flickers softly like a TV that is on |
| `type` | type | type | `heading`, `keyboard`, `bold` | jitters softly like text being typed |
| `umbrella` | sway | jelly | `cloud-rain`, `umbrella@solid` | sways gently from the handle as if held in the rain |
| `underline` | float | draw | `strikethrough`, `italic`, `bold` | draws its underline beneath the letter |
| `undo` | nudge | nudge | `redo` | leans back, stepping the last action back |
| `unlink` | breathe | shake | `link` | shudders as the two links come apart |
| `unlock` | float | pop | `lock`, `key` | floats gently with its shackle open |
| `upload` | rise | nudge | `check`, `download`, `cloud-upload` | lifts upward, sending a file out of the tray |
| `usb` | nudge | nudge | `plug`, `check` | plugs in: slides up into the port and back |
| `user-check` | breathe | nod | `user`, `user-x`, `user-minus` | nods yes like a member just approved |
| `user-circle` | breathe | pop | `user`, `log-out` | breathes softly like an avatar waiting for you |
| `user-cog` | breathe | wiggle | `settings`, `user`, `user-check` | the little gear turns as if settings are being adjusted |
| `user-minus` | breathe | shake | `user-plus`, `user` | shakes off a member like an unfollow |
| `user-pen` | wiggle | wiggle | `user-check`, `pencil`, `user` | the pen scribbles as if profile details are being edited |
| `user-plus` | pulse | pop | `user-check`, `user-minus`, `users` | pops in like a new friend joining |
| `user-search` | tilt | tilt | `user-check`, `search`, `users` | leans in with the lens, looking for someone |
| `user-x` | breathe | shake | `user-check`, `user` | shakes no like access was refused |
| `user` | breathe | nod | `user-check`, `user-plus`, `user-circle`, `users` | nods hello like a person saying hi |
| `users` | sway | jelly | `user`, `user-plus` | sways together like a friendly group |
| `utensils` | rock | wiggle | `utensils@solid`, `chef-hat` | fork and knife rock gently, ready for the next meal |
| `video-call` | pulse | jelly | `video-camera`, `phone`, `phone-off` | pulses gently like a call that is live |
| `video-camera` | pulse | tilt | `camera`, `video-call` | records with a steady pulse like a live camera |
| `video-off` | breathe | shake | `video-camera`, `eye-off`, `microphone-off` | dims quietly while the camera is off |
| `volleyball` | spin | nudge | `volleyball@solid`, `trophy` | spins slowly through the air, pops up like a bump |
| `volume-1` | fill | pulse | `volume`, `volume-off` | a soft sound wave hums out of the speaker |
| `volume-off` | breathe | shake | `volume` | sits quietly muted, shakes its head when touched |
| `volume` | fill | pulse | `volume-off` | sound waves swell out from the speaker |
| `wallet` | breathe | pop | `wallet@solid`, `credit-card`, `coins` | breathes calmly, pops open on hover |
| `wand` | sway | wiggle | `sparkles`, `wand@solid` | waves from the handle to cast a sparkle |
| `warehouse` | breathe | jelly | `store`, `package`, `warehouse@solid` | breathes slowly like a busy storage depot |
| `washing-machine` | type | shake | `droplet`, `check`, `washing-machine@solid` | rumbles on its feet like a wash cycle running |
| `watch` | pulse | tilt | `clock`, `timer` | ticks along with each second, tilts like a glance at the wrist |
| `webcam` | sway | zoom | `camera-off`, `video-off`, `video-camera` | looks around on its stand, ready for a video call |
| `webhook` | spin | spin-once | `link` | slowly circles its three hooks like events flowing round |
| `wifi-off` | flicker | shake | `wifi`, `signal` | flickers like a connection that keeps dropping |
| `wifi` | fill | fill | `wifi-off`, `signal` | arcs light up from the dot like a signal reaching you |
| `wind` | nudge | pass | `cloud`, `leaf` | streams to the right like a passing breeze |
| `wine` | rock | tilt |  | swirls gently on its stem, then tips for a toast |
| `wrap-text` | nudge | draw | `align-left`, `corner-down-left`, `pilcrow` | rolls the long line around and down onto the next row |
| `wrench` | rock | wiggle | `settings`, `hammer` | turns about the bolt in its jaw like tightening a nut |
| `x-circle` | pulse | shake | `check-circle`, `alert-circle` | shakes no to say something went wrong |
| `zap` | flicker | flicker | `zap@solid`, `battery-charging` | flickers with crackling electric energy |
| `zoom-in` | zoom | zoom | `zoom-out`, `search`, `maximize` | magnifies, as if zooming into the details |
| `zoom-out` | zoom | zoom | `zoom-in`, `search`, `minimize` | pulls back, as if zooming out to see more |
<!-- motion:end -->
