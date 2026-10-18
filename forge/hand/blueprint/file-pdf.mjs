// forge/hand/blueprint/file-pdf.mjs — the drafted PDF page: one unbroken page outline with a crisp dog-ear and its crease,
// and a big bold P centred on the sheet (the generated drawing swapped the letter for a small plus mark and hollowed the
// corner with control rings, so the page no longer read as a PDF).
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    // width dimension below
    ['path', { d: 'M5 23H19M5 21.7V23.3M19 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M4.35 23.65L5.65 22.35M18.35 23.65L19.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // page with its dog-ear
    ['path', { d: 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z', class: 'wm-k' }],
    // fold crease
    ['path', { d: 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19', class: 'wm-a' }],
    // bold P
    ['path', { d: 'M9.5 18V11H12.25A2.5 2.5 0 0 1 12.25 16H9.5', 'stroke-width': 1.75, class: 'wm-s' }],
  ]
}
