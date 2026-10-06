// node --test packages/cli/test/animated.test.mjs
// Animated exports, frame by frame, through the CLI source (src/cli.mjs: no bundle needed): exact sizes up to 2048 px
// (1080 for Instagram at the default frame rate), clear errors instead of a silently smaller file, cast shadows that
// travel with the object (no hollow ghost left behind), and padding that covers the whole motion.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { decodeGif } from './anim-decode.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const cli = path.join(here, '..', 'src', 'cli.mjs')
let hasRenderer = true
try { createRequire(cli).resolve('@resvg/resvg-js') } catch {
  try { createRequire(path.join(here, '..', '..', '..', 'package.json')).resolve('@resvg/resvg-js') } catch { hasRenderer = false }
}
const R = { skip: !hasRenderer && 'no @resvg/resvg-js', timeout: 180000 }
let tmp, n = 0
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-anim-')) })
after(() => { fs.rmSync(tmp, { recursive: true, force: true }) })
const run = args => {
  const r = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd: tmp, env: { ...process.env, NO_COLOR: '1' } })
  return { status: r.status, stdout: r.stdout, stderr: r.stderr }
}
function gif(...args) {
  const out = path.join(tmp, 'o' + n++)
  const r = run(['export', ...args, '--format', 'gif', '--out', out, '--json'])
  assert.equal(r.status, 0, r.stderr + r.stdout)
  const f = JSON.parse(r.stdout).files[0]
  return decodeGif(fs.readFileSync(f.file))
}
// opaque bounding box of a frame: [x0, y0, x1, y1] (inclusive) or null
function box(rgba, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rgba[(y * w + x) * 4 + 3] > 127) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y }
  return x1 < 0 ? null : [x0, y0, x1, y1]
}

test('gif at 1080 px (Instagram) at the default frame rate: exactly 1080 x 1080, every frame', R, () => {
  const g = gif('coffee', '--style', 'retro', '--size', '1080', '--background', '#6F4E37', '--motion', 'breathe', '--seconds', '3.4')
  assert.equal(g.width, 1080)
  assert.equal(g.height, 1080)
  assert.ok(g.frames.length >= 60, 'the default 25 fps is kept: ' + g.frames.length + ' frames')
})

test('sizes are never changed silently: too large is an error that says what fits', R, () => {
  const huge = run(['export', 'coffee', '--format', 'gif', '--size', '4000', '--json'])
  assert.notEqual(huge.status, 0)
  assert.match(huge.stdout + huge.stderr, /2048 px/)
  const big = run(['export', 'coffee', '--format', 'gif', '--size', '2048', '--motion', 'breathe', '--seconds', '3.4', '--json'])
  assert.notEqual(big.status, 0)
  const msg = big.stdout + big.stderr
  assert.match(msg, /too_large|Too many pixels/)
  assert.match(msg, /frame rate of \d+ or less/)
  assert.match(msg, /largest size is \d+ px/)
  // the frame rate it suggests works, at the size asked for
  const fps = /frame rate of (\d+) or less/.exec(msg)[1]
  const g = gif('coffee', '--size', '2048', '--motion', 'breathe', '--seconds', '3.4', '--fps', String(Math.min(4, fps)))
  assert.equal(g.width, 2048)
  assert.equal(g.height, 2048)
})

test('cast shadows travel with the object: no hollow ghost left on the ground (retro bounce / float)', R, () => {
  for (const motion of ['bounce', 'float']) {
    const g = gif('heart', '--style', 'retro', '--size', '120', '--motion', motion, '--fps', '20', '--padding', '0.3')
    const boxes = g.frames.map(f => box(f.rgba, g.width, g.height)).filter(Boolean)
    const rest = boxes[0], restH = rest[3] - rest[1]
    // a shadow left behind would stretch the opaque area by the whole lift (bounce: 30% of the icon); travelling with
    // the object it only grows by the lag (12% of the lift) plus the squash
    for (const b of boxes) assert.ok(b[3] - b[1] <= restH * 1.12 + 2, `${motion}: opaque height ${b[3] - b[1]} vs ${restH} at rest`)
    const lifted = Math.min(...boxes.map(b => b[1]))
    assert.ok(lifted < rest[1] - 2, motion + ' moves the icon')
  }
})

test('padding covers the whole motion: a bounce never touches the edge, even with a small --padding', R, () => {
  for (const extra of [[], ['--padding', '0.14'], ['--padding', '0']]) {
    const g = gif('coffee', '--style', 'retro', '--size', '96', '--motion', 'bounce', '--fps', '25', ...extra)
    for (const [i, f] of g.frames.entries()) {
      const b = box(f.rgba, g.width, g.height)
      if (!b) continue
      assert.ok(b[0] > 0 && b[1] > 0 && b[2] < g.width - 1 && b[3] < g.height - 1, `frame ${i} ${extra.join(' ')}: touches the edge ${b}`)
    }
  }
})
