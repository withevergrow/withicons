// Size budget (scripts/package-budget.mjs): jsDelivr serves at most 150 MB per package version and ~20 MB per file,
// so the publishable files stay under 120 MB unpacked (headroom for new icons) and no file goes over 20 MB.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { measure, overBudget } from '../../../scripts/package-budget.mjs'

const dir = new URL('..', import.meta.url)
const skip = !fs.existsSync(new URL('../dist', import.meta.url)) && 'build first: node forge/build.mjs'

test('fits the jsDelivr size budget', { skip }, () => {
  const m = measure(dir)
  assert.deepEqual(overBudget(m), [], `${m.name}: ${(m.total / 1048576).toFixed(1)} MB in ${m.files} files`)
})

// Per-icon entry points: each icon file imports only the style table and its style's small shared values module, so a
// deep import (or an unbundled CDN copy) loads one icon, never its whole style.
test('per-icon files: one icon each, small shared values', { skip }, () => {
  const dist = new URL('../dist/', import.meta.url)
  const styles = fs.readdirSync(dist).filter(d => fs.existsSync(new URL(`${d}/index.mjs`, dist)))
  assert.ok(styles.length > 1)
  for (const s of styles) {
    const src = fs.readFileSync(new URL(`${s}/icons/home.mjs`, dist), 'utf8')
    const deps = [...src.matchAll(/from '(\.[^']+)'/g)].map(m => m[1])
    assert.ok(deps.every(d => d === '../../styles.mjs' || d === '../values.mjs'), `${s}: ${deps}`)
    assert.ok(fs.statSync(new URL(`${s}/values.mjs`, dist)).size < 16 * 1024, `${s}/values.mjs stays small`)
  }
})
