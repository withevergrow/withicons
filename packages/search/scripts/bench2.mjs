// dev helper: node packages/search/scripts/bench2.mjs -> cold/warm timings over every test query
import { create } from '../dist/index.js'
import index from '../dist/data.js'
import { CASES, HARD, MISSPELL } from '../test/cases.mjs'
let t = performance.now(); const e = create(index); console.log('create ms', (performance.now() - t).toFixed(2))
t = performance.now(); e.search('sizzors'); console.log('first similarity query (lazy index build) ms', (performance.now() - t).toFixed(2))
const qs = [...CASES, ...HARD, ...MISSPELL].map(c => c[0]).concat(['tr', 'c', 'h', 'xqzvwk', 'a picture of a cat', 'arrow pointing right'])
for (const q of qs) { e.search(q); e.didYouMean(q) }
t = performance.now(); let n = 0
for (let r = 0; r < 20; r++) for (const q of qs) { e.search(q); n++ }
console.log('avg search ms', ((performance.now() - t) / n).toFixed(3), 'over', qs.length, 'queries')
const worst = qs.map(q => { const t = performance.now(); for (let r = 0; r < 10; r++) e.search(q); return [q, (performance.now() - t) / 10] }).sort((a, b) => b[1] - a[1])
console.log('worst', worst.slice(0, 6).map(([q, ms]) => q + ' ' + ms.toFixed(3)).join(' | '))
t = performance.now(); for (let r = 0; r < 5; r++) for (const q of qs) e.didYouMean(q)
console.log('avg didYouMean ms', ((performance.now() - t) / (5 * qs.length)).toFixed(3))
