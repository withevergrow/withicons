# with icons: the 34 styles

All styles render the same 734 skeletons, so `home` looks like the same house in every style. They come in six groups,
named for what people make (the site, its pickers and MCP `recommend_styles` use the same groups). Line, solid, duo,
gloss, engrave, blueprint and sketch are single-colour `currentColor` (duo and blueprint add opt-in CSS variables); every
other style ships a default palette whose colours are CSS variables, while its ink still follows `currentColor`.
Glass, clay, bento, suite, dock, liquid, chrome, soft3d, brutal and the six holiday styles are **rich styles**: they also use
real gradients (see Colour below).

<!-- groups:start -->
| group | styles |
|---|---|
| Essentials | `line`, `solid`, `duo`, `suite` |
| Product & brand | `bento`, `dock`, `brutal`, `bauhaus` |
| 3D & glass | `clay`, `glass`, `liquid`, `chrome`, `soft3d`, `luxe`, `skeuo` |
| Playful | `kawaii`, `plush`, `sticker`, `gloss`, `pastel`, `pixel`, `retro` |
| Artistic | `sketch`, `engrave`, `blueprint`, `anime`, `gothic`, `coquette` |
| Holidays | `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` |
<!-- groups:end -->

## What are you making?

The best styles per job, best first (the same picks as the style picker on withicons.com; MCP `recommend_styles` and CLI
`withicons styles --for "<job>"` rank by your own words, so "Halloween party app" puts `halloween` first,
"Christmas email" `christmas`, "Diwali sale" `rangoli` then `utsav`):

<!-- uses:start -->
| making | best styles, best first |
|---|---|
| An app or website | `line`, `duo`, `solid`, `suite` |
| Slides and documents | `solid`, `duo`, `suite`, `clay` |
| A SaaS landing page | `bento`, `soft3d`, `duo`, `dock` |
| An AI product | `clay`, `liquid`, `chrome`, `glass` |
| Something premium | `glass`, `luxe`, `chrome`, `dock` |
| Something playful | `kawaii`, `plush`, `sticker`, `gloss` |
| Print or editorial | `engrave`, `sketch`, `blueprint`, `bauhaus` |
| A festival or seasonal campaign | `rangoli`, `christmas`, `halloween`, `lunar` |
<!-- uses:end -->

