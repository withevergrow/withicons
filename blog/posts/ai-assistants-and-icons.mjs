import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, steps, stats, quote, code, cta, doDont, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'ai-assistants-and-icons',
  category: 'ai',
  date: '2026-10-02',
  hero: 'ai1',
  stickers: [['bot', 'duo'], ['sparkles', 'gloss'], ['search', 'sketch']],
  title: 'How to get great icons from ChatGPT, Claude and other AI assistants',
  cardTitle: 'Great icons from AI assistants',
  h1: 'How to get great icons from ChatGPT, Claude and other <em>AI assistants</em>',
  dek: 'AI assistants are brilliant at layouts and terrible at remembering icon names. Here is why they make names up, and three simple ways to make them pick real icons every time.',
  description: 'Why ChatGPT, Claude and Gemini invent icon names, and how to fix it with MCP, llms.txt and Ask AI buttons. Copy-paste prompts for slides, websites and code.',
  keywords: ['AI icons', 'ChatGPT icons', 'Claude icons', 'MCP icons', 'icon MCP server', 'llms.txt', 'AI assistant icon names', 'prompts for icons'],
  about: ['AI assistants', 'Model Context Protocol', 'llms.txt', 'with icons'],
  related: ['choosing-the-right-icon', 'how-to-add-icons-to-a-website', 'icons-in-presentations'],
  tldr: [
    'AI assistants invent icon names because they predict likely-sounding words from memory, and every icon set names things differently (“house”, “home”, “fa-house”).',
    'The fix is to let the assistant <strong>look up a real list</strong> instead of guessing: connect an MCP server, point it at an llms.txt file, or start from a ready-made brief.',
    'with icons offers all three: an MCP server at <code>https://withicons.com/mcp</code>, a plain-text guide at <code>withicons.com/llms.txt</code>, and “Ask AI” buttons on the site for Claude, ChatGPT, Gemini, Perplexity and Grok.',
    'No coding needed: paste one line that tells the assistant where to read, describe what the icon is for, and ask for exact names with links.',
    'Always check the answer: every icon should have a working link, one style per area, and a text label or accessible name.',
  ],
  faq: [
    { q: 'Why does ChatGPT give me icon names that do not exist?', a: 'Language models write the most likely-sounding answer, and icon names look alike across libraries. Without a real list to check, the assistant guesses, and a plausible guess like “trash-alt” may not exist in the set you use. Give it a source to search, such as an MCP server or an llms.txt file, and the guessing stops.' },
    { q: 'What is an MCP server?', a: 'MCP (Model Context Protocol) is an open standard that lets AI apps connect to outside tools and data. An icon MCP server lets your assistant search a real icon library and fetch the exact code, instead of relying on memory.' },
    { q: 'Can ChatGPT or Claude make icons for me?', a: 'They can draw simple SVG icons, but the results are often uneven: different line weights, odd proportions, nothing that matches your other icons. For a professional result, ask the assistant to choose from a consistent, licensed icon set and to give you exact names and links.' },
    { q: 'Do I need to know how to code to use AI for icons?', a: 'No. On withicons.com you can describe what the icon is for, click an assistant, and paste the brief. The assistant replies with the best icon, alternatives and step-by-step instructions for your app, such as PowerPoint or Canva.' },
    { q: 'What is llms.txt?', a: 'llms.txt is a simple text file a website publishes to give AI models a short, clean summary of its content. It was proposed by Jeremy Howard in September 2024. with icons publishes one at withicons.com/llms.txt.' },
    { q: 'Is the with icons MCP server free?', a: 'Yes. with icons is free and MIT licensed, and the MCP server needs no account or API key. The remote server is at https://withicons.com/mcp. You can also run it locally with <code>npx -y @withicons/mcp</code>, or let <code>npx withicons init</code> set it up for you.' },
  ],
  sources: [
    { title: 'Model Context Protocol: What is MCP?', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
    { title: 'Anthropic: Introducing the Model Context Protocol (November 25, 2024)', url: 'https://www.anthropic.com/news/model-context-protocol' },
    { title: 'llms.txt proposal (Jeremy Howard, September 2024)', url: 'https://llmstxt.org/' },
    { title: 'OpenAI: Why language models hallucinate (September 2025)', url: 'https://openai.com/index/why-language-models-hallucinate/' },
    { title: 'with icons for AI: MCP server, skill, llms.txt', url: 'https://withicons.com/ai.html' },
    { title: 'with icons llms.txt', url: 'https://withicons.com/llms.txt' },
  ],
  body: () => `
${p(`<span class="lede">To get great icons from an AI assistant, stop asking it to remember icon names and let it look them up. Connect an MCP server, point it at an llms.txt file, or start from a ready-made brief. Then ask for exact names, one style, and a link for every pick.</span>`)}
${p(`That is the whole trick. The rest of this guide explains why assistants get icons wrong, what MCP and llms.txt actually are (in normal words), how the “Ask AI” buttons on ${L.icons('withicons.com')} work, and gives you prompts you can copy, whether you are making slides or shipping code.`)}

${h2('Why do AI assistants make up icon names?')}
${p('An AI assistant writes the most likely-sounding answer based on what it has read. It does not have your icon library open. So when you ask for “the delete icon”, it produces a name that sounds right. Sometimes that name exists. Often it does not, or it exists in a different library.')}
${p('Researchers at OpenAI put it plainly in 2025: models partly make things up because the way they are trained and tested rewards a confident guess over saying “I am not sure”. Icon names are a perfect trap, because every library names the same idea differently:')}
${table(['Idea', 'Font Awesome', 'Lucide', 'Heroicons', 'Material Symbols', 'with icons'], [
  ['Home', '<code>fa-house</code>', '<code>house</code>', '<code>home</code>', '<code>home</code>', `<code>${L.icon('home')}</code>`],
  ['Settings', '<code>fa-gear</code>', '<code>settings</code>', '<code>cog-6-tooth</code>', '<code>settings</code>', `<code>${L.icon('settings')}</code>`],
  ['Delete', '<code>fa-trash</code>', '<code>trash-2</code>', '<code>trash</code>', '<code>delete</code>', `<code>${L.icon('trash')}</code>`],
], 'One idea, many names: why guessing goes wrong')}
${p('Mix those up and you get a blank square on your website, a broken build, or a slide with the wrong picture. The assistant is not being lazy. It simply has nothing to check against.')}
${quote('An assistant that searches first never has to guess.')}

${h2('What is MCP, in one sentence?')}
${p('<strong>MCP (Model Context Protocol) is an open standard that lets AI apps plug into outside tools and data, a bit like a USB-C port for AI.</strong> Anthropic released it as open source in November 2024, and today many AI apps and coding tools support it.')}
${p('For icons, this means your assistant can call a search tool and get back real names, real code and real links, instead of writing from memory. The with icons MCP server offers these tools:')}
${table(['Tool', 'What it does', 'Example'], [
  ['<code>search_icons</code>', 'Finds icons by meaning, typo-tolerant', '“throw away” finds trash'],
  ['<code>get_icon</code>', 'Returns one icon as paste-ready code in any style', 'trash, solid style, as SVG or React'],
  ['<code>resolve_icon</code>', 'Checks a guessed name', '“bin” resolves to trash'],
  ['<code>list_styles</code>', 'Lists every style and when to use each', 'line for buttons, gloss or glass for hero sections'],
  ['<code>list_categories</code>', 'Lists categories and the icons in each', 'every icon in “weather”'],
], 'The with icons MCP tools')}
${stats([[`${N_ICONS}`, 'real icon names'], [`${N_STYLES}`, 'styles per icon'], ['5', 'MCP tools'], ['$0', 'no account or API key']])}

${h2('What is llms.txt?')}
${p('llms.txt is a plain text file that a website puts at a fixed address so AI models can read a clean summary of it, without menus, ads and page code getting in the way. It was proposed by Jeremy Howard in September 2024.')}
${p('with icons publishes <code>https://withicons.com/llms.txt</code> (a short guide), <code>llms-full.txt</code> (more detail) and <code>icons.json</code> (every icon with its name, category and aliases). If your assistant can read web pages but cannot use MCP, paste the llms.txt link into your chat and ask it to use that list.')}
${callout('tip', 'Even a single line helps: “Read https://withicons.com/llms.txt and only use icon names from it.” That one sentence turns guessing into looking up.')}

${h2('How do the “Ask AI” buttons on withicons.com work?')}
${p('This is the easiest route if you never want to touch settings or code. Next to every search box and on every icon page there is an “Ask AI” option.')}
${steps([
  ['Say what the icon is for', 'Type something like “a button that clears the cart in my grocery app” or “a pricing slide in Google Slides”.'],
  ['Pick your assistant', 'Claude, ChatGPT, Gemini, Perplexity or Grok.'],
  ['We copy a brief and open it', 'The assistant opens in a new tab with a ready-made brief. (Gemini cannot pre-fill the message, so paste it with Ctrl+V, or ⌘V on a Mac.)'],
  ['Get a real answer', 'The brief points the assistant to the with icons skill file, so it searches the real library and replies with the best fit, up to two alternatives, the right style, and code or steps for your app.'],
])}
${p('You can ask for five different jobs: <strong>find</strong> the right icon, <strong>code</strong> it for your app, build a matching <strong>set</strong>, check whether an icon <strong>fits</strong> your meaning, or use it in your <strong>slides</strong> or doc. Nothing is sent to with icons: the brief only tells your assistant where to read.')}
${figure('ai3', 'AI assistants are great collaborators once they have a real source to check.')}

${h2('Prompts you can copy (no code needed)')}
${p('These work in any assistant that can read web pages. Swap the details in brackets for your own.')}
${h3('For a slide deck')}
${code(`Read https://withicons.com/llms.txt first and only use icons from that library.
I'm making a [10-slide sales deck in Google Slides] about [our delivery service].
Suggest one icon per slide, all in the duo style.
For each one, give the exact icon name, a link to its page on withicons.com,
and one line on why it fits. Then tell me how to copy it into Google Slides.`, 'prompt')}
${h3('For a website section')}
${code(`Use the with icons library (read https://withicons.com/llms.txt).
I need icons for a "Why choose us" section with 4 points:
[fast delivery, secure payments, friendly support, easy returns].
Give me the exact icon name and page link for each, pick one style that
suits a [friendly, modern] brand, and say what size to use.
Don't invent names: if nothing fits, say so and suggest the closest one.`, 'prompt')}
${h3('To check an icon you already picked')}
${code(`Read https://withicons.com/llms.txt. I plan to use the "sliders" icon for
"account settings" in my app. Will people read it correctly?
If not, suggest up to 3 better icons from the library, with links.`, 'prompt')}
${p(`Making slides? Our ${L.post('icons-in-presentations', 'guide to icons in presentations')} and the ${L.guide('google-slides', 'Google Slides guide')} cover inserting, recolouring and resizing.`)}

${h2('Prompts and setup for builders')}
${p('If you use a coding assistant such as Claude Code, Cursor, Codex, VS Code or Windsurf, connect the MCP server once and every future request can search real icons. The recommended option is the remote server, which needs no install. For tools that read an <code>.mcp.json</code> file, it looks like this:')}
${code(`{
  "mcpServers": {
    "withicons": { "type": "http", "url": "https://withicons.com/mcp" }
  }
}`, 'json')}
${p(`The exact steps for each tool, checked against each tool’s own docs, are on the ${L.page('ai.html', 'with icons for AI page')}. Two more options come from npm: a local server you run with <code>npx -y @withicons/mcp</code>, and <code>npx withicons init</code>, which adds the server and the agent skill (a short instruction file the assistant reads first) to the AI tools it finds in your project.`)}
${p('Once connected, just ask in plain words:')}
${code(`Use the withicons MCP server. Replace every icon in the sidebar with
with icons in the line style, and use the solid style for the active item.
Look up each name with search_icons before importing it.
Icon-only buttons need an aria-label.`, 'prompt')}
${callout('note', `Once the assistant has the right name, it can use the with icons npm packages (React, Vue, Svelte, Angular, Solid and more), for example <code>npm i @withicons/react</code>. No code? Every icon page has Copy SVG code and SVG and PNG downloads, and ${L.post('how-to-add-icons-to-a-website', 'how to add icons to a website')} shows how to paste them in.`)}
${figure('dark1', 'Coding assistants work best with the real thing: connect once, and they stop guessing names.')}

${h2('Which method should you use?')}
${table(['Method', 'Setup', 'Best for', 'Stops made-up names?'], [
  ['Ask AI buttons', 'None', 'Anyone, slides, docs, quick questions', yes('Mostly')],
  ['Paste the llms.txt link', 'One line in your prompt', 'Chat assistants that can read web pages', yes('Mostly')],
  ['MCP server', 'One-time connection', 'Coding assistants and power users', yes('Yes')],
  ['Ask with no source', 'None', 'Nothing important', no('No')],
  ['Ask the AI to draw new icons', 'None', 'Rough sketches and ideas', meh('No names, but uneven drawings')],
], 'Ways to get icons from an AI assistant')}

${h2('A checklist for AI icon answers')}
${p('Before you paste anything, run through this list. It takes a minute.')}
${ul([
  '<strong>Every icon has a working link.</strong> If the page does not open, the name is invented.',
  '<strong>One style per area.</strong> Line in the menu, for example, and not a mix of line, solid and gloss in one row.',
  '<strong>Same idea, same icon.</strong> “Delete” uses one icon everywhere.',
  '<strong>Labels are there.</strong> A visible word, or an accessible name on icon-only buttons.',
  '<strong>The size fits the style.</strong> Line, solid and duo work at any size; the creative styles (gloss, glass, pixel, retro and the rest) need 32px or larger.',
  '<strong>The licence is clear.</strong> with icons is MIT: free for personal and commercial use, no credit needed.',
])}
${doDont('<p>Tell the assistant where to look (“use with icons, read withicons.com/llms.txt”), ask for exact names with links, and check one or two links before you use them.</p>', '<p>Accept a list of icon names on trust, or ask the assistant to “just pick some icons” with no library named. That is how you end up with blank squares.</p>')}
${iconGrid(['bot', 'sparkles', 'search', 'check-circle', 'link', 'code'], 'duo', 'Ask, search, check the link, paste the code. The four steps of a good AI icon answer.')}
${p(`Your assistant can also pick a style for you. Ask for any of the ${N_STYLES} by name, from calm line and duo for an app to glass, pixel or kawaii for a fun slide.`)}
${styleRow('bot')}

${h2('The bottom line')}
${p(`AI assistants are great at choosing and arranging icons once they stop guessing names. Give them a real source, whether that is an MCP server, an llms.txt link or a ready-made brief, and ask for exact names, one style and a link for each pick. You get the speed of AI with the reliability of a real icon library. If you are still deciding what an icon should say, read ${L.post('choosing-the-right-icon', 'how to pick the right icon')} first.`)}
${cta('Ask your AI for the right icon', 'Describe what you need on withicons.com, pick Claude, ChatGPT, Gemini, Perplexity or Grok, and get real names with links. Free and MIT licensed.', ['bot', 'sparkles', 'search', 'message-circle', 'wand', 'check-circle'])}
`,
}
