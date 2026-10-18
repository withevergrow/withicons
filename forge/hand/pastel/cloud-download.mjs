// forge/hand/pastel/cloud-download.mjs — the pastel cloud download: the cloud sits high and the heavier lavender
// arrow (S) drops out through its base in a moat slot, so the head lands clear below the cloud and reads at 16px
// instead of melting into the sky body.
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { cloud, arrow } = Kit
  return compose([
    ['sky', cloud(12, 9.5, 1.05)],
    ['cut', arrow(12, 8, 12, 21.25, { w: 3 + 2.4, head: 4.75 })],
    ['lavender@S', arrow(12, 8, 12, 21.25, { w: 3, head: 4.75 })],
  ], icon)
}