- **Festivals**: Diwali, Durga Puja, Holi, Navratri, Pongal, Onam -> `rangoli` (clean, brand-friendly, one motif per icon;
  palettes for each festival) or `utsav` (ornate festive craft, greetings, wedding menus); Halloween -> `halloween`;
  Christmas and winter -> `christmas`; Lunar New Year (Chinese New Year, Tết, Seollal) -> `lunar`; Valentine's,
  Galentine's, love, weddings -> `valentine` (or `coquette` for a softer, feminine look). Every icon renders in them (a
  cart or calendar in `christmas` still reads as a cart), and they look best with the festival icons: categories
  `indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `halloween` in [icons.md](icons.md). Switch the
  festival by palette, not by style: `rangoli` with the `holi` palette is a Holi set (Holiday palettes below).
- **Avatars** (category `avatars`, all `avatar-*`): `avatar-man` and `avatar-woman` are the standard defaults; people of many looks (`avatar-man-turban`, `avatar-woman-braids`, `avatar-man-afro`, `avatar-older-woman`, `avatar-person-glasses` …),
  animals (`avatar-cat`, `avatar-panda`, `avatar-fox` …) and friendly monsters (`avatar-monster`, `avatar-alien`,
  `avatar-robot`). In every people avatar **c1 is the skin, c2 the hair (or the turban, cap or hoodie fabric) and
  c3 its shade**, so one skin-tone picker works across all of them: set `--with-<style>-c1` / `-c2` / `-c3` (role flags
  `--c1 --c2 --c3`, MCP `colors`) from the tables in [Avatar skin tones](#avatar-skin-tones). Each person also has ~13
  true-to-life palettes (tag `true-to-life`); their ids differ per avatar (`umber-and-jet` on `avatar-woman`,
  `umber-and-snow` on `avatar-older-woman`): list them per icon with
  `npx withicons palettes <avatar> --tag true-to-life` or MCP `list_palettes`. `avatar-man` and `avatar-woman` default to a light skin tone; offer a skin-tone picker (the site studio has one) so people can choose theirs. Use a **role-named** style so the roles land the same on every
  avatar: plush, clay, pastel (friendly, kids), anime, coquette; kawaii and sticker map their colour families per icon,
  so recolour them per icon, not with one shared rule. Duo or line for product UI at 24-32px.
- **Product UI**: line everywhere, solid for the active state, duo for friendlier cards and onboarding (with the accent
  preset for a modern product look). Suite for enterprise and admin consoles.
- **Landing pages and AI products**: one rich style for the hero and feature grid (clay, liquid, chrome, glass, bento,
  soft3d, dock) and line for the page's UI chrome. Animate the hero icons in 3D ([motion.md](motion.md#3d-motion-3d-styles-and-per-style-moves-soft3d)).

| style | group | look | use it for | min size | `strokeWidth` |
|---|---|---|---|---|---|
| `line` | Essentials | precise 1.75px outline, round caps/joins | default UI: nav, buttons, inputs, tables, menus | 14px | yes |
| `solid` | Essentials | filled mass with crisp knockouts | active/selected states, dense or tiny UI, mobile tab bars | 12px | no |
| `duo` | Essentials | line over a soft tonal fill (`--with-duo`), one optional accent detail (`--with-duo-accent`) | friendly dashboards, cards, onboarding, SaaS pages | 18px | yes |
| `suite` | Essentials | office-suite colour: layered flat planes in calm blues and violets, gentle gradients, folded corners, bright badges | business apps, intranets, admin consoles, docs | 24px | no |
| `bento` | Product & brand | each glyph on a soft gradient squircle tile with a hairline highlight, crisp duotone | feature grids, bento layouts, settings, app menus | 24px | no |
| `dock` | Product & brand | glossy app-icon squircle in a rich two-tone colour with a raised, softly shaded glyph | app launchers, app-store art, product pages, portfolios | 32px | no |
| `brutal` | Product & brand | neo-brutalism: thick black outlines, flat loud colours, hard offset shadow | startups, portfolios, newsletters, posters, Gen Z brands | 24px | no |
| `bauhaus` | Product & brand | pure geometry (circles, squares, bars) in red, yellow and blue, overprinted where inks meet | posters, portfolios, galleries, design studios, editorial | 32px | no |
| `clay` | 3D & glass | soft faux-3D clay: plump matte objects lit from above, visible thickness, soft ground shadow | AI products, onboarding, landing pages, empty states | 32px | no |
| `glass` | 3D & glass | soft, luxurious frosted glass: a calm colour glows through a translucent pane with a fine light rim and a gentle shadow | modern SaaS heroes, fintech, OS-like UIs, dark gradient backgrounds | 32px | no |
| `liquid` | 3D & glass | clear, thick, refractive glass: specular rim, refraction edge, lens highlight, coloured caustic glow | modern app UIs, dashboards, hero art, dark mode | 32px | no |
| `chrome` | 3D & glass | Y2K liquid metal: inflated polished objects with a mirror horizon, bevelled rim and glint | music, fashion, events, posters, AI launches | 40px | no |
| `soft3d` | 3D & glass | soft studio-lit 3D objects with real depth: physical things at a gentle 3/4 angle, symbols as rounded front-facing forms, people as Memoji-like busts | landing pages, onboarding, app stores, avatars, explainers | 32px | no |
| `luxe` | 3D & glass | premium multi-layered 3D: sapphire enamel slab, extruded wall, polished gold, jewel, lit chamfers | heroes, pricing tiers, fintech, luxury brands, launch moments | 48px | no |
| `skeuo` | 3D & glass | skeuomorphic objects in real materials (paper, leather, metal, brass, glass), bevels, soft shadows | app icons, music/photo/note apps, tactile dashboards, nostalgic UIs | 48px | no |
| `kawaii` | Playful | chubby pastel shapes, soft thick outline, a tiny blushing face | cozy and wellness apps, journaling, kids, stickers, Gen Z audiences | 32px | yes |
| `plush` | Playful | stuffed toys sewn from felt: puffy panels, dark piping, running stitches, buttons, embroidery | kids' apps, learning, toy shops, nurseries, family brands | 48px | no |
| `sticker` | Playful | Y2K die-cut sticker: thick white border, candy colours, sparkles | social, creator tools, scrapbooks, fandom, playful marketing | 32px | no |
| `gloss` | Playful | inflated, glossy, pillowy, carved highlights | hero art, app-store style feature grids, playful brands | 32px | no |
| `pastel` | Playful | soft pastel colour fields (lavender, peach, mint, baby blue, butter, blush) with gentle tonal depth | wellness, planners and journals, baby and lifestyle brands | 32px | no |
| `pixel` | Playful | hand-tuned 16-bit pixel art: one-pixel outline, shaded body, highlight pixel | games, retro tech, playful dev tools, achievements | 16px (sharpest at 16, 32, 48) | no |
| `retro` | Playful | 70s sunset stripes, chunky outline, hard offset shadow | vintage brands, music, food, posters, merch | 32px | no |
| `sketch` | Artistic | loose double marker strokes, light hachure | whiteboards, education, empty states, informal products | 32px | yes |
| `engrave` | Artistic | banknote intaglio hatching | finance, legal, premium, editorial, certificates | 40px | no |
| `blueprint` | Artistic | drafting lines, centre lines, nodes (`--with-accent`) | docs, developer tools, engineering, "how it works" | 32px | yes |
| `anime` | Artistic | anime cel shading: tapered plum ink lines, flat cel colour, one hard shadow, specular shine, sparkles | games, streaming, fan sites, creators, Gen Z apps | 32px | no |
| `gothic` | Artistic | cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald, pointed arches | fantasy and RPG games, books, music, dark-luxe brands | 48px | no |
| `coquette` | Artistic | ballet-pink satin objects tied with ribbon-red bows, pearls, lace and delicate gold | beauty, fashion, weddings, boutiques, feminine brands | 32px | no |
| `utsav` | Holidays | Indian festive craft: marigold and saffron forms, plum outline, fine gold inner line, rangoli dot-work, a tiny diya flame | Diwali and Durga Puja greetings, Indian brands, wedding and festive menus | 32px | no |
| `rangoli` | Holidays | clean objects in a warm festive glow, each with one festival motif (rangoli petals, lotus, toran, marigold, diya flame, gulal) | Diwali, Durga Puja and Holi campaigns, festive sales, app themes | 32px | no |
| `halloween` | Holidays | spooky-cute pumpkin, witch-purple and midnight forms, candle-lit carvings, slime drips, a tiny bat | Halloween campaigns, party invites, app themes, social posts | 32px | no |
| `christmas` | Holidays | cranberry, pine and gold forms, a snow cap on every top edge, candy-cane stripes, a sprig of holly | Christmas campaigns, holiday emails, gift guides, app themes | 32px | no |
| `lunar` | Holidays | lucky red lacquer with a gold-foil rim, jade parts, paper-cut cloud scrolls, silk tassels, plum blossoms | Lunar New Year campaigns, red-envelope promos, greetings | 32px | no |
| `valentine` | Holidays | pink-to-red cartoon shapes, berry outline, polka dots, tiny blushing faces, floating hearts | Valentine's campaigns, cards, dating apps, gift shops | 32px | no |

## Choosing

1. Building application UI? Use **line**. Need emphasis or an "on" state? Use **solid** for that one icon.
2. Want warmth without leaving the UI family? Use **duo**, tinted to the brand (`style="--with-duo: #fde68a"`), or the
   "Duo with an accent" preset (Duo presets below).
3. Marketing pages, illustrations, slides, empty states, campaigns? Pick **one** style from the other groups for the whole
   page, matched to the job (table above) and the brand's tone: playful: gloss or sticker; premium: luxe, glass or
   engrave; technical: blueprint or pixel; human: sketch; cute and cozy: kawaii or pastel; nostalgic: retro, pixel
   or skeuo; bold and designed: bauhaus or brutal; games and fandom: anime; fantasy and dark: gothic; feminine and
   romantic: coquette; for children: plush; AI products: clay, liquid or chrome; SaaS: bento for feature grids, suite for
   enterprise, dock for app tiles; a festival or season: its holiday style.
4. Never put anything but line, solid and duo inside dense controls or below its minimum size: the detail turns to noise.
5. Palette styles are designed to read on white and on near-black (`#0B0B12`). On a strong brand colour, re-theme their variables.
6. One style per UI region. The only routine mix is line plus solid for inactive and active states.

Every style is a subpath with the same export names: `@withicons/react/solid`, `/duo`, `/suite`, `/bento`, `/dock`,
`/brutal`, `/bauhaus`, `/clay`, `/glass`, `/liquid`, `/chrome`, `/soft3d`, `/luxe`, `/skeuo`, `/kawaii`, `/plush`, `/sticker`,
`/gloss`, `/pastel`, `/pixel`, `/retro`, `/sketch`, `/engrave`, `/blueprint`, `/anime`, `/gothic`, `/coquette`, `/utsav`,
`/rangoli`, `/halloween`, `/christmas`, `/lunar`, `/valentine` (same for vue, svelte, solid, angular; `variant="…"` on
`<with-icon>`, `with-<style>` on classes). The retired names `aura`, `linear` and `spectrum` are gone: use clay or liquid
for an AI glow, and duo (accent / gradient presets) for the Linear and Spectrum looks.

Style words in a search pick the style: "cute heart" -> kawaii, "8-bit star" -> pixel, "frosted bell" -> glass,
"y2k" -> sticker, "vintage camera" -> retro, "luxury gift" -> luxe, "bauhaus clock" or "geometric star" -> bauhaus,
"skeuomorphic camera" -> skeuo, "manga heart" -> anime, "medieval key" -> gothic, "soft cloud" -> pastel,
"girly star" -> coquette, "toy rocket" -> plush, "claymorphism star" -> clay, "bento grid" -> bento,
"enterprise mail" -> suite, "app icon" -> dock, "liquid glass bell" -> liquid, "metallic heart" -> chrome,
"soft 3d camera" or "isometric server" -> soft3d, "neo-brutalism star" -> brutal. (Words that also name things, like glass, metal, office or
tile, stay object words.) For festivals, search for the object and pass the style (`--style christmas`).

## Duo presets

Duo's lines and tint follow `currentColor` by default. Its variables: `--with-duo` (the tint plane) and `--with-duo-accent`
(one accent detail per icon, picked automatically: the icon's modifier, like a badge, plus sign or slash, if it has one;
else its inner parts, like a bell's clapper or a lock's keyhole; pure line glyphs such as arrows get none). Tint and
accent are independent: one colour for both (the preset) or two (`--with-duo: #c7d2fe; --with-duo-accent: #e11d48`). `--with-duo-from` / `--with-duo-to` exist only in the studio's
gradient render: setting them on a package icon does nothing.

