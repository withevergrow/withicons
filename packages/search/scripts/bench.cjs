// dev helper: node packages/search/scripts/bench.cjs
const path = require('path')
const W = require(path.join(__dirname, '..', 'dist', 'index.cjs')); const idx = require(path.join(__dirname, '..', 'dist', 'index.json'))
for (let r = 0; r < 3; r++) { const t = performance.now(); W.create(idx); console.log('create ms', (performance.now() - t).toFixed(1)) }
const e = W.create(idx)
const qs = ['trash can', 'throw away', 'settigns', 'calender', 'notificaton bell', 'h', 'ho', 'hom', 'money', 'a picture of a cat', 'arrow pointing right', 'xyzzy plugh', 'recieve mail', 'umbrela', 'keybord shortcuts']
for (const q of qs) e.search(q)
const t = performance.now(); let n = 0
for (let r = 0; r < 50; r++) for (const q of qs) { e.search(q); n++ }
console.log('avg query ms', ((performance.now() - t) / n).toFixed(3))
for (const q of qs) { const t = performance.now(); for (let r = 0; r < 50; r++) e.search(q); console.log(q.padEnd(22), ((performance.now() - t) / 50).toFixed(3)) }
