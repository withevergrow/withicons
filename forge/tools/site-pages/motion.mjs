import fs from 'fs'
import zlib from 'zlib'
// developers.html#motion — docs for @withicons/motion (contract: forge/MOTION.md). Live demos use the site's copy of the
// runtime (site/vendor/motion/motion.css + motion.js, site/data/motion.js) when those files exist.
import { SITE, icon, esc, code, cvar, siteExists, MOTION, PRESETS, EFFECTS, motionVars, ICON_NAMES, STYLES, hasStyle, styleTitle, innerSvg } from './lib.mjs'
import { specVars, decoOf, GROUND_PRESETS } from '../../../packages/motion/src/meta.js'

const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
const HAS = new Set(ICON_NAMES)
const has = n => HAS.has(n)
const soon = '<span class="pg-soon">' + I('sparkles', 'solid', 14) + ' launching on npm soon</span>'

const gz = rel => siteExists(rel) ? (zlib.gzipSync(fs.readFileSync(SITE + '/' + rel)).length / 1024).toFixed(1) + ' KB' : null
function sizeNote() {
  const c = gz('vendor/motion/motion.css'), j = gz('vendor/motion/motion.js')
  return (c ? `All presets in one stylesheet (${c} gzipped)` : 'All presets in one stylesheet') + (j ? `, plus an optional script (${j} gzipped)` : ', plus an optional script') + ' for scroll-triggered motion, swaps from code and the element.'
}
export const MOTION_TOC = [['motion', 'Animations']]

/** Stylesheets / scripts a page needs for live motion demos (only those that exist yet). */
export function motionAssets() {
  return {
    css: ['vendor/motion/motion.css'].filter(siteExists),
    js: ['data/motion.js', 'vendor/motion/motion.js'].filter(siteExists),
  }
}

// An icon whose own loop or hover uses this preset (the spec gives the right pivot / direction), else a sensible default.
const FALLBACK = { spin: 'loader', 'spin-once': 'refresh', tick: 'clock', pulse: 'record', beat: 'heart', breathe: 'moon', float: 'cloud', bounce: 'package', sway: 'leaf', ring: 'bell', wiggle: 'pencil', shake: 'x-circle', nod: 'check', nudge: 'arrow-right', pass: 'arrow-right', rise: 'upload', drop: 'download', blink: 'eye', flicker: 'flame', twinkle: 'star', pop: 'plus', tada: 'trophy', jelly: 'smile', flip: 'coins', rock: 'anchor', tilt: 'search', zoom: 'zoom-in', orbit: 'globe', glow: 'lightbulb', draw: 'check-circle', type: 'keyboard', fill: 'battery' }
const KIND = { loop: 0, hover: 1, alt: 2 }
const PREFER = ['bell', 'heart', 'loader', 'star', 'cloud', 'rocket', 'sun', 'flame', 'eye', 'trophy', 'gift', 'check', 'arrow-right', 'download', 'upload', 'refresh', 'clock', 'leaf', 'search', 'globe', 'lightbulb', 'keyboard', 'battery', 'anchor', 'coins', 'package', 'pencil', 'x-circle', 'plus', 'smile', 'moon', 'zoom-in']
const USED = new Map()
/** The demo icon for a preset: an icon whose own loop uses it (then hover, then alt), each icon used once per page run. */
export function demoFor(preset) {
  if (USED.has(preset)) return USED.get(preset)
  const taken = new Set([...USED.values()].map(d => d.name))
  const r = pickDemo(preset, taken)
  USED.set(preset, r)
  return r
}
function pickDemo(preset, taken) {
  const specs = Object.values(MOTION)
  const score = n => { const i = PREFER.indexOf(n); return i < 0 ? 999 : i }
  const hits = specs.flatMap(sp => [['loop', sp.loop], ['hover', sp.hover], ...(sp.alt || []).map(a => ['alt', a])].filter(([, m]) => m && m.preset === preset).map(([k, m]) => ({ name: sp.name, m, k })))
    .filter(h => !taken.has(h.name))
    .sort((a, b) => (KIND[a.k] - KIND[b.k]) || ((a.name === FALLBACK[preset] ? -1 : 0) - (b.name === FALLBACK[preset] ? -1 : 0)) || (score(a.name) - score(b.name)) || a.name.localeCompare(b.name))
  if (hits.length) return { name: hits[0].name, m: { ...hits[0].m, preset } }
  const n = [FALLBACK[preset], 'star', 'heart'].find(x => x && has(x))
  return { name: n, m: { preset } }
}
/** <span class="wm …"> wrapper around an icon, driven by the CSS variables of a motion object. */
export function wm(name, style, size, m, trigger = 'loop', extra = '') {
  const v = motionVars(m)
  return `<span class="wm wm-${trigger} wm-p-${m.preset}${extra ? ' ' + extra : ''}" data-wm-preset="${m.preset}"${v ? ` style="${v}"` : ''}>${I(name, style, size)}</span>`
}

