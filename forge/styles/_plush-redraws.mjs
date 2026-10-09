// PLUSH redraw registry: every hand-composed icon, gathered from the chunk files.
// EXEMPLAR (in _plush-render.mjs) wins over anything here; anything not redrawn falls back to
// the automatic stuffed-toy maker (_plush-auto.mjs).
import { R as R1 } from './_plush-redraw-1.mjs'
import { R as R2 } from './_plush-redraw-2.mjs'
import { R as R3 } from './_plush-redraw-3.mjs'
import { R as R4 } from './_plush-redraw-4.mjs'
import { R as R5 } from './_plush-redraw-5.mjs'
import { R as RS } from './_plush-snowman.mjs'
import { R as RD } from './_plush-dragon.mjs'

export const REDRAW = Object.assign(Object.create(null), R1, R2, R3, R4, R5, RS, RD)
