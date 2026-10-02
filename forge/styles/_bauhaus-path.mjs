// BAUHAUS helper — SVG path data to exact segments (M L C Q A Z; H V S T resolved),
// so raw paths can be reversed and transformed by _bauhaus-prim.mjs.


// SVG path data -> absolute segments [{c, ...}] (M L C Q A Z only)
export function segments(d) {
  const toks = String(d || '').match(/[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  const out = []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, lc = null, lq = null
  const num = () => parseFloat(toks[i++])
  const isNum = () => i < toks.length && !/^[A-Za-z]$/.test(toks[i])
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++]
    else if (!cmd) { i++; continue }
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') { out.push({ c: 'Z' }); x = sx; y = sy; lc = lq = null; continue }
    if (i >= toks.length || !isNum()) { if (C !== 'Z') break }
    if (C === 'M') { x = ox + num(); y = oy + num(); sx = x; sy = y; out.push({ c: 'M', x, y }); cmd = rel ? 'l' : 'L'; lc = lq = null; continue }
    if (C === 'L') { x = ox + num(); y = oy + num(); out.push({ c: 'L', x, y }); lc = lq = null }
    else if (C === 'H') { x = ox + num(); out.push({ c: 'L', x, y }); lc = lq = null }
    else if (C === 'V') { y = oy + num(); out.push({ c: 'L', x, y }); lc = lq = null }
    else if (C === 'C' || C === 'S') {
      let x1, y1
      if (C === 'C') { x1 = ox + num(); y1 = oy + num() } else { x1 = lc ? 2 * x - lc[0] : x; y1 = lc ? 2 * y - lc[1] : y }
      const x2 = ox + num(), y2 = oy + num(), x3 = ox + num(), y3 = oy + num()
      out.push({ c: 'C', x1, y1, x2, y2, x: x3, y: y3 }); lc = [x2, y2]; lq = null; x = x3; y = y3
    } else if (C === 'Q' || C === 'T') {
      let x1, y1
      if (C === 'Q') { x1 = ox + num(); y1 = oy + num() } else { x1 = lq ? 2 * x - lq[0] : x; y1 = lq ? 2 * y - lq[1] : y }
      const x2 = ox + num(), y2 = oy + num()
      out.push({ c: 'Q', x1, y1, x: x2, y: y2 }); lq = [x1, y1]; lc = null; x = x2; y = y2
    } else if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), fa = num(), fs = num(), x2 = ox + num(), y2 = oy + num()
      out.push({ c: 'A', rx, ry, rot, fa, fs, x: x2, y: y2 }); x = x2; y = y2; lc = lq = null
    } else { i++ }
  }
  return out
}

const f = n => { const r = Math.round(n * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }
export function toD(segs) {
  return segs.map(s => {
    switch (s.c) {
      case 'M': case 'L': return `${s.c}${f(s.x)} ${f(s.y)}`
      case 'C': return `C${f(s.x1)} ${f(s.y1)} ${f(s.x2)} ${f(s.y2)} ${f(s.x)} ${f(s.y)}`
      case 'Q': return `Q${f(s.x1)} ${f(s.y1)} ${f(s.x)} ${f(s.y)}`
      case 'A': return `A${f(s.rx)} ${f(s.ry)} ${f(s.rot)} ${s.fa ? 1 : 0} ${s.fs ? 1 : 0} ${f(s.x)} ${f(s.y)}`
      default: return 'Z'
    }
  }).join('')
}
