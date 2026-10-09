// emit-svelte — @withicons/svelte. Ships .svelte sources (the normal way to publish Svelte
// components), written in the classic syntax that Svelte 4 AND Svelte 5 both compile.
// Same API, exports map, generic <Icon>, alias resolution and style fallback as react/vue.
//
//   dist/IconBase.svelte                 the one shared renderer: icon node + props -> <svg>
//   dist/Icon.svelte                     generic <Icon name="home" variant="solid" /> (other styles load on first use)
//   dist/IconAll.svelte                  the same with every style imported up front (subpath /icon)
//   dist/<style>/icons/<name>.svelte     tiny per-icon wrapper: imports its drawing from ../nodes/<name>.js
//   dist/<style>/nodes/<name>.js         one drawing (IconNode data); repeated values come from ../values.js
//   dist/<style>/nodes.js                every drawing of the style (for the generic <Icon>)
//   dist/<style>/index.js                every icon of that style as Name + NameIcon
//   dist/index.js                        default style + Icon + IconBase + iconNames/styleNames
import { J, LOOKUP_SRC, UNIQ_SRC, nodePool, distWriter, basePkg, writePkg, renderOf, fallbackCount, styleTable, namesAndAliasesDts } from './emit-core.mjs'
import { frameworkReadme } from './emit-react.mjs'

// Per-instance gradient ids (rich styles), shared with every other @withicons component package (withUniq in emit-core).
const uniqSrc = `${UNIQ_SRC}
let WITH_UID = 0
export function nextUid() { return 'w' + (++WITH_UID) }
export function uniqueNode(iconNode, uid) { return iconNode && iconNode.some(n => n[2]) ? withUniq(iconNode, uid) : iconNode || [] }`
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

const svelteTypes = (ctx) => `
import type { SvelteComponent, ComponentConstructorOptions } from 'svelte'
import type { SVGAttributes } from 'svelte/elements'
export interface WithIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color' | 'title'> {
  /** Width and height (number = px, or any CSS length). Default 24. */
  size?: number | string
  /** Icon color. Default 'currentColor' (inherits the CSS text color). */
  color?: string
  /** Stroke width in 24-grid units. Only affects styles with live strokes (${ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')}). */
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
/** Icons dispatch no component events. Svelte 5: pass onclick etc. as props. Svelte 4: put on:click on a wrapping element. */
export type IconEvents = {}
export type IconSlots = { default: {} }
/** Instance type of every icon (Svelte 4 style: ComponentProps<Home>, bind:this). */
export declare class WithIcon extends SvelteComponent<WithIconProps, IconEvents, IconSlots> {}
export declare class WithGenericIcon extends SvelteComponent<IconProps, IconEvents, IconSlots> {}
export declare class WithIconBase extends SvelteComponent<IconBaseProps, IconEvents, IconSlots> {}
/**
 * The type of every icon component: a Svelte 4 component class AND a Svelte 5 \`Component\`, so
 * \`ComponentProps<typeof Home>\` (Svelte 5), \`ComponentProps<Home>\` (Svelte 4) and \`Component<WithIconProps>\` all work.
 * Type an icon passed as a prop with it: \`export let icon: WithIconComponent\`.
 */
export interface WithIconComponent<Props extends Record<string, any> = WithIconProps, Instance = WithIcon> {
  new (options: ComponentConstructorOptions<Props>): Instance
  (internal: unknown, props: Props & { $$events?: IconEvents; $$slots?: IconSlots }): {}
}
`