<!-- duo:start -->
| preset | look | CSS variables | strokeWidth | where |
|---|---|---|---|---|
| Duo with an accent (`accent`) | Crisp lines over a soft indigo plane, one detail picked out in the accent colour (the Linear look). | `--with-duo: #6B70F7; --with-duo-accent: #6B70F7` | 1.5 | every package (CSS variables on the icon or a parent) |
| Duo gradient (`gradient`) | Lines swept with one indigo-to-pink gradient over a faint violet body (the Spectrum look). | `--with-duo: #8B5CF6; --with-duo-from: #6366F1; --with-duo-to: #EC4899; --with-duo-accent: #EC4899` | 2 | site and studio only (exports bake it in); no package API yet |
<!-- duo:end -->

```html
<div style="--with-duo: #6B70F7; --with-duo-accent: #6B70F7">   <!-- "Duo with an accent", any package -->
  <with-icon name="bell" variant="duo" stroke-width="1.5"></with-icon>
</div>
```

React: `<Bell strokeWidth={1.5} style={{ '--with-duo': '#6B70F7', '--with-duo-accent': '#6B70F7' } as React.CSSProperties} />`
from `@withicons/react/duo`. "Duo gradient" has no package or CLI API in this release: open the icon's studio on
withicons.com, `https://withicons.com/icons/<name>.html?style=duo#studio` (e.g. `…/icons/rocket.html?style=duo#studio`),
pick the "Duo gradient" look and download the SVG, PNG or GIF: the file carries the gradient baked in (use it as an image:
`<img>`, Figma, slides).

## Holiday palettes

Five holiday styles ship festival palettes (`utsav` has its one default palette: for other festivals in an Indian
style use `rangoli`, whose palettes cover Diwali, Durga Puja, Holi, Navratri, Pongal, Onam, Rakhi and Ganesh). One CSS
variable per role, `--with-<style>-<role>` (roles `ink c1 c2 c3 c4 tint accent shadow shine edge`). The first is the default (the
colours the icons ship with). Set a palette's variables on any parent and every icon of that style below it follows:

<!-- holiday:start -->
| style | palettes (id: name), the first is the default |
|---|---|
| `christmas` | `classic`: Classic Christmas, `nordic`: Nordic wood, `midnight`: Midnight silver, `candy`: Candy pink, `gold-luxe`: Gold luxe, `evergreen`: Evergreen, `frost`: Winter frost, `mulled-wine`: Mulled wine, `gingerbread`: Gingerbread, `retro-tinsel`: Retro tinsel |
| `halloween` | `jack-o-lantern`: Jack-o'-lantern, `witching-hour`: Witching hour, `slime-time`: Slime time, `candy-corn`: Candy corn pastel, `ghost-story`: Ghost story, `graveyard`: Graveyard mono, `vampire`: Vampire velvet, `neon-night`: Neon night, `witch-brew`: Witch's brew |
| `lunar` | `classic`: Lucky red & gold, `jade-gold`: Jade & gold, `ink-wash`: Ink wash & cinnabar, `peach-blossom`: Peach blossom, `imperial`: Imperial yellow, `modern-red`: Modern minimal red, `midnight-gold`: Midnight lacquer, `mandarin`: Mandarin orange, `porcelain`: Blue & white porcelain |
| `rangoli` | `diwali`: Diwali night, `durga-puja`: Durga Puja, `holi`: Holi colours, `navratri`: Navratri garba, `durga-pandal`: Pandal lights, `pongal`: Pongal harvest, `onam`: Onam kasavu, `eid-jewels`: Jewel tones, `rakhi`: Rakhi thread, `ganesh`: Ganesh Chaturthi |
| `utsav` | `diwali`: Diwali marigold, `durga-puja`: Durga Puja, `holi`: Holi gulal, `navratri`: Navratri garba, `pongal`: Pongal harvest, `onam`: Onam kasavu, `temple-gold`: Temple gold |
| `valentine` | `classic-love`: Classic love, `blush-pastel`: Blush pastel, `chocolate-cream`: Chocolate & cream, `lavender-love`: Lavender love, `galentines-peach`: Galentine's peach, `dark-romance`: Dark romance, `candy-hearts`: Candy hearts, `strawberry-milk`: Strawberry milk, `red-roses`: Red roses |
<!-- holiday:end -->

Every palette's colours, as role values (the same list works everywhere):

