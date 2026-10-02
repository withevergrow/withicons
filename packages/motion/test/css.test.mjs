// node --test packages/motion/test/*.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { read, load, repo, inRepo } from './_setup.mjs'

const css = read('motion.css')
const icons = read('icons.css')
const { PRESETS, EFFECTS, PRESET_DEFAULTS, EFFECT_DEFAULTS } = await load('index.js')
const { hasLoopVariant } = await load('meta.js')

const keyframes = new Set([...css.matchAll(/@keyframes ([\w-]+)\{/g)].map(m => m[1]))

test('the preset and effect vocabulary matches forge/MOTION.md (check-motion)', async () => {
  if (!inRepo) return
  const cm = await import(pathToFileURL(path.join(repo, 'forge', 'tools', 'check-motion.mjs')).href)
  assert.deepEqual([...PRESETS].sort(), [...cm.PRESETS].sort())
  assert.deepEqual([...EFFECTS].sort(), [...cm.EFFECTS].sort())
})

for (const p of PRESETS) {
  test(`preset ${p}: keyframes, loop variant and explicit class`, () => {
    assert.ok(keyframes.has('wm-' + p), `@keyframes wm-${p}`)
    if (hasLoopVariant(p)) assert.ok(keyframes.has(`wm-${p}-loop`), `@keyframes wm-${p}-loop`)
    assert.ok(css.includes(`.wm-p-${p},with-icon[preset="${p}"]{`), `.wm-p-${p}`)
    const d = PRESET_DEFAULTS[p]
    assert.ok(d.shot >= 0.3 && d.cycle >= d.shot, `${p} durations`)
  })
}
for (const e of EFFECTS) {
  test(`swap effect ${e}: loop keyframes and rules`, () => {
    assert.ok(keyframes.has(`wm-fx-${e}-a`) && keyframes.has(`wm-fx-${e}-b`), `@keyframes wm-fx-${e}-a/b`)
    assert.ok(css.includes(`.wm-fx-${e}`), `.wm-fx-${e}`)
    assert.ok(EFFECT_DEFAULTS[e].dur > 0)
  })
}

test('draw keyframes and stroke rules exist', () => {
  for (const k of ['wm-draw-path', 'wm-draw-path-loop', 'wm-draw-fill', 'wm-draw-fill-loop']) assert.ok(keyframes.has(k), k)
  assert.match(css, /\.wm-drawing \[data-wm-pl\]\{stroke-dasharray:1 1\.5;animation:wm-draw-path-loop/)
})

test('every keyframes block starts and ends at rest-compatible stops (0% and 100%)', () => {
  for (const m of css.matchAll(/@keyframes ([\w-]+)\{(.*?\})\}/g)) {
    assert.ok(m[2].startsWith('0%{'), `${m[1]} starts at 0%`)
    assert.ok(/100%\{[^}]*\}$/.test(m[2]), `${m[1]} ends at 100%`)
  }
})

test('triggers, swap states and reduced motion are wired', () => {
  for (const s of ['.wm-loop', '.wm-trigger:hover .wm-hover:not(.wm-js)', '.wm-hover:not(.wm-js):focus-visible', '.wm-once', '.wm-run', '.wm-paused',
    '.wm-swap.is-on', '.wm-swap[aria-pressed="true"]', '[aria-expanded="true"] .wm-swap', 'with-icon[motion="loop"]',
    '@media (prefers-reduced-motion:reduce)', ':not(.wm-force)', 'svg .wm{transform-box:view-box}', '--wm-swap-dur', '--wm-delay']) {
    assert.ok(css.includes(s), s)
  }
  for (const v of ['--wm-ox', '--wm-oy', '--wm-dx', '--wm-dy', '--wm-k', '--wm-dur', '--wm-steps']) assert.ok(css.includes(v), v)
})

test('CSS is well formed (balanced braces, no undefined / NaN)', () => {
  for (const [name, s] of [['motion.css', css], ['icons.css', icons]]) {
    let depth = 0
    for (const ch of s) { if (ch === '{') depth++; else if (ch === '}') depth--; assert.ok(depth >= 0, name + ' brace underflow') }
    assert.equal(depth, 0, name + ' balanced')
    assert.ok(!/undefined|NaN|\[object/.test(s), name + ' has no undefined/NaN')
  }
})

test('the website copies are in sync with dist', () => {
  if (!inRepo) return
  const site = fs.readFileSync(path.join(repo, 'site', 'vendor', 'motion', 'motion.css'), 'utf8')
  assert.ok(site.startsWith(css) && site.includes(icons), 'site motion.css = motion.css + icons.css')
  const js = fs.readFileSync(path.join(repo, 'site', 'vendor', 'motion', 'motion.js'), 'utf8')
  assert.match(js, /window\.WithMotion = api/)
})

test('swap previews never override state: hover only with a real hover, neither on stateful controls', () => {
  const NS = ':not([aria-pressed]):not([aria-expanded]):not([aria-checked])'
  const OWN = ':not(.wm-js):not(.wm-swap-focus):not(.wm-swap-auto):not(.wm-loop)'
  assert.ok(!css.includes('.wm-trigger:hover .wm-swap>'), 'no unconditional hover preview')
  assert.ok(!css.includes('.wm-trigger:focus-visible .wm-swap>'), 'no unconditional focus preview')
  const media = /@media \(hover:hover\)\{([\s\S]*?)\n\}/.exec(css)
  assert.ok(media, '@media (hover:hover) block')
  assert.ok(media[1].includes(`.wm-trigger${NS}:hover .wm-swap${NS}${OWN}>.wm-b`), 'hover preview inside the media query, stateless triggers only')
  assert.ok(media[1].includes(`.wm-swap.wm-trigger${NS}${OWN}:hover>.wm-b`))
  assert.ok(!/:focus-visible/.test(media[1]))
  const outside = css.replace(media[0], '')
  assert.ok(outside.includes(`.wm-trigger${NS}:focus-visible .wm-swap${NS}${OWN}>.wm-b`), 'keyboard preview on stateless triggers')
  assert.ok(!/(^|[^)]):hover \.wm-swap/.test(outside), 'no hover preview outside the media query')
})

