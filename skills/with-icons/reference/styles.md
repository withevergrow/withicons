# with icons: the 7 styles

All styles render the same 300 skeletons, so `home` looks like the same house in every style. Everything is
single-colour `currentColor` unless you opt into the CSS variables below.

| style | kind | look | use it for | min size | `strokeWidth` |
|---|---|---|---|---|---|
| `line` | universal | precise 1.75px outline, round caps/joins | default UI: nav, buttons, inputs, tables, menus | 14px | yes |
| `solid` | universal | filled mass with crisp knockouts | active/selected states, dense or tiny UI, mobile tab bars | 12px | no |
| `duo` | universal | line over a soft tonal fill (`--with-duo`) | friendly dashboards, cards, onboarding, settings pages | 18px | yes |
| `gloss` | creative | inflated, glossy, pillowy, carved highlights | hero art, app-store style feature grids, playful brands | 32px | no |
| `engrave` | creative | banknote intaglio hatching | finance, legal, premium, editorial, certificates | 40px | no |
| `blueprint` | creative | drafting lines, centre lines, nodes (`--with-accent`) | docs, developer tools, engineering, "how it works" | 32px | yes |
| `sketch` | creative | loose double marker strokes, light hachure | whiteboards, education, empty states, informal products | 32px | yes |

## Choosing

1. Building application UI? Use **line**. Need emphasis or an "on" state? Use **solid** for that one icon.
2. Want warmth without leaving the UI family? Use **duo**, and tint it to the brand: `style="--with-duo: #fde68a"`.
3. Making marketing pages, illustrations, slides or empty states? Pick **one** creative style for the whole page,
   matched to the brand's tone (playful: gloss; premium: engrave; technical: blueprint; human: sketch).
4. Never put creative styles inside dense controls or below their minimum size, because their detail turns to noise.

## Colour

- Default: `currentColor`. Set `color` on the icon or any parent (`text-blue-600`, `color: var(--brand)`).
- `--with-duo`: the tint colour of duo (defaults to translucent currentColor).
- `--with-accent`: a second colour for blueprint construction lines.
- Icon classes (CSS masks) cannot be two-tone. Use components, the web component or `with-icons.js` for that.

## Sizing

- 16px for dense tables and inline text, 20px for buttons and inputs, 24px (default) for nav and toolbars, and 32-64px for feature cards.
- `absoluteStrokeWidth` keeps a 1.75px stroke at 48px, which matches line icons of different sizes in one row.
