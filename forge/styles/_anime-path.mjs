// ANIME helper — path data in and out.
//
//   ringsD(rings, dec)   closed rings -> compact relative path data ("M3.2 4l.5-.3...z")
//   lineD(pts, dec)      an open polyline -> compact relative path data
//   rings(d)             closed subpaths of SVG path data -> rings
//   lines(d)             every subpath -> [{pts, closed}]
// Rounding is done on absolute positions, then differenced, so relative data never drifts.
import { parsePath } from '../kernel/geom.mjs'

const num = (v, dec) => {
  const m = 10 ** dec
  let s = String(Math.round(v * m) / m)
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
// does the last number token of `str` already contain a '.'? (then a following '.5' can be glued)
const lastHasDot = str => { const m = str.match(/[\d.]+$/); return !!(m && m[0].includes('.')) }

function seq(pts, dec, close) {
  if (!pts || !pts.length) return ''
  const m = 10 ** dec
  const R = pts.map(p => [Math.round(p[0] * m), Math.round(p[1] * m)])
  // drop repeats
  const Q = [R[0]]
  for (let i = 1; i < R.length; i++) if (R[i][0] !== Q.at(-1)[0] || R[i][1] !== Q.at(-1)[1]) Q.push(R[i])
  if (close && Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
  let s = 'M' + num(Q[0][0] / m, dec) + (Q[0][1] < 0 ? '' : ' ') + num(Q[0][1] / m, dec)
  if (Q.length > 1) {
    s += 'l'
    let body = ''
    for (let i = 1; i < Q.length; i++) {
      for (const v of [Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]]) {
        const t = num(v / m, dec)
        if (!body) body = t
        else if (t[0] === '-') body += t
        else if (t[0] === '.' && lastHasDot(body)) body += t
        else body += ' ' + t
      }
    }
    s += body
  }
  return s + (close ? 'z' : '')
}

export const ringsD = (rings, dec = 2) => rings.filter(r => r && r.length > 2).map(r => seq(r, dec, true)).join('')
export const lineD = (pts, dec = 2) => seq(pts, dec, false)

export function rings(d) {
  try { return parsePath(String(d)).filter(s => s.closed && s.pts.length > 2).map(s => s.pts) } catch { return [] }
}
export function lines(d) {
  try { return parsePath(String(d)).filter(s => s.pts.length).map(s => ({ pts: s.pts, closed: !!s.closed && s.pts.length > 2 })) } catch { return [] }
}
