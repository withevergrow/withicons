// The "AI is thinking" loader. A big four-point sparkle clicks round a quarter turn at a time (dip, then a springy
// snap), while two small sparkles twinkle in turn beside it. Once a cycle the big sparkle folds into a dot and a
// small brain blooms in its place, thinks for a beat, and folds back into the sparkle.
import { solid, icon, E } from './_kit.mjs'
import { sparkle, placed } from './_creative-a.mjs'

const BIG = [10.25, 13.75], SA = [18, 6], SB = [19, 16.5]
// the big sparkle: two quarter-turn clicks, then it folds away for the brain and springs back on the last quarter
const big = [
  [0, { s: 1, r: 0, o: 1, e: E.ease }],
  [0.06, { s: 0.84, r: -10, e: E.spring }],
  [0.19, { s: 1, r: 90, e: E.ease }],
  [0.27, { s: 1, r: 90, e: E.ease }],
  [0.33, { s: 0.84, r: 80, e: E.spring }],
  [0.46, { s: 1, r: 180 }],
  [0.53, { s: 1, r: 180, e: E.in }],
  [0.6, { s: 0.1, r: 250, o: 0 }],
  [0.9, { s: 0.1, r: 250, o: 0, e: E.spring }],
  [1, { s: 1, r: 360, o: 1 }],
]
// the brain: blooms from a dot as the sparkle folds, a small thinking pulse, folds back
const brain = [
  [0, { s: 0.15, r: -25, o: 0 }],
  [0.57, { s: 0.15, r: -25, o: 0, e: E.spring }],
  [0.66, { s: 1, r: 0, o: 1, e: E.ease }],
  [0.73, { s: 1.06, e: E.ease }],
  [0.8, { s: 1, e: E.ease }],
  [0.85, { s: 1, e: E.in }],
  [0.92, { s: 0.15, r: 25, o: 0 }],
  [1, { s: 0.15, r: 25, o: 0 }],
]
// a small sparkle's twinkle (twice a cycle): it dips small and dim with a twist, then springs past full size
const twinkle = [
  [0, { s: 0.85, r: 0, o: 0.85, e: E.in }],
  [0.14, { s: 0.3, r: -45, o: 0.35, e: E.spring }],
  [0.4, { s: 1.12, r: 0, o: 1, e: E.ease }],
  [0.75, { s: 0.85, o: 0.85 }],
  [1, { s: 0.85, r: 0, o: 0.85 }],
]
export default {
  name: 'ai-sparkle', title: 'AI sparkle', group: 'creative',
  description: 'A big sparkle clicks round in springy quarter turns while two small ones twinkle; once a cycle it becomes a thinking brain.',
  intent: 'the AI is thinking: generating, with a little magic',
  aliases: ['ai-thinking', 'ai-loader', 'sparkle-loader', 'magic-sparkle-loader', 'generating-sparkles', 'gen-ai-spinner'],
  tags: ['loading', 'ai', 'magic', 'sparkle', 'generate'],
  synonyms: ['thinking', 'generating', 'ai working', 'magic', 'assistant', 'llm'],
  duration: 4.4,
  morph: ['sparkles', 'brain'],
  parts: [
    { skel: solid(sparkle(...SA, 3, 0.26), 'A'), motion: { origin: SA, keys: twinkle, rep: 2 } },
    { skel: solid(sparkle(...SB, 2.25, 0.26), 'A'), motion: { origin: SB, keys: twinkle, rep: 2, lag: 0.5 } },
    // the library brain, placed through its motion so styles that draw it from hand-tuned art put it in the same spot
    { skel: icon('brain'), motion: { origin: [12, 12], keys: placed(brain, { s: 0.68, x: BIG[0] - 12, y: BIG[1] - 12.4 }) } },
    { skel: solid(sparkle(...BIG, 7.5, 0.24)), motion: { origin: BIG, keys: big } },
  ],
}
