# @withicons/search

The search engine behind [withicons.com](https://withicons.com), the `withicons` CLI and the `@withicons/mcp` server:
a fast, typo-tolerant, dependency-free search over all {{icons}} icons of **with icons** ({{styles}} styles: {{styleList}}), with a prebuilt index.
Style words in a query pick a style: `cute heart` -> kawaii, `8-bit star` -> pixel, `frosted bell` -> glass, `y2k star` -> sticker,
`vintage camera` -> retro, `3d rocket` -> luxe, `bauhaus clock` -> bauhaus, `skeuomorphic camera` -> skeuo,
`manga heart` -> anime, `medieval key` -> gothic, `soft cloud` -> pastel, `girly star` -> coquette, `toy rocket` -> plush, `two tone heart` -> duo, `etched coin` -> engrave, `doodle cat` -> sketch, `blueprint home` -> blueprint,
`outline star` -> line (see `parse(query).style`).

```bash
npm i @withicons/search
```

```js
import { create } from '@withicons/search'
import index from '@withicons/search/data'      // prebuilt index (~{{indexKB}} KB raw, ~{{indexGzKB}} KB gzip)

const engine = create(index)
engine.search('throw away', { limit: 5 })
// [{ name: 'trash', title: 'Trash', category: 'actions', score: 119.96,
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
<script src="https://cdn.jsdelivr.net/npm/@withicons/search@latest/dist/with-search.js"></script>  <!-- window.WithSearch -->
<script>
  fetch('https://cdn.jsdelivr.net/npm/@withicons/search@latest/dist/index.json').then(r => r.json()).then(index => {
    const engine = WithSearch.create(index)
    console.log(engine.search('magnifying glass'))
  })
</script>
```

## API

| | |
|---|---|
| `create(index)` | build an engine (tens of milliseconds, once; the typo and similarity tables are built lazily) |
| `engine.search(query, { limit = 24, category, style, tags })` | ranked results `{ name, title, category, score, confidence, weak?, match: { field, term, typo, kind } }`. `confidence` is `high` (what the query names), `medium` (a spelling fix, a related concept, a partial match that misses only a modifier) or `low` (a guess: show it as "related"; such results also carry `weak: true`). Filters rank within the filtered set with the same model. `field` is one of `name`, `alias`, `synonym`, `tag`, `category`, `description`. `kind` is how the weakest query word matched: `exact`, `concept` (everyday-word expansion), `stem`, `prefix`, `typo`, `similar` (character n-grams) or `phonetic`; `typo` is `true` for the last three. An empty query with a `category` lists that category. |
| `engine.query(query, { limit, category, style, tags, outside = true })` | the rich form for UIs and agents: `{ query, results, total, best, confidence, parsed: { words, style, category, any }, outside?, didYouMean?, browse? }`. `outside` lists the strongest matches a filter hid when the filtered set is weak (`truck` in `food` -> truck in commerce); `browse` (categories) comes back instead of noise when nothing matches. |
| `engine.didYouMean(query)` | the query as the top result understood it (`'calandar'` -> `'calendar'`, `'lightbulbidea'` -> `'lightbulb idea'`, `'hart'` -> `'heart'`), or `null` when nothing was corrected. A word still being typed (a prefix of a real word) is never "corrected". |
| `engine.warm()` | build the lazily created typo / similarity tables now (e.g. from `requestIdleCallback`) rather than on the first misspelled query |
| `engine.suggest(query, n = 5)` | did-you-mean icon names |
| `engine.resolve(name)` | `{ name }` (canonical name or unique alias, any case: `ArrowRight`, `arrow_right`, `HomeIcon`), `{ ambiguous: [...] }` (alias shared by several icons) or `{ unknown: true, nearest: [...] }`. Uses names and aliases only, never synonyms. |
| `engine.parse(query)` | `{ all, words, required, soft, style, split, category, segments }`: the words the engine searches for (`required` must all match, `soft` only add score) and a style named in the query (`"solid home"` -> `style: 'solid'`; `"glass of water"` stays content), a category it names (`"weather icons"` -> `'weather'`) and the sides of an `x and y` / `x or y` query |
| `engine.styles()` `engine.categories()` `engine.icons(category?)` `engine.get(name)` | catalogue helpers |
| `engine.version` `engine.dataVersion` `engine.size` `ENGINE_VERSION` | engine version, index (library) version, number of icons |
| `words`, `stem`, `fold`, `distance`, `weightedDistance`, `phonetic`, `variants`, `titleOf` | the text primitives, exported for reuse |

## How it ranks

- **Normalisation**: case and diacritic folding (`Café` = `cafe`), kebab / camel / snake / Pascal splitting (`ArrowRight`, `arrow_right`), `&` -> and, possessives dropped.
- **Fields**, strongest first: name (100) > alias (85) > synonym (66) > tag (56) > category (40) > description (24).
- **Match quality**, strongest first: exact (1.0) > prefix for the word being typed (0.62–0.85, longer prefixes score higher) > stem (0.66: plurals, -ing, -ed, -er — `deleting` = `delete`) > typo (0.53 for an adjacent-key slip, 0.5 for one edit, 0.36 for two) > phonetic (≈ 0.32) > n-gram similar (0.24–0.3). A word that matches a short entry outright (alias `delete`) beats one buried in a long entry (`delete file`).
- **Typos**: Damerau-Levenshtein (transpositions count as one edit) with length-scaled limits (none up to 3 letters, 1 up to 7, 2 up to 11, then 3); candidates come from a trigram index (or a length bucket for short words), so a query typically takes well under a millisecond. Short words must keep their first letter (`food` never becomes `good`). A real word is never a typo: words in the vocabulary, everyday words the concept map knows (`dinner` is not `diner`, `plate` is not `plane`) and style words (`kawaii` is not `hawaii`; `blueprint` is never split into `blue print`) are left alone. A word that matches some icons as typed (exactly, by stem or by meaning) is real too, so its spelling corrections elsewhere are dropped (`towel` never becomes `tower`, `prenatal` never `rental`); when the typed form is a name/alias/synonym word, its other inflections score a little lower (`tracking` ranks location and delivery above a music `track`).
- **Similarity layer** (only for words that nothing exact, stem, prefix or one-edit typo explains, and always scored below a typo of the same word):
  - *keyboard- and sound-aware edits*: `weightedDistance` charges half an edit for an adjacent QWERTY key (`sesrch`, `homr`), a doubled or dropped double letter (`setttings`, `hamer`) or a near-silent letter (the c of `ck`, the h of `ph`/`sh`/`th`, a final e: `lok` -> lock), 0.6 for sound-alikes (c/k/s, f/v, i/y, g/j) and 0.75 for a vowel swap or transposition. One extra cheap edit is allowed beyond the length budget (`ksy` -> key) for words with no other match.
  - *phonetic keys*: a compact Metaphone-style key per name / alias / synonym / tag word (`fone` = `phone`, `kalender` = `calendar`, `skedule` = `schedule`, `sizzors` = `scissors`, `skware` = `square`), verified by a length-scaled edit limit.
  - *character n-grams*: padded-bigram Dice similarity (≥ 0.65) against every naming word catches heavier misspellings of long words.
  - *spacing*: run-together words split into two known words (`lightbulbidea` -> `lightbulb idea`), split words join (`key board` -> keyboard), and joined typos match compact forms (`creditcrad` -> credit card).
  - a misspelling the data itself carries as a synonym (`hart`, `calender`, `umbrela`) is reported as a typo, so `didYouMean` can point at the real word.
- **Several words**: every query word adds its own evidence. Icons that match every meaningful word (AND) rank first for equal strength; stopwords (`an icon for ...`) and UI words (`button`, `outline`) are optional. Icons that strongly match only some words still compete, at 0.9x their share (`fast delivery` -> truck, motorcycle, then pizza), while a partial match made only of corrected or half-typed words is a guess and ranks far below (`yoga mat` never turns into math / match). Words in one alias/synonym, in order and adjacent, earn a phrase bonus (`recycle bin`, `secure payment`), and joined spellings match (`trash can` = `trashcan`, `sign in` = `signin`).
- **Natural language**: a small concept map adds weaker expansions for everyday words (`money` -> dollar / coins / banknote / wallet, `profile` -> user, `preferences` -> settings / sliders, `dinner` -> utensils / soup, `nba` -> basketball / football, `yoga` -> dumbbell, `meditation` -> brain / wind, `pregnancy` -> hospital). Expansions are plain vocabulary, scored below direct matches, and only help icons that carry those words themselves.
- **Term importance**: generic modifiers (`fast`, `live`, `secure`, `smart`, `new`, `my`, and words the data mostly uses to lead a phrase) weigh half as much as the head noun, so a result that misses only a modifier is still a strong partial match (`fast delivery` -> truck). A one-word query that only *leads* a phrase (`tracking` in "tracking cookie", `baby` in "baby shower") names the modifier, not the thing: it ranks below whole matches, and when nothing names the word itself the results are flagged `low`. A word that is a whole entry (`connection`) beats one buried in a compound (`no-connection`).
- **Real words are not typos**: a compact dictionary of common English words the vocabulary lacks (`bean`, `bear`, `grinder`, `mat`, `lime`, `shoe`) is never spell-corrected, split (`fireworks` is not fire + works) or completed into a different word (`mat` is not math); such a word returns its honest matches or nothing. British / American spellings (`colour`, `centre`, `analyse`, `neighbourhood`, `tyre`) and irregular plurals (`knives`, `mice`) match as the same word.
- **`x and y`, `x or y`**: an icon matching the whole query (`sun or moon` -> sun-moon) leads; then the union of each side's results (`cats and dogs` -> dog, cat). Phrases the data carries (`drag and drop`, `terms and conditions`) stay phrases.
- **Confidence and honesty**: scores are calibrated against the best match of the query (before any filter), the field, how each word matched and how much of the query an icon covers. Results below a noise floor are dropped, a word nothing carries (`yoga`) is answered by its concept with `low` confidence, and gibberish returns `[]`.
- **Ties** break on a tiny prior (richly described, base-name icons first), then alphabetically — results are fully deterministic.

## Index format

`{ format: 'withicons-search@1', version, styles: [[name, title]], categories: [name], icons: [[name, categoryIndex, 'alias|…', 'synonym|…', 'tag|…', 'description words', missingStyleMask?]] }` —
generated by `forge/lib/emit-search.mjs` from the icon skeletons (`forge/icons/*.json`).

MIT © with icons — powered by Evergrow
