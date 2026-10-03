// GOTHIC render: art-directed exemplars first, then the hand redraws, then the automatic
// composer for everything else (any future icon). Live icons: a hand composition from their
// params (_gothic-live.mjs LIVE), else the automatic composer in their family dress.
import { paint } from './_gothic-paint.mjs'
import { auto } from './_gothic-auto.mjs'
import { REDRAW } from './_gothic-redraws.mjs'
import { G } from './_gothic-kit.mjs'
import { EXEMPLAR } from './_gothic-exemplars.mjs'
import { mainRole } from './_gothic-auto.mjs'
import * as F from './_gothic-field.mjs'
import { exact, erode, inscribed } from './_gothic-paint.mjs'
import { LIVE, dress } from './_gothic-live.mjs'

// ink area of a field (u^2)
function inkArea(Fd) { let a = 0; for (let i = 0; i < Fd.length; i++) if (Fd[i] < 0) a++; return a * F.H * F.H }
// Enamel: an icon whose scene is nearly all gilt metal (arrows, chevrons, tools, currency) would read
// as plain gold. Its gilt bars are inlaid with a channel of the family's glass (champlevé), so every
// icon carries stained glass.
export function enamel(parts, icon) {
  let glassA = 0, giltA = 0, total = 0
  const gilts = []
  for (const p of parts) {
    if (!p || !p.F || p.m === 'cut' || p.m === 'lead' || p.plate === 'deco') continue
    const a = inkArea(p.F)
    total += a
    if (p.m === 'glass') glassA += a
    else if (p.m === 'gilt' && p.plate !== 'S') { giltA += a; gilts.push([p, a]) }
  }
  if (!total || glassA / total >= 0.12 || giltA / total < 0.35) return parts
  // gold glass in gold metal would vanish: a gold family takes ruby enamel
  const role = mainRole(icon) === 'c3' ? 'c1' : mainRole(icon)
  const out = []
  for (const p of parts) {
    out.push(p)
    const g = gilts.find(x => x[0] === p)
    if (!g || g[1] < 3) continue
    const X = exact(p.F)
    const ins = inscribed(X)
    if (!ins || ins.r < 0.85) continue
    const e = Math.min(0.92, Math.max(0.72, ins.r * 0.66))
    const C = erode(X, e)
    if (inkArea(C) < 0.8) continue
    out.push({ m: 'glass', F: C, role, plate: p.plate, outline: 0.2, tracery: 'none', dark: 0.12, glow: 0.22, glint: false, enamel: true })
  }
  return out
}

export function redrawOf(icon) {
  if (!icon || icon.params) return null
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}

export default function render(icon) {
  const f = redrawOf(icon)
  if (f) {
    try {
      const parts = f(icon, G)
      const nodes = Array.isArray(parts) && parts.length ? paint(enamel(parts.flat(Infinity).filter(Boolean), icon)) : []
      if (nodes.length) return nodes
    } catch (e) { if (globalThis.process?.env?.GOTHIC_DEBUG) throw e /* else a broken redraw falls back to the automatic composer */ }
  }
  if (icon && icon.params) {
    // Live icons: a hand composition from the params, else the automatic one in family dress
    const L = LIVE[icon.name]
    if (L) {
      try {
        const parts = L(icon, G)
        const nodes = Array.isArray(parts) && parts.length ? paint(parts.flat(Infinity).filter(Boolean)) : []
        if (nodes.length) return nodes
      } catch (e) { if (globalThis.process?.env?.GOTHIC_DEBUG) throw e }
    }
    try { return paint(dress(icon, auto(icon), G)) } catch (e) { if (globalThis.process?.env?.GOTHIC_DEBUG) throw e }
  }
  return paint(auto(icon))
}