test('slides clip with clip-path (Safari 7+), not overflow:clip / overflow-clip-margin', () => {
  assert.ok(css.includes('.wm-fx-slide-right){clip-path:inset(-.15em)}'))
  assert.ok(!css.includes('overflow-clip-margin') && !css.includes('overflow:clip'))
})

test('glow / twinkle have a halo without color-mix() (@supports fallback keyframes)', () => {
  const m = /@supports not \(color:color-mix\(in srgb,red,red\)\)\{(.*)\}/.exec(css)
  assert.ok(m, '@supports not (color-mix) block')
  for (const k of ['wm-glow', 'wm-twinkle', 'wm-twinkle-loop']) assert.ok(m[1].includes(`@keyframes ${k}{`), k)
  assert.ok(!m[1].includes('color-mix'), 'fallback has no color-mix')
  assert.ok(m[1].includes('drop-shadow(0 0 calc(0.24em * var(--_k)) var(--wm-glow, currentColor))'))
})

test('flicker can not be sped past its flash-safe minimum', () => {
  assert.ok(PRESET_DEFAULTS.flicker.min >= 1.2)
  assert.match(css, /animation:var\(--_an\) max\(var\(--_ad\), var\(--_am\)\) var\(--_ae\) var\(--wm-delay, 0s\) infinite both/)
  assert.match(css, /animation:var\(--_an\) max\(var\(--_ad\), var\(--_am\)\) var\(--_ae\) var\(--wm-delay, 0s\) 1 both/)
  assert.ok(css.includes('--_am:var(--wmP-m, var(--wmL-m, 0s))') && css.includes('--_am:var(--wmP-m, var(--wmH-m, 0s))'))
  assert.ok(/\.wm-p-flicker,with-icon\[preset="flicker"\]\{[^}]*--wmP-m:1\.2s\}/.test(css))
  assert.ok(/\.wm-p-pop,with-icon\[preset="pop"\]\{[^}]*--wmP-m:0s\}/.test(css))
})

test('loops pause offscreen (wm-offscreen) like wm-paused', () => {
  assert.ok(css.includes(':is(.wm-paused,.wm-offscreen),'))
  assert.ok(css.includes('.wm-swap.wm-loop:is(.wm-paused,.wm-offscreen)>*{animation-play-state:paused}'))
})

test('per-swap timing variables: defaults keep the original look', () => {
  for (const v of ['--wm-swap-dur', '--wm-swap-ease', '--wm-swap-delay', '--wm-swap-hold']) assert.ok(css.includes(v), v)
  assert.ok(css.includes('--_sdl:var(--wm-swap-delay, 0s)'), 'delay defaults to 0s')
  assert.ok(css.includes('transform var(--_sd) var(--wm-swap-ease, cubic-bezier(.3,1.45,.55,1))'), 'spring effects keep their spring unless --wm-swap-ease is set')
  assert.ok(css.includes('var(--wm-swap-ease, cubic-bezier(.22,1,.36,1))'), 'other effects keep their soft landing')
})

test('auto swaps (wm-swap-auto): CSS loop with hold, never on script-driven wrappers; focus swaps (wm-swap-focus)', () => {
  for (const e of EFFECTS) assert.ok(keyframes.has(`wm-fx-${e}-auto-a`) && keyframes.has(`wm-fx-${e}-auto-b`), e)
  assert.ok(css.includes('.wm-swap.wm-swap-auto:not(.wm-js)>*{transition:none;animation:var(--_fxaa, wm-fx-fade-auto-a) var(--wm-swap-cycle, calc(2 * (var(--_sd) + var(--wm-swap-hold, 0.9s))))'))
  assert.ok(css.includes('.wm-trigger:focus-within .wm-swap.wm-swap-focus:not(.wm-js)>.wm-b'))
  assert.ok(css.includes('.wm-swap.wm-swap-focus:not(.wm-js):focus-within>.wm-b'))
  const media = /@media \(hover:hover\)\{([\s\S]*?)\n\}/.exec(css)
  assert.ok(!media[1].includes('wm-swap-focus:not(.wm-js)>'), 'focus swaps do not preview on hover')
})
