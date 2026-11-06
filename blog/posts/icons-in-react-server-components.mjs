import { p, h2, h3, ul, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icons-in-react-server-components',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-icons-in-react-server-components',
  stickers: [['server', 'duo'], ['component', 'gloss'], ['gauge', 'sketch']],
  title: 'Do icons need “use client”? Icons in React Server Components',
  cardTitle: 'Icons in React Server Components',
  h1: 'Do icons need <em>“use client”</em>? Icons in React Server Components',
  dek: 'createContext errors, “Functions cannot be passed directly to Client Components”, huge icons on first load and bloated bundles: why icon libraries trip over Server Components, and the fixes that work in Next.js 16.',
  description: 'Why icon libraries break or bloat React Server Components: fixing createContext and “Functions cannot be passed” errors, icons by name, and measuring bundles.',
  keywords: ['icons react server components', 'use client icons', 'createContext only works in client components icons', 'functions cannot be passed directly to client components icon', 'dynamic icon by name react', 'icon library bundle size', 'next.js icons app router', 'next analyze'],
  about: ['React Server Components', 'Next.js', 'React (software)', 'Tree shaking', 'Scalable Vector Graphics'],
  related: ['svg-icons-in-react-and-nextjs', 'best-react-icon-libraries', 'shadcn-ui-icons'],
  tldr: [
    '<strong>Icons do not need <code>"use client"</code>.</strong> An icon is just an SVG. A component with no state, effects or context renders in a Server Component and sends no icon JavaScript to the browser.',
    'Trouble starts when a library adds <code>"use client"</code> or React context (lucide-react 1.x does both; react-icons’ <code>IconContext</code> is context). Context providers only work in Client Components, so wrap them in a small client file, as deep in the tree as you can.',
    '<strong>“Functions cannot be passed directly to Client Components”:</strong> pass the rendered icon (<code>icon={&lt;Search /&gt;}</code>), not the component (<code>icon={Search}</code>). React can send elements across, not functions.',
    '<strong>Icons by name:</strong> never <code>import * as Icons</code> in client code. Use a small explicit map, look the name up on the server, or use a per-icon web component or CSS class.',
    '<strong>Measure the production build.</strong> Next.js 16 dropped “First Load JS” from <code>next build</code>; use <code>next analyze</code> (16.1+) and filter to client modules.',
  ],
  faq: [
    { q: 'Do I need "use client" for icons in Next.js?', a: 'Not for the icons themselves. An SVG icon component without state, effects or context can render in a Server Component. You only need a client boundary if the library uses context or other client-only features, or if the icon sits inside an interactive component that is already a Client Component.' },
    { q: 'Why do I get "createContext only works in Client Components" from an icon library?', a: 'Because the library, or a provider you added (for example react-icons’ IconContext.Provider), uses React context, and React does not support context in Server Components. Move the provider into a small file that starts with "use client" and wraps only the part of the tree that needs it, or drop the provider and set a default size with a tiny wrapper or CSS.' },
    { q: 'How do I pass an icon as a prop from a Server Component to a Client Component?', a: 'Pass a rendered element: &lt;Button icon={&lt;Search /&gt;} /&gt;. React can serialise JSX elements across the boundary, but not plain functions, and a component is a function. Inside the Client Component, render the prop with {icon}. The other way is to pass a string name and look it up in a small map on the client.' },
    { q: 'Why is my icon library making my bundle huge?', a: 'Usually because something imports the whole set: import * as Icons, an object of every icon for a dynamic name lookup, or an icon picker loaded on every page. Named imports from a tree-shakable package keep only the icons you use in production. Check with a production build, not the dev server, and look at client modules only.' },
    { q: 'Why are my Font Awesome icons huge on first load in Next.js?', a: 'Font Awesome’s SVG core normally adds its own CSS at runtime, and that CSS is what sizes the icons, but Next.js blocks the step. Its docs for Next.js say to import @fortawesome/fontawesome-svg-core/styles.css in your root layout and set config.autoAddCss = false, so the CSS is there before the icons render.' },
    { q: 'Can I render an icon from a string in a Server Component?', a: 'Yes, and it is cheaper there than anywhere else: code that runs only on the server is not sent to the browser, so the lookup table costs nothing on the client. Still check the name against the icons you allow, and render nothing for unknown names.' },
  ],
  sources: [
    { title: 'Next.js docs: Server and Client Components (context providers, third-party components, bundle size; checked November 2026)', url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components' },
    { title: 'React docs: “use client” (module graph, serialisable props)', url: 'https://react.dev/reference/rsc/use-client' },
    { title: 'Next.js docs: Optimizing package bundling (next analyze, 16.1+)', url: 'https://nextjs.org/docs/app/guides/package-bundling' },
    { title: 'Next.js docs: optimizePackageImports (experimental; packages optimised by default)', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports' },
    { title: 'Next.js docs: upgrading to version 16 (size and First Load JS removed from build output)', url: 'https://nextjs.org/docs/app/guides/upgrading/version-16' },
    { title: 'lucide-react 1.70.0 Icon source (“use client”, useLucideContext)', url: 'https://unpkg.com/lucide-react@1.70.0/dist/esm/Icon.mjs' },
    { title: 'Lucide docs: DynamicIcon caveats', url: 'https://lucide.dev/guide/react/advanced/dynamic-icon-component' },
    { title: 'react-icons 5.7.0 iconContext source (React.createContext)', url: 'https://unpkg.com/react-icons@5.7.0/lib/iconContext.mjs' },
    { title: 'react-icons issue #770: IconContext.Provider in a Next.js 13 layout (July 2023)', url: 'https://github.com/react-icons/react-icons/issues/770' },
    { title: 'Font Awesome docs: using React with Next.js (autoAddCss)', url: 'https://docs.fontawesome.com/web/use-with/react/use-with' },
    { title: 'with icons: @withicons/react README (SSR, Server Components, Icon)', url: 'https://www.npmjs.com/package/@withicons/react' },
  ],
  body: () => `
${p(`<span class="lede">No, icons do not need <code>"use client"</code>. An icon is just an SVG, and an icon component with no state, effects or React context renders fine in a Server Component, sending no icon JavaScript to the browser. The errors and the bloat come from four other things: libraries that add context or <code>"use client"</code>, passing an icon <em>component</em> to a Client Component, looking icons up by name with <code>import *</code>, and CSS that loads late.</span>`)}
${p(`Most answers online were written for Next.js 13 in 2023, and many say “add <code>'use client'</code> to your root layout”, which turns your whole app into client code. Below is each symptom with the fix that works in Next.js 16 and React 19, checked against the React, Next.js and library docs and source in November 2026. New to importing SVGs in React at all? Start with ${L.post('svg-icons-in-react-and-nextjs', 'how to import SVG icons in React and Next.js')}.`)}

${h2('Do icon components need "use client"?')}
${p('In the Next.js App Router, pages and layouts are <strong>Server Components</strong> by default: they run on the server, and the browser receives the finished HTML. A file that starts with <code>"use client"</code> becomes a <strong>Client Component</strong>, and that file plus everything it imports is sent to the browser as JavaScript. The React docs put it plainly: the directive marks “the module and its transitive dependencies as client code”.')}
${p('So an icon only needs to be client code if it uses client-only features. Drawing an SVG is not one. In a Server Component, an icon costs the browser some markup and zero JavaScript. The same icon imported inside a <code>"use client"</code> file is shipped as code, because everything that file imports is.')}
${art('m-icons-in-react-server-components-boundary', 'Where an icon sits decides whether its code reaches the browser.', { brief: 'A two-zone diagram. Left zone labelled "Server Components" (page, layout, nav) containing with icons line-style home, search and bell icons, with an arrow to the browser labelled "HTML only, 0 KB icon JS". Right zone labelled "use client" boundary (a search box component) containing one search icon, with an arrow labelled "shipped as JavaScript". A dashed line marks the boundary. Clean, blueprint-style lines, short labels, no logos and no byte counts beyond "0 KB".' })}
${p('Here is how popular libraries behave, from their own source and docs as of November 2026:')}
${table(['Library', 'Plain icon in a Server Component', 'What to know'], [
  ['with icons (<code>@withicons/react</code>)', yes('Yes'), 'Plain <code>forwardRef</code> components, no state, effects or context. Gradient styles call <code>useId</code>, which React supports on the server.'],
  ['lucide-react 1.x', meh('Renders, as client code'), 'Its <code>Icon</code> module starts with <code>"use client"</code> and reads a Lucide context, so icon code ships to the browser.'],
  ['react-icons 5.x', yes('Yes, icons'), '<code>IconContext</code> is React context: <code>IconContext.Provider</code> needs a Client Component.'],
  ['Phosphor', meh('Use the /ssr entry'), 'Import from <code>@phosphor-icons/react/ssr</code> in Server Components.'],
  ['Font Awesome (SVG core)', meh('Needs its CSS first'), 'Import its stylesheet in the root layout and turn off <code>autoAddCss</code>.'],
], 'How icon libraries behave in React Server Components (checked November 2026)')}
${p(`This is not a ranking. A library that ships as client code still works: Next.js renders it to HTML and then hydrates it. You just pay for its JavaScript. For a fuller comparison, see our ${L.post('best-react-icon-libraries', 'React icon library guide')}.`)}

${h2('Why do I get "createContext only works in Client Components"?')}
${p('Because something in your Server Component tree uses React context, and the Next.js docs are direct about it: “React context is not supported in Server Components.” With icons this usually means a provider that sets a default size or colour for every icon, such as react-icons’ <code>IconContext.Provider</code> placed in <code>app/layout</code>.')}
${p('A detail explains the odd error some people see. react-icons creates its context with <code>React.createContext &amp;&amp; React.createContext(...)</code>. In React’s server build, <code>createContext</code> does not exist, so <code>IconContext</code> is <code>undefined</code>: plain icons still render, but <code>IconContext.Provider</code> fails with “Cannot read properties of undefined (reading ‘Provider’)”, exactly what react-icons issue #770 reported in 2023.')}
${p('Two fixes, both better than marking the root layout as a client file:')}
${ul([
  '<strong>Move the provider into a small client file</strong> that starts with <code>"use client"</code>, renders the provider around <code>{children}</code>, and is placed as deep in the tree as possible. That is the pattern the Next.js docs recommend for every provider.',
  '<strong>Skip the provider.</strong> A default icon size is easy without context: set it with CSS (<code>svg.icon { width: 1.25rem }</code>) or a two-line wrapper that passes <code>size</code>. With components that inherit <code>currentColor</code>, colour already comes from the surrounding text.',
])}

${h2('How do I fix "Functions cannot be passed directly to Client Components"?')}
${p('This one appears when a Server Component hands an icon <em>component</em> to a Client Component, for example a button that takes an <code>icon</code> prop. Props that cross from server to client must be serialisable (convertible to data), and the React docs list JSX elements as allowed but plain functions as not. A component is a function. A rendered element is data.')}
${code(`// app/page.jsx (Server Component)
import { Search } from '@withicons/react'
import { IconButton } from './icon-button'   // a 'use client' file

<IconButton icon={Search} label="Search" />        // ✗ passes a function
<IconButton icon={<Search />} label="Search" />    // ✓ passes an element

// icon-button.jsx
'use client'
export function IconButton({ icon, label, ...props }) {
  return <button aria-label={label} {...props}>{icon}</button>
}`, 'jsx')}
${p('If the Client Component must choose the icon itself, pass a string name and map it inside the client file, as below.')}
${art('m-icons-in-react-server-components-pass-icon', 'Pass the rendered icon, not the component.', { brief: 'A do/don’t pair as two cards. Left card with a red x-circle: "icon={Search}" and a small label "a function: can’t cross to the client". Right card with a green check-circle: "icon={<Search />}" and "an element: crosses fine". Between them, a thin vertical line labelled "server | client". Use the with icons line-style search icon as the example in both cards. No logos.' })}

${h2('How do I render an icon from a string name safely?')}
${p('Names often come from a CMS field, a database row or a JSON menu. The accepted Stack Overflow answer to this question still does <code>import * as Icons from \'lucide-react\'</code> and then <code>Icons[name]</code>. In a Client Component, that ships every icon in the set, because the bundler cannot know which names you will ask for. Better options, from simplest to most open-ended:')}
${steps([
  ['A known list? Use an explicit map', 'Write <code>const ICONS = { home: Home, search: Search, bell: Bell }</code> and render <code>ICONS[name] ?? null</code>. Only those icons ship, and unknown names render nothing. This also works as an allow-list, so a typo or a hostile value can never load something unexpected.'],
  ['Look the name up on the server', 'Code that runs only in a Server Component never reaches the browser, so even a large lookup costs the client nothing. Resolve the name in the Server Component and pass the rendered element down.'],
  ['Truly open-ended names in the browser? Load per icon', 'Lazy per-icon imports work, with costs that Lucide’s own docs list for its <code>DynamicIcon</code>: longer builds, one module per icon, more network requests and a possible flash while an icon loads. A web component or CSS class keyed by name avoids the JavaScript per icon.'],
])}
${p(`with icons has two parts built for this. In React, <code>&lt;Icon name="home" /&gt;</code> accepts names and unambiguous aliases (<code>bin</code> finds <code>trash</code>) and renders nothing for unknown names, with a console warning naming the three nearest icons. It renders the line style at once, which means it bundles every line icon plus the alias table (about 145 KB gzipped before minification in version 0.6.0, by our measurement), so keep it for truly dynamic names, and loads any other style on first use inside <code>&lt;Suspense&gt;</code>. Server Components wait for that load and send the finished SVG. In the browser, <code>&lt;with-icon name="home"&gt;</code> from <code>@withicons/web</code> fetches one small file per icon shown (a line icon is typically 161 bytes gzipped, per the package README), and the ${L.page('free/font-awesome-style-icon-classes.html', 'CSS icon classes')} do the same with a stylesheet per icon.`)}
${iconGrid(['home', 'search', 'bell', 'settings', 'trash', 'user'], 'line', 'A typical CMS menu: six names, six icons. An explicit map ships exactly these.')}

${h2('Why are my Font Awesome icons huge on first load?')}
${p('Font Awesome’s SVG core normally adds its own stylesheet to the page at runtime, and that stylesheet is what keeps icons small. Font Awesome’s docs say Next.js manages CSS differently and blocks that step, so icons show up huge without their CSS. Their Next.js instructions fix it in your root layout:')}
${code(`// app/layout.jsx
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false`, 'jsx')}
${p('The lesson applies to any icon set that sizes itself with injected CSS: load that CSS with the page. Components that set <code>width</code> and <code>height</code> on the SVG itself (as with icons does, 24 by default) do not have this problem.')}

${h2('How do I measure what icons add to my bundle?')}
${p('Two traps first. The dev server does not tree-shake like a production build, so its numbers look far worse. And since Next.js 16, <code>next build</code> no longer prints “size” and “First Load JS”: the Next.js team says those figures were inaccurate with Server Components. Here is what to do instead:')}
${steps([
  ['Run the bundle analyser', 'In Next.js 16.1 and later, run <code>npx next analyze</code>. It opens a treemap of your modules built from Turbopack’s module graph. On webpack builds, use <code>@next/bundle-analyzer</code>.'],
  ['Filter to client modules', 'Icons that render only in Server Components should not appear in the client view at all. If a whole icon set does, follow its import chain (click the module) to the file that pulled it in.'],
  ['Look for the usual suspects', '<code>import * as</code>, a big name-to-icon object in a client file, an icon picker loaded on every route, or a provider that drags a library into a client boundary.'],
  ['Fix, then compare', '<code>npx next analyze --output</code> writes the analysis to <code>.next/diagnostics/analyze</code>, so you can keep a copy and compare before and after.'],
])}
${callout('note', 'Next.js has an experimental <code>optimizePackageImports</code> setting for packages that export thousands of modules, and its docs list icon libraries that are optimised by default, including <code>lucide-react</code>, <code>react-icons/*</code>, <code>@mui/icons-material</code>, <code>@tabler/icons-react</code> and three Heroicons entries. <code>@withicons/react</code> is not on that list and does not need to be: each style is a single module of pure components with <code>sideEffects: false</code>, so bundlers keep only the icons you import.', 'About optimizePackageImports')}
${styleRow('server', 'The server icon in a few styles. Each style is its own import path, so a page pays only for the style and icons it uses.', { styles: ['line', 'solid', 'duo', 'blueprint', 'glass', 'clay'] })}

${h2('What changed since the old answers?')}
${ul([
  '<strong>2023:</strong> the App Router made Server Components the default, and early answers said to mark the root layout as a client file.',
  '<strong>21 October 2025, Next.js 16:</strong> Turbopack became the default bundler, and the size columns left the build output.',
  '<strong>Next.js 16.1:</strong> <code>next analyze</code> arrived as the Turbopack bundle analyser.',
  '<strong>Library side:</strong> lucide-react 1.x ships its icons as client code with a context, and Phosphor offers an <code>/ssr</code> entry. Libraries change, so check the source of the version you install.',
])}
${doDont('<p>Keep icons in Server Components where you can, pass rendered elements across the boundary, map string names through a small allow-list, and measure a production build.</p>', '<p>Add <code>"use client"</code> to the root layout to silence an icon error, <code>import *</code> a whole icon set for name lookups, or judge bundle size from the dev server.</p>')}
${p(`If you want icons that are plain server-friendly components, ${L.icons('browse the library')}: all ${N_ICONS} icons come in ${N_STYLES} styles, starting with the ${L.style('line', 'line style')} for interfaces. Using shadcn/ui? Our ${L.post('shadcn-ui-icons', 'shadcn/ui icons guide')} shows how to swap the icon set.`)}
${cta('Icons that stay on the server', `${N_ICONS} icons in ${N_STYLES} styles as context-free React components: no 'use client', no provider, no bundler config. Free and MIT licensed.`, ['server', 'component', 'code', 'gauge', 'check-circle', 'sparkles'])}
`,
}