<!-- holiday-colors:start -->
| style | palette | `--colors` (roles: CLI `--colors "…"`, MCP `colors`, CSS `--with-<style>-<role>`) |
|---|---|---|
| `christmas` | `classic` | `ink=#3A0F17,c1=#C8203A,c2=#1F6E46,c3=#E2A93B,c4=#FFF5E6,tint=#C9DAEC,accent=#F4C24D,shadow=#4A0716,shine=#FFFFFF,edge=#FFB347` |
| `christmas` | `nordic` | `ink=#2E2620,c1=#B5523B,c2=#50705A,c3=#C79A5E,c4=#F4EDE2,tint=#D5DDE3,accent=#E3BE7A,shadow=#3B2A1F,shine=#FFFFFF,edge=#F2C98A` |
| `christmas` | `midnight` | `ink=#0E1838,c1=#2A3F8F,c2=#3A6E8F,c3=#C3CCDA,c4=#EEF2FA,tint=#B9C8E6,accent=#E8EEF8,shadow=#0A1030,shine=#FFFFFF,edge=#9DB7FF` |
| `christmas` | `candy` | `ink=#5A1838,c1=#F0628F,c2=#3FB59A,c3=#F7C35F,c4=#FFF2F6,tint=#F5D3E2,accent=#FFD36E,shadow=#7A1A44,shine=#FFFFFF,edge=#FFA9C6` |
| `christmas` | `gold-luxe` | `ink=#1E1408,c1=#B8862B,c2=#2F4A3A,c3=#E9C46A,c4=#FBF1DA,tint=#E8DCC2,accent=#FFE08A,shadow=#2A1A06,shine=#FFFDF5,edge=#FFCF6B` |
| `christmas` | `evergreen` | `ink=#10291D,c1=#1F6E46,c2=#2E8B57,c3=#D9A441,c4=#F6F1E4,tint=#C8DDD3,accent=#F0C55A,shadow=#0B2016,shine=#FFFFFF,edge=#FFC56B` |
| `christmas` | `frost` | `ink=#22355A,c1=#6FA8DC,c2=#7BC4C4,c3=#C9D6EA,c4=#FFFFFF,tint=#CFE2F6,accent=#BFE3FF,shadow=#1F3A66,shine=#FFFFFF,edge=#A9D4FF` |
| `christmas` | `mulled-wine` | `ink=#2B0A14,c1=#7E1F3A,c2=#3F5E3A,c3=#D49A4A,c4=#F7E9DA,tint=#D9CBD6,accent=#F2B85C,shadow=#2A0610,shine=#FFFAF4,edge=#F59E4C` |
| `christmas` | `gingerbread` | `ink=#3A1E0E,c1=#B8692E,c2=#4F7A3A,c3=#E3B04B,c4=#FFF6EA,tint=#E2D6C8,accent=#F2C96B,shadow=#4A240C,shine=#FFFFFF,edge=#FFB866` |
| `christmas` | `retro-tinsel` | `ink=#202040,c1=#E2453C,c2=#1E9E8E,c3=#F2B134,c4=#FFF4E0,tint=#CDE3E8,accent=#FF9FC2,shadow=#3A1530,shine=#FFFFFF,edge=#FFC24D` |
| `halloween` | `jack-o-lantern` | `ink=#1D1029,c1=#FF9F2E,c2=#E5530F,c3=#8B55E0,c4=#86D13A,tint=#FFF1B8,accent=#FFB52E,shadow=#2A1642,shine=#FFF6E2,edge=#7344C9` |
| `halloween` | `witching-hour` | `ink=#170B26,c1=#A57AF5,c2=#5B2BB5,c3=#FF8A1F,c4=#9BE34A,tint=#FFEDB0,accent=#FFC845,shadow=#1B0F33,shine=#F3EAFF,edge=#E8681A` |
| `halloween` | `slime-time` | `ink=#1A1326,c1=#AEEA4E,c2=#4C9F1C,c3=#8B55E0,c4=#FF8A1F,tint=#F6FFC8,accent=#D6F55A,shadow=#1F3311,shine=#F7FFE4,edge=#7344C9` |
| `halloween` | `candy-corn` | `ink=#4A2E5C,c1=#FFC08A,c2=#FF8F6B,c3=#C3A2FF,c4=#9FE3B6,tint=#FFF6CF,accent=#FFD98A,shadow=#7A5C9E,shine=#FFFFFF,edge=#A784EE` |
| `halloween` | `ghost-story` | `ink=#1E2342,c1=#E6F5FF,c2=#A2C9EE,c3=#8E7CF0,c4=#93EBC4,tint=#FFFFFF,accent=#BFE9FF,shadow=#2C3360,shine=#FFFFFF,edge=#6B66D6` |
| `halloween` | `graveyard` | `ink=#121016,c1=#E9E7EF,c2=#A3A0B3,c3=#6E6A80,c4=#C7C4D4,tint=#FFFFFF,accent=#D8D5E5,shadow=#2A2733,shine=#FFFFFF,edge=#55516A` |
| `halloween` | `vampire` | `ink=#1A0A12,c1=#EC4B57,c2=#99172D,c3=#7446B8,c4=#F2C14E,tint=#FFE0C8,accent=#FF7B5A,shadow=#3A0C18,shine=#FFE9E9,edge=#7446B8` |
| `halloween` | `neon-night` | `ink=#0E0718,c1=#FF8A1F,c2=#FF3D7F,c3=#B455FF,c4=#39FF88,tint=#FFF47A,accent=#FFB800,shadow=#2A0B3D,shine=#FFFFFF,edge=#B455FF` |
| `halloween` | `witch-brew` | `ink=#2B1B14,c1=#E7A33E,c2=#AE5E1C,c3=#5E3A7A,c4=#7FA650,tint=#FBE6B4,accent=#F4C35A,shadow=#3D2618,shine=#FFF3DC,edge=#5E3A7A` |
| `lunar` | `classic` | `ink=#4A0A10,c1=#E8282E,c2=#B0101E,c3=#11896A,c4=#F79A8A,tint=#FFF1D6,accent=#E8B030,shadow=#6E0A14,shine=#FFEBA6,edge=#A8700F` |
| `lunar` | `jade-gold` | `ink=#06322A,c1=#1FA37C,c2=#0B6B53,c3=#D9282F,c4=#F7B0A0,tint=#EAFBF2,accent=#E5B23A,shadow=#053B2F,shine=#FFF0B3,edge=#A0700F` |
| `lunar` | `ink-wash` | `ink=#0E0E10,c1=#3A3A40,c2=#141418,c3=#D3262C,c4=#E84B4B,tint=#F4EFE6,accent=#D8342F,shadow=#000000,shine=#FF8A7A,edge=#8E1418` |
| `lunar` | `peach-blossom` | `ink=#6B1F35,c1=#F7829A,c2=#D94C6E,c3=#5DB88F,c4=#FFD3DC,tint=#FFF4F6,accent=#E9B14A,shadow=#8E2546,shine=#FFF0C4,edge=#B57C22` |
| `lunar` | `imperial` | `ink=#4A1A06,c1=#FFC629,c2=#E68A00,c3=#C8102E,c4=#E8323A,tint=#FFF8DC,accent=#C8102E,shadow=#7A2E05,shine=#E8323A,edge=#8E0A1E` |
| `lunar` | `modern-red` | `ink=#2B0A0C,c1=#E3262D,c2=#E3262D,c3=#E3262D,c4=#FFB4A8,tint=#FFFFFF,accent=#FFFFFF,shadow=#9C0F17,shine=#FFFFFF,edge=#F2D9D9` |
| `lunar` | `midnight-gold` | `ink=#05070F,c1=#1E2A55,c2=#0B1230,c3=#D9282F,c4=#F79A8A,tint=#E9EEFF,accent=#E8B030,shadow=#03060F,shine=#FFEBA6,edge=#A8700F` |
| `lunar` | `mandarin` | `ink=#4A1D04,c1=#FF9A1F,c2=#E8590C,c3=#1F8A4C,c4=#FFD08A,tint=#FFF4E0,accent=#E8B030,shadow=#7A2E05,shine=#FFF0B3,edge=#A8700F` |
| `lunar` | `porcelain` | `ink=#0D2A66,c1=#2F5DB8,c2=#163B8C,c3=#C8302E,c4=#DCE6FA,tint=#F4F7FF,accent=#F4F7FF,shadow=#0A1F4D,shine=#FFFFFF,edge=#9DB4E3` |
| `rangoli` | `diwali` | `ink=#2B1660,c1=#FFB21F,c2=#F2462C,c3=#E81F7A,c4=#7B2FE0,tint=#FFF3D8,accent=#FFC21A,shadow=#5A1240,shine=#FFFFFF,edge=#FFE9AE` |
| `rangoli` | `durga-puja` | `ink=#5C0A16,c1=#F0402F,c2=#A3101F,c3=#E6B53A,c4=#B7791F,tint=#FFF8EF,accent=#F4C542,shadow=#4A0710,shine=#FFFFFF,edge=#FFF6E8` |
| `rangoli` | `holi` | `ink=#2A1A5E,c1=#FF4FA3,c2=#8B3DFF,c3=#22C76A,c4=#16B8E0,tint=#FFFFFF,accent=#FFC800,shadow=#3B1670,shine=#FFFFFF,edge=#FFF1F8` |
| `rangoli` | `navratri` | `ink=#1E1B4B,c1=#FF7A1A,c2=#D81E6A,c3=#14A37F,c4=#2A4FD6,tint=#FFF5E6,accent=#FFC107,shadow=#4C0F3A,shine=#FFFFFF,edge=#FFE8B8` |
| `rangoli` | `durga-pandal` | `ink=#3D0A12,c1=#E7B43C,c2=#B5651D,c3=#D7263D,c4=#7C0A1E,tint=#FFF6E2,accent=#FF5A3C,shadow=#3A1A08,shine=#FFFFFF,edge=#FFF2D0` |
| `rangoli` | `pongal` | `ink=#3B2412,c1=#F7B731,c2=#D2601A,c3=#3E9E4A,c4=#1F6F3A,tint=#FFF6DC,accent=#FFDA47,shadow=#5A2E10,shine=#FFFFFF,edge=#FFF0C4` |
| `rangoli` | `onam` | `ink=#2F2410,c1=#FFC93C,c2=#EF7A1A,c3=#2E9446,c4=#C7372F,tint=#FFF8E6,accent=#F2B705,shadow=#5B3A0C,shine=#FFFFFF,edge=#FFF4D6` |
| `rangoli` | `eid-jewels` | `ink=#0F2A3A,c1=#1FB59A,c2=#0B6A78,c3=#E2B33F,c4=#4A35A8,tint=#EFFBF6,accent=#F4CB5A,shadow=#0A2F38,shine=#FFFFFF,edge=#D9F5EC` |
| `rangoli` | `rakhi` | `ink=#3A0F2E,c1=#FF8A5B,c2=#E3245F,c3=#F5B700,c4=#9B2FC4,tint=#FFF2EC,accent=#FFD23F,shadow=#5E1035,shine=#FFFFFF,edge=#FFE3D6` |
| `rangoli` | `ganesh` | `ink=#3A1206,c1=#FFA21F,c2=#E2372A,c3=#2F9E44,c4=#C2185B,tint=#FFF4DE,accent=#FFD000,shadow=#5A1A08,shine=#FFFFFF,edge=#FFEBB5` |
| `utsav` | `diwali` | `ink=#3B0A45,c1=#F59E0B,c2=#F97316,c3=#E11D74,c4=#0F766E,tint=#FFF4DC,accent=#D4A017,shadow=#3B0A45,shine=#FFF4DC,edge=#F4C95D` |
| `utsav` | `durga-puja` | `ink=#4A0A10,c1=#E23B2E,c2=#A8141F,c3=#F7EFE0,c4=#C9961F,tint=#FFF6EC,accent=#F2C14E,shadow=#3A070C,shine=#FFFFFF,edge=#FFF1DA` |
| `utsav` | `holi` | `ink=#2A1A5E,c1=#FF4FA3,c2=#8B3DFF,c3=#22C76A,c4=#16B8E0,tint=#FFF1F8,accent=#FFC800,shadow=#2A1A5E,shine=#FFFFFF,edge=#FFE3F1` |
| `utsav` | `navratri` | `ink=#1E1B4B,c1=#FF7A1A,c2=#D81E6A,c3=#14A37F,c4=#2A4FD6,tint=#FFF5E6,accent=#FFC107,shadow=#1E1B4B,shine=#FFF5E6,edge=#FFE8B8` |
| `utsav` | `pongal` | `ink=#3B2412,c1=#F7B731,c2=#D2601A,c3=#3E9E4A,c4=#1F6F3A,tint=#FFF6DC,accent=#FFDA47,shadow=#3B2412,shine=#FFF6DC,edge=#FFF0C4` |
| `utsav` | `onam` | `ink=#2F2410,c1=#FFC93C,c2=#EF7A1A,c3=#2E9446,c4=#C7372F,tint=#FFF8E6,accent=#F2B705,shadow=#2F2410,shine=#FFF8E6,edge=#FFF4D6` |
| `utsav` | `temple-gold` | `ink=#2A1406,c1=#E8B84A,c2=#A86A12,c3=#8E1B2C,c4=#1F5F5B,tint=#FFF3D6,accent=#F6D06B,shadow=#2A1406,shine=#FFF3D6,edge=#FFE6A3` |
| `valentine` | `classic-love` | `ink=#6A1B3A,c1=#FF6B8E,c2=#E8304F,c3=#8B4A36,c4=#FFF3E3,tint=#F5C451,accent=#5DB86A,shadow=#A3163F,shine=#FFFFFF,edge=#FF8FB0` |
| `valentine` | `blush-pastel` | `ink=#8A3A5C,c1=#FFB8CC,c2=#F98BA9,c3=#B9806C,c4=#FFF8EF,tint=#F8DB8C,accent=#9FD6A2,shadow=#D45F88,shine=#FFFFFF,edge=#FF9DBA` |
| `valentine` | `chocolate-cream` | `ink=#4A2418,c1=#E9819B,c2=#C7415F,c3=#7A4330,c4=#FFF0D9,tint=#E2B266,accent=#7FA35B,shadow=#55291C,shine=#FFF8EE,edge=#F7899F` |
| `valentine` | `lavender-love` | `ink=#4E2A6B,c1=#C9A9F7,c2=#9C72E3,c3=#8E5B7A,c4=#FAF4FF,tint=#F4CF7A,accent=#86CFA8,shadow=#6E4AB0,shine=#FFFFFF,edge=#FF9CC2` |
| `valentine` | `galentines-peach` | `ink=#7A2E2E,c1=#FFB08A,c2=#FF6F7F,c3=#9A5A3C,c4=#FFF5E8,tint=#FFD66B,accent=#8CC97A,shadow=#C9503E,shine=#FFFFFF,edge=#FF8FA0` |
| `valentine` | `dark-romance` | `ink=#2A0A16,c1=#C2184A,c2=#7A0A2B,c3=#4A2219,c4=#F4D9C6,tint=#D9A84E,accent=#3E7A4A,shadow=#3A0414,shine=#FFD7DF,edge=#E8607E` |
| `valentine` | `candy-hearts` | `ink=#5C2346,c1=#FF8FC0,c2=#F2569A,c3=#A98BFF,c4=#FFF7D6,tint=#FFE45C,accent=#6FD6B8,shadow=#B83C78,shine=#FFFFFF,edge=#FF6FA0` |
| `valentine` | `strawberry-milk` | `ink=#7B2F45,c1=#FFC2D4,c2=#F2557A,c3=#A8674E,c4=#FFFDF5,tint=#F7D27A,accent=#7CC48A,shadow=#D86A8C,shine=#FFFFFF,edge=#FF7FA2` |
| `valentine` | `red-roses` | `ink=#4A1020,c1=#F0405A,c2=#B5122E,c3=#6B3A2A,c4=#FFF0E8,tint=#E8B84A,accent=#3F8F4E,shadow=#7E0C22,shine=#FFE3E8,edge=#FF7A93` |
<!-- holiday-colors:end -->