/** The icon's OWN motion, part by part: no preset class, the spec's loop + parts variables inline (what data-wm and
 *  icons.css do), so plates keep their own move, decorations their own loop and shadows stay on the ground. */
export function wmOwn(name, style, size, spec, extra = '') {
  const v = Object.entries(specVars(spec)).filter(([k]) => k.startsWith('--wmL')).map(([k, x]) => k + ':' + x)
  if (extra) v.push(extra)
  return `<span class="wm wm-loop" data-wm-preset="${spec.loop.preset}" style="${v.join(';')}">${I(name, style, size)}</span>`
}

// ---- parts choreography (forge/MOTION.md): demos picked at build time from what the renderers actually tag
const tagged = (n, s, t) => { try { return new RegExp('\\sclass="[^"]*\\bwm-' + t + '\\b').test(innerSvg(n, s)) } catch { return false } }
const PART_NAMES = ['bell', 'trash', 'sun', 'heart', 'rocket', 'gift', 'star', 'cloud', 'trophy', 'mail', 'lock', 'coffee', 'moon', 'flame', 'package', 'balloon', 'camera', 'music', 'lightbulb', 'leaf', 'smile', 'crown', 'sparkles', 'plane', 'cake']
function partsDemos() {
  const names = PART_NAMES.filter(n => has(n) && MOTION[n] && MOTION[n].loop)
  const out = [], used = new Set()
  const take = (kind, list) => { for (const [n, s] of list) if (!used.has(n) && hasStyle(s) && tagged(n, s, kind === 'plate' ? 'a' : kind)) { used.add(n); out.push({ kind, n, s }); return } }
  // a moving part with its own move in the spec (a clapper that rings a beat behind)
  take('plate', names.filter(n => MOTION[n].parts && MOTION[n].parts.A).flatMap(n => [[n, 'line'], [n, 'solid']]))
  // decorations: backdrop shapes, sparkles, hearts
  take('deco', ['bauhaus', 'sticker', 'kawaii'].flatMap(s => names.map(n => [n, s])))
  // a ground shadow under a lift (float, bounce, rise…)
  take('shadow', ['luxe', 'sticker', 'skeuo', 'retro'].flatMap(s => names.filter(n => GROUND_PRESETS.includes(MOTION[n].loop.preset)).map(n => [n, s])))
  const sparkly = ['heart', 'star', 'gift', 'trophy', 'balloon', 'cake', 'crown', 'sparkles'].filter(n => names.includes(n))
  take('deco', ['sticker', 'kawaii', 'bauhaus'].flatMap(s => sparkly.concat(names).map(n => [n, s])))
  return out
}
const DECO_SAY = { breathe: 'breathe in place', float: 'drift gently', twinkle: 'twinkle', still: 'keep still' }
function partsSay(d) {
  const sp = MOTION[d.n], m = sp.loop, A = sp.parts && sp.parts.A
  const say = [`The ${esc(d.n)} plays <code>${m.preset}</code>`]
  if (tagged(d.n, d.s, 'a')) say.push(A ? `its moving part plays <code>${A.preset || m.preset}</code>${A.delay ? ' a beat behind' : ''}` : 'its moving part follows')
  if (tagged(d.n, d.s, 'deco')) { const k = decoOf(m.preset, sp.deco); say.push(k === 'still' ? 'its decorations keep still' : `its decorations ${DECO_SAY[k]} on their own loop`) }
  if (tagged(d.n, d.s, 'shadow')) say.push(GROUND_PRESETS.includes(m.preset) ? 'its shadow stays on the ground and shrinks as it lifts' : 'its shadow moves with it')
  return say.length > 2 ? say.slice(0, -1).join(', ') + ' and ' + say.at(-1) + '.' : say.join(' and ') + '.'
}
function partsSection() {
  const demos = partsDemos()
  const deco = demos.find(d => d.kind === 'deco')
  const card = (d, extra, label, desc) => `<li><div class="mo-preset" style="cursor:auto">
          <span class="mo-demo" aria-hidden="true" style="height:96px;color:${cvar(d.s)}">${wmOwn(d.n, d.s, 56, MOTION[d.n], extra)}</span>
          <code class="mo-name">${label}</code>
          <span class="mo-desc">${desc}</span>
        </div></li>`
  const tags = [
    ['(no class), <code>wm-k</code>', 'the object itself', 'plays the move, about the icon’s pivot'],
    ['<code>wm-a</code>, <code>wm-s</code>', 'a moving part (clapper, lid, hand) and a badge', 'follows the object, or plays its own move from the spec’s <code>parts</code>, with a delay'],
    ['<code>wm-deco</code>', 'decoration: backdrop shapes, sparkles, hearts, stars, confetti, accent dots', 'its own gentle loop (<code>breathe</code>, <code>float</code> or <code>twinkle</code>) about its own centre, out of step with the object. It never spins along'],
    ['<code>wm-shadow</code>', 'cast shadow or ground', 'stays on the ground and shrinks or fades as the object lifts (<code>float</code>, <code>bounce</code>, <code>rise</code>, <code>drop</code>, <code>jelly</code>); otherwise moves with it'],
    ['<code>wm-shine</code>', 'highlight on the object', 'moves with the object'],
  ]
  return `<h3 id="motion-parts">Parts: each piece moves its own way</h3>
      <p>Spinning a whole drawing makes its backdrop square, its sparkles and its shadow spin too, and the icon looks broken. So every style <b>tags what it draws</b>, and the motion moves the parts: a sun turns while its backdrop only breathes, a heart beats while its sparkles twinkle on their own, a rocket lifts while its shadow stays on the ground, and a bell’s clapper rings a beat behind the bell.</p>
      <p>You don’t add anything. It happens whenever an <b>inline SVG</b> sits directly inside a <code>wm</code> wrapper, or in <code>&lt;with-icon&gt;</code>. Icons in <code>&lt;img&gt;</code> and <code>&lt;i class="with …"&gt;</code> tags, swaps and the <code>draw</code> preset still move as one piece.</p>
      ${demos.length ? `<ul class="mo-presets" data-motion-area>
        ${demos.map(d => card(d, '', `${esc(d.n)} · ${esc(styleTitle(d.s))}`, partsSay(d))).join('\n        ')}
        ${deco ? card(deco, '--wm-deco:none', `${esc(deco.n)} · --wm-deco: none`, 'The same icon with its decorations kept still: only the object moves.') : ''}
      </ul>` : ''}
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Tag on an SVG node</th><th>What it is</th><th>While the icon moves</th></tr></thead><tbody>
        ${tags.map(([c, w, d]) => `<tr><td>${c}</td><td>${w}</td><td>${d}</td></tr>`).join('')}
      </tbody></table></div>
      ${code(`<!-- the icon's own moves, part by part (needs icons.css) -->
<span class="wm wm-loop" data-wm="sun"><svg …sun, bauhaus…></svg></span>

<!-- keep the decorations still: only the object moves -->
<span class="wm wm-loop" data-wm="sun" style="--wm-deco: none"><svg …></svg></span>

<!-- or choose their loop: wm-deco-breathe | wm-deco-float | wm-deco-twinkle -->
<span class="wm wm-loop wm-p-spin" style="--wm-deco: wm-deco-float"><svg …></svg></span>`, 'html', 'Decorations')}
      ${code(`import { motion } from '@withicons/motion'

motion(el, 'sun')                       // the sun turns, its backdrop breathes
motion(el, 'sun', { deco: 'still' })    // 'breathe' | 'float' | 'twinkle' | 'still'`, 'js', 'JavaScript')}
      <p class="pg-note">The tags are plain classes (<code>class="wm-deco"</code>): harmless without the motion CSS and kept by every package. A preset you pick (<code>wm-p-spin</code>) moves the object and its parts together, while decorations and shadows keep their own behaviour. Animated SVG, GIF, video and Lottie downloads move part by part too, and record until the decoration loop comes back round.</p>`
}

const SWAPS = [['play', 'pause', 'flip'], ['eye', 'eye-off', 'blur'], ['menu', 'close', 'rotate'], ['sun', 'moon', 'spin'], ['lock', 'unlock', 'slide-up'], ['heart', 'heart@solid', 'scale'], ['bell', 'bell-off', 'morph'], ['copy', 'check', 'fade'], ['volume', 'volume-x', 'slide-left'], ['plus', 'minus', 'rotate']]
function swapPairs() {
  const out = [], seen = new Set()
  const add = (a, b, fx) => {
    const [bn, bs] = b.split('@'), key = a + '>' + b
    if (seen.has(key) || !has(a) || !has(bn) || (bs && !hasStyle(bs))) return
    seen.add(key); out.push({ a, b: bn, bs: bs || null, fx: EFFECTS.includes(fx) ? fx : 'fade' })
  }
  for (const [a, b, fx] of SWAPS) { const sp = MOTION[a] && (MOTION[a].swap || []).find(x => x.to === b); add(a, b, sp ? sp.effect : fx) }
  return out.slice(0, 8)
}
const swapEl = (p, style, size) => `<span class="wm-swap wm-fx-${p.fx}" data-fx="${p.fx}"><span class="wm-a">${I(p.a, style, size)}</span><span class="wm-b">${I(p.b, p.bs || style, size)}</span></span>`

export function motionSection() {
  const heroPicks = ['bell', 'heart', 'loader', 'star', 'rocket', 'cloud', 'sun', 'trophy'].filter(n => MOTION[n] && MOTION[n].loop)
  const heroStyles = ['line', 'solid', 'duo', 'sketch', 'gloss', 'glass', 'kawaii', 'sticker', 'pixel', 'retro'].filter(hasStyle)
  const presets = PRESETS.map(([k, d, dur, good, oneShot]) => ({ k, d, dur, good, oneShot, demo: demoFor(k) }))
  const pairs = swapPairs()
  const spec = MOTION.bell || Object.values(MOTION)[0]
  const tabs = (id, items, label) => `<div class="pg-tabs" data-tabs>
  <div class="pg-tablist" role="tablist" aria-label="${esc(label)}">${items.map(([k, l], i) => `<button type="button" role="tab" id="${id}-t-${k}" aria-controls="${id}-p-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${l}</button>`).join('')}</div>
  ${items.map(([k, , html], i) => `<div class="pg-tabpanel" role="tabpanel" id="${id}-p-${k}" aria-labelledby="${id}-t-${k}" tabindex="0"${i === 0 ? '' : ' hidden'}>${html}</div>`).join('\n  ')}
</div>`
  const fw = [
    ['react', 'React', code(`import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'          // each icon's own animation
import { useState } from 'react'
import { Bell, Play, Pause } from '@withicons/react'

export function Toolbar() {
  const [playing, setPlaying] = useState(false)
  return (
    <>
      {/* rings on hover or keyboard focus of the button */}
      <button className="wm-trigger">
        <span className="wm wm-hover" data-wm="bell"><Bell /></span> Notifications
      </button>

      {/* play turns into pause with a flip */}
      <button aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(p => !p)}>
        <span className={'wm-swap wm-fx-flip' + (playing ? ' is-on' : '')}>
          <Play className="wm-a" /><Pause className="wm-b" />
        </span>
      </button>
    </>
  )
}`, 'jsx', 'Toolbar.jsx') + code(`import { useEffect, useRef } from 'react'
import { motion } from '@withicons/motion'

