// GOTHIC redraw registry: every hand-composed icon, gathered from the chunk files.
// Each chunk exports R = { 'icon-name': (icon, g) => parts }. See forge/styles/GOTHIC-GUIDE.md.
// The art director's EXEMPLAR map (_gothic-render.mjs) wins over every entry here.
import { R as R1 } from './_gothic-redraw-1.mjs'
import { R as R2 } from './_gothic-redraw-2.mjs'
import { R as R3 } from './_gothic-redraw-3.mjs'
import { R as R4 } from './_gothic-redraw-4.mjs'
import { R as R5 } from './_gothic-redraw-5.mjs'
import { R as RS } from './_gothic-snowman.mjs'
import { R as RD } from './_gothic-dragon.mjs'

export const REDRAW = Object.assign(Object.create(null), R1, R2, R3, R4, R5, RS, RD)
