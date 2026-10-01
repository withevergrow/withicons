# @withicons/search

The search engine behind [withicons.com](https://withicons.com), the `withicons` CLI and the `@withicons/mcp` server:
a fast, typo-tolerant, dependency-free icon search over the 300 **with icons** (x 7 styles), with a prebuilt index.

> Not published yet — launching soon. Until then, use the copies on withicons.com (`/vendor/with/search.js`, `/data/search-index.js`).

```js
import { create } from '@withicons/search'
import index from '@withicons/search/data'      // prebuilt index (~101 KB raw, ~40 KB gzip)

const engine = create(index)
engine.search('throw away', { limit: 5 })
// [{ name: 'trash', title: 'Trash', category: 'actions', score: 113.8,
//    match: { field: 'synonym', term: 'throw away', typo: false, kind: 'exact' } }, ...]
engine.search('settigns')                  // typo -> settings
engine.search('skedule')                   // phonetic -> calendar (match.kind: 'phonetic')
engine.didYouMean('kalender')              // 'calendar'  ("Showing results for calendar")
engine.search('cloud', { category: 'weather', style: 'solid' })
engine.suggest('calender', 3)              // ['calendar', ...]  did-you-mean
engine.resolve('bin')                      // { name: 'trash', alias: 'bin' }
engine.resolve('setings')                  // { unknown: true, nearest: ['settings', ...] }
```

CommonJS: `const { create } = require('@withicons/search'); const index = require('@withicons/search/data')`.

Browser, no build step:

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/search@0.1.0/dist/with-search.js"></script>  <!-- window.WithSearch -->
<script>
  fetch('https://cdn.jsdelivr.net/npm/@withicons/search@0.1.0/dist/index.json').then(r => r.json()).then(index => {
    const engine = WithSearch.create(index)
    console.log(engine.search('magnifying glass'))
  })
</script>
```

## API

| | |
|---|---|
| `create(index)` | build an engine (≈ 40 ms once; the trigram table for typos is built lazily) |
| `engine.search(query, { limit = 24, category, style })` | ranked results `{ name, title, category, score, match: { field, term, typo, kind } }`. `field` is one of `name`, `alias`, `synonym`, `tag`, `category`, `description`. `kind` is how the weakest query word matched: `exact`, `concept` (everyday-word expansion), `stem`, `prefix`, `typo`, `similar` (character n-grams) or `phonetic`; `typo` is `true` for the last three. An empty query with a `category` lists that category. |
| `engine.didYouMean(query)` | the query as the top result understood it (`'calandar'` -> `'calendar'`, `'lightbulbidea'` -> `'lightbulb idea'`, `'hart'` -> `'heart'`), or `null` when nothing was corrected. A word still being typed (a prefix of a real word) is never "corrected". |
| `engine.warm()` | build the lazily created typo / similarity tables now (≈ 15–30 ms, e.g. from `requestIdleCallback`) rather than on the first misspelled query |
| `engine.suggest(query, n = 5)` | did-you-mean icon names |
| `engine.resolve(name)` | `{ name }` (canonical name or unique alias, any case: `ArrowRight`, `arrow_right`, `HomeIcon`), `{ ambiguous: [...] }` (alias shared by several icons) or `{ unknown: true, nearest: [...] }`. Uses names and aliases only, never synonyms. |
| `engine.parse(query)` | the tokens the engine searches for, plus a style named in the query (`"solid home"` -> `style: 'solid'`) |
| `engine.styles()` `engine.categories()` `engine.icons(category?)` `engine.get(name)` | catalogue helpers |
| `words`, `stem`, `fold`, `distance`, `weightedDistance`, `phonetic`, `titleOf` | the text primitives, exported for reuse |

## How it ranks

- **Normalisation**: case and diacritic folding (`Café` = `cafe`), kebab / camel / snake / Pascal splitting (`ArrowRight`, `arrow_right`), `&` -> and, possessives dropped.
- **Fields**, strongest first: name (100) > alias (85) > synonym (66) > tag (56) > category (40) > description (24).
- **Match quality**, strongest first: exact (1.0) > prefix for the word being typed (0.62–0.85, longer prefixes score higher) > stem (0.66: plurals, -ing, -ed, -er — `deleting` = `delete`) > typo (0.53 for an adjacent-key slip, 0.5 for one edit, 0.36 for two) > phonetic (≈ 0.32) > n-gram similar (0.24–0.3). A word that matches a short entry outright (alias `delete`) beats one buried in a long entry (`delete file`).
- **Typos**: Damerau-Levenshtein (transpositions count as one edit) with length-scaled limits (none up to 3 letters, 1 up to 7, 2 up to 11, then 3); candidates come from a trigram index (or a length bucket for short words), so a query stays well under a millisecond. Short words must keep their first letter (`food` never becomes `good`).
- **Similarity layer** (only for words that nothing exact, stem, prefix or one-edit typo explains, and always scored below a typo of the same word):
  - *keyboard- and sound-aware edits*: `weightedDistance` charges half an edit for an adjacent QWERTY key (`sesrch`, `homr`), a doubled or dropped double letter (`setttings`, `hamer`) or a near-silent letter (the c of `ck`, the h of `ph`/`sh`/`th`, a final e: `lok` -> lock), 0.6 for sound-alikes (c/k/s, f/v, i/y, g/j) and 0.75 for a vowel swap or transposition. One extra cheap edit is allowed beyond the length budget (`ksy` -> key) for words with no other match.
  - *phonetic keys*: a compact Metaphone-style key per name / alias / synonym / tag word (`fone` = `phone`, `kalender` = `calendar`, `skedule` = `schedule`, `sizzors` = `scissors`, `skware` = `square`), verified by a length-scaled edit limit.
  - *character n-grams*: padded-bigram Dice similarity (≥ 0.65) against every naming word catches heavier misspellings of long words.
  - *spacing*: run-together words split into two known words (`lightbulbidea` -> `lightbulb idea`), split words join (`key board` -> keyboard), and joined typos match compact forms (`creditcrad` -> credit card).
  - a misspelling the data itself carries as a synonym (`hart`, `calender`, `umbrela`) is reported as a typo, so `didYouMean` can point at the real word.
- **Several words**: every meaningful word must match (AND); stopwords (`an icon for ...`) and UI words (`button`, `outline`) are optional. If nothing matches all words — or the full matches are only noise — partial matches are ranked instead (OR fallback). Words in one alias/synonym, in order and adjacent, earn a phrase bonus (`recycle bin`), and joined spellings match (`trash can` = `trashcan`, `sign in` = `signin`).
- **Natural language**: a small concept map adds weaker expansions for everyday words (`money` -> dollar / coins / banknote / wallet, `profile` -> user, `preferences` -> settings / sliders). Expansions are plain vocabulary, scored below direct matches, and only help icons that carry those words themselves.
- **Ties** break on a tiny prior (richly described, base-name icons first), then alphabetically — results are fully deterministic.

## Index format

`{ format: 'withicons-search@1', version, styles: [[name, title]], categories: [name], icons: [[name, categoryIndex, 'alias|…', 'synonym|…', 'tag|…', 'description words', missingStyleMask?]] }` —
generated by `forge/lib/emit-search.mjs` from the icon skeletons (`forge/icons/*.json`).

MIT © with icons — powered by Evergrow
