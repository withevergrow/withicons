// emit-solid — @withicons/solid. Plain ESM/CJS built on solid-js/web's Dynamic: no JSX in
// the package, so consumers need no compile step, and the same code renders in the browser,
// hydrates, and renders on the server (renderToString / SolidStart).
// Shares the dist layout, exports map, generic <Icon> and alias resolution with react/vue
// through emitComponentPackage (emit-core.mjs), so every framework package feels identical.
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount, rtlDoc } from './emit-core.mjs'
import { frameworkReadme } from './emit-react.mjs'

const imports = ['createComponent', 'createMemo', 'lazy', 'mergeProps', 'splitProps']
const webImports = ['Dynamic', 'insert', 'isServer']
// getNextElement and template are only used in the browser branch. solid-js < 1.9 does not export them
// from its server build, so a named import would fail to link under SSR: read them off the namespace.
const webNs = 'SolidWeb'

// free vars: STYLES, DEFAULT_STYLE (+ the imports above)
const baseSrc = `let withTitleTpl
// <title> must live in the SVG namespace and Dynamic only knows the SVG tag list, so the browser
// clones an SVG template. Both branches sit one component deep, keeping hydration keys aligned.
function WithClientTitle(props) {
  withTitleTpl || (withTitleTpl = SolidWeb.template('<svg><title></title></svg>', false, true))
  const el = SolidWeb.getNextElement(withTitleTpl)
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
  // Every key is always present (undefined = absent), so spread also drops attributes that go away.
  p.color = c !== 'currentColor' ? c : undefined
  if (s.strokeWidth !== false) {
    const sw = o.strokeWidth
    const w = sw == null || sw === '' || isNaN(Number(sw)) ? s.strokeWidth : Number(sw)
    const px = /^\\s*\\d*\\.?\\d+(px)?\\s*$/.test(String(size)) ? parseFloat(size) : 0
    p['stroke-width'] = o.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
  }
  p.class = 'withi withi-' + name + (o.class ? ' ' + o.class : '')
  const named = !!(o.title || rest['aria-label'] || rest['aria-labelledby'])
  p.role = named ? 'img' : undefined
  p['aria-hidden'] = named ? undefined : 'true'
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
  Component.iconNode = iconNode
  return Component
}`

// free vars: withFindComponent, withLoadStyle, DEFAULT_STYLE. Reactive in name and variant.
// A style that is not loaded yet renders through solid's lazy() (one per style, resolving to Icon itself, which gets
// name and variant); once loaded every Icon of that style renders synchronously.
const iconSrc = `const WITH_LAZY = {}
const Icon = function (props) {
  const [own, rest] = splitProps(props, ['name', 'variant'])
  const found = createMemo(() => withFindComponent(own.name, own.variant))
  const pending = () => typeof found() === 'string'
  return createComponent(Dynamic, mergeProps(rest, {
    get component() {
      const C = found()
      return typeof C !== 'string' ? C : WITH_LAZY[C] || (WITH_LAZY[C] = lazy(() => withLoadStyle(C).then(() => ({ default: Icon }))))
    },
    get name() { return pending() ? own.name : undefined },
    get variant() { return pending() ? own.variant : undefined },
  }))
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
export type WithIcon = Component<WithIconProps> & {
  /** The icon's drawing as [tag, attrs][] (24x24 grid). Feed it to applyPalette() from @withicons/core/palettes/palette-map.js. */
  readonly iconNode: IconNode
}
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
    importEsm: `import { ${imports.join(', ')} } from 'solid-js'\nimport { ${webImports.join(', ')} } from 'solid-js/web'\nimport * as ${webNs} from 'solid-js/web'`,
    importCjs: `const { ${imports.join(', ')} } = require('solid-js')\nconst ${webNs} = require('solid-js/web')\nconst { ${webImports.join(', ')} } = ${webNs}`,
    mapAttrs: a => a,
    baseSrc, iconSrc, typesDts,
    typeNames: ['WithIcon', 'WithIconProps', 'IconProps', 'IconComponentProps'],
    iconTypeImport: () => `import type { Component } from 'solid-js'`,
    iconType: 'Component<IconProps>',
  })
  const { exports, typesVersions } = componentExports(ctx)
  const pkg = {
    ...basePkg(ctx, '@withicons/solid', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable SolidJS components (no JSX compile step, SSR + hydration).`, ['solid', 'solid-js', 'solidjs', 'solid-start', 'solid-component', 'svg-icons', 'typescript', 'tree-shakable', 'ssr', 'animated-icons', 'multicolor-icons',
        ...ctx.styles.map(s => `${s.name}-icons`)].filter((k, i, a) => a.indexOf(k) === i)),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports: withSolidCondition(exports), typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    scripts: { test: 'node --test test/*.test.mjs' },
    peerDependencies: { 'solid-js': '^1.6.0' },
  }
  writePkg(ctx, 'solid', pkg, solidSections(ctx, frameworkReadme(ctx, {
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
    generic: `import { Suspense } from 'solid-js'
import { Icon } from '@withicons/solid'

<Icon name="home" size={20} />                  // line: renders at once; name and variant are reactive
<Suspense><Icon name="home" variant="solid" size={20} /></Suspense>   // solid: loaded on first use`,
    lazy: `Until a style has loaded, its \`Icon\` is a solid \`lazy()\` component: it suspends to the nearest \`<Suspense>\`, and
\`renderToStringAsync\` / \`renderToStream\` / SolidStart wait for it. A synchronous \`renderToString\` needs
\`await preloadStyles(...)\` first. With \`require()\` (CommonJS) styles load synchronously.`,
  })))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}

