import { p, h2, h3, ul, figure, iconGrid, table, yes, no, meh, callout, steps, cta, doDont, quote, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'choosing-the-right-icon',
  category: 'basics',
  date: '2026-10-02',
  hero: 'meaning2',
  stickers: [['help-circle', 'duo'], ['lightbulb', 'gloss'], ['check', 'sketch']],
  title: 'How to pick the right icon: meaning, labels and common mix-ups',
  cardTitle: 'How to pick the right icon',
  h1: 'How to pick the <em>right</em> icon: meaning, labels and common mix-ups',
  dek: 'An icon is a tiny promise about what happens when you click. Here is how to choose one people read correctly, when to add words, and the mix-ups that trip up even big apps.',
  description: 'Choose icons people understand: common mix-ups (save, settings, share, favourites, menu), when to add a text label, cultural traps, and a 5-person test.',
  keywords: ['choosing icons', 'icon meaning', 'icon labels', 'hamburger menu icon', 'share icon', 'favorite icon heart or star', 'icon usability'],
  about: ['Icon usability', 'User experience', 'with icons'],
  related: ['consistent-icons', 'accessible-icons', 'icons-on-landing-pages'],
  tldr: [
    'The right icon is the one people read correctly in about a second. Pick the most familiar picture, not the most clever one.',
    'Add a text label to almost every icon. Usability researchers at Nielsen Norman Group found that only a few icons, such as home, print and the magnifying glass for search, are close to universal.',
    'Watch the classic mix-ups: gear (settings) vs sliders (adjust this view), heart (like) vs star (rate or favourite) vs bookmark (save for later), bell (notifications) vs inbox (messages).',
    'Meanings change across countries and platforms: a tick can mean “wrong” in some school systems, and iPhone and Android use different share icons.',
    'Test with five people: show the icon, ask what it does, and fix anything that makes them hesitate.',
  ],
  faq: [
    { q: 'Should icons always have text labels?', a: 'Almost always. A label removes all doubt and costs a few words. The exceptions are a handful of very familiar icons (home, search, close, play) in tight spaces, and even then they need a tooltip and an accessible name for screen readers.' },
    { q: 'Is the floppy disk still the right icon for save?', a: 'Yes, in most cases. Few people use floppy disks any more, but the icon itself is so widely learned from software that it still reads as “save”. If your app saves automatically, you may not need a save icon at all.' },
    { q: 'Should I use a heart or a star for favourites?', a: 'Use a heart for “I like this” and a star for ratings or a personal favourites list. If people save something to come back to later, a bookmark is clearer than either. Whatever you choose, use it the same way everywhere.' },
    { q: 'Is the hamburger menu icon bad?', a: 'Not bad, but it hides things. Research from Nielsen Norman Group found that hiding the main navigation behind a menu icon made content harder to discover, especially on desktop. Use it on small screens, and show the main links on larger ones.' },
    { q: 'How do I test if an icon is clear?', a: 'Show it to five people who have not seen your design, without a label, and ask what they think it does. Then show it in context and ask them to complete a task. If two or more hesitate or guess wrong, pick a different icon or add a label.' },
    { q: 'What is the best icon for settings?', a: 'A gear (cog) is the most widely recognised settings icon. Use sliders only for adjusting the current view, such as filters or display options.' },
  ],
  sources: [
    { title: 'Nielsen Norman Group: Icon Usability', url: 'https://www.nngroup.com/articles/icon-usability/' },
    { title: 'Nielsen Norman Group: Hamburger Menus and Hidden Navigation Hurt UX Metrics (2016)', url: 'https://www.nngroup.com/articles/hamburger-menus/' },
    { title: 'Nielsen Norman Group: Why You Only Need to Test with 5 Users (Jakob Nielsen, 2000)', url: 'https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/' },
    { title: 'Share icon (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Share_icon' },
    { title: 'Fast Company: Why isn’t there a standard share icon?', url: 'https://www.fastcompany.com/3031872/why-isnt-there-a-standard-share-button' },
    { title: 'Slate: Twitter’s favorite button is now the like button, and the star is a heart (November 2015)', url: 'https://slate.com/technology/2015/11/twitter-favorite-button-is-now-the-like-button-and-the-star-is-a-heart.html' },
    { title: 'NPR: Users complain after Twitter changes its “favorite” icon to a heart (November 2015)', url: 'https://www.npr.org/2015/11/04/454518408/users-complain-after-twitter-changes-its-favorite-icon-to-a-heart' },
    { title: 'Check mark (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Check_mark' },
    { title: 'Thumb signal (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Thumb_signal' },
  ],
  body: () => `
${p(`<span class="lede">The right icon is the one people understand without thinking. Choose the most familiar picture for the job, add a short text label unless the icon is truly universal, and check it with five real people. That is most of the secret.</span>`)}
${p(`The rest is knowing where people get confused. Some icons look obvious to the person who chose them and mean something completely different to everyone else. This guide covers the classic mix-ups, when words beat pictures, the cultural traps, and a test you can run over coffee. Every example uses real icons from ${L.icons('with icons')}, so you can grab the good ones as you go.`)}

${h2('What makes an icon the right icon?')}
${p('A good icon passes three quick checks:')}
${ul([
  '<strong>It is familiar.</strong> People have seen this picture used this way before, in other apps and websites. Familiar beats clever every time.',
  '<strong>It matches what happens.</strong> Clicking a trash can should delete something, not archive it. If the result surprises people, the icon was wrong.',
  '<strong>It fits its neighbours.</strong> The same idea uses the same picture everywhere, and every icon looks like it belongs to the same family.',
])}
${p('Nielsen Norman Group, a research firm that has studied how people use websites for decades, found that only a handful of icons are close to universally understood. Their examples are the house for home, the printer for print, and the magnifying glass for search. Almost everything else needs help from a word.')}
${iconGrid(['home', 'search', 'printer'], 'line', 'Three icons most people recognise without a label: home, search and print.')}
${p('They also suggest a handy rule of thumb: if you need more than about five seconds to think of an icon for something, an icon probably cannot say it alone. Use a word instead, or a word with the icon.')}

${h2('Which icons do people mix up most?')}
${p('These pairs cause the most confusion. For each one, here is what people usually expect.')}

${h3('Save: is the floppy disk still OK?')}
${p('Yes. Hardly anyone has used a floppy disk in years, but the icon itself has been learned through software, so it still reads as “save”. The bigger question is whether you need it. If your app or doc saves automatically, show a small “Saved” message instead. And do not confuse save with download: save keeps changes here, download puts a copy on your device.')}
${iconGrid(['save', 'download', 'cloud-upload'], 'line', 'Save (keep my changes), download (copy to my device) and cloud upload (send to the cloud). Three different promises.')}

${h3('Settings: gear or sliders?')}
${p('A gear means “settings for the whole app or account”. Sliders mean “adjust what I am looking at right now”, like brightness, filters or display options. A funnel means “filter this list”. Using sliders for account settings, or a gear for a filter panel, sends people to the wrong place.')}
${iconGrid(['settings', 'sliders', 'filter'], 'line', 'Gear for settings, sliders for adjusting the current view, funnel for filtering a list.')}

${h3('Share: why does it look different on every phone?')}
${p('Because there is no single standard. Apple uses a box with an arrow pointing up. Android and many websites use three dots joined by lines. People tend to look for the one their own phone uses. The with icons share icon is the three connected dots. If most of your visitors use iPhones, add the word “Share” next to it, so nobody has to guess.')}
${iconGrid(['share', 'upload', 'send', 'external-link'], 'line', 'Share (three connected dots), upload, send and open in a new tab. Similar arrows, very different jobs.')}

${h3('Favourites: heart, star or bookmark?')}
${p('These three swap meanings from site to site, which is exactly why people hesitate. A famous example: in November 2015 Twitter replaced its star “favourite” button with a heart “like” button, saying the star could be confusing, especially to newcomers. Many users complained, which shows how strongly people attach meaning to these little shapes.')}
${p('A simple rule that works for most products: <strong>heart</strong> for “I like this”, <strong>star</strong> for ratings or a favourites list, <strong>bookmark</strong> for “save it to read later”.')}
${iconGrid(['heart', 'star', 'bookmark'], 'line', 'Heart for liking, star for rating or favourites, bookmark for saving for later.')}

${h3('Notifications: bell or inbox?')}
${p('A bell says “something happened that you should know about”. An inbox says “here are items waiting for you to deal with”. An envelope says “email”. A speech bubble says “chat or comments”. Using a bell for messages makes people miss them, because they expect alerts, not conversations.')}
${iconGrid(['bell', 'inbox', 'mail', 'message-circle'], 'line', 'Bell for alerts, inbox for things to process, envelope for email, speech bubble for chat.')}

${h3('The hamburger menu: three lines, many questions')}
${p('The three-line icon (people call it a “hamburger” because it looks like a bun and a patty) usually opens the main menu. It saves space, but it also hides your links. In a 2016 study, Nielsen Norman Group measured a drop of more than 20% in how easily people found content when the main navigation was hidden, compared with visible navigation. The effect was bigger on desktop than on phones.')}
${p('Use it on small screens. On larger ones, show your main links. And remember its cousins: three dots (horizontal or vertical) usually mean “more actions for this item”, not “main menu”.')}
${iconGrid(['menu', 'more-horizontal', 'more-vertical', 'layout-list'], 'line', 'Menu (main navigation), more (extra actions, two directions) and list view. Easy to confuse, so be consistent.')}

${table(['If you mean…', 'Use', 'Avoid'], [
  ['Keep my changes', `${L.icon('save')} (floppy disk)`, 'A download arrow'],
  ['App or account settings', `${L.icon('settings')} (gear)`, 'Sliders'],
  ['Filter this list', `${L.icon('filter')} (funnel)`, 'A gear'],
  ['I like this', `${L.icon('heart')}`, 'A thumbs-up for international audiences'],
  ['Rate it, or add to favourites', `${L.icon('star')}`, 'A heart if you already use hearts for likes'],
  ['Read it later', `${L.icon('bookmark')}`, 'A star'],
  ['New alerts', `${L.icon('bell')}`, 'An envelope'],
  ['Delete', `${L.icon('trash')}`, 'A cross, which often means close'],
], 'A quick cheat sheet for common meanings')}

${h2('When should an icon have a text label?')}
${p('Short answer: nearly always. A label turns a guess into certainty, and it helps people using screen readers, people in a hurry, and people who simply think differently from you.')}
${table(['Situation', 'Label needed?', 'Why'], [
  ['Main navigation (menu, sidebar, tab bar)', yes('Yes, always visible'), 'People need to know where each link goes before they click'],
  ['Unusual or product-specific actions', yes('Yes'), 'No one has learned your custom meaning yet'],
  ['Very familiar icons in a tight toolbar (close, search, play)', meh('Tooltip is OK'), 'Add a tooltip and an accessible name for screen readers'],
  ['Decorative icons next to a heading', no('No'), 'The heading already says it; hide the icon from screen readers'],
], 'When to add words to your icons')}
${p(`Labels also matter for accessibility. An icon-only button needs a name that screen readers can announce, like “Delete row”. Our guide to ${L.post('accessible-icons', 'accessible icons')} explains how in plain English.`)}
${doDont('<p>Put a short word next to the icon (“Share”, “Filters”, “Saved”). Keep the label visible, not hidden behind a hover.</p>', '<p>Assume your icon is obvious because you chose it. You have seen it a hundred times; your visitor has seen it once.</p>')}

${h2('Do icons mean the same thing in every country?')}
${p('No, and this catches out many teams. A few real examples:')}
${ul([
  '<strong>The tick (check mark).</strong> In English-speaking countries it means correct. In Swedish and Norwegian schools a tick can mark an answer as wrong, in Finnish it can stand for “wrong”, and in Japan a circle usually means correct.',
  '<strong>Thumbs-up.</strong> Friendly in many places, but an insult in Iran. For a global product, a heart or the word “Like” is safer.',
  '<strong>Money.</strong> A dollar sign says “money” to Americans and “dollars, not my currency” to many others. A wallet, coins or banknote icon is more neutral.',
  '<strong>Hand gestures and mailboxes.</strong> Hand signs carry local meanings, and the classic American mailbox with a flag looks unfamiliar in much of the world.',
])}
${figure('meaning4', 'Road signs work across borders because they were designed and tested for people who do not share a language. Your icons deserve the same care.')}
${p('If your audience is international, prefer simple, everyday objects, add labels, and ask one or two people from each key market to look at your icons.')}
${iconGrid(['wallet', 'coins', 'banknote', 'dollar-sign'], 'duo', 'For money, a wallet, coins or banknote reads more widely than a single currency symbol.')}

${h2('How do you test an icon with five people?')}
${p('You do not need a lab. In 2000, usability expert Jakob Nielsen showed that small tests with about five people uncover most of the problems in a design (his model put it at around 85%), and that several small rounds beat one big one. Here is a version you can run with friends or colleagues in fifteen minutes.')}
${steps([
  ['Show the icon alone', 'No label, no context. Ask: “What do you think this does?” Write down their exact words.'],
  ['Show it in context', 'Now show the real screen or slide. Ask the same question. Context often fixes small doubts.'],
  ['Give a task', 'Ask them to do something, like “save this to read later”. Watch where they click first.'],
  ['Note every pause', 'A second of hesitation counts. If two or more people pause or guess wrong, the icon needs a label or a swap.'],
  ['Fix and repeat', 'Change one thing and test with a new group of five. Two quick rounds beat one long meeting.'],
])}
${callout('tip', 'Ask people who have never seen your project. Your teammates already know what every icon means, which makes them the worst possible testers.')}
${figure('cons1', 'Clear signs feel effortless because someone tested them. A quick five-person check gets your icons most of the way there.')}

${h2('How with icons helps you find the right one')}
${p('Searching an icon library can feel like guessing the designer’s vocabulary. Is it “trash”, “bin” or “delete”? On withicons.com you can type the everyday word you have in mind and the search understands it:')}
${ul([
  '“bin” or “delete” finds ' + L.icon('trash'),
  '“gear” or “cog” finds ' + L.icon('settings'),
  '“house” finds ' + L.icon('home'),
  '“floppy” finds ' + L.icon('save'),
  '“hamburger” finds ' + L.icon('menu'),
])}
${p(`Every icon page also has an “Ask AI” button with an “Is this the right icon?” option. It opens your AI assistant (Claude, ChatGPT, Gemini and others) with a ready-made brief, so you get an honest view on how people will read the icon, whether it needs a label, and better options from the library. More on that in ${L.post('ai-assistants-and-icons', 'how to get great icons from AI assistants')}.`)}
${quote('Familiar beats clever. A label beats a guess. Five people beat your own opinion.')}

${h2('The bottom line')}
${p(`Picking the right icon is less about drawing and more about listening. Use the picture people already expect, keep one meaning per icon, add a word whenever there is any doubt, and test with five fresh pairs of eyes. Then keep those choices consistent across your whole product, which we cover in ${L.post('consistent-icons', 'why mixing icon sets looks cheap')}.`)}
${cta('Search with the words you already use', `Type “bin”, “gear” or “money” and find the right icon in seconds. ${N_ICONS} icons, ${N_STYLES} styles, free and MIT licensed.`, ['help-circle', 'search', 'heart', 'star', 'bookmark', 'lightbulb'])}
`,
}
