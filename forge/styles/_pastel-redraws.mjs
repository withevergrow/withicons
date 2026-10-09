// PASTEL redraw registry: every hand-composed icon, gathered from the chunk files.
// Later chunks win on a duplicate name; EXEMPLAR (in _pastel-render.mjs) wins over all of them.
import { R as R1 } from './_pastel-redraw-1.mjs'
import { R as R2 } from './_pastel-redraw-2.mjs'
import { R as R3 } from './_pastel-redraw-3.mjs'
import { R as R4 } from './_pastel-redraw-4.mjs'
import { R as R5 } from './_pastel-redraw-5.mjs'
import { R as RS } from './_pastel-snowman.mjs'
import { R as RD } from './_pastel-dragon.mjs'

export const REDRAW = Object.assign(Object.create(null), R1, R2, R3, R4, R5, RS, RD)