// imperative: start / stop from code (e.g. while a request is pending)
export function useMotion(name, options) {
  const ref = useRef(null)
  useEffect(() => {
    const m = motion(ref.current, name, options)
    return () => m.destroy()
  }, [name])
  return ref   // <span ref={useMotion('loader', { trigger: 'loop' })}><Loader /></span>
}`, 'jsx', 'useMotion.js')],
    ['vue', 'Vue', code(`<script setup>
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { ref } from 'vue'
import { Bell, Play, Pause } from '@withicons/vue'
const playing = ref(false)
</script>

<template>
  <button class="wm-trigger">
    <span class="wm wm-hover" data-wm="bell"><Bell /></span> Notifications
  </button>

  <button :aria-label="playing ? 'Pause' : 'Play'" @click="playing = !playing">
    <span class="wm-swap wm-fx-flip" :class="{ 'is-on': playing }">
      <Play class="wm-a" /><Pause class="wm-b" />
    </span>
  </button>
</template>`, 'vue', 'Toolbar.vue')],
    ['svelte', 'Svelte', code(`<script>
  import '@withicons/motion/motion.css'
  import '@withicons/motion/icons.css'
  import { Bell, Play, Pause } from '@withicons/svelte'
  let playing = false
</script>

<button class="wm-trigger">
  <span class="wm wm-hover" data-wm="bell"><Bell /></span> Notifications
