// emit-svelte — @withicons/svelte. Ships .svelte sources (the normal way to publish Svelte
// components), written in the classic syntax that Svelte 4 AND Svelte 5 both compile.
// Same API, exports map, generic <Icon>, alias resolution and style fallback as react/vue.
//
//   dist/IconBase.svelte                 the one shared renderer: icon node + props -> <svg>
//   dist/Icon.svelte                     generic <Icon name="home" variant="solid" />
//   dist/<style>/icons/<name>.svelte     tiny per-icon wrapper (inline node data)
//   dist/<style>/index.js                every icon of that style as Name + NameIcon
//   dist/index.js                        default style + Icon + IconBase + iconNames/styleNames
import { J, LOOKUP_SRC, distWriter, basePkg, writePkg, renderOf, fallbackCount, styleTable, namesAndAliasesDts } from './emit-core.mjs'
import { frameworkReadme } from './emit-react.mjs'

// Same attribute logic as every other @withicons component package.
const attrsSrc = `export function svgAttrs(name, s, o, rest) {
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
  const r = rest || {}
  if (o.title || r['aria-label'] || r['aria-labelledby']) p.role = 'img'
  else p['aria-hidden'] = 'true'
  return p
}`

const svelteTypes = `
import type { SvelteComponent } from 'svelte'
import type { SVGAttributes } from 'svelte/elements'
export interface WithIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color' | 'title'> {
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
export interface IconProps extends WithIconProps {
  /** Canonical name ('home') or an unambiguous alias ('house'). */
  name: IconName | IconAlias
  /** One of the styles. Default 'line'. */
  variant?: StyleName
}
/** Alias of WithIconProps */
export type IconComponentProps = WithIconProps
export interface IconBaseProps extends WithIconProps {
  iconNode: IconNode
  name?: string
  variant?: StyleName
}
export type IconEvents = { [evt: string]: CustomEvent<any> }
export type IconSlots = { default: {} }
/** Every icon component (class form: understood by Svelte 4 and Svelte 5 tooling). */
export declare class WithIcon extends SvelteComponent<WithIconProps, IconEvents, IconSlots> {}
export declare class WithGenericIcon extends SvelteComponent<IconProps, IconEvents, IconSlots> {}
export declare class WithIconBase extends SvelteComponent<IconBaseProps, IconEvents, IconSlots> {}
`

