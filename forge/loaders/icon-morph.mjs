// The "making it happen" loader: sparkles turn into a bolt, then a rocket, then a check, each blooming from the
// last one's dot. Library icons, so every style draws them exactly as it draws the icons themselves.
import { icon, show } from './_kit.mjs'

const ICONS = ['sparkles', 'zap', 'rocket', 'check-circle']
export default {
  name: 'icon-morph', title: 'Icon morph', group: 'creative',
  description: 'Sparkles become a bolt, a rocket and a check mark in turn, each blooming out of the last.',
  intent: 'work in progress that tells a tiny story: idea, energy, launch, done',
  aliases: ['morphing-icons', 'icon-sequence', 'story-loader', 'sparkle-to-check'],
  tags: ['loading', 'morph', 'ai', 'launch'], synonyms: ['loading', 'generating', 'working on it', 'magic'],
  duration: 4.8,
  morph: ICONS,
  parts: ICONS.map((n, i) => ({ skel: icon(n), motion: { origin: [12, 12], keys: show(i, ICONS.length, { fade: 0.26, enter: { s: 0.3, r: -30, o: 0 }, exit: { s: 0.3, r: 30, o: 0 } }) } })),
}