export default async function emit(ctx) {
  const P = 'packages/svelte/dist'
  const out = distWriter(ctx, P)
  const W = (rel, text) => out.add(rel, text)
  const D = ctx.defaultStyle
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/svelte ${ctx.version} — generated, do not edit\n`

  W('types.d.ts', namesAndAliasesDts(ctx) + svelteTypes(ctx))
  W('attrs.js', `${header}export const DEFAULT_STYLE = ${J(D)}\nexport const STYLES = ${J(styleTable(ctx))}\n${attrsSrc}\n${uniqSrc}\n`)
  W('attrs.d.ts', `import type { StyleName, IconNode } from './types.js'\nexport declare const DEFAULT_STYLE: ${J(D)}\nexport declare const STYLES: Record<StyleName, { root: Record<string, string | number>; strokeWidth: number | false }>\n` +
    `/** iconNode with its gradient ids made unique for one rendered copy (rich styles; others are returned as is). */\nexport declare function uniqueNode(iconNode: IconNode, uid: string): IconNode\n/** A new per-instance id. */\nexport declare function nextUid(): string\n`)

  W('IconBase.svelte', `<script>
  // @withicons/svelte — the shared renderer behind every icon (Svelte 4 + 5).
  import { STYLES, DEFAULT_STYLE, svgAttrs, uniqueNode, nextUid } from './attrs.js';
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
  // rich styles (gradients): this copy's own gradient ids, so icons on one page never share a gradient
  const uid = nextUid();
  $: nodes = uniqueNode(iconNode, uid);
  $: attrs = svgAttrs(name, STYLES[variant] || STYLES[DEFAULT_STYLE], { size, color, strokeWidth, absoluteStrokeWidth, title, class: className }, $$restProps);
</script>

<svg {...attrs} {...$$restProps}>{#if title}<title>{title}</title>{/if}{#each nodes as [tag, a, kids]}{#if kids}<svelte:element this={tag} {...a}>{#each kids as [t2, a2, k2]}{#if k2}<svelte:element this={t2} {...a2}>{#each k2 as [t3, a3]}<svelte:element this={t3} {...a3} />{/each}</svelte:element>{:else}<svelte:element this={t2} {...a2} />{/if}{/each}</svelte:element>{:else}<svelte:element this={tag} {...a} />{/if}{/each}<slot /></svg>
`)

  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  W('meta.js', `${header}export const iconNames = ${J(ctx.icons.map(i => i.name))}\nexport const styleNames = ${J(styleNames)}\nexport const aliases = ${J(aliases)}\n`)
  W('meta.d.ts', `import type { IconName, StyleName } from './types.js'\nexport declare const iconNames: IconName[]\nexport declare const styleNames: StyleName[]\n/** alias -> canonical names (more than one = ambiguous) */\nexport declare const aliases: Record<string, IconName[]>\n`)

  let files = 0
  for (const s of styleNames) {
    const idx = [], idxDts = [], fallback = {}
    // Each drawing ships once, in its own small data module (dist/<style>/nodes/<name>.js), and the attribute values a
    // style repeats (palette variables, classes) once in dist/<style>/values.js. The per-icon .svelte imports its one
    // drawing and the generic <Icon>'s nodes.js all of them: nothing twice, and a deep import loads only its own icon.
    const renders = ctx.icons.map(i => [i, renderOf(ctx, i, s)])
    const pool = nodePool(renders.map(([, r]) => r.nodes), { shared: true })
    W(`${s}/values.js`, `${header}${pool.decl(null, true)}\n`)
    for (const [i, r] of renders) {
      if (r.style !== s) fallback[i.name] = r.style
      const used = new Set(), own = pool.local(r.nodes, used)
      W(`${s}/nodes/${i.name}.js`, (used.size ? `import { ${[...used].join(', ')} } from '../values.js'\n` : '') +
        (own.decl ? own.decl + '\n' : '') + `export default ${own.lit}\n`)
      W(`${s}/icons/${i.name}.svelte`, `<script>
  import IconBase from '../../IconBase.svelte';
  import iconNode from '../nodes/${i.name}.js';
</script>

<IconBase {...$$props} name="${i.name}" variant="${r.style}" {iconNode}><slot /></IconBase>
`)
      W(`${s}/icons/${i.name}.svelte.d.ts`, `import type { WithIcon, WithIconComponent } from '../../types.js'\n/** ${i.name} (${s}) — ${i.description.replace(/\*\//g, '')} */\ndeclare const ${i.pascal}: WithIconComponent\ntype ${i.pascal} = WithIcon\nexport default ${i.pascal}\n`)
      files += 2
      idx.push(`export { default as ${i.pascal}, default as ${i.pascal}Icon } from './icons/${i.name}.svelte'`)
      idxDts.push(`/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${i.pascal}: C\nexport type ${i.pascal} = I\nexport declare const ${i.pascal}Icon: C\nexport type ${i.pascal}Icon = I`)
    }
    W(`${s}/index.js`, `${header}${idx.join('\n')}\n`)
    W(`${s}/index.d.ts`, `import type { WithIcon as I, WithIconComponent as C } from '../types.js'\n${idxDts.join('\n')}\n`)
    W(`${s}/nodes.js`, `${header}${ctx.icons.map(i => `import ${i.pascal} from './nodes/${i.name}.js'`).join('\n')}\n` +
      `export const nodes = { ${ctx.icons.map(i => `${J(i.name)}: ${i.pascal}`).join(', ')} }\nexport const fallback = ${J(fallback)}\n`)
  }

  // generic <Icon>: canonical names, PascalCase and unambiguous aliases, like every other package.
  // find.js holds the default style; any other style's nodes load on first use (one dynamic import per style).
  W('find.js', `${header}import { iconNames, styleNames, aliases } from './meta.js'
import { nodes as n_${D}, fallback as f_${D} } from './${D}/nodes.js'
const DEFAULT_STYLE = ${J(D)}
const LOAD = { ${styleNames.map(s => s === D ? `${J(s)}: null` : `${J(s)}: () => import('./${s}/nodes.js')`).join(', ')} }
const SETS = { ${J(D)}: [n_${D}, f_${D}] }
const PENDING = {}
const ICON_SET = new Set(iconNames)
${LOOKUP_SRC}
const WITH_WARNED = {}
function withWarn(msg) { if (!WITH_WARNED[msg] && typeof console !== 'undefined') { WITH_WARNED[msg] = 1; console.warn(msg) } }
/**
 * name/alias + variant -> { name, variant, iconNode }, null (unknown name, warns once), or the style name (a string)
 * when that style is not loaded yet: load it with loadStyle(). sets: an explicit { style: [nodes, fallback] } table.
 */
export function findIcon(name, variant, sets) {
  let v = variant || DEFAULT_STYLE
  if (!Object.prototype.hasOwnProperty.call(LOAD, v)) {
    withWarn('with icons: unknown variant "' + v + '". Use one of: ' + styleNames.join(', ') + '. Falling back to "' + DEFAULT_STYLE + '".')
    v = DEFAULT_STYLE
  }
  let canonical
  try { canonical = withLookup(name, k => ICON_SET.has(k), iconNames, aliases) } catch (e) { withWarn(e.message); return null }
  const set = (sets || SETS)[v]
  if (!set) return v
  const iconNode = set[0][canonical]
  return iconNode ? { name: canonical, variant: set[1][canonical] || v, iconNode } : null
}
/** Load one style's icon data for <Icon>. */
export function loadStyle(v) {
  if (SETS[v]) return Promise.resolve()
  if (!Object.prototype.hasOwnProperty.call(LOAD, v)) return Promise.reject(new Error('with icons: unknown style "' + v + '". Use one of: ' + styleNames.join(', ') + '.'))
  return PENDING[v] || (PENDING[v] = LOAD[v]().then(m => { SETS[v] = [m.nodes, m.fallback] }, e => { delete PENDING[v]; throw e }))
}
/** Load styles for <Icon> ahead of time (no argument = every style), e.g. before a server render. */
export function preloadStyles() {
  const list = arguments.length ? [].concat.apply([], arguments) : styleNames
  return Promise.all(list.map(loadStyle)).then(() => {})
}
`)
  // every style up front, for the /icon entry (synchronous everywhere, weighs every icon)
  W('find-all.js', `${header}${styleNames.map(s => `import { nodes as n_${s}, fallback as f_${s} } from './${s}/nodes.js'`).join('\n')}
export const ALL = { ${styleNames.map(s => `${J(s)}: [n_${s}, f_${s}]`).join(', ')} }
`)
  W('Icon.svelte', `<script>
  // Generic icon: <Icon name="home" variant="solid" />. The ${D} style renders at once; any other style
  // loads on first use (or up front with preloadStyles()). Prefer named imports (Home, Lock, ...)
  // wherever the name is static.
  import IconBase from './IconBase.svelte';
  import { findIcon, loadStyle } from './find.js';
  export let name;
  export let variant = undefined;
  let loaded = 0;
  $: found = findIcon(name, variant, null, loaded);
  $: if (typeof found === 'string') loadStyle(found).then(() => { loaded += 1 }, e => console.warn(e && e.message));
</script>

{#if found && typeof found === 'object'}<IconBase {...$$restProps} name={found.name} variant={found.variant} iconNode={found.iconNode}><slot /></IconBase>{/if}
`)
  W('IconAll.svelte', `<script>
  // Generic icon with every style imported up front (@withicons/svelte/icon): renders synchronously in
  // every style, also on the server, and weighs every icon. The root Icon loads styles on demand instead.
  import IconBase from './IconBase.svelte';
  import { findIcon } from './find.js';
  import { ALL } from './find-all.js';
  export let name;
  export let variant = undefined;
  $: found = findIcon(name, variant, ALL);
</script>

{#if found}<IconBase {...$$restProps} name={found.name} variant={found.variant} iconNode={found.iconNode}><slot /></IconBase>{/if}
`)
  const preloadDts = `/** Load styles for <Icon> ahead of time (no argument = every style). Await it before a server render so icons in\n * other styles than ${D} are in the HTML. */\nexport declare function preloadStyles(...styles: StyleName[]): Promise<void>\n`
  W('icon.d.ts', `import type { WithGenericIcon, WithIconComponent, IconProps, StyleName } from './types.js'\n/**\n * Generic icon: <Icon name="home" variant="solid" />. Accepts canonical names and unambiguous aliases.\n * This entry imports every icon of every style (${ctx.icons.length} x ${styleNames.length}) and renders synchronously; the root Icon loads\n * each style on first use instead. Prefer named imports.\n */\ndeclare const Icon: WithIconComponent<IconProps, WithGenericIcon>\ntype Icon = WithGenericIcon\nexport default Icon\nexport { Icon }\n`)
  W('icon-lazy.d.ts', `import type { WithGenericIcon, WithIconComponent, IconProps, StyleName } from './types.js'\n/**\n * Generic icon: <Icon name="home" variant="solid" />. Accepts canonical names and unambiguous aliases.\n * The ${D} style renders at once; any other style loads on first use (one chunk per style) or with preloadStyles().\n * Prefer named imports wherever the name is static.\n */\nexport declare const Icon: WithIconComponent<IconProps, WithGenericIcon>\nexport type Icon = WithGenericIcon\n${preloadDts}`)

  W('index.js', `${header}export * from './${D}/index.js'
export { default as Icon } from './Icon.svelte'
export { preloadStyles } from './find.js'
export { default as IconBase } from './IconBase.svelte'
export { iconNames, styleNames } from './meta.js'
`)
  W('index.d.ts', `export * from './${D}/index.js'
export { Icon, preloadStyles } from './icon-lazy.js'
import type { WithIconBase, WithIconComponent, IconBaseProps } from './types.js'
/** Low-level renderer for your own IconNode data: <IconBase iconNode={...} name="my-icon" variant="line" />. */
export declare const IconBase: WithIconComponent<IconBaseProps, WithIconBase>
export type IconBase = WithIconBase
export { iconNames, styleNames } from './meta.js'
export type { IconName, IconAlias, StyleName, IconNode, WithIcon, WithIconComponent, WithIconProps, IconProps, IconComponentProps, IconBaseProps } from './types.js'
`)
  await out.flush()

  // ---- package.json: same entry points as react/vue, with the "svelte" condition
  const e = (types, file) => ({ types, svelte: file, default: file })
  const ex = { '.': e('./dist/index.d.ts', './dist/index.js') }
  for (const s of styleNames) ex['./' + s] = e(`./dist/${s}/index.d.ts`, `./dist/${s}/index.js`)
  ex['./icon'] = e('./dist/icon.d.ts', './dist/IconAll.svelte')
  ex['./icons/*.svelte'] = e(`./dist/${D}/icons/*.svelte.d.ts`, `./dist/${D}/icons/*.svelte`)
  ex['./icons/*'] = e(`./dist/${D}/icons/*.svelte.d.ts`, `./dist/${D}/icons/*.svelte`)
  for (const s of styleNames) {
    ex[`./${s}/icons/*.svelte`] = e(`./dist/${s}/icons/*.svelte.d.ts`, `./dist/${s}/icons/*.svelte`)
    ex[`./${s}/icons/*`] = e(`./dist/${s}/icons/*.svelte.d.ts`, `./dist/${s}/icons/*.svelte`)
  }
  ex['./package.json'] = './package.json'
  // legacy moduleResolution 'node': '<style>/icons/home' and '<style>/icons/home.svelte' both resolve (fallback list)
  const deep = s => [`./dist/${s}/icons/*.svelte.d.ts`, `./dist/${s}/icons/*.d.ts`]
  const tv = { icon: ['./dist/icon.d.ts'], 'icons/*': deep(D) }
  for (const s of styleNames) { tv[s] = [`./dist/${s}/index.d.ts`]; tv[`${s}/icons/*`] = deep(s) }
  const pkg = {
    ...basePkg(ctx, '@withicons/svelte', `${ctx.icons.length} icons x ${ctx.styles.length} styles as tree-shakable Svelte components (Svelte 4 and 5).`, ['svelte', 'svelte5', 'sveltekit', 'svelte-icons', 'svelte-components', 'svg-icons', 'animated-icons', ...ctx.styles.map(s => `${s.name}-icons`)]),
    type: 'module', sideEffects: false,
    svelte: './dist/index.js', types: './dist/index.d.ts',
    // the bare CDN URL (cdn.jsdelivr.net/npm/@withicons/svelte) shows the entry instead of a 404
    jsdelivr: './dist/index.js', unpkg: './dist/index.js',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
    scripts: { test: 'node --test test/*.test.mjs' },
    peerDependencies: { svelte: '^4.0.0 || ^5.0.0' },
  }
  writePkg(ctx, 'svelte', pkg, svelteReadme(ctx))
  const fb = fallbackCount(ctx)
  return `${files} icon files, ${ctx.styles.length} styles${fb ? `, ${fb} fell back to ${D}` : ''}`
}

function svelteReadme(ctx) {
  let md = frameworkReadme(ctx, {
    pkg: '@withicons/svelte', framework: 'Svelte 4 and Svelte 5', lang: 'svelte', classProp: 'class', noCdn: true,
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
  import { Icon } from '@withicons/svelte';
</script>

<Icon name="home" size={20} />                    <!-- line: renders at once -->
<Icon name="home" variant="solid" size={20} />    <!-- solid: loaded on first use -->`,
    speed: `- Each icon is a small \`.svelte\` file and the package has \`sideEffects: false\`: production builds keep only the icons you
  import. For the fastest dev server, see the deep imports under "Svelte notes".`,
    lazy: `Until a style has loaded, its \`Icon\` renders nothing, then the icon. On the server it renders only styles already
loaded, so call \`await preloadStyles('solid')\` before rendering (e.g. in a SvelteKit \`load\` or \`hooks.server\`) when
server HTML must contain them.`,
  })
  const custom = /## Custom icons[\s\S]*?(?=\n\nMIT licensed|\nMIT licensed|$)/
  const svelteCustom = `## Custom icons

\`<IconBase iconNode={[['path', { d: 'M4 12h16' }]]} name="my-icon" variant="line" />\` renders your own IconNode data
(\`[tag, attrs][]\`, 24x24 grid) with the same props.

## Theming palette styles in Svelte

Set the palette variables with Svelte's \`--css-prop\` syntax, a \`style\` attribute on the icon, or any parent:

\`\`\`svelte
<script>
  import { Rocket } from '@withicons/svelte/retro';
  import { Home } from '@withicons/svelte/sticker';
</script>

<Rocket --with-retro-1="#fde047" --with-retro-2="#a855f7" />
<Home style="--with-sticker-sky: #22c55e" size={48} />
\`\`\`

## Animation in Svelte

\`\`\`svelte
<script>
  import '@withicons/motion/motion.css';
  import '@withicons/motion/icons.css';
  import { motion } from '@withicons/motion';
  import { Bell, Rocket } from '@withicons/svelte';

  // optional: a Svelte action for the JS triggers (inview, hover that always finishes)
  const wm = (el, name) => { const m = motion(el, name, { trigger: 'inview' }); return { destroy: () => m.destroy() } };
</script>

<span class="wm wm-loop" data-wm="bell"><Bell /></span>
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell"><Bell /></span> Alerts</button>
<span use:wm={'rocket'}><Rocket size={32} /></span>
\`\`\`

## Right-to-left layouts

Icons are drawn left to right. Mirror the directional ones (arrows, chevrons, undo/redo, send, log-in/out) in RTL
with one global rule. The icon's own class takes the flip, so a motion wrapper around it can still move:

\`\`\`svelte
<ChevronRight class="rtl-mirror" />

<style>
  :global([dir='rtl'] .rtl-mirror) { transform: scaleX(-1); }
</style>
\`\`\`

## TypeScript

Every icon is typed as \`WithIconComponent\`: a Svelte 4 component class and a Svelte 5 \`Component\` at once.

\`\`\`ts
import type { ComponentProps } from 'svelte';
import type { WithIconComponent, WithIconProps, IconName, StyleName } from '@withicons/svelte';
import { Home } from '@withicons/svelte';

type Props = ComponentProps<typeof Home>;   // Svelte 5 (Svelte 4: ComponentProps<Home>)
const nav: { label: string; icon: WithIconComponent }[] = [{ label: 'Home', icon: Home }];
\`\`\`

\`name\` on \`<Icon>\` is checked against \`IconName | IconAlias\` and \`variant\` against \`StyleName\`.

## Svelte notes

- Components are shipped as \`.svelte\` source in the classic syntax, which both Svelte 4 and Svelte 5 compile
  (Svelte 5 runs them in legacy mode; they work inside runes components and hydrate cleanly after SSR / SvelteKit).
  Do not force \`compilerOptions.runes: true\` on \`node_modules\`: use \`dynamicCompileOptions\` for your own files instead.
- Svelte 5 event props (\`onclick\`) spread onto the \`<svg>\`. Icons dispatch no component events, so Svelte 4 \`on:click\`
  is not forwarded: put it on a wrapping \`<button>\` (the better pattern for accessibility anyway).
- Dev-server speed (SvelteKit / Vite SSR): \`import { Home } from '@withicons/svelte'\` makes the dev server compile every
  icon of that style (${ctx.icons.length} small \`.svelte\` files) on a cold start, which can take tens of seconds. Deep imports compile only
  what you use: \`import Home from '@withicons/svelte/icons/home'\`, \`import Home from '@withicons/svelte/solid/icons/home'\`.
  Production builds tree-shake both forms to the same output.
- Tree-shaking is per icon: the first icon adds about 3 KB gzipped on Svelte 4 and about 10 KB on Svelte 5 (the shared
  renderer plus Svelte 5's legacy-mode runtime, paid once), and each further icon about 0.2 KB.
`
  md = custom.test(md) ? md.replace(custom, svelteCustom.trimEnd()) : md + '\n' + svelteCustom
  return md
}
