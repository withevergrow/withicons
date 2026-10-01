// emit-solid — @withicons/solid. Plain ESM/CJS built on solid-js/web's Dynamic: no JSX in
// the package, so consumers need no compile step, and the same code renders in the browser,
// hydrates, and renders on the server (renderToString / SolidStart).
// Shares the dist layout, exports map, generic <Icon> and alias resolution with react/vue
// through emitComponentPackage (emit-core.mjs), so every framework package feels identical.
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount } from './emit-core.mjs'
import { frameworkReadme } from './emit-react.mjs'

const imports = ['createComponent', 'createMemo', 'mergeProps', 'splitProps']
const webImports = ['Dynamic', 'getNextElement', 'insert', 'isServer', 'template']

// free vars: STYLES, DEFAULT_STYLE (+ the imports above)
const baseSrc = `let withTitleTpl
// <title> must live in the SVG namespace and Dynamic only knows the SVG tag list, so the browser
// clones an SVG template. Both branches sit one component deep, keeping hydration keys aligned.
function WithClientTitle(props) {
  withTitleTpl || (withTitleTpl = template('<svg><title></title></svg>', false, true))
  const el = getNextElement(withTitleTpl)
  insert(el, () => props.children)
  return el
}
function WithTitle(props) {
  if (isServer) return createComponent(Dynamic, { component: 'title', get children() { return props.children } })
  return createComponent(WithClientTitle, props)
}
const WITH_OWN = ['size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'title', 'class', 'children']
function withSvgAttrs(name, s, o, rest) {
  const size = o.size == null || o.size === '' ? 24 : o.size
  const c = o.color || 'currentColor'
  const p = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
  for (const k in s.root) p[k] = s.root[k] === 'currentColor' ? c : s.root[k]
  if (c !== 'currentColor') p.color = c
  if (s.strokeWidth !== false) {
    const sw = o.strokeWidth
    const w = sw == null || sw === '' || isNaN(Number(sw)) ? s.strokeWidth : Number(sw)
    const px = /^\\s*\\d*\\.?\\d+(px)?\\s*$/.test(String(size)) ? parseFloat(size) : 0
    p['stroke-width'] = o.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
  }
  p.class = 'withi withi-' + name + (o.class ? ' ' + o.class : '')
  if (o.title || rest['aria-label'] || rest['aria-labelledby']) p.role = 'img'
  else p['aria-hidden'] = 'true'
  return p
}
function createWithIcon(name, style, displayName, iconNode) {
  const s = STYLES[style] || STYLES[DEFAULT_STYLE]
  const Component = function (props) {
    const [own, rest] = splitProps(props, WITH_OWN)
    const attrs = createMemo(() => withSvgAttrs(name, s, own, rest))
    return createComponent(Dynamic, mergeProps({ component: 'svg' }, attrs, rest, {
      get children() {
        const kids = []
        if (own.title) kids.push(createComponent(WithTitle, { get children() { return own.title } }))
        for (let i = 0; i < iconNode.length; i++) kids.push(createComponent(Dynamic, Object.assign({ component: iconNode[i][0] }, iconNode[i][1])))
        if (own.children !== undefined) kids.push(own.children)
        return kids
      },
    }))
  }
  try { Object.defineProperty(Component, 'name', { value: displayName }) } catch (e) {}
  return Component
}`

// free vars: withFindComponent, DEFAULT_STYLE. Reactive in name and variant.
const iconSrc = `const Icon = function (props) {
  const [own, rest] = splitProps(props, ['name', 'variant'])
  return createComponent(Dynamic, mergeProps(rest, { get component() { return withFindComponent(own.name, own.variant) } }))
}`

const typesDts = `
import type { Component, JSX } from 'solid-js'
export interface WithIconProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'color' | 'title'> {
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
  /** Appended to 'withi withi-<name>'. */
  class?: string
}
export type WithIcon = Component<WithIconProps>
export interface IconProps extends WithIconProps {
  /** Canonical name ('home') or an unambiguous alias ('house'). */
  name: IconName | IconAlias
  /** One of the styles. Default 'line'. */
  variant?: StyleName
}
/** Alias of WithIconProps */
export type IconComponentProps = WithIconProps
`

// Add the "solid" export condition (first) to every JS entry: vite-plugin-solid then bundles the
// package with the app for SSR, so app and icons always share one solid-js instance.
function withSolidCondition(exportsMap) {
  const out = {}
  for (const [k, v] of Object.entries(exportsMap)) {
    if (typeof v !== 'object') { out[k] = v; continue }
    const esm = v.import ? v.import.default : v.default
    out[k] = !esm ? v : v.types ? { types: v.types, solid: esm, ...v } : { solid: esm, ...v }
  }
  return out
}

export default async function emit(ctx) {
  const files = await emitComponentPackage(ctx, {
    dir: 'solid',
    importEsm: `import { ${imports.join(', ')} } from 'solid-js'\nimport { ${webImports.join(', ')} } from 'solid-js/web'`,
    importCjs: `const { ${imports.join(', ')} } = require('solid-js')\nconst { ${webImports.join(', ')} } = require('solid-js/web')`,
    mapAttrs: a => a,
    baseSrc, iconSrc, typesDts,
    typeNames: ['WithIcon', 'WithIconProps', 'IconProps', 'IconComponentProps'],
    iconTypeImport: () => `import type { Component } from 'solid-js'`,
    iconType: 'Component<IconProps>',
  })
  const { exports, typesVersions } = componentExports(ctx)
  const pkg = {
    ...basePkg(ctx, '@withicons/solid', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable SolidJS components (no JSX compile step, SSR + hydration).`, ['solid', 'solid-js', 'solidjs', 'solid-start', 'svg-icons']),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports: withSolidCondition(exports), typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { 'solid-js': '^1.6.0' },
  }
  writePkg(ctx, 'solid', pkg, frameworkReadme(ctx, {
    pkg: '@withicons/solid', framework: 'SolidJS', lang: 'tsx', classProp: 'class',
    example: `import { Home, Search } from '@withicons/solid'        // line (default style)
import { Home as HomeSolid } from '@withicons/solid/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} class="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}

// Plain ESM, no JSX inside the package: works in the browser, with hydration and with
// renderToString / SolidStart. ref, onClick, style and aria-* spread onto the <svg>.`,
    generic: `import { Icon } from '@withicons/solid'

<Icon name="home" variant="solid" size={20} />   // name and variant are reactive`,
  }))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}
