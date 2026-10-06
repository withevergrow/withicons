/* with icons — code export formats (text files for developers): React JSX, React TSX, Vue SFC, Svelte, React Native,
 * Angular standalone component, inline HTML, CSS class, data URI, base64 data URI.
 * Every file includes the @withicons/motion classes / imports when ctx.motion is set. A swap ("Turn into", ctx.swap from
 * the editor) keeps After's own style and colours, its trigger class and its timing variables (--wm-swap-*).
 * UMD: classic script in browsers (load after registry.js and vector.js; registers on window.WithExport), require() in
 * Node (module.exports is register(WithExport); it loads vector.js itself). Dependency-free.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var reg = function (WE) { if (!WE.vector) require('./vector.js')(WE); return factory(WE) }
    module.exports = reg; module.exports.register = reg
  } else if (root.WithExport) factory(root.WithExport)
})(typeof self !== 'undefined' ? self : this, function (WE) {
  var G = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : {}))
  var V = function () {
    if (!WE.vector) throw new Error('with icons export: load vector.js before code.js')
    return WE.vector
  }
  var SITE = 'https://withicons.com'
  var CDN = 'https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/'

  // ---------- names ----------
  function pascal(s) {
    var p = String(s).split(/[^a-zA-Z0-9]+/).filter(Boolean).map(function (w) { return w[0].toUpperCase() + w.slice(1) }).join('')
    return /^[0-9]/.test(p) ? 'Icon' + p : p
  }
  function compName(ctx) { return pascal(ctx.name + '-' + ctx.style) + 'Icon' }
  function kebab(ctx) { return (ctx.name + '-' + ctx.style).toLowerCase().replace(/[^a-z0-9]+/g, '-') }
  function iconUrl(ctx) { return SITE + '/icons/' + ctx.name + '.html' }
  function q(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'" }

  // ---------- motion ----------
  var PRESET_DEFAULTS = { spin: [1.2, 1.2], 'spin-once': [0.8, 2], tick: [1, 1], pulse: [1.4, 1.4], beat: [0.72, 1.2], breathe: [3, 3], float: [2.6, 2.6],
    bounce: [1, 1.15], sway: [2.8, 2.8], ring: [1.4, 2.6], wiggle: [0.8, 2], shake: [0.6, 1.8], nod: [0.8, 2], nudge: [0.9, 1.2], pass: [1.4, 1.4],
    rise: [1.6, 1.6], drop: [1.6, 1.6], blink: [0.42, 3.5], flicker: [1.6, 1.6], twinkle: [1.2, 1.8], pop: [0.5, 1.6], tada: [1, 2.4], jelly: [0.9, 2.2],
    flip: [1.2, 2.4], rock: [2.4, 2.4], tilt: [1.6, 2.6], zoom: [1.2, 2], orbit: [2.4, 2.4], glow: [1.8, 1.8], draw: [1.6, 3.2], type: [0.9, 1.4], fill: [1.6, 2] }
  var TRIGGERS = ['loop', 'hover', 'once', 'inview']
  var r4 = function (n) { return Math.round(n * 1e4) / 1e4 }
  var pct = function (v) { return String(r4(v / 24 * 100)).replace(/^0\./, '.').replace(/^-0\./, '-.') + '%' }
  var same = function (a, b) { return JSON.stringify(a) === JSON.stringify(b) }

  // ctx.motion -> { trigger, preset, name, classes, vars, runtime, opts (for motion()), swap }
  function motionPlan(ctx) {
    var m = ctx.motion
    if (!m) return null
    var trigger = TRIGGERS.indexOf(m.trigger) >= 0 ? m.trigger : 'loop'
    var spec = ctx.motionSpec || (G.WITH_MOTION && G.WITH_MOTION[ctx.name]) || null
    var slot = spec ? (trigger === 'loop' ? spec.loop : spec.hover) : null
    var preset = PRESET_DEFAULTS[m.preset] ? m.preset : (slot && slot.preset) || null
    var explicit = !!preset && (!slot || slot.preset !== preset)
    var classes = ['wm', 'wm-' + trigger], vars = {}, o = {}
    if (explicit) classes.push('wm-p-' + preset)
    var differs = function (k) { return m[k] != null && m[k] !== '' && (explicit || !slot || !same(m[k], slot[k])) }
    if (differs('duration')) { vars['--wm-dur'] = r4(Number(m.duration)) + 's'; o.duration = r4(Number(m.duration)) }
    if (differs('amount')) { vars['--wm-k'] = String(r4(Number(m.amount))); o.amount = r4(Number(m.amount)) }
    if (differs('origin') && m.origin.length === 2) { vars['--wm-ox'] = pct(m.origin[0]); vars['--wm-oy'] = pct(m.origin[1]); o.origin = m.origin }
    if (differs('dir')) {
      var a = Number(m.dir) * Math.PI / 180
      vars['--wm-dx'] = String(r4(Math.cos(a))); vars['--wm-dy'] = String(r4(Math.sin(a))); o.dir = Number(m.dir)
    }
    if (m.steps > 0 && (explicit || !slot || slot.steps !== m.steps)) { vars['--wm-ease'] = 'steps(' + Math.round(m.steps) + ')'; o.steps = Math.round(m.steps) }
    var p = { trigger: trigger, preset: preset, explicit: explicit, name: ctx.name, classes: classes, vars: vars,
      runtime: preset === 'draw' || trigger === 'inview', slot: slot, m: m, swap: null }
    p.opts = Object.assign({ trigger: trigger }, explicit ? { preset: preset } : {}, o)
    p.duration = Number(m.duration) || (slot && slot.duration) || (PRESET_DEFAULTS[preset] || [1, 1.4])[trigger === 'loop' ? 1 : 0]
    p.amount = m.amount != null ? Number(m.amount) : (slot && slot.amount != null ? slot.amount : 1)
    p.origin = m.origin || (slot && slot.origin) || [12, 12]
    p.dir = m.dir != null ? Number(m.dir) : (slot && slot.dir != null ? slot.dir : 0)
    if (m.swapTo || (ctx.swap && ctx.swap.inner)) p.swap = swapTarget(ctx, m.swapTo || (ctx.swap.name + '@' + ctx.swap.style), (ctx.swap && ctx.swap.effect) || m.effect)
    // the swap's own timing goes on its wrapper (only what differs from motion.css defaults)
    if (p.swap) for (var sk in p.swap.vars) p.vars[sk] = p.swap.vars[sk]
    return p
  }
  function styleVars(vars) { return Object.keys(vars).map(function (k) { return k + ':' + vars[k] }).join(';') }
  var SWAP_DUR = { fade: 0.3, scale: 0.45, rotate: 0.5, flip: 0.6, 'slide-up': 0.42, 'slide-down': 0.42, 'slide-left': 0.42, 'slide-right': 0.42, blur: 0.45, spin: 0.55, morph: 0.55, draw: 0.75 }
  var SWAP_EASES = { springy: 'cubic-bezier(.3,1.75,.5,1)', smooth: 'cubic-bezier(.65,0,.35,1)', snappy: 'cubic-bezier(.12,.9,.18,1)', gentle: 'cubic-bezier(.4,0,.2,1)', linear: 'linear' }
  // The other icon of a swap (A turns into B). Uses ctx.swap { name, style, inner, root, color, vars, effect, duration,
  // ease, delay, hold, trigger } when the editor passes it (After's own style, colours and timing), else the site's loaded
  // data (window.WITH_SVG / window.WITH) in Before's colours. Returns null when B's markup is not available.
  function swapTarget(ctx, to, effect) {
    var parts = String(to).split('@'), name = parts[0], style = parts[1] || ctx.style
    var s = ctx.swap && ctx.swap.inner ? ctx.swap : null
    if (!s) {
      var inner = G.WITH_SVG && G.WITH_SVG[style] && G.WITH_SVG[style][name]
      var st = G.WITH && G.WITH.styles && G.WITH.styles.filter(function (x) { return x.name === style })[0]
      if (!inner || !st) return null
      s = { name: name, style: style, inner: inner, root: st.root }
    }
    var b = {}
    for (var k in ctx) b[k] = ctx[k]
    b.name = s.name || name; b.style = s.style || style; b.inner = s.inner; b.root = s.root || ctx.root; b.title = null
    if (s === ctx.swap) { if (s.color) b.color = s.color; b.vars = s.vars || {} }
    var e = effect || 'fade', o = ctx.swap || {}, vars = {}
    if (o.duration && Math.abs(o.duration - (SWAP_DUR[e] || 0.3)) > 0.001) vars['--wm-swap-dur'] = r4(o.duration) + 's'
    var ez = o.ease && (SWAP_EASES[o.ease] || (/^(cubic-bezier|steps|linear)/.test(o.ease) ? o.ease : null)); if (ez) vars['--wm-swap-ease'] = ez
    if (o.delay > 0) vars['--wm-swap-delay'] = r4(o.delay) + 's'
    if (o.trigger === 'auto' && o.hold != null && Math.abs(o.hold - 0.9) > 0.001) vars['--wm-swap-hold'] = r4(o.hold) + 's'
    return { ctx: b, effect: e, label: b.name + (b.style !== ctx.style ? '@' + b.style : ''), vars: vars, trigger: o.trigger || null }
  }
  // the swap's trigger (ctx.swap.trigger) wins; without one, the motion trigger: loop alternates, hover previews
  function inkB(p, ctx) { var c = p.swap && p.swap.ctx.color; return c && c !== ctx.color ? c : null }
  function swapClasses(p) {
    var c = ['wm-swap', 'wm-fx-' + p.swap.effect], t = p.swap.trigger
    if (t === 'auto') c.push('wm-swap-auto')
    else if (t === 'focus') c.push('wm-swap-focus')
    else if (t === 'hover') c.push('wm-trigger')
    else if (t === 'click') return c   // the on prop (is-on): toggle it on click
    else if (p.trigger === 'loop') c.push('wm-loop')
    else if (p.trigger === 'hover') c.push('wm-trigger')
    return c
  }
  function motionComment(p, lead) {
    if (!p) return ''
    var L = lead || ' * '
    var s = L + 'Motion: ' + (p.swap ? 'turns into ' + p.swap.label + ' (' + p.swap.effect + ')' : (p.preset || 'default') + ', ' + p.trigger) + ' (@withicons/motion).\n'
    var st = p.swap && (p.swap.trigger || (p.trigger === 'loop' ? 'loop' : 'hover'))
    if (st === 'auto') s += L + 'Turns into it and back on its own (stops for visitors who prefer reduced motion).\n'
    else if (st === 'focus') s += L + 'Shows the second icon while focused (inside a .wm-trigger button or field), or while `on` is true.\n'
    else if (st === 'click') s += L + 'Shows the second icon while `on` is true (is-on): toggle it when the button is clicked.\n'
    else if (p.swap && st !== 'loop') s += L + 'Shows the second icon on hover, or while `on` is true (is-on / aria-pressed).\n'
    return s
  }

  // ---------- SVG model ----------
  // { attrs: root attributes for the <svg> (no xmlns/width/height/color), children: tree nodes (no <title>) }
  function model(ctx, opts, flatInk) {
    var v = V(), o = { size: 24, background: (opts && opts.background) || null, padding: opts && opts.padding }
    var svg
    if (flatInk) { // colours baked except the ink, which stays currentColor (driven by the `color` prop)
      var c = {}
      for (var k in ctx) c[k] = ctx[k]
      c.color = 'currentColor'
      svg = v.flatSvg(c, o)
    } else svg = v.svgWithBg(ctx, Object.assign({ flat: false }, o))
    var root = v.findTag(v.parseXml(svg), 'svg'), attrs = {}
    for (var a in root.attrs) if (a !== 'xmlns' && a !== 'width' && a !== 'height' && a !== 'color') attrs[a] = root.attrs[a]
    return { attrs: attrs, children: root.children.filter(function (n) { return n.tag !== 'title' }) }
  }

  // plain markup (HTML, Vue, Svelte, Angular templates)
  function markup(nodes, indent) {
    var v = V()
    return nodes.map(function (n) {
      if (n.text != null) return indent + v.escText(n.text)
      var s = indent + '<' + n.tag
      for (var k in n.attrs) s += ' ' + k + '="' + v.escAttr(n.attrs[k]) + '"'
      var kids = (n.children || []).filter(function (c) { return c.text == null || /\S/.test(c.text) })
      return kids.length ? s + '>\n' + markup(kids, indent + '  ') + '\n' + indent + '</' + n.tag + '>' : s + ' />'
    }).join('\n')
  }
  function attrList(attrs) { var v = V(), s = ''; for (var k in attrs) s += ' ' + k + '="' + v.escAttr(attrs[k]) + '"'; return s }

  // JSX
  var JSX_NAMES = { 'class': 'className', 'for': 'htmlFor', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink' }
  function jsxName(k) {
    if (JSX_NAMES[k]) return JSX_NAMES[k]
    if (/^(data|aria)-/.test(k)) return k
    return k.replace(/[-:]([a-z])/g, function (m, c) { return c.toUpperCase() })
  }
  function jsxStyle(s) {
    var parts = String(s).split(';').map(function (d) { var i = d.indexOf(':'); return i > 0 ? [d.slice(0, i).trim(), d.slice(i + 1).trim()] : null }).filter(Boolean)
    return '{{ ' + parts.map(function (p) { return (p[0].indexOf('--') === 0 ? q(p[0]) : jsxName(p[0])) + ': ' + q(p[1]) }).join(', ') + ' }}'
  }
  function jsxValue(v) { return /["\\{}<>]/.test(v) ? '{' + q(v) + '}' : '"' + v + '"' }
  function jsxAttrList(attrs) {
    var out = []
    for (var k in attrs) out.push(k === 'style' ? 'style=' + jsxStyle(attrs[k]) : jsxName(k) + '=' + jsxValue(attrs[k]))
    return out
  }
  function jsxAttrs(attrs) { return jsxAttrList(attrs).map(function (a) { return ' ' + a }).join('') }
  function jsx(nodes, indent, tagMap) {
    return nodes.map(function (n) {
      if (n.text != null) return /\S/.test(n.text) ? indent + '{' + q(n.text) + '}' : ''
      var tag = tagMap ? (tagMap[n.tag] || null) : n.tag
      if (!tag) return ''
      var s = indent + '<' + tag + jsxAttrs(n.attrs)
      var kids = jsx(n.children || [], indent + '  ', tagMap).split('\n').filter(Boolean).join('\n')
      return kids ? s + '>\n' + kids + '\n' + indent + '</' + tag + '>' : s + ' />'
    }).filter(Boolean).join('\n')
  }

  // ---------- React (JSX / TSX) ----------
  function react(ctx, opts, ts) {
    var p = motionPlan(ctx), md = model(ctx, opts), name = compName(ctx), color = ctx.color || 'currentColor'
    var L = []
    L.push('/**', ' * ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx))
    L.push(' * Colour: `color` sets the ink (currentColor); the --with-* CSS variables recolour the palette.')
    if (p) L.push(motionComment(p).replace(/\n$/, ''))
    L.push(' */')
    L.push("import * as React from 'react'")
    if (p) {
      L.push("import '@withicons/motion/motion.css'", "import '@withicons/motion/icons.css'")
      if (p.runtime) L.push("import { motion } from '@withicons/motion'")
    }
    L.push('')
    var svgOpen = function (extraAttrs, indent, withProps) {
      var s = indent + '<svg\n' + indent + '  xmlns="http://www.w3.org/2000/svg"\n' + indent + '  width={size}\n' + indent + '  height={size}'
      jsxAttrList(md.attrs).forEach(function (a) { s += '\n' + indent + '  ' + a })
      s += '\n' + indent + '  color={color}'
      ;(extraAttrs || []).forEach(function (a) { s += '\n' + indent + '  ' + a })
      if (withProps) s += '\n' + indent + "  role={title ? 'img' : undefined}\n" + indent + '  aria-hidden={title ? undefined : true}\n' + indent + '  {...props}'
      return s + '\n' + indent + '>'
    }
    var body = function (m, indent, withTitle) {
      return (withTitle ? indent + '{title ? <title>{title}</title> : null}\n' : '') + jsx(m.children, indent)
    }
    var propsType = ts ? ': ' + name + 'Props' : ''
    if (ts) {
      L.push('export interface ' + name + 'Props extends React.SVGProps<SVGSVGElement> {', '  /** width and height (px or any CSS length) */',
        '  size?: number | string', '  /** ink colour (currentColor) */', '  color?: string', '  /** accessible name; without it the icon is decorative */', '  title?: string')
      if (p && p.swap) L.push('  /** show the second icon */', '  on?: boolean')
      L.push('}', '')
    }
    var sig = '{ size = 24, color = ' + q(color) + ', title, className, style' + (p && p.swap ? ', on = false' : '') + ', ...props }' + propsType
    L.push('export function ' + name + '(' + sig + ') {')
    var cssVars = p ? p.vars : {}
    var styleExpr = function () {
      var keys = Object.keys(cssVars)
      if (!keys.length) return 'style={style}'
      var obj = '{ ' + keys.map(function (k) { return q(k) + ': ' + q(cssVars[k]) }).join(', ') + ', ...style }'
      return 'style={' + obj + (ts ? ' as React.CSSProperties' : '') + '}'
    }
    if (p && p.swap) {
      var b = model(p.swap.ctx, opts)
      var cls = swapClasses(p).join(' ')
      L.push('  return (', '    <span', "      className={'" + cls + "' + (on ? ' is-on' : '') + (className ? ' ' + className : '')}",
        '      ' + styleExpr(), "      role={title ? 'img' : undefined}", '      aria-label={title}', '      aria-hidden={title ? undefined : true}', '      {...(props' + (ts ? ' as React.HTMLAttributes<HTMLSpanElement>' : '') + ')}', '    >')
      L.push(svgOpen(['className="wm-a"'], '      ', false), body(md, '        ', false), '      </svg>')
      var saved = md; md = b
      var ib = inkB(p, ctx), openB = svgOpen(['className="wm-b"'], '      ', false)
      L.push(ib ? openB.replace('color={color}', 'color="' + ib + '"') : openB, body(b, '        ', false), '      </svg>')
      md = saved
      L.push('    </span>', '  )', '}')
    } else {
      var extra = []
      if (p && p.runtime) {
        L.push('  const ref = React.useRef' + (ts ? '<SVGSVGElement>' : '') + '(null)')
        L.push('  React.useEffect(() => {', '    if (!ref.current) return', '    const m = motion(ref.current, ' + q(ctx.name) + ', ' + JSON.stringify(p.opts) + ')', '    return () => m.destroy()', '  }, [])')
        extra.push('ref={ref}', 'className={className}', 'style={style}')
      } else if (p) {
        extra.push("className={'" + p.classes.join(' ') + "' + (className ? ' ' + className : '')}", 'data-wm=' + jsxValue(ctx.name), styleExpr())
      } else extra.push('className={className}', 'style={style}')
      L.push('  return (', svgOpen(extra, '    ', true), body(md, '      ', true), '    </svg>', '  )', '}')
    }
    L.push('', 'export default ' + name, '')
    return L.join('\n')
  }

  // ---------- Vue SFC ----------
  function vue(ctx, opts) {
    var p = motionPlan(ctx), md = model(ctx, opts), color = ctx.color || 'currentColor'
    var S = ['<script setup>', '// ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx)]
    if (p) S.push(motionComment(p, '// ').replace(/\n$/, ''), "import '@withicons/motion/motion.css'", "import '@withicons/motion/icons.css'")
    if (p && p.runtime) S.push("import { ref, onMounted, onBeforeUnmount } from 'vue'", "import { motion } from '@withicons/motion'")
    S.push('defineProps({', '  size: { type: [Number, String], default: 24 },', '  color: { type: String, default: ' + q(color) + ' },', '  title: { type: String, default: undefined },')
    if (p && p.swap) S.push('  on: { type: Boolean, default: false },')
    S.push('})')
    if (p && p.runtime) S.push('const el = ref(null)', 'let m = null', 'onMounted(() => { m = motion(el.value, ' + q(ctx.name) + ', ' + JSON.stringify(p.opts) + ') })', 'onBeforeUnmount(() => { if (m) m.destroy() })')
    S.push('</script>', '', '<template>')
    var svg = function (m, extra, indent, a11y) {
      return indent + '<svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size"' + attrList(m.attrs) + ' :color="color"' + (extra || '') +
        (a11y ? " :role=\"title ? 'img' : undefined\" :aria-hidden=\"title ? undefined : 'true'\"" : '') + '>\n' +
        (a11y ? indent + '  <title v-if="title">{{ title }}</title>\n' : '') + markup(m.children, indent + '  ') + '\n' + indent + '</svg>'
    }
    if (p && p.swap) {
      S.push('  <span class="' + swapClasses(p).join(' ') + '" :class="{ \'is-on\': on }"' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '') +
        " :role=\"title ? 'img' : undefined\" :aria-label=\"title\" :aria-hidden=\"title ? undefined : 'true'\">")
      S.push(svg(md, ' class="wm-a"', '    ', false), (function (x, ib) { return ib ? x.replace(' :color="color"', ' color="' + ib + '"') : x })(svg(model(p.swap.ctx, opts), ' class="wm-b"', '    ', false), inkB(p, ctx)), '  </span>')
    } else {
      var extra = ''
      if (p && p.runtime) extra = ' ref="el"'
      else if (p) extra = ' class="' + p.classes.join(' ') + '" data-wm="' + ctx.name + '"' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '')
      S.push(svg(md, extra, '  ', true))
    }
    S.push('</template>', '')
    return S.join('\n')
  }

  // ---------- Svelte (works in Svelte 4 and 5) ----------
  function svelte(ctx, opts) {
    var p = motionPlan(ctx), md = model(ctx, opts), color = ctx.color || 'currentColor'
    var S = ['<!-- ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx) + ' -->', '<script>']
    if (p) S.push(motionComment(p, '  // ').replace(/\n$/, ''), "  import '@withicons/motion/motion.css'", "  import '@withicons/motion/icons.css'")
    if (p && p.runtime) S.push("  import { onMount } from 'svelte'", "  import { motion } from '@withicons/motion'")
    S.push('  export let size = 24', '  export let color = ' + q(color), '  export let title = undefined')
    if (p && p.swap) S.push('  export let on = false')
    if (p && p.runtime) S.push('  let el', '  onMount(() => {', '    const m = motion(el, ' + q(ctx.name) + ', ' + JSON.stringify(p.opts) + ')', '    return () => m.destroy()', '  })')
    S.push('</script>', '')
    var svg = function (m, extra, indent, a11y) {
      return indent + '<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}' + attrList(m.attrs) + ' {color}' + (extra || '') +
        (a11y ? " role={title ? 'img' : undefined} aria-hidden={title ? undefined : 'true'} {...$$restProps}" : '') + '>\n' +
        (a11y ? indent + '  {#if title}<title>{title}</title>{/if}\n' : '') + markup(m.children, indent + '  ') + '\n' + indent + '</svg>'
    }
    if (p && p.swap) {
      S.push('<span class="' + swapClasses(p).join(' ') + '" class:is-on={on}' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '') +
        " role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'} {...$$restProps}>")
      S.push(svg(md, ' class="wm-a"', '  ', false), (function (x, ib) { return ib ? x.replace(' {color}', ' color="' + ib + '"') : x })(svg(model(p.swap.ctx, opts), ' class="wm-b"', '  ', false), inkB(p, ctx)), '</span>')
    } else {
      var extra = ''
      if (p && p.runtime) extra = ' bind:this={el}'
      else if (p) extra = ' class="' + p.classes.join(' ') + '" data-wm="' + ctx.name + '"' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '')
      S.push(svg(md, extra, '', true))
    }
    S.push('')
    return S.join('\n')
  }

  // ---------- Angular (standalone component, Angular 17+) ----------
  function angular(ctx, opts) {
    var p = motionPlan(ctx), md = model(ctx, opts), color = ctx.color || 'currentColor', name = compName(ctx) + 'Component'
    var tpl = function (m, extra, indent, a11y) {
      return indent + '<svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size" [attr.height]="size"' + attrList(m.attrs) + ' [attr.color]="color"' + (extra || '') +
        (a11y ? " [attr.role]=\"title ? 'img' : null\" [attr.aria-hidden]=\"title ? null : 'true'\"" : '') + '>\n' +
        (a11y ? indent + '  @if (title) { <title>{{ title }}</title> }\n' : '') + markup(m.children, indent + '  ') + '\n' + indent + '</svg>'
    }
    var t, cls = ''
    if (p && p.swap) {
      t = '<span class="' + swapClasses(p).join(' ') + '" [class.is-on]="on"' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '') +
        " [attr.role]=\"title ? 'img' : null\" [attr.aria-label]=\"title || null\" [attr.aria-hidden]=\"title ? null : 'true'\">\n" +
        tpl(md, ' class="wm-a"', '  ', false) + '\n' + (function (x, ib) { return ib ? x.replace(' [attr.color]="color"', ' color="' + ib + '"') : x })(tpl(model(p.swap.ctx, opts), ' class="wm-b"', '  ', false), inkB(p, ctx)) + '\n</span>'
    } else {
      if (p && p.runtime) cls = ' #svg'
      else if (p) cls = ' class="' + p.classes.join(' ') + '" data-wm="' + ctx.name + '"' + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '')
      t = tpl(md, cls, '', true)
    }
    var ng = ['Component', 'Input', 'ChangeDetectionStrategy'].concat(p && p.runtime ? ['ElementRef', 'ViewChild', 'AfterViewInit', 'OnDestroy'] : [])
    var L = ['/**', ' * ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx),
      ' * Usage: <' + 'with-' + kebab(ctx) + ' [size]="24" color="#1F2937" title="..."></' + 'with-' + kebab(ctx) + '>']
    if (p) L.push(motionComment(p).replace(/\n$/, ''), ' * Add the motion styles once, in angular.json "styles":', ' *   "node_modules/@withicons/motion/dist/motion.css", "node_modules/@withicons/motion/dist/icons.css"')
    L.push(' */', 'import { ' + ng.join(', ') + " } from '@angular/core'")
    if (p && p.runtime) L.push("import { motion } from '@withicons/motion'")
    L.push('', '@Component({', "  selector: 'with-" + kebab(ctx) + "',", '  standalone: true,', '  changeDetection: ChangeDetectionStrategy.OnPush,',
      "  host: { style: 'display: inline-flex; line-height: 0' },", '  template: `', t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), '`,', '})')
    L.push('export class ' + name + (p && p.runtime ? ' implements AfterViewInit, OnDestroy' : '') + ' {',
      '  @Input() size: number | string = 24', '  @Input() color = ' + q(color), '  @Input() title?: string')
    if (p && p.swap) L.push('  @Input() on = false')
    if (p && p.runtime) {
      L.push("  @ViewChild('svg', { static: true }) svg!: ElementRef<SVGSVGElement>", '  private m?: { destroy(): void }',
        '  ngAfterViewInit(): void { this.m = motion(this.svg.nativeElement, ' + q(ctx.name) + ', ' + JSON.stringify(p.opts) + ') }',
        '  ngOnDestroy(): void { this.m?.destroy() }')
    }
    L.push('}', '')
    return L.join('\n')
  }

  // ---------- React Native (react-native-svg) ----------
  var RN_TAGS = { path: 'Path', g: 'G', circle: 'Circle', rect: 'Rect', ellipse: 'Ellipse', line: 'Line', polyline: 'Polyline', polygon: 'Polygon' }
  // preset -> [transform, values over one cycle] (translate values are fractions of the icon size)
  var RN_KEYS = { spin: ['rotate', [0, 360]], 'spin-once': ['rotate', [0, 360]], tick: ['rotate', [0, 360]], pulse: ['scale', [1, 1.1, 1]], beat: ['scale', [1, 1.15, 1, 1.1, 1]],
    breathe: ['scale', [1, 1.06, 1]], float: ['translateY', [0, -0.06, 0]], bounce: ['translateY', [0, -0.15, 0, -0.04, 0]], sway: ['rotate', [0, 6, 0, -6, 0]],
    ring: ['rotate', [0, 16, -14, 10, -6, 2, 0]], wiggle: ['rotate', [0, 8, -8, 6, -6, 0]], shake: ['translateX', [0, -0.06, 0.06, -0.06, 0.06, 0]],
    nod: ['translateY', [0, 0.05, 0, 0.05, 0]], nudge: ['dir', [0, 0.1, 0]], pass: ['dir', [0, 0.12, 0]], rise: ['translateY', [0, -0.15, 0]], drop: ['translateY', [0, 0.15, 0]],
    blink: ['scaleY', [1, 1, 0.1, 1]], flicker: ['opacity', [1, 0.7, 1, 0.85, 1]], twinkle: ['scale', [1, 1.15, 1]], pop: ['scale', [1, 0.85, 1.12, 1]],
    tada: ['rotate', [0, -6, 6, -6, 6, 0]], jelly: ['scaleX', [1, 1.12, 0.94, 1.04, 1]], flip: ['rotateY', [0, 360]], rock: ['rotate', [0, 10, 0, -10, 0]],
    tilt: ['rotate', [0, 8, 8, 0]], zoom: ['scale', [1, 1.18, 1]], orbit: ['translateX', [0, 0.04, 0, -0.04, 0]], glow: ['opacity', [1, 0.7, 1]],
    draw: ['opacity', [0, 1]], type: ['translateY', [0, -0.02, 0, -0.02, 0]], fill: ['opacity', [0.35, 1]] }
  function reactNative(ctx, opts) {
    var p = motionPlan(ctx), md = model(ctx, opts, true), name = compName(ctx), color = ctx.color || '#000000'
    var used = {}
    ;(function walk(ns) { ns.forEach(function (n) { if (RN_TAGS[n.tag]) used[RN_TAGS[n.tag]] = 1; if (n.children) walk(n.children) }) })(md.children)
    var L = ['/**', ' * ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx),
      ' * React Native component for react-native-svg. react-native-svg does not support CSS var(), so the palette is',
      ' * baked in; `color` still sets the ink (currentColor).']
    if (p) L.push(' * Motion: ' + (p.preset || 'default') + ' (' + (p.trigger === 'loop' ? 'loops' : 'plays once on mount') + '), rebuilt with the Animated API (approximation of @withicons/motion).')
    L.push(' */', "import * as React from 'react'")
    if (p) L.push("import { Animated, Easing } from 'react-native'")
    L.push('import Svg, { ' + Object.keys(used).sort().join(', ') + " } from 'react-native-svg'", '')
    var svgEl = '<Svg width={size} height={size}' + jsxAttrs(md.attrs) + ' color={color} {...props}>\n' + jsx(md.children, '  ', RN_TAGS) + '\n</Svg>'
    L.push('export function ' + name + '({ size = 24, color = ' + q(color) + ', ...props }) {')
    if (!p) {
      L.push('  return (', '    ' + svgEl.replace(/\n/g, '\n    '), '  )', '}')
    } else {
      var k = RN_KEYS[p.preset] || RN_KEYS.pulse, prop = k[0], amt = p.amount
      var vals = k[1].map(function (v, i, arr) {
        if (prop === 'rotate' || prop === 'rotateY') return arr.length === 2 ? v : r4(v * amt)
        if (prop === 'opacity') return v
        if (/^scale/.test(prop)) return r4(1 + (v - 1) * amt)
        return r4(v * amt)
      })
      var input = vals.map(function (v, i) { return r4(i / (vals.length - 1)) })
      var ox = r4((p.origin[0] - 12) / 24), oy = r4((p.origin[1] - 12) / 24), rad = p.dir * Math.PI / 180
      L.push('  const t = React.useRef(new Animated.Value(0)).current',
        '  React.useEffect(() => {',
        '    const run = Animated.timing(t, { toValue: 1, duration: ' + Math.round(p.duration * 1000) + ', easing: Easing.' + (/^(spin|tick|orbit)$/.test(p.preset) ? 'linear' : 'inOut(Easing.ease)') + ', useNativeDriver: true })',
        '    const anim = ' + (p.trigger === 'loop' ? 'Animated.loop(run)' : 'run'), '    anim.start()', '    return () => anim.stop()', '  }, [t])',
        '  const v = t.interpolate({ inputRange: ' + JSON.stringify(input) + ', outputRange: ' + JSON.stringify(/^rotate/.test(prop) ? vals.map(function (x) { return x + 'deg' }) : vals) + ' })')
      var tf
      if (prop === 'opacity') tf = null
      else if (prop === 'dir') tf = '[{ translateX: Animated.multiply(v, ' + r4(Math.cos(rad)) + ' * Number(size)) }, { translateY: Animated.multiply(v, ' + r4(Math.sin(rad)) + ' * Number(size)) }]'
      else if (/^translate/.test(prop)) tf = '[{ ' + prop + ': Animated.multiply(v, Number(size)) }]'
      else tf = '[{ translateX: ' + ox + ' * Number(size) }, { translateY: ' + oy + ' * Number(size) }, { ' + prop + ': v }, { translateX: ' + (-ox) + ' * Number(size) }, { translateY: ' + (-oy) + ' * Number(size) }]'
      L.push('  return (', '    <Animated.View style={{ width: size, height: size' + (tf ? ', transform: ' + tf : ', opacity: v') + ' }}>',
        '      ' + svgEl.replace(/\n/g, '\n      '), '    </Animated.View>', '  )', '}')
    }
    L.push('', 'export default ' + name, '')
    return L.join('\n')
  }

  // ---------- HTML ----------
  function html(ctx, opts) {
    var p = motionPlan(ctx), v = V(), size = Math.max(1, Math.round((opts && opts.size) || 24))
    var svg = function (c, extra) {
      var s = v.svgWithBg(c, { flat: false, size: size, background: (opts && opts.background) || null, padding: opts && opts.padding })
      return s.replace(/^<svg/, '<svg' + (extra || ''))
    }
    var label = ctx.title || ctx.name
    var L = ['<!-- ' + label + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx) + ' -->']
    if (p) {
      L.push('<!-- Motion (@withicons/motion): add these two lines once, in <head> -->',
        '<link rel="stylesheet" href="' + CDN + 'motion.css">', '<link rel="stylesheet" href="' + CDN + 'icons.css">')
      if (p.runtime) L.push('<!-- ' + (p.preset === 'draw' ? '"draw"' : '"inview"') + ' also needs the runtime: -->',
        '<script type="module">import { motion } from \'https://cdn.jsdelivr.net/npm/@withicons/motion@latest/+esm\'; document.querySelectorAll(\'[data-wm-auto]\').forEach(el => motion(el, el.dataset.wm, ' + JSON.stringify(p.opts) + '))</script>')
    }
    if (p && p.swap) {
      var sv = Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : ''
      L.push('<span class="' + swapClasses(p).join(' ') + '"' + sv + ' role="img" aria-label="' + v.escAttr(label) + '">')
      var a = {}, b = p.swap.ctx
      for (var k in ctx) a[k] = ctx[k]
      a.title = null
      L.push('  ' + svg(a, ' class="wm-a" aria-hidden="true"'), '  ' + svg(b, ' class="wm-b" aria-hidden="true"'), '</span>')
    } else {
      var extra = ' role="img" aria-label="' + v.escAttr(label) + '"'
      if (p) extra = ' class="' + p.classes.join(' ') + '" data-wm="' + ctx.name + '"' + (p.runtime ? ' data-wm-auto=""' : '') + (Object.keys(p.vars).length ? ' style="' + styleVars(p.vars) + '"' : '') + extra
      L.push(svg(ctx, extra))
    }
    return L.join('\n') + '\n'
  }

  // ---------- data URIs / CSS ----------
  // Compact, safe URL encoding for SVG in CSS url("...") and src="..." (quotes become single quotes).
  function dataUri(svg) {
    return 'data:image/svg+xml,' + String(svg).replace(/"/g, "'").replace(/\s+/g, ' ').replace(/[\r\n%#()<>?[\\\]^`{|}"]/g, function (c) { return encodeURIComponent(c) })
      .replace(/[^\x20-\x7e]/g, function (c) { return encodeURIComponent(c) })
  }
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  function base64(bytes) {
    var s = '', i
    for (i = 0; i + 2 < bytes.length; i += 3) { var n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]; s += B64[n >> 18] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63] }
    var rest = bytes.length - i
    if (rest === 1) { var a = bytes[i] << 16; s += B64[a >> 18] + B64[(a >> 12) & 63] + '==' }
    else if (rest === 2) { var b = (bytes[i] << 16) | (bytes[i + 1] << 8); s += B64[b >> 18] + B64[(b >> 12) & 63] + B64[(b >> 6) & 63] + '=' }
    return s
  }
  function flat(ctx, opts, noBg) {
    var size = Math.max(1, Math.round((opts && opts.size) || 24))
    return V().flatSvg(ctx, { size: size, background: noBg ? null : (opts && opts.background) || null, padding: opts && opts.padding })
  }
  function css(ctx, opts) {
    var p = motionPlan(ctx), cls = 'with-' + ctx.name + '--' + ctx.style
    var full = dataUri(flat(ctx, opts)), mask = dataUri(flat(Object.assign({}, ctx, { color: '#000000' }), opts, true))
    var L = []
    if (p) L.push('@import url("' + CDN + 'motion.css");', '@import url("' + CDN + 'icons.css");', '')
    L.push('/* ' + (ctx.title || ctx.name) + ' (' + ctx.style + ' style) from with icons, ' + iconUrl(ctx),
      ' * <i class="' + cls + (p ? ' ' + p.classes.join(' ') + '" data-wm="' + ctx.name : '') + '"></i>       full colour, as drawn',
      ' * <i class="' + cls + '-mask' + (p ? ' ' + p.classes.join(' ') + '" data-wm="' + ctx.name : '') + '"></i>  one colour: takes the text colour (currentColor)',
      ' * Size with font-size (1em square) or width/height.' + (p && p.runtime ? ' "' + p.preset + '"/"' + p.trigger + '" needs the motion() runtime on inline SVG; here it falls back to CSS.' : ''),
      ' */',
      '.' + cls + ', .' + cls + '-mask {', '  display: inline-block;', '  width: 1em;', '  height: 1em;', '  flex: none;', '  vertical-align: -0.125em;' +
      (p && Object.keys(p.vars).length ? '\n  ' + Object.keys(p.vars).map(function (k) { return k + ': ' + p.vars[k] + ';' }).join('\n  ') : ''), '}',
      '.' + cls + ' {', '  background: url("' + full + '") center / contain no-repeat;', '}',
      '.' + cls + '-mask {', '  background-color: currentColor;', '  -webkit-mask: url("' + mask + '") center / contain no-repeat;', '  mask: url("' + mask + '") center / contain no-repeat;', '}', '')
    return L.join('\n')
  }

  // ---------- register ----------
  var TXT = 'text/plain'
  function fmt(id, label, ext, mime, note, build, opts) {
    WE.register({
      id: id, label: label, ext: ext, mime: mime, group: 'code', audience: (opts && opts.audience) || ['developers'],
      transparent: true, animated: !!(opts && opts.animated), note: note,
      available: function () { return true },
      run: function (ctx, o) {
        o = o || {}
        var r = build(ctx, o)
        return Promise.resolve({ data: r.data, filename: r.filename, mime: mime })
      }
    })
  }
  var file = function (ctx, base, ext) { return base + '.' + ext }
  fmt('jsx', 'React (JSX)', 'jsx', 'text/javascript', 'A ready-to-use React component file with size, color and title props. Motion included when you added one.',
    function (ctx, o) { return { data: react(ctx, o, false), filename: file(ctx, compName(ctx), 'jsx') } }, { animated: true })
  fmt('tsx', 'React (TSX)', 'tsx', 'text/typescript', 'The React component with TypeScript types, for typed React and Next.js projects.',
    function (ctx, o) { return { data: react(ctx, o, true), filename: file(ctx, compName(ctx), 'tsx') } }, { animated: true })
  fmt('vue', 'Vue', 'vue', 'text/plain', 'A Vue 3 single-file component (<script setup>) with size, color and title props.',
    function (ctx, o) { return { data: vue(ctx, o), filename: file(ctx, compName(ctx), 'vue') } }, { animated: true })
  fmt('svelte', 'Svelte', 'svelte', 'text/plain', 'A Svelte component (works in Svelte 4 and 5) with size, color and title props.',
    function (ctx, o) { return { data: svelte(ctx, o), filename: file(ctx, compName(ctx), 'svelte') } }, { animated: true })
  fmt('react-native', 'React Native', 'jsx', 'text/javascript', 'A react-native-svg component for iOS and Android apps. Colours are baked in (React Native has no CSS variables).',
    function (ctx, o) { return { data: reactNative(ctx, o), filename: file(ctx, compName(ctx) + '.native', 'jsx') } }, { animated: true, audience: ['developers', 'mobile'] })
  fmt('angular', 'Angular', 'ts', 'text/typescript', 'An Angular standalone component (Angular 17+) with size, color and title inputs.',
    function (ctx, o) { return { data: angular(ctx, o), filename: file(ctx, kebab(ctx) + '.component', 'ts') } }, { animated: true })
  fmt('html', 'HTML', 'html', 'text/html', 'An inline SVG snippet to paste into any web page; recolour it with CSS. Includes the motion classes when you added one.',
    function (ctx, o) { return { data: html(ctx, o), filename: WE.filename(ctx, null, 'html') } }, { animated: true, audience: ['developers', 'web'] })
  fmt('css', 'CSS', 'css', 'text/css', 'A CSS class that shows the icon as a background image, plus a -mask class that takes the text colour.',
    function (ctx, o) { return { data: css(ctx, o), filename: WE.filename(ctx, null, 'css') } }, { animated: true, audience: ['developers', 'web'] })
  fmt('data-uri', 'Data URI', 'txt', TXT, 'The icon as one line of text (data:image/svg+xml,...) for CSS url(), <img src> or email templates.',
    function (ctx, o) { return { data: dataUri(flat(ctx, o)) + '\n', filename: WE.filename(ctx, 'data-uri', 'txt') } }, { audience: ['developers', 'web'] })
  fmt('base64', 'Base64', 'txt', TXT, 'The icon as a base64 data URI (data:image/svg+xml;base64,...) for tools and APIs that only accept base64.',
    function (ctx, o) { return { data: 'data:image/svg+xml;base64,' + base64(WE.utf8(flat(ctx, o))) + '\n', filename: WE.filename(ctx, 'base64', 'txt') } }, { audience: ['developers', 'web'] })

  return { motionPlan: motionPlan, react: react, vue: vue, svelte: svelte, angular: angular, reactNative: reactNative, html: html, css: css, dataUri: dataUri, base64: base64 }
})
