// emit-vue — @withicons/vue. One functional component per icon per style (Vue 3); see emitComponentPackage.
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount, rtlDoc } from './emit-core.mjs'
import { frameworkReadme } from './emit-react.mjs'

const clean = a => { const o = {}; for (const [k, v] of Object.entries(a)) if (v !== undefined && v !== null && v !== false) o[k] = v; return o }

const baseSrc = `const WITH_PROPS = {
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: [Number, String], default: undefined },
  absoluteStrokeWidth: { type: Boolean, default: false },
  title: { type: String, default: undefined },
}
function createWithIcon(name, style, displayName, iconNode) {
  const s = STYLES[style] || STYLES[DEFAULT_STYLE]
  const Component = (props, ctx) => {
    const attrs = ctx.attrs || {}
    const size = props.size == null || props.size === '' ? 24 : props.size
    const c = props.color || 'currentColor'
    const p = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
    for (const k in s.root) p[k] = s.root[k] === 'currentColor' ? c : s.root[k]
    if (c !== 'currentColor') p.color = c
    if (s.strokeWidth !== false) {
      const sw = props.strokeWidth
      const w = sw == null || sw === '' || isNaN(Number(sw)) ? s.strokeWidth : Number(sw)
      const px = /^\\s*\\d*\\.?\\d+(px)?\\s*$/.test(String(size)) ? parseFloat(size) : 0
      p['stroke-width'] = props.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
    }
    p.class = 'withi withi-' + name
    if (props.title || attrs['aria-label'] || attrs['aria-labelledby'] || attrs.ariaLabel) p.role = 'img'
    else p['aria-hidden'] = 'true'
    const kids = props.title ? [h('title', props.title)] : []
    for (const n of iconNode) kids.push(h(n[0], n[1]))
    if (ctx.slots && ctx.slots.default) kids.push(ctx.slots.default())
    return h('svg', p, kids)
  }
  Component.props = WITH_PROPS
  Component.displayName = displayName
  Component.iconNode = iconNode
  return Component
}`

const iconSrc = `const Icon = (props, ctx) => {
  const C = withFindComponent(props.name, props.variant)
  return C ? h(C, ctx.attrs, ctx.slots) : null
}
Icon.props = { name: { type: String, required: true }, variant: { type: String, default: DEFAULT_STYLE } }
Icon.inheritAttrs = false
Icon.displayName = 'Icon'`

const typesDts = `
import type { FunctionalComponent, SVGAttributes } from 'vue'
export interface WithIconProps extends Partial<SVGAttributes> {
  /** Width and height (number = px, or any CSS length). Default 24. */
  size?: number | string
  /** Icon color. Default 'currentColor' (inherits the CSS text color). */
  color?: string
  /** Stroke width in 24-grid units. Only affects styles with live strokes (line, duo). */
  strokeWidth?: number | string
  /** Keep the stroke width constant in px as size changes. */
  absoluteStrokeWidth?: boolean
  /** Accessible name: renders <title> and sets role="img". Without it the icon is aria-hidden. */
  title?: string
}
export type WithIcon = FunctionalComponent<WithIconProps> & {
  /** The icon's drawing as [tag, attrs][] (24x24 grid). Feed it to applyPalette() from @withicons/core/palettes/palette-map.js. */
  readonly iconNode: IconNode
}
export interface IconProps extends WithIconProps {
  /** Canonical name ('home') or an unambiguous alias ('house'). */
  name: IconName | IconAlias
  /** One of the styles. Default 'line'. */
  variant?: StyleName
}
`

