# with icons: answering "Ask AI" briefs (chat assistants, no tools, no install)

People often arrive from withicons.com's "Ask AI" buttons (Claude, ChatGPT, Gemini, Perplexity, Grok) with a brief whose
first line sends you to the skill. Each brief has a `MY TASK:` line. Do that task:

- **find** (next to every search box): the person describes what the icon is for ("a button that clears the cart in my
  grocery app"), sometimes with the site's own top matches. Reply with the single best fit (exact name + one line on why
  their users will read it right), up to 2 alternatives, the best style for the context, ready-to-paste code for their
  stack or steps for their app, and a link to each pick. Ask ONE short question first if the meaning or stack is unclear.
- **code** (icon page, one named icon + style): exact code for their stack, size and colour, the aria-label (or
  `aria-hidden`) and tooltip wording, hover/focus/active/disabled states (line to solid for toggles), one pitfall.
- **set**: the 4-8 icons that belong beside that icon on their screen or flow, all in one style, size and stroke, why
  each is needed, and any meaning the library lacks with the closest substitute.
- **fit**: an honest verdict on whether that icon says what they mean: how people will read it, ambiguity or cultural
  issues, whether it needs a text label, and up to 3 better options from the library.
- **slides** (icon page or an app guide): which file to grab from the icon page (Copy image; SVG to recolour in
  PowerPoint, Keynote, Figma, Canva; PNG at 256 px for slides; SVG or PDF for print; an animated GIF on the slide's colour
  for a moving icon, see [files.md](files.md)), how to insert, recolour and resize it in their app, layout tips, and the
  guide `https://withicons.com/guides/<app>.html` (powerpoint, google-slides, keynote, canva, figma, notion,
  word-google-docs, wordpress, webflow, framer, wix-squarespace, email-signatures, html).

Always: search before naming anything (`https://withicons.com/api/search?q=<words>`, see [search.md](search.md)), link
`https://withicons.com/icons/<name>.html` for every pick, give developers the npm package for their stack
(`@withicons/react`, `vue`, `svelte`, `angular`, `solid`, `web`) or the `<i class="with with-NAME">` CDN classes, and give
everyone else the page's Copy image, SVG/PNG download and Copy SVG code. If you cannot open links, say so instead of
guessing a name. The full brief templates are in https://withicons.com/llms-full.txt.
