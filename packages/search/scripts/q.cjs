// dev helper: node packages/search/scripts/q.cjs "query" ...   (DEBUG=1 for per-token scoring)
const path = require('path')
const W = require(path.join(__dirname, '..', 'dist', 'index.cjs'))
const idx = require(path.join(__dirname, '..', 'dist', 'index.json'))
const e = W.create(idx)
const dbg = !!process.env.DEBUG
for (const q of process.argv.slice(2)) {
  const r = e.search(q, { limit: dbg ? 4 : 5, debug: dbg })
  if (dbg) { console.log('== ' + q); for (const x of r) console.log('  ', x.name, x.score, JSON.stringify(x.debug)); continue }
  console.log(q.padEnd(20), r.map(x => x.name + ':' + x.score + '(' + x.match.field[0] + ':' + x.match.term + (x.match.typo ? '~' : '') + ')').join('  '))
}