</button>

<button aria-label={playing ? 'Pause' : 'Play'} on:click={() => (playing = !playing)}>
  <span class="wm-swap wm-fx-flip" class:is-on={playing}>
    <Play class="wm-a" /><Pause class="wm-b" />
  </span>
</button>`, 'svelte', 'Toolbar.svelte')],
    ['angular', 'Angular', code(`// angular.json → "styles": ["node_modules/@withicons/motion/dist/motion.css",
//                           "node_modules/@withicons/motion/dist/icons.css", …]
import { Component, signal } from '@angular/core'
import { WithIconComponent, Bell, Play, Pause } from '@withicons/angular'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: \`
    <button class="wm-trigger">
      <span class="wm wm-hover" data-wm="bell"><with-icon [icon]="Bell" /></span> Notifications
    </button>
    <button [attr.aria-label]="playing() ? 'Pause' : 'Play'" (click)="playing.set(!playing())">
      <span class="wm-swap wm-fx-flip" [class.is-on]="playing()">
        <with-icon class="wm-a" [icon]="Play" /><with-icon class="wm-b" [icon]="Pause" />
      </span>
    </button>
  \`,
})
export class ToolbarComponent { Bell = Bell; Play = Play; Pause = Pause; playing = signal(false) }`, 'ts', 'toolbar.component.ts')],
    ['element', '&lt;with-icon&gt;', code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/cdn.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/element.js"></script>

<with-icon name="bell" motion="loop"></with-icon>                <!-- its own animation, forever -->
<with-icon name="heart" variant="solid" motion="hover"></with-icon> <!-- plays on hover / focus -->
<with-icon name="star" motion="once" preset="tada"></with-icon>  <!-- once, when it appears -->
<with-icon name="play" swap-to="pause" swap-effect="flip" swap-trigger="click"></with-icon>`, 'html', 'index.html') + `<p class="pg-note">Importing <code>@withicons/motion/element</code> upgrades every <code>&lt;with-icon&gt;</code> on the page, now and later: <code>motion</code> (<code>loop</code>, <code>hover</code>, <code>once</code>, <code>inview</code>), <code>preset</code>, <code>swap-to</code>, <code>swap-effect</code> and <code>swap-trigger</code> (<code>hover</code>, <code>click</code> or <code>loop</code>). From a CDN it fetches only what the page animates: each icon’s own motion (<code>icons/&lt;name&gt;.css</code>, a few hundred bytes) and its drawing, about 42 KB gzipped in all for one animated icon.</p>`],
    ['js', 'Plain JS', code(`import { motion, swap, motionFor, PRESETS, EFFECTS } from '@withicons/motion'

motionFor('bell')   // → { intent: 'rings like a notification just arrived', loop: {…}, hover: {…}, … }

const ring = motion(document.querySelector('#bell'), 'bell', { trigger: 'hover' })
ring.play(); ring.pause(); ring.destroy()

motion(el, 'loader', { trigger: 'loop', preset: 'tick', duration: 1 })  // override the preset

const toggle = swap(button, { from: playSvg, to: pauseSvg, effect: 'flip', trigger: 'click' })
toggle.toggle(true)   // force "on"`, 'js', 'app.js')],
  ]
  const classes = [
    ['wm', 'Base class on the element that holds the icon (a <code>span</code>, <code>&lt;with-icon&gt;</code> or <code>&lt;i&gt;</code>).'],
    ['wm-loop', 'Plays forever: calm, seamless motion.'],
    ['wm-hover', 'Plays once on hover, keyboard focus or tap of the icon, or of any ancestor with <code>wm-trigger</code> (like a button).'],
    ['wm-once', 'Plays once when the page loads.'],
    ['wm-inview', 'Plays once when it scrolls into view (needs <code>motion.js</code>).'],
    ['wm-paused', 'Holds still. Toggle it to pause and resume.'],
    ['data-wm="bell"', 'Uses that icon’s own motion from <code>icons.css</code>: the right pivot, direction and speed.'],
    ['wm-p-&lt;preset&gt;', 'Picks any preset yourself, e.g. <code>wm-p-tada</code>. Overrides the icon’s own.'],
    ['wm-parts', 'Set for you by <code>motion()</code> and <code>&lt;with-icon&gt;</code> when the SVG has <a href="#motion-parts">part tags</a>. Only needed by hand in browsers without <code>:has()</code>.'],
    ['wm-force', 'Keeps moving even when the visitor asked for reduced motion. Use only for essential feedback like a loader.'],
  ]
  const vars = [['--wm-dur', 'seconds per cycle', '<code>--wm-dur: 2s</code>'], ['--wm-k', 'intensity, 0.25 to 2', '<code>--wm-k: 1.5</code>'], ['--wm-ox / --wm-oy', 'pivot point, in % of the icon', '<code>--wm-ox: 50%; --wm-oy: 15%</code>'], ['--wm-dx / --wm-dy', 'direction for nudge, pass, rise…', '<code>--wm-dx: 0.7; --wm-dy: -0.7</code>'], ['--wm-steps', 'stepped motion (clock hands)', '<code>--wm-steps: 12</code>'], ['--wm-deco', 'how decorations move (none keeps them still)', '<code>--wm-deco: none</code>']]
  return `<section id="motion" class="dv-sec dv-motion" aria-labelledby="motion-h">
      <h2 id="motion-h">Animations <code class="dv-pkgname">@withicons/motion</code> ${soon}</h2>
      <div class="mo-intro">
        <div class="mo-intro-copy">
          <p class="mo-lede">Make any icon move: a bell that rings, a heart that beats, a play button that flips into pause.</p>
          <p>Animations are a <b>separate, optional add-on</b>. Your icons never need it, and it works with every style and every package: put the classes on the element that <em>holds</em> the icon. Inline SVGs move <a href="#motion-parts">part by part</a>, so decorations and shadows never spin along with the object. Every icon comes with its own animation chosen to fit what it means, and you can pick from ${PRESETS.length} presets and ${EFFECTS.length} swap transitions.</p>
          <p class="pg-note">Not a developer? Open any icon, go to <b>Customize › Motion</b> and download an <b>Animated SVG</b> for your website or Notion, or a <b>GIF</b> for your slides. <a href="free/animated-icons.html">Free animated icons</a>. <a href="guides/animate-icons.html">Step-by-step guide</a>.</p>
        </div>
        <div class="mo-stage" aria-hidden="true" data-motion-stage>${heroPicks.map((n, i) => { const s = heroStyles[i % heroStyles.length]; return `<span class="mo-stage-ic" style="--g:${cvar(s)};--i:${i}">${wmOwn(n, s, 40, MOTION[n])}<small>${esc(n)}</small></span>` }).join('')}</div>
      </div>

      <h3 id="motion-install">Install</h3>
      <div class="mo-two">
        <div>${code('npm i @withicons/motion', 'sh', 'Terminal')}<p class="pg-note">${sizeNote()}</p></div>
        <div>${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/icons/bell.css">`, 'html', 'CDN')}<p class="pg-note"><code>motion.css</code> has the presets (about 10 KB gzipped). <code>icons/&lt;name&gt;.css</code> adds one icon’s own motion (<code>data-wm="bell"</code>), a few hundred bytes each; <code>icons.css</code> has all ${ICON_NAMES.length} at once (about 18 KB gzipped). Pin a version in production.</p></div>
      </div>

      <h3 id="motion-css">CSS only: add two classes</h3>
      <p>No JavaScript needed. Wrap the icon (or put the classes on <code>&lt;with-icon&gt;</code> / <code>&lt;i&gt;</code>) and choose <i>when</i> it moves.</p>
      ${code(`<!-- its own motion, forever -->
<span class="wm wm-loop" data-wm="bell"><svg …bell…></svg></span>

<!-- plays when the button is hovered or focused -->
<button class="wm-trigger">
  <span class="wm wm-hover" data-wm="bell"><svg …></svg></span> Notifications
</button>

<!-- choose the preset, tune it with CSS variables -->
<span class="wm wm-loop wm-p-spin" style="--wm-dur: 2s"><svg …settings…></svg></span>
<i class="with with-star wm wm-hover wm-p-twinkle"></i>`, 'html', 'index.html')}
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Class</th><th>What it does</th></tr></thead><tbody>
        ${classes.map(([c, d]) => `<tr><td><code>${c}</code></td><td>${d}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Variable</th><th>Changes</th><th>Example</th></tr></thead><tbody>
        ${vars.map(([v, d, e]) => `<tr><td><code>${v}</code></td><td>${d}</td><td>${e}</td></tr>`).join('')}
      </tbody></table></div>

      ${partsSection()}

      <h3 id="motion-presets">The ${PRESETS.length} presets</h3>
      <p>Each preset is one CSS animation that works on every icon. Click a card to copy its classes.</p>
      <div class="mo-bar" data-motion-ctl>
        <div class="mo-seg" role="group" aria-label="When the demos play">
          <button type="button" data-motion-mode="loop" aria-pressed="true">Looping</button>
          <button type="button" data-motion-mode="hover" aria-pressed="false">On hover</button>
        </div>
        <button type="button" class="mo-pause" data-motion-pause aria-pressed="false">${I('pause', 'line', 16)}<span>Pause all</span></button>
        <p class="mo-rm" data-motion-rm hidden>${I('info-circle', 'line', 16)} Your device asks for reduced motion, so the demos are paused. Press <b>Play</b> to watch anyway.</p>
      </div>
      <ul class="mo-presets" data-motion-grid>
        ${presets.map((p, i) => `<li style="--i:${i}"><button type="button" class="mo-preset wm-trigger" data-copy-btn data-copy="${esc(`<span class="wm wm-${p.oneShot ? 'hover' : 'loop'} wm-p-${p.k}">…</span>`)}" aria-label="${esc(`${p.k}: ${p.d}. Copy classes`)}">
          <span class="mo-demo" aria-hidden="true">${wm(p.demo.name, 'line', 36, p.demo.m, 'loop', p.oneShot ? 'mo-oneshot' : '')}</span>
          <code class="mo-name">${p.k}</code>
          <span class="mo-desc">${esc(p.d)}</span>
          <span class="mo-meta"><span>${p.dur} s</span><span>${esc(p.good)}</span></span>
        </button></li>`).join('\n        ')}
      </ul>
      <p class="pg-note">Presets marked as one-shots (pop, tada, shake…) are made for hover and taps; the rest loop seamlessly. <code>draw</code> traces the strokes of outline styles and falls back to <code>pop</code> on filled ones.</p>

      ${pairs.length ? `<h3 id="motion-swap">Swap: turn one icon into another</h3>
      <p>Stack two icons in a <code>wm-swap</code> wrapper. The second one shows when the wrapper (or a <code>wm-trigger</code> around it) is hovered, or when it has <code>.is-on</code> or <code>aria-pressed="true"</code>: perfect for play/pause, show/hide password, menu/close and like buttons.</p>
      <div class="mo-swap" data-swap-demo>
        <div class="mo-seg mo-fx" role="group" aria-label="Transition">${['auto', ...EFFECTS].map((fx, i) => `<button type="button" data-swap-fx="${fx}" aria-pressed="${i === 0}">${fx === 'auto' ? 'Each icon’s own' : fx}</button>`).join('')}</div>
        <ul class="mo-pairs">${pairs.map((p, i) => `<li style="--i:${i}"><button type="button" class="mo-pair" aria-pressed="false" data-swap-toggle aria-label="${esc(`${p.a} to ${p.b}${p.bs ? ' (' + styleTitle(p.bs) + ')' : ''}`)}">${swapEl(p, 'line', 40)}<span class="mo-pair-n"><code>${esc(p.a)}</code> → <code>${esc(p.b)}${p.bs ? '@' + p.bs : ''}</code></span><span class="mo-pair-fx" data-fx-label>${p.fx}</span></button></li>`).join('')}</ul>
        <p class="mo-hint">${I('cursor', 'line', 16)} Click an icon to swap it.</p>
      </div>
      ${code(`<button aria-pressed="false" aria-label="Play">
  <span class="wm-swap wm-fx-flip">
    <svg class="wm-a" …play…></svg>
    <svg class="wm-b" …pause…></svg>
  </span>
</button>
<script>
  button.onclick = () => button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') !== 'true')
</script>`, 'html', 'Swap')}
      <p class="pg-note">Effects (add <code>wm-fx-</code> in front): ${EFFECTS.join(', ')}. Draw needs an outline style and falls back to fade. Add <code>wm-loop</code> to a swap to alternate forever.</p>` : ''}

      <h3 id="motion-frameworks">In your framework</h3>
      <p>The classes are the whole API, so they work in any framework. Import the CSS once, then wrap icons.</p>
      ${tabs('mo', fw, 'Framework')}

      ${spec ? `<h3 id="motion-spec">Every icon’s own motion</h3>
      <p>Each icon ships a small spec saying how it should move, in plain words and in numbers: its loop, its hover, how its parts move (<code>parts.A</code> for a moving part, <code>parts.S</code> for a badge, each with an optional <code>delay</code>), how its decorations move (<code>deco</code>), good alternatives and the icons it naturally turns into. <code>motionFor(name)</code> returns it.</p>
      ${code(JSON.stringify(spec, null, 2), 'json', `motionFor('${spec.name}')`)}` : ''}

      <h3 id="motion-a11y">Reduced motion</h3>
      <div class="dv-cards">
        <article data-reveal><h3>Respected automatically</h3><p>When a visitor turns on <b>reduce motion</b> in their system settings, every <code>wm</code> animation and swap transition switches off. Swaps still change icon, instantly.</p></article>
        <article data-reveal><h3>Essential motion only</h3><p>Add <code>wm-force</code> for motion that carries meaning, like a loading spinner, and keep it calm.</p></article>
        <article data-reveal><h3>Don’t animate everything</h3><p>One moving icon draws the eye; ten compete. Use loops for status (live, loading, recording) and hovers for everything else.</p></article>
        <article data-reveal><h3>Pause off-screen</h3><p>CSS animations are cheap (transform and opacity only), and the script pauses <code>wm-inview</code> icons that scroll away.</p></article>
      </div>
    </section>`
}
