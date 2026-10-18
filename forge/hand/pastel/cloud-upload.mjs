// forge/hand/pastel/cloud-upload.mjs — the pastel cloud upload: a long, heavier lavender arrow (S) rises from below
// the cloud into a moat slot cut through it, so the shaft reads clear on the page and the head stays crisp at 16px.
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { cloud, arrow } = Kit
  return compose([
    ['sky', cloud(12, 9.5, 1.05)],
    ['cut', arrow(12, 21.25, 12, 7.75, { w: 3 + 2.4, head: 4.75 })],
    ['lavender@S', arrow(12, 21.25, 12, 7.75, { w: 3, head: 4.75 })],
  ], icon)
}