- A style only paints the roles in its own variable list (Palette variables below): a role it does not use (rangoli has
  no `edge`, lunar no `shadow`) changes nothing, which is harmless.
- **CSS** (components, `<with-icon>`, sprites): one variable per role on a parent, `ink=#5C0A16` -> `--with-rangoli-ink: #5C0A16`:
  `.holi { --with-rangoli-ink: …; --with-rangoli-c1: …; … }`, and switch the class to switch the festival.
- **CLI** (`get`, `export`): `--colors "<the value from the table>"` (quote it), e.g.
  `npx withicons export diya gift --style rangoli --colors "ink=…,c1=…,…" --format png`. `--palette <id>` takes the
  *per-icon* palette ids (`withicons palettes <icon>`), not these festival ids.
- **MCP**: `get_icon` / `export_icon` with `colors: { ink, c1, … }`; `recommend_styles` lists each holiday style's
  `stylePalettes` with their colours.

## Avatar skin tones

<!-- avatars:start -->
Skin tones (c1 = skin, tint = its light, shadow = its shade), from `avatar-person`'s true-to-life palettes:

| skin | c1 | tint | shadow |
|---|---|---|---|
| fair | #F6D2B6 | #FDEEE3 | #B08061 |
| umber | #583420 | #C7AA98 | #2F190C |
| peach | #EEC19C | #FAE6D6 | #A56F4C |
| caramel | #9C6038 | #E2C7B4 | #5C341A |
| porcelain | #FBE3D3 | #FFF4EC | #B98A73 |
| bronze | #83502E | #D9BEAB | #4A2914 |
| olive | #CFA174 | #F0DDC8 | #86593A |
| chestnut | #6B4127 | #CFB4A2 | #3C2010 |
| beige | #E2B184 | #F6E2CF | #966243 |
| honey | #B87745 | #E9CFBA | #6E4223 |
| tan | #C88B5C | #EED6C4 | #7B4E30 |

