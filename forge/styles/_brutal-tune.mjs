// BRUTAL per-icon tuning (never in skeletons). Keys:
//   w       ink weight override
//   echo    true: a line-only glyph keeps its line + c1 echo (no fat tube)
//   tube    outer tube width override for line-only glyphs
//   fill    true: never treat as line-only
//   mono    true: every separate field stays c1
//   extra   colours for extra separate fields (default ['c3', 'accent'])
//   detail  colour for closed cutouts / closed A rings (default 'c2')
//   swap    { fromRole: toRole } applied to the computed fields
//   keep    true: a big field framed by features (a face around eyes and a smile) keeps its colour even when
//           the ink leaves it no thick core (people avatars: every avatar-<person> gets it)
// piggy-bank: a lighter pen keeps the ear, tail and coin open; the body prints pink
const T = { snowman: { keep: true, w: 1.5 }, 'dragon-head': { keep: true, w: 1.5 }, 'piggy-bank': { w: 1.3, swap: { c1: 'c2' } } }

const PEOPLE = /^avatar-(man|woman|person|boy|girl|baby|teen|older)/
export const tune = name => T[name] || (PEOPLE.test(name || '') ? { keep: true } : {})
