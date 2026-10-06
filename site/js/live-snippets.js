/* with icons — Live icons code snippets (classic script, works from file:// and in Node via vm). window.WithLiveSnippets.
   One generator for every code block about live icons: forge/tools/site-dynamic.mjs runs it at build time (the default
   code each page ships, readable without JS) and js/live-motion.js + js/live.js run it in the page so the code follows
   what the visitor set (values, style, colours, size, today, animate). Only real @withicons/dynamic APIs:
   <with-live-icon> redraws on setAttribute (and moves there with `animate`); React/Vue <LiveIcon> take params as props. */
(function (root) {
  'use strict'
  var RESERVED = ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'aria-hidden', 'params', 'today', 'vars', 'animate']
  var REACT_RESERVED = ['name', 'variant', 'size', 'color', 'vars', 'label', 'params', 'today', 'animate', 'className', 'style', 'strokeWidth', 'absoluteStrokeWidth', 'key', 'ref', 'children']
  var TODAY_KEYS = ['day', 'month', 'weekday', 'time']
  // the params a demo feeds (js/live-motion.js uses the same list)
  var FEED_KEYS = { 'thermometer-level': ['value'], weather: ['condition', 'temperature'], 'calendar-range': ['from', 'to'], 'bar-values': ['bar1', 'bar2', 'bar3'], 'rating-stars': ['rating'] }
  var SRC = [
    { id: 'timer', t: 'Timer', say: 'every second', ic: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M9.5 3h5"/>' },
    { id: 'fetch', t: 'API', say: 'fetch() polling', ic: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>' },
    { id: 'socket', t: 'WebSocket', say: 'server pushes', ic: '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z"/>' },
    { id: 'input', t: 'User input', say: 'slider or field', ic: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>' }
  ]
  var FW = [{ id: 'html', t: 'HTML' }, { id: 'react', t: 'React' }, { id: 'vue', t: 'Vue' }]

  function kebab(s) { return String(s).replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase() }) }
  function attrOf(k) { return RESERVED.indexOf(kebab(k)) >= 0 ? 'param-' + kebab(k) : kebab(k) }
  function camelId(s) { return String(s).replace(/-([a-z])/g, function (_, c) { return c.toUpperCase() }) }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function jsLit(v) { return typeof v === 'string' ? "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'" : String(v) }
  function json(o) { return JSON.stringify(o).replace(/,"/g, ', "').replace(/":/g, '": ') }
  function feedKeys(i) {
    var ks = FEED_KEYS[i.name] || [Object.keys(i.params).filter(function (k) { return i.params[k].type !== 'bool' })[0]]
    return ks.filter(function (k) { return k && i.params[k] })
  }
  function def(i, k) { return i.defaults && i.defaults[k] != null ? i.defaults[k] : i.params[k].default }
  function val(i, st, k) { var p = st && st.params; return p && p[k] != null ? p[k] : def(i, k) }
  function apiSlug(i) { return i.name.replace(/-(count|level|time|value|text|label|number|date|percent|initials|strength|bars|speed|index|stars|ring|values)$/, '') || i.name }
  function hasToday(i) { return TODAY_KEYS.some(function (k) { return i.params[k] }) }
  function todayOn(i, st) { return !!(st && st.today && hasToday(i)) }
  // the next value an API would send (first example that differs), for the "it answers {...}" comments
  function nextVals(i, st) {
    var ks = feedKeys(i), ex = (i.examples || []).filter(function (e) { return ks.some(function (k) { return e[k] != null && String(e[k]) !== String(val(i, st, k)) }) })[0] || {}
    var o = {}; ks.forEach(function (k) { o[k] = ex[k] != null ? ex[k] : val(i, st, k) }); return o
  }
  function optionsOf(i, k) {
    var p = i.params[k]
    if (p.type === 'enum') return p.options.slice()
    var out = [def(i, k)]
    ;(i.examples || []).forEach(function (e) { var v = e[k]; if (typeof v === 'string' && v && out.indexOf(v) < 0) out.push(v) })
    return out.length > 1 ? out : [def(i, k), 'NEW']
  }
  function cdnOf(st) { return (st && st.cdn) || 'https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js' }
  function scopeOf(st) { return (st && st.scope) || '@withicons' }
  // look attributes shared by every snippet: variant, size, color, vars
  function lookAttrs(st) {
    var a = ''
    if (st && st.style && st.style !== 'line') a += ' variant="' + st.style + '"'
    a += ' size="' + ((st && st.size) || 48) + '"'
    if (st && st.color) a += ' color="' + esc(st.color) + '"'
    if (st && st.vars && Object.keys(st.vars).length) a += " vars='" + JSON.stringify(st.vars) + "'"
    return a
  }
  function lookProps(st, vue) {
    var p = []
    if (st && st.style && st.style !== 'line') p.push('variant="' + st.style + '"')
    p.push(vue ? ':size="' + ((st && st.size) || 48) + '"' : 'size={' + ((st && st.size) || 48) + '}')
    if (st && st.color) p.push('color="' + st.color + '"')
    if (st && st.vars && Object.keys(st.vars).length) p.push(vue ? ":vars='" + JSON.stringify(st.vars) + "'" : 'vars={' + JSON.stringify(st.vars) + '}')
    return p
  }
  function attrPair(i, k, v) { var p = i.params[k]; return p.type === 'bool' ? (v === true || v === 'true' ? ' ' + attrOf(k) : ' ' + attrOf(k) + '="false"') : ' ' + attrOf(k) + '="' + esc(v) + '"' }

  /* ───────── the element with the visitor's settings (studio "Your element") ───────── */
  function element(i, st, fw) {
    st = st || {}
    var today = todayOn(i, st), keys = Object.keys(i.params).filter(function (k) { return !(today && TODAY_KEYS.indexOf(k) >= 0) })
    var n = i.name
    if (fw === 'html') {
      return '<script src="' + cdnOf(st) + '"></script>\n\n<with-live-icon name="' + n + '"' + keys.map(function (k) { return attrPair(i, k, val(i, st, k)) }).join('') + (today ? ' today' : '') + lookAttrs(st) + '></with-live-icon>'
    }
    var vue = fw === 'vue', props = [], nested = []
    keys.forEach(function (k) {
      var v = val(i, st, k)
      if (REACT_RESERVED.indexOf(k) >= 0) { nested.push(k + ': ' + jsLit(v)); return }
      if (vue) props.push(typeof v === 'string' ? kebab(k) + '="' + esc(v) + '"' : ':' + kebab(k) + '="' + v + '"')
      else props.push(typeof v === 'string' ? k + '="' + esc(v) + '"' : v === true ? k : k + '={' + v + '}')
    })
    if (nested.length) props.push(vue ? ':params="{ ' + nested.join(', ') + ' }"' : 'params={{ ' + nested.join(', ') + ' }}')
    if (today) props.push('today')
    props = props.concat(lookProps(st, vue))
    if (vue) return '<script setup>\nimport { LiveIcon } from \'' + scopeOf(st) + '/dynamic/vue\'\n</script>\n\n<template>\n  <LiveIcon name="' + n + '" ' + props.join(' ') + ' />\n</template>'
    return 'import { LiveIcon } from \'' + scopeOf(st) + '/dynamic/react\'\n\nexport function Example() {\n  return <LiveIcon name="' + n + '" ' + props.join(' ') + ' />\n}'
  }

  /* ───────── "Change it live": values after load, from a timer / an API / a WebSocket / user input ───────── */
  function inputSpec(i, k, st) {
    var p = i.params[k], v = val(i, st, k)
    if (p.type === 'level') return { attrs: 'type="range" min="0" max="100" value="' + Math.round(v * 100) + '"', read: 'input.value / 100', jsx: 'e => set(+e.target.value / 100)', scale: 100 }
    if (p.type === 'int' || p.type === 'number') return (p.max - p.min) <= 200
      ? { attrs: 'type="range" min="' + p.min + '" max="' + p.max + '"' + (p.step ? ' step="' + p.step + '"' : '') + ' value="' + v + '"', read: '+input.value', jsx: 'e => set(+e.target.value)', num: true }
      : { attrs: 'type="number" min="' + p.min + '" max="' + p.max + '" value="' + v + '"', read: '+input.value', jsx: 'e => set(+e.target.value)', num: true }
    if (p.type === 'time') return { attrs: 'type="time" value="' + v + '"', read: 'input.value', jsx: 'e => set(e.target.value)' }
    if (p.type === 'text') return { attrs: 'maxlength="' + (p.maxLength || 4) + '" value="' + esc(v) + '"', read: 'input.value.toUpperCase()', jsx: 'e => set(e.target.value.toUpperCase())' }
    return { select: optionsOf(i, k), read: 'input.value', jsx: 'e => set(e.target.value)' }
  }
  function timerExpr(i, k, x) {
    var p = i.params[k]
    if (p.type === 'level') return x + ' >= 1 ? 0 : Math.min(1, Math.round((' + x + ' + 0.1) * 100) / 100)'
    if (p.type === 'int' || p.type === 'number') return x + ' >= ' + p.max + ' ? ' + p.min + ' : ' + x + ' + ' + (p.step || 1)
    return null
  }
  function update(i, src, fw, st) {
    st = st || {}
    var n = i.name, ks = feedKeys(i), k0 = ks[0], p0 = i.params[k0], id = apiSlug(i), api = '/api/' + id
    var nv = nextVals(i, st), many = ks.length > 1, animate = st.animate !== false
    var today = todayOn(i, st) && src === 'timer' && TODAY_KEYS.indexOf(k0) >= 0
    var start = {}; ks.forEach(function (k) { start[k] = val(i, st, k) })
    // the element: the fed values, the other params the visitor changed, the look, animate
    var others = Object.keys(i.params).filter(function (k) { return ks.indexOf(k) < 0 && !(today && TODAY_KEYS.indexOf(k) >= 0) && String(val(i, st, k)) !== String(def(i, k)) })
    var attrList = (today ? '' : ks.map(function (k) { return attrPair(i, k, start[k]) }).join('')) + others.map(function (k) { return attrPair(i, k, val(i, st, k)) }).join('') + (today ? ' today' : '')
    var opts = (p0.type === 'enum' || p0.type === 'text') ? optionsOf(i, k0) : null
    var sp = inputSpec(i, k0, st)
    function setterOf(k) { return 'set' + cap(camelId(k)) }
    if (fw === 'html') {
      var head = '<script src="' + cdnOf(st) + '"></script>\n\n<with-live-icon id="' + id + '" name="' + n + '"' + attrList + lookAttrs(st) + (animate ? ' animate' : '') + '></with-live-icon>\n'
      var sets = function (from, ind) { return ks.map(function (k) { return ind + 'icon.setAttribute(\'' + attrOf(k) + '\', ' + from + '.' + k + ')' }).join('\n') }
      var body
      if (today) return head + '\n<!-- today reads the visitor\'s clock and redraws every minute: no code needed -->'
      if (src === 'fetch') body = '  // ask your API now and every 5 seconds. It answers ' + json(nv) + '\n  async function update() {\n    try {\n      const data = await fetch(\'' + api + '\').then(r => r.json())\n' + sets('data', '      ') + '\n    } catch (e) { /* offline: keep the last value */ }\n  }\n  update()\n  setInterval(update, 5000)'
      else if (src === 'socket') body = '  // your server pushes ' + json(nv) + ' whenever it changes\n  const socket = new WebSocket(\'wss://example.com/live/' + id + '\')\n  socket.onmessage = e => {\n    const data = JSON.parse(e.data)\n' + sets('data', '    ') + '\n  }\n  // Server-Sent Events work the same way: new EventSource(\'' + api + '/stream\').onmessage = …'
      else if (src === 'timer') {
        if (p0.type === 'time') body = '  // every second: the visitor\'s own clock (or just add the today attribute)\n  setInterval(() => {\n    icon.setAttribute(\'' + attrOf(k0) + '\', new Date().toTimeString().slice(0, 5))\n  }, 1000)'
        else if (opts) body = '  const options = [' + opts.map(jsLit).join(', ') + ']\n  let i = options.indexOf(icon.getAttribute(\'' + attrOf(k0) + '\'))\n  setInterval(() => {\n    i = (i + 1) % options.length\n    icon.setAttribute(\'' + attrOf(k0) + '\', options[i])\n  }, 2000)'
        else body = '  let ' + camelId(k0) + ' = ' + start[k0] + '\n  setInterval(() => {\n    ' + camelId(k0) + ' = ' + timerExpr(i, k0, camelId(k0)) + '\n    icon.setAttribute(\'' + attrOf(k0) + '\', ' + camelId(k0) + ')\n  }, 1000)'
      } else {
        var ctl = sp.select ? '<select id="' + id + '-input">' + sp.select.map(function (o) { return '<option' + (o === start[k0] ? ' selected' : '') + '>' + esc(o) + '</option>' }).join('') + '</select>' : '<input id="' + id + '-input" ' + sp.attrs + '>'
        return head + ctl + '\n\n<script>\n  const icon = document.getElementById(\'' + id + '\')\n  const input = document.getElementById(\'' + id + '-input\')\n  input.addEventListener(\'input\', () => {\n    icon.setAttribute(\'' + attrOf(k0) + '\', ' + sp.read + ')\n  })\n</script>'
      }
      return head + '\n<script>\n  const icon = document.getElementById(\'' + id + '\')\n' + body + '\n</script>'
    }
    // React and Vue: one state per value (several values: one object passed as params)
    var vue = fw === 'vue'
    var one = !many && REACT_RESERVED.indexOf(k0) < 0
    var v0 = camelId(k0)
    var otherProps = []
    others.forEach(function (k) {
      var v = val(i, st, k)
      if (REACT_RESERVED.indexOf(k) >= 0) return
      if (vue) otherProps.push(typeof v === 'string' ? kebab(k) + '="' + esc(v) + '"' : ':' + kebab(k) + '="' + v + '"')
      else otherProps.push(typeof v === 'string' ? k + '="' + esc(v) + '"' : v === true ? k : k + '={' + v + '}')
    })
    var look = lookProps(st, vue).concat(animate ? ['animate'] : []), extra = otherProps.concat(look).join(' ')
    if (today) {
      var tprops = otherProps.concat(['today'], look).join(' ')
      return vue ? '<script setup>\nimport { LiveIcon } from \'' + scopeOf(st) + '/dynamic/vue\'\n</script>\n\n<template>\n  <!-- today reads the visitor\'s clock and redraws every minute -->\n  <LiveIcon name="' + n + '" ' + tprops + ' />\n</template>'
        : 'import { LiveIcon } from \'' + scopeOf(st) + '/dynamic/react\'\n\n// today reads the visitor\'s clock and redraws every minute\nexport function ' + cap(camelId(id)) + '() {\n  return <LiveIcon name="' + n + '" ' + tprops + ' />\n}'
    }
    var jsxIcon = '<LiveIcon name="' + n + '" ' + (one ? k0 + '={' + v0 + '}' : 'params={values}') + ' ' + extra + ' />'
    var vueIcon = '<LiveIcon name="' + n + '" ' + (one ? ':' + kebab(k0) + '="' + v0 + '"' : ':params="values"') + ' ' + extra + ' />'
    var optsLine = opts && src === 'timer' && p0.type !== 'time' ? 'const options = [' + opts.map(jsLit).join(', ') + ']\n\n' : ''
    if (!vue) {
      var state = one ? 'const [' + v0 + ', ' + setterOf(k0) + '] = useState(' + jsLit(start[k0]) + ')' : 'const [values, setValues] = useState(' + json(start) + ')'
      var put = function (from) { return one ? setterOf(k0) + '(' + from + '.' + k0 + ')' : 'setValues(' + from + ')' }
      var comp = cap(camelId(id)), eff
      if (src === 'fetch') eff = '  useEffect(() => {\n    // now and every 5 seconds. Your API answers ' + json(nv) + '\n    const update = () => fetch(\'' + api + '\').then(r => r.json()).then(data => ' + put('data') + ').catch(() => {})\n    update()\n    const id = setInterval(update, 5000)\n    return () => clearInterval(id)\n  }, [])'
      else if (src === 'socket') eff = '  useEffect(() => {\n    const socket = new WebSocket(\'wss://example.com/live/' + id + '\')   // or new EventSource(\'' + api + '/stream\')\n    socket.onmessage = e => ' + put('JSON.parse(e.data)') + '\n    return () => socket.close()\n  }, [])'
      else if (src === 'timer') {
        var upd = one ? setterOf(k0) : 'setValues'
        var nx = p0.type === 'time' ? '() => new Date().toTimeString().slice(0, 5)' : opts ? 'x => options[(options.indexOf(x) + 1) % options.length]' : 'x => ' + timerExpr(i, k0, 'x')
        var call = one ? (p0.type === 'time' ? upd + '(new Date().toTimeString().slice(0, 5))' : upd + '(' + nx + ')') : upd + '(v => ({ ...v, ' + k0 + ': (' + nx + ')(v.' + k0 + ') }))'
        eff = '  useEffect(() => {\n    const id = setInterval(() => ' + call + ', ' + (opts ? 2000 : 1000) + ')\n    return () => clearInterval(id)\n  }, [])'
      } else {
        var cur = one ? v0 : 'values.' + k0
        var vv = sp.scale ? '{Math.round(' + cur + ' * 100)}' : '{' + cur + '}'
        var jsx = one ? sp.jsx.replace('set(', setterOf(k0) + '(') : sp.jsx
        var setLine = one ? '' : '\n  const set = v => setValues({ ...values, ' + k0 + ': v })'
        var c = sp.select ? '<select value={' + cur + '} onChange={' + jsx + '}>\n        {' + json(sp.select) + '.map(o => <option key={o}>{o}</option>)}\n      </select>'
          : '<input ' + sp.attrs.replace(/ value="[^"]*"/, '').replace('maxlength=', 'maxLength=') + ' value=' + vv + '\n        onChange={' + jsx + '} />'
        return 'import { useState } from \'react\'\nimport { LiveIcon } from \'' + scopeOf(st) + '/dynamic/react\'\n\nexport function ' + comp + '() {\n  ' + state + setLine + '\n  return (\n    <>\n      ' + jsxIcon + '\n      ' + c + '\n    </>\n  )\n}'
      }
      return 'import { useEffect, useState } from \'react\'\nimport { LiveIcon } from \'' + scopeOf(st) + '/dynamic/react\'\n\n' + optsLine + 'export function ' + comp + '() {\n  ' + state + '\n' + eff + '\n  return ' + jsxIcon + '\n}'
    }
    var vstate = one ? 'const ' + v0 + ' = ref(' + jsLit(start[k0]) + ')' : 'const values = ref(' + json(start) + ')'
    var vput = function (from) { return one ? v0 + '.value = ' + from + '.' + k0 : 'values.value = ' + from }
    var setup = '', more = ''
    if (src === 'fetch') setup = '// now and every 5 seconds. Your API answers ' + json(nv) + '\nconst update = () => fetch(\'' + api + '\').then(r => r.json()).then(data => { ' + vput('data') + ' }).catch(() => {})\nlet id\nonMounted(() => { update(); id = setInterval(update, 5000) })\nonUnmounted(() => clearInterval(id))'
    else if (src === 'socket') setup = 'let socket\nonMounted(() => {\n  socket = new WebSocket(\'wss://example.com/live/' + id + '\')   // or new EventSource(\'' + api + '/stream\')\n  socket.onmessage = e => { ' + vput('JSON.parse(e.data)') + ' }\n})\nonUnmounted(() => socket.close())'
    else if (src === 'timer') {
      var ref0 = one ? v0 + '.value' : 'values.value.' + k0
      var vnx = p0.type === 'time' ? 'new Date().toTimeString().slice(0, 5)' : opts ? 'options[(options.indexOf(' + ref0 + ') + 1) % options.length]' : timerExpr(i, k0, ref0)
      setup = 'let id\nonMounted(() => {\n  id = setInterval(() => { ' + ref0 + ' = ' + vnx + ' }, ' + (opts ? 2000 : 1000) + ')\n})\nonUnmounted(() => clearInterval(id))'
    } else {
      var model = one ? v0 : 'values.' + k0
      if (sp.scale) more = '\n  <input ' + sp.attrs.replace(/ value="[^"]*"/, '') + ' :value="Math.round(' + model + ' * 100)" @input="' + model + ' = $event.target.value / 100" />'
      else if (sp.select) more = '\n  <select v-model="' + model + '">\n    <option v-for="o in ' + json(sp.select).replace(/"/g, "'") + '" :key="o">{{ o }}</option>\n  </select>'
      else more = '\n  <input ' + sp.attrs.replace(/ value="[^"]*"/, '') + ' v-model' + (sp.num ? '.number' : '') + '="' + model + '" />'
    }
    var imp = src === 'input' ? 'import { ref } from \'vue\'' : 'import { ref, onMounted, onUnmounted } from \'vue\''
    return '<script setup>\n' + imp + '\nimport { LiveIcon } from \'' + scopeOf(st) + '/dynamic/vue\'\n\n' + optsLine + vstate + '\n' + (setup ? setup + '\n' : '') + '</script>\n\n<template>\n  ' + vueIcon + more + '\n</template>'
  }
  // the lines in a snippet that change the icon (highlighted when the demo sends a value)
  var HIT = /setAttribute\(|\bset[A-Z]\w*\(|\.value = |values\.value|socket\.onmessage|update\(\)$/
  root.WithLiveSnippets = { SRC: SRC, FW: FW, feedKeys: feedKeys, element: element, update: update, attrOf: attrOf, apiSlug: apiSlug, hasToday: hasToday, HIT: HIT }
})(typeof window !== 'undefined' ? window : globalThis)
