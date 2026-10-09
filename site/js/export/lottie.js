/* with icons — Lottie export (classic script + CommonJS/UMD, works in browsers and Node, no dependencies).
 * Registers two formats on window.WithExport (or via require('./lottie.js')(WithExport) in Node):
 *   lottie     Lottie JSON (bodymovin v5 schema)            -> <name>-<style>-<preset>.json
 *   dotlottie  dotLottie v1 (ZIP: manifest.json + animations/<id>.json) -> .lottie
 *
 * Geometry: every SVG element of the icon (path, circle, ellipse, rect, line, polyline, polygon, nested <g>) becomes a
 * shape group with exact cubic bezier vertices (arcs and quadratics converted exactly / to cubics), flat fills
 * (fill-opacity, nonzero / evenodd) and strokes (width, caps, joins, miter limit, dashes). Colours are baked:
 * var(--with-*) -> ctx.vars or the style default, currentColor -> the element's `color` (blueprint's accent) or ctx.color.
 * The 24x24 grid is scaled to opts.size (default 512) so layer scale is 100% at rest; transparent unless
 * opts.background is set (then a solid rectangle layer sits underneath).
 *
 * Motion: the @withicons/motion presets (site/vendor/motion/motion.css) translated into layer transform keyframes:
 * anchor = the icon's motion origin, position / rotation / scale / opacity keyframed at the same stops with the same
 * cubic-bezier easing (Lottie i/o handles == CSS cubic-bezier), `step-end` -> hold keyframes, steps(n) -> n holds.
 * `draw` uses Trim Paths per subpath (matching how browsers restart the dash per subpath) and fades the fills.
 * Clipping: `pass` keeps its CSS clip-path (a layer mask that stays on the icon box).
 * Closest-approximation presets (everything else is exact at every instant):
 *   glow, twinkle  the CSS drop-shadow halo becomes two Drop Shadow layer effects (1em = the icon box, as on a 1em
 *                  wrapper); lottie-web cannot chain them, so its halo is a little lighter; players without effect
 *                  support (some native ones) just skip the halo, scale / rotation stay exact
 *   flip           rotateY has no 2D equivalent: baked to scaleX = cos(angle), two samples per frame
 *   orbit          the circular drift is baked to position, two samples per frame
 *   flicker        CSS scales after rotating, Lottie before; the rotation is <= 1.5deg so the gap is sub-pixel
 * Gradients (rich styles: clay, glass, chrome, the holiday styles, ...): Lottie gradient fills are not drawn the same way by every
 * player, so each gradient becomes one flat colour, its middle (the colour at offset 0.5, stop-opacity included).
 * Not representable: the pixel style's shape-rendering=crispEdges (Lottie players always anti-alias); motion that
 * overshoots the 24 box (twinkle, zoom, bounce...) is cut at the canvas edge, so use opts.padding for those.
 * Parts: when the drawing carries part tags (wm-deco, wm-shadow, wm-a, wm-s) and the motion runtime is on the page
 * (window.WithMotion), each run of same-role elements is its own layer driven by the runtime's partsPlan / sampleRole
 * (the same plan as motion.css), sampled twice per frame; see buildParts. Without the runtime: one layer, as before.
 * Trigger: ctx.motion.trigger 'loop' (default) exports the loop cycle; 'hover' / 'once' export the one-shot.
 * Static: opts.static === true, ctx.motion === false or ctx.motion.preset 'none' -> a one-frame still Lottie.
 * Swaps ("Turn into", ctx.swap { name, style, inner, root, color, vars, effect, duration, ease, hold, cycle } from the
 * editor): two layers, Before and After, each with its own drawing and colours, turning into each other on a loop
 * (one cycle = 2 x (duration + hold), as @withicons/motion's animatedSwapSvg). Exact for fade, scale, rotate, spin and the
 * slides (masked to the icon box); flip is sampled (scaleX = cos, back face hidden); blur and morph keep their scale /
 * rotation / fade without the blur; draw fades. ctx.motion.swapTo alone (no ctx.swap) is not enough: the icon's own
 * preset is used instead.
 */
