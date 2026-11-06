import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, steps, stats, code, cta, doDont, faceOff, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'icons-for-ai-app-builders',
  category: 'ai',
  date: '2026-11-06',
  hero: 'h-icons-for-ai-app-builders',
  stickers: [['bot', 'duo'], ['wand', 'gloss'], ['sparkles', 'glass']],
  title: 'Icons for Lovable, v0, Bolt and Cursor: which icon library to use',
  cardTitle: 'Icons for AI app builders',
  h1: 'Icons for Lovable, v0, Bolt and Cursor: which icon library should <em>your AI</em> use?',
  dek: 'AI app builders reach for the same icon set again and again, and sometimes they invent icon names that do not exist. Here is what each tool uses, what breaks, and how to hand it a real icon set in one line.',
  description: 'Which icon library do Lovable, v0, Bolt and Cursor use, why do they invent icon names, and how do you fix it? Copy-paste prompts, MCP setup and when to keep Lucide.',
  keywords: ['icons for lovable', 'icons in v0', 'bolt icons', 'cursor icon library', 'vibe coding icons', 'AI app builder icons', 'lucide-react', 'icon MCP server', 'shadcn icons'],
  about: ['AI app builders', 'Vibe coding', 'Lovable', 'v0', 'Bolt', 'Cursor', 'Model Context Protocol', 'with icons'],
  related: ['ai-assistants-and-icons', 'with-icons-vs-lucide', 'consistent-icons'],
  tldr: [
    '<strong>v0 builds on shadcn/ui</strong>, and shadcn/ui uses Lucide as its default icon set, so v0 apps usually ship <code>lucide-react</code>. Lovable, Bolt and Cursor do not name a default icon library in their docs: check your project’s <code>package.json</code> to see what you have.',
    'AI tools invent icon names because they write from memory, and names differ between libraries and versions. A made-up name can break the build, blank the page or leave an empty gap.',
    'The fix is to give the AI a real list: a one-line instruction in the tool’s project settings, the with icons MCP server (<code>https://withicons.com/mcp</code> or <code>npx -y @withicons/mcp</code>), <code>npx withicons init</code>, llms.txt or the agent skill.',
    `<strong>Lucide is a fine default.</strong> Keep it if you only need one clean outline style. Switch when you want filled and tinted versions, illustration styles or icons for slides: with icons has ${N_ICONS} icons in ${N_STYLES} matching styles, MIT licensed.`,
    'Whatever you use, say one library and one style per area, and ask the AI to look names up instead of guessing.',
  ],
  faq: [
    { q: 'What icon library does Lovable use?', a: 'Lovable’s docs describe a React stack but do not name a default icon library, so open your project’s package.json (or ask Lovable) to see which one is installed. You can choose your own in Project settings > Instructions, for example “use the with icons library and look names up before using them”.' },
    { q: 'What icons does v0 use?', a: 'v0 says it uses shadcn/ui as its default component system, and shadcn/ui’s default icon set is Lucide (the lucide-react package). You can ask v0 for another library at any time, or save the request as an Instruction so it applies to every chat.' },
    { q: 'Why does my AI app builder use icons that do not exist?', a: 'Language models predict a likely-sounding name instead of checking a list. Icon names also change between libraries and versions (Lucide renamed home to house, for example). Give the tool a source to check, such as an MCP server or an llms.txt link, and the guessing stops.' },
    { q: 'Should I replace Lucide in my AI-built app?', a: 'Not if it already looks the way you want. Lucide is a well-made, ISC-licensed outline set. Switch when you need more than one look (filled, tinted, 3D or playful styles), icons that also work in slides and docs, or a library your AI can search through MCP.' },
    { q: 'How do I connect the with icons MCP server to Cursor or Claude Code?', a: 'Run <code>npx withicons init</code> in your project. It finds Cursor, Claude Code, Codex, VS Code, Windsurf and OpenCode, adds the MCP server and the agent skill, and <code>--dry-run</code> shows every change first. You can also add the remote server <code>https://withicons.com/mcp</code> by hand. No account or key is needed.' },
    { q: 'Can I use with icons in Lovable, v0 and Bolt without coding?', a: 'Yes. Paste one line into the tool’s instructions or knowledge settings, or ask in chat: “Use the with icons library. Install @withicons/react and look up names at withicons.com before using them.” The AI writes the code for you.' },
  ],
  sources: [
    { title: 'v0 docs: FAQs (“v0 uses Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui”)', url: 'https://v0.app/docs/faqs' },
    { title: 'v0 docs: Design systems (shadcn/ui as the default component system)', url: 'https://v0.app/docs/design-systems' },
    { title: 'v0 docs: Instructions', url: 'https://v0.app/docs/instructions' },
    { title: 'shadcn/ui changelog, November 2024: Lucide becomes the default icon set', url: 'https://ui.shadcn.com/docs/changelog/2024-11-icons' },
    { title: 'Lovable docs: FAQ (tech stack)', url: 'https://docs.lovable.dev/introduction/faq' },
    { title: 'Lovable docs: Project settings and Instructions', url: 'https://docs.lovable.dev/features/projects/settings' },
    { title: 'Lovable docs: Custom MCP servers', url: 'https://docs.lovable.dev/integrations/custom-mcp' },
    { title: 'Bolt help: Prompting effectively (Knowledge)', url: 'https://support.bolt.new/best-practices/prompting-effectively' },
    { title: 'Bolt help: Connect an MCP server', url: 'https://support.bolt.new/building/using-bolt/connect-mcp' },
    { title: 'Cursor docs: Rules and AGENTS.md', url: 'https://cursor.com/docs/context/rules' },
    { title: 'Lucide on GitHub: house.json (“home” kept as a deprecated alias)', url: 'https://github.com/lucide-icons/lucide/blob/main/icons/house.json' },
    { title: 'with icons for AI: MCP server, skill, llms.txt', url: 'https://withicons.com/ai.html' },
    { title: 'with icons llms.txt', url: 'https://withicons.com/llms.txt' },
  ],
  body: () => `
${p(`<span class="lede">Most AI app builders reach for Lucide icons, because v0 and many other tools build on shadcn/ui, and Lucide is shadcn/ui’s default icon set. That is a fine start. The trouble begins when the AI guesses an icon name from memory and gets it wrong. Give it a real icon list to check (one line in its settings, an MCP server or an llms.txt link) and it stops guessing.</span>`)}
${p(`This guide is for anyone “vibe coding”, which means building an app by describing it to an AI tool such as Lovable, v0, Bolt or Cursor instead of writing every line yourself. You do not need to read code to follow it. We checked each tool’s own documentation in November 2026, and where a tool does not say something, we say so instead of guessing. (Want the background on why chat assistants make names up? Our ${L.post('ai-assistants-and-icons', 'guide to icons from AI assistants')} covers that in depth.)`)}

${h2('Which icon library do Lovable, v0, Bolt and Cursor use?')}
${p('Here is what each tool’s own docs say, as of November 2026. An icon library is simply a collection of matching icons with fixed names that your app installs like any other building block.')}
${table(['Tool', 'What its docs say', 'Icons you will usually find', 'Where to set your own'], [
  ['<strong>v0</strong> (Vercel)', '“v0 uses Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.”', '<code>lucide-react</code>, the shadcn/ui default', 'Instructions (the + menu in the prompt bar)'],
  ['<strong>Lovable</strong>', 'A React stack (TanStack Start for new apps since May 2026, React + Vite before). No icon library is named.', 'Check <code>package.json</code>', 'Project settings > Instructions'],
  ['<strong>Bolt</strong>', 'No default icon library is named in its help centre.', 'Check <code>package.json</code>', 'Knowledge (account, project or team)'],
  ['<strong>Cursor</strong>', 'An editor, not a template: it uses what your project already has.', 'Whatever is installed', '<code>AGENTS.md</code> or <code>.cursor/rules</code>'],
  ['<strong>Claude Code</strong> and other coding agents', 'Same as Cursor: they follow your project.', 'Whatever is installed', '<code>AGENTS.md</code> / <code>CLAUDE.md</code>, or the agent skill'],
], 'Default icons in popular AI app builders (from each tool’s docs, checked November 2026)')}
${p('The pattern is simple. Tools that start from shadcn/ui inherit Lucide. Tools that work inside your own code use whatever is already there. And when there is nothing there yet, the AI picks a library by itself, without telling you, so it pays to name the one you want.')}
${callout('tip', 'Not sure what your app uses? Ask the builder: “Which icon library is installed in this project, and which icon names do we use?” Or open the file called <code>package.json</code> and look for words like <code>lucide-react</code>, <code>@heroicons/react</code> or <code>@withicons/react</code>.')}

${h2('Why do AI tools make up icon names that do not exist?')}
${p('An AI model writes the most likely next words. It does not open your icon library and read the list. So when it needs a “delete” icon, it writes a name that sounds right. Often that name exists. Sometimes it belongs to a different library, or to an older version of the right one.')}
${p('Names really do drift. Lucide, for example, renamed its <code>home</code> icon to <code>house</code> and now keeps <code>home</code> only as a deprecated (old, on its way out) alias. A model that learned from older code will happily keep writing the old name. Here are a few everyday ideas, with the real names on each side:')}
${faceOff('lucide', { concepts: ['home', 'settings', 'trash', 'shopping-cart', 'search', 'bell'], caption: 'The same six ideas in with icons (top) and Lucide (bottom). Similar ideas, different names: exactly what a guessing AI trips over.' })}

${h2('What breaks when an AI guesses an icon name?')}
${p('It depends on how the icons are added, but none of it is fun:')}
${ul([
  '<strong>The build fails.</strong> In a React app, importing an icon that the package does not have is an error. The builder shows a red message and the preview stops updating.',
  '<strong>The page goes blank.</strong> Sometimes the app builds but crashes when that screen loads, and you see a white page instead of your app.',
  '<strong>An empty gap.</strong> With class-based or image-based icons, a wrong name usually fails quietly: the button is there, the icon is not.',
  '<strong>The wrong picture.</strong> The name exists but means something else, so a “share” button shows an upload arrow.',
  '<strong>A mixed look.</strong> The AI fixes the error by pulling in a second library, and now two styles sit side by side.',
])}
${p('Each fix costs another prompt, and on many builders every prompt uses up credits. A real list prevents the loop entirely.')}
${figure('startup1', 'Vibe coding is fast until a guessed icon name breaks the preview. A real list keeps it fast.')}

${h2('How do you give your AI builder a real icon set?')}
${p(`There are five ways, from “paste one sentence” to “connect a tool”. The examples use ${L.icons('with icons')}, a free MIT library of ${N_ICONS} icons in ${N_STYLES} styles (${N_SVGS} SVGs), because it was built for this: every name is searchable by AI. The first idea works with any library.`)}
${steps([
  ['A one-line instruction', 'Name one library, ask for real names, and set the style. It works in every tool and takes ten seconds.'],
  ['The MCP server', 'MCP (Model Context Protocol) is an open standard that lets an AI tool call outside tools. Ours lets the AI search the real icon list. Remote: <code>https://withicons.com/mcp</code>, no key. Local: <code>npx -y @withicons/mcp</code>.'],
  ['<code>npx withicons init</code>', 'One command in your project that adds the MCP server and the agent skill to Claude Code, Codex, Cursor, OpenCode, VS Code and Windsurf. Add <code>--dry-run</code> to see the changes first.'],
  ['llms.txt', 'A plain-text summary written for AI models, at <code>https://withicons.com/llms.txt</code>. Paste the link into any chat that can read web pages.'],
  ['The agent skill', 'A short instruction file the AI reads before it adds icons: which package, which style, how to name things and how to label buttons. It lives at <code>https://withicons.com/skill/SKILL.md</code>.'],
])}
${stats([[`${N_ICONS}`, 'real names to search'], [`${N_STYLES}`, 'styles per icon'], ['0', 'accounts or API keys'], ['1', 'line to get started']])}

${h2('Copy-paste prompts for each tool')}
${p('Swap the style if you like. <strong>Line</strong> is the calm outline default for buttons and menus, <strong>solid</strong> suits the active tab, and the creative styles are for big, decorative spots.')}
${h3('Lovable')}
${p('Open Project settings (Ctrl+. or ⌘. on a Mac) and paste this into the Instructions tab, so it applies to every request. Lovable can also add custom MCP servers on all plans: open Connectors, add an MCP server with the URL <code>https://withicons.com/mcp</code> and no authentication.')}
${code(`Icons: use the "with icons" library (@withicons/react, MIT).
Read https://withicons.com/skill/SKILL.md before adding icons.
Look names up at https://withicons.com/api/search?q=<words>;
never invent an icon name. Line style for UI, solid for active states.
Icon-only buttons need an aria-label.`, 'prompt')}
${h3('v0')}
${p('Open the + menu in the prompt bar, choose New Instruction, paste this and keep it ticked. Saved instructions follow you across chats and projects.')}
${code(`For icons in my pages, use @withicons/react (leave the icons
inside the shadcn/ui components as they are).
Check every name against https://withicons.com/llms.txt first.
Use the line style, and the solid style for the selected item.
If no icon fits, tell me instead of making a name up.`, 'prompt')}
${h3('Bolt')}
${p('Add this to Project knowledge (or Account knowledge, to cover every project). Bolt can also connect custom MCP servers under Connectors; its docs list API-key and sign-in options, and ours needs neither, so if the connector will not save, the knowledge line alone still does the job.')}
${code(`Icon library: with icons (npm i @withicons/react).
Before using an icon, confirm the name exists at
https://withicons.com/icons/<name>.html. Never guess names.
One style per area: line for navigation, duo for feature cards.`, 'prompt')}
${h3('Cursor, Claude Code and other coding agents')}
${p('Run one command in your project folder. It adds the skill and the MCP server for every AI tool it finds, keeps your other settings, and is safe to run again.')}
${code(`npx withicons init`, 'bash')}
${p(`Prefer to do it yourself? Cursor reads project rules from <code>.cursor/rules</code> and also supports a plain <code>AGENTS.md</code> file. The exact config for each tool is on our ${L.page('ai.html', 'with icons for AI page')}. Then ask in plain words:`)}
${code(`Use the withicons MCP server. Swap the icons in the sidebar for
with icons (line style; solid for the active item). Look up each name
with search_icons before importing it. Keep lucide-react elsewhere.`, 'prompt')}

${h2('Should you keep Lucide or switch?')}
${p('Honestly, Lucide is a good default. It is a well-drawn outline set, ISC licensed, with official packages for most frameworks, and shadcn/ui is built around it. If your app looks right and you only need one outline style, keep it, and just add the “look names up” line so the AI stops guessing.')}
${table(['You want…', 'Keep Lucide', 'Try with icons'], [
  ['One clean outline style for an app', yes('Great fit'), yes('Line style')],
  ['Filled and tinted versions of the same icons', meh('Outline only'), yes('Solid and duo, same names')],
  ['Big, decorative icons for a landing page', no('Not its focus'), yes(`${N_STYLES - 3} creative styles`)],
  ['An AI that searches the real list', meh('llms.txt'), yes('MCP server, skill, llms.txt')],
  ['The same icons in slides and docs', meh('SVG download'), yes('Copy image, PNG and SVG')],
  ['No change at all to a working app', yes('Nothing to do'), meh('Small rename map')],
], 'Lucide or with icons in an AI-built app')}
${p(`Switching is mostly a find-and-replace. Both libraries give you one React component per icon with the same <code>size</code>, <code>color</code> and <code>strokeWidth</code> props, and only a few names differ (<code>House</code> becomes <code>Home</code>, <code>X</code> becomes <code>Close</code>). Our ${L.alt('lucide', 'Lucide alternative page')} has the full name map, and ${L.post('with-icons-vs-lucide', 'with icons vs Lucide')} compares the two in plain English.`)}
${styleRow('home', `One <a href="../icons/home.html">home</a> icon, seven looks: the same name works in every style, so your AI only has to learn it once.`, { styles: ['line', 'solid', 'duo', 'gloss', 'glass', 'clay', 'kawaii'] })}

${h2('How do you keep AI-built icons consistent?')}
${p(`AI builders add screens fast, and each new screen is a fresh chance for the look to drift. Three rules keep it tidy, and they belong in your instructions, not just in one prompt:`)}
${ul([
  '<strong>One library.</strong> Name it, and tell the AI not to install a second one.',
  '<strong>One style per area.</strong> Line in the menu, solid for the selected item, one creative style for the hero. Not five styles on one screen.',
  '<strong>Labels on icon-only buttons.</strong> A trash can with no text needs an accessible name (an <code>aria-label</code>) so screen readers can say “Delete”.',
])}
${doDont(`<p>Write the library, the style and “never invent a name” into the tool’s Instructions or Knowledge once, then spot-check a few icon links on ${L.icons('withicons.com')}.</p>`, '<p>Let every prompt pick icons from scratch, or accept “I added some icons” without knowing which library they came from.</p>')}
${iconGrid(['bot', 'search', 'check-circle', 'code', 'layers', 'sparkles'], 'duo', 'Tell, search, check, build, keep it consistent, enjoy. The loop that stops guessed icon names.')}
${p(`For more on matching icons across a product, read ${L.post('consistent-icons', 'how to keep icons consistent')}. For React projects without an AI builder, the ${L.page('free/icons-for-react.html', 'free icons for React')} page has the install steps.`)}

${h2('The bottom line')}
${p(`Your AI app builder probably already uses Lucide, and that is fine. The real problem is guessing, not the library. Tell the tool which icon set to use, give it a way to check names (an instruction, the MCP server, <code>npx withicons init</code>, llms.txt or the skill), and keep one style per area. If you want more than one outline style, ${L.page('free/ai-icons.html', 'with icons')} gives your AI ${N_ICONS} searchable icons in ${N_STYLES} styles, free under MIT.`)}
${cta('Give your AI a real icon set', 'Run npx withicons init, or paste one line into Lovable, v0 or Bolt. Free, MIT licensed, no account or key.', ['bot', 'sparkles', 'wand', 'code', 'search', 'check-circle'])}
`,
}