// Solid-only README sections, spliced into the shared framework README: every colour of one icon and the
// per-icon palettes (before "Animation"), then animation, RTL and SSR / compatibility (before "Generic icon").
// Every example is exercised by a consumer test (see the package review notes); keep them runnable.
function solidSections(ctx, md) {
  const has = n => ctx.icons.some(i => i.name === n)
  const P = n => ctx.icons.find(i => i.name === n).pascal
  const retro = ctx.styles.find(s => s.name === 'retro' && s.palette)
  const vars = retro ? Object.keys(retro.vars || {}).filter(k => retro.vars[k] !== 'currentColor') : []
  const colours = ['#f4b942', '#d9412b', '#2f8f4e', '#f7e3b5', '#5b2a12']
  const palette = retro && vars.length && has('pizza') ? `
### Change every colour in Solid

\`color\` sets the outline (it is \`currentColor\`); every other colour of a palette style is an inherited CSS variable,
so the \`style\` prop (typed for \`--*\` keys, no cast needed) or any CSS rule re-themes one icon:

\`\`\`tsx
import { Pizza } from '@withicons/solid/retro'

<Pizza size={48} color="#3b1f12" style={{
${vars.map((k, i) => `  '${k}': '${colours[i % colours.length]}',`).join('\n')}
}} />
\`\`\`

Every icon also has 20-30 colour palettes picked for it in [\`@withicons/core\`](https://www.npmjs.com/package/@withicons/core)
(\`npm i @withicons/core\`). Every component carries its drawing as \`iconNode\`, and \`applyPalette\` maps a palette onto
the variables that icon uses, in any style:

\`\`\`tsx
import { For } from 'solid-js'
import { Pizza } from '@withicons/solid/retro'
import pizza from '@withicons/core/palettes/pizza.json'
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

const looks = pizza.palettes.map(p => ({ ...p, ...applyPalette(JSON.stringify(Pizza.iconNode), p.colors) }))

<For each={looks}>{p => <Pizza size={40} style={p.vars} color={p.color ?? undefined} title={p.name} />}</For>
\`\`\`
` : ''
  const motion = `
## Animation in Solid

Import the two stylesheets of [\`@withicons/motion\`](https://www.npmjs.com/package/@withicons/motion) once, then put the
classes on a wrapper (or straight on the icon: \`class\` and \`data-*\` reach its \`<svg>\`). \`motionAttrs\` returns plain
\`class\` / \`data-wm\` / \`style\` strings, so it spreads in JSX and renders on the server:

\`\`\`tsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { motionAttrs } from '@withicons/motion'
import { Bell } from '@withicons/solid'

<span class="wm wm-loop" data-wm="bell"><Bell /></span>
<button class="wm-trigger"><span {...motionAttrs('bell', { trigger: 'hover' })}><Bell /></span> Alerts</button>
\`\`\`

For the JS-only triggers (\`inview\`, a hover that always finishes) call \`motion(el, name, options)\` in \`onMount\` with a
\`ref\`, and \`destroy()\` the handle in \`onCleanup\`.
`
  const rtl = rtlDoc('tsx', `<ChevronRight class="with-rtl" />

// animated: mirror the icon, and point nudge / pass the other way on the wrapper
<span class="wm wm-hover" data-wm="arrow-right" style={{ '--wm-dx': isRtl() ? -1 : 1 }}>
  <ArrowRight class="with-rtl" />
</span>`)
  const ssr = `
## SSR, SolidStart and module formats

- Components are plain ESM built on \`solid-js/web\`'s \`Dynamic\`: no JSX compile step inside the package. They render with
  \`renderToString\` / \`renderToStream\` and SolidStart, and hydrate onto the server markup (the \`<title>\` is created in the
  SVG namespace on both sides). Works with \`solid-js\` 1.6 and later; SSR and hydration are tested on 1.6 and 1.9.
- Every entry has a \`solid\` export condition, so \`vite-plugin-solid\` bundles the icons with your app and they always
  share its \`solid-js\` instance.
- The root and every style subpath ship ESM (\`import\`) and CommonJS (\`require\`) with matching types.
  The per-icon deep paths (\`icons/*\`, \`<style>/icons/*\`) and \`/icon\` are ESM only.
- Each style is one module of \`/*#__PURE__*/\` components with \`sideEffects: false\`: a bundler keeps only the icons you
  import (the shared runtime plus about 0.1 kB gzipped per line icon), and Node or Vitest load one file per style.
`
  const put = (text, marker, add) => text.includes(marker) ? text.replace(marker, add.replace(/^\n/, '') + '\n' + marker) : text + add
  return put(put(md, '## Animation (optional)', palette), '## Generic icon', motion + rtl + ssr)
}