export default async function emit(ctx) {
  const files = await emitComponentPackage(ctx, {
    dir: 'vue',
    importEsm: `import { h } from 'vue'`,
    importCjs: `const { h } = require('vue')`,
    mapAttrs: clean,
    baseSrc, iconSrc, typesDts,
    typeNames: ['WithIcon', 'WithIconProps', 'IconProps'],
    iconTypeImport: () => `import type { FunctionalComponent } from 'vue'`,
    iconType: 'FunctionalComponent<IconProps>',
  })
  const { exports, typesVersions } = componentExports(ctx)
  const pkg = {
    ...basePkg(ctx, '@withicons/vue', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable Vue 3 components.`, ['vue', 'vue3', 'vue-icons', 'nuxt', 'svg-icons', 'animated-icons', ...ctx.styles.map(s => `${s.name}-icons`)]),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports, typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { vue: '>=3.2.0' },
  }
  writePkg(ctx, 'vue', pkg, vueSections(ctx, frameworkReadme(ctx, {
    pkg: '@withicons/vue', framework: 'Vue 3', lang: 'vue', classProp: 'class',
    example: `<script setup>
import { Home, Search } from '@withicons/vue'          // line (default style)
import { Home as HomeSolid } from '@withicons/vue/solid'
</script>

<template>
  <Home />
  <Search :size="20" :stroke-width="1.5" class="text-slate-500" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>`,
    generic: `<script setup>
import { Icon } from '@withicons/vue'
</script>

<template>
  <Icon name="home" variant="solid" :size="20" />
</template>`,
  })))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}

// Vue-specific README sections, spliced into the shared framework README:
// palettes (before the generic "Animation" section) and animation + RTL (before "Generic icon").
function vueSections(ctx, md) {
  const pal = ctx.styles.some(s => s.name === 'retro' && s.palette) && ctx.icons.some(i => i.name === 'pizza')
  const palette = pal ? `
### Change every colour in Vue

The palette variables are inherited CSS custom properties, so a \`:style\` binding (or any CSS rule) re-themes one icon,
and \`color\` sets the outline:

\`\`\`vue
<script setup>
import { Pizza } from '@withicons/vue/retro'
</script>

<template>
  <Pizza :size="48" color="#3b1f12"
         :style="{ '--with-retro-1': '#f4b942', '--with-retro-2': '#d9412b', '--with-retro-3': '#2f8f4e' }" />
</template>
\`\`\`

Every icon also has 20-30 colour palettes picked for it in [\`@withicons/core\`](https://www.npmjs.com/package/@withicons/core)
(\`npm i @withicons/core\`). Every component carries its drawing as \`iconNode\`, and \`applyPalette\` maps a palette onto
the variables that icon uses, in any style:

\`\`\`vue
<script setup>
import { Pizza } from '@withicons/vue/retro'
import pizza from '@withicons/core/palettes/pizza.json'
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

const looks = pizza.palettes.map(p => ({ id: p.id, name: p.name, ...applyPalette(JSON.stringify(Pizza.iconNode), p.colors) }))
</script>

<template>
  <Pizza v-for="p in looks" :key="p.id" :size="40" :style="p.vars" :color="p.color ?? undefined" :title="p.name" />
</template>
\`\`\`
` : ''
  const motion = `
### Animation in Vue

Import the two stylesheets once (for example in \`main.js\`), then wrap the icon. \`motionAttrs\` builds the wrapper's
attributes for you, and works in SSR (Nuxt) because it only returns classes and a style string:

\`\`\`vue
<script setup>
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { motionAttrs } from '@withicons/motion'
import { Bell, Loader } from '@withicons/vue'
</script>

<template>
  <span class="wm wm-loop" data-wm="bell"><Bell /></span>
  <button class="wm-trigger"><span v-bind="motionAttrs('bell', { trigger: 'hover' })"><Bell /></span> Alerts</button>
  <span v-bind="motionAttrs(null, { preset: 'spin', duration: 1.2 })" class="wm-force"><Loader title="Loading" /></span>
</template>
\`\`\`

For the JS-only triggers (\`inview\`, a hover that always finishes) call \`motion(el, name, options)\` from \`@withicons/motion\`
in \`onMounted\` on a template ref, and \`destroy()\` the handle in \`onBeforeUnmount\`.
`
  const rtl = rtlDoc('vue', `<ChevronRight class="with-rtl" />

<!-- animated: mirror the icon, and point nudge / pass the other way on the wrapper -->
<span class="wm wm-hover" data-wm="arrow-right" :style="{ '--wm-dx': isRtl ? -1 : 1 }">
  <ArrowRight class="with-rtl" />
</span>`, '###')
  const put = (text, marker, add) => text.includes(marker) ? text.replace(marker, add.replace(/^\n/, '') + '\n' + marker) : text + add
  return put(put(md, '## Animation (optional)', palette), '## Generic icon', motion + rtl)
}

