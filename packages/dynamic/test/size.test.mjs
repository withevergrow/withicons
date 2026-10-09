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
