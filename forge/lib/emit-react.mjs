// emit-react — @withicons/react. One forwardRef component per icon per style; see emitComponentPackage.
import { groupOfStyle } from '../tools/style-groups.mjs'
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount, paletteDoc, motionDoc, totalText } from './emit-core.mjs'

// SVG attribute names -> React prop names ('stroke-width' -> strokeWidth, 'class' -> className, style string -> object)
const camel = k => k.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase())
export function reactAttrs(attrs) {
  const out = {}
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue
    if (k === 'class') out.className = v
    else if (k === 'style' && typeof v === 'string') {
      const o = {}
      for (const decl of v.split(';')) {
        const i = decl.indexOf(':'); if (i < 0) continue
        const p = decl.slice(0, i).trim(), val = decl.slice(i + 1).trim()
        if (p) o[p.startsWith('--') ? p : camel(p)] = val
      }
      out.style = o
    } else if (k.startsWith('data-') || k.startsWith('aria-')) out[k] = v
    else out[camel(k)] = v
  }
  return out
}

const baseSrc = `function createWithIcon(name, style, displayName, iconNode) {
  const s = STYLES[style] || STYLES[DEFAULT_STYLE]
  let kids = null
  const Component = forwardRef(function WithIcon(props, ref) {
    const { size = 24, color = 'currentColor', strokeWidth, absoluteStrokeWidth = false, title, className, children, ...rest } = props
    if (!kids) kids = iconNode.map(n => createElement(n[0], n[1]))
    const c = color || 'currentColor'
    const p = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
    for (const k in s.root) p[k] = s.root[k] === 'currentColor' ? c : s.root[k]
    if (c !== 'currentColor') p.color = c
    if (s.strokeWidth !== false) {
      const w = strokeWidth == null || strokeWidth === '' || isNaN(Number(strokeWidth)) ? s.strokeWidth : Number(strokeWidth)
      const px = /^\\s*\\d*\\.?\\d+(px)?\\s*$/.test(String(size)) ? parseFloat(size) : 0
      p.strokeWidth = absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
    }
    p.className = 'withi withi-' + name + (className ? ' ' + className : '')
    if (title || rest['aria-label'] || rest['aria-labelledby']) p.role = 'img'
    else p['aria-hidden'] = 'true'
    for (const k in rest) p[k] = rest[k]
    p.ref = ref
    return createElement('svg', p, title ? createElement('title', null, title) : null, ...kids, children)
  })
  Component.displayName = displayName
  return Component
}`

// A style that is not loaded yet renders through React.lazy (one per style, resolving to Icon itself): it suspends
// like any lazy component, works in Server Components and streaming SSR, and renders synchronously once loaded.
const iconSrc = `const WITH_LAZY = {}
const Icon = forwardRef(function Icon(props, ref) {
  const { name, variant, ...rest } = props
  const C = withFindComponent(name, variant)
  if (!C) return null
  if (typeof C === 'string') {
    const L = WITH_LAZY[C] || (WITH_LAZY[C] = lazy(() => withLoadStyle(C).then(() => ({ default: Icon }))))
    return createElement(L, Object.assign({}, props, { ref }))
  }
  rest.ref = ref
  return createElement(C, rest)
})
Icon.displayName = 'Icon'`

const typesDts = `
import type { CSSProperties, ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
/** CSSProperties plus CSS custom properties, so palette variables need no cast: { '--with-retro-1': '#fde047' }. */
export type WithIconStyle = CSSProperties & { [variable: \`--\${string}\`]: string | number | undefined }
export interface WithIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'color' | 'strokeWidth' | 'title' | 'style'> {
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
  /** Inline style. Takes CSS custom properties too: --with-duo, --with-accent and every palette variable (--with-retro-1, ...). */
  style?: WithIconStyle
}
export type WithIcon = ForwardRefExoticComponent<WithIconProps & RefAttributes<SVGSVGElement>>
export interface IconProps extends WithIconProps {
  /** Canonical name ('home') or an unambiguous alias ('house'). */
  name: IconName | IconAlias
  /** One of the styles. Default 'line'. */
  variant?: StyleName
}
/** Alias of WithIconProps */
export type IconComponentProps = WithIconProps
`

