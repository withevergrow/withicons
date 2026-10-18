// forge/hand/anime/file-archive.mjs — the new zipped-page skeleton in anime: the family cream page with a gold
// dog-ear, a column of alternating ink zipper teeth running down to a glossy gold zip pull with a dark slot, so it
// reads as a zip file (not a jar) at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const p = k.page(5, 2.6, 19.4, 21.4, 5, 2)
  const teeth = []
  for (let i = 0; i < 5; i++) {
    const y = 4.6 + i * 1.85, x = i % 2 ? 10.1 : 8.4
    teeth.push(k.rr(x, y, x + 1.9, y + 1.05, 0.45))
  }
  const ops = [
    k.surf(p.sheet, 'tint', { shine: 'none' }),
    k.surf(p.flap, 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.paint(k.join(...teeth), 'ink'),
    k.surf(k.rr(8.2, 14.2, 12.2, 19.2, 1.5), 'c3', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.surf(k.rr(9.55, 15.9, 10.85, 17.6, 0.55), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ]
  return compose(ops, { seed: icon.name })
}
