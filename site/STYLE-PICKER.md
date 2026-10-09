# Choosing a style: the low-cognitive-load contract

with icons has 34 styles (the count is data; never hard-code it). Most visitors need one. Every page that lets people pick or browse styles follows this contract,
so choosing feels the same everywhere and nobody faces a wall of options.

## Principles

1. **Few choices first, everything one step away.** Show a short row (the current style, then `FEATURED`, then
   recently used; at most 8 tiles on desktop, 5 on phones) and one clear button, "All N styles" (count from data),
   that opens the full picker. Never lay them all out flat in a primary toolbar.
2. **Group by what people make, not by art terms.** Six groups from `WI.GROUPS` (site/js/site.js):
   Essentials, Product & brand, 3D & glass, Playful, Artistic, Holidays. Each has a one-line blurb. At most 7 styles per group.
3. **Help people choose.** "What are you making?" (`WI.USES`): picking a job (an app, slides, a SaaS landing page,
   an AI product, something premium, something playful, print, a festival or seasonal campaign) highlights its 4 best styles, best first.
4. **Show, don't name.** Every style tile shows the icon the visitor is looking at (or a sample icon) drawn in that style,
   with the style name under it. A one-line "good for" appears on hover/focus and in the full picker.
5. **Remember.** The last style picked (localStorage `with-style`, shared by every page) and up to 4 recently used
   styles (`with-style-recent`) come first next time.
6. **Calm visuals.** No rainbow of group colours, no badges on everything: one small "New" mark for `WI.NEW_STYLES`
   (a dot in the compact row, a small yellow "New" tag on the full picker's tiles), one ink ring + check for the selected tile.
   The only style colour is a faint glow on the hovered tile. Generous spacing, 44 px touch targets, keyboard and screen-reader friendly.

## The shared component: `site/js/style-picker.js` + `site/css/style-picker.css`

Loaded by every page that picks a style (after site.js). API on `window.WI.stylePicker`:

```js
// The compact row. Renders into `el`; returns { set(style), setIcon(name), destroy() }.
WI.stylePicker.row(el, {
  current: 'line',            // selected style
  icon: 'home',               // icon drawn in each tile (string name), or null for each style's sample icon
  styles: ['clay', 'soft3d'],     // optional preferred styles: the row fills current + styles + recent + FEATURED (deduped, capped at max)
  onPick: function (style) {}, // called on tile click or from the full picker
  max: 8,                      // tiles before "All styles" (phones use min(max, 5))
  size: 32,                    // tile icon px
  label: 'Style',              // accessible group label
  title: 'Choose a style',     // optional: the full picker's heading when "All N styles" opens it
  actions: [{ id, label, hint, pressed }], onAction: function (id) {} // optional footer buttons in the full picker (array or function)
})
// The full picker: a centred modal on desktop (it grows out of `anchor`), a full-height sheet on phones.
// Returns a promise of the picked style or null (the promise also has .close()).
WI.stylePicker.open({ current, icon, anchor, onPick, title, actions, onAction })
WI.stylePicker.remember(style)   // store as last + recent (call when a style is applied elsewhere)
WI.stylePicker.recent()          // [style, ...] most recent first
WI.stylePicker.groupOf(style)    // { id, title, blurb }
WI.stylePicker.drawTile(style, icon, size) // markup of one tile icon (uses WI.svg / lazy style data; skeleton until loaded)
```

The full picker (`role="dialog"`, `aria-modal`, labelled by its title, described by "N styles · each tile shows …"):

- **Header:** the title (`title` option), what the tiles show, the search field ("Search styles: glass, 3D, cute…";
  matches names, blurbs, "good for" text and search words; Enter picks the first hit), Close.
- **Group rail** (desktop, left) / **group tabs** (phones, a sticky strip under the search): Recent, Popular, then the
  six groups with counts. Scroll-spied: the section in view is lit; clicking jumps there. While searching, empty
  groups step aside and the counts show the hits.
- **The list:** "What are you making?" chips, Recent (`with-style-recent`), Popular (`FEATURED`; replaced by
  "Best for …" when a chip is on, best first, and the four are ringed in their groups), then the six groups, each with
  its title, count and one-line blurb over a grid of big tiles (the icon at 60 px on desktop, 44 px on phones,
  8 per row on desktop so no group wraps).
- **Footer** (desktop): the hovered / focused style in words (name, group, good for) + keyboard hints, and the
  caller's `actions` (shown on phones too, full width).

Keyboard: focus starts in the search (desktop) or on the panel (phones). Tab order: search, Close, rail (one stop,
arrows move and jump), tiles (one stop, arrows move in 2-D, Home/End, ArrowUp from the top row returns to the
search), actions; Tab is trapped inside, Escape clears the search first, then closes and returns focus to the opener.
Motion: the scrim fades and the panel rises and scales in from the opener (sheet slides up on phones; drag its header
down to close); reduced motion gets a plain fade. Speed: the panel opens with plain drawings at once; rich (gradient)
styles draw as their tiles scroll into view, every copy with its own gradient ids (`WI.uniqIds`); tiles have fixed
sizes and skeletons, so nothing shifts while drawings land. The page behind does not scroll.

## Where it is used

| page | what the visitor sees |
|---|---|
| Library (icons.html) | the compact row in the toolbar instead of the long style rail; "All styles" opens the picker; compare mode stays available inside the picker ("Compare all") |
| Icon pages | the compact row in the hero instead of the all-styles grid; the "All N styles" section further down shows every style grouped by the groups with a use filter |
| Studio (editor) | the same compact row + picker for its style control |
| Home | the styles showcase organised by the groups as tabs, with "What are you making?" up front |
| Style hubs and styles index | grouped by the groups, with "What are you making?" |
| Live icons, free landers, guides | the compact row wherever a style is chosen; landers show only the styles that matter for that page plus "All styles" |
