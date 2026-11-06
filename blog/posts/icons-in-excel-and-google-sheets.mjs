import { p, h2, h3, ul, art, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icons-in-excel-and-google-sheets',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-icons-in-excel-and-google-sheets',
  stickers: [['file-spreadsheet', 'gloss'], ['chart-bar', 'duo'], ['check-circle', 'sticker']],
  title: 'How to add icons in Excel and Google Sheets: cells and charts',
  cardTitle: 'Icons in Excel and Sheets',
  h1: 'How to add icons in <em>Excel</em> and <em>Google Sheets</em>',
  dek: 'Spreadsheets can hold real icons now: inside cells, next to data, even stacked into a picture chart. Here is what each app can do in 2026, and where the old tutorials send you the long way round.',
  description: 'Put icons in Excel and Google Sheets cells, make pictograph charts with Stack and Scale, and know when icon sets beat real icons. Updated for 2026 features.',
  keywords: ['icons in google sheets', 'insert icon excel cell', 'pictograph chart excel', 'icon chart google sheets', 'image in cell google sheets', 'excel place in cell', 'excel icon sets', 'image function google sheets'],
  about: ['Microsoft Excel', 'Google Sheets', 'Pictogram', 'Conditional formatting', 'Icon'],
  related: ['svg-vs-png-icons', 'icon-sizes-guide', 'powerpoint-icons-missing'],
  tldr: [
    '<strong>Icons in a cell, Google Sheets:</strong> Insert › Image, then choose “in the cell”. It takes PNG, JPG or GIF under 50 MB (no SVG), and the icon moves with its row when you sort.',
    '<strong>Icons in a cell, Excel:</strong> Insert › Pictures › Place in Cell, in Excel for Microsoft 365 and Excel 2024. Older Excel can only float pictures over cells.',
    '<strong>Picture charts:</strong> in Excel, fill a bar with a PNG icon and choose “Stack and Scale with” N units per picture. Google Sheets charts cannot fill bars with pictures.',
    '<strong>Icon sets are not icons:</strong> Excel’s conditional-format icon sets are a fixed built-in collection. For your own icons, place PNGs in cells.',
    `<strong>=IMAGE() needs a public picture link.</strong> with icons does not host single PNG files you can link to, so download the PNG (any size, any colour, ${N_ICONS} icons) and insert it.`,
  ],
  faq: [
    { q: 'How do I insert an icon into a cell in Google Sheets?', a: 'Click the cell, choose Insert › Image, then pick the option to place the image in the cell, and upload a PNG. Google says images must be under 50 MB in .png, .jpg or .gif, SVG is not supported, and a cell with an image cannot also hold text.' },
    { q: 'Does Google Sheets have an icon library like Excel?', a: 'No. Google Sheets has no Insert › Icons menu. You bring your own icons as images, either uploaded into cells or loaded from a public link with the IMAGE function.' },
    { q: 'Can I use SVG icons in Excel or Google Sheets cells?', a: 'Not in cells. Google says SVG isn’t supported for images in Sheets or the IMAGE function, and Excel’s Place in Cell and IMAGE lists name PNG, JPG, GIF, BMP, ICO, TIFF and WEBP, not SVG. Excel can show SVG as a floating picture, but for cells use PNG.' },
    { q: 'How do I make a pictograph chart in Excel?', a: 'Make a bar or column chart, right-click a bar, choose Format Data Series › Fill › Picture or texture fill, insert a PNG icon, then pick Stack and Scale with and type how many units each icon stands for.' },
    { q: 'Can Google Sheets make a chart with icons?', a: 'Not with picture-filled bars: the chart editor changes colours, borders and fonts, not pictures. Use repeated icons in cells, a quick REPT text bar, or build the picture chart in Excel, Google Slides or Canva.' },
    { q: 'Can I link to with icons PNGs with =IMAGE()?', a: 'No. Our public CDN serves SVG files, and the IMAGE functions in Sheets and Excel do not show SVG. Download the PNG from the icon page and insert it, or host the PNG on a public site you control and link to that.' },
  ],
  sources: [
    { title: 'Google Docs Editors Help: Add an image to a spreadsheet (PNG/JPG/GIF under 50 MB, no SVG), checked Nov 2026', url: 'https://support.google.com/docs/answer/9224754' },
    { title: 'Google Docs Editors Help: IMAGE function (Sheets), checked Nov 2026', url: 'https://support.google.com/docs/answer/3093333' },
    { title: 'Google Workspace Updates: Insert images in cells in Google Sheets (19 March 2019)', url: 'https://workspaceupdates.googleblog.com/2019/03/sheets-images-in-cells.html' },
    { title: 'Google Docs Editors Help: Use conditional formatting rules in Google Sheets, checked Nov 2026', url: 'https://support.google.com/docs/answer/78413' },
    { title: 'Google Docs Editors Help: Add & edit a chart or graph, checked Nov 2026', url: 'https://support.google.com/docs/answer/63824' },
    { title: 'Microsoft Support: Insert picture in cell in Excel (Microsoft 365, Excel 2024), checked Nov 2026', url: 'https://support.microsoft.com/en-US/excel/insert-picture-in-cell-in-excel' },
    { title: 'Microsoft Support: IMAGE function (Excel), checked Nov 2026', url: 'https://support.microsoft.com/en-us/office/image-function-7e112975-5e52-4f2a-b9da-1d913d51f5d5' },
    { title: 'Microsoft 365 Insider blog: Insert pictures in cells in Excel (July 2023 preview)', url: 'https://techcommunity.microsoft.com/blog/microsoft365insiderblog/insert-pictures-in-cells-in-excel/4221195' },
    { title: 'Microsoft Support: Use conditional formatting to highlight information in Excel (icon sets), checked Nov 2026', url: 'https://support.microsoft.com/en-us/office/use-conditional-formatting-to-highlight-information-in-excel-fed60dfa-1d3f-4e13-9ecb-f1951ff89d7f' },
    { title: 'Microsoft Q&A: Stack and Scale in a column chart', url: 'https://learn.microsoft.com/en-us/answers/questions/4777505/stack-and-scale-in-a-column-chart' },
    { title: 'Microsoft Support: Insert icons in Microsoft 365, checked Nov 2026', url: 'https://support.microsoft.com/en-us/office/insert-icons-in-microsoft-365-e2459f17-3996-4795-996e-b9a13486fa79' },
  ],
  body: () => `
${p(`<span class="lede">You can put real icons inside spreadsheet cells in both apps today. In <strong>Google Sheets</strong>, choose Insert › Image and place it in the cell; in <strong>Excel for Microsoft 365 or Excel 2024</strong>, choose Insert › Pictures › Place in Cell. Both want a PNG (not SVG). For icon charts, Excel can stack an icon inside each bar with “Stack and Scale”, while Google Sheets charts cannot use pictures at all.</span>`)}
${p(`Most tutorials that rank for this were written for Excel 2016, when icons could only float on top of the grid, and many send Sheets users to paid add-ons for something Sheets has done natively since 2019. This guide covers what works now, in plain steps, plus one honest limit of our own: you cannot hotlink with icons PNGs, so you download them instead.`)}

${h2('Can you put icons in Excel and Google Sheets?')}
${table(['What you want', 'Google Sheets', 'Excel for Microsoft 365 / 2024', 'Excel 2021 and older'], [
  ['Icon inside a cell', yes('Insert › Image, in the cell'), yes('Place in Cell'), no('Floating only')],
  ['Icon from a web link', yes('=IMAGE(url)'), yes('=IMAGE(url)'), no('No')],
  ['Built-in icon library', no('No'), yes('Insert › Icons'), meh('2019 and 2021 have a smaller set')],
  ['Icons inside chart bars', no('No'), yes('Picture fill, Stack and Scale'), yes('Picture fill, Stack and Scale')],
  ['Traffic lights by value', no('Colours only'), yes('Icon sets'), yes('Icon sets')],
  ['SVG in a cell', no('No'), no('No (floating SVG is fine)'), no('No')],
], 'What each app can do with icons, checked against Google’s and Microsoft’s help pages in November 2026.')}

${h2('How do you put an icon in a cell in Google Sheets?')}
${p('Google added images in cells in March 2019, and its announcement put the big benefit simply: the image is tied to its row and “will move along with the data”. Sort or filter, and the icons go with their rows instead of piling up on top of the sheet.')}
${steps([
  ['Get the icon as a PNG', `Open the icon in ${L.icons('the library')}, for example ${L.icon('check-circle')}. Pick your colour and download a PNG at 256 px. That is plenty for a cell, and it shrinks cleanly.`],
  ['Click the cell', 'Select the cell where the icon should go. It needs to be empty: Google says a cell with an image cannot also hold text.'],
  ['Insert it in the cell', 'Choose Insert › Image, choose to place the image in the cell, then upload your PNG. Google accepts .png, .jpg or .gif under 50 MB, and says SVG isn’t supported.'],
  ['Make it bigger if needed', 'The icon fits itself to the cell. Drag the row taller and the column wider to make it larger.'],
])}
${p('Already placed an image over the cells? Select it and choose “Put image in selected cell” from its menu. To reuse one icon (say, a green tick for “done”), just copy the cell and paste it down the column.')}
${art('m-icons-in-excel-and-google-sheets-status-cells', 'Real icons in cells versus built-in icon sets, on the same little project tracker.', { brief: 'A clean generic spreadsheet mockup (no Google or Microsoft branding) with two side-by-side panels of the same 5-row task tracker (columns: Task, Owner, Status). Left panel labelled "Built-in icon set": generic traffic-light dots in the Status column. Right panel labelled "Your own icons": with icons in the solid style inside the Status cells (check-circle in green, clock in amber, alert-triangle in red, x-circle in grey). Light background, one accent colour per status, crisp grid lines.' })}

${h2('What about the IMAGE function?')}
${p('Both apps also have a formula that shows a picture from a web address. In Sheets it is <code>=IMAGE(url, [mode], [height], [width])</code>, where mode 1 fits the image into the cell and mode 4 lets you set an exact size. Excel’s version is <code>=IMAGE(source, [alt_text], [sizing], [height], [width])</code>. The formula is handy when the pictures already live online, like product photos in a catalogue.')}
${ul([
  '<strong>The link must be public.</strong> Sheets will not use links hosted at drive.google.com. Excel needs an https link, does not show pictures that need a login, and blocks links that redirect.',
  '<strong>No SVG.</strong> Google says SVG isn’t supported. Excel’s list is BMP, JPG, GIF, TIFF, PNG, ICO and WEBP (WEBP not on the web or Android).',
])}
${callout('warn', `<p>Being honest about our side: with icons does not host single PNG files you can link to. Our public CDN serves the icons as SVG, which neither IMAGE function will show. So for spreadsheets, download the PNG from the icon page (any size, any colour) and insert it as above. If you really want formulas, host the PNGs on a public site you control and point IMAGE at those links.</p>`, 'Can you hotlink with icons PNGs?')}

${h2('How do you put an icon in a cell in Excel?')}
${p('Excel caught up with Sheets more recently. Microsoft previewed pictures in cells with Insiders in July 2023, and today its help page lists Place in Cell for <strong>Excel for Microsoft 365 and Excel 2024</strong>.')}
${steps([
  ['Download a PNG', 'Pick the colour on the icon page and download 256 px. Excel also accepts JPG, BMP, ICO, WEBP, TIFF and non-animated GIF in cells, but PNG keeps the see-through background.'],
  ['Choose Place in Cell', 'Select the cell, then Insert › Pictures › Place in Cell › This Device, and choose the file.'],
  ['Mind the paste', 'Microsoft notes that a plain Ctrl+V pastes a picture over the cells, not into one. Right-click the floating picture and choose Place in Cell to drop it in.'],
])}
${p('On Excel 2021 or older there is no Place in Cell. Insert the picture, size it to fit the cell, then open Format Picture › Size & Properties and choose “Move and size with cells”, so it at least follows the cell when rows change height. It still will not sort with the data.')}
${p(`Excel for Microsoft 365 also has its own Insert › Icons library (in desktop Excel, not Excel for the web). Those icons float over the grid. If the button is missing or grey, the causes are the same as in PowerPoint; see ${L.post('powerpoint-icons-missing', 'why Insert › Icons is missing')}.`)}

${h2('Are conditional formatting icon sets the same as icons?')}
${p('No, and mixing them up is where a lot of confusion starts. Excel’s <strong>icon sets</strong> are a conditional formatting rule: Excel looks at each number and puts a small symbol next to it, sorting values into three to five groups with arrows, traffic lights, flags and similar marks. You can mix symbols from different built-in sets, or hide them for some cells, but you cannot add your own pictures. Google Sheets’ conditional formatting changes text and fill colours, with no icon sets.')}
${doDont('<p>Use Excel’s icon sets when the icon must <em>update itself</em> as numbers change, like a KPI that turns red below target. Use your own PNG icons for labels that rarely change: categories, status, people, product types.</p>', '<p>Hunt for an add-on to change the traffic-light look. Icon sets are fixed; if you want your brand’s style, place real icons in cells instead.</p>')}
${p('A middle path that works in both apps: put one icon per status in a small “key” area, then copy the matching icon cell next to each row as you update it. It is manual, but it looks far better than a row of default dots.')}

${h2('How do you make a pictograph chart in Excel?')}
${p('A pictograph (or icon chart) shows numbers as rows of little pictures: each person icon is 1,000 visitors, each coin is $100. Excel has done this since long before the current versions, and the steps are the same in Microsoft 365, 2024 and 2021.')}
${steps([
  ['Make a bar or column chart', 'Select your data and insert a clustered bar or column chart.'],
  ['Open the fill settings', 'Right-click one of the bars and choose Format Data Series, then Fill › Picture or texture fill.'],
  ['Insert your icon', 'Click Insert and choose the PNG file. If you copied an icon instead (Copy image on an icon page), the Clipboard button uses that.'],
  ['Choose Stack and Scale with', 'Select Stack and Scale with, then type how many units one icon stands for, for example 1000. A bar of 4,500 now shows four and a half icons.'],
  ['Tidy up', 'Set Gap Width lower so the icons are bigger, remove the gridlines, and label the bars with their values. One colour per series reads best.'],
])}
${p(`Use a square PNG at about 256 to 512 px, in the ${L.style('solid')} style: filled shapes stay readable when Excel shrinks them, where thin outlines can fade. The ${L.page('categories/users.html', 'people')} and ${L.page('categories/charts.html', 'chart')} categories are a good place to start.`)}
${art('m-icons-in-excel-and-google-sheets-pictograph', 'One bar, three ways: a plain bar, an icon stretched to fill it, and Stack and Scale.', { brief: 'Three horizontal bars of the same value (4,500) stacked vertically on a light chart background, each labelled on the left. Top: "Plain bar", a flat accent-coloured bar. Middle: "Stretch", a single with icons users icon (solid style) awkwardly stretched along the whole bar. Bottom: "Stack and Scale, 1 icon = 1,000", four and a half crisp users icons in a row, the last one cut in half. A small legend chip at the end: "1 icon = 1,000 visitors". No app branding.' })}
${iconGrid(['users', 'user', 'person-standing', 'banknote', 'coins', 'shopping-cart', 'truck', 'leaf', 'heart', 'star', 'trophy', 'home'], 'solid', 'Good icons for picture charts: people, money, orders, deliveries, ratings. All free PNG downloads in any colour.')}

${h2('Can Google Sheets make icon charts?')}
${p('Not the Excel way. The Sheets chart editor lets you change colours, borders, fonts and gridlines, but it has no picture fill for bars. You still have three good options:')}
${ul([
  '<strong>Icons in cells:</strong> place the same icon in a row of cells, one per unit (five cells for five thousand). It is a true pictograph and it lives right next to the data.',
  '<strong>A quick text bar:</strong> <code>=REPT("●", ROUND(B2/1000))</code> repeats a symbol once per thousand. Not a real icon, but it updates with the numbers.',
  `<strong>Build it where pictures work:</strong> make the chart in Excel, or lay out icons in ${L.guide('google-slides', 'Google Slides')} or Canva, then bring the finished image back. Slides is often the right home anyway, if the chart is going into a deck.`,
])}

${h2('What size and style should spreadsheet icons be?')}
${p('Cells are small, so icons are usually shown at 16 to 32 px. At those sizes simple, filled shapes read best. Download a bigger PNG (128 to 256 px) and let the app shrink it; that stays sharp, while a tiny PNG stretched up goes blurry.')}
${sizeRamp(['check-circle', 'clock', 'alert-triangle', 'x-circle'], [16, 20, 24, 32], 'solid', 'Status icons in the solid style at cell sizes. Filled shapes stay clear even at 16 px.')}
${p(`More on sizes in our ${L.post('icon-sizes-guide', 'icon sizes guide')}, and on why PNG is the right file here in ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}. If you are not sure which download to pick for an app, ${L.guide('which-file', 'which file should I download?')} answers it in one page.`)}

${h2('The short answer')}
${p(`To put icons in cells, use Insert › Image (in the cell) in Google Sheets, or Insert › Pictures › Place in Cell in Excel for Microsoft 365 and 2024, with a PNG. For icon charts, Excel’s picture fill with Stack and Scale does it in a minute; in Google Sheets, repeat icons in cells or build the chart in Slides. Use Excel’s icon sets only when the symbol must change with the numbers. And for the icons themselves, ${L.page('free/png-icons.html', 'free PNG icons')} in your colour are one click away.`)}
${cta('Icons for your spreadsheets', `${N_ICONS} icons in ${N_STYLES} styles. Choose a colour and size, download a PNG, drop it in a cell. Free, MIT licensed.`, ['file-spreadsheet', 'chart-bar', 'check-circle', 'users', 'coins', 'star'])}
`,
}
