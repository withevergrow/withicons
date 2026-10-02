// Every live icon x defaults + every example renders a valid SVG in the given styles. The styles are split over
// several test files so node --test renders them in parallel processes (the richest styles take 50-200 ms an icon).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, svgProblems } from './_setup.mjs'

export const GROUPS = [['gloss', 'sticker'], ['glass', 'skeuo'], ['luxe'], ['retro', 'bauhaus']]
export async function suite(pick) {
  const L = await load('index.js')
  const grouped = GROUPS.flat()
  const names = pick === 'rest' ? L.styles.map(s => s.name).filter(n => !grouped.includes(n)) : pick.filter(n => L.styles.some(s => s.name === n))
  for (const style of names) {
    test(`every live icon renders in ${style}`, () => {
      const bad = []
      for (const name of L.list()) {
        const meta = L.get(name)
        for (const ex of [meta.defaults, ...meta.examples]) {
          let svg
          try { svg = L.render(name, ex, style) } catch (e) { bad.push(`${name} ${JSON.stringify(ex)}: threw ${e.message}`); continue }
          const p = svgProblems(svg)
          if (p.length) bad.push(`${name} ${JSON.stringify(ex)}: ${p.join('; ')}`)
        }
      }
      assert.deepEqual(bad, [])
    })
  }
}
