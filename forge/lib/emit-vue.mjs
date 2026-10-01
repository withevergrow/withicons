// emit-vue — @withicons/vue. One functional component per icon per style (Vue 3); see emitComponentPackage.
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount } from './emit-core.mjs'
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
export type WithIcon = FunctionalComponent<WithIconProps>
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
    ...basePkg(ctx, '@withicons/vue', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable Vue 3 components.`, ['vue', 'vue3', 'svg-icons']),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports, typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { vue: '>=3.2.0' },
  }
  writePkg(ctx, 'vue', pkg, frameworkReadme(ctx, {
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
  }))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}
