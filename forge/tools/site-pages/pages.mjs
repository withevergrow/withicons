import vm from 'vm'
import { pathToFileURL } from 'url'
import fs from 'fs'
import { COPY_ICON, icon, esc, page, write, crumbs, cvar, code, ORIGIN, GITHUB, STYLES, ROOT, META, rawSvg, askAI, STYLE_INFO, styleTitle, stylesIn, listTitles, N_ICONS, N_STYLES, N_TOTAL, num, word, Word, MOTION, PRESETS, siteExists, hasStyle } from './lib.mjs'
import { motionSection, MOTION_TOC, motionAssets } from './motion.mjs'
import { motionVars } from './lib.mjs'
import { FORMATS, CLI_FORMATS, GROUPS as FMT_GROUPS, seeThrough } from './formats.mjs'

const I = (n, s = 'line', size = 24, cls = '') => icon(n, s, { size, cls })
const STYLE_PLAIN = {
  line: ['Line', 'A clean outline. The everyday choice for apps and websites.'],
  solid: ['Solid', 'Filled in and bold. Easy to spot, great for “selected” states.'],
  duo: ['Duo', 'An outline over a soft tint. Friendly, with a touch of colour.'],
  gloss: ['Gloss', 'Puffy and shiny, like a soft vinyl toy. For fun, bold moments.'],
  engrave: ['Engrave', 'Fine lines like the art on a banknote. Classic and a bit fancy.'],
  blueprint: ['Blueprint', 'An architect’s drawing, guides and measurements included.'],
  sketch: ['Sketch', 'Drawn by hand with a marker. Warm and human.'],
  glass: ['Glass', 'Frosted glass panes stacked in layers. Soft, light and modern.'],
  kawaii: ['Kawaii', 'Chubby and soft, with a tiny happy face and rosy cheeks.'],
  sticker: ['Sticker', 'A die-cut sticker with a puffy white border and a sparkle.'],
  pixel: ['Pixel', 'Crisp pixel art, like your favourite old video game.'],
  retro: ['Retro', 'Seventies sunset stripes and a chunky outline. Groovy.'],
  luxe: ['Luxe', 'Layered 3D with gold trim and soft light. Rich and premium.'],
  bauhaus: ['Bauhaus', 'Circles, squares and triangles in red, yellow and blue. Bold design.'],
  skeuo: ['Skeuo', 'Real materials, bevels and shadows, like an object you could touch.'],
  anime: ['Anime', 'Anime cel shading: bold ink, bright colour and starry highlights.'],
  gothic: ['Gothic', 'Cathedral stone, pointed arches and glowing stained glass.'],
  pastel: ['Pastel', 'Soft candy pastels with gentle shading. Calm and dreamy.'],
  coquette: ['Coquette', 'Blush pink, satin bows, pearls and lace. Romantic.'],
  plush: ['Plush', 'Soft felt toys with stitched seams. Made for kids.'],
}
const plain = s => STYLE_PLAIN[s] || [styleTitle(s), (STYLE_INFO[s] && STYLE_INFO[s].description) || '']
const GROUP_LABEL = { universal: 'Universal', creative: 'Creative', playful: 'Playful', studio: 'Studio', storybook: 'Storybook' }
const groupOf = s => (STYLE_INFO[s] && STYLE_INFO[s].group) || 'creative'
const UNI = stylesIn('universal'), CRE = stylesIn('creative'), PLAY = stylesIn('playful'), STU = stylesIn('studio'), STORY = stylesIn('storybook')
const tabs = (id, items, label) => `<div class="pg-tabs" data-tabs>
  <div class="pg-tablist" role="tablist" aria-label="${esc(label)}">${items.map(([k, l], i) => `<button type="button" role="tab" id="${id}-t-${k}" aria-controls="${id}-p-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${l}</button>`).join('')}</div>
  ${items.map(([k, , html], i) => `<div class="pg-tabpanel" role="tabpanel" id="${id}-p-${k}" aria-labelledby="${id}-t-${k}" tabindex="0"${i === 0 ? '' : ' hidden'}>${html}</div>`).join('\n  ')}
</div>`

/* ───────────────────────── developers ───────────────────────── */
function developers() {
  const path = 'developers.html'
  const install = pkg => code(`npm i ${pkg}`, 'sh', 'Terminal')
  const SIZE_WAYS = [
    ['Font size', 'grows with the text', '<i class="with with-home" style="font-size: 48px"></i>'],
    ['Size class', 'with-xs to with-5x, times the text size', '<i class="with with-home with-3x"></i>'],
    ['Exact size', 'whatever the text size', '<i class="with with-home" style="--with-size: 48px"></i>'],
  ]
  // one light block: each way is a short comment line above its code line (reads well at phone width too)
  const sizeFold = (sub, say, rows, note) => `<details class="dv-size"><summary>Make it bigger or smaller <small>${sub}</small></summary><p>${say}</p>${code(rows.map(([t, d, c]) => (t ? `<!-- ${t.toLowerCase()}: ${d} -->\n` : '') + c).join('\n\n'), 'html')}${note ? `<p class="pg-note">${note}</p>` : ''}</details>`
  const SIZE_NOTE = 'Setting only <code>height</code> does not work: the width stays <code>1em</code>.'
  const qs = [
    ['react', 'React', install('@withicons/react') + code(`import { Home, Search } from '@withicons/react'          // line (default)