export default async function emit(ctx) {
  const P = 'packages/svelte/dist'
  const out = distWriter(ctx, P)
  const W = (rel, text) => out.add(rel, text)
  const D = ctx.defaultStyle
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/svelte ${ctx.version} — generated, do not edit\n`

  W('types.d.ts', namesAndAliasesDts(ctx) + svelteTypes)
  W('attrs.js', `${header}export const DEFAULT_STYLE = ${J(D)}\nexport const STYLES = ${J(styleTable(ctx))}\n${attrsSrc}\n`)
  W('attrs.d.ts', `import type { StyleName } from './types.js'\nexport declare const DEFAULT_STYLE: 'line'\nexport declare const STYLES: Record<StyleName, { root: Record<string, string | number>; strokeWidth: number | false }>\n`)

  W('IconBase.svelte', `<script>
  // @withicons/svelte — the shared renderer behind every icon (Svelte 4 + 5).
  import { STYLES, DEFAULT_STYLE, svgAttrs } from './attrs.js';
  export let iconNode = [];
  export let name = '';
  export let variant = DEFAULT_STYLE;
  export let size = 24;
  export let color = 'currentColor';
  export let strokeWidth = undefined;
  export let absoluteStrokeWidth = false;
  export let title = undefined;
  let className = '';
  export { className as class };
  $: attrs = svgAttrs(name, STYLES[variant] || STYLES[DEFAULT_STYLE], { size, color, strokeWidth, absoluteStrokeWidth, title, class: className }, $$restProps);
</script>

<svg {...attrs} {...$$restProps}>{#if title}<title>{title}</title>{/if}{#each iconNode as [tag, a]}<svelte:element this={tag} {...a} />{/each}<slot /></svg>
`)

  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  W('meta.js', `${header}export const iconNames = ${J(ctx.icons.map(i => i.name))}\nexport const styleNames = ${J(styleNames)}\nexport const aliases = ${J(aliases)}\n`)
  W('meta.d.ts', `import type { IconName, StyleName } from './types.js'\nexport declare const iconNames: IconName[]\nexport declare const styleNames: StyleName[]\n/** alias -> canonical names (more than one = ambiguous) */\nexport declare const aliases: Record<string, IconName[]>\n`)

  let files = 0
  for (const s of styleNames) {
    const idx = [], idxDts = [], nodes = {}, fallback = {}
    for (const i of ctx.icons) {
      const r = renderOf(ctx, i, s)
      nodes[i.name] = r.nodes
      if (r.style !== s) fallback[i.name] = r.style
      W(`${s}/icons/${i.name}.svelte`, `<script>
  import IconBase from '../../IconBase.svelte';
  const iconNode = ${J(r.nodes)};
</script>

<IconBase {...$$props} name="${i.name}" variant="${r.style}" {iconNode}><slot /></IconBase>
`)
      W(`${s}/icons/${i.name}.svelte.d.ts`, `import type { WithIcon } from '../../types.js'\n/** ${i.name} (${s}) — ${i.description.replace(/\*\//g, '')} */\ndeclare const ${i.pascal}: typeof WithIcon\nexport default ${i.pascal}\n`)
      files += 2
      idx.push(`export { default as ${i.pascal}, default as ${i.pascal}Icon } from './icons/${i.name}.svelte'`)
      idxDts.push(`/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${i.pascal}: typeof WithIcon\nexport declare const ${i.pascal}Icon: typeof WithIcon`)
    }
    W(`${s}/index.js`, `${header}${idx.join('\n')}\n`)
    W(`${s}/index.d.ts`, `import type { WithIcon } from '../types.js'\n${idxDts.join('\n')}\n`)
    W(`${s}/nodes.js`, `${header}export const nodes = ${J(nodes)}\nexport const fallback = ${J(fallback)}\n`)
  }

  // generic <Icon>: canonical names, PascalCase and unambiguous aliases, like every other package
  W('find.js', `${header}import { iconNames, styleNames, aliases } from './meta.js'
${styleNames.map(s => `import { nodes as n_${s}, fallback as f_${s} } from './${s}/nodes.js'`).join('\n')}
const DEFAULT_STYLE = ${J(D)}
const SETS = { ${styleNames.map(s => `${J(s)}: [n_${s}, f_${s}]`).join(', ')} }
const ICON_SET = new Set(iconNames)
${LOOKUP_SRC}
const WITH_WARNED = {}
function withWarn(msg) { if (!WITH_WARNED[msg] && typeof console !== 'undefined') { WITH_WARNED[msg] = 1; console.warn(msg) } }
/** name/alias + variant -> { name, variant, iconNode } or null (warns once) */
export function findIcon(name, variant) {
  let v = variant || DEFAULT_STYLE
  if (!Object.prototype.hasOwnProperty.call(SETS, v)) {
    withWarn('with icons: unknown variant "' + v + '". Use one of: ' + styleNames.join(', ') + '. Falling back to "' + DEFAULT_STYLE + '".')
    v = DEFAULT_STYLE
  }
  let canonical
  try { canonical = withLookup(name, k => ICON_SET.has(k), iconNames, aliases) } catch (e) { withWarn(e.message); return null }
  const set = SETS[v], iconNode = set[0][canonical]
  return iconNode ? { name: canonical, variant: set[1][canonical] || v, iconNode } : null
}
`)
  W('Icon.svelte', `<script>
  // Generic icon: <Icon name="home" variant="solid" />. Imports every icon of every style —
  // prefer named imports (Home, Lock, ...) wherever the name is static.
  import IconBase from './IconBase.svelte';
  import { findIcon } from './find.js';
  export let name;
  export let variant = undefined;
  $: found = findIcon(name, variant);
</script>

{#if found}<IconBase {...$$restProps} name={found.name} variant={found.variant} iconNode={found.iconNode}><slot /></IconBase>{/if}
`)
  W('icon.d.ts', `import type { WithGenericIcon } from './types.js'\n/**\n * Generic icon: <Icon name="home" variant="solid" />. Accepts canonical names and unambiguous aliases.\n * Bundle cost: imports every icon in every style (${ctx.icons.length} x ${styleNames.length}); prefer named imports.\n */\ndeclare const Icon: typeof WithGenericIcon\nexport default Icon\nexport { Icon }\n`)

  W('index.js', `${header}export * from './${D}/index.js'
export { default as Icon } from './Icon.svelte'
export { default as IconBase } from './IconBase.svelte'
export { iconNames, styleNames } from './meta.js'
`)
  W('index.d.ts', `export * from './${D}/index.js'
export { Icon } from './icon.js'
import type { WithIconBase } from './types.js'
/** Low-level renderer for your own IconNode data: <IconBase iconNode={...} name="my-icon" variant="line" />. */
export declare const IconBase: typeof WithIconBase
export { iconNames, styleNames } from './meta.js'
export type { IconName, IconAlias, StyleName, IconNode, WithIcon, WithIconProps, IconProps, IconComponentProps, IconBaseProps } from './types.js'
`)
  await out.flush()

  // ---- package.json: same entry points as react/vue, with the "svelte" condition
  const e = (types, file) => ({ types, svelte: file, default: file })
  const ex = { '.': e('./dist/index.d.ts', './dist/index.js') }
  for (const s of styleNames) ex['./' + s] = e(`./dist/${s}/index.d.ts`, `./dist/${s}/index.js`)
  ex['./icon'] = e('./dist/icon.d.ts', './dist/Icon.svelte')
  ex['./icons/*.svelte'] = e(`./dist/${D}/icons/*.svelte.d.ts`, `./dist/${D}/icons/*.svelte`)
  ex['./icons/*'] = e(`./dist/${D}/icons/*.svelte.d.ts`, `./dist/${D}/icons/*.svelte`)
  for (const s of styleNames) {
    ex[`./${s}/icons/*.svelte`] = e(`./dist/${s}/icons/*.svelte.d.ts`, `./dist/${s}/icons/*.svelte`)
    ex[`./${s}/icons/*`] = e(`./dist/${s}/icons/*.svelte.d.ts`, `./dist/${s}/icons/*.svelte`)
  }
  ex['./package.json'] = './package.json'
  const tv = { icon: ['./dist/icon.d.ts'], 'icons/*': [`./dist/${D}/icons/*.svelte.d.ts`] }
  for (const s of styleNames) { tv[s] = [`./dist/${s}/index.d.ts`]; tv[`${s}/icons/*`] = [`./dist/${s}/icons/*.svelte.d.ts`] }
  const pkg = {
    ...basePkg(ctx, '@withicons/svelte', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable Svelte components (Svelte 4 and 5).`, ['svelte', 'sveltekit', 'svelte-icons', 'svg-icons']),
    type: 'module', sideEffects: false,
    svelte: './dist/index.js', types: './dist/index.d.ts',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { svelte: '^4.0.0 || ^5.0.0' },
  }
  writePkg(ctx, 'svelte', pkg, svelteReadme(ctx))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${D}` : ''}`
}

function svelteReadme(ctx) {
  let md = frameworkReadme(ctx, {
    pkg: '@withicons/svelte', framework: 'Svelte 4 and Svelte 5', lang: 'svelte', classProp: 'class',
    example: `<script>
  import { Home, Search } from '@withicons/svelte';       // line (default style)
  import { Home as HomeSolid } from '@withicons/svelte/solid';
</script>

<nav>
  <Home />
  <Search size={20} strokeWidth={1.5} class="text-slate-500" />
  <HomeSolid size={32} color="#e11d48" title="Home" />
</nav>`,
    generic: `<script>
  import { Icon } from '@withicons/svelte';   // or: import Icon from '@withicons/svelte/icon'
</script>

<Icon name="home" variant="solid" size={20} />`,
  })
  const custom = /## Custom icons[\s\S]*?(?=\n\nMIT licensed|\nMIT licensed|$)/
  const svelteCustom = `## Custom icons

\`<IconBase iconNode={[['path', { d: 'M4 12h16' }]]} name="my-icon" variant="line" />\` renders your own IconNode data
(\`[tag, attrs][]\`, 24x24 grid) with the same props.

## Svelte notes

- Components are shipped as \`.svelte\` source in the classic syntax, which both Svelte 4 and Svelte 5 compile
  (Svelte 5 runs them in legacy mode; they work inside runes components). Do not force \`compilerOptions.runes: true\`
  on \`node_modules\` — use \`dynamicCompileOptions\` for your own files instead.
- Svelte 5 event props (\`onclick\`) spread onto the \`<svg>\`; Svelte 4 \`on:click\` is not forwarded — wrap the icon in a \`<button>\`.
`
  md = custom.test(md) ? md.replace(custom, svelteCustom.trimEnd()) : md + '\n' + svelteCustom
  return md
}
