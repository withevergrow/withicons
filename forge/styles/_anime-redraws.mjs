// ANIME redraw registry: every hand-drawn icon, gathered from the chunk files.
// Later chunks never override earlier ones silently: the first chunk that defines a name wins.
import { R as R1 } from './_anime-redraw-1.mjs'
import { R as R2 } from './_anime-redraw-2.mjs'
import { R as R3 } from './_anime-redraw-3.mjs'
import { R as R4 } from './_anime-redraw-4.mjs'
import { R as R5 } from './_anime-redraw-5.mjs'

export const REDRAW = Object.assign(Object.create(null), R5, R4, R3, R2, R1)
