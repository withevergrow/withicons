// emit-react — @withicons/react. One forwardRef component per icon per style; see emitComponentPackage.
import { emitComponentPackage, componentExports, basePkg, writePkg, fallbackCount } from './emit-core.mjs'

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

const iconSrc = `const Icon = forwardRef(function Icon(props, ref) {
  const { name, variant, ...rest } = props
  const C = withFindComponent(name, variant)
  if (!C) return null
  rest.ref = ref
  return createElement(C, rest)
})
Icon.displayName = 'Icon'`

const typesDts = `
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
export interface WithIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'color' | 'strokeWidth' | 'title'> {
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
    importEsm: `import { createElement, forwardRef } from 'react'`,
    importCjs: `const { createElement, forwardRef } = require('react')`,
    mapAttrs: reactAttrs,
    baseSrc, iconSrc, typesDts,
    typeNames: ['WithIcon', 'WithIconProps', 'IconProps', 'IconComponentProps'],
    iconTypeImport: () => `import type { ForwardRefExoticComponent, RefAttributes } from 'react'`,
    iconType: 'ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>',
  })
  const { exports, typesVersions } = componentExports(ctx)
  const pkg = {
    ...basePkg(ctx, '@withicons/react', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable React components.`, ['react', 'react-icons', 'svg-icons']),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports, typesVersions,
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { react: '>=16.8.0' },
  }
  writePkg(ctx, 'react', pkg, readme(ctx))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${ctx.defaultStyle}` : ''}`
}

export function frameworkReadme(ctx, o) {
  const styleRows = ctx.styles.map(s => `| \`${s.name}\` | \`${o.pkg}${s.name === ctx.defaultStyle ? '' : '/' + s.name}\` | ${s.kind} | ${s.description} |`).join('\n')
  return `# ${o.pkg}

${ctx.icons.length} icons x ${ctx.styles.length} styles for ${o.framework}. Tree-shakable, typed, \`currentColor\` by default.

\`\`\`bash
npm i ${o.pkg}
\`\`\`

\`\`\`${o.lang}
${o.example}
\`\`\`

- Default import path = **line** style. Every other style is a subpath: \`${o.pkg}/solid\`, \`${o.pkg}/duo\`, ...
- Every icon is exported twice: \`Home\` and \`HomeIcon\`. Names are the PascalCase of the kebab-case icon name (\`arrow-right\` -> \`ArrowRight\`).
- Deep imports (one file per icon): \`${o.pkg}/icons/home\`, \`${o.pkg}/solid/icons/home\`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| \`size\` | \`number \\| string\` | \`24\` | width and height |
| \`color\` | \`string\` | \`'currentColor'\` | inherits the CSS text color by default |
| \`strokeWidth\` | \`number \\| string\` | style default (\`1.75\`) | only styles with live strokes (${ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')}) |
| \`absoluteStrokeWidth\` | \`boolean\` | \`false\` | keep the stroke width constant in px at any size |
| \`title\` | \`string\` | — | renders \`<title>\` and sets \`role="img"\`; otherwise \`aria-hidden="true"\` |
| \`${o.classProp}\` | \`string\` | — | appended to \`withi withi-<name>\` |
| ...rest | | | spread onto the \`<svg>\` |

## Styles

| style | import | kind | look |
|---|---|---|---|
${styleRows}

Duo's tint can be recoloured with the CSS variable \`--with-duo\`.

## Generic icon (dynamic names)

\`\`\`${o.lang}
${o.generic}
\`\`\`

\`name\` accepts canonical names and unambiguous aliases (\`bin\` -> \`trash\`); unknown names warn with the 3 nearest names and render nothing.
**Bundle cost:** \`Icon\` references every icon in every style (${ctx.icons.length} x ${ctx.styles.length}). It is tree-shaken away when unused; when used, prefer named imports wherever the name is static.

## Custom icons

\`createWithIcon(name, style, displayName, iconNode)\` builds a component from IconNode data (\`[tag, attrs][]\`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, seven deterministic styles. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}

function readme(ctx) {
  return frameworkReadme(ctx, {
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
    generic: `import { Icon } from '@withicons/react'

<Icon name="home" variant="solid" size={20} />`,
  })
}
