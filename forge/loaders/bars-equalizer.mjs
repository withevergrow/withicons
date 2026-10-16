// Five rounded bars dance like an audio equalizer. Every bar grows from the floor (scaleY about its foot), attacks
// fast and releases slower, with two beats of different height per bar so it never looks like one wave. The odd bars
// pulse twice per cycle and the even bars three times, each offset, so the pattern only repeats after the whole
// cycle and still loops seamlessly.
import { line, stroke, E } from './_kit.mjs'

const TOP = 7, BOT = 17, DY = 1.5, GAP = 4       // the bar is drawn centred (7..17), placed 1.5 lower by its copies
const LOW = 0.26
const beat = (a, b) => [
  [0, { sy: LOW, e: E.expoOut }],
  [0.22, { sy: a, e: E.ease }],
  [0.46, { sy: LOW + 0.18, e: E.out }],
  [0.62, { sy: b, e: E.ease }],
  [1, { sy: LOW }],
]
const at = (i, lag) => ({ x: (i - 2) * GAP, y: DY, lag })
const bar = stroke(line(12, TOP, 12, BOT))
const origin = [12, BOT + 1]     // the round cap's foot
export default {
  name: 'bars-equalizer', title: 'Equalizer bars', group: 'common',
  description: 'Five rounded bars jump from the floor like an audio equalizer, each with its own beat, fast attack and slow release.',
  intent: 'audio is playing, listening, or processing a stream',
  aliases: ['equalizer', 'audio-bars', 'sound-bars', 'eq-loader', 'music-bars', 'voice-activity'],
  tags: ['loading', 'audio', 'music', 'bars', 'voice'], synonyms: ['equalizer', 'audio', 'listening', 'playing', 'sound'],
  duration: 2.4,
  parts: [
    { skel: bar, motion: { origin, keys: beat(1, 0.72), rep: 2 }, copies: [at(0, 0.3), at(2, 0), at(4, 0.58)] },
    { skel: bar, motion: { origin, keys: beat(0.84, 0.6), rep: 3 }, copies: [at(1, 0.45), at(3, 0.8)] },
  ],
}
