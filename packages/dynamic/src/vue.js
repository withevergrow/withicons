// Vue 3 wrapper: <LiveIcon name="calendar-date" :day="17" month="MAR" variant="glass" :size="48" />
// Attributes that are params of the icon (camelCase or kebab-case) are params; the rest go on the <svg>.
import { defineComponent, h, ref, mergeProps } from 'vue'
import * as L from './core.js'

const camel = k => k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

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
  },
  setup(props, { attrs }) {
    const tick = ref(0)
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
      const { attrs: a, inner } = L.parts(props.name, p, v, {
        size: props.size, color: props.color, strokeWidth: props.strokeWidth, absoluteStrokeWidth: props.absoluteStrokeWidth,
        label: props.label, vars: props.vars,
      })
      return h('svg', mergeProps(a, rest, { innerHTML: inner }))
    }
  },
})
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate } from './core.js'
