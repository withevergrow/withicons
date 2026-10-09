// Vue 3 wrapper: <LiveIcon name="calendar-date" :day="17" month="MAR" variant="glass" :size="48" />
// Attributes that are params of the icon (camelCase or kebab-case) are params; the rest go on the <svg>.
// animate (true or ms): when params change, the icon moves to the new values (numbers roll, levels ease, clock hands take
// the short way, words and choices cross-fade) instead of jumping; instant with prefers-reduced-motion.
// Without a label the svg is named by what it shows ("Calendar date, March 17"); label="" makes it decorative.
import { defineComponent, h, ref, mergeProps, onBeforeUnmount } from 'vue'
import * as WithVue from 'vue'
import * as L from './core.js'

const camel = k => k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
let UID = 0

export const LiveIcon = defineComponent({
  name: 'LiveIcon',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    variant: { type: String, default: undefined },
    size: { type: [Number, String], default: 24 },
    color: { type: String, default: undefined },
    strokeWidth: { type: [Number, String], default: undefined },
    absoluteStrokeWidth: { type: Boolean, default: false },
    label: { type: String, default: undefined },
    vars: { type: Object, default: undefined },
    params: { type: Object, default: undefined },
    today: { type: Boolean, default: false },
    animate: { type: [Boolean, Number], default: false },
  },
  setup(props, { attrs }) {
    const tick = ref(0)
    const frame = ref(null)
    const svg = ref(null)
    let shown = null, ctl = null, pending = null
    // rich styles (gradients): this copy's own gradient ids (useId in Vue 3.5+, stable across SSR and hydration)
    const uid = WithVue.useId ? WithVue.useId() : 'w' + (++UID)
    if (typeof onBeforeUnmount === 'function') onBeforeUnmount(() => { if (ctl) ctl.cancel() })
    // a new target with animate on: start a transition from what is on screen (after this render)
    const start = (name, v, target, key) => {
      const prev = shown
      const from = ctl ? ctl.params : prev.params
      const c = ctl = L.transition(name, from, target, v, {
        ms: typeof props.animate === 'number' ? props.animate : undefined, owner: start,
        paint: (fp, info) => {
          frame.value = fp
          const el = svg.value
          if (info.swap && el && el.animate && !L.reducedMotion()) el.animate([{ opacity: 0.2, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' })
        },
        done: completed => { if (ctl !== c) return; ctl = null; if (completed) { shown = { key, name, variant: v, params: target }; frame.value = null; tick.value++ } },
      })
    }
    return () => {
      void tick.value
      const v = props.variant || L.defaultStyle
      const meta = L.get(props.name)
      const p = {}
      if (props.today && meta) { const n = L.now(); for (const k in n) if (k in meta.params) p[k] = n[k] }
      Object.assign(p, props.params)
      const rest = {}
      for (const k in attrs) {
        const c = camel(k)
        if (meta && c in meta.params) p[c] = attrs[k]
        else rest[k] = attrs[k]
      }
      if (!meta || !L.loaded(v)) {
        if (!meta) console.warn(`with icons live: unknown live icon "${props.name}". Did you mean: ${L.suggest(props.name).join(', ')}?`)
        else L.load(v).then(() => { tick.value++ }, e => console.warn(e.message))
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: props.size, height: props.size, viewBox: '0 0 24 24', 'aria-hidden': 'true', ...rest })
      }
      const target = L.resolve(props.name, p)
      const key = props.name + '\u0001' + v + '\u0001' + JSON.stringify(target)
      const on = !!props.animate
      let draw = p
      if (on && shown && shown.key !== key && shown.name === props.name && shown.variant === v) {
        const heading = ctl && JSON.stringify(ctl.plan.to) === JSON.stringify(target)
        if (!heading && pending !== key) { pending = key; Promise.resolve().then(() => { pending = null; start(props.name, v, target, key) }) }
        draw = frame.value || (ctl ? ctl.params : shown.params)
      } else {
        if (ctl) { ctl.cancel(); ctl = null }
        shown = { key, name: props.name, variant: v, params: target }
        if (frame.value) frame.value = null
      }
      const o = { size: props.size, color: props.color, strokeWidth: props.strokeWidth, absoluteStrokeWidth: props.absoluteStrokeWidth, label: props.label, vars: props.vars, idSuffix: uid }
      if (props.label == null && rest['aria-hidden'] !== true && rest['aria-hidden'] !== 'true' && !rest['aria-label'] && !rest['aria-labelledby']) o.label = L.describe(props.name, draw)
      else if (props.label === '') o.label = null
      const { attrs: a, inner } = L.parts(props.name, draw, v, o)
      return h('svg', mergeProps(a, rest, { innerHTML: inner, ref: svg }))
    }
  },
})
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate, describe, transition, interpolate, setMotion } from './core.js'
