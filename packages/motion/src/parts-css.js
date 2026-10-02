// @withicons/motion — the CSS of parts choreography (forge/MOTION.md "Parts choreography"), shared by motion.css
// (built by forge/lib/emit-motion.mjs) and by <with-icon>'s shadow root (element.js), where the document's
// @keyframes are not visible, so the shadow root carries its own copy (built once, on first use).
import { PRESETS, hasLoopVariant, GROUND_PRESETS } from './meta.js'
import { presetStops, keyframesCss, DECO_STOPS, shadowStops } from './keyframes.js'

export const PART_TAGS = '.wm-deco,.wm-shadow,.wm-a,.wm-s'
const NOT_SHAPE = 'defs,title,desc,style,script,metadata'

/**
 * Node rules for the tagged children of an SVG; `kids` = selector prefixes ending at the svg (e.g. 'X>svg>').
 * The wrapper resolves every variable (--_an, --_dur, --_ox… for the object, --_an/--_ad… per plate, --_dk/--_dd for
 * decorations, --_sh for the shadow) and the nodes inherit them: object nodes play the preset about the icon's origin
 * (transform-box: view-box), plates their override, decorations their own loop about their own centre (fill-box),
 * shadows the ground keyframes (or the object's, when attached).
 */
export function partNodeRules(kids) {
  const sel = child => kids.map(k => k + child).join(',')
  const anim = (n, d, e, dl) => `animation:var(${n}) var(${d}) var(${e}) var(${dl}) var(--_ai, infinite) both`
  const plate = x => `${sel('.wm-' + x)}{transform-origin:var(--_p${x}ox) var(--_p${x}oy);--_k:var(--_p${x}k);--_dx:var(--_p${x}x);--_dy:var(--_p${x}y);${anim(`--_p${x}n`, `--_p${x}d`, `--_p${x}e`, `--_p${x}dl`)}}`
  return [
    `${sel(`:not(${NOT_SHAPE},${PART_TAGS})`)},${sel('.wm-shadow')}{transform-box:view-box;transform-origin:var(--_ox) var(--_oy);${anim('--_an', '--_dur', '--_ae', '--_dl')}}`,
    `${sel('.wm-shadow')}{animation-name:var(--_sh)}`,
    `${sel(':is(.wm-a,.wm-s)')}{transform-box:view-box}`, plate('a'), plate('s'),
    `${sel('.wm-deco')}{transform-box:fill-box;transform-origin:50% 50%;animation:var(--_dk) var(--_dd) linear var(--_ddl) var(--_ai, infinite) both}`,
  ].join('\n')
}

/** @keyframes of the decoration loops (wm-deco-<kind>) and ground shadows (wm-shadow-<preset>[-loop]). */
export function partKeyframes() {
  const out = Object.keys(DECO_STOPS).map(n => keyframesCss('wm-deco-' + n, DECO_STOPS[n]))
  for (const p of GROUND_PRESETS) {
    out.push(keyframesCss('wm-shadow-' + p, shadowStops(p, false)))
    if (hasLoopVariant(p)) out.push(keyframesCss('wm-shadow-' + p + '-loop', shadowStops(p, true)))
  }
  return out.join('\n')
}

let SHADOW_PARTS = ''
/** Everything a <with-icon> shadow root needs to animate its parts (host class wm-parts, set by element.js). */
export function shadowPartsCss() {
  if (SHADOW_PARTS) return SHADOW_PARTS
  const kf = []
  for (const p of PRESETS) {
    kf.push(keyframesCss('wm-' + p, presetStops(p, false)))
    if (hasLoopVariant(p)) kf.push(keyframesCss('wm-' + p + '-loop', presetStops(p, true)))
  }
  const H = ':host(.wm-parts:not(.wm-drawing))'
  SHADOW_PARTS = kf.join('') + partKeyframes() + partNodeRules([H + '>svg>']) +
    `:host(:is([paused],.wm-paused,.wm-offscreen))>svg>*{animation-play-state:paused!important}` +
    `@media (prefers-reduced-motion:reduce){:host(.wm-parts:not(.wm-force))>svg>*{animation:none!important}}`
  return SHADOW_PARTS
}