Hair (c2 = hair, c3 = its shade):

| hair | c2 | c3 |
|---|---|---|
| brunette | #6A3F22 | #4C2D18 |
| jet | #1E1A18 | #161311 |
| golden | #E2C06B | #A38A4D |
| cocoa | #3A2417 | #2A1A11 |
| copper | #C9662C | #914920 |
| blue-black | #1C2433 | #141A25 |
| auburn | #8C3A1C | #652A14 |
| platinum | #EFE2BC | #ACA387 |
| honey | #C99A4B | #916F36 |

Avatars (39): `avatar-alien`, `avatar-baby`, `avatar-bear`, `avatar-boy`, `avatar-bunny`, `avatar-cat`, `avatar-dino`, `avatar-dog`, `avatar-fox`, `avatar-frog`, `avatar-ghost`, `avatar-girl`, `avatar-koala`, `avatar-man-afro`, `avatar-man-bald`, `avatar-man-beard`, `avatar-man-cap`, `avatar-man-turban`, `avatar-man`, `avatar-monster-fluffy`, `avatar-monster-horns`, `avatar-monster`, `avatar-older-man`, `avatar-older-woman`, `avatar-owl`, `avatar-panda`, `avatar-penguin`, `avatar-person-glasses`, `avatar-person-headphones`, `avatar-person`, `avatar-robot`, `avatar-teen`, `avatar-tiger`, `avatar-unicorn`, `avatar-woman-bob`, `avatar-woman-braids`, `avatar-woman-bun`, `avatar-woman-curly`, `avatar-woman`.
<!-- avatars:end -->

People avatars: `avatar-person`, `-man`, `-woman`, `-boy`, `-girl`, `-teen`, `-baby`, `-older-man`, `-older-woman`,
`-man-afro`, `-man-bald`, `-man-beard`, `-man-cap`, `-man-turban`, `-woman-bob`, `-woman-braids`, `-woman-bun`,
`-woman-curly`, `-person-glasses`, `-person-headphones` (c2 is the turban, cap or hoodie on those,
clothing on `-man-bald`). Setting c1-c3 is enough; `tint` and `shadow` are the skin's light and shade, set them too for
an exact match. Headwear and hair-texture looks exist as adult avatars only.

Plush example (Vue): `<AvatarGirl :size="64" :style="{ '--with-plush-c1': '#583420', '--with-plush-c2': '#1E1A18', '--with-plush-c3': '#161311' }" />`.
Set skin and hair as two separate choices, or offer the named pairs from `withicons palettes <avatar>`.

## Download a whole style

<!-- downloads:start -->
Every style as one zip: `https://withicons.com/downloads/with-icons-<style>.zip` (all 734 SVGs with the colours baked in,
an offline searchable viewer `index.html`, LICENSE and README), e.g. `https://withicons.com/downloads/with-icons-line.zip`, `https://withicons.com/downloads/with-icons-solid.zip`, `https://withicons.com/downloads/with-icons-duo.zip`. Every style in one: `https://withicons.com/downloads/with-icons-all.zip` (svg/<style>/<name>.svg, no viewer). Styles: line, solid, duo, gloss, engrave, blueprint, sketch, glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush, clay, bento, suite, dock, liquid, chrome, soft3d, brutal, utsav, rangoli, halloween, christmas, lunar, valentine.
<!-- downloads:end -->

Use the zips for design tools, slides, no-code sites and offline work. In code, prefer the packages (they make gradient
ids unique and keep the CSS variables themable); the zip SVGs have the colours baked in.

## Colour

- Default: `currentColor`. Set `color` on the icon or any parent (`text-blue-600`, `color: var(--brand)`). In the five
  older palette styles (glass, kawaii, sticker, pixel, retro) this recolours the ink. Most role-named styles (clay, plush,
  luxe, the holiday styles …) paint their outline with `--with-<style>-ink`, which has a hex default: set that variable
  (or the `ink` role) to recolour it; `color` alone does not. The palette table below shows which styles have an ink default.
- `--with-duo`: the tint colour of duo (defaults to translucent currentColor); `--with-duo-accent`: its one accent detail (Duo presets above).
- `--with-accent`: a second colour for blueprint construction lines.
- Palette styles: `--with-<style>-<role>` per colour (table below). Set them on any parent, a theme class or one icon:
  `.cozy { --with-kawaii-fill-1: #fbcfe8; --with-kawaii-blush: #f472b6 }`.
- Every multi-colour style except the five below (luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush, clay, bento,
  suite, dock, liquid, chrome, soft3d, brutal and the six holiday styles) names each variable after its palette role: `--with-<style>-<role>` with role one of
  `ink c1 c2 c3 c4 tint accent shadow shine edge` (`.vip { --with-luxe-c1: #0f766e; --with-luxe-accent: #e3ae47 }`), so a
  per-icon palette (`withicons palettes <icon>`, the editor on withicons.com) recolours all of them the same way.
- The five palette styles (glass, kawaii, sticker, pixel, retro) keep their own variable names, but every one of them maps
  to a palette role too, so the same per-icon palettes apply to them: fixed variables map to one role
  (`--with-kawaii-face` -> ink, `--with-kawaii-blush` -> accent, `--with-glass-back` -> c1, `--with-glass-pane` -> tint,
  `--with-sticker-edge` -> edge, `--with-pixel-fill` -> c1, `--with-retro-shadow` -> shadow …), and the colour families
  (`--with-kawaii-fill-N`, the sticker candies `--with-sticker-bubblegum/grape/lemon/mint/peach/sky`, `--with-retro-N`)
  map to c1, c2, c3, c4 in the order they first appear in that icon. `withicons palettes heart --style kawaii` prints the
  exact mapping for one icon (`kawaii: --with-kawaii-fill-1 (c1), --with-kawaii-blush (accent), … --with-kawaii-face (ink)`);
  MCP `list_palettes(name, style)` and `/api/palettes/<name>?style=` return it as JSON. `--with-duo` and `--with-accent` map to c1.
- Some variables default to `currentColor` (the ink), so the table below leaves them out: `--with-kawaii-face` (eyes and
  mouth), `--with-pixel-fill`, `--with-bauhaus-ink`, `--with-skeuo-edge`, plus `--with-duo` and `--with-accent`.
- Apply a named palette without a build step: `withicons get heart --style kawaii --palette classic-red --format web-component`
  (or MCP `get_icon` with `palette`) returns a `<with-icon>` with the palette's variables in its `style` attribute, ready for
  the CDN script; there is no `palette` attribute on `<with-icon>` itself. For an image, use
  `https://withicons.com/api/icon/heart.svg?style=kawaii&palette=classic-red` (colours baked in) or `--flat` on `get`.
- **Brand colours with no build**: `get` takes the same role flags as `export` (`--ink`, `--c1` to `--c4`, `--tint`,
  `--accent`, `--shadow`, `--shine`, `--edge`, or `--colors "c1=#6d28d9,tint=#c4b5fd"`) and writes the variables that
  icon uses: `withicons get rocket --style glass --c1 "#6d28d9" --tint "#c4b5fd" --format web-component` gives
  `<with-icon style="--with-glass-back: #6d28d9; --with-glass-pane: #c4b5fd" name="rocket" variant="glass">`.
  (`--color` only changes `svg` / `data-uri` output; for the element, set CSS `color` on a parent.)
