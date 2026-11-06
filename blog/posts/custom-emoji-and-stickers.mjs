import { p, h2, h3, ul, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, art, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'custom-emoji-and-stickers',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-custom-emoji-and-stickers',
  stickers: [['party-popper', 'sticker'], ['thumbs-up', 'kawaii'], ['rocket', 'gloss']],
  title: 'How to make custom emoji and stickers for Slack, Discord and WhatsApp',
  cardTitle: 'Custom emoji and stickers',
  h1: 'Custom emoji and stickers for <em>Slack, Discord, Notion and WhatsApp</em>',
  dek: 'The strict “128 x 128 PNG only” charts are out of date. Here are the real limits for each app in November 2026, WhatsApp’s built-in sticker maker, PNG versus GIF, and how to make a team set that matches.',
  description: 'Custom emoji and sticker sizes for Slack, Discord, Notion and WhatsApp in 2026: real file limits, WhatsApp’s built-in sticker maker, GIF vs PNG, and matching sets.',
  keywords: ['custom emoji size', 'discord emoji size', 'slack custom emoji', 'notion custom emoji', 'make whatsapp stickers', 'whatsapp sticker size', 'custom emoji for slack and discord'],
  about: ['Emoji', 'Slack', 'Discord', 'Notion', 'WhatsApp', 'Sticker', 'PNG', 'GIF'],
  related: ['emoji-vs-icons', 'instagram-highlight-covers', 'animated-icons'],
  tldr: [
    '<strong>One file works almost everywhere:</strong> a square, transparent PNG of about 128 to 256 px, kept under 128 KB, uploads to Slack, Discord and Notion.',
    '<strong>Slack:</strong> square, under 128 KB, JPG, PNG or GIF (up to 50 frames). <strong>Discord:</strong> 128 x 128 is only a recommendation now; it resizes and crops on upload, files under 256 KB.',
    '<strong>Notion:</strong> custom emoji arrived in October 2024. Add them in Settings > Emoji, or tick “Add to workspace Emoji library” when you upload a page icon.',
    '<strong>WhatsApp:</strong> no extra app needed since 2024. Open stickers in a chat, tap Create and pick an image. Sticker apps still need 512 x 512 WebP files under 100 KB.',
    '<strong>Animated:</strong> GIF works in Slack and Discord but has rough edges on dark themes. Choose the edge colour to match the chat, or stay with a still PNG.',
  ],
  faq: [
    { q: 'What size should a Discord emoji be?', a: 'Discord recommends 128 x 128 px, but since its uploader started resizing and cropping for you, bigger or smaller images work too. The help centre says files must be under 256 KB, and Discord’s own guide says it compresses larger ones. JPEG, PNG, GIF and WebP are accepted.' },
    { q: 'What are Slack’s custom emoji requirements?', a: 'Slack says square images under 128 KB with transparent backgrounds work best, in JPG, PNG or GIF format, and GIFs can have up to 50 frames. You add them from the emoji menu on desktop or iOS, not from the Android app, and your workspace owner can limit who adds them.' },
    { q: 'How do I make WhatsApp stickers without another app?', a: 'Open a chat, open the sticker tray, tap Create and pick a picture from your phone. Edit it with the text and drawing tools and send it: WhatsApp saves it to your stickers. Tap and hold a sticker and choose Add to sticker pack to group them. The built-in maker reached Android in August 2024, after iPhone.' },
    { q: 'Can I add custom emoji in Notion?', a: 'Yes, since October 2024. Go to Settings > Emoji > Add emoji, or type /emoji and press the plus button. When you upload a page icon you can also tick Add to workspace Emoji library. Workspace owners can limit who creates them.' },
    { q: 'Should I use PNG or GIF for animated emoji?', a: 'Use GIF for animated emoji in Slack and Discord, because that is what they play. GIF edges are either fully on or off, so choose an edge colour that matches the chat theme. For still emoji, PNG has smoother edges. Discord stickers can be animated PNG (APNG).' },
    { q: 'Can I use free icons as custom emoji at work?', a: 'Yes, if the licence allows it. with icons is MIT licensed, so you can turn any icon into team emoji or stickers, at work or for a community, with no credit needed. Avoid brand logos and other people’s characters.' },
  ],
  sources: [
    { title: 'Slack Help Center: Add custom emoji and aliases to your workspace (checked November 2026)', url: 'https://slack.com/help/articles/206870177-Add-custom-emoji-and-aliases-to-your-workspace' },
    { title: 'Discord Support: How to add custom emojis on Discord (checked November 2026)', url: 'https://support.discord.com/hc/en-us/articles/360036479811-Custom-Emojis' },
    { title: 'Discord Blog: How to make and use custom emoji on Discord (12 December 2025)', url: 'https://discord.com/blog/beginners-guide-to-custom-emojis' },
    { title: 'Discord Support: Tips for sticker creators (checked November 2026)', url: 'https://support.discord.com/hc/en-us/articles/4402687377815-Custom-Stickers-for-Servers' },
    { title: 'Notion Help: Workspace settings, Emoji (checked November 2026)', url: 'https://www.notion.com/help/workspace-settings' },
    { title: 'Notion Help: Style and customize your page, page icons and emoji', url: 'https://www.notion.com/help/customize-and-style-your-content' },
    { title: 'Notion release notes: 2.46, custom emoji (24 October 2024)', url: 'https://www.notion.com/en-gb/releases/2024-10-24' },
    { title: 'Notion Blog: How we built custom emoji (1 February 2025)', url: 'https://www.notion.com/blog/how-we-built-custom-emoji' },
    { title: 'WhatsApp Help Center: How to create and share custom stickers and sticker packs', url: 'https://faq.whatsapp.com/1056840314992666/' },
    { title: 'WhatsApp Help Center: How to design custom stickers', url: 'https://faq.whatsapp.com/4148445205479237' },
    { title: 'WhatsApp Blog: Express yourself with more stickers (14 August 2024)', url: 'https://blog.whatsapp.com/express-yourself-with-more-stickers' },
    { title: 'WhatsApp stickers sample apps: Android README (sticker pack rules)', url: 'https://github.com/WhatsApp/stickers/blob/main/Android/README.md' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">To make a custom emoji, upload a <strong>square, transparent PNG of about 128 to 256 px, under 128 KB</strong>: that one file works in Slack, Discord and Notion. Discord no longer needs an exact 128 x 128 image, because its uploader resizes and crops for you. For WhatsApp you need no extra app: open the sticker tray in any chat, tap <strong>Create</strong> and pick an image.</span>`)}
${p(`Below: each app’s real limits in one table, the exact steps for each, when to use GIF instead of PNG, and how to make a set of team emoji that look like they belong together, using ${L.icons('free icons')} in one style.`)}
${callout('note', '<p>The size charts that still rank say every Discord emoji must be exactly 128 x 128 px. Discord’s own guide from December 2025 calls that rule a thing of the past: you can upload almost any image and crop it as you go. Notion added workspace custom emoji in October 2024, so earlier guides say it cannot be done. And WhatsApp guides that send you to third-party sticker apps predate the built-in sticker maker, which reached Android in August 2024 after iPhone.</p>', 'What changed since the old answers')}

${h2('What are the custom emoji and sticker limits for each app?')}
${table(['App', 'Make it', 'File limit', 'Formats', 'Good to know'], [
  ['Slack emoji', 'Square, transparent', 'Under 128 KB', 'JPG, PNG, GIF (up to 50 frames)', 'Desktop or iOS only; owners can restrict who adds'],
  ['Discord emoji', '128 x 128 recommended, any size accepted', 'Under 256 KB', 'JPEG, PNG, GIF, WebP', '50 emoji + 50 animated per server, up to 250 each when boosted'],
  ['Discord stickers', 'Exactly 320 x 320', '512 KB', 'PNG, or APNG for animated', 'Shown at 160 x 160; slots come with server Boosts'],
  ['Notion emoji', 'Square (page icons ideally 280 x 280)', 'Not stated', 'Images you upload', 'Since Oct 2024; 500 per workspace at launch'],
  ['WhatsApp, built-in maker', 'Any photo or image', 'Handled for you', 'From your gallery', 'Saved to your stickers; group them into packs'],
  ['WhatsApp, sticker apps', 'Exactly 512 x 512, 16 px margin', '100 KB (500 KB animated)', 'WebP, transparent', 'Packs of 3 to 30; a 96 x 96 tray icon under 50 KB'],
], 'Custom emoji and sticker limits from each app’s own help pages, checked November 2026.')}
${p('Discord’s two pages disagree slightly: the help centre says emoji “must be under 256KB”, while the December 2025 guide says it will compress a bigger file for you. Staying under 256 KB avoids the question. Notion’s 500 limit comes from its engineering blog in February 2025, which called it a limit “for now”, so it may have grown since.')}
${art('m-custom-emoji-and-stickers-canvas-sizes', 'The canvas each app wants, side by side, with one icon drawn at each.', { brief: 'Four square canvases drawn to scale side by side, each with the same with icons rocket icon in kawaii style centred: 128 px labelled "Slack and Discord emoji", 280 px labelled "Notion page icon", 320 px labelled "Discord sticker", 512 px labelled "WhatsApp sticker" with a thin dotted 16 px margin line inside. Under each, its file limit in small text (128 KB, 256 KB, not stated, 100 KB). Light checkerboard backgrounds to show transparency.' })}

${h2('How do I add a custom emoji in Slack?')}
${steps([
  ['Open the emoji menu', 'On desktop, click the smiley face in the message box.'],
  ['Click Add Emoji, then Upload Image', 'Pick your square PNG. Slack says images under 128 KB with transparent backgrounds work best.'],
  ['Give it a name and save', 'The name becomes its code, like :ship-it:. Keep names short and easy to guess.'],
])}
${p('On iPhone, tap the smiley, type a name, tap Add custom emoji and follow the prompts. Slack’s Android app cannot add custom emoji yet. If the button is missing, your workspace owner has limited who can add them, so ask an admin.')}

${h2('How do I add a custom emoji on Discord?')}
${steps([
  ['Open Server Settings > Emoji', 'You need to own the server or have the Create Expressions permission.'],
  ['Upload your image', 'Any size is fine: Discord lets you resize and crop as you upload. 128 x 128 px is still its suggestion.'],
  ['Name it', 'At least 2 characters, letters, numbers and underscores only.'],
])}
${p('On desktop and in the browser you can also press Add Emoji in the emoji picker, which opens Discord’s new Emoji Studio (rolling out gradually, not on mobile). Every server gets 50 regular and 50 animated slots, rising to 100, 150 and 250 of each with Boost levels 1, 2 and 3. Discord’s guide says members need Nitro to use animated emoji, and to use a server’s emoji in other servers.')}
${h3('And Discord stickers?')}
${p('Stickers are bigger and stricter: exactly 320 x 320 px, PNG (or APNG to animate), up to 512 KB, uploaded in Server Settings > Stickers. Discord asks for a matching emoji and suggests an optional description for screen reader users. Make the artwork fill most of the canvas, since stickers show at 160 x 160 in chat.')}

${h2('How do I add a custom emoji in Notion?')}
${p(`Notion has had workspace custom emoji since 24 October 2024. There are three ways in:`)}
${ul([
  '<strong>Settings > Emoji > Add emoji</strong> to upload a file and manage the whole library.',
  '<strong>Type /emoji</strong> in a page and press the <strong>+</strong> at the bottom, then upload, name and save.',
  '<strong>Upload a page icon</strong> and tick <strong>Add to workspace Emoji library</strong>. Notion suggests 280 x 280 px for page icons.',
])}
${p(`Anyone in the workspace can then use it as a page icon, a reaction or inline. Owners can switch on “Limit custom emoji creation to workspace owners”. Our ${L.guide('notion', 'Notion guide')} covers page icons in more detail.`)}

${h2('How do I make WhatsApp stickers without another app?')}
${p('WhatsApp has its own Custom Sticker Maker. It came to iPhone first and, according to WhatsApp’s blog, to Android on 14 August 2024. Save your image to your phone’s photos, then:')}
${steps([
  ['Open the sticker tray in any chat', 'Tap the sticker icon in the message box (on Android, the emoji icon, then Stickers).'],
  ['Tap Create', 'On Android, if your photos do not show, tap Recents > See more > Photos.'],
  ['Pick your image and edit it', 'Choose one of the preset options, then add text, an emoji or a drawing if you like.'],
  ['Send it', 'WhatsApp saves it to your stickers automatically. Tap and hold it and choose Add to sticker pack to group a set.'],
])}
${p(`Our ${L.style('sticker')} has a puffy white die-cut border built in, which is exactly what WhatsApp recommends so stickers stand out on any chat wallpaper. Download a 512 px PNG with a see-through background and it is ready.`)}
${callout('tip', '<p>Only making stickers to publish as an app? Then the strict rules apply: every sticker exactly 512 x 512 px, transparent WebP, under 100 KB (500 KB animated), a 16 px margin, and 3 to 30 stickers per pack, plus a 96 x 96 tray icon. For your own chats, the built-in maker is far simpler.</p>', 'Sticker apps are a different job')}

${h2('Should I use PNG or GIF for animated emoji?')}
${p('Use a still <strong>PNG</strong> unless the emoji really needs to move. PNG has smooth, see-through edges on any background. A <strong>GIF</strong> is what Slack and Discord play for animated emoji, but its transparency is on or off with nothing in between, so soft edges get a fringe of whatever colour they were blended with.')}
${table(['Format', 'Animates?', 'Edges', 'Use it for'], [
  ['PNG', no('No'), yes('Smooth on any background'), 'Still emoji everywhere'],
  ['GIF', yes('Yes'), meh('Blended with one colour'), 'Animated emoji in Slack and Discord'],
  ['Animated PNG (APNG)', yes('Yes'), yes('Smooth'), 'Animated Discord stickers'],
  ['WebP', meh('Can'), yes('Smooth'), 'WhatsApp sticker apps, Discord emoji'],
], 'Which file to use for custom emoji and stickers.')}
${p(`The with icons GIF download asks for the colour the GIF will sit on and blends the edges into it. Pick white for Slack’s light theme or a dark grey for Discord’s dark theme, and the fringe disappears. Icons with built-in motion can also be downloaded as animated PNG and animated WebP. Our post on ${L.post('animated-icons', 'animated icons')} explains when motion helps and when it distracts.`)}
${art('m-custom-emoji-and-stickers-gif-edges', 'GIF edges need a matching background colour; PNG does not care.', { brief: 'A do/don’t pair on a dark chat-like background (no app logos or UI). Left, labelled "GIF blended for white": a with icons heart icon in kawaii style with a visible pale halo around its edge. Right, labelled "GIF blended for dark" next to "PNG": the same icon with clean edges. Zoomed insets show the edge pixels.' })}

${h2('How do I make a team emoji set that matches?')}
${p('A matching set looks intentional and is easier to read at a glance. Pick one style and one colour, then make every emoji the same way:')}
${steps([
  ['Choose a style that reads small', `Emoji show at about the height of a line of text. Bold styles hold up best: ${L.style('solid')}, ${L.style('kawaii')} or ${L.style('sticker')}.`],
  ['Choose a colour', 'Use your brand colour, or one of the hand-picked palettes for the multi-colour styles.'],
  ['Download PNG at 256 px, see-through', 'Set Space around to Small, so the icon fills most of the square without touching the edges. Check the file is under 128 KB for Slack.'],
  ['Name them the way your team talks', 'Short, lowercase codes like :ship-it:, :on-it:, :blocked:. Add aliases in Slack for other spellings.'],
])}
${iconGrid(['rocket', 'check-circle', 'eye', 'alert-triangle', 'lightbulb', 'hourglass', 'party-popper', 'coffee', 'thumbs-up', 'flame', 'heart', 'message-circle'], 'kawaii', 'A twelve-piece team set in kawaii style: ship it, done, looking, blocked, idea, waiting, launch, break, agree, hot, thanks, discuss.')}
${p('Small sizes are the real test. The same icons in two styles, from emoji size up to sticker size:')}
${sizeRamp(['rocket', 'check-circle', 'eye', 'party-popper'], [18, 22, 32, 48], 'solid', 'Solid icons stay clear at 18 to 22 px, about the size an emoji appears in a message.')}
${styleRow('party-popper', 'One “launch” emoji in eight styles. Choose one and use it for the whole set.', { styles: ['solid', 'duo', 'kawaii', 'sticker', 'gloss', 'pixel', 'plush', 'clay'] })}
${doDont('<p>Use one style and one colour for the whole set, keep a little space around each icon, and test it next to a line of text in the actual app.</p>', '<p>Mix three icon styles, use thin outlines on a dark theme, or upload a big detailed picture and hope it shrinks well.</p>')}
${p(`If your community likes cute, browse the ${L.page('free/cute-icons.html', 'cute icons')} and ${L.page('free/sticker-icons.html', 'sticker icons')} collections. Wondering when an emoji beats an icon in the first place? See ${L.post('emoji-vs-icons', 'emoji or icons: which should you use?')}`)}

${h2('Can I use free icons as custom emoji?')}
${p(`Yes, if the licence allows it. with icons is MIT licensed, so you can turn any icon into emoji or stickers for a company workspace, a Discord community or your family group, with no credit line. Leave out brand logos and characters you do not own: Discord asks that you have the rights to whatever you upload, and WhatsApp says stickers must be legal, authorized and acceptable. Our guide to ${L.post('free-icons-commercial-use', 'free icons for commercial use')} explains the licences.`)}

${h2('The short answer')}
${p(`Make a square, transparent PNG at 128 to 256 px and under 128 KB, and it will upload to Slack, Discord and Notion. Use 320 x 320 for Discord stickers and the built-in Create button for WhatsApp. Use GIF only when it must move, with the edge colour set to the chat theme. For a set that matches, pick one style and one colour from ${L.icons(`${N_ICONS} free icons`)}.`)}
${cta('Make your team’s emoji set', `${N_ICONS} free icons in ${N_STYLES} styles. Download see-through PNGs at any size, or GIFs that move. MIT licensed, no sign-up.`, ['party-popper', 'thumbs-up', 'rocket', 'heart', 'coffee', 'sparkles'])}
`,
}
