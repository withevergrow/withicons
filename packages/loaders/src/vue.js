// Vue 3: <Loader name="spinner" variant="glass" :size="32" :speed="1.2" />  ·  <Morph :items="['file','cloud-upload','check-circle']" />
// Morph items are library icon names; 'loader:<name>' (or { loader: '<name>' }) puts a loader in the chain.
import { defineComponent, h, ref, watchEffect } from 'vue'
import * as L from './core.js'

let UID = 0
const common = { variant: { type: String, default: 'line' }, size: { type: [Number, String], default: 24 }, color: String, speed: [Number, String], paused: Boolean, label: { type: String, default: undefined }, vars: Object }
const box = (p, html) => h('span', {
  role: p.label === '' ? undefined : 'progressbar', 'aria-label': p.label === '' ? undefined : (p.label == null ? 'Loading' : p.label),
  'aria-busy': p.label === '' ? undefined : 'true', 'aria-hidden': p.label === '' ? 'true' : undefined,
  style: { display: 'inline-flex', lineHeight: 0, width: typeof p.size === 'number' ? p.size + 'px' : p.size, height: typeof p.size === 'number' ? p.size + 'px' : p.size },
  innerHTML: html,
})
export const Loader = defineComponent({
  name: 'WithLoader',
  props: { name: { type: String, default: 'spinner' }, ...common },
  setup(p) {
    const uid = 'v' + (++UID), html = ref('')
    watchEffect(() => {
      const o = { style: p.variant, size: p.size, color: p.color, speed: p.speed, paused: p.paused, vars: p.vars, label: '', idSuffix: uid }
      if (L.loaded(p.variant)) html.value = L.svg(p.name, o)
      else L.svgAsync(p.name, o).then(s => { html.value = s }, e => console.warn(e.message))
    })
    return () => box(p, html.value)
  },
})
export const Morph = defineComponent({
  name: 'WithMorph',
  props: { items: { type: [Array, String], required: true }, effect: { type: String, default: 'bloom' }, hold: [Number, String], ...common },
  setup(p) {
    const uid = 'v' + (++UID), html = ref('')
    watchEffect(() => {
      L.morphAsync(p.items, { style: p.variant, effect: p.effect, hold: p.hold, size: p.size, color: p.color, speed: p.speed, paused: p.paused, vars: p.vars, label: '', id: 'wl-m' + uid })
        .then(s => { html.value = s }, e => console.warn(e.message))
    })
    return () => box(p, html.value)
  },
})
export default Loader
