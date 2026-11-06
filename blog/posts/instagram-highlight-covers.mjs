import { p, h2, ul, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, art, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'instagram-highlight-covers',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-instagram-highlight-covers',
  stickers: [['heart', 'kawaii'], ['shopping-bag', 'sticker'], ['star', 'gloss']],
  title: 'Instagram highlight cover size, and how to add covers without posting',
  cardTitle: 'Instagram highlight covers',
  h1: 'Instagram highlight covers: <em>the size</em>, and how to add them without posting',
  dek: 'Instagram never published a highlight cover size, so the guides argue. Here is what actually works in November 2026, how to set a cover straight from your camera roll, and how to make a matching set in ten minutes.',
  description: 'Instagram highlight cover size for 2026: why there is no official number, the safe circle, adding covers from your camera roll without posting, and matching sets.',
  keywords: ['instagram highlight cover size', 'instagram highlight covers', 'how to add highlight cover without posting', 'instagram highlight icons', 'highlight cover size 2026', 'aesthetic highlight covers free'],
  about: ['Instagram', 'Instagram Stories', 'Story Highlights', 'Icon', 'PNG'],
  related: ['aesthetic-icons', 'consistent-icons', 'custom-emoji-and-stickers'],
  tldr: [
    '<strong>There is no official size.</strong> Instagram’s help explains how to pick a cover photo but gives no pixel size. Every number you see online is a convention.',
    '<strong>What works:</strong> a square image of 1080 x 1080 px (or a 1080 x 1920 story-shaped one), with the icon centred and kept inside the middle 60% or so, because Instagram crops it to a small circle.',
    '<strong>No posting needed for the cover:</strong> Edit highlight > Edit cover > tap the gallery picture at the start of the row and choose an image from your camera roll. The highlight itself still needs at least one story.',
    '<strong>Matching sets:</strong> one icon style, one icon colour, one background colour. A with icons PNG download lets you set all three, at any size.',
    '<strong>Readable small:</strong> bold, simple icons (solid, kawaii, sticker) beat thin detailed ones. Check every cover at thumbnail size before you set it.',
  ],
  faq: [
    { q: 'What is the Instagram highlight cover size in 2026?', a: 'Instagram does not publish one. Its help centre only explains how to choose a cover photo. A 1080 x 1080 px square works well for icon covers, and 1080 x 1920 px works if you also want to post the image as a story. Keep the icon centred inside the middle 60% so the circle crop never cuts it.' },
    { q: 'Can I add a highlight cover without posting it to my story?', a: 'Yes. Open the highlight, tap More (or press and hold it on your profile), tap Edit highlight, then Edit cover, and tap the gallery picture at the start of the row of stories. That opens your camera roll. Instagram does not document this button, but it is in current app versions and it is how most people set cover-only images.' },
    { q: 'Can I make a highlight with no stories in it?', a: 'No. A highlight is a collection of your stories, so it needs at least one story, from your current story or your story archive. Only the cover can come from your camera roll.' },
    { q: 'Why is my highlight cover blurry or cut off?', a: 'Usually the image is too small, or the icon sits too close to the edges. Use at least 1080 px across, keep the icon well inside the centre, and choose a simple icon with no thin lines or small text. Instagram does not say how it compresses covers, so start sharp.' },
    { q: 'Can I use free icons for a business Instagram account?', a: 'Yes, if the licence allows commercial use. with icons is MIT licensed: free for business accounts, no credit line needed. Some free marketplaces require a credit, which is awkward on a highlight cover, so check first.' },
  ],
  sources: [
    { title: 'Instagram Help Center: Add a story to your Story Highlights; Edit or delete a highlight (checked November 2026; no cover size given)', url: 'https://help.instagram.com/' },
    { title: 'Instagram: Introducing Stories Highlights and Stories Archive (December 2017)', url: 'https://about.instagram.com/blog/announcements/introducing-stories-highlights-and-stories-archive' },
    { title: 'Outfeed: Instagram highlight covers, a summary of what Instagram does and does not document (1 October 2026)', url: 'https://outfeed.ai/blog/instagram-highlight-covers/' },
    { title: 'Snappa: How to make free Instagram highlight covers (2 January 2026; 1080 x 1920 convention, camera roll covers)', url: 'https://snappa.com/blog/instagram-highlight-covers/' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Instagram has never published an official highlight cover size, which is why the guides disagree. What works today is a <strong>square image of 1080 x 1080 px</strong> (or a 1080 x 1920 px story-shaped one) with the icon <strong>centred inside the middle 60% or so</strong>, because Instagram shows the cover as a small circle. And you do not have to post the cover: in <strong>Edit highlight > Edit cover</strong>, the gallery picture at the start of the row opens your camera roll.</span>`)}
${p(`Below: the size question answered honestly, the exact taps for adding a cover without posting it, and a ten-minute way to make a matching set from ${L.icons('free icons')} in one style and colour.`)}
${callout('note', '<p>Older guides tell you to post each cover as a story first, then pick it. That has not been necessary for years: covers can come straight from your camera roll. Guides also quote “official” sizes and safe zones that range from 600 px to 720 px. Instagram’s own help pages (checked November 2026) explain choosing a cover photo but give no size at all, so treat every exact number, including ours, as a sensible convention rather than a rule.</p>', 'What changed since the old answers')}

${h2('What size should an Instagram highlight cover be?')}
${p('Since highlights launched in December 2017, each one has appeared as a circle under your bio, and that circle is what you design for. Instagram does not say how many pixels it shows or how it crops, so the safe approach is simple: a big, sharp image with the important part in the middle.')}
${table(['What', 'Use this', 'Who says so'], [
  ['Canvas for an icon cover', '1080 x 1080 px square', meh('Convention (ours)')],
  ['Canvas if you also post it as a story', '1080 x 1920 px (9:16)', meh('Convention, widely used')],
  ['Where the icon goes', 'Centred, inside the middle 60% of the width', meh('Convention')],
  ['Shape on your profile', 'A small circle: corners are cropped away', yes('Instagram')],
  ['File type', 'PNG or JPG, solid background', meh('Convention')],
  ['Official pixel size', 'None published', no('Not documented')],
], 'Instagram highlight cover sizes: what is documented and what is convention (checked November 2026).')}
${p('Why a square? When you pick a cover, Instagram lets you drag and zoom the image inside a circle. A square image fills that circle evenly, so lining up a set of covers takes seconds. A 1080 x 1920 image works too, but you have to zoom in on its middle every time.')}
${art('m-instagram-highlight-covers-safe-circle', 'Design on a square, keep the icon inside the safe circle, and the crop can never cut it.', { brief: 'A 1080 x 1080 square canvas in a soft brand colour with a with icons shopping-bag icon (solid style, white) in the centre. Overlay a dashed circle the full width of the square labelled "What Instagram shows", and a smaller dotted circle about 60% wide labelled "Keep the icon in here". On the right, the same cover shown tiny inside a profile-style row of five circles, to show how small it ends up.' })}

${h2('How do I add a highlight cover without posting it to my story?')}
${p('You only need the cover image saved on your phone. Download it (see the next section), save it to your photos, then:')}
${steps([
  ['Open the highlight', 'On your profile, press and hold the highlight, or open it and tap More in the bottom corner.'],
  ['Tap Edit highlight, then Edit cover', 'You will see a row of the stories inside that highlight.'],
  ['Tap the gallery picture at the start of the row', 'It opens your camera roll. Pick your cover image.'],
  ['Line it up in the circle', 'Drag and pinch so the icon sits in the middle, then tap Done.'],
])}
${p('Making a brand-new highlight works the same way: on your profile tap New (or the plus button, then Story highlight), choose at least one story from your archive, tap Next, then Edit cover. Instagram’s help explains choosing a cover photo with Edit cover, but it does not mention the gallery button. It is there in current app versions on iPhone and Android, and it is the reason nobody needs to post covers any more.')}
${callout('tip', '<p>Not seeing the gallery picture? Update the app first. If it is still missing, the workaround is to share the cover as a story to a Close Friends list with one trusted person, add it to the highlight, set it as the cover, then remove that story from the highlight. Others report the cover stays after the story is removed.</p>', 'If your app looks different')}
${p('One thing you cannot skip: a highlight is a collection of stories, so it needs at least one. Only the cover can come from outside your stories.')}

${h2('How do I make a matching set of highlight covers?')}
${p('A row of covers looks deliberate when three things match: the <strong>icon style</strong>, the <strong>icon colour</strong> and the <strong>background colour</strong>. Every with icons icon page lets you set all three and download a PNG, so a full set takes about ten minutes:')}
${steps([
  ['Pick one style for the whole set', `Open any icon, such as the ${L.icon('heart', 'heart icon')}, and choose a style. Bold ones read best in a small circle: solid, kawaii, sticker or bento.`],
  ['Set the icon colour', 'Pick a swatch or type your brand’s hex code. Multi-colour styles like kawaii come with hand-picked palettes instead.'],
  ['Open Download and choose PNG', 'Under Options, set Background to Custom and type your background hex code. Set Size to Custom and type 1080 (or use 1024).'],
  ['Give it room', 'Set Space around to Large, so the icon stays well inside the circle.'],
  ['Repeat for each highlight', 'The page remembers your choices, so the next icons come out matching. Save them all to your phone.'],
])}
${p(`Here are three ready-made sets you could build that way, one per style. Each tile links to its icon page:`)}
${iconGrid(['shopping-bag', 'star', 'help-circle', 'mail', 'calendar', 'sparkles'], 'solid', 'A shop set in solid style: Shop, Reviews, FAQ, Contact, Events, New.')}
${iconGrid(['plane', 'camera', 'utensils', 'map-pin', 'coffee', 'heart'], 'kawaii', 'A travel and lifestyle set in kawaii style.')}
${iconGrid(['lightbulb', 'book-open', 'users', 'trophy', 'gift', 'message-circle'], 'sticker', 'A creator set in sticker style: Tips, Guides, Community, Wins, Giveaways, Q&amp;A.')}
${p(`Not sure which look fits your feed? The same icon comes in ${N_STYLES} styles, so you can try a few before you commit:`)}
${styleRow('shopping-bag', 'One “Shop” cover idea in eight styles. Pick one and use it for every highlight.', { styles: ['line', 'solid', 'duo', 'kawaii', 'sticker', 'bento', 'pastel', 'retro'] })}
${p(`For more on picking one look and sticking to it, see ${L.post('aesthetic-icons', 'aesthetic icons for your feed')} and ${L.post('consistent-icons', 'how to keep icons consistent')}. The ${L.page('free/cute-icons.html', 'cute icons collection')} is a good place to browse if your account is playful.`)}

${h2('Which icons work for common highlights?')}
${p('Most accounts use the same dozen highlight names. These icons say each one without words, which matters because the name under the circle gets cut off after a few characters.')}
${table(['Highlight', 'Icon', 'Why it works'], [
  ['Shop', L.icon('shopping-bag'), 'Recognised everywhere, solid shape'],
  ['Reviews', L.icon('star'), 'Five-star ratings taught everyone this one'],
  ['FAQ', L.icon('help-circle'), 'A question mark reads at any size'],
  ['About', L.icon('user'), 'Simple head and shoulders'],
  ['Menu', L.icon('utensils'), 'Fork and knife: food, instantly'],
  ['Contact', L.icon('mail'), 'Clearer than a phone for DMs and email'],
  ['Events', L.icon('calendar'), 'Dates and launches'],
  ['Offers', L.icon('tag'), 'Price tag, no text needed'],
  ['Travel', L.icon('plane'), 'Strong silhouette'],
  ['Behind the scenes', L.icon('camera'), 'Works for process and studio stories'],
], 'Icon ideas for the most common Instagram highlight names.')}

${h2('How do I keep highlight covers readable at small sizes?')}
${p('On a phone, a highlight circle is only about the size of a fingertip. A cover that looks lovely full screen can turn into a smudge at that size. Here is the same set shrinking down:')}
${sizeRamp(['shopping-bag', 'star', 'help-circle', 'mail'], [20, 28, 40, 56], 'solid', 'Solid icons stay readable even at the smallest sizes, which is why they make good covers.')}
${ul([
  '<strong>One idea per cover.</strong> One icon, no words. The highlight already has a name underneath.',
  '<strong>Strong contrast.</strong> Dark on light or light on dark. Pale pink on cream looks gentle but disappears in the circle.',
  '<strong>Bold over thin.</strong> Fine line icons get faint when shrunk. If you love the line look, use a darker colour and a larger icon.',
  '<strong>Same size every time.</strong> Keep Space around the same for the whole set, so no icon looks bigger than the rest.',
  '<strong>Check it small.</strong> Before you set a cover, look at it on your phone at thumbnail size. If you squint, simplify.',
])}
${doDont('<p>Use one bold icon, centred, in one colour on a solid background, with the same spacing for every cover.</p>', '<p>Put words, photos and tiny details on a cover, or mix three icon styles in one row. It looks busy and nothing reads.</p>')}
${art('m-instagram-highlight-covers-before-after', 'Same five highlights, before and after: one style, one colour, one background.', { brief: 'Two profile-style rows of five highlight circles with short names below (Shop, Reviews, FAQ, Menu, Contact). Top row labelled "Before": mixed random photos and a mix of icon styles, cluttered. Bottom row labelled "After": the with icons shopping-bag, star, help-circle, utensils and mail icons in solid style, white on one brand colour, all centred and the same size. No Instagram logo or UI chrome, just the circles and names.' })}

${h2('Can I use free icons on a business account?')}
${p(`Yes, as long as the licence allows commercial use. with icons is MIT licensed, so you can use every icon on a business account, in ads and on products with no credit line. That matters here: there is nowhere sensible to put a credit on a highlight cover. Some free marketplaces do require one, so read their terms first. Our guides on ${L.post('free-icons-commercial-use', 'free icons for commercial use')} and ${L.post('free-icons-no-attribution', 'icons with no attribution')} explain the licences in plain English.`)}
${p(`If you design in Canva instead, you can drop a downloaded PNG onto a 1080 x 1080 design and add your background there. Our ${L.guide('canva', 'Canva guide')} shows how.`)}

${h2('The short answer')}
${p(`Instagram publishes no highlight cover size, so use a 1080 x 1080 px square with one bold icon in the middle 60%. Set it from your camera roll with Edit highlight > Edit cover > the gallery picture: no posting needed. For a matching set, pick one style and two colours, and download every cover with the same settings from ${L.icons(`the ${N_ICONS} free icons`)}.`)}
${cta('Make your highlight set in ten minutes', `${N_ICONS} free icons in ${N_STYLES} styles. Pick a colour and background, download a PNG at any size. MIT licensed, no sign-up, no credit needed.`, ['shopping-bag', 'star', 'heart', 'camera', 'mail', 'sparkles'])}
`,
}