export default async function emit(ctx) {
  const files = await emitComponentPackage(ctx, {
    dir: 'react',
    importEsm: `import { createElement, forwardRef, lazy } from 'react'`,
    importCjs: `const { createElement, forwardRef, lazy } = require('react')`,
    mapAttrs: reactAttrs,
    baseSrc, iconSrc, typesDts,
    typeNames: ['WithIcon', 'WithIconProps', 'WithIconStyle', 'IconProps', 'IconComponentProps'],
    iconTypeImport: () => `import type { ForwardRefExoticComponent, RefAttributes } from 'react'`,
    iconType: 'ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>',
  })
  const { exports, typesVersions } = componentExports(ctx)
  const pkg = {
    ...basePkg(ctx, '@withicons/react', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable React components.`,
      ['react', 'react-icons', 'react-components', 'nextjs', 'react-server-components', 'svg-icons', 'typescript', 'tree-shakable', 'animated-icons', ...ctx.styles.map(s => `${s.name}-icons`)]),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports, typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    scripts: { test: 'node --test test/*.test.mjs' },
    peerDependencies: { react: '>=16.8.0' },
  }
  writePkg(ctx, 'react', pkg, readme(ctx))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}

// "line and duo `1.75`, blueprint `1.25`, ...": the default stroke width of each live-stroke style, grouped by value.
function strokeDefaults(ctx) {
  const by = new Map()
  for (const s of ctx.styles) if (typeof s.strokeWidth === 'number') by.set(s.strokeWidth, [...(by.get(s.strokeWidth) || []), s.name])
  return [...by].map(([w, names]) => `${names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0]} \`${w}\``).join(', ')
}

export function frameworkReadme(ctx, o) {
  const styleRows = ctx.styles.map(s => `| \`${s.name}\` | \`${o.pkg}${s.name === ctx.defaultStyle ? '' : '/' + s.name}\` | ${groupOfStyle(s.name).title} | ${s.description} |`).join('\n')
  return `# ${o.pkg}

${ctx.icons.length} icons x ${ctx.styles.length} styles for ${o.framework}. Tree-shakable, typed, \`currentColor\` by default.

\`\`\`bash
npm i ${o.pkg}
\`\`\`

\`\`\`${o.lang}
${o.example}
\`\`\`

- **One rule:** the root is the **line** style, every other style is a subpath (\`${o.pkg}/solid\`, \`${o.pkg}/duo\`, ...).
  Import the icons you use by name from the style you want. That is all.
${o.speed || `- Fast everywhere: each style is a single module, so the root or a style subpath loads that one style (never all ${ctx.styles.length}),
  quickly in Node, SSR, Jest and Vitest, and bundlers keep only the icons you import. No bundler config needed
  (no \`optimizePackageImports\`, no deep imports).`}
- Every icon is exported twice: \`Home\` and \`HomeIcon\`. Names are the PascalCase of the kebab-case icon name (\`arrow-right\` -> \`ArrowRight\`).
- Deep imports keep working: \`${o.pkg}/icons/home\`, \`${o.pkg}/solid/icons/home\`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| \`size\` | \`number \\| string\` | \`24\` | width and height |
| \`color\` | \`string\` | \`'currentColor'\` | inherits the CSS text color by default |
| \`strokeWidth\` | \`number \\| string\` | the style's own: ${strokeDefaults(ctx)} | only these live-stroke styles; the others ignore it |
| \`absoluteStrokeWidth\` | \`boolean\` | \`false\` | keep the stroke width constant in px at any size |
| \`title\` | \`string\` | — | renders \`<title>\` and sets \`role="img"\`; otherwise \`aria-hidden="true"\` |
| \`${o.classProp}\` | \`string\` | — | appended to \`withi withi-<name>\` |
| ...rest | | | spread onto the \`<svg>\` |

## Styles

| style | import | group | look |
|---|---|---|---|
${styleRows}

Duo's tint can be recoloured with the CSS variable \`--with-duo\`.
${paletteDoc(ctx, '###')}${motionDoc(ctx)}
## Generic icon (dynamic names)

\`\`\`${o.lang}
${o.generic}
\`\`\`

\`name\` accepts canonical names and unambiguous aliases (\`bin\` -> \`trash\`); unknown names warn with the 3 nearest names and render nothing.

**How \`Icon\` loads styles.** The root \`Icon\` renders the **${ctx.defaultStyle}** style at once (a dynamic name needs every ${ctx.defaultStyle} icon,
so using \`Icon\` brings that style). Any other \`variant\` is loaded the first time it renders: one dynamic import per
style (one chunk in a bundle, one file in Node), shared by every \`Icon\` of that style.
${o.lazy}

To have other styles ready up front, \`await preloadStyles('solid', 'duo')\` (no argument = every style). Or import
\`Icon\` from \`${o.pkg}/icon\`: it imports every icon of every style (${ctx.icons.length} x ${ctx.styles.length}, heavy) and always renders synchronously.
\`Icon\` is tree-shaken away when unused; prefer named imports wherever the name is static.

## Custom icons

\`createWithIcon(name, style, displayName, iconNode)\` builds a component from IconNode data (\`[tag, attrs][]\`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, ${ctx.styles.length} deterministic styles, ${totalText(ctx)} icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}

function readme(ctx) {
  const md = frameworkReadme(ctx, {
    pkg: '@withicons/react', framework: 'React', lang: 'jsx', classProp: 'className',
    example: `import { Home, Search } from '@withicons/react'        // line (default style)
import { Home as HomeSolid } from '@withicons/react/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} className="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}`,
    generic: `import { Suspense } from 'react'
import { Icon } from '@withicons/react'

<Icon name="home" size={20} />                      // line: renders at once
<Suspense fallback={null}>
  <Icon name="home" variant="solid" size={20} />    // solid: loaded on first use
</Suspense>`,
    lazy: `Until a style has loaded, its \`Icon\` suspends like any \`React.lazy\` component, so wrap it in \`<Suspense>\`.
Server Components and streaming SSR (Next.js App Router, \`renderToPipeableStream\`) wait for it and send the finished
\`<svg>\`; a synchronous \`renderToString\` needs \`await preloadStyles(...)\` first. With \`require()\` (CommonJS, Jest)
styles load synchronously and \`Icon\` never suspends.`,
  })
  const marker = '## Generic icon (dynamic names)'
  return md.includes(marker) ? md.replace(marker, reactSections(ctx) + marker) : md + reactSections(ctx)
}

