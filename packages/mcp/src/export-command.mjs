// The `npx withicons export …` command line (no imports: the export tool and its tests share it)
// One shell word that reads the same in bash, zsh, PowerShell and cmd. Plain words stay bare. Anything else (a hex
// colour: '#' starts a comment in bash and PowerShell; a leading '@' splats in PowerShell; spaces, ...) goes in double
// quotes, which all of those shells take literally while the value holds no " $ ` \ or !. Such rare values fall back to
// POSIX single quotes.
export const q = v => {
  const s = String(v)
  if (/^[\w.,:/-][\w@.,:/-]*$/.test(s)) return s
  if (!/["$`\\!\r\n]/.test(s)) return `"${s}"`
  return `'${s.replace(/'/g, `'\\''`)}'`
}
/** The `npx withicons export …` command that makes the same files on the user's machine. */
export function exportCommand(a) {
  const parts = ['npx', 'withicons', 'export', ...[].concat(a.name || []).map(q)]
  const add = (flag, v) => { if (v !== undefined && v !== null && v !== '' && v !== false) parts.push(flag, ...(v === true ? [] : [q(v)])) }
  add('--style', a.style); add('--format', a.format); add('--size', a.size); add('--background', a.background); add('--matte', a.matte)
  add('--palette', a.palette); if (a.palette && a.strict_palette) parts.push('--strict'); add('--color', a.color)
  for (const [k, v] of Object.entries(a.colors || {})) add(k.startsWith('--') ? '--colors' : '--' + k, k.startsWith('--') ? `${k.slice(2)}=${v}` : v)
  add('--motion', a.motion); add('--to', a.to); add('--effect', a.effect); add('--hold', a.hold); add('--fps', a.fps); add('--seconds', a.seconds); add('--loop', a.loop)
  add('--duration', a.duration); add('--padding', a.padding); add('--stroke-width', a.stroke_width); if (a.all_styles) parts.push('--all-styles')
  add('--name', a.filename)
  if (a.name_map && typeof a.name_map === 'object') add('--name-map', Object.entries(a.name_map).map(([k, v]) => `${k}=${v}`).join(','))
  add('--out', a.out_dir || '.')
  return parts.join(' ')
}

