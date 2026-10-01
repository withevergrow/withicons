// dev helper: node packages/search/scripts/eval.mjs [MISSPELL|CASES|HARD|all]  -> misses with ranks
import { create } from '../dist/index.js'
import index from '../dist/data.js'
import * as C from '../test/cases.mjs'
const e = create(index)
const which = process.argv[2] || 'MISSPELL'
const sets = which === 'all' ? ['CASES', 'HARD', 'MISSPELL'] : [which]
for (const s of sets) {
  let hit = 0, top1 = 0
  for (const [q, want, n] of C[s]) {
    const ok = [].concat(want), got = e.search(q, { limit: 8 })
    const rank = got.findIndex(g => ok.includes(g.name))
    if (rank === 0) top1++
    if (rank >= 0 && rank < n) hit++
    else console.log(`MISS ${q.padEnd(18)} want ${ok.join('|')}@${n}  got ${got.slice(0, 5).map(r => r.name + ':' + r.score + (r.match.kind ? '/' + r.match.kind : '')).join(' ')}`)
  }
  console.log(`${s}: ${hit}/${C[s].length} top1 ${top1}`)
}