- **Put the brand colour on the main role.** c1 is the first colour family the drawing uses, not necessarily its
  biggest part. `withicons palettes <icon> --style <style>` marks the body colour and its share:
  `--with-glass-pane (tint, main body)` and `main role: tint (main body, ~93% of the drawn area): set it for a brand
  colour, e.g. --tint "#e11d48"` (MCP `list_palettes`: `mainRole`, `mainRoleShare`, `mainRoleNote`; `get_icon`:
  `colors.mainRole`). The main role changes per icon and style, and the palette styles' variables map to different
  roles per icon (kawaii `heart`: `--with-kawaii-fill-1` is c1, `home`: `--with-kawaii-fill-3`; sticker `heart`:
  bubblegum, `home`: sky), so one hand-written CSS rule does not recolour a set evenly. For one brand colour across a
  set, set each icon's main role with role flags (`get` / `export` map them to variables), or use solid / line with
  `color`. Look at the result.
- Icon classes (CSS masks) show palette styles in their default colours (with a palette, only its ink applies); the
  variables need components, the web component, sprites or `with-icons.js`. Standalone `.svg` files have the defaults
  baked in (for `<img>`, Figma, slides).

- **Rich styles and gradients** (glass, clay, bento, suite, dock, liquid, chrome, soft3d, brutal, utsav, rangoli, halloween,
  christmas, lunar, valentine):
  each icon may carry one `<defs>` node of linear/radial gradients. Gradient ids are `wg-<style>-<icon>-<n>` and every
  stop colour is a role variable (`stop-color="var(--with-clay-c1, #hex)"`), so palettes, role flags and CSS variables
  recolour the gradients exactly like flat fills. No filters, masks, images or text. The components, `<with-icon>`,
  sprites and the site make the ids unique per rendered instance (two icons never share a gradient); when you paste raw
  SVG of the same icon twice into one HTML page with different colours, rename the ids in one copy. Standalone `.svg`
  files (`svg-flat`, downloads, `/api/icon/<name>.svg`) flatten the variables, so the stops carry plain hex colours.

### Palette variables

