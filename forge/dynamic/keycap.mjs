// Live icon: a keyboard key with one character, a short key name, or a modifier symbol.
// One character sits large on a square key. Names like ESC, TAB or ALT switch to a wide key with smaller type.
// Symbols (command, shift, option, enter, arrows...) are drawn, not typed, so they stay crisp at 16px.
import { fitFirst, fitLadder, textInk, wallCut, openCutouts } from './_parts-labels.mjs'
import { rr } from './_layout.mjs'
import { live } from './_font.mjs'

// square key: the face above a front lip line
const SQ = { body: rr(3, 3, 21, 21, 3), lip: 'M3 17 H21', box: { x0: 6.25, y0: 6.25, x1: 17.75, y1: 13.75 } }
// wide key for names: same lip height, full width
const WIDE = { body: rr(2, 4.5, 22, 19.5, 2.5), lip: 'M2 16 H22', box: { x0: 5.25, y0: 7.75, x1: 18.75, y1: 12.75 } }
// four-letter names (CTRL, HOME, PGUP): the wide key opens its upper side walls and the name runs edge to edge
const OPEN = { top: 'M4.5 4.5 H19.5', tray: 'M2 16 V17 A2.5 2.5 0 0 0 4.5 19.5 H19.5 A2.5 2.5 0 0 0 22 17 V16', box: { x0: 3.5, y0: 7.75, x1: 20.5, y1: 12.75 } }

// symbols drawn in the square key's face (centre 12, 10); every path open or closed as noted
const SYMBOLS = {
  command: ['M10.5 8.5 H13.5 V11.5 H10.5 Z', 'M10.5 8.5 H9 A1.5 1.5 0 1 1 10.5 7 V8.5', 'M13.5 8.5 H15 A1.5 1.5 0 1 0 13.5 7 V8.5', 'M13.5 11.5 H15 A1.5 1.5 0 1 1 13.5 13 V11.5', 'M10.5 11.5 H9 A1.5 1.5 0 1 0 10.5 13 V11.5'],
  shift: ['M12 6 L17 11 H14.5 V14 H9.5 V11 H7 Z'],
  option: ['M7 7 H9.75 L14.25 13.5 H17', 'M13.5 7 H17'],
  enter: ['M16.5 6.5 V9.5 A1.5 1.5 0 0 1 15 11 H7.5', 'M10.5 8 L7.5 11 L10.5 14'],
  backspace: ['M9.5 7 H16 A1.5 1.5 0 0 1 17.5 8.5 V11.5 A1.5 1.5 0 0 1 16 13 H9.5 L6.5 10 Z'],
  tab: ['M6.5 10 H15.5', 'M12.5 7 L15.5 10 L12.5 13', 'M17.5 6.5 V13.5'],
  up: ['M12 13.5 V6.5', 'M8.5 10 L12 6.5 L15.5 10'],
  down: ['M12 6.5 V13.5', 'M8.5 10 L12 13.5 L15.5 10'],
  left: ['M15.5 10 H8.5', 'M12 6.5 L8.5 10 L12 13.5'],
  right: ['M8.5 10 H15.5', 'M12 6.5 L15.5 10 L12 13.5'],
  space: ['M7.5 9.5 V12 H16.5 V9.5'],
}

export default live({
  name: 'keycap', title: 'Keycap', category: 'devices',
  description: 'A keyboard key showing a letter, a key name such as ESC, or a modifier symbol such as command or shift.',
  aliases: ['key-cap', 'keyboard-key', 'keystroke', 'shortcut-key', 'hotkey', 'kbd', 'key-button'],
  tags: ['keyboard', 'key', 'shortcut', 'input'],
  synonyms: ['shortcut', 'keyboard shortcut', 'command', 'cmd', 'shift', 'ctrl', 'control', 'alt', 'option', 'escape', 'enter', 'return', 'tab', 'arrow key', 'space bar', 'backspace', 'press'],
  params: {
    label: { type: 'text', maxLength: 4, default: 'A', case: 'upper', label: 'Key label' },
    symbol: { type: 'enum', options: ['none', 'command', 'shift', 'option', 'enter', 'backspace', 'tab', 'up', 'down', 'left', 'right', 'space'], default: 'none', label: 'Symbol (replaces the label)' },
  },
  examples: [{ label: 'A', symbol: 'none' }, { label: 'K', symbol: 'command' }, { label: 'ESC', symbol: 'none' }, { label: 'A', symbol: 'shift' }, { label: '7', symbol: 'none' }, { label: 'CTRL', symbol: 'none' }],
  build({ label, symbol }) {
    if (symbol && symbol !== 'none' && SYMBOLS[symbol]) {
      const sym = SYMBOLS[symbol]
      return {
        paths: [{ d: SQ.body, plate: 'K' }, { d: SQ.lip, plate: 'K' }, ...sym.map(d => ({ d, plate: 'A' }))],
        fills: [SQ.body],
        cutouts: [SQ.lip, ...openCutouts(sym)],
      }
    }
    const s = label || 'A'
    // one or two characters on the square key, large; names on the wide key; four letters open it up
    const sq = s.length <= 2 && fitFirst([s], SQ.box, { minCap: 5, maxCap: 7 })
    const wide = !sq && fitFirst([s], WIDE.box, { minCap: 4.5, maxCap: 5 })
    const open = !sq && !wide && fitLadder(s, OPEN.box, { minCap: 4, maxCap: 5 })
    const fit = sq || wide || open
    const ink = textInk(fit && fit.t, 'A')
    const K = sq ? SQ : WIDE
    const frame = open && (wallCut(2, open.t.box) || wallCut(22, open.t.box))
      ? [{ d: OPEN.top, plate: 'K' }, { d: OPEN.tray, plate: 'K' }, { d: WIDE.lip, plate: 'K' }]
      : [{ d: K.body, plate: 'K' }, { d: K.lip, plate: 'K' }]
    return {
      paths: [...frame, ...ink.paths],
      fills: [K.body],
      cutouts: [K.lip, ...ink.cutouts],
    }
  },
})