// React-only README sections: every palette colour per icon, motion and RTL in JSX, SSR / RSC / module formats.
function reactSections(ctx) {
  const pal = ctx.styles.find(s => s.name === 'retro' && s.palette) || ctx.styles.find(s => s.palette)
  const vars = pal ? Object.entries(pal.vars || {}).filter(([, v]) => v !== 'currentColor').map(([k]) => k) : []
  const has = n => ctx.icons.some(i => i.name === n)
  const pick = (...names) => names.find(has) || ctx.icons[0].name
  const P = n => ctx.icons.find(i => i.name === n).pascal
  const palIcon = pick('pizza', 'star', 'heart')
  const colours = ['#fde047', '#fb923c', '#f43f5e', '#0d9488', '#3b0764', '#a78bfa', '#38bdf8', '#4ade80', '#f472b6', '#ffffff']
  const palette = pal && vars.length ? `
## Change every colour of one icon

\`color\` sets the outline (it is \`currentColor\`); every other colour of a palette style is a CSS variable, so the
\`style\` prop (or any CSS rule on an ancestor) re-themes a single icon. \`style\` is typed to accept \`--*\` variables,
so TypeScript needs no cast:

\`\`\`jsx
import { ${P(palIcon)} } from '${'@withicons/react/' + pal.name}'

<${P(palIcon)} size={48} color="#3b0764" style={{
${vars.map((k, i) => `  '${k}': '${colours[i % colours.length]}',`).join('\n')}
}} />
\`\`\`

Variables a given icon does not use are simply ignored, so one palette object can theme a whole toolbar.
` : ''
  const bell = pick('bell'), play = pick('play'), pause = pick('pause'), chev = pick('chevron-right', 'arrow-right')
  return `${palette}
## Animation in React

Import the two stylesheets of [\`@withicons/motion\`](https://www.npmjs.com/package/@withicons/motion) once, then put the
classes straight on the icon (they are spread onto its \`<svg>\`):

\`\`\`jsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { useState } from 'react'
import { ${P(bell)}, ${P(play)}, ${P(pause)} } from '@withicons/react'

export function Controls() {
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <${P(bell)} className="wm wm-loop" data-wm="${bell}" />
      <button className="wm-trigger"><${P(bell)} className="wm wm-hover" data-wm="${bell}" /> Alerts</button>
      <button aria-pressed={playing} aria-label="Play" onClick={() => setPlaying(p => !p)}>
        <span className="wm-swap wm-fx-flip"><${P(play)} className="wm-a" /><${P(pause)} className="wm-b" /></span>
      </button>
    </>
  )
}
\`\`\`

## Right-to-left layouts

Icons are drawn left to right. To mirror the directional ones (arrows, chevrons, undo and redo, send, reply, log in and
out) in Arabic, Hebrew, Persian or Urdu UIs, give them a class and add one rule. It uses the \`scale\` property, so it
composes with motion's transforms and a nudge follows the mirrored direction:

\`\`\`css
.with-rtl:dir(rtl) { scale: -1 1; }
@supports not selector(:dir(rtl)) { [dir="rtl"] .with-rtl { scale: -1 1; } }  /* iOS 15 to 16.3 */
\`\`\`

\`\`\`jsx
<${P(chev)} className="with-rtl" />
\`\`\`

## SSR, Server Components and module formats

- Components are plain \`forwardRef\` components with no hooks, state or effects. They render in React Server Components
  (Next.js App Router, no \`'use client'\` needed), with \`react-dom/server\`, and hydrate without mismatches.
  Works with React 16.8 and later; SSR and hydration are tested on React 18 and 19.
- The root and every style subpath ship ESM (\`import\`) and CommonJS (\`require\`) with matching types.
  The per-icon deep paths (\`icons/*\`, \`<style>/icons/*\`) and \`/icon\` are ESM only.
- Each style is one module of \`/*#__PURE__*/\` components with \`sideEffects: false\`: Vite, webpack (Next.js), Rollup and
  esbuild keep only the icons you import, and Node, Jest and Vitest load one file per style. Next.js needs no
  \`optimizePackageImports\` entry, and named imports from the root are as small as deep imports.

`
}