(function (root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  else {
    root.WithLottie = api
    if (root.WithExport && typeof root.WithExport.register === 'function') api.register(root.WithExport)
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  var FPS = 30
  var r3 = function (n) { var v = Math.round(n * 1000) / 1000; return v === 0 ? 0 : v }
  var r4 = function (n) { var v = Math.round(n * 10000) / 10000; return v === 0 ? 0 : v }

  /* ───────────────────────── motion presets (port of @withicons/motion keyframes) ───────────────────────── */
  var PRESET_DEFAULTS = {
    'spin': { shot: 1.2, cycle: 1.2, ease: 'linear' }, 'spin-once': { shot: 0.8, cycle: 2.0 },
    'tick': { shot: 1, cycle: 1, ease: 'steps(12)' }, 'pulse': { shot: 1.4, cycle: 1.4 },
    'beat': { shot: 0.72, cycle: 1.2 }, 'breathe': { shot: 3, cycle: 3 }, 'float': { shot: 2.6, cycle: 2.6 },
    'bounce': { shot: 1, cycle: 1.15, origin: [12, 21] }, 'sway': { shot: 2.8, cycle: 2.8, origin: [12, 21] },
    'ring': { shot: 1.4, cycle: 2.6, origin: [12, 3] }, 'wiggle': { shot: 0.8, cycle: 2.0 },
    'shake': { shot: 0.6, cycle: 1.8 }, 'nod': { shot: 0.8, cycle: 2.0 }, 'nudge': { shot: 0.9, cycle: 1.2, dir: 0 },
    'pass': { shot: 1.4, cycle: 1.4, dir: 0 }, 'rise': { shot: 1.6, cycle: 1.6 }, 'drop': { shot: 1.6, cycle: 1.6 },
    'blink': { shot: 0.42, cycle: 3.5 }, 'flicker': { shot: 1.6, cycle: 1.6, origin: [12, 21] },
    'twinkle': { shot: 1.2, cycle: 1.8 }, 'pop': { shot: 0.5, cycle: 1.6 }, 'tada': { shot: 1, cycle: 2.4 },
    'jelly': { shot: 0.9, cycle: 2.2 }, 'flip': { shot: 1.2, cycle: 2.4 }, 'rock': { shot: 2.4, cycle: 2.4, origin: [12, 20] },
    'tilt': { shot: 1.6, cycle: 2.6 }, 'zoom': { shot: 1.2, cycle: 2.0 }, 'orbit': { shot: 2.4, cycle: 2.4, ease: 'linear' },
    'glow': { shot: 1.8, cycle: 1.8 }, 'draw': { shot: 1.6, cycle: 3.2 }, 'type': { shot: 0.9, cycle: 1.4 },
    'fill': { shot: 1.6, cycle: 2.0 }
  }
  var DIRECTIONAL = ['nudge', 'pass']
  var E = {
    out: [0.22, 1, 0.36, 1], in: [0.55, 0, 0.85, 0.35], inOut: [0.65, 0, 0.35, 1], sineIn: [0.12, 0, 0.39, 0],
    sineOut: [0.61, 1, 0.88, 1], sine: [0.37, 0, 0.63, 1], back: [0.34, 1.56, 0.64, 1], softBack: [0.3, 1.35, 0.55, 1],
    fall: [0.55, 0, 0.9, 0.45], lift: [0.15, 0.55, 0.4, 1]
  }
  var HOLD = 'hold'
  // Channels: x, y (translate, % of the 24 box), sx, sy (scale), r (deg), ry (rotateY deg), o (opacity 0-1), orbit (deg).
  function S(sx, sy) { return { sx: sx, sy: sy === undefined ? sx : sy } }
  function ext(a, b) { var o = {}; for (var k in a) o[k] = a[k]; for (var k2 in b) o[k2] = b[k2]; return o }

  function swings(v, pts) { return pts.map(function (p, i) { return [p[0], { r: v.deg(p[1]) }, i === 0 ? E.sineOut : E.sine] }) }
  function osc(v, a) {
    return [[0, { r: 0 }, E.sineOut], [25, { r: v.deg(a) }, E.sineIn], [50, { r: 0 }, E.sineOut], [75, { r: v.deg(-a) }, E.sineIn], [100, { r: 0 }]]
  }
  var STOPS = {
    'spin': function () { return [[0, { r: 0 }], [100, { r: 360 }]] },
    'tick': function () { return [[0, { r: 0 }], [100, { r: 360 }]] },
    'spin-once': function (v) { return [[0, { r: 0 }, [0.6, 0, 0.25, 1]], [72, { r: 360 + v.deg(14) }, E.inOut], [100, { r: 360 }]] },
    'pulse': function (v) { return [[0, S(1), E.sine], [50, S(v.sc(0.1)), E.sine], [100, S(1)]] },
    'beat': function (v) {
      return [[0, S(1), E.out], [20, S(v.sc(0.16)), E.inOut], [40, S(v.sc(-0.02)), E.out], [58, S(v.sc(0.1)), E.sine], [100, S(1)]]
    },
    'breathe': function (v) { return [[0, ext(S(1), { o: 1 }), E.sine], [50, ext(S(v.sc(0.07)), { o: 0.72 }), E.sine], [100, ext(S(1), { o: 1 })]] },
    'float': function (v) {
      return [[0, { y: 0 }, E.sineIn], [25, { y: v.len(-5) }, E.sineOut], [50, { y: v.len(-10) }, E.sineIn], [75, { y: v.len(-5) }, E.sineOut], [100, { y: 0 }]]
    },
    'bounce': function (v) {
      var b = function (y, sx, sy) { return { y: v.len(y), sx: sx === 1 ? 1 : v.sc(sx - 1), sy: sy === 1 ? 1 : v.sc(sy - 1) } }
      return [[0, b(0, 1, 1), E.out], [9, b(0, 1.07, 0.9), E.lift], [36, b(-30, 0.95, 1.06), E.fall], [58, b(0, 1.1, 0.88), E.out],
        [70, b(-7, 0.98, 1.02), E.fall], [81, b(0, 1.03, 0.97), E.out], [100, b(0, 1, 1)]]
    },
    'sway': function (v) { return osc(v, 6) },
    'rock': function (v) { return osc(v, 10) },
    'ring': function (v) { return swings(v, [[0, 0], [9, 16], [21, -14], [33, 11], [45, -8], [57, 5], [69, -2.5], [81, 1], [100, 0]]) },
    'wiggle': function (v) { return swings(v, [[0, 0], [12, -9], [26, 8], [40, -6], [54, 4], [68, -2], [82, 0.8], [100, 0]]) },
    'shake': function (v) {
      return [[0, 0], [10, -11], [22, 10], [34, -8], [46, 6], [58, -3.5], [70, 1.5], [84, 0], [100, 0]]
        .map(function (p, i) { return [p[0], { x: v.len(p[1]) }, i === 0 ? E.out : E.sine] })
    },
    'nod': function (v) {
      return [[0, 0], [18, 10], [38, -3], [58, 6], [78, -1], [100, 0]]
        .map(function (p, i) { return [p[0], { y: v.len(p[1]), sy: p[1] > 0 ? v.sc(-0.03 * p[1] / 10) : 1 }, i === 0 ? E.out : E.sine] })
    },
    'nudge': function (v) {
      return [[0, { x: 0, y: 0 }, [0.4, 0, 0.2, 1]], [36, { x: v.dx(15), y: v.dy(15) }, E.inOut], [66, { x: v.dx(-2), y: v.dy(-2) }, E.sine],
        [86, { x: 0, y: 0 }, E.sine], [100, { x: 0, y: 0 }]]
    },
    'pass': function (v) {
      return [[0, { x: 0, y: 0 }, E.in], [44, { x: v.dx(78), y: v.dy(78) }, HOLD], [44.01, { x: v.dx(-78), y: v.dy(-78) }, E.softBack],
        [90, { x: 0, y: 0 }], [100, { x: 0, y: 0 }]]
    },
    'rise': function (v) {
      return [[0, { y: 0, sx: 1, sy: 1, o: 1 }, E.in], [44, { y: v.len(-38), sx: 0.92, sy: 0.92, o: 0 }, HOLD],
        [44.01, { y: 0, sx: 0.4, sy: 0.4, o: 0 }, E.back], [86, { y: 0, sx: 1, sy: 1, o: 1 }], [100, { y: 0, sx: 1, sy: 1, o: 1 }]]
    },
    'drop': function (v) {
      return [[0, { y: 0, sy: 1, o: 1 }, E.fall], [44, { y: v.len(40), sy: 1.08, o: 0 }, HOLD], [44.01, { y: v.len(-30), sy: 1, o: 0 }, E.out],
        [86, { y: 0, sy: 1, o: 1 }], [100, { y: 0, sy: 1, o: 1 }]]
    },
    'blink': function (v) { return [[0, { sy: 1 }, [0.5, 0, 0.9, 0.4]], [34, { sy: v.scMin(-0.9, 0.06) }, E.out], [74, { sy: v.sc(0.04) }, E.sine], [100, { sy: 1 }]] },
    'flicker': function (v) {
      var f = function (sx, sy, rot, o) { return { sx: sx ? v.sc(sx) : 1, sy: sy ? v.sc(sy) : 1, r: v.deg(rot), o: o } }
      return [[0, f(0, 0, 0, 1), E.sine], [9, f(0.025, -0.05, -1.5, 0.84), E.sine], [17, f(-0.02, 0.045, 1, 1), E.sine], [30, f(0.01, -0.02, 0, 0.93), E.sine],
        [37, f(0, 0.035, -1, 1), E.sine], [53, f(0.03, -0.06, 1.5, 0.78), E.sine], [61, f(-0.01, 0.025, 0, 1), E.sine], [76, f(0.012, -0.02, -0.5, 0.9), E.sine],
        [85, f(0, 0.02, 0, 1), E.sine], [100, f(0, 0, 0, 1)]]
    },
    'twinkle': function (v) {
      return [[0, ext(S(1), { r: 0 }), E.out], [20, ext(S(v.sc(-0.12)), { r: v.deg(-8) }), E.back],
        [48, ext(S(v.sc(0.16)), { r: v.deg(12), ga: 1, g1: v.em(0.06), g2: v.em(0.28) }), E.inOut], [100, ext(S(1), { r: 0 })]]
    },
    'pop': function (v) { return [[0, S(1), E.out], [16, S(v.sc(-0.14)), E.back], [56, S(v.sc(0.12)), E.sine], [78, S(v.sc(-0.03)), E.sine], [100, S(1)]] },
    'tada': function (v) {
      var s = function (sc, deg) { return ext(S(sc ? v.sc(sc) : 1), { r: v.deg(deg) }) }
      return [[0, s(0, 0), E.out], [12, s(-0.1, -4), E.sine], [22, s(-0.1, -4), E.back], [34, s(0.12, 5), E.sine], [46, s(0.12, -5), E.sine],
        [58, s(0.12, 5), E.sine], [70, s(0.12, -4), E.sine], [84, s(0.04, 1), E.sine], [100, s(0, 0)]]
    },
    'jelly': function (v) {
      var j = function (a) { return { sx: a ? v.sc(a) : 1, sy: a ? v.sc(-a) : 1 } }
      return [[0, j(0), E.out], [24, j(0.2), E.sine], [42, j(-0.15), E.sine], [58, j(0.08), E.sine], [72, j(-0.04), E.sine], [86, j(0.015), E.sine], [100, j(0)]]
    },
    'flip': function (v) { return [[0, ext(S(1), { ry: 0 }), [0.6, -0.15, 0.7, 0.4]], [50, ext(S(v.sc(-0.08)), { ry: 180 }), [0.3, 0.6, 0.4, 1.15]], [100, ext(S(1), { ry: 360 })]] },
    'tilt': function (v) { return [[0, { r: 0 }, E.out], [24, { r: v.deg(-11) }, E.sine], [36, { r: v.deg(-8) }], [70, { r: v.deg(-8) }, E.softBack], [100, { r: 0 }]] },
    'zoom': function (v) { return [[0, S(1), E.out], [38, S(v.sc(0.18))], [58, S(v.sc(0.18)), E.inOut], [88, S(v.sc(-0.015)), E.sine], [100, S(1)]] },
    'orbit': function () { return [[0, { orbit: 0 }], [100, { orbit: 360 }]] },
    'glow': function (v) { return [[0, S(1), E.sine], [50, ext(S(v.sc(0.04)), { ga: 1, g1: v.em(0.05), g2: v.em(0.3) }), E.sine], [100, S(1)]] },
    'type': function (v) {
      var k = function (x, y, deg) { return { x: v.len(x), y: v.len(y), r: v.deg(deg) } }
      return [[0, k(0, 0, 0), E.out], [7, k(-1.5, 5, -2), E.out], [18, k(0, 0, 0), E.out], [26, k(1.5, 4, 1.5), E.out], [37, k(0, 0, 0), E.out],
        [46, k(-1, 5, -1), E.out], [57, k(0, 0, 0), E.out], [66, k(2, 4, 2), E.out], [80, k(0, 0, 0)], [100, k(0, 0, 0)]]
    },
    'fill': function (v) {
      return [[0, ext(S(1), { o: 1 }), E.out], [12, ext(S(v.sc(-0.04)), { o: 0.32 }), [0.45, 0, 0.4, 1]], [80, ext(S(v.sc(0.03)), { o: 1 }), E.back], [100, ext(S(1), { o: 1 })]]
    }
  }
  STOPS.draw = STOPS.pop // element-level fallback when nothing can be drawn
  // stroke draw-on (trim end 0..1) and the fade of fills / dashed strokes, for one-shot and loop
  var DRAW = {
    path: [[0, { e: 0 }, [0.55, 0.05, 0.35, 1]], [100, { e: 1 }]],
    pathLoop: [[0, { e: 0, o: 1 }, [0.55, 0.05, 0.35, 1]], [50, { e: 1, o: 1 }], [80, { e: 1, o: 1 }, E.sine], [94, { e: 1, o: 0 }], [100, { e: 1, o: 0 }]],
    fill: [[0, { o: 0 }], [55, { o: 0 }, E.sine], [100, { o: 1 }]],
    fillLoop: [[0, { o: 0 }], [30, { o: 0 }, E.sine], [50, { o: 1 }], [80, { o: 1 }, E.sine], [94, { o: 0 }], [100, { o: 0 }]]
  }

  function hasLoopVariant(p) { var d = PRESET_DEFAULTS[p]; return !!d && (p === 'draw' || d.cycle > d.shot + 1e-9) }
  function presetStops(preset, loop, k, dx, dy) {
    var v = {
      deg: function (n) { return n * k }, sc: function (n) { return 1 + n * k }, scMin: function (n, m) { return Math.max(m, 1 + n * k) },
      len: function (n) { return n * k }, em: function (n) { return n * k * 24 } /* 1em = the icon box, as on a wrapper sized 1em */, dx: function (n) { return dx * n * k }, dy: function (n) { return dy * n * k }
    }
    var stops = STOPS[preset](v)
    if (!loop || !hasLoopVariant(preset)) return stops
    var d = PRESET_DEFAULTS[preset], act = d.shot / d.cycle
    var out = stops.map(function (s) { return [s[0] * act, s[1], s[2]] })
    out.push([100, stops[stops.length - 1][1]])
    return out
  }

  // ctx.motion / ctx.motionSpec -> { preset, loop, duration, k, origin, dx, dy, ease } or null (static)
  function resolveMotion(ctx, opts) {
    var m = ctx.motion
    if (opts && opts.static) return null
    if (m === false || (m && (m.preset === 'none' || m.preset === 'static' || m.trigger === 'none'))) return null
    var spec = ctx.motionSpec || null
    // 3D motion (forge/MOTION.md "3D motion"): a 3D style plays the spec's 3D counterpart, a backdrop style keeps its tile
    // still. The mapping and the 3D preset table come from the motion runtime when it is on the page.
    var WMr = motionRuntime()
    if (spec && ctx.style && WMr && WMr.styleSpec) spec = WMr.styleSpec(spec, ctx.style)
    var DEF = function (p) { return PRESET_DEFAULTS[p] || (WMr && WMr.PRESET_DEFAULTS && WMr.PRESET_DEFAULTS[p]) || null }
    m = m || {}
    var trigger = m.trigger === 'hover' || m.trigger === 'once' ? m.trigger : 'loop'
    var slot = spec ? (trigger === 'loop' ? spec.loop : spec.hover) || spec.loop : null
    var preset = DEF(m.preset) ? m.preset : slot && DEF(slot.preset) ? slot.preset : (trigger === 'loop' ? 'float' : 'pop')
    var base = slot && slot.preset === preset ? slot : {}
    var d = DEF(preset), loop = trigger === 'loop'
    var num = function (a) { return a != null && a !== '' && isFinite(Number(a)) ? Number(a) : null }
    var pick = function () { for (var i = 0; i < arguments.length; i++) { var v = num(arguments[i]); if (v != null) return v } return null }
    var dir = pick(m.dir, base.dir)
    if (dir == null && DIRECTIONAL.indexOf(preset) >= 0 && slot && slot.dir != null) dir = Number(slot.dir)
    if (dir == null) dir = d.dir || 0
    var a = dir * Math.PI / 180
    var steps = pick(m.steps, base.steps, 0)
    var origin = (m.origin && m.origin.length === 2 ? m.origin : null) || base.origin || d.origin || [12, 12]
    return {
      preset: preset, trigger: trigger, loop: loop,
      duration: Math.max(0.1, pick(m.duration, m.dur, base.duration, loop ? d.cycle : d.shot)),
      k: pick(m.amount, m.k, base.amount, 1),
      origin: [Number(origin[0]), Number(origin[1])],
      dx: r4(Math.cos(a)), dy: r4(Math.sin(a)),
      ease: steps > 0 ? 'steps(' + Math.round(steps) + ')' : (d.ease || 'linear')
    }
  }

  /* ───────────────────────── easing ───────────────────────── */
  var NAMED_EASE = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] }
  // -> { b: [x1,y1,x2,y2] } | { hold: true } | { steps: n }
  function parseEase(e) {
    if (e === HOLD || e === 'step-end') return { hold: true }
    if (Array.isArray(e)) return { b: e }
    var s = String(e || 'linear').trim()
    if (NAMED_EASE[s]) return { b: NAMED_EASE[s] }
    var m = /^steps\(\s*(\d+)/.exec(s)
    if (m) return { steps: Math.max(1, +m[1]) }
    m = /^cubic-bezier\(([^)]*)\)/.exec(s)
    if (m) return { b: m[1].split(',').map(Number) }
    return { b: NAMED_EASE.linear }
  }
  function bezAt(p1, p2, u) { var v = 1 - u; return 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u }
  function bezSolve(p1, p2, target) { // u in [0,1] with bezAt(p1,p2,u) == target (monotonic in x; also used on y)
    var lo = 0, hi = 1, u = target
    for (var i = 0; i < 60; i++) {
      var x = bezAt(p1, p2, u)
      if (Math.abs(x - target) < 1e-9) return u
      if (x < target) lo = u; else hi = u
      u = (lo + hi) / 2
    }
    return u
  }
  function easeValue(ez, p) {
    if (ez.hold) return 0
    if (ez.steps) return Math.floor(p * ez.steps + 1e-9) / ez.steps
    var b = ez.b
    return bezAt(b[1], b[3], bezSolve(b[0], b[2], p))
  }
  // The part of an easing curve between progress ya and yb, renormalised to the unit square, plus the time fractions
  // where it starts and ends (so a value that is linear in eased progress can be clamped exactly).
  function subEase(b, ya, yb) {
    var split = function (P, u) { // de Casteljau -> [left, right]
      var L = function (a, c) { return [a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u] }
      var A = L(P[0], P[1]), B = L(P[1], P[2]), C = L(P[2], P[3]), D = L(A, B), F = L(B, C), M = L(D, F)
      return [[P[0], A, D, M], [M, F, C, P[3]]]
    }
    var ua = ya <= 0 ? 0 : bezSolve(b[1], b[3], ya), ub = yb >= 1 ? 1 : bezSolve(b[1], b[3], yb)
    var P = [[0, 0], [b[0], b[1]], [b[2], b[3]], [1, 1]]
    var left = ub < 1 ? split(P, ub)[0] : P
    var mid = ua > 0 ? split(left, ua / ub)[1] : left
    var a = mid[0], z = mid[3], w = z[0] - a[0] || 1, h = z[1] - a[1] || 1
    var n = function (p) { return [(p[0] - a[0]) / w, (p[1] - a[1]) / h] }
    var c1 = n(mid[1]), c2 = n(mid[2])
    return { ta: a[0], tb: z[0], ease: [c1[0], c1[1], c2[0], c2[1]] }
  }

  /* ───────────────────────── Lottie keyframes ───────────────────────── */
  function easeHandles(b, dims) {
    var arr = function (v) { var a = []; for (var i = 0; i < dims; i++) a.push(r4(v)); return a }
    return { o: { x: arr(b[0]), y: arr(b[1]) }, i: { x: arr(b[2]), y: arr(b[3]) } }
  }
  // stops: [{ t (frames), v: number|number[]|object, ease: parsed }] -> Lottie property { a, k }
  // lerp(a, b, f) interpolates values (only used to expand steps(n)).
  function prop(stops, dims, lerp) {
    var same = stops.every(function (s) { return JSON.stringify(s.v) === JSON.stringify(stops[0].v) })
    var wrap = function (v) { return Array.isArray(v) ? v : [v] }
    if (same) return { a: 0, k: stops[0].v }
    var k = []
    for (var i = 0; i < stops.length; i++) {
      var s = stops[i], next = stops[i + 1]
      if (!next) { k.push({ t: r4(s.t), s: wrap(s.v) }); break }
      var ez = s.ease
      if (ez.hold) k.push({ t: r4(s.t), s: wrap(s.v), h: 1 })
      else if (ez.steps) {
        for (var j = 0; j < ez.steps; j++) k.push({ t: r4(s.t + (next.t - s.t) * j / ez.steps), s: wrap(lerp(s.v, next.v, j / ez.steps)), h: 1 })
      } else {
        var h = easeHandles(ez.b, dims)
        k.push({ t: r4(s.t), s: wrap(s.v), o: h.o, i: h.i })
      }
    }
    // drop zero-length segments (a stop at the same time as the next one)
    k = k.filter(function (kf, idx) { return idx === k.length - 1 || k[idx + 1].t > kf.t })
    return { a: 1, k: k }
  }
  var lerpN = function (a, b, f) { return Array.isArray(a) ? a.map(function (x, i) { return r4(x + (b[i] - x) * f) }) : r4(a + (b - a) * f) }

  /* ───────────────────────── SVG parsing ───────────────────────── */
  var NAMED = {
    black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00', gray: '#808080', grey: '#808080',
    orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', cyan: '#00ffff', magenta: '#ff00ff', lime: '#00ff00', navy: '#000080', silver: '#c0c0c0'
  }
  // colour string -> [r, g, b, a] (0..1) or null for none
  function parseColor(c) {
    if (c == null) return null
    c = String(c).trim().toLowerCase()
    if (!c || c === 'none' || c === 'transparent') return null
    if (NAMED[c]) c = NAMED[c]
    var m = /^#([0-9a-f]{3,8})$/.exec(c)
    if (m) {
      var h = m[1]
      if (h.length === 3 || h.length === 4) h = h.split('').map(function (x) { return x + x }).join('')
      var n = function (i) { return parseInt(h.slice(i, i + 2), 16) / 255 }
      return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1]
    }
    m = /^rgba?\(([^)]*)\)$/.exec(c)
    if (m) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean)
      var ch = function (s) { return /%$/.test(s) ? parseFloat(s) / 100 : parseFloat(s) / 255 }
      var al = p[3] == null ? 1 : /%$/.test(p[3]) ? parseFloat(p[3]) / 100 : parseFloat(p[3])
      return [ch(p[0]), ch(p[1]), ch(p[2]), al]
    }
    m = /^hsla?\(([^)]*)\)$/.exec(c)
    if (m) {
      var q = m[1].split(/[\s,\/]+/).filter(Boolean)
      var H = (parseFloat(q[0]) % 360 + 360) % 360 / 360, Sx = parseFloat(q[1]) / 100, Lx = parseFloat(q[2]) / 100
      var hue = function (p0, q0, t) { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p0 + (q0 - p0) * 6 * t : t < 0.5 ? q0 : t < 2 / 3 ? p0 + (q0 - p0) * (2 / 3 - t) * 6 : p0 }
      var qq = Lx < 0.5 ? Lx * (1 + Sx) : Lx + Sx - Lx * Sx, pp = 2 * Lx - qq
      var a4 = q[3] == null ? 1 : /%$/.test(q[3]) ? parseFloat(q[3]) / 100 : parseFloat(q[3])
      return [hue(pp, qq, H + 1 / 3), hue(pp, qq, H), hue(pp, qq, H - 1 / 3), a4]
    }
    return [0, 0, 0, 1]
  }
  function decode(s) { return String(s).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n) }).replace(/&amp;/g, '&') }
  function parseAttrs(s) {
    var a = {}
    String(s).replace(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g, function (_, k, __, x, y) { a[k] = decode(x != null ? x : y); return '' })
    if (a.style) {
      a.style.split(';').forEach(function (d) { var i = d.indexOf(':'); if (i > 0) a[d.slice(0, i).trim()] = d.slice(i + 1).trim() })
      delete a.style
    }
    return a
  }
  // markup -> tree of { tag, attrs, children }
  function parseMarkup(src) {
    var rootNode = { tag: 'root', attrs: {}, children: [] }, stack = [rootNode], skip = 0
    var re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g, m
    var SKIP = { defs: 1, title: 1, desc: 1, metadata: 1, style: 1, script: 1, clipPath: 1, mask: 1, linearGradient: 1, radialGradient: 1, pattern: 1, symbol: 1, filter: 1, text: 1, foreignObject: 1 }
    while ((m = re.exec(src))) {
      if (!m[2]) continue
      var close = m[1] === '/', tag = m[2], self = m[4] === '/'
      if (close) {
        if (skip) { if (SKIP[tag]) skip--; continue }
        if (stack.length > 1 && stack[stack.length - 1].tag === tag) stack.pop()
        continue
      }
      if (skip) { if (SKIP[tag] && !self) skip++; continue }
      if (SKIP[tag]) { if (!self) skip++; continue }
      var node = { tag: tag, attrs: parseAttrs(m[3]), children: [] }
      stack[stack.length - 1].children.push(node)
      if (!self) stack.push(node)
    }
    return rootNode
  }

  // affine matrices [a b c d e f]
  var I = [1, 0, 0, 1, 0, 0]
  function mul(m, n) { return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]] }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]] }
  function parseTransform(s) {
    var m = I, re = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g, x
    while ((x = re.exec(String(s || '')))) {
      var a = (x[2].match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number), t = I
      if (x[1] === 'matrix' && a.length === 6) t = a
      else if (x[1] === 'translate') t = [1, 0, 0, 1, a[0] || 0, a[1] || 0]
      else if (x[1] === 'scale') t = [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0]
      else if (x[1] === 'rotate') {
        var r = (a[0] || 0) * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r)
        t = [c, sn, -sn, c, 0, 0]
        if (a.length === 3) t = mul(mul([1, 0, 0, 1, a[1], a[2]], t), [1, 0, 0, 1, -a[1], -a[2]])
      } else if (x[1] === 'skewX') t = [1, 0, Math.tan(a[0] * Math.PI / 180), 1, 0, 0]
      else if (x[1] === 'skewY') t = [1, Math.tan(a[0] * Math.PI / 180), 0, 1, 0, 0]
      m = mul(m, t)
    }
    return m
  }

  // path data -> subpaths [{ x, y, segs: [[c1x,c1y,c2x,c2y,x,y]], closed }] (absolute, cubic only)
  function parsePath(d) {
    var s = String(d || ''), i = 0, n = s.length, out = [], cur = null
    var x = 0, y = 0, sx = 0, sy = 0, lc = null, lq = null, cmd = '', prev = ''
    var ws = function () { while (i < n && /[\s,]/.test(s[i])) i++ }
    var num = function () {
      ws()
      var m = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(s.slice(i, i + 40))
      if (!m) return null
      i += m[0].length
      return parseFloat(m[0])
    }
    var flag = function () { ws(); var c = s[i]; if (c === '0' || c === '1') { i++; return c === '1' } return null }
    var start = function (px, py) { cur = { x: px, y: py, segs: [], closed: false }; out.push(cur) }
    var ensure = function () { if (!cur) start(x, y) }
    var cubic = function (a, b, c, e, f, g) { ensure(); cur.segs.push([a, b, c, e, f, g]); x = f; y = g }
    var line = function (px, py) { cubic(x, y, px, py, px, py) }
    while (true) {
      ws()
      if (i >= n) break
      if (/[MmLlHhVvCcSsQqTtAaZz]/.test(s[i])) cmd = s[i++]
      else if (!cmd) break
      var rel = cmd === cmd.toLowerCase() && cmd !== 'z' ? 1 : 0, C = cmd.toUpperCase()
      var ox = rel ? x : 0, oy = rel ? y : 0
      if (C === 'Z') {
        if (cur) { cur.closed = true; x = cur.x; y = cur.y; cur = null }
        lc = lq = null; prev = 'Z'; cmd = ''; continue
      }
      if (!cur && C !== 'M') start(x, y)
      var a1, a2, a3, a4, a5, a6, a7
      if (C === 'M') {
        a1 = num(); a2 = num(); if (a2 == null) break
        x = ox + a1; y = oy + a2; start(x, y); sx = x; sy = y
        cmd = rel ? 'l' : 'L'; lc = lq = null; prev = 'M'; continue
      }
      if (C === 'L') { a1 = num(); a2 = num(); if (a2 == null) break; line(ox + a1, oy + a2); lc = lq = null }
      else if (C === 'H') { a1 = num(); if (a1 == null) break; line(ox + a1, y); lc = lq = null }
      else if (C === 'V') { a1 = num(); if (a1 == null) break; line(x, oy + a1); lc = lq = null }
      else if (C === 'C') {
        a1 = num(); a2 = num(); a3 = num(); a4 = num(); a5 = num(); a6 = num(); if (a6 == null) break
        cubic(ox + a1, oy + a2, ox + a3, oy + a4, ox + a5, oy + a6); lc = [ox + a3, oy + a4]; lq = null
      } else if (C === 'S') {
        a3 = num(); a4 = num(); a5 = num(); a6 = num(); if (a6 == null) break
        var r1 = lc ? [2 * x - lc[0], 2 * y - lc[1]] : [x, y]
        cubic(r1[0], r1[1], ox + a3, oy + a4, ox + a5, oy + a6); lc = [ox + a3, oy + a4]; lq = null
      } else if (C === 'Q' || C === 'T') {
        var qx, qy
        if (C === 'Q') { a1 = num(); a2 = num(); a5 = num(); a6 = num(); if (a6 == null) break; qx = ox + a1; qy = oy + a2 }
        else { a5 = num(); a6 = num(); if (a6 == null) break; qx = lq ? 2 * x - lq[0] : x; qy = lq ? 2 * y - lq[1] : y }
        var ex = ox + a5, ey = oy + a6
        cubic(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), ex + 2 / 3 * (qx - ex), ey + 2 / 3 * (qy - ey), ex, ey); lq = [qx, qy]; lc = null
      } else if (C === 'A') {
        a1 = num(); a2 = num(); a3 = num(); a4 = flag(); a5 = flag(); a6 = num(); a7 = num(); if (a7 == null || a4 == null || a5 == null) break
        arc(x, y, a1, a2, a3, a4, a5, ox + a6, oy + a7).forEach(function (c) { cubic(c[0], c[1], c[2], c[3], c[4], c[5]) })
        lc = lq = null
      }
      prev = C
    }
    void prev; void sx; void sy
    return out
  }
  // SVG arc (endpoint parameterisation) -> cubic segments of <= 90deg
  function arc(x1, y1, rx, ry, phi, large, sweep, x2, y2) {
    if (x1 === x2 && y1 === y2) return []
    rx = Math.abs(rx); ry = Math.abs(ry)
    if (!rx || !ry) return [[x1, y1, x2, y2, x2, y2]]
    var p = phi * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p)
    var dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
    var xp = cp * dx + sp * dy, yp = -sp * dx + cp * dy
    var lam = xp * xp / (rx * rx) + yp * yp / (ry * ry)
    if (lam > 1) { var sl = Math.sqrt(lam); rx *= sl; ry *= sl }
    var num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp, den = rx * rx * yp * yp + ry * ry * xp * xp
    var co = Math.sqrt(Math.max(0, num / den)) * (large === sweep ? -1 : 1)
    var cxp = co * rx * yp / ry, cyp = -co * ry * xp / rx
    var cx = cp * cxp - sp * cyp + (x1 + x2) / 2, cy = sp * cxp + cp * cyp + (y1 + y2) / 2
    var ang = function (ux, uy, vx, vy) { var a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a }
    var t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
    var dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
    if (!sweep && dt > 0) dt -= 2 * Math.PI
    else if (sweep && dt < 0) dt += 2 * Math.PI
    var nseg = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-7)), step = dt / nseg, out = []
    var kk = 4 / 3 * Math.tan(step / 4)
    var pt = function (t) { var c = Math.cos(t), s = Math.sin(t); return [cx + rx * c * cp - ry * s * sp, cy + rx * c * sp + ry * s * cp] }
    var dv = function (t) { var c = Math.cos(t), s = Math.sin(t); return [-rx * s * cp - ry * c * sp, -rx * s * sp + ry * c * cp] }
    for (var i = 0; i < nseg; i++) {
      var a = t1 + i * step, b = a + step, P0 = pt(a), P3 = i === nseg - 1 ? [x2, y2] : pt(b), D0 = dv(a), D3 = dv(b)
      out.push([P0[0] + kk * D0[0], P0[1] + kk * D0[1], P3[0] - kk * D3[0], P3[1] - kk * D3[1], P3[0], P3[1]])
    }
    return out
  }
  function num0(v, d) { var n = parseFloat(v); return isFinite(n) ? n : d }
  // basic shapes -> path data
  function shapeToPath(tag, a) {
    var K = 0.5522847498307936
    if (tag === 'path') return a.d || ''
    if (tag === 'line') return 'M' + num0(a.x1, 0) + ' ' + num0(a.y1, 0) + 'L' + num0(a.x2, 0) + ' ' + num0(a.y2, 0)
    if (tag === 'polyline' || tag === 'polygon') {
      var p = (String(a.points || '').match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number)
      if (p.length < 4) return ''
      var d = 'M' + p[0] + ' ' + p[1]
      for (var i = 2; i + 1 < p.length; i += 2) d += 'L' + p[i] + ' ' + p[i + 1]
      return d + (tag === 'polygon' ? 'Z' : '')
    }
    if (tag === 'circle' || tag === 'ellipse') {
      var cx = num0(a.cx, 0), cy = num0(a.cy, 0), rx = tag === 'circle' ? num0(a.r, 0) : num0(a.rx, 0), ry = tag === 'circle' ? rx : num0(a.ry, 0)
      if (rx <= 0 || ry <= 0) return ''
      var kx = rx * K, ky = ry * K
      return 'M' + (cx + rx) + ' ' + cy + 'C' + (cx + rx) + ' ' + (cy + ky) + ' ' + (cx + kx) + ' ' + (cy + ry) + ' ' + cx + ' ' + (cy + ry) +
        'C' + (cx - kx) + ' ' + (cy + ry) + ' ' + (cx - rx) + ' ' + (cy + ky) + ' ' + (cx - rx) + ' ' + cy +
        'C' + (cx - rx) + ' ' + (cy - ky) + ' ' + (cx - kx) + ' ' + (cy - ry) + ' ' + cx + ' ' + (cy - ry) +
        'C' + (cx + kx) + ' ' + (cy - ry) + ' ' + (cx + rx) + ' ' + (cy - ky) + ' ' + (cx + rx) + ' ' + cy + 'Z'
    }
    if (tag === 'rect') {
      var x = num0(a.x, 0), y = num0(a.y, 0), w = num0(a.width, 0), h = num0(a.height, 0)
      if (w <= 0 || h <= 0) return ''
      var rxx = a.rx != null ? num0(a.rx, 0) : a.ry != null ? num0(a.ry, 0) : 0, ryy = a.ry != null ? num0(a.ry, 0) : rxx
      rxx = Math.min(Math.max(0, rxx), w / 2); ryy = Math.min(Math.max(0, ryy), h / 2)
      if (!rxx || !ryy) return 'M' + x + ' ' + y + 'H' + (x + w) + 'V' + (y + h) + 'H' + x + 'Z'
      return 'M' + (x + rxx) + ' ' + y + 'H' + (x + w - rxx) + 'A' + rxx + ' ' + ryy + ' 0 0 1 ' + (x + w) + ' ' + (y + ryy) + 'V' + (y + h - ryy) +
        'A' + rxx + ' ' + ryy + ' 0 0 1 ' + (x + w - rxx) + ' ' + (y + h) + 'H' + (x + rxx) + 'A' + rxx + ' ' + ryy + ' 0 0 1 ' + x + ' ' + (y + h - ryy) +
        'V' + (y + ryy) + 'A' + rxx + ' ' + ryy + ' 0 0 1 ' + (x + rxx) + ' ' + y + 'Z'
    }
    return ''
  }

  // cubic length (adaptive Gauss-Legendre over 16 slices; plenty for icon-sized curves)
  function segLength(x0, y0, s) {
    var G = [[-0.8611363116, 0.3478548451], [-0.3399810436, 0.6521451549], [0.3399810436, 0.6521451549], [0.8611363116, 0.3478548451]]
    var L = 0, N = 16
    for (var k = 0; k < N; k++) {
      for (var g = 0; g < 4; g++) {
        var t = (k + (G[g][0] + 1) / 2) / N, u = 1 - t
        var dx = 3 * u * u * (s[0] - x0) + 6 * u * t * (s[2] - s[0]) + 3 * t * t * (s[4] - s[2])
        var dy = 3 * u * u * (s[1] - y0) + 6 * u * t * (s[3] - s[1]) + 3 * t * t * (s[5] - s[3])
        L += G[g][1] / 2 / N * Math.sqrt(dx * dx + dy * dy)
      }
    }
    return L
  }
  function subLength(sp) {
    var L = 0, x = sp.x, y = sp.y
    sp.segs.forEach(function (s) { L += segLength(x, y, s); x = s[4]; y = s[5] })
    if (sp.closed) L += Math.hypot(sp.x - x, sp.y - y)
    return L
  }

  // Walk the tree with inherited presentation attributes -> flat list of drawable elements (document order).
  var INHERIT = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
    'fill-opacity', 'stroke-opacity', 'fill-rule', 'color', 'visibility']
  // gradient id -> its middle colour as rgba(): the colour at offset 0.5 (stop colours baked, stop-opacity kept)
  function gradientMids(src, bake, ink) {
    var out = {}, re = /<(linearGradient|radialGradient)\b([^>]*)>([\s\S]*?)<\/\1\s*>/g, m
    while ((m = re.exec(src))) {
      var ga = parseAttrs(m[2]), stops = [], sr = /<stop\b((?:[^>"']|"[^"]*"|'[^']*')*?)\/?>/g, s
      if (!ga.id) continue
      while ((s = sr.exec(m[3]))) {
        var a = parseAttrs(s[1])
        var col = String(bake(a['stop-color'] == null ? '#000000' : a['stop-color'])).trim()
        var c = parseColor(/^currentcolor$/i.test(col) ? ink : col)
        if (!c) continue
        var off = parseFloat(a.offset)
        off = !isFinite(off) ? 0 : /%\s*$/.test(a.offset) ? off / 100 : off
        var so = num0(a['stop-opacity'] == null ? 1 : bake(a['stop-opacity']), 1)
        stops.push([Math.max(0, Math.min(1, off)), c[0], c[1], c[2], c[3] * Math.max(0, Math.min(1, so))])
      }
      if (!stops.length) continue
      var lo = stops[0], hi = stops[stops.length - 1]
      for (var i = 0; i < stops.length; i++) { if (stops[i][0] <= 0.5) lo = stops[i]; if (stops[i][0] >= 0.5) { hi = stops[i]; break } }
      var t = hi[0] > lo[0] ? (0.5 - lo[0]) / (hi[0] - lo[0]) : 0
      var mix = function (k) { return lo[k] + (hi[k] - lo[k]) * Math.max(0, Math.min(1, t)) }
      out[ga.id] = 'rgba(' + Math.round(mix(1) * 255) + ',' + Math.round(mix(2) * 255) + ',' + Math.round(mix(3) * 255) + ',' + r4(mix(4)) + ')'
    }
    return out
  }
  function collect(ctx, bake) {
    var tree = parseMarkup(String(ctx.inner || ''))
    var GRADS = gradientMids(String(ctx.inner || ''), bake, ctx.color || '#000000')
    var rootAttrs = {}, rootSrc = ctx.root || {}
    for (var k in rootSrc) rootAttrs[k] = bake(String(rootSrc[k]))
    var base = { fill: '#000000', stroke: 'none', 'stroke-width': '1', 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter', 'stroke-miterlimit': '4',
      'fill-opacity': '1', 'stroke-opacity': '1', 'fill-rule': 'nonzero', color: ctx.color || '#000000', visibility: 'visible' }
    var out = []
    function resolveColor(v, st) {
      v = String(v).trim()
      if (v === 'currentColor' || v === 'currentcolor') return st.color
      var u = /^url\(\s*['"]?#?([^'")\s]*)['"]?\s*\)\s*(.*)$/.exec(v)
      if (u) return GRADS[u[1]] || (u[2] ? resolveColor(u[2], st) : st.color)
      return v
    }
    function walk(node, inh, mtx, op, role) {
      var a = {}
      for (var k2 in node.attrs) a[k2] = bake(node.attrs[k2])
      if (a.display === 'none') return
      var st = {}
      INHERIT.forEach(function (p) { st[p] = a[p] != null && a[p] !== 'inherit' ? a[p] : inh[p] })
      if (a.color != null) st.color = resolveColor(a.color, { color: inh.color })
      var m = a.transform ? mul(mtx, parseTransform(a.transform)) : mtx
      var o = op * (a.opacity != null ? Math.max(0, Math.min(1, num0(a.opacity, 1))) : 1)
      if (a['class'] && partRole(a['class'], { shine: true }) !== 'obj') role = partRole(a['class'], { shine: true })
      if (node.tag === 'g' || node.tag === 'svg' || node.tag === 'root' || node.tag === 'a') {
        node.children.forEach(function (c) { walk(c, st, m, o, role) })
        return
      }
      var d = shapeToPath(node.tag, a)
      if (!d || st.visibility === 'hidden') return
      var subs = parsePath(d).filter(function (sp) { return sp.segs.length || sp.closed })
      if (!subs.length) return
      out.push({ tag: node.tag, id: a.id || null, subs: subs, m: m, opacity: o, role: role || 'obj',
        fill: parseColor(resolveColor(st.fill, st)), stroke: parseColor(resolveColor(st.stroke, st)), st: st })
    }
    var start = {}
    INHERIT.forEach(function (p) { start[p] = rootAttrs[p] != null ? rootAttrs[p] : base[p] })
    if (rootAttrs.color) start.color = rootAttrs.color === 'currentColor' ? base.color : rootAttrs.color
    walk(tree, start, I, 1, 'obj')
    return out
  }

  /* ───────────────────────── Lottie shapes ───────────────────────── */
  // subpath in 24-grid -> Lottie bezier { i, o, v, c } in comp pixels via xf(x, y)
  function toBezier(sp, xf) {
    var P = function (x, y) { return xf(x, y) }
    var nodes = [{ v: P(sp.x, sp.y), i: [0, 0], o: [0, 0] }], x = sp.x, y = sp.y
    sp.segs.forEach(function (s) {
      var last = nodes[nodes.length - 1], c1 = P(s[0], s[1]), c2 = P(s[2], s[3]), e = P(s[4], s[5])
      last.o = [c1[0] - last.v[0], c1[1] - last.v[1]]
      nodes.push({ v: e, i: [c2[0] - e[0], c2[1] - e[1]], o: [0, 0] })
      x = s[4]; y = s[5]
    })
    if (sp.closed && nodes.length > 1) {
      var l = nodes[nodes.length - 1], f = nodes[0]
      if (Math.abs(l.v[0] - f.v[0]) < 1e-6 && Math.abs(l.v[1] - f.v[1]) < 1e-6) { f.i = l.i; nodes.pop() }
    }
    var rr = function (p) { return [r3(p[0]), r3(p[1])] }
    return { i: nodes.map(function (n) { return rr(n.i) }), o: nodes.map(function (n) { return rr(n.o) }), v: nodes.map(function (n) { return rr(n.v) }), c: !!sp.closed }
  }
  function staticTr(o) {
    return { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: o || { a: 0, k: 100 },
      sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' }
  }
  function group(nm, items, opacity) { return { ty: 'gr', nm: nm, np: items.length, cix: 2, bm: 0, it: items.concat([staticTr(opacity)]) } }
  function colorK(c) { return [r4(c[0]), r4(c[1]), r4(c[2]), 1] }
  var CAP = { butt: 1, round: 2, square: 3 }, JOIN = { miter: 1, 'miter-clip': 1, arcs: 1, round: 2, bevel: 3 }

  // element -> paint items
  function fillItem(el) {
    var c = el.fill, fo = Math.max(0, Math.min(1, num0(el.st['fill-opacity'], 1)))
    return { ty: 'fl', nm: 'Fill', c: { a: 0, k: colorK(c) }, o: { a: 0, k: r3(c[3] * fo * 100) }, r: el.st['fill-rule'] === 'evenodd' ? 2 : 1, bm: 0 }
  }
  function strokeItem(el, scale) {
    var c = el.stroke, so = Math.max(0, Math.min(1, num0(el.st['stroke-opacity'], 1)))
    var det = Math.sqrt(Math.abs(el.m[0] * el.m[3] - el.m[1] * el.m[2])) || 1
    var w = num0(el.st['stroke-width'], 1) * det * scale
    var it = { ty: 'st', nm: 'Stroke', c: { a: 0, k: colorK(c) }, o: { a: 0, k: r3(c[3] * so * 100) }, w: { a: 0, k: r3(w) },
      lc: CAP[el.st['stroke-linecap']] || 1, lj: JOIN[el.st['stroke-linejoin']] || 1, ml: r3(num0(el.st['stroke-miterlimit'], 4)), bm: 0 }
    var da = dashes(el.st['stroke-dasharray'])
    if (da) {
      var d = []
      // unique names: lottie-web exposes them as properties and throws on duplicates
      da.forEach(function (v, i) { var n = Math.floor(i / 2) + 1; d.push({ n: i % 2 ? 'g' : 'd', nm: (i % 2 ? 'Gap' : 'Dash') + (n > 1 ? ' ' + n : ''), v: { a: 0, k: r3(v * det * scale) } }) })
      d.push({ n: 'o', nm: 'Offset', v: { a: 0, k: r3(num0(el.st['stroke-dashoffset'], 0) * det * scale) } })
      it.d = d
    }
    return it
  }
  function dashes(v) {
    if (!v || v === 'none') return null
    var a = (String(v).match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number)
    if (!a.length || a.some(function (x) { return x < 0 }) || a.every(function (x) { return x === 0 })) return null
    return a.length % 2 ? a.concat(a) : a
  }

  // Everything that varies over time lives in `anim`: { t(pct) -> frames, draw: {...} | null }
  function elementGroup(el, idx, ctxGeo, draw) {
    var xf = function (x, y) { var p = apply(el.m, x, y); return [p[0] * ctxGeo.s + ctxGeo.off, p[1] * ctxGeo.s + ctxGeo.off] }
    var paths = el.subs.map(function (sp, j) { return { ty: 'sh', nm: 'Path ' + (j + 1), ks: { a: 0, k: toBezier(sp, xf) } } })
    var nm = (el.id || el.tag) + ' ' + (idx + 1)
    var hasStroke = !!el.stroke && num0(el.st['stroke-width'], 1) > 0, hasFill = !!el.fill
    if (!hasStroke && !hasFill) return null
    var opacity = el.opacity < 1 ? { a: 0, k: r3(el.opacity * 100) } : null
    if (!draw) {
      var items = paths.slice()
      if (hasStroke) items.push(strokeItem(el, ctxGeo.s))
      if (hasFill) items.push(fillItem(el))
      return group(nm, items, opacity)
    }
    // draw: stroked (undashed) elements draw on per subpath; everything else fades (draw.fade)
    var drawable = hasStroke && !dashes(el.st['stroke-dasharray'])
    var elOpacity = drawable ? draw.strokeOpacity(el.opacity) : draw.fadeOpacity(el.opacity)
    if (!drawable) {
      var it2 = paths.slice()
      if (hasStroke) it2.push(strokeItem(el, ctxGeo.s))
      if (hasFill) it2.push(fillItem(el))
      return group(nm, it2, elOpacity)
    }
    var lens = el.subs.map(subLength), total = lens.reduce(function (a, b) { return a + b }, 0) || 1
    var strokeKids = paths.map(function (p, j) { return group('Draw ' + (j + 1), [p, draw.trim(lens[j] / total)]) })
    var parts = [group('Stroke', strokeKids.concat([strokeItem(el, ctxGeo.s)]))]
    if (hasFill) parts.push(group('Fill', paths.map(function (p) { return JSON.parse(JSON.stringify(p)) }).concat([fillItem(el)])))
    return group(nm, parts, elOpacity)
  }

  /* ───────────────────────── swaps ("Turn into": A -> B -> A, on a loop) ─────────────────────────
     Port of @withicons/motion's swap effects (keyframes.js EFFECT_STATES + swapLoopStops): the hidden state of the
     outgoing (a) and incoming (b) icon per effect, as layer channels (x / y in % of the icon box, s scale, r / ry degrees,
     o opacity). blur and morph keep their scale / rotation / fade (Lottie players have no reliable blur); draw fades. */
  var FXS = {
    fade: { a: { o: 0 }, b: { o: 0 } },
    scale: { a: { s: 0.35, o: 0 }, b: { s: 0.35, o: 0 }, spring: 1 },
    rotate: { a: { r: 90, s: 0.5, o: 0 }, b: { r: -90, s: 0.5, o: 0 }, spring: 1 },
    flip: { a: { ry: 180, o: 0 }, b: { ry: -180, o: 0 }, flip: 1 },
    'slide-up': { a: { y: -100, o: 0 }, b: { y: 100, o: 0 }, clip: 1 },
    'slide-down': { a: { y: 100, o: 0 }, b: { y: -100, o: 0 }, clip: 1 },
    'slide-left': { a: { x: -100, o: 0 }, b: { x: 100, o: 0 }, clip: 1 },
    'slide-right': { a: { x: 100, o: 0 }, b: { x: -100, o: 0 }, clip: 1 },
    blur: { a: { s: 1.18, o: 0 }, b: { s: 0.82, o: 0 } },
    spin: { a: { r: 180, s: 0.3, o: 0 }, b: { r: -180, s: 0.3, o: 0 }, spring: 1 },
    morph: { a: { s: 0.55, r: 40, o: 0 }, b: { s: 0.55, r: -40, o: 0 }, spring: 1 },
    draw: { a: { o: 0 }, b: { o: 0 } }
  }
  var FX_DUR = { fade: 0.3, scale: 0.45, rotate: 0.5, flip: 0.6, 'slide-up': 0.42, 'slide-down': 0.42, 'slide-left': 0.42, 'slide-right': 0.42, blur: 0.45, spin: 0.55, morph: 0.55, draw: 0.75 }
  var SWE = { enter: [0.22, 1, 0.36, 1], spring: [0.3, 1.45, 0.55, 1], exit: [0.4, 0, 0.6, 1], flip: [0.45, 0, 0.2, 1] }
  var SW_EASES = { springy: 'cubic-bezier(.3,1.75,.5,1)', smooth: 'cubic-bezier(.65,0,.35,1)', snappy: 'cubic-bezier(.12,.9,.18,1)', gentle: 'cubic-bezier(.4,0,.2,1)', linear: 'linear' }
  var VIS = { x: 0, y: 0, s: 1, r: 0, ry: 0, o: 1 }
  function chan(st) { var c = {}; for (var k in VIS) c[k] = st[k] == null ? VIS[k] : st[k]; return c }
  // ctx.swap -> { effect, dur, hold, cycle, ease (parsed or null) } or null (no swap to export)
  function resolveSwap(ctx, opts) {
    var s = ctx.swap
    if (!s || !s.inner || (opts && opts.static) || ctx.motion === false) return null
    var effect = FXS[s.effect] ? s.effect : 'fade'
    var dur = Math.max(0.05, Number(s.duration) || FX_DUR[effect])
    var hasHold = s.hold != null && s.hold !== '' && isFinite(Number(s.hold))
    var hold = hasHold ? Math.max(0, Number(s.hold)) : null
    var cycle = Number(s.cycle) > 0 && !hasHold ? Number(s.cycle) : hasHold ? 2 * (dur + hold) : 2.4
    var e = s.ease ? (SW_EASES[s.ease] || s.ease) : null
    return { effect: effect, dur: dur, hold: hold, cycle: r4(cycle), ease: e ? parseEase(e) : null }
  }
  // the A and B stop lists of one cycle (percent, channels, easing to the next stop), as swapLoopStops builds them
  function swapStops(sw) {
    var st = FXS[sw.effect], f = Math.min(sw.hold != null ? 0.5 : 0.24, sw.dur / sw.cycle)
    var ex = st.flip ? f : f * 0.62, lag = st.flip ? 0 : f * 0.14
    var userB = sw.ease && sw.ease.b ? sw.ease.b : null
    var enter = userB || (st.flip ? SWE.flip : st.spring ? SWE.spring : SWE.enter), exit = st.flip ? (userB || SWE.flip) : SWE.exit
    var P = function (x) { return x * 100 }, h1 = 0.5 - f, h2 = 1 - f
    var va = chan({}), ha = chan(st.a), hb = chan(st.b)
    return {
      a: [[0, va], [P(h1), va, exit], [P(h1 + ex), ha], [P(h2 + lag), ha, enter], [100, va]],
      b: [[0, hb], [P(h1 + lag), hb, enter], [P(h1 + f), va], [P(h2), va, exit], [P(h2 + ex), hb], [100, hb]]
    }
  }
  function shapesOf(c, geo, bake) {
    var shapes = []
    collect(c, bake).forEach(function (el, i) { var g = elementGroup(el, i, geo, null); if (g) shapes.unshift(g) })
    return shapes
  }
  function buildSwap(ctx, opts, sw) {
    opts = opts || {}
    var WE = we() || {}
    var bakeWith = function (vars) { return function (s) { return WE.bakeVars ? WE.bakeVars(s, vars || {}) : bakeVarsLocal(s, vars || {}) } }
    var size = Math.max(16, Math.round(Number(opts.size) || 512))
    var pad = Math.max(0, Math.min(0.4, Number(opts.padding) || 0))
    var s = size / (24 * (1 + 2 * pad)), off = 24 * pad * s
    var geo = { s: s, off: off }
    var B = ctx.swap
    var ctxB = { name: B.name, style: B.style, title: B.title, inner: B.inner, root: B.root || ctx.root, color: B.color || ctx.color, vars: B.vars || {} }
    var op = r4(sw.cycle * FPS), T = function (pct) { return pct / 100 * sw.cycle * FPS }
    var A = [r3(12 * s + off), r3(12 * s + off), 0], unit = 0.24 * s
    var stops = swapStops(sw), fx = FXS[sw.effect]
    var LIN = parseEase('linear')
    function layerKs(list) {
      var st = list.map(function (x) { return { t: T(x[0]), ease: x[2] ? parseEase(x[2]) : LIN, c: chan(x[1]) } })
      if (fx.flip) {
        // rotateY has no 2D equivalent: sample it, scaleX = cos(angle), and hide the back face (backface-visibility: hidden)
        st = bakeStops(st, op).map(function (x) { var c = x.c, k = Math.cos(c.ry * Math.PI / 180); return { t: x.t, ease: x.ease, c: { x: c.x, y: c.y, s: c.s, r: c.r, ry: c.ry, o: k <= 0.0001 ? 0 : c.o } } })
      }
      var ch = function (fn, dims) { return prop(st.map(function (x) { return { t: x.t, v: fn(x.c), ease: x.ease } }), dims, lerpN) }
      return {
        o: ch(function (c) { return r3(c.o * 100) }, 1),
        r: ch(function (c) { return r3(c.r) }, 1),
        p: ch(function (c) { return [r3(A[0] + c.x * unit), r3(A[1] + c.y * unit), 0] }, 3),
        a: { a: 0, k: A.slice() },
        s: ch(function (c) { return [r3(c.s * Math.cos(c.ry * Math.PI / 180) * 100), r3(c.s * 100), 100] }, 3)
      }
    }
    // slides keep to the icon box (motion.css clips them with inset(-.15em)): a still mask a hair wider than the box
    var clip = function () {
      var b = 0.15 * 24 * s / 4, x0 = r3(off - b), x1 = r3(off + 24 * s + b)
      return [{ inv: false, mode: 'a', nm: 'Clip', o: { a: 0, k: 100 }, x: { a: 0, k: 0 },
        pt: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0], [0, 0]], v: [[x0, x0], [x1, x0], [x1, x1], [x0, x1]], c: true } } }]
    }
    var mk = function (ind, nm, shapes, ks) {
      var L = { ddd: 0, ind: ind, ty: 4, nm: nm, sr: 1, ks: ks, ao: 0, shapes: shapes, ip: 0, op: op, st: 0, bm: 0 }
      if (fx.clip) { L.hasMask = true; L.masksProperties = clip() }
      return L
    }
    // B above A, as in the page (the second child paints on top)
    var layers = [
      mk(1, (B.title || B.name || 'after') + ' (after)', shapesOf(ctxB, geo, bakeWith(ctxB.vars)), layerKs(stops.b)),
      mk(2, (ctx.title || ctx.name || 'before') + ' (before)', shapesOf(ctx, geo, bakeWith(ctx.vars)), layerKs(stops.a))
    ]
    var bg = opts.background ? parseColor(opts.background) : null
    if (bg) {
      layers.push({ ddd: 0, ind: 3, ty: 4, nm: 'Background', sr: 1, ao: 0, ip: 0, op: op, st: 0, bm: 0,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [group('Background', [{ ty: 'rc', nm: 'Rect', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [size / 2, size / 2] }, r: { a: 0, k: 0 } },
          { ty: 'fl', nm: 'Fill', c: { a: 0, k: colorK(bg) }, o: { a: 0, k: r3(bg[3] * 100) }, r: 1, bm: 0 }])] })
    }
    var title = (ctx.title || ctx.name || 'icon') + ' to ' + (B.title || B.name || 'icon')
    return {
      v: '5.7.4', fr: FPS, ip: 0, op: op, w: size, h: size, nm: title, ddd: 0, assets: [], layers: layers, markers: [],
      meta: { g: 'with icons (withicons.com)', a: 'with icons', d: (ctx.name || '') + ' / ' + (ctx.style || '') + ' turns into ' + (B.name || '') + ' / ' + (B.style || '') + ' (' + sw.effect + ')', k: 'icon, ' + (ctx.name || '') + ', ' + (B.name || '') }
    }
  }

  /* ───────────────────────── the composition ───────────────────────── */
  /* ───────────────────────── parts choreography ───────────────────────── */
  // Renderers tag SVG nodes (wm-deco, wm-shadow, wm-a, wm-s; forge/MOTION.md "Parts choreography"). With the motion
  // runtime on the page (window.WithMotion: the same partsPlan / sampleRole the CSS, previews and frame exports use),
  // each run of same-role elements becomes its own layer: the object plays the preset, plates their override,
  // decorations their own counter-phased loop, ground shadows stay put. Values are sampled twice per frame (linear),
  // so they match the CSS at every instant. Without the runtime (Node) the icon moves as one layer, as before.
  // { shine: true }: the highlight (wm-shine) is its own layer, which 3D presets move against the turn
  function partRole(cls, o) {
    var WMr = motionRuntime()
    if (WMr && WMr.partRole) return WMr.partRole(cls, o)
    var c = ' ' + String(cls || '').replace(/\s+/g, ' ') + ' '
    return c.indexOf(' wm-deco ') >= 0 ? 'deco' : c.indexOf(' wm-shadow ') >= 0 ? 'shadow' : c.indexOf(' wm-a ') >= 0 ? 'a' : c.indexOf(' wm-s ') >= 0 ? 's' :
      o && o.shine && c.indexOf(' wm-shine ') >= 0 ? 'shine' : 'obj'
  }
  function motionRuntime() {
    var g = typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : {}
    var W = g.WithMotion
    return W && W.partsPlan && W.sampleRole && W.sampleMatrix ? W : null
  }
  function buildParts(ctx, opts, mo, els, geo, size, WM) {
    var s = geo.s, off = geo.off
    var st = /^steps\((\d+)/.exec(mo.ease || '')
    var m = { preset: mo.preset, trigger: mo.trigger, loop: mo.loop, duration: mo.duration, k: mo.k, origin: mo.origin,
      dir: (Math.atan2(mo.dy, mo.dx) * 180 / Math.PI + 360) % 360, steps: st ? +st[1] : 0, ease: mo.ease, delay: 0 }
    if (ctx.style) m.style = ctx.style   // partsPlan maps the spec for 3D / backdrop styles
    var plan = WM.partsPlan(m, ctx.motionSpec || null, { deco: els.some(function (e) { return e.role === 'deco' }) })
    var secs = mo.loop ? plan.cycle : mo.duration + (plan.deco ? Math.max(0, plan.deco.delay) : 0)
    var op = r4(secs * FPS)
    var LIN = parseEase('linear')
    var P = function (x, y) { return [r3(x * s + off), r3(y * s + off)] }
    // runs of consecutive elements with the same role keep the drawing order
    var runs = []
    els.forEach(function (el) {
      var last = runs[runs.length - 1]
      if (last && last.role === el.role) last.els.push(el)
      else runs.push({ role: el.role, els: [el] })
    })
    var layers = []
    runs.forEach(function (run, ri) {
      var shapes = []
      run.els.forEach(function (el, i) { var g = elementGroup(el, i, geo, null); if (g) shapes.unshift(g) })
      var r = plan[run.role]
      var C = [r3(12 * s + off), r3(12 * s + off), 0]
      var ks = { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: C.slice() }, a: { a: 0, k: C.slice() }, s: { a: 0, k: [100, 100, 100] } }
      var mask = null
      if (r) {
        // the reference box: the icon grid, or (decorations) the run's own bounds
        var box = [0, 0, 24, 24]
        if (r.box === 'fill-box') {
          var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
          run.els.forEach(function (el) {
            el.subs.forEach(function (sp) {
              sp.segs.forEach(function (sg) {
                for (var j = 0; j < 6; j += 2) { var q = apply(el.m, sg[j], sg[j + 1]); x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]) }
              })
            })
          })
          if (x1 > x0) box = [x0, y0, x1 - x0, y1 - y0]
        }
        var o = r.origin ? r.origin : [box[0] + box[2] / 2, box[1] + box[3] / 2]
        var ang = (r.dir || 0) * Math.PI / 180
        var mode = { k: r.k == null ? 1 : r.k, dx: Math.cos(ang), dy: Math.sin(ang), em: 16 }
        var samples = [], prevR = null
        for (var f = 0; f <= Math.round(op * 2); f++) {
          var sm = WM.sampleRole(r, mode, f / 2 / FPS)
          var M = WM.sampleMatrix(sm, o, box)
          var pos = [M[0] * o[0] + M[2] * o[1] + M[4], M[1] * o[0] + M[3] * o[1] + M[5]]
          var sx = Math.sqrt(M[0] * M[0] + M[1] * M[1]), rot = Math.atan2(M[1], M[0]) * 180 / Math.PI
          var sy = sx ? (M[0] * M[3] - M[1] * M[2]) / sx : 1
          // M = rotate . skewX . scale: the 3D presets' projected poses carry a shear (lottie-web: skew(-sk), axis 0)
          var shear = sx && sy ? (M[0] * M[2] + M[1] * M[3]) / sx / sy : 0
          if (prevR != null) rot += Math.round((prevR - rot) / 360) * 360   // unwrap: no 179 -> -179 jumps
          prevR = rot
          samples.push({ t: f / 2, ease: LIN, c: { p: pos, r: rot, sx: sx, sy: sy, sk: -Math.atan(shear) * 180 / Math.PI, o: sm.opacity, clip: sm.clip } })
        }
        var A = P(o[0], o[1])
        var ch = function (fn, dims) { return prop(samples.map(function (x) { return { t: x.t, v: fn(x.c), ease: x.ease } }), dims, lerpN) }
        ks = { a: { a: 0, k: [A[0], A[1], 0] }, p: ch(function (c) { var q = P(c.p[0], c.p[1]); return [q[0], q[1], 0] }, 3),
          r: ch(function (c) { return r3(c.r) }, 1), s: ch(function (c) { return [r3(c.sx * 100), r3(c.sy * 100), 100] }, 3), o: ch(function (c) { return r3(c.o * 100) }, 1) }
        if (samples.some(function (x) { return Math.abs(x.c.sk) > 1e-3 })) { ks.sk = ch(function (c) { return r3(c.sk) }, 1); ks.sa = { a: 0, k: 0 } }
        if (samples.some(function (x) { return x.c.clip })) {
          // CSS clip-path: inset(...) of `pass`, in the layer's own (untransformed) space
          mask = { inv: false, mode: 'a', nm: 'Clip', o: { a: 0, k: 100 }, x: { a: 0, k: 0 },
            pt: prop(samples.map(function (x) {
              var c = x.c.clip || [0, 0, 0, 0], B = 24 * s, u = 0.24 * s
              var X0 = off + c[3] * u, X1 = Math.max(X0, off + B - c[1] * u), Y0 = off + c[0] * u, Y1 = Math.max(Y0, off + B - c[2] * u)
              return { t: x.t, ease: LIN, v: [{ i: [[0, 0], [0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0], [0, 0]], v: [[r3(X0), r3(Y0)], [r3(X1), r3(Y0)], [r3(X1), r3(Y1)], [r3(X0), r3(Y1)]], c: true }] }
            }), 1, function (q) { return q }) }
          if (mask.pt.a === 0) mask.pt.k = mask.pt.k[0]
        }
      }
      var nm = { obj: 'Object', a: 'Part A', s: 'Part S', deco: 'Decoration', shadow: 'Shadow', shine: 'Shine' }[run.role] + (runs.length > 1 ? ' ' + (ri + 1) : '')
      var L = { ddd: 0, ind: 0, ty: 4, nm: nm, sr: 1, ks: ks, ao: 0, shapes: shapes, ip: 0, op: op, st: 0, bm: 0 }
      if (mask) { L.hasMask = true; L.masksProperties = [mask] }
      layers.unshift(L)   // Lottie: the first layer is on top
    })
    var bg = opts.background ? parseColor(opts.background) : null
    if (bg) {
      layers.push({ ddd: 0, ind: 0, ty: 4, nm: 'Background', sr: 1, ao: 0, ip: 0, op: op, st: 0, bm: 0,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [group('Background', [{ ty: 'rc', nm: 'Rect', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [size / 2, size / 2] }, r: { a: 0, k: 0 } },
          { ty: 'fl', nm: 'Fill', c: { a: 0, k: colorK(bg) }, o: { a: 0, k: r3(bg[3] * 100) }, r: 1, bm: 0 }])] })
    }
    layers.forEach(function (L, i) { L.ind = i + 1 })
    var title = (ctx.title || ctx.name || 'icon') + ' (' + mo.preset + ')'
    return {
      v: '5.7.4', fr: FPS, ip: 0, op: op, w: size, h: size, nm: title, ddd: 0, assets: [], layers: layers, markers: [],
      meta: { g: 'with icons (withicons.com)', a: 'with icons', d: (ctx.name || '') + ' / ' + (ctx.style || '') + ' / ' + mo.preset + ' ' + mo.trigger + ' / parts', k: 'icon, ' + (ctx.name || '') }
    }
  }

  function build(ctx, opts) {
    opts = opts || {}
    var sw = resolveSwap(ctx, opts)
    if (sw) return buildSwap(ctx, opts, sw)
    var WE = we() || {}
    var bake = function (s) { return WE.bakeVars ? WE.bakeVars(s, ctx.vars || {}) : bakeVarsLocal(s, ctx.vars || {}) }
    var size = Math.max(16, Math.round(Number(opts.size) || 512))
    var pad = Math.max(0, Math.min(0.4, Number(opts.padding) || 0))
    var s = size / (24 * (1 + 2 * pad)), off = 24 * pad * s
    var geo = { s: s, off: off }
    var mo = resolveMotion(ctx, opts)
    var els = collect(ctx, bake)
    var anyStroke = els.some(function (e) { return e.stroke && !dashes(e.st['stroke-dasharray']) })
    var dur = mo ? mo.duration : 1 / FPS
    var op = mo ? r4(dur * FPS) : 1
    var T = function (pct) { return pct / 100 * dur * FPS }
    var isDraw = mo && mo.preset === 'draw' && anyStroke
    var draw = null
    if (isDraw) {
      var pStops = mo.loop ? DRAW.pathLoop : DRAW.path, fStops = mo.loop ? DRAW.fillLoop : DRAW.fill
      var mk = function (list, key, mapv) {
        return prop(list.map(function (st) { return { t: T(st[0]), v: mapv(st[1][key]), ease: parseEase(st[2] || mo.ease) } }), 1, lerpN)
      }
      draw = {
        strokeOpacity: function (base) { return mo.loop ? mk(pStops, 'o', function (v) { return r3(v * base * 100) }) : (base < 1 ? { a: 0, k: r3(base * 100) } : null) },
        fadeOpacity: function (base) { return mk(fStops, 'o', function (v) { return r3(v * base * 100) }) },
        // trim end of one subpath: browsers restart the dash per subpath, so a subpath that is `frac` of the element's
        // length finishes when the element's progress reaches frac (then holds at 100%)
        trim: function (frac) {
          // CSS: dasharray "1 1.5" over pathLength 1, dashoffset 1.01 -> 0 eased; the dash restarts on every subpath,
          // so a subpath that is `frac` of the element's length shows min(1, (1.01 P - 0.01) / frac) of itself.
          var a = pStops[0], b = pStops[1], ez = parseEase(a[2]), t0 = T(a[0]), t1 = T(b[0])
          var bz = ez.b || [0, 0, 1, 1], f = Math.max(1e-6, Math.min(1, frac))
          var ya = 0.01 / 1.01, yb = Math.min(1, (f + 0.01) / 1.01)
          var se = subEase(bz, ya, yb), ta = t0 + (t1 - t0) * se.ta, tb = t0 + (t1 - t0) * se.tb, h = easeHandles(se.ease, 1)
          var k = [{ t: r4(t0), s: [0], h: 1 }, { t: r4(ta), s: [0], o: h.o, i: h.i }, { t: r4(tb), s: [100] }]
          if (k[1].t <= k[0].t) k.shift()
          return { ty: 'tm', nm: 'Trim Paths', s: { a: 0, k: 0 }, e: { a: 1, k: k }, o: { a: 0, k: 0 }, m: 1 }
        }
      }
    }
    var WM = mo && !isDraw ? motionRuntime() : null
    // parts, or a 3D preset (only the runtime knows its poses): sampled layers
    if (WM && (els.some(function (e) { return e.role !== 'obj' }) || !PRESET_DEFAULTS[mo.preset])) return buildParts(ctx, opts, mo, els, geo, size, WM)
    var shapes = []
    els.forEach(function (el, i) { var g = elementGroup(el, i, geo, draw); if (g) shapes.unshift(g) }) // Lottie: first item is on top

    // layer transform
    var ox = mo ? mo.origin[0] : 12, oy = mo ? mo.origin[1] : 12
    var A = [r3(ox * s + off), r3(oy * s + off), 0]
    var ks = { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: A.slice() }, a: { a: 0, k: A.slice() }, s: { a: 0, k: [100, 100, 100] } }
    var mask = null, glowStops = null
    if (mo && !isDraw) {
      var stops = presetStops(mo.preset, mo.loop, mo.k, mo.dx, mo.dy).map(function (st) {
        var v = st[1]
        return { t: T(st[0]), ease: parseEase(st[2] || mo.ease), c: {
          x: v.x || 0, y: v.y || 0, sx: v.sx == null ? 1 : v.sx, sy: v.sy == null ? 1 : v.sy, r: v.r || 0, ry: v.ry || 0, o: v.o == null ? 1 : v.o, orbit: v.orbit || 0, ga: v.ga || 0, g1: v.g1 || 0, g2: v.g2 || 0 } }
      })
      var unit = 0.24 * s // 1% of the 24 box in comp pixels
      var posOf = function (c) {
        var px = c.x * unit, py = c.y * unit
        if (c.orbit) { var th = c.orbit * Math.PI / 180, ra = 6 * mo.k * unit; px += ra * Math.cos(th) - ra; py += ra * Math.sin(th) }
        return [r3(A[0] + px), r3(A[1] + py), 0]
      }
      var scaleOf = function (c) { return [r3(c.sx * Math.cos(c.ry * Math.PI / 180) * 100), r3(c.sy * 100), 100] }
      if (mo.preset === 'glow' || mo.preset === 'twinkle') glowStops = stops
      var baked = mo.preset === 'flip' || mo.preset === 'orbit'
      if (baked) stops = bakeStops(stops, op)
      var chan = function (fn, dims) { return prop(stops.map(function (st) { return { t: st.t, v: fn(st.c), ease: st.ease } }), dims, lerpN) }
      ks.p = chan(posOf, 3)
      ks.s = chan(scaleOf, 3)
      ks.r = chan(function (c) { return r3(c.r) }, 1)
      ks.o = chan(function (c) { return r3(c.o * 100) }, 1)
      if (mo.preset === 'pass') {
        // CSS clip-path: inset(...) keeps the icon inside its own box while it slides out and back in
        mask = { inv: false, mode: 'a', nm: 'Clip', o: { a: 0, k: 100 }, x: { a: 0, k: 0 },
          pt: prop(stops.map(function (st) {
            var tx = st.c.x * unit, ty = st.c.y * unit, B = 24 * s
            var x0 = off + Math.max(0, -tx), x1 = off + B - Math.max(0, tx), y0 = off + Math.max(0, -ty), y1 = off + B - Math.max(0, ty)
            if (x1 < x0) x1 = x0
            if (y1 < y0) y1 = y0
            return { t: st.t, ease: st.ease, v: [{ i: [[0, 0], [0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0], [0, 0]], v: [[r3(x0), r3(y0)], [r3(x1), r3(y0)], [r3(x1), r3(y1)], [r3(x0), r3(y1)]], c: true }] }
          }), 1, function (a) { return a }) }
        if (mask.pt.a === 0) mask.pt.k = mask.pt.k[0]
      }
    }
    var layer = { ddd: 0, ind: 1, ty: 4, nm: ctx.title || ctx.name || 'icon', sr: 1, ks: ks, ao: 0, shapes: shapes, ip: 0, op: op, st: 0, bm: 0 }
    if (glowStops) {
      // CSS: drop-shadow(0 0 b1 glow 42%) drop-shadow(0 0 b2 glow 22%) -> two chained Drop Shadow effects
      // (Softness = 2 x the CSS blur radius; Opacity 0-255). Players without effect support simply skip the halo.
      var gc = colorK(parseColor(resolveGlow(ctx)) || [0, 0, 0, 1])
      layer.ef = [[0.42, 'g1'], [0.22, 'g2']].map(function (g, i) {
        var ch = function (fn) { return prop(glowStops.map(function (st) { return { t: st.t, v: fn(st.c), ease: st.ease } }), 1, lerpN) }
        // fs: lottie-web clips filters to the layer's bounding box unless the effect widens its region
        return { ty: 25, nm: 'Glow ' + (i + 1), mn: 'ADBE Drop Shadow', ix: i + 1, en: 1, np: 8, fs: { x: '-50%', y: '-50%', width: '200%', height: '200%' }, ef: [
          { ty: 2, nm: 'Shadow Color', mn: 'ADBE Drop Shadow-0001', ix: 1, v: { a: 0, k: gc } },
          { ty: 0, nm: 'Opacity', mn: 'ADBE Drop Shadow-0002', ix: 2, v: ch(function (c) { return r3(c.ga * g[0] * 255) }) },
          { ty: 1, nm: 'Direction', mn: 'ADBE Drop Shadow-0003', ix: 3, v: { a: 0, k: 0 } },
          { ty: 0, nm: 'Distance', mn: 'ADBE Drop Shadow-0004', ix: 4, v: { a: 0, k: 0 } },
          { ty: 0, nm: 'Softness', mn: 'ADBE Drop Shadow-0005', ix: 5, v: ch(function (c) { return r3(c[g[1]] * s * 2) }) },
          { ty: 4, nm: 'Shadow Only', mn: 'ADBE Drop Shadow-0006', ix: 6, v: { a: 0, k: 0 } }] }
      })
    }
    if (mask) { layer.hasMask = true; layer.masksProperties = [mask] }
    var layers = [layer]
    var bg = opts.background ? parseColor(opts.background) : null
    if (bg) {
      layers.push({ ddd: 0, ind: 2, ty: 4, nm: 'Background', sr: 1, ao: 0, ip: 0, op: op, st: 0, bm: 0,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [group('Background', [{ ty: 'rc', nm: 'Rect', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [size / 2, size / 2] }, r: { a: 0, k: 0 } },
          { ty: 'fl', nm: 'Fill', c: { a: 0, k: colorK(bg) }, o: { a: 0, k: r3(bg[3] * 100) }, r: 1, bm: 0 }])] })
    }
    var title = (ctx.title || ctx.name || 'icon') + (mo ? ' (' + mo.preset + ')' : '')
    return {
      v: '5.7.4', fr: FPS, ip: 0, op: op, w: size, h: size, nm: title, ddd: 0, assets: [], layers: layers, markers: [],
      meta: { g: 'with icons (withicons.com)', a: 'with icons', d: (ctx.name || '') + ' / ' + (ctx.style || '') + (mo ? ' / ' + mo.preset + ' ' + mo.trigger : ' / still'), k: 'icon, ' + (ctx.name || '') }
    }
  }
  // Sample a stop list at every frame (plus the exact stop times) -> linear / hold stops. Used where Lottie's
  // per-channel interpolation cannot express the CSS motion (rotateY, orbit).
  function resolveGlow(ctx) {
    var v = ctx.vars && ctx.vars['--wm-glow']
    return v && !/currentcolor/i.test(v) ? v : (ctx.color || '#000000')
  }
  function bakeStops(stops, op) {
    var times = []
    for (var f = 0; f <= Math.floor(op * 2 + 1e-9); f++) times.push(f / 2) // two samples per frame
    stops.forEach(function (st, i) {
      times.push(st.t)
      var nx = stops[i + 1]
      if (nx && st.ease.steps) for (var j = 1; j < st.ease.steps; j++) times.push(st.t + (nx.t - st.t) * j / st.ease.steps)
    })
    times = times.filter(function (t) { return t <= op + 1e-9 }).sort(function (a, b) { return a - b })
    times = times.filter(function (t, i) { return i === 0 || t - times[i - 1] > 1e-6 })
    var LIN = parseEase('linear')
    // every stop and step boundary is a sample, so a sample inside a hold / steps segment holds until the next one
    return times.map(function (t, i) {
      var ev = evalStops(stops, t)
      var hold = i < times.length - 1 && (ev.seg.ease.hold || ev.seg.ease.steps)
      return { t: t, c: ev.c, ease: hold ? { hold: true } : LIN }
    })
  }
  function evalStops(stops, t) {
    var i = 0
    while (i < stops.length - 2 && t >= stops[i + 1].t) i++
    var a = stops[i], b = stops[i + 1] || a
    var p = b.t > a.t ? Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t))) : 1
    if (t >= b.t && i === stops.length - 2) p = 1
    var e = easeValue(a.ease, p), c = {}
    for (var k in a.c) c[k] = a.c[k] + (b.c[k] - a.c[k]) * e
    return { c: c, idx: i, seg: a }
  }
  // fallback when registry.js is not loaded (Node tests): same rules as WithExport.bakeVars
  function bakeVarsLocal(s, vars) {
    var out = '', i = 0
    s = String(s)
    while (true) {
      var j = s.indexOf('var(', i)
      if (j < 0) return out + s.slice(i)
      var depth = 0, k = j + 3
      for (; k < s.length; k++) { if (s[k] === '(') depth++; else if (s[k] === ')' && --depth === 0) break }
      var body = s.slice(j + 4, k), comma = body.indexOf(',')
      var name = (comma < 0 ? body : body.slice(0, comma)).trim(), fb = comma < 0 ? null : body.slice(comma + 1).trim()
      out += s.slice(i, j) + (vars[name] || (fb === null ? 'currentColor' : bakeVarsLocal(fb, vars)))
      i = k + 1
    }
  }

  /* ───────────────────────── formats ───────────────────────── */
  function suffix(ctx, opts) {
    if (resolveSwap(ctx, opts)) return 'to-' + ctx.swap.name + (ctx.swap.style && ctx.swap.style !== ctx.style ? '-' + ctx.swap.style : '')
    var mo = resolveMotion(ctx, opts); return mo ? mo.preset + (mo.loop ? '' : '-' + mo.trigger) : 'still'
  }
  // the registry this module registered with (in Node, require it on demand)
  function we() {
    if (!api._WE && typeof module === 'object' && module.exports && typeof require === 'function') { try { api._WE = require('./registry.js') } catch (e) { } }
    return api._WE
  }
  function fname(ctx, sfx, ext) {
    return we() && api._WE.filename ? api._WE.filename(ctx, sfx, ext) : [ctx.name, ctx.style, sfx].filter(Boolean).join('-') + '.' + ext
  }
  function dotLottie(ctx, opts) {
    var anim = build(ctx, opts), mo = resolveMotion(ctx, opts), sw = resolveSwap(ctx, opts)
    if (sw) mo = { preset: 'turns into ' + ctx.swap.name, loop: true }
    var id = [ctx.name, ctx.style, suffix(ctx, opts)].filter(Boolean).join('-').replace(/[^a-zA-Z0-9_-]/g, '-') || 'icon'
    var manifest = {
      version: '1', generator: 'with icons (withicons.com)', author: 'with icons', revision: 1,
      description: (ctx.title || ctx.name || 'icon') + (mo ? ', ' + mo.preset : ''), keywords: 'with icons, ' + (ctx.name || ''),
      activeAnimationId: id,
      animations: [{ id: id, speed: 1, loop: !mo || mo.loop, autoplay: !!mo, direction: 1, playMode: 'normal' }]
    }
    return we().zip([{ name: 'manifest.json', data: JSON.stringify(manifest) }, { name: 'animations/' + id + '.json', data: JSON.stringify(anim) }])
  }
  var FORMATS = [
    { id: 'lottie', label: 'Lottie JSON', ext: 'json', mime: 'application/json', group: 'animated', audience: ['designers', 'developers', 'mobile', 'web'],
      transparent: true, animated: true,
      note: 'Vector animation for apps and sites (lottie-web, iOS, Android, Flutter, React Native) and for motion designers in After Effects or LottieFiles. Stays sharp at any size. Gradients become their middle colour.',
      available: function () { return true },
      run: function (ctx, opts) {
        return Promise.resolve({ data: JSON.stringify(build(ctx, opts)), filename: fname(ctx, suffix(ctx, opts), 'json'), mime: 'application/json' })
      } },
    { id: 'dotlottie', label: 'dotLottie', ext: 'lottie', mime: 'application/zip', group: 'animated', audience: ['designers', 'developers', 'mobile', 'web'],
      transparent: true, animated: true,
      note: 'The compact Lottie package (.lottie) with playback settings built in. Drop it into LottieFiles, Webflow, Framer or the dotLottie players. Gradients become their middle colour.',
      available: function () { return true },
      run: function (ctx, opts) {
        return Promise.resolve({ data: dotLottie(ctx, opts), filename: fname(ctx, suffix(ctx, opts), 'lottie'), mime: 'application/zip' })
      } }
  ]
  var api = function register(WithExport) { api._WE = WithExport; FORMATS.forEach(function (f) { WithExport.register(f) }); return FORMATS }
  api.register = api
  api.build = build
  api.dotLottie = function (ctx, opts) { return dotLottie(ctx, opts) }
  api.resolveMotion = resolveMotion
  api.resolveSwap = resolveSwap
  api.swapStops = swapStops
  api.presetStops = presetStops
  api.parsePath = parsePath
  api.FORMATS = FORMATS
  api._WE = null
  return api
})