<!-- palettes:start -->
| style | CSS variables (default) |
|---|---|
| `glass` | `--with-glass-accent` #F2679E, `--with-glass-back` #7484FF, `--with-glass-c1` #F07CA2, `--with-glass-c2` #E2577F, `--with-glass-c3` #F5B82E, `--with-glass-c4` #FF8A3D, `--with-glass-etch` #3E3A8C, `--with-glass-frost` #FFFFFF, `--with-glass-pane` #E4E8FF, `--with-glass-shadow` #6A45D6, `--with-glass-shine` #FFFFFF |
| `kawaii` | `--with-kawaii-accent` #FF5C9A, `--with-kawaii-blush` #FF6F9C, `--with-kawaii-c1` #BB9275, `--with-kawaii-c2` #504948, `--with-kawaii-c4` #85CDC5, `--with-kawaii-fill-1` #FF6FA5, `--with-kawaii-fill-2` #FF9A66, `--with-kawaii-fill-3` #FFD23A, `--with-kawaii-fill-4` #45D99A, `--with-kawaii-fill-5` #5AB4FF, `--with-kawaii-fill-6` #A98BFF, `--with-kawaii-shine` #FFFFFF, `--with-kawaii-sparkle` #FFB627 |
| `sticker` | `--with-sticker-accent` #FF6FB5, `--with-sticker-bubblegum` #FF6FB5, `--with-sticker-c1` #A96539, `--with-sticker-c2` #2A2120, `--with-sticker-c4` #22A495, `--with-sticker-edge` #FFFFFF, `--with-sticker-grape` #A98BFF, `--with-sticker-ink` #1D1530, `--with-sticker-lemon` #FFD43B, `--with-sticker-mint` #3FDDA4, `--with-sticker-peach` #FF9563, `--with-sticker-shadow` #1D1530, `--with-sticker-shine` #FFFFFF, `--with-sticker-sky` #5BC6FF |
| `pixel` | `--with-pixel-accent` #FF8A1F, `--with-pixel-c2` #E53935, `--with-pixel-c3` #B71C1C, `--with-pixel-ink` #23263A, `--with-pixel-shadow` #7A4A2A, `--with-pixel-shine` #FFFFFF, `--with-pixel-tint` #B9D5F3 |
| `retro` | `--with-retro-1` #F4B53F, `--with-retro-2` #EF7D2D, `--with-retro-3` #DE4B3A, `--with-retro-4` #178A86, `--with-retro-cream` #FFF3D9, `--with-retro-letter` #2A160E, `--with-retro-shadow` #6B3323, `--with-retro-tint` #FFF3D9 |
| `luxe` | `--with-luxe-accent` #E3AE47, `--with-luxe-c1` #2039B4, `--with-luxe-c2` #C0174F, `--with-luxe-c3` #16206E, `--with-luxe-c4` #7B4A12, `--with-luxe-edge` #9CC2FF, `--with-luxe-ink` #0B1033, `--with-luxe-shadow` #0A0B26, `--with-luxe-shine` #FFFFFF, `--with-luxe-tint` #FFEFC4 |
| `bauhaus` | `--with-bauhaus-accent` #2E7A5E, `--with-bauhaus-c1` #E0412E, `--with-bauhaus-c2` #F2B33D, `--with-bauhaus-c3` #2A6BC2, `--with-bauhaus-c4` #2A6BC2, `--with-bauhaus-shadow` #151515, `--with-bauhaus-tint` #F3EBDD |
| `skeuo` | `--with-skeuo-accent` #F1CF98, `--with-skeuo-c1` #5560E0, `--with-skeuo-c2` #BFC7D0, `--with-skeuo-c3` #E0483A, `--with-skeuo-c4` #1E2B3B, `--with-skeuo-ink` #22160F, `--with-skeuo-shadow` #15110D, `--with-skeuo-shine` #FFFFFF, `--with-skeuo-tint` #FFFFFF |
| `anime` | `--with-anime-accent` #FF5D78, `--with-anime-c1` #4BA8F5, `--with-anime-c2` #FF8DB6, `--with-anime-c3` #FFC740, `--with-anime-c4` #5FCF8C, `--with-anime-edge` #BFE6FF, `--with-anime-ink` #2B2148, `--with-anime-shadow` #4B2C8F, `--with-anime-shine` #FFFFFF, `--with-anime-tint` #FFF5EC |
| `gothic` | `--with-gothic-accent` #C79A38, `--with-gothic-c1` #B3163B, `--with-gothic-c2` #2552B4, `--with-gothic-c3` #E6A421, `--with-gothic-c4` #1C8A5F, `--with-gothic-edge` #837A6F, `--with-gothic-ink` #221A26, `--with-gothic-shadow` #140F18, `--with-gothic-shine` #FFF6DE, `--with-gothic-tint` #D3CDC0 |
| `pastel` | `--with-pastel-accent` #FFC3D7, `--with-pastel-c1` #CDBBF7, `--with-pastel-c2` #CDBBF7, `--with-pastel-c3` #FFE29C, `--with-pastel-c4` #ABE6CD, `--with-pastel-edge` #B6A1EF, `--with-pastel-ink` #6A55B8, `--with-pastel-shadow` #9E87E6, `--with-pastel-shine` #FFFFFF, `--with-pastel-tint` #ECE5FC |
| `coquette` | `--with-coquette-accent` #D9A45B, `--with-coquette-c1` #F8BCCB, `--with-coquette-c2` #EC8DA6, `--with-coquette-c3` #D7385F, `--with-coquette-c4` #FCEADD, `--with-coquette-edge` #FFFBF6, `--with-coquette-ink` #7E2443, `--with-coquette-shadow` #A8345C, `--with-coquette-shine` #FFFFFF, `--with-coquette-tint` #FFE4EB |
| `plush` | `--with-plush-accent` #FF8DB4, `--with-plush-c1` #F4695E, `--with-plush-c2` #FFC53D, `--with-plush-c3` #4C9FE6, `--with-plush-c4` #4FBF8A, `--with-plush-edge` #FFF9F0, `--with-plush-ink` #4A2C3D, `--with-plush-shadow` #3A1E46, `--with-plush-shine` #FFFFFF, `--with-plush-tint` #FFF0D9 |
| `clay` | `--with-clay-accent` #E89A1C, `--with-clay-c1` #7B6CFF, `--with-clay-c2` #FFB257, `--with-clay-c3` #FF5C97, `--with-clay-c4` #2CC0A8, `--with-clay-ink` #2A1D5C, `--with-clay-shadow` #24166B, `--with-clay-shine` #FFFFFF, `--with-clay-tint` #E3DEFF |
| `bento` | `--with-bento-accent` #F43F75, `--with-bento-c1` #6366F1, `--with-bento-c2` #2A2120, `--with-bento-c3` #6366F1, `--with-bento-c4` #6366F1, `--with-bento-edge` #EEF0FF, `--with-bento-ink` #1E1B4B, `--with-bento-shadow` #312E81, `--with-bento-shine` #FFFFFF, `--with-bento-tint` #EEF0FF |
| `suite` | `--with-suite-accent` #FF7A3D, `--with-suite-c1` #3478F6, `--with-suite-c2` #7B61F0, `--with-suite-c3` #15A5B8, `--with-suite-c4` #5C9DFF, `--with-suite-edge` #F2F7FF, `--with-suite-ink` #1F4FB8, `--with-suite-shadow` #0B1E5B, `--with-suite-shine` #FFFFFF, `--with-suite-tint` #E4EEFF |
| `dock` | `--with-dock-accent` #FF3B30, `--with-dock-c1` #2F7DF6, `--with-dock-c2` #FFC94A, `--with-dock-c4` #E2E2FF, `--with-dock-ink` #14182B, `--with-dock-shadow` #1545C2, `--with-dock-shine` #FFFFFF, `--with-dock-tint` #DCE8FF |
| `liquid` | `--with-liquid-accent` #FF5F8F, `--with-liquid-c1` #4A9DFF, `--with-liquid-c2` #A77BFF, `--with-liquid-c3` #1C3F9E, `--with-liquid-c4` #FF7EC1, `--with-liquid-edge` #B9E6FF, `--with-liquid-ink` #2A1414, `--with-liquid-shadow` #0C1A3A, `--with-liquid-shine` #FFFFFF, `--with-liquid-tint` #FFE3B0 |
| `chrome` | `--with-chrome-accent` #FF3E9E, `--with-chrome-c1` #8794AA, `--with-chrome-c2` #5E6A82, `--with-chrome-c3` #3E4556, `--with-chrome-c4` #CDB9A4, `--with-chrome-edge` #F4F7FC, `--with-chrome-ink` #10131B, `--with-chrome-shadow` #1A1E2A, `--with-chrome-shine` #FFFFFF, `--with-chrome-tint` #DCE5F2 |
| `soft3d` | `--with-soft3d-accent` #FF6A4D, `--with-soft3d-c1` #E5483F, `--with-soft3d-c2` #EEF1F5, `--with-soft3d-c3` #3A404C, `--with-soft3d-c4` #BFC7D2, `--with-soft3d-edge` #FFF8EE, `--with-soft3d-ink` #2A2226, `--with-soft3d-shadow` #1D2130, `--with-soft3d-shine` #FFFFFF, `--with-soft3d-tint` #A9D8F2 |
| `brutal` | `--with-brutal-accent` #FF8A3D, `--with-brutal-c1` #FFD23F, `--with-brutal-c2` #FF6BA8, `--with-brutal-c3` #4D7CFE, `--with-brutal-c4` #3DDC97, `--with-brutal-shine` #FFFFFF, `--with-brutal-tint` #DDB89C |
| `utsav` | `--with-utsav-accent` #D4A017, `--with-utsav-c1` #F59E0B, `--with-utsav-c2` #F97316, `--with-utsav-c3` #E11D74, `--with-utsav-c4` #0F766E, `--with-utsav-edge` #F4C95D, `--with-utsav-ink` #3B0A45, `--with-utsav-shadow` #5E3518, `--with-utsav-shine` #FFF4DC, `--with-utsav-tint` #E8B48C |
| `rangoli` | `--with-rangoli-accent` #FFC21A, `--with-rangoli-c1` #FFB21F, `--with-rangoli-c2` #F2462C, `--with-rangoli-c3` #E81F7A, `--with-rangoli-c4` #7B2FE0, `--with-rangoli-edge` #7B2FE0, `--with-rangoli-ink` #2B1660, `--with-rangoli-shadow` #5A1240, `--with-rangoli-shine` #FFFFFF, `--with-rangoli-tint` #FFF3D8 |
| `halloween` | `--with-halloween-accent` #FFB52E, `--with-halloween-c1` #FF9F2E, `--with-halloween-c2` #E5530F, `--with-halloween-c3` #8B55E0, `--with-halloween-c4` #86D13A, `--with-halloween-edge` #7344C9, `--with-halloween-ink` #1D1029, `--with-halloween-shadow` #2A1642, `--with-halloween-shine` #FFF6E2, `--with-halloween-tint` #FFF1B8 |
| `christmas` | `--with-christmas-accent` #F4C24D, `--with-christmas-c1` #C8203A, `--with-christmas-c2` #1F6E46, `--with-christmas-c3` #E2A93B, `--with-christmas-c4` #FFF5E6, `--with-christmas-edge` #FFB347, `--with-christmas-ink` #3A0F17, `--with-christmas-shadow` #4A0716, `--with-christmas-shine` #FFFFFF, `--with-christmas-tint` #C9DAEC |
| `lunar` | `--with-lunar-accent` #E8B030, `--with-lunar-c1` #E8282E, `--with-lunar-c2` #B0101E, `--with-lunar-c3` #11896A, `--with-lunar-c4` #E8B030, `--with-lunar-edge` #A8700F, `--with-lunar-ink` #4A0A10, `--with-lunar-shadow` #5E3518, `--with-lunar-shine` #FFEBA6, `--with-lunar-tint` #FFF1D6 |
| `valentine` | `--with-valentine-accent` #5DB86A, `--with-valentine-c1` #FF6B8E, `--with-valentine-c2` #E8304F, `--with-valentine-c3` #8B4A36, `--with-valentine-c4` #FFF3E3, `--with-valentine-edge` #FF8FB0, `--with-valentine-ink` #6A1B3A, `--with-valentine-shadow` #A3163F, `--with-valentine-shine` #FFFFFF, `--with-valentine-tint` #F5C451 |
<!-- palettes:end -->

## Sizing

- 16px for dense tables and inline text, 20px for buttons and inputs, 24px (default) for nav and toolbars, and 32-64px for feature cards.
- `absoluteStrokeWidth` keeps a 1.75px stroke at 48px, which matches line icons of different sizes in one row.
- Pixel icons look sharpest at 16, 32 and 48px (whole multiples of their grid).
