import { p, h2, h3, ul, art, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'custom-app-icons-iphone',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-custom-app-icons-iphone',
  stickers: [['smartphone', 'liquid'], ['heart', 'coquette'], ['camera', 'soft3d']],
  title: 'How do I make custom app icons on iPhone in iOS 26 and iOS 27?',
  cardTitle: 'Custom iPhone app icons (iOS 26 and 27)',
  h1: 'Custom iPhone app icons in <em>iOS 26 and iOS 27</em>',
  dek: 'Shortcuts is still the only way to put your own picture on an app. Here are Apple’s exact steps, the honest story on the banner, what Dark, Clear and Tinted do to your custom icons, and how to hide the originals.',
  description: 'Custom iPhone app icons in iOS 26 and iOS 27: Apple’s Shortcuts steps, whether the banner still shows, Dark, Clear and Tinted modes, badges, and hiding originals.',
  keywords: ['custom app icons iphone', 'custom app icons ios 26', 'ios 27 custom icons', 'shortcuts banner custom icons', 'remove shortcuts banner', 'tinted icons custom shortcut', 'iphone app icon size', 'hide original app icons'],
  about: ['iPhone', 'iOS 26', 'iOS 27', 'Shortcuts', 'Home Screen', 'App icons'],
  related: ['aesthetic-icons', 'change-app-icons-android', 'app-icon-vs-ui-icon'],
  tldr: [
    '<strong>The method has not changed:</strong> in Shortcuts, make a shortcut with the Open App action, open its Details, tap Add to Home Screen, tap the icon, choose Take Photo, Choose Photo or Choose File, and tap Add. That is Apple’s documented route in iOS 26 and iOS 27.',
    '<strong>The banner:</strong> Apple’s guide does not mention one. Since iOS 14.3 a custom icon opens the app directly with a small Shortcuts banner; on iPhones with the Dynamic Island it shows as a short animation there instead. Old workarounds broke with updates, so test one icon first.',
    '<strong>Dark, Clear and Tinted</strong> (Edit, then Customize) restyle real app icons. Apple does not document what they do to a picture you chose, and 2026 reports say it stays exactly as you made it. Pick an image that looks right in both light and dark.',
    '<strong>Trade-offs:</strong> custom tiles show no notification badges and no app quick actions. Keep the apps you need badges for (Messages, Mail) as real icons.',
    '<strong>Tidy up</strong> with Remove App, then Remove from Home Screen: the app moves to App Library and is not deleted. Use a square 512 or 1024 px PNG with a background colour.',
  ],
  faq: [
    { q: 'Does the Shortcuts banner still appear in iOS 26 and iOS 27?', a: 'Apple does not document it either way. What users and reviewers have reported: since iOS 14.3 (late 2020) a custom icon opens the app directly with a small Shortcuts banner at the top; on iPhones with the Dynamic Island (iPhone 14 Pro and later) it appears as a brief animation in the island with no delay. 2026 guides disagree on whether it is gone, so make one icon and test it on your phone.' },
    { q: 'Can I turn the Shortcuts banner off?', a: 'There is no setting for it. Workarounds that toggled Shortcuts notifications in Screen Time or ran an automation have been reported to stop working with iOS updates, and an Apple Community answer from December 2025 says Apple removed user control over when Shortcuts banners appear. On Dynamic Island iPhones the indicator is small enough that most people stop noticing it.' },
    { q: 'Do custom app icons work with Dark, Clear and Tinted icons?', a: 'Those modes, under Edit, then Customize on the Home Screen, restyle real app icons. Apple does not say what happens to a picture you chose for a shortcut, and 2026 reports say the picture is shown as is. A dark or tinted look therefore has to be built into the image itself.' },
    { q: 'Why don’t my custom icons show notification badges?', a: 'Because the tile is a shortcut that opens the app, not the app itself. Badges stay on the real app, which you can still find in App Library. Keep apps whose badges you rely on as normal icons.' },
    { q: 'What size should a custom iPhone app icon be?', a: 'Use a square PNG of 512 or 1024 pixels. iOS scales it down to the Home Screen size, so a big image stays crisp, and a square avoids awkward cropping. Give it a background colour so it reads as a tile.' },
    { q: 'How do I get the original icons back?', a: 'Touch and hold your custom icon and delete it (this deletes only the shortcut). Then open App Library, find the real app and drag it back to the Home Screen.' },
  ],
  sources: [
    { title: 'Apple Shortcuts User Guide: Add a shortcut to the Home Screen on iPhone or iPad (checked November 2026)', url: 'https://support.apple.com/guide/shortcuts/add-a-shortcut-to-the-home-screen-apd735880972/ios' },
    { title: 'Apple Shortcuts User Guide: Create a custom shortcut on iPhone or iPad (iOS 27)', url: 'https://support.apple.com/guide/shortcuts/create-a-custom-shortcut-apd84c576f8c/ios' },
    { title: 'Apple iPhone User Guide: Customize apps and widgets on the Home Screen (Dark, Clear, Tinted; checked November 2026)', url: 'https://support.apple.com/guide/iphone/customize-apps-and-widgets-on-the-home-screen-iph385473442/ios' },
    { title: 'Apple iPhone User Guide: Remove or delete apps from iPhone', url: 'https://support.apple.com/guide/iphone/remove-or-delete-apps-iph248b543ca/ios' },
    { title: 'Apple iPhone User Guide: Lock or hide an app', url: 'https://support.apple.com/guide/iphone/lock-or-hide-an-app-iph00f208d05/ios' },
    { title: 'Apple Newsroom: Major updates for Apple’s software platforms are now available (iOS 27, 14 September 2026)', url: 'https://www.apple.com/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/' },
    { title: '9to5Mac: iOS 14.3 beta 2 runs shortcuts from the home screen without launching the Shortcuts app (18 November 2020)', url: 'https://9to5mac.com/?p=680317' },
    { title: 'MacRumors: iPhone 14 Pro, using custom app icons now less annoying thanks to Dynamic Island (26 September 2022)', url: 'https://www.macrumors.com/2022/09/26/iphone-14-pro-dynamic-island-custom-app-icons/' },
    { title: 'Apple Community: Shortcuts banner on iOS 26 (22 December 2025)', url: 'https://discussions.apple.com/thread/256216251' },
    { title: 'MacRumors: iOS 18, create dark mode icons for apps that won’t go dark (31 October 2024)', url: 'https://www.macrumors.com/how-to/ios-18-create-a-dark-mode-icon-for-almost-any-app/' },
  ],
  body: () => `
${p(`<span class="lede">To make custom app icons on iPhone in iOS 26 or iOS 27, use the Shortcuts app: create a shortcut with the Open App action, open its Details, tap Add to Home Screen, tap the icon and choose your picture. The new tile opens the real app. iOS still has no way to change an app’s own icon, and the built-in Dark, Clear and Tinted modes restyle icons but cannot use your picture.</span>`)}
${p(`iOS 27 arrived on 14 September 2026, and the steps are the same as in iOS 26. What keeps confusing people is everything around them: the banner, badges and how custom tiles behave next to tinted icons. This guide sticks to what Apple documents, says clearly what is only reported by users, and was checked in November 2026. For moods and matching sets, see ${L.post('aesthetic-icons', 'aesthetic icons')}; here we go deep on iOS itself.`)}
${styleRow('camera', 'The same camera in six styles that make good iPhone tiles. Every one is free as a PNG.', { styles: ['liquid', 'soft3d', 'clay', 'dock', 'coquette', 'solid'] })}

${h2('How do I make a custom app icon on iPhone, step by step?')}
${p('First get your picture onto the phone (Photos or Files), then follow Apple’s Shortcuts guide:')}
${steps([
  ['Make the shortcut', 'Open the Shortcuts app and tap + for a new shortcut. Tap Add Action, search for <strong>Open App</strong>, add it, then tap the App placeholder and choose the app you want to open.'],
  ['Name it', 'Tap the shortcut’s name at the top, choose Rename and type something short. Tap Done.'],
  ['Open Details', 'In your shortcuts collection, tap the shortcut’s more button and choose Details, then tap <strong>Add to Home Screen</strong>.'],
  ['Choose your picture', 'Tap the icon under Home Screen Name and Icon. Apple lists three choices: Take Photo, Choose Photo (from Photos) and Choose File (from Files). Pick your PNG.'],
  ['Name the tile and add it', 'Tap the name to change what shows under the icon, then tap <strong>Add</strong>. The tile appears on your Home Screen.'],
])}
${art('m-custom-app-icons-iphone-steps', 'Where to tap: the Add to Home Screen sheet, annotated.', { brief: 'A clean, generic iPhone-style sheet mockup (no Apple logos or real screenshots) titled “Add to Home Screen”. Show a large square tile using the with icons music-note in soft3d style, a name field below it reading “Music”, and an Add button top right. Three numbered callouts: 1 “Tap the icon”, 2 “Choose Photo or Choose File”, 3 “Tap Add”. A small menu next to callout 2 lists Take Photo, Choose Photo, Choose File.' })}
${callout('tip', 'Shortcuts can also do this with Apple Intelligence on supported iPhones: describe what you want, such as “open my music app”, and it builds the shortcut (Apple lists the supported models and languages). You still add the icon with Add to Home Screen afterwards.')}

${h2('Does the Shortcuts banner still appear in iOS 26 and iOS 27?')}
${p('This is the question with the most contradictory answers online, so here is what each source actually says:')}
${table(['What', 'Source and date', 'What it says'], [
  ['Apple’s own guide', 'Add a shortcut to the Home Screen, checked November 2026', 'No mention of a banner, a delay or notifications'],
  ['iOS 14.3', '9to5Mac, 18 November 2020', 'The Shortcuts app no longer opens first; a compact banner appears at the top instead'],
  ['Dynamic Island iPhones', 'MacRumors, 26 September 2022', 'On iPhone 14 Pro, a small animation in the Dynamic Island replaces the banner, and the delay is gone; other models still get the banner'],
  ['iOS 26', 'Apple Community, December 2025', 'Answer: Apple removed user control over when Shortcuts banners appear'],
  ['2026 how-to guides', 'Several, mid 2026', 'They disagree: some say the flash is gone, others say a brief indicator still shows'],
], 'The Shortcuts banner, as documented and as reported')}
${p('Our honest reading: on any iPhone with the Dynamic Island you will see, at most, a quick animation up there as the app opens. On an iPhone with a notch or a Home button, expect a small banner. There is no setting to turn it off. Workarounds that switched off Shortcuts notifications in Screen Time, or ran an automation, have a long history of breaking with updates. Make one icon, live with it for a day, then decide.')}

${h2('What do Dark, Clear and Tinted icons do to custom icons?')}
${p('Since iOS 18, and with the Liquid Glass look in iOS 26, you can restyle every app icon at once. Apple’s steps: touch and hold the Home Screen background until the icons jiggle, tap Edit, then Customize. You can make icons larger (names disappear), choose Dark or Auto, choose Clear (translucent) or choose Tinted with a colour and saturation slider or an eyedropper. iOS 27 adds a slider in Settings to set how clear or tinted Liquid Glass looks.')}
${p('These modes work on real app icons. Apple does not document what they do to a picture you chose for a shortcut. 2026 guides report that the picture shows exactly as you made it in Clear and Tinted, and the popular 2024 MacRumors trick of making dark versions of icons by hand only makes sense because Dark mode does not darken your picture for you. Either way, plan for your picture to stay the same.')}
${art('m-custom-app-icons-iphone-tinted', 'Tinted mode restyles real apps; your picture stays as you made it (as reported in 2026).', { brief: 'Two phone home-screen mockups side by side, generic and logo-free. Left “Default”: a grid of eight colourful tiles made from with icons in dock style (camera, mail, calendar, map-pin, music-note, clock, message-circle, settings). Right “Tinted”: six of the tiles turned into amber one-colour glass tiles, while two tiles (camera, music-note, in coquette style) stay full colour, each marked with a small “your picture” tag. Caption line in the art: “as reported”.' })}
${doDont('<p>Pick a picture with its own background that looks good on both a light and a dark wallpaper, such as a mid-tone tile with a white or dark icon on it.</p>', '<p>Use a see-through black line icon. With Dark mode on, it can vanish into a dark wallpaper, and iOS will not fix it for you.</p>')}

${h2('What do I lose with a custom app icon?')}
${table(['', 'Real app icon', 'Custom Shortcuts tile'], [
  ['Opens the app', yes(), yes('After a brief indicator')],
  ['Notification badges', yes(), no()],
  ['Quick actions on long press', yes(), no('Reported missing')],
  ['Dark, Clear and Tinted styling', yes(), meh('Not documented; reported to stay as is')],
  ['Your own picture', no(), yes()],
], 'Real icon vs custom tile')}
${p('A good compromise: give custom tiles to the apps you open for content (camera, music, maps, notes) and keep real icons for the apps that talk to you (Messages, Mail, Phone), so you never miss a badge.')}

${h2('How do I hide the original app icons?')}
${steps([
  ['Remove from Home Screen', 'Touch and hold the original app, tap Remove App, then <strong>Remove from Home Screen</strong>. Apple’s guide says the app moves to App Library and is not deleted. Do not tap Delete App: that removes the app and its data.'],
  ['Find it later', 'Swipe left past your last Home Screen page to reach App Library, then search or browse. Your custom tile keeps working.'],
  ['Hide whole pages (optional)', 'Touch and hold the wallpaper, tap the dots at the bottom and untick pages you do not need. App Library moves closer.'],
])}
${callout('warn', 'iOS also has Hide and Require Face ID, but that is a privacy feature: a hidden app goes into a locked Hidden folder and needs Face ID, Touch ID or your passcode to open. To tidy a home screen, use Remove from Home Screen instead.', 'Hide is not the same as remove')}

${h2('What size should a custom iPhone app icon be?')}
${p('Use a square PNG of 512 or 1024 pixels. iOS shrinks it to the Home Screen size, so bigger images stay crisp, and a square avoids cropping. Home Screen tiles are small, so choose a simple, bold object and keep the drawing away from the edges, because iOS rounds the corners.')}
${sizeRamp(['camera', 'music-note', 'map-pin'], [24, 32, 48, 64], 'soft3d', 'On a phone, icons are small: a bold, simple object reads best.')}
${p('To get one from with icons:')}
${steps([
  ['Pick the icon', `Search ${L.icons('the library')} with an everyday word, or start from the ${L.page('free/app-icons.html', 'free app icons page')}, which has ready tiles at 256, 512 or 1024 px.`],
  ['Choose a style and palette', `Soft, glossy styles suit iOS 26 and 27: try ${L.style('liquid', 'liquid')}, ${L.style('soft3d', 'soft 3D')} or ${L.style('clay', 'clay')}. For a cute screen, ${L.style('coquette', 'coquette')} or ${L.style('kawaii', 'kawaii')}.`],
  ['Download a PNG', 'Open More formats, choose PNG at 512 or 1024 px, set a background colour (or White) and Small padding, then save it to Photos or Files.'],
])}
${iconGrid(['camera', 'music-note', 'map-pin', 'book-open', 'headphones', 'calendar'], 'liquid', 'Liquid style: glassy tiles that sit comfortably next to iOS 26 and 27’s own icons.')}
${p(`Need the sizes real app icons use, rather than shortcut tiles? ${L.post('app-icon-vs-ui-icon', 'App icon vs UI icon')} explains the difference, and the ${L.post('icon-sizes-guide', 'icon sizes guide')} covers screens and slides.`)}

${h2('What changed since the old answers?')}
${ul([
  '<strong>iOS 14 guides</strong> say the Shortcuts app opens first. That stopped with iOS 14.3 in late 2020.',
  '<strong>“Turn off the banner in Screen Time”</strong> fixes are fragile and have been reported to break with updates; there is still no setting in iOS 26 or 27.',
  '<strong>iOS 18 and 26</strong> added Dark, Clear and Tinted icons, which restyle real apps, not your pictures, and iOS 27 added a Liquid Glass slider.',
  '<strong>Android’s story</strong> changed even more; see ' + L.post('change-app-icons-android', 'how to change app icons on Android') + '.',
])}
${cta('Make your Home Screen yours', `${N_ICONS} free icons in ${N_STYLES} styles, as PNG at any size, colour and background. MIT licensed, no credit needed.`, ['smartphone', 'camera', 'music-note', 'heart', 'sparkles', 'palette'])}
`,
}
