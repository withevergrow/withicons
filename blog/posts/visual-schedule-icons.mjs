import { p, h2, ul, art, icon, iconGrid, styleRow, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

const cell = (name, label) => `${icon(name, 'duo', 28)} <strong>${label}</strong>`

export default {
  slug: 'visual-schedule-icons',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-visual-schedule-icons',
  stickers: [['backpack', 'kawaii'], ['alarm-clock', 'pastel'], ['book-open', 'plush']],
  title: 'Where can teachers get free icons for visual schedules?',
  cardTitle: 'Free visual schedule icons',
  h1: 'Free icons for classroom <em>visual schedules</em> and routines',
  dek: 'A picture schedule helps children see what comes next. Here is what makes a good schedule icon, a ready set of daily-routine pictures you can print today, sizes and laminating tips, and which free symbol sets you can safely share.',
  description: 'Free printable icons for classroom visual schedules: a ready daily set, print sizes, laminating tips, and the real licences of ARASAAC, Mulberry and Boardmaker.',
  keywords: ['free visual schedule icons', 'visual schedule pictures printable', 'picture schedule for kids', 'classroom routine icons', 'boardmaker alternative free', 'arasaac license', 'mulberry symbols', 'visual schedule autism'],
  about: ['Visual schedule', 'Augmentative and alternative communication', 'Pictogram', 'Classroom management'],
  related: ['consistent-icons', 'icon-resolution-for-print', 'sell-products-with-free-icons'],
  tldr: [
    '<strong>Use a set you are allowed to print and share.</strong> MIT and CC0 icons (like with icons) need no credit. ARASAAC (CC BY-NC-SA) and Mulberry (CC BY-SA 4.0) are free symbol sets that need a credit. Boardmaker’s PCS symbols need a subscription and a licence to share widely or sell.',
    '<strong>One picture, one meaning, every time.</strong> Pick one style, keep the same picture for the same activity all year, and print the word under it.',
    '<strong>Print big enough to hold.</strong> We suggest cards about 2 to 3 inches (5 to 7.5 cm) for young children; a 1,024 px PNG or a PDF stays crisp at that size.',
    '<strong>Laminate, then add hook-and-loop dots</strong> so cards can move to a “finished” pocket as the day goes on.',
    '<strong>with icons is not an AAC symbol set.</strong> It is great for schedules and labels; for a child’s communication system, follow their speech and language therapist.',
  ],
  faq: [
    { q: 'Are there free Boardmaker alternatives for visual schedules?', a: 'Yes. ARASAAC and Mulberry are free pictogram sets made for communication, and general icon sets with open licences, such as with icons (MIT), work well for schedules and classroom labels. Check each licence: ARASAAC is non-commercial only and needs a credit, Mulberry needs a credit when you share materials, and MIT needs nothing.' },
    { q: 'Can I share or sell visual schedules made with Boardmaker symbols?', a: 'Using PCS symbols with your own students under your school’s Boardmaker subscription is generally fine. Tobii Dynavox says selling or publicly sharing PCS materials needs a licence: Maker Free for free public materials, Maker Personal (USD 149) for selling on sites such as Etsy or TPT, and both require a Boardmaker subscription.' },
    { q: 'Is ARASAAC free for teachers?', a: 'Yes, for non-profit use. ARASAAC pictograms are published by the Government of Aragón under CC BY-NC-SA: you must credit the author (Sergio Palao), the owner and ARASAAC, share anything you make under the same licence, and not use them in commercial products.' },
    { q: 'What size should visual schedule cards be?', a: 'There is no single rule; it depends on the child and where the schedule lives. We suggest starting around 2 to 3 inches (5 to 7.5 cm) so little hands can grab them, bigger for a wall schedule and smaller for a lanyard. Print a test card and watch whether the child can see and handle it.' },
    { q: 'Should a visual schedule use photos, drawings or icons?', a: 'Use what the learner understands. Guidance from the Delaware Network for Excellence in Autism lists real objects, photos, coloured drawings, line drawings and text as options. Clear, simple icons suit many children; some need photos of the real place or object first.' },
    { q: 'Can I use with icons on schedules I sell on TPT?', a: 'Yes. The MIT licence allows use in products you sell, with no credit needed. Just sell your finished schedule pack, not the loose icon files.' },
  ],
  sources: [
    { title: 'AFIRM (UNC Frank Porter Graham): Visual Supports, evidence-based practice module, checked Nov 2026', url: 'https://afirm.fpg.unc.edu/module/visual-supports/' },
    { title: 'Delaware Network for Excellence in Autism: Creating visual schedules (PDF), checked Nov 2026', url: 'https://www.delawareautismnetwork.org/wp-content/uploads/2022/03/Visual-Supports_Creating-Visual-Schedules_3_21.pdf' },
    { title: 'ARASAAC: Terms of use (CC BY-NC-SA), checked Nov 2026', url: 'https://arasaac.org/terms-of-use' },
    { title: 'Mulberry Symbols: Licence (CC BY-SA 4.0), checked Nov 2026', url: 'https://mulberrysymbols.org/' },
    { title: 'Tobii Dynavox: PCS (Picture Communication Symbols) licensing, checked Nov 2026', url: 'https://www.tobiidynavox.com/pages/pcs-picture-communication-symbols' },
    { title: 'Tobii Dynavox: Boardmaker terms of service, checked Nov 2026', url: 'https://us.tobiidynavox.com/pages/boardmaker-terms-of-service-agreement' },
    { title: 'with icons licence (MIT), checked Nov 2026', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The safest free icons for a classroom visual schedule are ones whose licence lets you print, copy and share them: MIT or CC0 icons, such as with icons, need no credit at all. Free symbol sets made for communication, ARASAAC and Mulberry, are lovely too, but they ask for a credit and (for ARASAAC) no commercial use. Boardmaker’s symbols need a paid subscription. Whatever you choose, use one style, one picture per activity, a word under every picture, and cards big enough for small hands.</span>`)}
${p(`Many “free visual schedule” link lists online still point to sites that disappeared years ago, or share symbol sheets that are not free to pass on. This guide gives you a working answer for today: a ready set of daily-routine icons from ${L.icons('with icons')} you can print this afternoon, the details that make a schedule actually work, and the honest licence facts for the other sets teachers ask about.`)}
${callout('note', `<p>with icons is a general icon library, not an AAC (augmentative and alternative communication) symbol set, and it was not designed or tested with AAC users. It works well for classroom schedules, routine charts and labels. If a child uses symbols to communicate, follow their speech and language therapist’s choice of symbol set so everything matches.</p>`, 'An honest note before we start')}

${h2('What is a visual schedule, and why does it help?')}
${p('A visual schedule shows the parts of the day as a row or column of pictures, in order. Children can see what is happening now and what comes next, without having to hold spoken instructions in their head. It helps autistic learners, children learning English as a new language, young children who cannot read yet, and honestly most of us on a busy Monday.')}
${p('Visual supports, schedules among them, are one of the evidence-based practices covered by AFIRM, the autism training modules from the University of North Carolina’s Frank Porter Graham Institute. The Delaware Network for Excellence in Autism’s guide to making schedules is a practical read: it suggests matching the format to how the learner understands information (real objects, photos, coloured drawings, line drawings or words) and choosing a layout and length that helps rather than overwhelms.')}

${h2('What makes a good visual schedule icon?')}
${ul([
  '<strong>Simple:</strong> one clear object or action, no background scene. A toothbrush moment needs a tooth, not a whole bathroom.',
  '<strong>One meaning:</strong> each picture stands for one activity, and each activity always uses the same picture. If “lunch” is a sandwich in September, it is a sandwich in June.',
  '<strong>Consistent:</strong> every card in the same style and colour family, so children read the meaning, not the drawing.',
  '<strong>Labelled:</strong> print the word under every picture. It builds reading, helps adults say the same word, and lets you add a second language for ESL learners.',
  '<strong>Big and high-contrast:</strong> bold shapes survive photocopying, laminating and sticky fingers.',
])}
${doDont(
  '<p>Pick one style for the whole schedule, print a word under each picture, keep the same picture for the same activity all year, and teach the schedule by using it every day.</p>',
  '<p>Mix clip art from five websites, use a busy scene for a simple step, change the “lunch” picture halfway through term, or let one picture mean two different things.</p>',
)}

${h2('A ready set of daily-routine icons')}
${p(`Here is a starter set, all from the same library so they match. Every tile links to its icon page, where you can copy the picture or download it as a PNG in the size and colour you need. The search understands everyday words too: try “toilet”, “lunch” or “bus”.`)}
${iconGrid(['alarm-clock', 'toilet', 'tooth', 'shirt', 'utensils', 'backpack', 'bus', 'school'], 'duo', 'Morning: wake up, toilet, brush teeth, get dressed, breakfast, backpack, bus, school.')}
${iconGrid(['users', 'book-open', 'pencil', 'calculator', 'paintbrush', 'music-note', 'microscope', 'laptop', 'library', 'person-running', 'playground', 'sandwich'], 'duo', 'School day: circle time, reading, writing, maths, art, music, science, computers, library, PE, playtime, lunch.')}
${iconGrid(['apple', 'glass-water', 'headphones', 'armchair', 'puzzle-piece', 'home', 'bath', 'bed'], 'duo', 'Snack, drink, listening time, calm corner, choice time, home time, bath and bed.')}
${iconGrid(['check-circle', 'timer', 'hourglass', 'stop', 'smile', 'frown', 'angry', 'meh'], 'duo', 'Helpers: finished, timer, wait, stop, and four feelings for a check-in board.')}
${p('Here is the same set as a quick reference, with a suggested label for each card. Swap the words for the ones your class already uses: the label should match what adults say out loud.')}
${table(['Picture and label', 'Use it for'], [
  [cell('alarm-clock', 'Wake up'), 'The first card of a home routine chart.'],
  [cell('tooth', 'Brush teeth'), 'Morning and bedtime routines.'],
  [cell('users', 'Circle time'), 'Group time on the carpet, morning meeting.'],
  [cell('book-open', 'Reading'), 'Story time, guided reading, quiet reading.'],
  [cell('pencil', 'Writing'), 'Any writing or tracing task.'],
  [cell('person-running', 'PE'), 'Gym, movement breaks, outdoor games.'],
  [cell('sandwich', 'Lunch'), 'Lunch, wherever it happens.'],
  [cell('armchair', 'Calm corner'), 'A break or quiet space.'],
  [cell('check-circle', 'Finished'), 'The pocket or envelope cards go into when done.'],
], 'Suggested labels. Keep each word short and use the same one every day.')}

${h2('Which style should I pick for children?')}
${p(`Every icon comes in ${N_STYLES} styles, so you can choose a look that suits your learners and then stick with it. Clear, bold styles such as Solid or Duo read best from across a room. Softer, friendlier ones such as ${L.style('kawaii')} or ${L.style('pastel')} can feel more inviting for little ones, as long as the object stays easy to recognise.`)}
${styleRow('backpack', `The ${L.icon('backpack')} icon in six styles. Choose one for the whole schedule; more child-friendly looks are on our ${L.page('free/cute-icons.html', 'cute icons page')}.`, { styles: ['solid', 'duo', 'kawaii', 'pastel', 'plush', 'sticker'] })}

${h2('How big should I print visual schedule cards?')}
${p('There is no official size, and the right one depends on the child, the distance and where the schedule lives. As a starting point, we suggest:')}
${ul([
  '<strong>Wall schedule for the whole class:</strong> 3 to 4 inches (7.5 to 10 cm), readable from the carpet.',
  '<strong>Individual strip or desk schedule:</strong> about 2 to 3 inches (5 to 7.5 cm), easy to grab and move.',
  '<strong>Lanyard or “on the go” cards:</strong> 1 to 1.5 inches (2.5 to 4 cm), for older children who already know the pictures.',
])}
${p(`For sharp prints, download a PNG at 1,024 pixels or bigger (that covers a 3-inch card at 300 pixels per inch with room to spare), or use the PDF download, which stays crisp at any size. Our ${L.post('icon-resolution-for-print', 'print resolution guide')} explains why.`)}
${art('m-visual-schedule-icons-card-sheet', 'A printable sheet: twelve cards, one icon and one word each, with cutting margins.', { brief: 'A flat top-down view of a US Letter / A4 sheet laid out as a 3 x 4 grid of rounded schedule cards, each about 2.5 inches square with a thin cut line and a small margin. Each card shows one with icons icon in duo style with a bold label under it: Wake up (alarm-clock), Brush teeth (tooth), Get dressed (shirt), Breakfast (utensils), Bus (bus), Circle time (users), Reading (book-open), Writing (pencil), PE (person-running), Lunch (sandwich), Calm corner (armchair), Home (home). Tiny ruler marks at the edge showing “2.5 in / 6.4 cm”.' })}

${h2('How do I make a visual schedule in Word, Google Docs or Canva?')}
${steps([
  ['Pick your icons', `Search the ${L.icons('icon library')} for each activity, choose one style, and download each as a PNG (1,024 px) or use Copy image.`],
  ['Make a grid', `In Word or Google Docs, insert a table with equal square cells. The ${L.guide('word-google-docs', 'Word and Google Docs guide')} shows how to insert and size icons. In Canva, use a grid frame (the ${L.guide('canva', 'Canva guide')} covers uploads).`],
  ['Add the words', 'Type one short label under each picture, in a clear, large font. Add a second language on a second line if it helps.'],
  ['Print on card', 'Use thick card if your printer takes it, or print on paper and laminate.'],
  ['Laminate and cut', 'Cut cards out, laminate, then cut again leaving a small sealed border.'],
  ['Add hook-and-loop dots', 'Hook side on the schedule strip, loop side on the back of each card, so cards move on and off.'],
])}

${h2('Laminating tips that save you a Sunday')}
${ul([
  '<strong>Leave a border.</strong> Cut about 3 to 5 mm outside the card edge after laminating, so the seal holds and corners do not peel.',
  '<strong>Round the corners.</strong> Rounded corners last longer and are kinder to small hands.',
  '<strong>Go matte if you can.</strong> Matte pouches cut glare under classroom lights, so pictures stay easy to see.',
  '<strong>Print spares.</strong> Cards go missing. Keep a spare sheet of the most-used ones (lunch, toilet, home) in a folder.',
  '<strong>Add a “finished” pocket.</strong> An envelope at the end of the strip, marked with a check, gives children a clear way to move a card when an activity is done.',
])}
${art('m-visual-schedule-icons-first-then', 'A simple First / Then board: one task, then the reward.', { brief: 'A friendly mockup of a laminated “First / Then” board on a classroom table: two large card slots side by side with the words “First” and “Then” above them. In “First” sits a card with the with icons pencil icon (kawaii style) labelled “Writing”; in “Then” a card with the playground icon (kawaii style) labelled “Playtime”. Visible hook-and-loop dots and a small “finished” envelope with a check-circle icon at the side. Soft, warm colours.' })}

${h2('Which free picture symbol sets can teachers use, and what do the licences say?')}
${p('Here is the part link lists skip. “Free to download” is not the same as “free to share or sell”, and that matters the moment you post a schedule pack online or hand it to another school.')}
${table(['Source', 'Free?', 'Credit needed?', 'Share or sell what you make?'], [
  ['with icons (MIT)', yes('Yes'), yes('No'), yes('Yes, share and sell freely')],
  ['Mulberry Symbols (CC BY-SA 4.0)', yes('Yes'), meh('Yes, when you share'), meh('Yes, but derived symbols stay CC BY-SA and the symbols themselves must stay free')],
  ['ARASAAC (CC BY-NC-SA)', yes('Yes'), meh('Yes, author, owner, ARASAAC and licence'), no('Non-commercial only; share under the same licence')],
  ['Boardmaker PCS (Tobii Dynavox)', no('Subscription'), meh('Licence terms apply'), no('Own students: generally fine. Sharing publicly or selling needs a PCS licence')],
  ['Random images from a web search', no('Unknown'), no('Unknown'), no('Avoid: no licence means no permission')],
], 'Picture symbol licences for teachers, checked November 2026.')}
${p('Mulberry is designed for communication and published under Creative Commons BY-SA 4.0: you can use it in products, commercial or not, as long as you credit it and share any new or changed symbols under the same licence, and you may not charge for the symbols themselves. ARASAAC, from the Government of Aragón, is CC BY-NC-SA: free for non-profit use with a credit to the author, Sergio Palao, the owner and ARASAAC, and never in commercial products.')}
${p('Boardmaker’s Picture Communication Symbols are proprietary. Tobii Dynavox says a teacher using them in their own classroom materials probably needs no extra licence, but sharing or selling PCS materials does. Its Maker Personal licence for selling on sites such as Etsy or TPT costs USD 149, and every licence requires a Boardmaker subscription first.')}
${callout('tip', `Selling a schedule pack on Teachers Pay Teachers? With MIT icons you can, no credit needed. Sell the finished pack (your layout, labels and instructions), not a folder of loose icon files. More in ${L.post('sell-products-with-free-icons', 'selling products made with free icons')}.`)}

${h2('Tips for ESL and autistic learners')}
${ul([
  '<strong>Same word, same picture, every adult.</strong> Agree the labels as a team so the teaching assistant, specialist and parents all say “calm corner”, not three different things.',
  '<strong>Two languages, one card.</strong> Put the home language under the English word. The picture bridges both.',
  '<strong>Show changes before they happen.</strong> Swap in a card for an assembly or a supply teacher at the start of the day.',
  `<strong>Keep it calm.</strong> One style, plenty of white space, no decorative clutter. Our ${L.post('accessible-icons', 'accessible icons guide')} explains why contrast and simple shapes matter.`,
  '<strong>Follow the learner.</strong> Some children need photos of the real place first; others are ready for a written list. Let them lead.',
])}
${cta('Print your schedule cards today', `${N_ICONS} free icons in ${N_STYLES} styles, MIT licensed. Download PNG or PDF, print, laminate, share with colleagues. No sign-up, no credit needed.`, ['backpack', 'book-open', 'pencil', 'alarm-clock', 'smile', 'star'])}
`,
}
