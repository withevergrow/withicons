// BENTO path helpers: rewrite any SVG path (absolute or relative, M L H V C S Q T A Z) as an
// absolute path, uniformly scaled about a centre and shifted. Uniform scaling keeps arcs exact,
// so the glyph keeps the skeleton's own curves and stays small (no flattening).

const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
const TOK = /[MLHVCSQTAZmlhvcsqtaz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g

const f2 = n => { const r = Math.round(n * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
// compact number list: no space before "-", none before ".5" after a number that already has a dot
function join(nums) {
  let s = '', dot = false
  for (const n of nums) {
    let t = f2(n)
    if (t.startsWith('0.')) t = t.slice(1)
    else if (t.startsWith('-0.')) t = '-' + t.slice(2)
    const sep = s && !(t[0] === '-' || (t[0] === '.' && dot))
    s += (sep ? ' ' : '') + t
    dot = t.includes('.')
  }
  return s
}

// map(d, s, cx, cy, dx, dy): x -> cx + (x - cx) * s + dx
export function mapPath(d, s = 1, c = [12, 12], dx = 0, dy = 0) {
  const X = x => c[0] + (x - c[0]) * s + dx, Y = y => c[1] + (y - c[1]) * s + dy
  const toks = String(d || '').match(TOK) || []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0
  const out = []
  const num = () => Number(toks[i++])
  while (i < toks.length) {
    const t = toks[i]
    if (/[A-Za-z]/.test(t)) { cmd = t; i++; if (cmd === 'Z' || cmd === 'z') { out.push('Z'); x = sx; y = sy } continue }
    if (!cmd) { i++; continue }
    const U = cmd.toUpperCase(), rel = cmd !== U, n = ARGS[U]
    if (!n || i + n > toks.length) break
    if (toks.slice(i, i + n).some(v => /[A-Za-z]/.test(v))) { i++; continue }
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (U === 'M') {
      x = num() + ox; y = num() + oy; sx = x; sy = y
      out.push('M' + join([X(x), Y(y)]))
      cmd = rel ? 'l' : 'L'
    } else if (U === 'L' || U === 'T') {
      x = num() + ox; y = num() + oy; out.push(U + join([X(x), Y(y)]))
    } else if (U === 'H') {
      x = num() + ox; out.push('L' + join([X(x), Y(y)]))
    } else if (U === 'V') {
      y = num() + oy; out.push('L' + join([X(x), Y(y)]))
    } else if (U === 'C') {
      const a = [num() + ox, num() + oy, num() + ox, num() + oy, num() + ox, num() + oy]
      x = a[4]; y = a[5]; out.push('C' + join([X(a[0]), Y(a[1]), X(a[2]), Y(a[3]), X(a[4]), Y(a[5])]))
    } else if (U === 'S' || U === 'Q') {
      const a = [num() + ox, num() + oy, num() + ox, num() + oy]
      x = a[2]; y = a[3]; out.push(U + join([X(a[0]), Y(a[1]), X(a[2]), Y(a[3])]))
    } else if (U === 'A') {
      const rx = Math.abs(num()), ry = Math.abs(num()), rot = num(), la = num(), sw = num()
      x = num() + ox; y = num() + oy
      const fl = v => Math.floor(v * s * 100 + 1e-6) / 100
      out.push('A' + join([fl(rx), fl(ry), rot]) + ' ' + (la ? 1 : 0) + ' ' + (sw ? 1 : 0) + ' ' + join([X(x), Y(y)]))
    }
  }
  return out.join('')
}
