// forge/hand/liquid/puzzle-piece.mjs: a jigsaw piece in clear liquid glass, drawn as one exact silhouette with
// pinched necks on its two knobs and a socket on the left (the generated outline blurred the knobs into cloud bumps),
// built by the style's own glass recipe with a deeper c1 tint so the large flat body no longer fades out.
import { build } from '../../styles/_liquid-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const PIECE = 'M2.5 9.5l.01 1.5c0 .09.08.23.15.3 .45.48.92.1 1.44-.03 .22-.05.49-.07.7-.06 1.47.03 2.7 1.33 2.7 2.79-.01 1.47-1.17 2.65-2.6 2.78-.26.03-.41.02-.7-.03-.52-.09-.93-.48-1.42-.15-.21.14-.27.36-.27.6v1.5c.01 1.55 1.51 2.79 2.99 2.79h9.1c.73 0 1.53-.35 2.03-.89 .51-.55.85-1.24.86-2 .01-.38-.2-1.56.21-2.07 .51-.64 1.24 0 1.9.01 1.86.04 3.25-1.89 2.4-3.62-.4-.82-1.27-1.47-2.2-1.46-.3 0-.61.02-.9.13-.22.07-.37.18-.6.18-.39 0-.79-.36-.8-.77l-.01-1.6c-.01-1.53-1.37-2.88-2.89-2.89l-1.6-.02c-.16 0-.36-.1-.48-.19-.42-.34-.26-.74-.12-1.17 .1-.31.13-.48.15-.83 .08-1.4-1.24-2.52-2.55-2.55-1.38-.02-2.55 1.19-2.55 2.55 0 .31.07.61.17.9 .14.41.24.74-.12 1.08-.54.5-1.68.17-2.4.25-1.45.16-2.61 1.52-2.6 2.97z'

// the clear-glass and coloured-glass gradients, a step deeper than the generated defaults
const DEEP = { 0: [0.26, 0.48, 0.74], 1: [0.48, 0.9] }
function deepen(nodes) {
  const defs = nodes[0]
  if (defs && defs[0] === 'defs') for (const g of defs[2]) {
    const t = DEEP[g[1].id.split('-').pop()]
    if (t) g[2] = g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': t[i] }])
  }
  return nodes
}

export default function render(icon) {
  const glass = {
    name: (icon && icon.name) || 'puzzle-piece', paths: [], lines: [],
    fills: [{ subs: parsePath(PIECE) }], cutouts: [],
  }
  return deepen(build(glass))
}
