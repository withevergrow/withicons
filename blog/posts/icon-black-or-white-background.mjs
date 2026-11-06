import { p, h2, ul, art, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'icon-black-or-white-background',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-icon-black-or-white-background',
  stickers: [['image', 'duo'], ['wand-sparkles', 'gloss'], ['eraser', 'sticker']],
  title: 'Why does my transparent icon get a black or white background?',
  cardTitle: 'Icon got a black or white box?',
  h1: 'Why does my transparent icon get a <em>black or white</em> background?',
  dek: 'You paste a see-through icon and it lands in a black or white box. Here is what causes it in 2026, how to remove a white background with the apps you already have, and the clean way to avoid it.',
  description: 'Why a transparent icon turns black or white when you paste or save it, how to remove a white background in PowerPoint, Paint, Preview or Canva, and the clean fix.',
  keywords: ['transparent png black background', 'pasted image black background', 'icon white background', 'remove white background from icon', 'make png transparent', 'paint 3d remove background', 'set transparent color powerpoint'],
  about: ['Transparency (graphic)', 'Portable Network Graphics', 'Clipboard (computing)', 'Background removal'],
  related: ['svg-vs-png-icons', 'png-to-svg', 'canva-transparent-png'],
  tldr: [
    '<strong>Black box after pasting?</strong> The clipboard handed the app an old-style bitmap that has no transparency, so the clear parts arrive as black (or white). Save the file and insert it instead.',
    '<strong>White box after saving?</strong> The image was turned into a JPG somewhere. JPG has no transparency at all, so see-through pixels become white.',
    '<strong>Grey-and-white squares in your slide?</strong> The checkerboard is painted into the picture. It was never transparent: get the image from another source.',
    '<strong>To remove a white background today:</strong> Remove Background or Set Transparent Color in PowerPoint and Word, Remove background in Windows Paint or Photos, the Remove Background button or Instant Alpha in Preview on a Mac. Paint 3D was removed from the Microsoft Store on 4 November 2024.',
    `<strong>The clean way:</strong> download the icon as a transparent PNG or an SVG. Every with icons PNG is see-through unless you pick a background, across ${N_SVGS} SVGs.`,
  ],
  faq: [
    { q: 'Why does my PNG turn black when I paste it?', a: 'Copying an image puts it on the clipboard in several formats. The oldest Windows bitmap format does not carry transparency reliably, so an app that reads that copy fills the clear pixels with black. Save the PNG as a file and use Insert > Pictures (or the app’s upload button): a saved file keeps its transparency.' },
    { q: 'Why does my transparent image have a white background after I download it?', a: 'Most often it was saved or converted as a JPG, which cannot store transparency, so the clear parts become white. It can also be a “fake PNG” whose checkerboard or white is part of the picture. Check the file type and open it on a dark background to see what is really there.' },
    { q: 'How do I remove a white background from an icon for free?', a: 'On Windows, open it in Paint, click Remove background and save as PNG. On a Mac, open it in Preview and click the Remove Background button, or use Instant Alpha in the Markup toolbar. In PowerPoint or Word, use Picture Format > Remove Background, or Color > Set Transparent Color for a flat white.' },
    { q: 'Can I still use Paint 3D to remove a background?', a: 'Not if you do not already have it. Microsoft deprecated Paint 3D in August 2024 and removed it from the Microsoft Store on 4 November 2024. Existing installs still run, but Microsoft points people to Paint and Photos, which both have one-click background removal.' },
    { q: 'Why did Set Transparent Color remove parts of my icon?', a: 'It makes one colour see-through everywhere in the picture, not just around the edges. If your icon has white details inside it, those vanish too. Use Remove Background instead, or download a properly transparent icon.' },
    { q: 'Why does a transparent PNG look like it has a box in Google Slides or Docs?', a: 'Usually the image already has a solid or checkerboard background baked in. Google Slides and Docs keep real PNG transparency when you insert the file, so try inserting a downloaded PNG rather than pasting, and check that the source image is truly transparent.' },
  ],
  sources: [
    { title: 'Microsoft Learn: Resources for deprecated features (Paint 3D removed from the Store on 4 Nov 2024), checked Nov 2026', url: 'https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features-resources' },
    { title: 'Windows Insider Blog: Background removal in Paint (7 Sep 2023)', url: 'https://blogs.windows.com/windows-insider/2023/09/07/background-removal-in-paint-begins-rolling-out-to-windows-insiders/' },
    { title: 'Windows Insider Blog: Paint layers and transparency, PNG support (18 Sep 2023)', url: 'https://blogs.windows.com/windows-insider/2023/09/18/paint-app-update-adding-support-for-layers-and-transparency-begins-rolling-out-to-windows-insiders/' },
    { title: 'Windows Insider Blog: Photos background remove and replace (17 Nov 2023)', url: 'https://blogs.windows.com/windows-insider/2023/11/17/windows-photos-gets-background-remove-and-replace-along-with-other-improvements/' },
    { title: 'Microsoft Support: Remove the background of a picture (Office), checked Nov 2026', url: 'https://support.microsoft.com/en-us/office/remove-the-background-of-a-picture-c0819a62-6844-4190-8d67-6fb1713a12bf' },
    { title: 'Microsoft Support: Make a picture transparent in Word (Set Transparent Color), checked Nov 2026', url: 'https://support.microsoft.com/en-us/word/make-a-picture-transparent-in-word' },
    { title: 'Apple Support: Remove a background or extract an image in Preview on Mac, checked Nov 2026', url: 'https://support.apple.com/guide/preview/remove-a-background-or-extract-an-image-prvw15636/mac' },
    { title: 'Apple Support: Mark up files on Mac (Instant Alpha), checked Nov 2026', url: 'https://support.apple.com/guide/mac-help/mark-up-files-mchl1fd88863/mac' },
    { title: 'Apple Support: Lift a subject from the photo background on iPhone, checked Nov 2026', url: 'https://support.apple.com/guide/iphone/lift-a-subject-from-the-photo-background-iphfe4809658/ios' },
    { title: 'Canva Help: Remove photo and video backgrounds (paid plans), checked Nov 2026', url: 'https://www.canva.com/help/background-remover/' },
    { title: 'MDN: Image file type and format guide (JPEG has no alpha channel), checked Nov 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types' },
    { title: 'MDN: ClipboardItem.supports() (image/png is always supported), checked Nov 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/supports_static' },
    { title: 'Super User: Copying PNG with transparency shows a black background (2011)', url: 'https://superuser.com/questions/237784' },
    { title: 'PC Glance: Transparent image pastes black, a clipboard test (14 Oct 2026)', url: 'https://pcglance.com/transparent-image-pastes-black/' },
  ],
  body: () => `
${p(`<span class="lede">A transparent icon gets a black or white background for one of four reasons: it was <strong>pasted</strong> through a clipboard format that drops transparency (often black), it was <strong>saved as a JPG</strong>, which cannot be transparent (white), the “transparent” checkerboard was <strong>painted into the picture</strong>, or the app put a white box behind it. The fix that always works is to download a real transparent PNG or SVG and insert the file, rather than pasting.</span>`)}
${art('m-icon-black-or-white-background-four-causes', 'Four ways a see-through icon ends up in a box, and the fix for each.', { brief: 'A 2x2 grid of small cards. Each card shows the same with icons rocket (duo style) on a light slide: 1) in a black square, labelled “Pasted”; 2) in a white square, labelled “Saved as JPG”; 3) on a grey-and-white checkerboard, labelled “Fake PNG”; 4) floating cleanly with no box, labelled “Real PNG or SVG” with a green check. Short fix line under each: “Insert the file”, “Save as PNG”, “Get a new copy”, “Done”.' })}

${h2('Why does my transparent icon turn black or white?')}
${p('A transparent image stores one extra number for every pixel: how see-through it is. Designers call this the <strong>alpha channel</strong>. PNG keeps it. Lose it anywhere on the way to your slide, and the app has to guess a colour for the empty pixels: usually black or white.')}
${table(['What you see', 'Most likely cause', 'Quick fix'], [
  ['A black box after pasting', 'The app read an old clipboard bitmap with no transparency', 'Save the image, then Insert > Pictures'],
  ['A white box after saving or converting', 'The file became a JPG', 'Download or save it as PNG'],
  ['Grey and white squares on your slide', 'A “fake PNG”: the checkerboard is part of the picture', 'Get the icon from a better source'],
  ['A white box only on a dark slide', 'The icon really has a white background', 'Remove it (see below) or re-download'],
  ['The icon seems to vanish on a dark slide', 'Not a box at all: a dark icon on a dark background', 'Pick a light colour before downloading'],
], 'What a background box usually means, and the fastest fix (checked November 2026).')}
${p(`That last row catches lots of people. If your icon is black and your slide is dark, the transparency is working perfectly; you just cannot see the icon. Our post on ${L.post('dark-mode-icons', 'icons in dark mode')} covers picking colours that work on both.`)}

${h2('Why does pasting an image give it a black background?')}
${p('When you copy a picture, the computer puts it on the clipboard in several formats at once, so each app can pick the one it understands. Windows’ oldest picture format there is a plain bitmap, and it does not carry transparency reliably. An app that takes that copy fills the clear pixels with black, or sometimes white.')}
${p('This is why the old answers disagree. A famous 2011 Super User answer says simply that copy and paste does not keep transparency. That is only partly true today. Browsers can also put a real PNG on the clipboard (the web’s clipboard standard requires browsers to support PNG), and a 2026 test reported that current Word and PowerPoint kept transparency when they received that PNG copy from Chrome. Copy the same image from a PDF reader or an older app that only offers the bitmap, and the black comes back.')}
${p('Copy buttons on icon sites, ours included, put a PNG on the clipboard. Whether the app you paste into reads the PNG or the bitmap is up to that app, so the result can still vary. When it matters, use the file.')}
${steps([
  ['Save the image instead of copying it', `Right-click and choose Save image as, or use the site’s download button. On any with icons page, Download gives you a PNG at the size and colour you choose.`],
  ['Insert the file', 'In PowerPoint, Word or Keynote, use Insert > Pictures (or drag the file in). In Google Slides, Docs, Canva or Notion, use the upload button.'],
  ['Check it on a coloured background', 'Put a coloured shape behind the icon. If the colour shows through around the icon, it is truly transparent.'],
])}

${h2('Why does my PNG have a white background after I save it?')}
${p('Because it is not a PNG any more. JPG (also written JPEG) is great for photos, but it has no alpha channel at all, so every see-through pixel has to become a solid colour, almost always white. It happens quietly: a “Save as JPG” default, an upload form that only takes JPG, or an online compressor.')}
${p(`Check the file name ending (.png or .jpg) and the file type in your computer’s file info. If you need transparency, keep it PNG, WebP or SVG. Our ${L.guide('which-file', 'which file should I use?')} guide explains the formats in one page, and ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')} goes deeper.`)}

${h2('Why do I see a grey and white checkerboard in my image?')}
${p('In editing apps, a grey-and-white checkerboard is the standard way to <em>show</em> transparency: it is drawn on screen behind the picture, not saved in it. Some download sites go one step further and save the checkerboard into the picture itself, so the preview looks transparent but the file is not. People call these “fake PNGs”.')}
${art('m-icon-black-or-white-background-fake-png', 'A real transparent PNG and a fake one look the same on a white page. A dark background tells them apart.', { brief: 'Side-by-side before/after on a dark navy slide. Left: a with icons heart icon (solid style) with a grey-and-white checkerboard square stuck behind it, red label “Fake PNG: checkerboard is in the picture”. Right: the same heart floating cleanly on the navy, green label “Real PNG: only the heart”. Above both, a thin strip showing the two files looking identical on white.' })}
${p('The quick test: put the image on a dark coloured shape. A real transparent PNG shows only the icon. A fake one brings its checkerboard (or a white square) along. If it is fake, there is nothing hidden to recover: remove the background as below, or better, get the icon from a source that gives you a proper file.')}

${h2('How do I remove a white background from an icon in 2026?')}
${p('Every major app now has a one-click remover, and some of the tools in older guides are gone. Here is where each lives today:')}
${table(['App', 'Tool and where it is', 'Cost', 'Good to know'], [
  ['PowerPoint, Word, Excel, Outlook (Windows and Mac)', 'Select picture > Picture Format > Remove Background', yes('Included'), 'Grey for SVG and other vector pictures'],
  ['PowerPoint, Word (desktop)', 'Picture Format > Color > Set Transparent Color', yes('Included'), 'One colour only; not in Word for the web'],
  ['Windows Paint', 'Remove background button in the toolbar, then save as PNG', yes('Free'), 'Has layers and real transparency since 2023'],
  ['Windows Photos', 'Edit the image, then the background tool: Remove', yes('Free'), 'Can save the result or copy it'],
  ['Preview (Mac)', 'Remove Background button, or Markup > Instant Alpha', yes('Free'), 'Asks to convert the file to PNG'],
  ['Photos and Safari (iPhone, iPad)', 'Touch and hold the subject > Copy Subject', yes('Free'), 'Made for photos; fine for bold icons'],
  ['Canva', 'Select image > BG Remover', meh('Paid plans'), 'Not on Canva Free'],
  ['Paint 3D', 'Magic Select', no('Gone'), 'Removed from the Store on 4 Nov 2024'],
], 'Background removal tools you already have, checked against each maker’s help pages in November 2026.')}
${p('A few tips that save time:')}
${ul([
  '<strong>Save as PNG afterwards.</strong> In Paint, Preview and Photos, the result is only transparent if you save it as PNG. Save as JPG and the white comes straight back.',
  '<strong>Office keeps the original.</strong> Remove Background in PowerPoint and Word is reversible. Right-click the picture and choose Save as Picture to get a separate PNG file.',
  '<strong>Check the edges.</strong> Automatic removers are tuned for photos. On a small flat icon they can leave a pale halo, so zoom in first.',
])}
${callout('note', '<p>Older answers say “use Paint 3D Magic Select”. Microsoft deprecated Paint 3D in August 2024 and removed it from the Microsoft Store on 4 November 2024. If it is still on your PC it runs, but you cannot download it again. The good news: classic Paint got one-click background removal and layers in autumn 2023, and Photos got Remove background soon after, so you do not need it.</p>', 'What changed since the old answers')}

${h2('Why did Set Transparent Color delete parts of my icon?')}
${p('Set Transparent Color in PowerPoint and Word picks one colour and makes it see-through <strong>everywhere</strong> in the picture, not just around the edge. Microsoft’s own help says it works best with simple, solid-colour pictures and cannot make more than one colour transparent. Fine for a black icon on a white square; but white parts inside the icon (a tick in a circle, a cute character’s eyes, a glossy shine) disappear too.')}
${art('m-icon-black-or-white-background-set-transparent', 'Set Transparent Color removes every pixel of the chosen colour, inside the icon too.', { brief: 'A before/after pair on a pale orange slide. Before: a with icons check-circle in solid style (white tick inside a filled circle) sitting on a white square. After Set Transparent Color: the white square is gone but the tick has become a hole showing the orange, with a small red arrow labelled “The white tick went too”. A third small panel shows the same icon downloaded as a transparent PNG, tick intact, labelled “Download it see-through instead”.' })}
${doDont('<p>Use Set Transparent Color for a one-colour icon on a flat white square, or use Remove Background, which looks at shapes instead of colours.</p>', '<p>Use Set Transparent Color on an icon with white details inside it, or on a JPG, whose “white” is really dozens of slightly different whites. You get holes and a speckled edge.</p>')}

${h2('What is the clean way to get an icon with no background?')}
${p('Skip the cleanup and start from a file that was made transparent: a PNG with a real alpha channel, or an SVG, which is drawn from shapes and has no background unless someone adds one.')}
${steps([
  ['Find the icon', `Search ${L.icons('the icon library')} in everyday words. “Bin” finds ${L.icon('trash')}, “gear” finds ${L.icon('settings')}.`],
  ['Pick a colour and size', 'Choose a colour that stands out on your slide or design. For slides, 512 px is plenty; pick 1024 px for a poster.'],
  ['Download PNG or SVG', 'In the download options, Background is set to See-through unless you choose White, Page colour or Custom. The preview’s light or dark backdrop is only a preview, not part of the file.'],
  ['Insert the file', `Insert or upload it rather than pasting. Our ${L.guide('powerpoint', 'PowerPoint')} and ${L.guide('word-google-docs', 'Word and Google Docs')} guides walk through it with pictures.`],
])}
${iconGrid(['image', 'file-image', 'layers', 'eraser', 'wand-sparkles', 'download'], 'duo', 'Every one of these downloads as a see-through PNG or an SVG, ready for slides, docs and designs.')}
${p(`SVG is the best choice where your app accepts it (PowerPoint, Word, Keynote, Canva, Figma), because it stays sharp at any size and has nothing behind it to remove. Use PNG for Google Slides, Google Docs, Notion and email. If you need a big pile of them, our ${L.page('free/png-icons.html', 'free PNG icons')} page collects the most popular ones.`)}
${p(`And because a transparent icon has no box, it sits naturally on any background, light, dark or photo, in any of our ${N_STYLES} styles, from ${L.style('solid')} to glossy and hand-drawn:`)}
${styleRow('rocket', '', { styles: ['line', 'solid', 'duo', 'gloss', 'sticker', 'clay', 'kawaii', 'sketch'] })}

${h2('The short answer')}
${p(`A black box usually means a paste through a clipboard format without transparency, so insert the file instead. A white box usually means a JPG, so keep it PNG. A checkerboard you can see is part of the picture, so get a better copy. To remove a white background, use Remove Background in Office, Paint or Photos on Windows, or Preview on a Mac (Paint 3D is gone). And to never deal with it again, download icons as transparent PNG or SVG from the start: ${L.icons(`all ${N_ICONS} with icons`)} are free, MIT licensed and see-through by default. Working in Canva? Read ${L.post('canva-transparent-png', 'Can you download a transparent PNG from Canva for free?')} next.`)}
${cta('Icons with nothing behind them', `${N_ICONS} free icons in ${N_STYLES} styles. Download a see-through PNG at any size, or an SVG. No sign-up, MIT licensed.`, ['image', 'layers', 'sparkles', 'heart', 'star', 'rocket'])}
`,
}
