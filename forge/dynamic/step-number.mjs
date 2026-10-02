// Live icon: a numbered step marker for onboarding flows, checklists and wizards. A circle (or rounded square)
// with the step number; a check mark once the step is done.
import { fitText, asCutouts, live } from './_font.mjs'
import { circle, rr } from './_layout.mjs'
import { fitInCircle, checkMark } from './_parts-progress.mjs'

export default live({
  name: 'step-number', title: 'Numbered step', category: 'status',
  description: 'A step marker with the number you choose, or a check mark when the step is complete.',
  aliases: ['numbered-step', 'step-circle', 'number-circle', 'step-marker', 'circled-number', 'stage-number', 'number-badge', 'list-number'],
  tags: ['step', 'number', 'onboarding', 'progress', 'wizard'],
  synonyms: ['step', 'steps', 'stage', 'phase', 'first', 'second', 'third', 'number', 'numbered', 'ordinal', 'sequence', 'order', 'stepper', 'wizard', 'onboarding', 'checklist', 'tutorial', 'how to', 'instructions', 'done', 'completed step'],
  params: {
    step: { type: 'int', min: 0, max: 99, default: 1, label: 'Step number' },
    done: { type: 'bool', default: false, label: 'Completed (show a check)' },
    shape: { type: 'enum', options: ['circle', 'square'], default: 'circle', label: 'Shape' },
  },
  examples: [
    { step: 1, done: false, shape: 'circle' },
    { step: 4, done: false, shape: 'circle' },
    { step: 12, done: false, shape: 'circle' },
    { step: 99, done: false, shape: 'square' },
    { step: 2, done: true, shape: 'circle' },
    { step: 7, done: false, shape: 'square' },
  ],
  build({ step, done, shape }) {
    const sq = shape === 'square'
    // circle keyline Ø19 (like check-circle); square keyline 3..21, radius 3 for a friendlier tile
    const frame = sq ? rr(3, 3, 21, 21, 3.5) : circle(12, 12, 9.5)
    let inner
    if (done) inner = [checkMark(11.75, 12, sq ? 0.95 : 0.95)]
    else {
      const s = String(Math.max(0, Math.min(99, Math.round(step))))
      const t = sq
        ? fitText(s, { x0: 6.75, y0: 7.5, x1: 17.25, y1: 16.5 }, { prefer: 'large', minCap: 4.5 })
        : fitInCircle(s, 12, 12, 6, { minCap: 4.5 })
      inner = t ? t.paths : []
    }
    return {
      paths: [{ d: frame, plate: 'K' }, ...inner.map(d => ({ d, plate: 'A' }))],
      fills: [frame],
      cutouts: asCutouts(inner),
    }
  },
})