import { Home as HomeSolid } from '@withicons/react/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} className="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}`, 'jsx', 'Toolbar.jsx')],
    ['vue', 'Vue', install('@withicons/vue') + code(`<script setup>
import { Home, Search } from '@withicons/vue'
import { Home as HomeSolid } from '@withicons/vue/solid'
</script>

<template>
  <Home />
  <Search :size="20" :stroke-width="1.5" class="text-slate-500" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>`, 'vue', 'Toolbar.vue')],
    ['svelte', 'Svelte', install('@withicons/svelte') + code(`<script>
  import { Home, Search } from '@withicons/svelte'
  import { Home as HomeSolid } from '@withicons/svelte/solid'
</script>

<Home />
<Search size={20} strokeWidth={1.5} class="text-slate-500" />
<HomeSolid size={32} color="#e11d48" title="Home" />`, 'svelte', 'Toolbar.svelte')],
    ['angular', 'Angular', install('@withicons/angular') + code(`import { Component } from '@angular/core'
import { WithIconComponent, Home, Search } from '@withicons/angular'
import { Home as HomeSolid } from '@withicons/angular/solid'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: \`
    <with-icon [icon]="Home" />
    <with-icon [icon]="Search" [size]="20" [strokeWidth]="1.5" />
    <with-icon [icon]="HomeSolid" [size]="32" color="#e11d48" title="Home" />
  \`,
})
export class ToolbarComponent { Home = Home; Search = Search; HomeSolid = HomeSolid }`, 'ts', 'toolbar.component.ts')],
    ['solid', 'Solid', install('@withicons/solid') + code(`import { Home, Search } from '@withicons/solid'
import { Home as HomeSolid } from '@withicons/solid/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} class="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}`, 'tsx', 'Toolbar.tsx')],
    ['web', 'Web component', code(`<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>`, 'html', 'index.html') + `<p class="pg-note">Works in any framework, or none. The page downloads only the icons it shows: about 7 KB gzipped for the element, then one small file per icon (a line icon is about 150 bytes gzipped). Style the inner svg with <code>with-icon::part(svg)</code>.</p>` + sizeFold('the size attribute', 'Use <code>size</code>: pixels, or any CSS length.', [['', '', '<with-icon name="home" size="48"></with-icon>']])],
    ['classes', 'Icon classes', code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-search with-2x"></i>
<i class="with with-heart with-solid"></i>`, 'html', 'index.html') + `<p class="pg-note">The loader (about 6 KB gzipped) links just the CSS of the icons on the page, in any mix of styles. Each icon is a CSS mask over <code>currentColor</code>, sized <code>1em</code>. Zero JavaScript instead? Link one stylesheet per style, <code>with-line.css</code> (all ${N_ICONS} line icons, about 26 KB gzipped).</p>` + sizeFold('font size, a size class or an exact size', 'The icon is <code>1em</code> square, so it follows the text size. Three ways to make it 48 px:', SIZE_WAYS, SIZE_NOTE)],
    ['svg', 'SVG & sprite', code(`<!-- one sprite per style, served from your own site -->
<svg width="24" height="24"><use href="sprite-line.svg#with-home"/></svg>

<!-- or a single file -->
<img src="https://cdn.jsdelivr.net/npm/@withicons/static@latest/dist/svg/line/home.svg" width="24" height="24" alt="Home">`, 'html', 'index.html') + `<p class="pg-note">An <code>&lt;img&gt;</code> can’t inherit <code>currentColor</code> and renders black. Use inline SVG or the sprite to recolour.</p>`],
  ]
  const pkgs = [
    ['@withicons/react', 'React 18+', 'code', 'line'], ['@withicons/vue', 'Vue 3', 'code', 'sketch'], ['@withicons/svelte', 'Svelte 4 & 5', 'code', 'solid'],
    ['@withicons/angular', 'Angular 17+, standalone', 'code', 'gloss'], ['@withicons/solid', 'SolidJS', 'code', 'duo'], ['@withicons/web', '<with-icon> custom element', 'globe', 'blueprint'],
    ['@withicons/classes', 'Icon classes: <i class="with with-home">', 'hash', 'sketch'],
    ['@withicons/static', 'SVG files & sprites, no JS', 'file-image', 'engrave'], ['@withicons/core', 'Data, aliases, toSvg()', 'database', 'line'], ['@withicons/search', 'The search engine behind this site', 'search', 'solid'],
    ['@withicons/mcp', 'MCP server for AI agents', 'bot', 'duo'], ['withicons', 'CLI: npx withicons', 'terminal', 'sketch'],
  ]
  const props = [
    ['size', 'number | string', '24', 'Width and height.'],
    ['color', 'string', 'currentColor', 'Inherits the text colour by default.'],
    ['strokeWidth', 'number | string', '1.75', 'Line, Duo, Blueprint and Sketch (styles with live strokes).'],
    ['absoluteStrokeWidth', 'boolean', 'false', 'Keep the stroke the same pixel width at any size.'],
    ['title', 'string', '—', 'Adds <title> and role="img". Without it the icon is aria-hidden.'],
    ['className / class', 'string', '—', 'Added to the svg’s own classes.'],
  ]
  const mods = [
    ['with-2x', 'twice the size', 'size2'], ['with-spin', 'rotate forever', 'spin'], ['with-pulse', 'rotate in 8 steps', 'pulse'],
    ['with-rotate-90', 'quarter turn', 'r90'], ['with-flip-h', 'mirror sideways', 'fliph'], ['with-flip-v', 'mirror up-down', 'flipv'], ['with-fw', 'fixed width for lists', 'fw'],
  ]
  const modIcon = { size2: 'star', spin: 'loader', pulse: 'refresh', r90: 'arrow-right', fliph: 'reply', flipv: 'thumbs-up', fw: 'list' }
  const body = `
<div class="dv">
  <section class="dv-hero pg-hero">
    ${crumbs([['Home', 'index.html'], ['Developers', null]])}
    <p class="pg-eyebrow"><span class="hand">for developers</span></p>
    <h1 class="pg-title">One icon set.<br><span class="pg-hl" style="--g:${cvar('line')}">Every framework.</span></h1>
    <p class="pg-lede">${N_ICONS} icons × ${N_STYLES} styles with the same names, grid and props everywhere: React, Vue, Svelte, Angular, Solid, a web component, CSS classes and plain SVG. Tree-shakable, typed, <code>currentColor</code> by default, zero runtime dependencies. Want them to move? Add the optional <a href="#motion">animations package</a>.</p>
    <div class="dv-launch" data-reveal>
      <a class="dv-badge" href="https://www.npmjs.com/org/withicons">${I('package', 'solid', 18)} Live on npm</a>
      <span>Or download the files:</span>
      <a class="btn btn-ink" href="sprites/line.svg" download>${I('download', 'line', 18)} Line sprite</a>
      <a class="btn btn-ghost" href="vendor/with/with-line.css" download>${I('file-code', 'line', 18)} with-line.css</a>
      <a class="btn btn-ghost" href="icons.json">${I('braces', 'line', 18)} icons.json</a>
    </div>
    <div class="dv-term" aria-hidden="true">
      <div class="dv-term-bar"><i></i><i></i><i></i><span>terminal</span></div>
      <pre><span class="dv-prompt">$</span> <span class="dv-type" data-type="npm i @withicons/react">npm i @withicons/react</span>
<span class="dv-out">+ @withicons/react · ${N_ICONS} icons × ${N_STYLES} styles</span>
<span class="dv-out ok">✓ tree-shaken: only what you import ships</span></pre>
      <div class="dv-term-icons" style="--cols:${Math.ceil(STYLES.length / Math.ceil(STYLES.length / 7))}">${STYLES.map((s, i) => `<span style="--g:${cvar(s)};--n:${i}">${I('rocket', s, 30)}</span>`).join('')}</div>
    </div>
  </section>

  <div class="dv-layout">
    <nav class="dv-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>${[['frameworks', 'Quick start'], ['packages', 'Packages'], ['props', 'Props'], ['styles', 'Styles'], ...MOTION_TOC, ['classes', 'Icon classes'], ['theming', 'Theming'], ['aliases', 'Names & aliases'], ['a11y', 'Accessibility'], ['tree-shaking', 'Bundle size'], ['cdn', 'CDN & downloads'], ...(FORMATS.length ? [['export', 'Export formats']] : []), ['cli', 'CLI']].map(([h, l]) => `<li><a href="#${h}">${l}</a></li>`).join('')}</ol>
    </nav>
    <div class="dv-main">

    <section id="frameworks" class="dv-sec">
      <h2>Quick start</h2>
      <p>Pick your tool. The default import is the <b>Line</b> style; every other style is a subpath with the same export names.</p>
      ${tabs('qs', qs, 'Framework')}
    </section>

    <section id="packages" class="dv-sec">
      <h2>Packages</h2>
      <ul class="dv-pkgs">${pkgs.map(([n, d, ic, s], i) => `<li style="--g:${cvar(s)};--i:${i}" data-reveal><span class="dv-pkg-ic">${I(ic, 'line', 22)}</span><code>${esc(n)}</code><span>${esc(d)}</span></li>`).join('')}</ul>
      <p class="pg-note">Every icon is exported twice, <code>Home</code> and <code>HomeIcon</code>, so it never clashes with your own names. Component names are the PascalCase of the icon name: <code>arrow-up-right</code> → <code>ArrowUpRight</code>. Deep imports work too: <code>@withicons/react/solid/icons/home</code>.</p>
    </section>

    <section id="props" class="dv-sec">
      <h2>Props</h2>
      <p>The same props in every framework package (Angular uses the same names as inputs; the web component uses <code>size</code>, <code>color</code>, <code>stroke-width</code>, <code>absolute-stroke-width</code>, <code>label</code>).</p>
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>What it does</th></tr></thead><tbody>
        ${props.map(r => `<tr><td><code>${r[0]}</code></td><td><code>${esc(r[1])}</code></td><td><code>${esc(r[2])}</code></td><td>${esc(r[3])}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="dv-play" data-reveal data-stroke-play>
        <div class="dv-play-icons">${['settings', 'bell', 'camera', 'heart'].map(n => I(n, 'line', 48)).join('')}</div>
        <label>strokeWidth <input type="range" min="0.75" max="3" step="0.25" value="1.75" data-stroke-range data-wikit> <output data-stroke-out>1.75</output></label>
        ${code('<Settings strokeWidth={1.75} />', 'jsx').replace('<div class="code pg-code"', '<div class="code pg-code" data-stroke-code')}
      </div>
      <h3>Generic icon (dynamic names)</h3>
      ${code(`import { Icon } from '@withicons/react'

<Icon name="home" variant="solid" size={20} />   // aliases work: name="bin" → trash`, 'jsx')}
      <p class="pg-note"><code>Icon</code> references every icon in every style. It’s dropped from your bundle when unused; when you do use it, prefer named imports wherever the name is static.</p>
    </section>

    <section id="styles" class="dv-sec">
      <h2>Styles</h2>
      <p>${Word(N_STYLES)} styles. <b>Universal</b> styles (${listTitles(UNI)}) are for interfaces at any size. <b>Creative</b> styles (${listTitles(CRE)}) shine at 32 px and up: marketing pages, empty states, illustrations.${PLAY.length ? ` <b>Playful</b> styles (${listTitles(PLAY)}) come with their own colours: the outline still follows <code>currentColor</code>, and every extra colour is a CSS variable you can override.` : ''}${STU.length ? ` <b>Studio</b> styles (${listTitles(STU)}) are art-directed, premium looks for heroes, app tiles and brand moments; their colours are role-named variables (<code>--with-luxe-c1</code>, <code>--with-bauhaus-accent</code>…), so one palette recolours every one of them.` : ''}${STORY.length ? ` <b>Storybook</b> styles (${listTitles(STORY)}) are small illustrations: anime cel shading, Gothic cathedral detail, soft pastels, coquette bows and plush felt toys, with role-named colour variables too (<code>--with-anime-c1</code>, <code>--with-plush-accent</code>…).` : ''}</p>
      ${[['universal', UNI], ['creative', CRE], ['playful', PLAY], ['studio', STU], ['storybook', STORY]].filter(([, l]) => l.length).map(([g, list]) => `<h3 class="dv-style-h">${GROUP_LABEL[g]}</h3><div class="dv-styles">${list.map(s => `<div class="dv-style" style="--g:${cvar(s)}" data-reveal><span class="dv-style-ic">${I('camera', s, 44)}</span><b>${plain(s)[0]}</b><code>@withicons/react${s === 'line' ? '' : '/' + s}</code><span class="dv-kind">${g}</span></div>`).join('')}</div>`).join('\n      ')}
    </section>

    ${motionSection()}

    <section id="classes" class="dv-sec">
      <h2>Icon classes</h2>
      <p>The Font Awesome way: plain tags, no build step. The loader fetches only the icons on the page, in any style:</p>
      ${code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-home with-solid"></i>
<i class="with with-trash" role="img" aria-label="Delete"></i>`, 'html')}
      <p>No JavaScript at all? Link one stylesheet per style you use instead. Each holds every icon of that style: <code>with-line.css</code> is about 26 KB gzipped, the richest styles several hundred KB, and <code>with-all.css</code> (every style, about 6 MB gzipped) is for prototypes only.</p>
      ${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-line.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-solid.css">   <!-- for with-solid -->`, 'html')}
      <p>With a bundler, install <code>@withicons/classes</code> and import the same files:</p>
      ${code(`npm i @withicons/classes`, 'bash')}
      ${code(`import '@withicons/classes/with-line.css'   // every line icon
// or only what you use: the base rules, then one file per icon
import '@withicons/classes/with-base.css'
import '@withicons/classes/line/home.css'`, 'js')}
      <h3 id="classes-size">Size</h3>
      <p>An icon is <code>1em</code> square, so it follows the text size. ${SIZE_NOTE} Use one of these instead:</p>
      ${code(`<i class="with with-home" style="font-size: 48px"></i>     <!-- 1. font size: also grows with the text around it -->
<i class="with with-home with-3x"></i>                      <!-- 2. a size class: 3 × the text size (with-xs, with-sm, with-lg, with-2x … with-5x) -->
<i class="with with-home" style="--with-size: 48px"></i>   <!-- 3. an exact size, whatever the text size -->`, 'html')}
      <h3>Modifiers</h3>
      <ul class="dv-mods">${mods.map(([c, d, k]) => `<li data-reveal><span class="dv-mod-demo dm-${k}" aria-hidden="true">${I(modIcon[k], 'line', 24)}</span><code>${c}</code><span>${d}</span></li>`).join('')}</ul>
      <p class="pg-note">Also <code>with-xs</code>, <code>with-sm</code>, <code>with-lg</code>, <code>with-3x</code> to <code>with-5x</code>, <code>with-rotate-180</code>, <code>with-rotate-270</code> and <code>with-flip-both</code>. Spin and pulse switch off for people who prefer reduced motion. For richer motion (a bell that rings, a play button that turns into pause) use <a href="#motion">@withicons/motion</a>.</p>
      <h3>Want real multi-colour? Add the runtime</h3>
      ${code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>`, 'html')}
      <p class="pg-note">The runtime swaps each tag for an inline SVG, downloads only the icons you show and understands aliases (<code>with-bin</code> → trash). Masks are single-colour; the runtime gives you the real duo tint and blueprint accent.</p>
    </section>

    <section id="theming" class="dv-sec">
      <h2>Theming</h2>
      <p>Every icon draws in <code>currentColor</code>, so it follows your text colour, hover states and dark mode for free. Two CSS variables add a second colour:</p>
      <div class="dv-theme" data-theme-play data-reveal>
        <div class="dv-theme-stage" data-theme-stage>
          ${['folder', 'bell', 'shield-check'].map(n => I(n, 'duo', 64)).join('')}
          ${['ruler', 'compass'].map(n => I(n, 'blueprint', 64)).join('')}
        </div>
        <div class="dv-theme-ctl">
          <label><span>color</span><input type="color" value="#111318" data-var="color" data-wikit></label>
          <label><span>--with-duo</span><input type="color" value="#7B5CFF" data-var="--with-duo" data-wikit></label>
          <label><span>--with-accent</span><input type="color" value="#00A3C4" data-var="--with-accent" data-wikit></label>
        </div>
        ${code(`.toolbar { color: #111318; --with-duo: #7B5CFF; --with-accent: #00A3C4; }`, 'css').replace('<div class="code pg-code"', '<div class="code pg-code" data-theme-code')}
      </div>
    </section>

    <section id="aliases" class="dv-sec">
      <h2>Names &amp; aliases</h2>
      <p>Every icon has one canonical kebab-case name plus dozens of aliases and synonyms. Names resolve in tiers, so a wrong guess never silently renders the wrong icon:</p>
      <ol class="dv-tiers">
        <li><b>Exact name</b><span><code>trash</code> → trash</span></li>
        <li><b>Any casing</b><span><code>ArrowRight</code>, <code>arrow_right</code> → arrow-right</span></li>
        <li><b>Alias with one match</b><span><code>bin</code> → trash</span></li>
        <li><b>Ambiguous alias</b><span><code>expand</code> → error listing the candidates</span></li>
        <li><b>Unknown</b><span><code>hoem</code> → error with the nearest names</span></li>
      </ol>
      <div class="dv-resolve" data-resolve data-reveal>
        <label for="resolve-in">Try a name</label>
        <div class="dv-resolve-row"><input id="resolve-in" type="text" value="bin" autocomplete="off" spellcheck="false" data-resolve-in>
          <div class="dv-resolve-chips">${['trash', 'ArrowRight', 'bin', 'expand', 'hoem', 'cog'].map(x => `<button type="button" data-resolve-try="${x}">${x}</button>`).join('')}</div></div>
        <div class="dv-resolve-out" aria-live="polite" data-resolve-out></div>
      </div>
      ${code(`import { resolve, find } from '@withicons/core'

resolve('bin').name   // 'trash'
resolve('expand')     // throws WITH_AMBIGUOUS_ICON, err.candidates
resolve('hoem')       // throws WITH_UNKNOWN_ICON, err.suggestions = ['home', …]
find('hoem')          // null`, 'js')}
    </section>

    <section id="a11y" class="dv-sec">
      <h2>Accessibility</h2>
      <div class="dv-cards">
        <article data-reveal><h3>Decorative by default</h3><p>Without a title, icons render <code>aria-hidden="true"</code>, so screen readers skip them. That’s right for icons next to text.</p></article>
        <article data-reveal><h3>Meaningful when you say so</h3><p>Pass <code>title="Delete"</code> (or <code>label</code> on <code>&lt;with-icon&gt;</code>) and the svg gets <code>role="img"</code> and a <code>&lt;title&gt;</code>.</p></article>
        <article data-reveal><h3>Label the button, not the icon</h3><p>For icon-only buttons, put <code>aria-label</code> on the <code>&lt;button&gt;</code> and keep the icon decorative.</p></article>
        <article data-reveal><h3>Motion-safe</h3><p><code>with-spin</code>, <code>with-pulse</code> and every <a href="#motion">@withicons/motion</a> animation stop under <code>prefers-reduced-motion</code>.</p></article>
      </div>
      ${code(`<button aria-label="Delete file"><Trash /></button>
<Trash title="Delete" />   // standalone, meaningful`, 'jsx')}
    </section>

    <section id="tree-shaking" class="dv-sec">
      <h2>Bundle size</h2>
      <p>Each icon is its own ES module. Import <code>Home</code> and only Home ships: no registry, no runtime, no CSS. The packages have <code>"sideEffects": false</code>, so any modern bundler (Vite, webpack, Rollup, esbuild) drops the rest.</p>
      <div class="dv-bundle" data-reveal aria-hidden="true">
        <div class="dv-bundle-all">${Array.from({ length: 60 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
        <span class="dv-bundle-arrow">→</span>
        <div class="dv-bundle-kept">${['home', 'search', 'settings'].map(n => I(n, 'line', 22)).join('')}</div>
      </div>
    </section>

    <section id="cdn" class="dv-sec">
      <h2>CDN &amp; downloads</h2>
      <p>Not using npm? Everything works from a CDN or as files you copy into your project, and a page downloads only the icons it uses.</p>
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>What</th><th>URL / file</th></tr></thead><tbody>
        <tr><td>One SVG</td><td><code>https://cdn.jsdelivr.net/npm/@withicons/static@latest/dist/svg/&lt;style&gt;/&lt;name&gt;.svg</code></td></tr>
        <tr><td>Web component</td><td><code>https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js</code> · about 7 KB gzipped, then each icon from its own small file</td></tr>
        <tr><td>Icon classes</td><td><code>https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js</code> (only the icons on the page) · zero JS: <code>with-&lt;style&gt;.css</code>, one style per file</td></tr>
        <tr><td>Live icons</td><td><code>https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js</code> · each live icon and style loads on first use</td></tr>
        <tr><td>Sprites (download now)</td><td>${STYLES.filter(s => siteExists(`sprites/${s}.svg`)).map(s => `<a href="sprites/${s}.svg" download>${s}.svg</a>`).join(' · ')}</td></tr>
        <tr><td>Class CSS (download now)</td><td>${STYLES.filter(s => siteExists(`vendor/with/with-${s}.css`)).map(s => `<a href="vendor/with/with-${s}.css" download>with-${s}.css</a>`).join(' · ')}</td></tr>
        <tr><td>Animations</td><td><code>https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css</code> + each icon’s own motion, <code>dist/icons/&lt;name&gt;.css</code> (the element links these for you; <code>icons.css</code> has all of them)${siteExists('vendor/motion/motion.css') ? ` · download <a href="vendor/motion/motion.css" download>motion.css</a>${siteExists('vendor/motion/motion.js') ? ` · <a href="vendor/motion/motion.js" download>motion.js</a>` : ''}` : ''}</td></tr>
        <tr><td>Metadata</td><td><a href="icons.json">icons.json</a> · names, categories, aliases, tags</td></tr>
      </tbody></table></div>
      <p class="pg-note">Pin a version in production (<code>@withicons/web@0.2.0</code>): versioned files are cached for good, by the CDN and the browser. Any single icon can also be copied or downloaded as SVG or PNG from <a href="icons.html">the library</a>.</p>
    </section>

${FORMATS.length ? `    <section id="export" class="dv-sec">
      <h2>Export formats</h2>
      <p>Every icon page exports ${FORMATS.length} formats in the browser, in the chosen style, colours, size and motion. Nothing is uploaded: the converters are plain scripts in <code>site/js/export/</code>.${CLI_FORMATS.length ? ` ${CLI_FORMATS.length} of them also come out of <a href="#cli"><code>withicons export</code></a>, so design teams, app builds and CI get the same files without a browser.` : ''} For a plain-language comparison, see <a href="guides/which-file.html">which file should I use?</a></p>
      ${CLI_FORMATS.length ? code(`npx withicons export home settings --format svg,pdf,png --out icons
npx withicons export star --style sticker --format favicon-pack --background "#ffffff" --out public
npx withicons export bell --format lottie --motion hover
npx withicons export bell --format gif --background "#ffffff" --out slides
npx withicons export rocket --style luxe --format pptx-animated --background "#0f172a"
npx withicons export heart --style retro --palette classic-red --format android,ios --out app/icons
npx withicons export heart --all-styles --format png --size 256 --out hearts
npx withicons export trash --format jsx --out - > src/icons/Trash.jsx`, 'sh', 'Terminal') : ''}
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Format</th><th>File</th><th>Transparent</th>${CLI_FORMATS.length ? '<th>CLI</th>' : ''}<th>What it is</th></tr></thead><tbody>
        ${FMT_GROUPS.flatMap(([g]) => FORMATS.filter(f => f.group === g)).map(f => `<tr><td><code>${esc(f.id)}</code></td><td><code>.${esc(f.ext)}</code></td><td>${f.group === 'code' ? '—' : esc(seeThrough(f)[1].replace('See-through', 'Yes').replace('Solid background', 'No'))}</td>${CLI_FORMATS.length ? `<td>${CLI_FORMATS.includes(f.id) ? 'Yes' : 'Browser only'}</td>` : ''}<td>${esc(f.note)}</td></tr>`).join('\n        ')}
      </tbody></table></div>
      ${CLI_FORMATS.length ? `<p class="pg-note">CLI options: <code>--format</code> (comma separated, or <code>all</code>), <code>--style</code> or <code>--all-styles</code>, <code>--size</code>, <code>--background transparent|#hex</code>, <code>--padding 0–0.4</code>, colours as for <code>get</code> (<code>--palette</code>, <code>--color</code>, <code>--c1</code> … <code>--edge</code>), <code>--motion loop|hover|once|swap|none|&lt;preset&gt;</code> for the animated and code formats (with <code>--to</code>, <code>--effect</code>, <code>--fps</code>, <code>--seconds</code>, <code>--loop</code>, <code>--matte</code>), <code>--out &lt;folder&gt;</code> (<code>-</code> prints one file) and <code>--json</code>. Animated GIF, APNG and the animated PowerPoint slide are rendered frame by frame from the same keyframes as this site, no browser needed: give a GIF the colour of the slide it sits on (<code>--background</code>, or <code>--matte</code> to keep it transparent). PNG-based and animated formats use <code>@resvg/resvg-js</code>, an optional dependency; WebP, JPG, AVIF, animated WebP and video are made in the browser only.</p>` : ''}
    </section>

` : ''}    <section id="cli" class="dv-sec">
      <h2>CLI</h2>
      <p>Search the set, print code and get import lines without leaving your terminal. It works offline: everything ships in the package (<code>withicons</code>, unscoped).</p>
      ${code(`npx withicons search "throw away"
npx withicons get home --style solid --format react
npx withicons add home settings delete --framework react
#   import { Home, Settings, Trash } from '@withicons/react'
npx withicons get trash --size 32 > trash.svg${CLI_FORMATS.length ? '\nnpx withicons export home --format svg,pdf,png --out icons' : ''}`, 'sh', 'Terminal')}
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Command</th><th>What it does</th></tr></thead><tbody>
        <tr><td><code>search &lt;words…&gt;</code></td><td>Ranked icons, typo-tolerant (<code>settigns</code>), synonyms (<code>bin</code>), phrases (<code>recycle bin</code>), plain language (<code>money</code>).</td></tr>
        <tr><td><code>get &lt;name…&gt;</code></td><td>Code for one or more icons; names or aliases (<code>delete</code> → trash).</td></tr>
${CLI_FORMATS.length ? `<tr><td><code>export &lt;name…&gt;</code></td><td>Save files: SVG, PDF, EPS, PNG, ICO, favicon pack, Android, iOS, components, PowerPoint, Word, Lottie. <a href="#export">All export formats</a>.</td></tr>` : ''}
        <tr><td><code>add &lt;name…&gt;</code></td><td>Import line + usage for <code>--framework</code> react (default), vue, svelte, angular, solid, web-component, html-class, svg.</td></tr>
        <tr><td><code>resolve &lt;name&gt;</code></td><td>Does a name or alias map to exactly one icon?</td></tr>
        <tr><td><code>styles</code> · <code>categories [category]</code></td><td>The catalogue.</td></tr>
        <tr><td><code>mcp</code></td><td>Runs the MCP server over stdio (same as <code>npx -y @withicons/mcp</code>).</td></tr>
      </tbody></table></div>
      <p class="pg-note">Options: <code>--style</code>/<code>-s</code>, <code>--format</code>/<code>-f</code> (svg, react, vue, svelte, angular, solid, html-class, web-component, data-uri), <code>--framework</code>/<code>--fw</code>, <code>--size</code>, <code>--color</code>, <code>--limit</code>/<code>-n</code>, <code>--category</code>/<code>-c</code>, and <code>--json</code> for scripts and AI agents (exit code 0 = found, 1 = not found or ambiguous, 2 = usage error).</p>
      <p class="pg-note">Building with an AI assistant? The <a href="ai.html">MCP server, HTTP API and agent skill</a> give it the same search and the real code.</p>
    </section>

    ${askAI({ id: 'ask-dev-h', eyebrow: 'skip the docs', title: 'Let your AI wire it up', cls: 'pg-ask--dev', attrs: 'data-intent="find"',
      text: 'One click copies a brief that points Claude, ChatGPT, Gemini, Perplexity or Grok at our <a href="skill/SKILL.md">agent skill</a> and <a href="llms.txt">llms.txt</a>, then opens it. Describe your stack and the UI you’re building, and it answers with the best-fit icons (real names only), the right style and paste-ready code. On any icon page, the same buttons can code that icon for your stack or build a matching set around it. For coding agents, connect the <a href="ai.html#mcp">MCP server</a> instead.' })}

    <section class="pg-cta" data-reveal>
      <h2>Source &amp; issues</h2>
      <p>with icons is MIT licensed and developed in the open. The repository opens at launch.</p>
      <a class="btn btn-ink" href="${GITHUB}">${I('git-branch', 'line', 18)} <span>github.com/<wbr>withevergrow/<wbr>withicons</span></a>
    </section>
    </div>
  </div>
</div>`
  const ld = [{ '@type': 'TechArticle', headline: 'with icons for developers', description: 'Install and use with icons in React, Vue, Svelte, Angular, Solid, web components, CSS icon classes and plain SVG.', url: ORIGIN + '/' + path, proficiencyLevel: 'Beginner' },
    { '@type': 'SoftwareSourceCode', name: 'with icons', codeRepository: GITHUB, license: 'https://opensource.org/licenses/MIT', programmingLanguage: ['JavaScript', 'TypeScript'] }]
  write(path, page({ path, current: 'developers', title: 'Developers: React, Vue, Svelte, Angular icons and more · with icons', ogTitle: 'with icons for developers', desc: `${N_ICONS} icons × ${N_STYLES} styles for React, Vue, Svelte, Angular, Solid, web components, CSS icon classes and SVG sprites, plus optional animations. Tree-shakable, typed, currentColor, MIT.`, body, ld, crumbsLd: [['Home', ''], ['Developers', path]], bodyClass: 'pg-dev', styles: motionAssets().css, scripts: motionAssets().js }))
}


/* AI coding-tool integrations: site/data/integrations.js (window.WITH_INTEGRATIONS), produced by the integrations agent */
function loadIntegrations() {
  const f = ROOT + '/site/data/integrations.js'
  if (!fs.existsSync(f)) return null
  try {
    const c = { window: {} }; c.self = c.window; vm.createContext(c)
    vm.runInContext(fs.readFileSync(f, 'utf8'), c)
    const list = c.window.WITH_INTEGRATIONS || c.WITH_INTEGRATIONS
    return Array.isArray(list) && list.length ? list : null
  } catch (e) { console.warn('  site-pages: could not read data/integrations.js:', e.message); return null }
}
const siteHas = rel => rel && !/^https?:/.test(rel) && fs.existsSync(ROOT + '/site/' + rel.replace(/^\.?\//, ''))
function integrationsSection() {
  const list = loadIntegrations()
  const head = `<div class="ai-tk-intro">
      <h2 id="tools-h">Add with icons to your AI tool</h2>
      <p>Coding agents work best with the real thing: connect with icons once and your assistant searches by meaning, uses the right package for your stack and never invents an icon name. Pick your tool.</p>
    </div>`
  if (!list) return `<section id="tools" class="ai-sec ai-tools-sec" aria-labelledby="tools-h">
    ${head}
    <div class="ai-int-empty" data-reveal>${I('plug', 'duo', 40)}<div><b>One-click setup guides are on their way.</b><p>Until then, the <a href="#mcp">MCP server</a> below works with Claude Code, Codex, Cursor, VS Code, Windsurf and any client that speaks MCP.</p></div></div>
  </section>`
  const img = (src, cls, size) => `<img class="${cls}" src="${esc(src)}" alt="" width="${size}" height="${size}" decoding="async">`
  const logo = (t, size) => {
    const L = t.logo
    const fallback = `<span class="ai-tk-glyph">${I(t.id === 'windsurf' ? 'wind' : 'code', 'line', Math.round(size * .8))}</span>`
    if (!L) return fallback
    const light = typeof L === 'string' ? L : L.light, dark = typeof L === 'string' ? null : L.dark
    if (!siteHas(light)) return fallback
    return dark && dark !== light && siteHas(dark)
      ? img(light, 'ai-tk-img eg-on-light', size) + img(dark, 'ai-tk-img eg-on-dark', size)
      : img(light, 'ai-tk-img', size)
  }
  // plain step text -> wrap paths, flags, config keys and URLs in <code> so they read (and wrap) as code
  const TOKEN = /^(https?:\/\/\S+|%\w+%\\S*|~?[\w.@-]*\/[\w.\/%~@-]*|\[[\w.]+\]|--[a-z][\w-]*|[\w.-]+\.(?:json|toml|md|zip|txt))$/
  const rich = s => String(s).split(/(\s+)/).map(w => {
    const m = /^([("]*)(.*?)([.,;:)"]*)$/.exec(w), lead = m[1], core = m[2], tail = m[3]
    if (core && TOKEN.test(core) && !/^[A-Za-z]+\/[A-Za-z]+$/.test(core)) return `${esc(lead)}<code${core.length > 18 ? ' class="brk"' : ''}>${esc(core)}</code>${esc(tail)}`
    return esc(w)
  }).join('').replace(/ &gt; /g, ' › ')
  const btns = t => {
    const dl = (t.deeplinks && t.deeplinks.length ? t.deeplinks : t.deeplink ? [t.deeplink] : []).filter(d => d && d.href)
    return dl.map((d, i) => `<a class="btn ${i ? 'btn-ghost' : 'btn-ink'} btn-sm" href="${esc(d.href)}" rel="noopener">${i ? '' : I('zap', 'solid', 16)}${esc(d.label || 'Add to ' + t.name)}</a>`).join('')
  }
  const wrapCode = (src, lang, label) => code(src, lang, label).replace('class="code pg-code"', 'class="code pg-code pg-code--wrap"')
  const snip = (src, lang, label) => (/\n/.test(src) || src.length < 64 || lang !== 'text') ? code(src, lang, label) : wrapCode(src, lang, label)
  const mcpBlocks = t => [t.mcp && t.mcp.snippet && [t.mcp, 'Remote · recommended'], t.mcpLocal && t.mcpLocal.snippet && [t.mcpLocal, 'Local · npx']].filter(x => x && !(t.steps || []).some(st => st.code === x[0].snippet))
    .map(([m, k]) => `<div class="ai-tp-file"><p class="ai-tp-k">${k}</p>${code(m.snippet, m.lang || 'json', m.path || m.lang || 'json')}</div>`).join('')
  const panel = (t, i) => {
    let usedMcp = false, usedSkill = false
    const steps = (t.steps || []).map(st => {
      let extra = ''
      if (/^one click/i.test(st.title || '') && btns(t)) extra = `<div class="ai-tp-actions">${btns(t)}</div>`
      if (!st.code && /^or edit/i.test(st.title || '') && mcpBlocks(t)) { extra = `<div class="ai-tp-files">${mcpBlocks(t)}</div>`; usedMcp = true }
      if (!st.code && /note below/i.test(st.text || '') && t.skill && t.skill.snippet) { extra = wrapCode(t.skill.snippet, 'text', 'Project knowledge'); usedSkill = true }
      const fast = t.oneLiner && st.code === t.oneLiner
      return `<li><h4>${esc(st.title || '')}${fast ? ` <span class="ai-tp-fast">${I('zap', 'solid', 12)} fastest</span>` : ''}</h4>${st.text ? `<p>${rich(st.text)}</p>` : ''}${st.code ? snip(st.code, st.lang || 'sh', st.lang === 'text' ? (/^https?:/.test(st.code) ? 'URL' : 'Text') : 'Terminal') : ''}${extra}</li>`
    }).join('')
    const files = !usedMcp && mcpBlocks(t)
    const skillSnip = !usedSkill && t.skill && t.skill.snippet
    const facts = [
      t.mcp && t.mcp.path ? ['MCP server', t.mcp.path] : t.mcpLocal && t.mcpLocal.path ? ['MCP server', t.mcpLocal.path] : null,
      t.skill && t.skill.path && !/^https?:/.test(t.skill.path) ? ['Agent skill', t.skill.path] : null,
    ].filter(Boolean)
    const host = s => { try { return new URL(s).hostname.replace(/^www\./, '') } catch { return s } }
    return `<div class="ai-tp" role="tabpanel" id="tool-${esc(t.id)}" aria-labelledby="tk-${esc(t.id)}" tabindex="-1"${i ? ' data-off' : ''}>
      <div class="ai-tp-aside">
        <div class="ai-tp-head"><span class="ai-tp-mark" aria-hidden="true">${logo(t, 34)}</span><h3>${esc(t.name || t.id)}</h3></div>
        ${t.blurb ? `<p class="ai-tp-blurb">${rich(t.blurb)}</p>` : ''}
        ${!(t.steps || []).some(st => /^one click/i.test(st.title || '')) && btns(t) ? `<div class="ai-tp-actions">${btns(t)}</div>` : ''}
        ${facts.length ? `<dl class="ai-tp-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd><code>${esc(v)}</code></dd></div>`).join('')}</dl>` : ''}
        <p class="ai-tp-meta">${t.verified ? `${I('check', 'line', 14)} Checked against ${t.docs ? `<a href="${esc(t.docs)}" rel="noopener">${esc(host(t.docs))}</a>` : 'the official docs'} on ${esc(t.verified)}` : t.docs ? `<a href="${esc(t.docs)}" rel="noopener">${esc(t.name)} docs</a>` : ''}</p>
      </div>
      <div class="ai-tp-body">
        <p class="ai-tp-k">Step by step</p>
        <ol class="ai-tp-steps">${steps}</ol>
        ${files || skillSnip ? `<details class="ai-tp-more"><summary>Prefer to edit the config yourself?</summary><div class="ai-tp-files">${files || ''}${skillSnip ? `<div class="ai-tp-file"><p class="ai-tp-k">Agent skill</p>${wrapCode(t.skill.snippet, 'text', 'Text')}</div>` : ''}</div></details>` : ''}
      </div>
    </div>`
  }
  return `<section id="tools" class="ai-sec ai-tools-sec" aria-labelledby="tools-h">
    ${head}
    <div class="ai-tk" data-tabs data-tabs-hash>
      <div class="ai-tk-list" role="tablist" aria-label="AI tool">${list.map((t, i) => `<button type="button" role="tab" id="tk-${esc(t.id)}" aria-controls="tool-${esc(t.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="ai-tk-logo" aria-hidden="true">${logo(t, 22)}</span><span class="ai-tk-name">${esc(t.name || t.id)}</span></button>`).join('')}</div>
      ${list.map(panel).join('\n      ')}
    </div>
  </section>`
}

/* ───────────────────────── AI ───────────────────────── */
async function ai() {
  const path = 'ai.html'
  const local = { mcpServers: { withicons: { command: 'npx', args: ['-y', '@withicons/mcp'] } } }
  const winNote = `<p class="pg-note">On Windows, if <code>npx</code> isn’t found, use <code>"command": "cmd", "args": ["/c", "npx", "-y", "@withicons/mcp"]</code>.</p>`
  const fmts = 'svg | react | vue | svelte | angular | solid | html-class | web-component | data-uri'
  const tools = [
    ['search_icons', '{ query, limit?, style?, category?, format? }', 'Find icons by meaning: “throw away” finds trash. Ranked and typo-tolerant. Each result comes with why it matched, a ready-to-paste snippet (React unless you pass <code>format</code>) and a link. Default limit: 10.'],
    ['get_icon', `{ name, style?, format?, size?, color? }`, `One icon as paste-ready code. <code>name</code> can be an alias (“delete” → trash). <code>format</code>: ${fmts} (default svg). <code>color</code> replaces currentColor in svg and data-uri.`],
    ['animate_icon', '{ name, trigger?, preset?, to?, effect?, style?, format? }', 'Paste-ready animation code for the optional <code>@withicons/motion</code> package: <code>loop</code>, <code>hover</code>, <code>once</code>, <code>inview</code> or <code>swap</code> (play turns into pause), in HTML, React, Vue, Svelte, Solid, Angular or a web component.'],
    ['export_icon', '{ name, style?, format?, size?, background?, palette?, motion?, out_dir? }', 'Files, not code: SVG, PNG, PDF, PowerPoint, Word, favicons, app assets, Lottie, and animated GIF, APNG, SVG or a PowerPoint slide with the moving icon, for slides and docs. The local server (<code>npx -y @withicons/mcp</code>) saves them to <code>out_dir</code> or returns them inline; the remote one makes the vector files and answers the rest with the exact <code>npx withicons export</code> command.'],
    ['resolve_icon', '{ name }', 'Check a guess: <code>resolved</code> (with the alias it came through), <code>ambiguous</code> (with candidates) or <code>unknown</code> (with the nearest names).'],
    ['list_styles', '{}', `The ${N_STYLES} styles, which are universal, creative or playful, and what each looks like.`],
    ['list_categories', '{ category? }', 'Every category with icon counts, or, with <code>category</code>, every icon in that category.'],
  ]
  const L = await import(pathToFileURL(ROOT + '/packages/mcp/dist/lib.mjs').href)
  const apiSearch = L.searchIcons({ query: 'throw away', limit: 2 })
  const apiIcon = L.getIcon({ name: 'delete', style: 'solid', format: 'react' })
  const apiResolve = L.resolveIcon('expand')
  const files = [
    ['llms.txt', 'llms.txt', 'A short map of the project for language models: what it is, install lines, canonical imports, links.', 'file-text'],
    ['llms-full.txt', 'llms-full.txt', 'Everything in one file: every icon with its description, aliases and tags. Paste it into any chat.', 'files'],
    ['icons.json', 'icons.json', `Machine-readable metadata for all ${N_ICONS} icons: names, categories, aliases, tags, styles.`, 'braces'],
  ]
  const body = `
<div class="ai">
  <section class="ai-hero pg-hero">
    ${crumbs([['Home', 'index.html'], ['For AI', null]])}
    <div class="ai-hero-grid">
      <div class="ai-hero-copy">
        <p class="pg-eyebrow"><span class="hand">no setup, no code</span></p>
        <h1 class="pg-title">Ask your <span class="pg-hl" style="--g:${cvar('duo')}">AI</span> for the right icon.</h1>
        <p class="pg-lede">Say what the icon is for, then click <b>Claude</b>, <b>ChatGPT</b>, <b>Gemini</b>, <b>Perplexity</b> or <b>Grok</b>. We copy a ready brief that points it to our <a href="skill/SKILL.md">skill file</a> and open it for you. It comes back with the best-fit icon, two alternatives, the right style and code or steps for your app.</p>
      </div>
      <div class="ai-chat" aria-hidden="true" data-chat>
        <div class="ai-msg ai-msg--user">I need an icon for “throw away” on my slide</div>
        <div class="ai-msg ai-msg--tool"><span>${I('search', 'line', 14)} withicons.com</span><code>search “throw away”</code></div>
        <div class="ai-msg ai-msg--tool ok"><span>${I('check', 'line', 14)} trash</span><code>also called bin, delete</code></div>
        <div class="ai-msg ai-msg--agent"><span class="ai-btn-demo">${I('trash', 'duo', 18)} Trash</span> Use <b>trash</b> in the Duo style. Open its page, press Copy image, then paste it onto your slide.</div>
      </div>
    </div>
    <div class="ai-ask-hero" data-reveal>
      <ol class="ai-ask-steps">
        <li><b>1</b><span>Say what the icon is for</span></li>
        <li><b>2</b><span>Pick your assistant</span></li>
        <li><b>3</b><span>We copy a brief and open it</span></li>
      </ol>
      <label class="ai-need"><span class="ai-need-l">What’s the icon for? <small>optional — or tell the assistant later</small></span><input class="ai-need-in" id="ai-need" type="text" maxlength="300" autocomplete="off" placeholder="e.g. a button that clears the cart in my grocery app"></label>
      <div class="ai-ask-widget" data-ask-ai data-intent="find" data-ask-bind="#ai-need"><noscript><p class="pg-note">Turn on JavaScript for one-click buttons, or paste <a href="llms.txt">withicons.com/llms.txt</a> into your assistant.</p></noscript></div>
      <p class="pg-note ai-ask-note">The assistant opens in a new tab, searches with icons and replies with the best fit and how to use it. Nothing is sent to us: the prompt only tells your assistant where to read about with icons (<a href="llms.txt">llms.txt</a> and the <a href="skill/SKILL.md">skill</a>). Gemini can’t pre-fill the message: paste it with Ctrl+V (⌘V on a Mac).</p>
    </div>
  </section>

  <section id="tasks" class="ai-sec ai-tasks" aria-labelledby="tasks-h">
    <h2 id="tasks-h">Five things to ask</h2>
    <p>Every brief starts by sending the assistant to our <a href="skill/SKILL.md">skill file</a>, so it searches the real library and never invents icon names. You pick the job; we write the brief.</p>
    <ol class="ai-task-list">
      ${[
        ['search', 'Find the right icon', 'Next to every search box, and here', '“a button that clears the cart in my grocery app”', 'The best fit with a one-line reason, up to two alternatives, the right style for where it goes, and code or steps for your app.'],
        ['code', 'Code it for my app', 'On every icon page', '“the delete button in my React table”', 'Paste-ready code for your stack, the size and colour, the exact aria-label and tooltip text, and hover, focus, active and disabled states.'],
        ['layout-grid', 'Build a matching set', 'On every icon page', '“the toolbar of my notes app”', 'The 4 to 8 icons that belong next to this one, all in one style and size, with why each is there and anything the library doesn’t cover.'],
        ['help-circle', 'Is this the right icon?', 'On every icon page', '“remove item, for shoppers in Japan”', 'An honest verdict, what people will actually read it as, cultural or ambiguity issues, and better options from the library if there are any.'],
        ['monitor', 'Use it in my slides or doc', 'On every icon page and app guide', '“a pricing slide in Google Slides”', 'Which file to grab (copy image, SVG or PNG and what size), how to insert, recolour and resize it in your app, layout tips, and the matching step-by-step guide.'],
      ].map(([ic, t, where, ex, get], i) => `<li class="ai-task" data-reveal style="--i:${i}">
        <span class="ai-task-ic" aria-hidden="true">${I(ic, 'duo', 26)}</span>
        <div><h3>${t}</h3><p class="ai-task-where">${where}</p><p class="ai-task-ex"><span>You type</span>${ex}</p><p>${get}</p></div>
      </li>`).join('\n      ')}
    </ol>
  </section>

  <div class="ai-split" role="separator" aria-hidden="true"><span>For developers &amp; AI agents</span></div>

  ${integrationsSection()}

  <section id="demo" class="ai-sec ai-demo" aria-labelledby="demo-h">
    <h2 id="demo-h">See what your agent gets back</h2>
    <p>This runs the same search engine as the MCP server, right here in your browser, and shows the same JSON the tool returns. Type what an agent might ask for.</p>
    <div class="ai-demo-box" data-ai-demo>
      <div class="ai-demo-in">
        <div class="ai-demo-tools" role="group" aria-label="Tool">
          <button type="button" data-ai-tool="search_icons" aria-pressed="true">search_icons</button>
          <button type="button" data-ai-tool="resolve_icon" aria-pressed="false">resolve_icon</button>
        </div>
        <label class="pg-sr" for="ai-q">Query</label>
        <input id="ai-q" type="text" value="throw away" autocomplete="off" spellcheck="false" data-ai-q>
        <div class="ai-demo-tries">${['throw away', 'settings', 'money', 'go home', 'bin', 'hoem', 'expand', 'rainy day'].map(x => `<button type="button" data-ai-try="${x}">${x}</button>`).join('')}</div>
        <div class="ai-demo-found"><span class="ai-demo-label">What it found</span><div class="ai-demo-icons" data-ai-icons aria-hidden="true"></div></div>
      </div>
      <div class="ai-demo-out">
        <div class="ai-demo-call"><span class="ai-demo-label">Tool call</span><pre data-ai-call></pre></div>
        <div class="ai-demo-res"><span class="ai-demo-label">Response <span data-ai-ms></span></span><pre data-ai-res aria-live="polite"></pre></div>
      </div>
    </div>
  </section>

  <section id="mcp" class="ai-sec" aria-labelledby="mcp-h">
    <h2 id="mcp-h">The MCP server</h2>
    <p>The <a href="https://modelcontextprotocol.io">Model Context Protocol</a> lets AI apps use tools. Add with icons once and your assistant can search, resolve and fetch icons on its own.</p>
    <div class="ai-mcp-run">
      <div>${code('https://withicons.com/mcp', 'text', 'Remote · Streamable HTTP')}</div>
      <div>${code('npx -y @withicons/mcp', 'sh', 'Local · stdio')}</div>
    </div>
    <h3>Add it to your app</h3>
    <p>Exact, checked setup for Claude Code, Codex, Cursor, OpenCode, Lovable, Claude Desktop, VS Code and Windsurf is in <a href="#tools">Add with icons to your AI tool</a> above. Any other client that speaks MCP: give it the remote URL, or this local config.</p>
    ${code(JSON.stringify(local, null, 2), 'json', 'mcp.json')}
    ${winNote}
    <h3>Tools</h3>
    <ul class="ai-tools">${tools.map(([n, a, d], i) => `<li data-reveal style="--i:${i}"><code class="ai-tool-name">${n}</code><code class="ai-tool-args">${esc(a)}</code><p>${d}</p></li>`).join('')}</ul>
    <h3>Resources</h3>
    <p>Clients that read MCP resources can open any icon directly: <code>icon://&lt;style&gt;/&lt;name&gt;.svg</code> (for example <code>icon://solid/home.svg</code>), plus <code>icon://about</code> for an overview. Everything is bundled: no network, no API key.</p>
    <h3>Example: get_icon</h3>
    ${code(JSON.stringify({ tool: 'get_icon', arguments: { name: 'delete', style: 'solid', format: 'react' } }, null, 2), 'json', 'Tool call')}
    ${code(JSON.stringify(apiIcon, null, 2), 'json', 'Response')}
  </section>

  <section id="skill" class="ai-sec ai-skill" aria-labelledby="skill-h">
    <div class="ai-skill-art" aria-hidden="true">${I('graduation-cap', 'duo', 72)}</div>
    <div>
      <h2 id="skill-h">The agent skill</h2>
      <p>A skill is a short instruction file an agent reads before it starts. Ours teaches it how to use with icons well: search by meaning, pick one style per product, use the right package for the framework, add labels for accessibility, and never invent icon names.</p>
      <p><a class="btn btn-ink" href="skill/SKILL.md">${I('file-text', 'line', 18)} Read SKILL.md</a></p>
      <p class="pg-note">Drop the folder into your agent’s skills directory (for Claude Code: <code>.claude/skills/with-icons/</code>).</p>
    </div>
  </section>

  <section id="files" class="ai-sec" aria-labelledby="files-h">
    <h2 id="files-h">Files for language models</h2>
    <p>No tools? Give your model these files. They’re plain text and JSON, updated with every release.</p>
    <div class="ai-files">${files.map(([n, h, d, ic], i) => `<a class="ai-file" href="${h}" data-reveal style="--g:${cvar(STYLES[i * 2])}">${I(ic, 'line', 30)}<code>/${n}</code><span>${d}</span></a>`).join('')}</div>
  </section>

  <section id="api" class="ai-sec" aria-labelledby="api-h">
    <h2 id="api-h">HTTP API</h2>
    <p>The same tools over plain HTTP GET, handy for scripts, bots and no-code tools. Responses are JSON, the same as the MCP tools return.</p>
    <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Route</th><th>Same as</th></tr></thead><tbody>
      <tr><td><code>/api/search?q=&amp;limit=&amp;style=&amp;category=&amp;format=</code></td><td><code>search_icons</code></td></tr>
      <tr><td><code>/api/icon/&lt;name&gt;?style=&amp;format=&amp;size=&amp;color=</code></td><td><code>get_icon</code>. Add <code>&amp;raw=1</code> for just the code, or use <code>/api/icon/&lt;name&gt;.svg</code> for an SVG image.</td></tr>
      <tr><td><code>/api/resolve/&lt;name&gt;</code></td><td><code>resolve_icon</code></td></tr>
      <tr><td><code>/api/styles</code></td><td><code>list_styles</code></td></tr>
      <tr><td><code>/api/categories</code>, <code>/api/categories/&lt;category&gt;</code></td><td><code>list_categories</code></td></tr>
    </tbody></table></div>
    ${code('curl "https://withicons.com/api/search?q=throw%20away&limit=2"', 'sh', 'Request')}
    ${code(JSON.stringify(apiSearch, null, 2), 'json', 'Response')}
    ${code('curl "https://withicons.com/api/resolve/expand"', 'sh', 'Request')}
    ${code(JSON.stringify(apiResolve, null, 2), 'json', 'Response')}
  </section>

  <section id="cli" class="ai-sec" aria-labelledby="cli-h">
    <h2 id="cli-h">From the terminal</h2>
    <p>Agents that run shell commands can use the CLI. Add <code>--json</code> for stable, machine-readable output (exit code 0 = found, 1 = not found or ambiguous, 2 = usage error).</p>
    ${code(`npx withicons search "throw away" --json
npx withicons get trash --style solid --format react
npx withicons resolve bin --json`, 'sh', 'Terminal')}
    <p class="pg-note">All commands and options are on the <a href="developers.html#cli">developer page</a>.</p>
  </section>

  <section class="ai-sec ai-prompts" aria-labelledby="prompts-h">
    <h2 id="prompts-h">Ask like this</h2>
    <p>Once the server is connected, just talk normally:</p>
    <ul class="ai-prompt-list">${['Use with icons for all the icons in this app.', 'Add a settings icon in the duo style to the sidebar.', 'Find an icon that means “save for later”.', 'Swap every icon on this page to the solid style.', 'Make the bell icon ring when a new notification arrives.', 'Turn the play button into pause with a flip when it’s clicked.'].map(p => `<li data-reveal><button type="button" data-copy-btn data-copy="${esc(p)}">${COPY_ICON}<span class="ai-p-copy">Copy</span><q>${esc(p)}</q></button></li>`).join('')}</ul>
  </section>
</div>`
  const ld = [{ '@type': 'TechArticle', headline: 'with icons for AI agents: MCP server, skill, llms.txt', description: 'Connect AI assistants to with icons through the MCP server, an agent skill, llms.txt, icons.json and a search API.', url: ORIGIN + '/' + path }]
  write(path, page({ path, current: 'ai', title: 'Ask your AI for icons: Claude, ChatGPT, Gemini, MCP and llms.txt · with icons', ogTitle: 'with icons — ask your AI', desc: `One click sends Claude, ChatGPT, Gemini, Perplexity or Grok a prompt that teaches it to find and use ${num(N_TOTAL)} free icons.` + ' Plus an MCP server, agent skill, llms.txt and a search API.', body, ld, crumbsLd: [['Home', ''], ['For AI', path]], bodyClass: 'pg-ai', scripts: [] }))
}

/* ───────────────────────── about ───────────────────────── */
function about() {
  const path = 'about.html'
  const terms = (() => {
    const c = {}; c.window = c; vm.createContext(c)
    vm.runInContext(fs.readFileSync(ROOT + '/site/data/search-index.js', 'utf8'), c)
    return c.WITH_SEARCH_INDEX.icons.reduce((n, ic) => n + 1 + [2, 3, 4].reduce((m, k) => m + (ic[k] ? String(ic[k]).split('|').length : 0), 0), 0)
  })()
  const hero = 'heart'
  const story = 'rocket'
  const people = [
    ['monitor', 'line', 'Making slides', 'A clean icon says more than a paragraph. Drop them into Slides, PowerPoint or Keynote.'],
    ['globe', 'solid', 'Building a website', 'WordPress, Webflow, Wix or plain HTML. Copy, paste, publish.'],
    ['pen-tool', 'duo', 'Designing things', 'Posters, social posts, apps. Paste vectors straight into Figma or Canva.'],
    ['graduation-cap', 'gloss', 'Teaching or studying', 'Worksheets, projects and presentations that look the part, for free.'],
    ['code', 'blueprint', 'Writing code', 'Typed packages for every framework, with the same names everywhere.'],
    ['bot', 'sketch', 'An AI agent', 'Hello! Search by meaning and get the real SVG. No guessing.'],
  ]
  const matrixIcons = ['home', 'bell', 'camera', 'heart', 'star']
  const body = `
<div class="ab">
  <section class="ab-hero">
    ${crumbs([['Home', 'index.html'], ['About', null]])}
    <div class="ab-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">our story</span></p>
        <h1 class="ab-title">Good icons should be <span class="ab-free">free<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M6 30 C 50 12, 120 10, 194 22"/></svg></span>.</h1>
        <p class="ab-lede"><span class="hand ab-so">so we drew ${N_ICONS} of them</span> and made each one in ${word(N_STYLES)} styles. Then we taught them to move. No account, no catch, no credit needed.</p>
      </div>
      <div class="ab-morph" data-morph aria-hidden="true">
        <div class="ab-morph-ring"></div>
        ${STYLES.map((s, i) => `<span class="ab-mf${i === 0 ? ' is-on' : ''}" style="--g:${cvar(s)}" data-style="${plain(s)[0]}">${I(hero, s, 180)}</span>`).join('')}
        <span class="ab-morph-tag" data-morph-tag>Line</span>
      </div>
    </div>
  </section>

  <section class="ab-why" aria-labelledby="why-h">
    <div class="ab-why-art" aria-hidden="true" data-reveal>
      <span class="ab-tag">${I('tag', 'solid', 96)}<b>$0</b></span>
    </div>
    <div>
      <h2 id="why-h" class="ab-h">Why free?</h2>
      <p data-reveal>Icons are tiny, but they’re everywhere: on buttons, slides, menus, posters and signs. Good ones are often hidden behind paywalls and sign-ups, or come in just one look.</p>
      <p data-reveal>We think the basics should be free for everyone. A teacher’s slides. A student’s project. A small shop’s first website. A startup’s app. So every icon here is free to use for anything, including work you get paid for, under the MIT licence.</p>
      <p data-reveal><a href="license.html">What the licence means, in plain words →</a></p>
    </div>
  </section>

  <section class="ab-who" aria-labelledby="who-h">
    <h2 id="who-h" class="ab-h">Who it’s for</h2>
    <p class="ab-sub">If you’re…</p>
    <ul class="ab-people">${people.map(([ic, s, t, d], i) => `<li data-reveal style="--g:${cvar(s)};--i:${i}"><span class="ab-person-ic">${I(ic, s, 40)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
  </section>

  <section class="ab-seven" aria-labelledby="seven-h" data-scrolly>
    <div class="ab-seven-head">
      <h2 id="seven-h" class="ab-h">Drawn once.<br>Rendered ${word(N_STYLES)} ways.</h2>
      <p class="ab-sub">Every icon starts as one careful drawing on a 24 × 24 grid. Then ${word(N_STYLES)} “renderers” turn that same drawing into ${word(N_STYLES)} styles: clean ones for apps, crafted ones for posters, and playful ones full of colour. Scroll to watch.</p>
    </div>
    <div class="ab-seven-grid">
      <div class="ab-seven-stage" aria-hidden="true">
        <div class="ab-seven-card">
          <div class="ab-grid24"></div>
          <span class="ab-sf ab-sf-skel is-on" data-sf="0">${icon(story, 'line', { size: 220, cls: 'ab-draw', sw: 0.8 }).replace(/<path /g, '<path pathLength="1" ')}</span>
          ${STYLES.map((s, i) => `<span class="ab-sf" data-sf="${i + 1}" style="--g:${cvar(s)}">${I(story, s, 220)}</span>`).join('')}
          <span class="ab-seven-label" data-sf-label>The drawing</span>
        </div>
      </div>
      <ol class="ab-seven-steps">
        <li data-sstep="0"><span class="ab-step-k">The drawing</span><h3>One skeleton</h3><p>Lines, curves and points on a 24 × 24 grid, drawn by hand and checked for balance: every icon looks the same size as its neighbours.</p></li>
        ${STYLES.map((s, i) => `<li data-sstep="${i + 1}" style="--g:${cvar(s)}"><span class="ab-step-k">${GROUP_LABEL[groupOf(s)]} · ${i + 1} of ${N_STYLES}</span><h3>${plain(s)[0]}</h3><p>${plain(s)[1]}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="ab-matrix" aria-labelledby="matrix-h">
    <h2 id="matrix-h" class="ab-h">Same name. Same grid. Same size.</h2>
    <p class="ab-sub">Because every style comes from the same drawing, you can switch styles any time and nothing moves.</p>
    <div class="ab-matrix-grid" data-reveal role="img" aria-label="Five icons shown in all ${word(N_STYLES)} styles" style="--cols:${N_STYLES}">
      ${STYLES.map((s, c) => `<div class="ab-col" style="--g:${cvar(s)};--c:${c}"><span class="ab-col-h">${plain(s)[0]}</span>${matrixIcons.map(n => I(n, s, 40)).join('')}</div>`).join('')}
    </div>
  </section>

  <section class="ab-numbers" aria-label="with icons in numbers">
    <ul>
      <li data-reveal><b data-count="${N_ICONS}">${num(N_ICONS)}</b><span>icons</span></li>
      <li data-reveal><b data-count="${N_STYLES}">${N_STYLES}</b><span>styles</span></li>
      <li data-reveal><b data-count="${N_TOTAL}">${num(N_TOTAL)}</b><span>SVG files</span></li>
      <li data-reveal><b data-count="${PRESETS.length}">${PRESETS.length}</b><span>ways to move</span></li>
      <li data-reveal><b data-count="${terms}">${terms.toLocaleString('en')}</b><span>words to search by</span></li>
      <li data-reveal><b>$0</b><span>forever</span></li>
    </ul>
  </section>

${aboutMotion()}

  <section class="ab-evergrow" aria-labelledby="eg-h">
    <div class="ab-eg-mark" aria-hidden="true">${I('leaf', 'engrave', 120)}</div>
    <div>
      <p class="pg-eyebrow"><span class="hand">powered by</span></p>
      <h2 id="eg-h">Evergrow</h2>
      <p>with icons is made and looked after by Evergrow. We build it in the open and give it away, because good tools should be within everyone’s reach.</p>
      <a class="btn btn-sun" href="https://withevergrow.com">Visit Evergrow →</a>
    </div>
  </section>

  <section class="pg-cta" data-reveal>
    <h2>Go make something.</h2>
    <p>Find an icon, copy it, done. <a href="guides/index.html">Need help? Start here.</a></p>
    <a class="btn btn-ink" href="icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`
  const ld = [{ '@type': 'AboutPage', name: 'About with icons', url: ORIGIN + '/' + path, description: `Why with icons is free, who it is for, and how every icon is drawn once and rendered in ${word(N_STYLES)} styles.`, publisher: { '@type': 'Organization', name: 'Evergrow', url: 'https://withevergrow.com' } }]
  write(path, page({ path, current: 'about', title: `About with icons: free icons, drawn once, rendered ${word(N_STYLES)} ways`, ogTitle: 'About with icons', desc: `The story of with icons: ${N_ICONS} free icons drawn once and rendered in ${word(N_STYLES)} styles, with optional animations, for slides, websites, apps and AI. Free under MIT. Powered by Evergrow.`, body, ld, crumbsLd: [['Home', ''], ['About', path]], bodyClass: 'pg-about', styles: motionAssets().css, scripts: motionAssets().js }))
}

/** "And now they move": a short band of looping icons on the about page. */
function aboutMotion() {
  const picks = ['bell', 'heart', 'star', 'rocket', 'cloud', 'loader', 'sun', 'lightbulb'].filter(n => MOTION[n] && MOTION[n].loop)
  if (!picks.length) return ''
  const st = ['duo', 'kawaii', 'solid', 'sticker', 'line', 'glass', 'gloss', 'retro'].map(s => hasStyle(s) ? s : 'line')
  return `<section class="ab-move" aria-labelledby="move-h">
    <div class="ab-move-art" aria-hidden="true">${picks.map((n, i) => { const s = st[i % st.length], m = MOTION[n].loop; return `<span class="ab-move-ic" style="--g:${cvar(s)};--i:${i}"><span class="wm wm-loop wm-p-${m.preset}" data-wm-preset="${m.preset}" style="${motionVars(m)}">${I(n, s, 48)}</span></span>` }).join('')}</div>
    <div>
      <p class="pg-eyebrow"><span class="hand">and now they move</span></p>
      <h2 id="move-h" class="ab-h">Icons with a little life in them</h2>
      <p>A bell that rings. A heart that beats. A play button that flips into pause. Every icon has its own gentle animation, plus ${PRESETS.length} more to choose from, in every style. Download them as animated SVGs or GIFs, or add them in code. They stay still for anyone who prefers less motion.</p>
      <p><a href="guides/animate-icons.html">Animate an icon, no code needed →</a> · <a href="free/animated-icons.html">Free animated icons</a></p>
    </div>
  </section>`
}

/* ───────────────────────── license ───────────────────────── */
function license() {
  const path = 'license.html'
  let text = fs.readFileSync(ROOT + '/packages/react/LICENSE', 'utf8').trim()
  const qa = [
    ['yes', 'Can I use them in work I get paid for?', 'Yes. Client projects, products, ads, apps, books, merch: all fine.'],
    ['no', 'Do I have to credit you?', 'No. Using icons in a slide, website, app, poster or video needs no credit. A mention is always lovely, never required.'],
    ['yes', 'Can I change them?', 'Yes. Recolour, resize, combine, redraw. They’re yours to edit.'],
    ['careful', 'Can I use one in my logo?', 'Yes, but think twice: anyone else can use the same icon, so it won’t be unique to you and may be hard to trademark. Use it as a starting point and make it your own.'],
    ['yes', 'Can I put them in something I sell?', 'Yes: templates, themes, apps, slide decks and print designs are fine.'],
    ['careful', 'Can I resell the icons themselves?', 'The licence allows it, as long as the licence text goes with the files. But anyone can get them free here, so it’s rarely worth it.'],
    ['yes', 'Can I use them in apps built with AI?', 'Yes. The same rules apply however the work gets made.'],
    ['yes', 'Are the animations and playful styles free too?', `Yes. All ${word(N_STYLES)} styles${PLAY.length || STU.length || STORY.length ? `, including ${listTitles([...PLAY, ...STU, ...STORY])},` : ''} and every animation (animated SVGs, GIFs and the motion package) come under the same MIT licence.`],
  ]
  const badge = { yes: ['Yes', 'check-circle'], no: ['No', 'x-circle'], careful: ['Yes, but…', 'alert-circle'] }
  const body = `
<div class="lc">
  <section class="pg-hero lc-hero">
    ${crumbs([['Home', 'index.html'], ['License', null]])}
    <p class="pg-eyebrow"><span class="hand">the MIT licence, in plain words</span></p>
    <h1 class="pg-title">Free for everything.<br><span class="pg-hl" style="--g:${cvar('sketch')}">Really.</span></h1>
    <p class="pg-lede">Every with icons icon, in all ${word(N_STYLES)} styles and with every animation, is released under the MIT licence: one of the simplest, most open licences there is. Here’s what it means for you.</p>
  </section>

  <section class="lc-qa" aria-label="Common questions">
    ${qa.map(([k, q, a], i) => `<article class="lc-card lc-${k}" data-reveal style="--i:${i}"><span class="lc-badge">${I(badge[k][1], 'solid', 18)}${badge[k][0]}</span><h2>${q}</h2><p>${a}</p></article>`).join('\n    ')}
  </section>

  <section class="lc-one" data-reveal aria-labelledby="one-h">
    <div class="lc-one-ic" aria-hidden="true">${I('file-text', 'duo', 56)}</div>
    <div>
      <h2 id="one-h">The one rule</h2>
      <p>If you pass on the icon <em>files or code themselves</em> (for example, you publish your own icon pack or a package that contains them), include the licence text below with them. That’s it.</p>
      <p class="pg-note">The licence covers the icons and code. It doesn’t cover the with icons or Evergrow names and logos. This page is a friendly summary, not legal advice; the licence text is what counts.</p>
    </div>
  </section>

  <section class="lc-full" aria-labelledby="full-h">
    <div class="lc-full-head"><h2 id="full-h">The full licence</h2><button class="btn btn-ghost" type="button" data-copy-btn data-copy="${esc(text)}">${COPY_ICON}<span>Copy licence</span></button></div>
    <div class="lc-text" id="license-text">${text.split(/\n\s*\n/).map(p => `<p>${esc(p.replace(/\s*\n\s*/g, ' '))}</p>`).join('')}</div>
  </section>

  <section class="pg-cta" data-reveal>
    <h2>Questions?</h2>
    <p>The <a href="faq.html">FAQ</a> covers the common ones. For anything else, open an issue on <a href="${GITHUB}">GitHub</a> (opening at launch).</p>
    <a class="btn btn-ink" href="icons.html">${I('search', 'line', 18)} Browse icons</a>
  </section>
</div>`
  const ld = [{ '@type': 'WebPage', name: 'with icons licence (MIT)', url: ORIGIN + '/' + path, description: 'The MIT licence explained in plain words.', license: 'https://opensource.org/licenses/MIT' }]
  write(path, page({ path, current: '', title: 'License: free for commercial use, no credit needed (MIT) · with icons', ogTitle: 'with icons licence, in plain words', desc: 'with icons is MIT licensed: free for personal and commercial use, no credit required, edit freely. Plain-English answers about logos, reselling and attribution, plus the full licence.', body, ld, crumbsLd: [['Home', ''], ['License', path]], bodyClass: 'pg-license' }))
}

/* ───────────────────────── FAQ ───────────────────────── */
export const FAQ = [
  ['The basics', [
    ['Is with icons really free?', 'Yes. Every icon is free for personal and commercial use under the MIT licence. There’s no paid tier, no account and no watermark.'],
    ['Do I need an account to download icons?', 'No. Open the library, click an icon, and copy or download it. That’s all.'],
    ['How many icons are there?', `${num(N_ICONS)} icons, each in ${N_STYLES} styles: ${num(N_TOTAL)} icons in total. Every style uses the same names and the same 24 × 24 grid.`],
    ['Who makes with icons?', 'with icons is made and maintained by <a href="https://withevergrow.com">Evergrow</a>. Read <a href="about.html">our story</a>.'],
    ['Can I request a new icon?', 'Yes. Requests will open on our <a href="' + GITHUB + '">GitHub</a> at launch. Before asking, search with a few different words: icons have dozens of aliases, so “bin”, “delete” and “throw away” all find trash.'],
  ]],
  ['Using icons', [
    ['Should I download SVG or PNG?', 'Use SVG when your app accepts it (PowerPoint, Word, Canva, Figma, websites): it stays sharp at any size. Use PNG for Google Slides, Google Docs, Notion and email. Pick a PNG at least twice the size you’ll show it. See <a href="guides/index.html">the guides</a>.'],
    ['How do I change an icon’s colour?', 'The easiest way is to pick a colour in the library before you copy or download. SVGs can also be recoloured in apps like PowerPoint and Figma (Canva recolours the filled styles: Solid, Gloss, Retro and Pixel), and on websites with the CSS colour property.'],
    ['Why does my icon look blurry?', 'It’s a PNG shown bigger than it was downloaded. Download a larger PNG (512 or 1024 px), or use the SVG.'],
    ['Why is there a white box around my icon?', 'You probably used a screenshot, a JPG or an MP4: those can’t be see-through. Our PNG downloads have a see-through background, so download the PNG again (or a GIF for a moving icon).'],
    ['How do I add icons to Google Slides or PowerPoint?', 'Google Slides: download a PNG and use Insert › Image › Upload from computer. PowerPoint: download an SVG and use Insert › Pictures › This Device. Full steps: <a href="guides/google-slides.html">Google Slides</a>, <a href="guides/powerpoint.html">PowerPoint</a>.'],
    ['Can I use the icons in Canva?', 'Yes. Pick your colour on the icon’s page, download the SVG and upload it in Canva’s Uploads panel. Filled styles (Solid, Gloss, Retro, Pixel) can also be recoloured inside Canva; outline styles keep the colour you chose here. <a href="guides/canva.html">See the Canva guide</a>.'],
    ['What size should my icons be?', 'In apps and websites, 16–24 px next to text. On slides, 48–128 px. For print, use SVG so size never matters. Keep all icons in one design the same size.'],
    ['Can I use the icons in print?', 'Yes. Download the SVG for perfect sharpness at any size, from business cards to banners.'],
  ]],
  ...(FORMATS.length ? [['Downloads &amp; formats', [
    ['Which file format should I download?', 'Slides and documents: PNG (or the ready PowerPoint slide or Word document). Design tools and websites: SVG. Moving icons: GIF for slides and email, Animated SVG for websites, Lottie for apps, MP4 for video. <a href="guides/which-file.html">Which file should I use?</a> explains every format.'],
    ['Do the icons have a transparent background?', 'Yes, almost every download is see-through: PNG, SVG, WebP, AVIF, PDF, APNG, Animated SVG, Lottie and the PowerPoint and Word files. GIF is see-through with hard edges, so choose the colour it will sit on. JPG, MP4 and EPS can’t be see-through: they sit on white, or on the background colour you pick. <a href="guides/which-file.html#see-through">See-through backgrounds, explained</a>.'],
    ['Can I edit the colours in PowerPoint?', 'Yes, with the SVG or the ready PowerPoint slide, in PowerPoint for Microsoft 365, 2019 or newer. Select the icon and choose Graphics Format › Graphics Fill. For icons with several colours, choose Convert to Shape on the same tab and colour each piece with Shape Fill. PNG, GIF and MP4 files are pictures, so pick the colour before you download.'],
    ['Can I get an animated icon as a video or for my app?', 'Yes. Pick a motion on the icon’s page, then download an MP4 or WebM video, a GIF, an Animated SVG, or a Lottie file for iPhone, Android and web apps. <a href="guides/animate-icons.html">How to animate an icon</a>.'],
    ['Can I make a favicon or an app icon?', 'Yes. Download the favicon pack (every size a website needs, plus the lines to paste), an ICO file, an iOS imageset for Xcode or an Android VectorDrawable.'],
  ]]] : []),
  ['Styles', [
    ['What’s the difference between universal, creative, playful, studio and storybook styles?', `Universal styles (${listTitles(UNI)}) are clear at small sizes and made for interfaces. Creative styles (${listTitles(CRE)}) are full of detail and look best at 32 px and larger, on posters, landing pages and illustrations.${PLAY.length ? ` Playful styles (${listTitles(PLAY)}) bring their own cheerful colours, for social posts, stickers, kids’ and hobby projects and anything that should feel fun.` : ''}${STU.length ? ` Studio styles (${listTitles(STU)}) are art-directed and premium: layered 3D, Bauhaus geometry and real materials, for hero sections, app tiles and brand moments at 48 px and up.` : ''}${STORY.length ? ` Storybook styles (${listTitles(STORY)}) are tiny illustrations: anime, Gothic, pastel, coquette and plush looks for games, kids’ apps, beauty and lifestyle brands, at 48 px and up.` : ''}`],
    ['Which style should I pick?', `If unsure, choose Line. Use Solid for selected or active states and Duo for a softer, friendlier feel. Save the creative${PLAY.length ? ', playful' : ''}${STU.length ? ', studio' : ''}${STORY.length ? ' and storybook' : ''} styles for big, eye-catching moments.`],
    ...(PLAY.length ? [['Can I change the colours of the playful, studio and storybook styles?', 'Yes. The outline follows the colour you pick, like every other style. The extra colours (blush, stripes, frost, gold trim, Bauhaus primaries, satin bows, stained glass and so on) have their own defaults, and on a website each one is a CSS variable you can change. Pick a palette in the icon editor to recolour them all at once.']] : []),
    ['Can I mix styles?', 'Yes, they share one grid, so they line up perfectly. A common pattern is Line for normal buttons and Solid for the selected one. Avoid mixing many styles in the same row.'],
  ]],
  ['Animations', [
    ['Can the icons move?', `Yes. Every icon has its own gentle animation (a bell rings, a heart beats, a loader spins), plus ${PRESETS.length} other ways to move and transitions that turn one icon into another, like play into pause. They work in every style. <a href="guides/animate-icons.html">Animate an icon</a>.`],
    ['Do I need to code to use an animated icon?', 'No. Open any icon, go to Customize › Motion, pick how it moves and download an Animated SVG for your website builder or Notion, or a GIF for your slides. Developers can use the optional <a href="developers.html#motion">@withicons/motion</a> package.'],
    ['Can I use animated icons in PowerPoint or Google Slides?', 'Yes. Download the icon as a GIF (“GIF for slides” on any icon’s Customize panel or on the <a href="free/animated-icons.html">animated icons page</a>) and insert it like a picture: it plays when you present in PowerPoint, Google Slides and Keynote. Slide apps show SVG files as still pictures, so use the GIF there. One moving icon per slide is plenty.'],
    ['What about people who get dizzy from motion?', 'Animated SVGs and the motion package stop automatically when someone has turned on “reduce motion” in their device settings. In slides, prefer calm effects (fade, pulse) over spins and shakes.'],
  ]],
  ['Licence', [
    ['Can I use the icons commercially?', 'Yes, in client work, products, apps, ads and merchandise. See <a href="license.html">the licence in plain words</a>.'],
    ['Do I need to give credit?', 'No. Credit is never required for using the icons in your work. If you redistribute the icon files themselves, include the MIT licence text.'],
    ['Can I use an icon in my logo?', 'You can, but anyone else can use the same icon, so it won’t be unique and may be hard to trademark. Use it as a starting point and customise it.'],
    ['Can I edit the icons?', 'Yes. Change colours, thickness, shapes, anything.'],
  ]],
  ['For developers', [
    ['Is there a React, Vue or Svelte package?', 'Yes: @withicons/react, vue, svelte, angular and solid, plus a web component (@withicons/web) and CSS icon classes (@withicons/classes), all on npm. For example, <code>npm i @withicons/react</code>. Setup for each one is on the <a href="developers.html">developer page</a>.'],
    ['How do I add icons to a website without any build tools?', 'Add one stylesheet and write <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code>. No JavaScript needed. <a href="guides/html.html">See the HTML guide</a>.'],
    ['Do the icons work in dark mode?', 'Yes. Icons use currentColor, so they take the colour of the text around them and switch with your theme automatically.'],
    ['Are the icons accessible?', 'Icons are hidden from screen readers by default (they’re usually next to text). Give one a title or label when it carries meaning on its own, and put aria-label on icon-only buttons.'],
  ]],
  ['AI', [
    ['Can AI assistants use with icons?', 'Yes. Connect the MCP server (<code>npx -y @withicons/mcp</code>) to Claude, Cursor, VS Code, Windsurf and others, and they can search icons by meaning and insert the real SVG. <a href="ai.html">Set it up</a>.'],
    ['What are llms.txt and icons.json?', 'Plain files that describe the whole library for AI models and scripts: <a href="llms.txt">llms.txt</a> is a short overview, <a href="llms-full.txt">llms-full.txt</a> lists every icon, and <a href="icons.json">icons.json</a> is machine-readable metadata.'],
  ]],
]

function faq() {
  const path = 'faq.html'
  const all = FAQ.flatMap(([, qs]) => qs)
  const strip = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  const fmtG = FORMATS.length ? 1 : 0
  const gIcons = ['help-circle', 'image', ...(fmtG ? ['download'] : []), 'layers', 'sparkles', 'shield-check', 'code', 'bot']
  const gStyles = ['line', 'solid', ...(fmtG ? ['engrave'] : []), 'duo', hasStyle('kawaii') ? 'kawaii' : 'gloss', 'sketch', 'blueprint', 'gloss']
  const body = `
<div class="fq">
  <section class="pg-hero fq-hero">
    ${crumbs([['Home', 'index.html'], ['FAQ', null]])}
    <p class="pg-eyebrow"><span class="hand">${all.length} answers</span></p>
    <h1 class="pg-title">Questions, <span class="pg-hl" style="--g:${cvar('solid')}">answered</span>.</h1>
    <p class="pg-lede">Short, plain answers to what people ask most. Can’t find yours? Try the <a href="guides/index.html">how-to guides</a>.</p>
    <div class="fq-search"><label class="pg-sr" for="fq-q">Filter questions</label>${I('search', 'line', 20)}<input id="fq-q" type="search" placeholder="Type to filter, e.g. colour, logo, PNG" data-faq-filter autocomplete="off"><span class="fq-count" data-faq-count aria-live="polite"></span></div>
  </section>
  <div class="fq-layout">
    <nav class="fq-toc" aria-label="FAQ topics"><ol>${FAQ.map(([g], i) => `<li><a href="#faq-${i}" style="--g:${cvar(gStyles[i])}">${I(gIcons[i], 'line', 18)}${g}</a></li>`).join('')}</ol></nav>
    <div class="fq-groups">
      ${FAQ.map(([g, qs], i) => `<section class="fq-group" id="faq-${i}" style="--g:${cvar(gStyles[i])}" aria-labelledby="faq-h-${i}">
        <h2 id="faq-h-${i}"><span class="fq-g-ic" aria-hidden="true">${I(gIcons[i], 'duo', 28)}</span>${g}</h2>
        ${qs.map(([q, a]) => `<details class="pg-qa" data-faq-item><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n        ')}
      </section>`).join('\n      ')}
      <p class="fq-empty" data-faq-empty hidden>No questions match. Try another word, or <a href="guides/index.html">browse the guides</a>.</p>
    </div>
  </div>
  ${askAI({ id: 'ask-faq-h', eyebrow: 'still wondering?', title: 'Let your AI find the right icon', attrs: 'data-intent="find"',
    text: 'Click Claude, ChatGPT, Gemini, Perplexity or Grok. We copy a ready brief that points it to our skill file and open it for you. Tell it what you’re making: it picks the best icon and style, and gives you code or steps for your app. You can ask it anything else about with icons too.' })}
</div>`
  const ld = [{ '@type': 'FAQPage', mainEntity: all.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) }]
  write(path, page({ path, current: '', title: 'FAQ: free icons, licence, SVG vs PNG, colours and more · with icons', ogTitle: 'with icons FAQ', desc: 'Plain answers about with icons: is it free, do I need to credit, which file format, transparent backgrounds, how to change colours, styles, animations, packages for developers and AI assistants.', body, ld, crumbsLd: [['Home', ''], ['FAQ', path]], bodyClass: 'pg-faq' }))
}

export async function buildPages() { developers(); await ai(); about(); license(); faq() }
