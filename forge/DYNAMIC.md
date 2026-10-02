# with icons — Live icons (editable content)

A separate set of up to **50 "live" icons** whose content changes: the date on a calendar, the time on a clock,
the number on a notification badge, the text on a label, the temperature on a weather icon, the level of a battery.
They are **not** static skeletons. Each is a small **generator** that turns parameters into a normal skeleton
(`paths` with plates K/A/S, `fills`, `cutouts` — exactly the format in `forge/CONTRACT.md`), so **every style renderer
draws them unchanged**: a live calendar works in line, solid, duo, gloss, … retro, luxe, bauhaus and skeuo automatically.

Text is drawn with the with-icons **stroke font** (`forge/dynamic/_font.mjs`): centreline glyphs that become ordinary
skeleton paths (and optional cutouts), so text gets each style's look, needs no font files and renders everywhere.

## Generator: `forge/dynamic/<name>.mjs`

```js
import { text, fitText } from './_font.mjs'      // the stroke font + layout helpers
import { calendarFrame } from './_parts.mjs'     // shared live parts (optional)
export default {
  name: 'calendar-date', title: 'Calendar date', category: 'time',
  description: 'A calendar page showing a month and a day you choose.',
  aliases: ['date', 'day-of-month', 'calendar-day-number'], tags: ['calendar', 'date', 'schedule'],
  synonyms: ['today', 'due date', 'event date'],
  params: {
    day:   { type: 'int',  min: 1, max: 31, default: 17, label: 'Day' },
    month: { type: 'enum', options: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'], default: 'MAR', label: 'Month' },
  },
  examples: [{ day: 1, month: 'JAN' }, { day: 31, month: 'DEC' }, { day: 8, month: 'MAY' }],   // 3-6, used by checks, previews, static fallbacks
  build(p) { return { paths: [...], fills: [...], cutouts: [...] } },   // pure + deterministic; never throws for valid params
}
```

### Param types

| type | fields | notes |
|---|---|---|
| `int` | `min`, `max`, `default`, `step?` | numbers drawn with the font |
| `number` | `min`, `max`, `default`, `step` | decimals allowed |
| `level` | `default` (0–1), `steps?` | a fill/needle/ring amount (battery, signal, progress) |
| `time` | `default` `"HH:MM"` | clocks place hands from it |
| `enum` | `options[]`, `default` | e.g. weather condition, month, weekday |
| `text` | `maxLength` (≤ 4), `default`, `case: 'upper'` | only the font's charset; longer input is clipped |
| `bool` | `default` | e.g. charging bolt on/off |

Every param has a plain-language `label`. Defaults must make a great-looking icon.

### Rules
- Same geometry rules as static icons: 24 grid, live area [2,22], snap to 0.25 for text/hands (0.5 elsewhere), keylines,
  clearance, shared parts. Frames reuse `forge/PARTS.md` coordinates where a static sibling exists (calendar, bell, battery…).
- **Legibility first**: text is at most 4 characters; the font has a *large* size (cap height ~7u, up to 2–3 chars) and a
  *small* size (cap height ~4.5u, up to 3–4 chars, drawn with tighter tracking). `fitText` picks the size and shrinks to the box.
  Text that would be illegible at 24px is not allowed — the generator must fall back (e.g. "99+" for counts over 99).
- Put text on plate **A** (or **S** for badges) and, inside filled frames, also add it to `cutouts` (open subpaths) so solid/duo/
  gloss/etc. show it knocked out of the mass.
- Deterministic and pure. No `Math.random`, no dates (a "today" calendar is the runtime's job, not the generator's).
- Fast: `build()` < 5 ms.

## Runtime and packages
- `@withicons/dynamic` (packages/dynamic, emitter `forge/lib/emit-dynamic.mjs`) bundles the generators + font + kernel +
  every style renderer: `render(name, params, style, { size, color, vars }) -> svg string`, `list()`, `paramsOf(name)`;
  a `<with-live-icon name="calendar-date" day="17" month="MAR" variant="kawaii">` element; React/Vue wrappers.
- Website: `site/vendor/dynamic/dynamic.js` (classic script, `window.WithLive`) and the Live icons pages.
- Static fallbacks: every generator's `examples` are pre-rendered into all styles for SEO pages and previews.

## Tools
```bash
node forge/tools/check-dynamic.mjs [names]        # validate generators: params, examples, every style renders, timing
node forge/tools/preview-dynamic.mjs calendar-date --styles line,solid,kawaii --size 64 [--small] [--dark] [--params '{"day":9}']
```
