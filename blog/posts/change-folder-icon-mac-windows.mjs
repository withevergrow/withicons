import { p, h2, h3, ul, art, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, code, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'change-folder-icon-mac-windows',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-change-folder-icon-mac-windows',
  stickers: [['folder', 'clay'], ['folder-open', 'pastel'], ['folders', 'dock']],
  title: 'How do I change a folder icon on Mac or Windows 11?',
  cardTitle: 'Change a folder icon on Mac or Windows',
  h1: 'How to change a folder icon on <em>Mac or Windows 11</em>',
  dek: 'macOS Tahoe gave folders colours, symbols and emoji, and Windows still wants a real .ico file. Here are both, plus how to use your own picture without it breaking next week.',
  description: 'Change a folder icon on Mac (Tahoe colours, symbols, emoji, or your own picture via Get Info) and on Windows 11 (Change Icon needs a real .ico, not a renamed PNG).',
  keywords: ['change folder icon mac', 'customize folder mac tahoe', 'folder emoji mac', 'change folder colour mac', 'change folder icon windows 11', 'png to ico folder icon', 'custom folder icon', 'windows folder icon not changing'],
  about: ['macOS Tahoe', 'macOS', 'Windows 11', 'Finder', 'File Explorer', 'ICO file format', 'Folder icons'],
  related: ['change-app-icons-android', 'custom-app-icons-iphone', 'svg-vs-png-icons'],
  tldr: [
    '<strong>Mac, the new way (macOS Tahoe 26 and later):</strong> select a folder, open the Action menu (or Control-click), choose Customize Folder, then pick a colour, a symbol or an emoji.',
    '<strong>Mac, your own picture:</strong> copy an image (Apple suggests opening it in Preview and choosing Edit, Copy), select the folder, File, Get Info, click the small icon at the top and Edit, Paste. Edit, Cut puts the original back.',
    '<strong>Windows 11:</strong> right-click the folder, Properties, Customize, Change Icon, then Browse to an icon file. It wants a real <strong>.ico</strong>: renaming a .png to .ico does not convert it.',
    '<strong>Keep the .ico in a permanent folder.</strong> Windows remembers where the file is (in a hidden desktop.ini), so moving or deleting it later brings the plain folder back.',
    'with icons gives you both: a PNG in any size and colour for the Mac, and an ICO with 16, 32, 48, 64 and 256 px inside for Windows.',
  ],
  faq: [
    { q: 'How do I add an emoji to a folder on a Mac?', a: 'On macOS Tahoe 26 or later, select the folder, open the Action menu in the Finder toolbar (or Control-click the folder), choose Customize Folder, click Emoji and pick one. Apple says you can customise your Home folder but not folders that come with the Mac, such as Applications, Library, System and Users.' },
    { q: 'How do I change the colour of all folders on a Mac?', a: 'Open System Settings, then Appearance, and choose a Folder color. Apple notes the option appears when the icon and widget style is Default, Dark or Clear; with Tinted, it becomes Icon, widget, & folder color and sets all three together.' },
    { q: 'Why is Paste greyed out in Get Info?', a: 'Apple’s guide says you probably clicked the large preview icon instead of the small icon at the very top of the Info window, below the title bar. Click the small one, then choose Edit, Paste. Also make sure an image, not a file name, is on the clipboard.' },
    { q: 'Can I use a PNG as a folder icon in Windows 11?', a: 'Not directly. The Change Icon dialog looks for icon files (.ico, or icons stored inside .exe and .dll files). Convert the PNG to a real multi-size ICO first, or download an ICO directly. Renaming a .png to .ico only changes the name, not the file inside, so Windows cannot read it.' },
    { q: 'Why did my custom folder icon disappear in Windows?', a: 'Usually because the .ico file moved, was renamed or was deleted: Windows stores only its location. Put it back, or point the folder to its new place. If the file is where it should be, try Unblock in the .ico file’s Properties and rebuild the icon cache. In June 2026 some users also reported custom icons vanishing after a Windows update; Microsoft has not confirmed it.' },
    { q: 'How do I change a desktop shortcut icon in Windows 11?', a: 'Right-click the shortcut, choose Properties, then on the Shortcut tab click Change Icon and Browse to your .ico. For This PC, Network and Recycle Bin, open Settings, Personalization, Themes, Desktop icon settings.' },
  ],
  sources: [
    { title: 'Apple Mac User Guide: Customize the look of folders and files on Mac (macOS Tahoe 26 and macOS 27; checked November 2026)', url: 'https://support.apple.com/guide/mac-help/customize-folders-files-mac-mchlp2313/mac' },
    { title: 'Apple Mac User Guide: Change Appearance settings on Mac (Folder color)', url: 'https://support.apple.com/guide/mac-help/change-appearance-settings-mchlp1225/mac' },
    { title: 'The Eclectic Light Company: Customising folders in Tahoe (18 September 2025)', url: 'https://eclecticlight.co/2025/09/18/customising-folders-in-tahoe/' },
    { title: 'Microsoft Learn: How to customize folders with Desktop.ini (IconFile, .ico preferred)', url: 'https://learn.microsoft.com/en-us/windows/win32/shell/how-to-customize-folders-with-desktop-ini' },
    { title: 'Microsoft Q&A: How to change folder icon on Windows 10 and 11 (May 2025)', url: 'https://learn.microsoft.com/en-us/answers/questions/3867406/how-to-change-folder-icon-on-windows-10-and-11-art' },
    { title: 'Microsoft Q&A: After latest Windows 11 update I can no longer set custom icons (June 2026)', url: 'https://learn.microsoft.com/en-us/answers/questions/5923058/after-latest-ms-windows-11-update-i-can-no-longer' },
    { title: 'Microsoft Support: Customize the desktop icons in Windows', url: 'https://support.microsoft.com/en-us/windows/experience/personalization/customize-the-desktop-icons-in-windows' },
  ],
  body: () => `
${p(`<span class="lede">On a Mac running macOS Tahoe 26 or later, select a folder, open the Action menu (or Control-click it) and choose Customize Folder to give it a colour, a symbol or an emoji; for your own picture, copy the image, open the folder’s Get Info window, click the small icon at the top and paste. On Windows 11, right-click the folder, choose Properties, then Customize and Change Icon, and browse to a real .ico file that you keep somewhere permanent.</span>`)}
${p(`Most guides that rank for this question were written before 2025, so they know only the Get Info paste on Mac, and many still tell Windows users to “rename the PNG to ICO”, which does not work. Both systems were checked against Apple and Microsoft documentation in November 2026. If you want icons to put on folders, every one of the ${N_ICONS} icons on ${L.icons('with icons')} comes in ${N_STYLES} styles, as a PNG for the Mac or an ICO for Windows.`)}
${iconGrid(['folder', 'folder-open', 'folder-lock', 'folder-check', 'folders', 'folder-plus'], 'clay', 'Folder icons in the clay style: soft and easy to spot in a crowded Finder or File Explorer window.')}

${h2('How do I change a folder icon on a Mac in macOS Tahoe?')}
${p('macOS Tahoe (version 26, released in 2025) added folder customisation to the Finder, and macOS 27 keeps it. Apple’s steps:')}
${steps([
  ['Select the folder', 'In the Finder, click the folder once. You can also Control-click (right-click) it to get the same menu.'],
  ['Open Customize Folder', 'Click the Action button in the Finder toolbar (the circle with three dots) and choose <strong>Customize Folder</strong>.'],
  ['Pick a colour', 'Click one of the coloured circles to tint the folder.'],
  ['Add a symbol or emoji', 'Choose a symbol from the list (it looks pressed into the folder), or click Emoji and pick one (it sits on top like a sticker).'],
])}
${p('Apple notes you can customise your Home folder, but not folders that come with your Mac, such as Applications, Library, System and Users.')}
${h3('Can I change the colour of every folder at once?')}
${p('Yes. Open System Settings, click Appearance and choose a <strong>Folder color</strong>. Apple says the option shows when the Icon &amp; widget style is Default, Dark or Clear. With Tinted, it becomes Icon, widget, &amp; folder color, which sets icons, widgets and folders together.')}
${callout('note', 'Where the look is stored matters if you share files. The Eclectic Light Company found that Tahoe keeps a folder’s symbol or emoji in the folder’s own hidden metadata, which survives copying on your Mac and syncing with iCloud Drive, but Macs on older versions of macOS do not show the customisation in full.', 'Good to know before you share')}
${art('m-change-folder-icon-mac-windows-tahoe', 'macOS Tahoe’s Customize Folder: colour, symbol or emoji.', { brief: 'A generic, logo-free mockup of a Finder-style popover titled “Customize Folder” beside a large blue folder. The popover shows a row of seven coloured circles, a small grid of line symbols drawn from with icons (star, heart, book-open, briefcase, camera, music-note), and an “Emoji” button. Arrows show the folder picking up a coral colour and the star symbol. Short labels: “Colour”, “Symbol”, “Emoji”. No Apple logos.' })}

${h2('How do I use my own picture as a folder icon on a Mac?')}
${p('This older route still works in Tahoe, and it is the only way to use any picture you like, such as a with icons illustration:')}
${steps([
  ['Copy the image', 'Apple’s guide: double-click the image to open it in Preview, then choose Edit, Copy. A square PNG of 512 or 1024 px looks crisp even in the Finder’s biggest icon view.'],
  ['Open Get Info', 'Select the folder, then choose File, Get Info (or press Command-I).'],
  ['Click the small icon', 'In the Info window, click the small icon at the very top, below the title bar. It gets a highlight.'],
  ['Paste', 'Choose Edit, Paste. The folder takes on your picture.'],
])}
${p('To undo it, open Get Info again, click the same small icon and choose Edit, Cut. If Paste is greyed out, Apple says you probably clicked the large preview at the bottom of the window instead of the small icon at the top.')}
${p('Two notes from Mac watchers: a pasted picture replaces the folder entirely, so it has no folder colour to change and tags will not recolour it. And if a folder already has a Tahoe symbol or emoji, it is simplest to clear that in Customize Folder first, so only one look is in play.')}
${callout('try', `On any with icons page, pick a style and colour, then press <strong>Copy image</strong>: it puts a PNG (at least 256 px) on your clipboard, which you can try pasting straight into Get Info. For the sharpest result, download a 1024 px PNG instead and use Apple’s Preview route. Open ${L.icon('folder')}, ${L.icon('camera')} or ${L.icon('book-open')} to try it.`)}

${h2('How do I change a folder icon in Windows 11?')}
${steps([
  ['Open Properties', 'Right-click the folder and choose Properties.'],
  ['Go to Customize', 'Open the Customize tab. Under Folder icons, click <strong>Change Icon</strong>.'],
  ['Browse to your .ico', 'Pick one of Windows’ own icons, or click Browse and choose your .ico file. Select it and click OK.'],
  ['Apply', 'Click Apply, then OK. To go back later, return here and click Restore Defaults.'],
])}
${p('The same Change Icon button sits on the Shortcut tab of a desktop shortcut’s Properties. For This PC, Network and Recycle Bin, Microsoft’s route is Settings, Personalization, Themes, Desktop icon settings.')}
${p('If there is no Customize tab, you may be looking at a special location (a drive, for example) rather than an ordinary folder. Microsoft Q&amp;A threads also describe the tab going missing after updates; the simple workaround is to make a shortcut to the folder and change the shortcut’s icon.')}

${h2('Why doesn’t renaming a PNG to ICO work?')}
${p('Because the name is not the file. A .ico file starts with a small index that tells Windows which sizes are inside (small ones such as 16 px for lists, up to 256 px for extra large icons) and where each one lives. A PNG renamed to .ico is still a PNG inside, with no index, so Windows cannot read it and the icon stays blank or the dialog refuses it.')}
${table(['File', 'Mac folder (Get Info)', 'Windows Change Icon', 'Notes'], [
  ['PNG', yes('Copy and paste the image'), no('Not accepted'), 'Best for the Mac; use 512 or 1024 px'],
  ['PNG renamed to .ico', no(), no('Looks like an ICO, isn’t one'), 'The inside is unchanged'],
  ['Real ICO (several sizes)', meh('Not needed'), yes(), 'Ideal: 16, 32, 48 and 256 px inside'],
  ['SVG', meh('Convert to PNG first'), no(), 'Great for design apps, not for folder icons'],
], 'Which file each system wants for a folder icon')}
${p(`An ICO made the modern way can hold PNG pictures inside it (Windows has read those since Vista), which is why a good converter keeps your see-through edges. More on the two picture formats in ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`)}

${h2('Where should I keep icon files so they don’t break?')}
${p('Windows does not copy the icon into the folder. It writes a hidden desktop.ini file inside the folder that points to your .ico by name and location. Microsoft’s documentation for that file says .ico is the preferred type. So:')}
${doDont('<p>Make one permanent folder for icons, such as <code>C:\\Users\\you\\Icons</code>, put every .ico there first, and only then apply them.</p>', '<p>Apply an icon straight from Downloads or the desktop, then tidy up later. The moment the .ico moves, the folder goes back to plain yellow.</p>')}
${p('For the curious, the line inside desktop.ini looks something like this (you only see the file with hidden and protected system files shown):')}
${code(`[.ShellClassInfo]
IconResource=C:\\Users\\you\\Icons\\projects.ico,0`, 'ini')}
${h3('My custom icon won’t show or disappeared: what now?')}
${ul([
  '<strong>Check the file is still there</strong>, at the same path, with the same name.',
  '<strong>Unblock it.</strong> Right-click the .ico, choose Properties, and if you see Unblock at the bottom of the General tab, tick it and click Apply. A Microsoft Q&amp;A moderator suggested this in June 2026.',
  '<strong>Rebuild the icon cache.</strong> Windows keeps old icons in a cache; the same Q&amp;A thread lists the steps to rebuild it.',
  '<strong>Recent update?</strong> In June 2026 users reported custom icons vanishing after a Windows update, and one fixed it by uninstalling that update. Microsoft has not confirmed it as a known issue.',
])}

${h2('How do I get an ICO or PNG folder icon from with icons?')}
${steps([
  ['Pick an icon and style', `Search ${L.icons('the library')} for what the folder holds (“invoice”, “photos”, “music”), then choose a style. Bold styles such as ${L.style('solid', 'solid')}, ${L.style('clay', 'clay')} or ${L.style('dock', 'dock')} stay clear at small sizes.`],
  ['Open More formats', 'On the icon page, open More formats, then Websites &amp; apps.'],
  ['For Windows, choose ICO', 'The ICO has 16, 32, 48, 64 and 256 px inside, ready for the Change Icon dialog. Pick a background colour or keep it see-through, and add padding if you like.'],
  ['For the Mac, choose PNG', `Choose PNG at 512 or 1024 px, or press Copy image. The ${L.page('free/png-icons.html', 'free PNG icons page')} has quick downloads too.`],
])}
${styleRow('folder', 'One folder in six styles. On Windows, a solid shape reads best at 16 px in lists.', { styles: ['solid', 'duo', 'clay', 'dock', 'pastel', 'sticker'] })}
${art('m-change-folder-icon-mac-windows-ico-sizes', 'What is inside a real .ico: one file, several sizes.', { brief: 'An exploded diagram of an .ico file drawn as a stack of cards labelled 16, 32, 48, 64 and 256 px, each showing the with icons folder icon in clay style at that size. Beside it, a crossed-out card labelled “photo.png renamed to photo.ico” with a note “no size index inside”. Calm light background, short labels only.' })}
${p(`Making matching icons for a whole drive, or for your phone too? Use one style and one palette for everything; ${L.post('consistent-icons', 'how to keep icons consistent')} shows how, and the phone guides for ${L.post('custom-app-icons-iphone', 'iPhone')} and ${L.post('change-app-icons-android', 'Android')} reuse the same PNGs.`)}

${h2('What changed since the old answers?')}
${ul([
  '<strong>Mac:</strong> before macOS Tahoe (2025) the only option was the Get Info paste. Now Customize Folder adds colours, symbols and emoji, and Appearance settings set a default folder colour.',
  '<strong>Windows:</strong> the Change Icon dialog has not changed in years, but “rename .png to .ico” advice never worked, and many old ICO converter tools are gone. Download a real multi-size ICO instead.',
])}
${cta('Find an icon for every folder', `${N_ICONS} free icons in ${N_STYLES} styles, as PNG for the Mac and ICO for Windows. MIT licensed, no credit needed.`, ['folder', 'folder-open', 'camera', 'music-note', 'briefcase', 'book-open'])}
`,
}
