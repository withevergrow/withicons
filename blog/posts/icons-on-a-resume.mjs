import { p, h2, h3, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, stats, doDont, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icons-on-a-resume',
  category: 'guides',
  date: '2026-10-03',
  hero: 'xcv2',
  stickers: [['briefcase', 'duo'], ['graduation-cap', 'solid'], ['mail', 'gloss']],
  title: 'Should you use icons on a resume? How to do it well',
  cardTitle: 'Icons on a resume',
  h1: 'Should you use icons on a resume? <em>How to do it well</em>',
  dek: 'A few small icons can make your contact details and sections easier to scan. Used the wrong way, they can hide your phone number from the software that reads resumes. Here is the safe, simple way to do it.',
  description: 'Icons can make a resume easier to scan, but ATS software may skip them. How to add icons safely in Word, Google Docs and Canva, at the right size for print.',
  keywords: ['icons on resume', 'resume icons', 'are icons on a resume ATS friendly', 'CV icons', 'contact icons for resume', 'resume icons Word', 'resume icons Google Docs', 'resume icons Canva'],
  about: ['Résumé', 'Applicant tracking system', 'Icons'],
  related: ['accessible-icons', 'svg-vs-png-icons', 'consistent-icons'],
  tldr: [
    '<strong>Yes, but only as helpers.</strong> Small icons next to your contact details and section headings can make a resume quicker to scan.',
    '<strong>Never put information only in an icon.</strong> Applicant tracking systems (ATS), the software many employers use to read resumes, may skip images or turn icons into random characters. Always write the words too: “Email: you@example.com”.',
    '<strong>Keep them simple:</strong> thin line icons, one colour, about the same size as your text, in the main body of the page (not the header or footer).',
    '<strong>Skip skill bars, star ratings and brand logos.</strong> Software cannot read “4 out of 5 stars”, and recruiters cannot tell what it means anyway.',
    '<strong>Test it:</strong> copy your whole resume and paste it into a plain text editor. If anything important is missing, it needs words.',
  ],
  faq: [
    { q: 'Are icons on a resume unprofessional?', a: 'Not when they are small, simple and consistent. A row of matching line icons beside your email, phone and location looks tidy. Big, colourful or mixed icons, skill bars and emoji tend to look less professional, especially in conservative fields like law or finance.' },
    { q: 'Can applicant tracking systems read icons?', a: 'Often not. Career guides from Indeed and Jobscan, and university career services such as the University at Buffalo, advise avoiding icons and graphics because many ATS cannot read images, and icon fonts can turn into random characters. Systems differ, so the safe rule is that every fact on your resume should also be written as text.' },
    { q: 'Should I put the LinkedIn logo on my resume?', a: 'You do not need it. Write “LinkedIn:” followed by your profile address, optionally with a simple link icon in front. That is clearer for software and people. If you do use a company’s logo, take it from that company’s official brand resources and follow their rules. with icons has no brand logos.' },
    { q: 'Should I use skill bars or star ratings?', a: 'We would not. Jobscan advises against graphics that show skill levels, ATS software cannot read them, and a bar that says you are “80%” at something invites questions about the missing 20%. List your skills as words, with a level in words if it matters, like “Spanish (fluent)”.' },
    { q: 'What size should icons be on a printed resume?', a: 'About the same size as your body text: roughly 0.35 to 0.45 cm (0.14 to 0.18 in) for 10 to 11 pt text. A 256 px PNG is more than sharp enough at that size in print, and an SVG stays sharp at any size.' },
    { q: 'Should I send my resume as Word or PDF?', a: 'Follow the job listing first. If it does not say, Indeed notes that a .docx file helps applicant tracking systems read your details correctly. Whichever you send, check that the text can be selected and copied.' },
  ],
  sources: [
    { title: 'Indeed Career Guide: ATS-friendly resume tips (checked October 2026)', url: 'https://www.indeed.com/career-advice/resumes-cover-letters/automated-screening-resume' },
    { title: 'Jobscan: ATS resume formatting mistakes to avoid', url: 'https://www.jobscan.co/blog/ats-formatting-mistakes/' },
    { title: 'University at Buffalo School of Management, Career Resource Center: ATS-friendly résumés', url: 'https://management.buffalo.edu/career-resource-center/students/preparation/tools/correspondence/resume/electronic.html' },
    { title: 'HR Dive: Eye tracking study shows recruiters look at resumes for 7 seconds (Ladders, 2018)', url: 'https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/' },
    { title: 'Microsoft Support: Edit SVG images in Microsoft 365', url: 'https://support.microsoft.com/en-us/office/edit-svg-images-in-microsoft-365-69f29d39-194a-4072-8c35-dbe5e7ea528c' },
  ],
  body: () => `
${p(`<span class="lede">Yes, you can use icons on a resume, as long as they only help people find information and never replace it. A few small icons beside your email, phone number and section headings make a page quicker to scan. But the software many employers use to read resumes may skip images or scramble icons, so every detail must also be written in plain words.</span>`)}
${p('That is the whole answer in one line: icons as signposts, words as the content. The rest of this guide shows where icons help, which ones to pick, what to avoid, and exactly how to add them in Word, Google Docs and Canva at a size that prints crisply.')}
${stats([['7.4 s', 'average first look at a resume (Ladders, 2018)'], ['0', 'facts that should exist only as an icon'], ['1', 'icon colour is plenty'], ['~0.45 cm', 'icon height for 11 pt text']])}

${h2('Do icons help or hurt a resume?')}
${p('Both, depending on how you use them. Here is the honest balance.')}
${p('<strong>Where they help:</strong> recruiters skim. A small 2018 eye-tracking study by the job site Ladders found recruiters spent an average of 7.4 seconds on a first look, and resumes with simple layouts, clear sections and headings did better than cluttered ones. A tiny envelope beside your email or a briefcase beside “Experience” acts like a signpost, so the eye lands in the right place faster.')}
${p('<strong>Where they hurt:</strong> before a person sees your resume, software often reads it first. If your phone number lives only inside an icon, or a skill is shown only as five stars, that information may simply disappear. Icons also add visual noise when there are too many, in too many colours.')}
${callout('note', 'Think of resume icons like the little symbols on airport signs. They help you find the gate faster, but the sign still says “Gate 12” in words.')}

${h2('What is an ATS, and can it read icons?')}
${p('An ATS (applicant tracking system) is software that companies use to collect applications. It pulls the text out of your resume, sorts it into fields like name, email and job titles, and lets recruiters search it. If the text does not come out cleanly, you can be harder to find.')}
${p('Career advisers are consistent about icons and graphics:')}
${ul([
  '<strong>Indeed’s career guide</strong> advises avoiding tables, charts, graphics, pictures and complex formatting, and using standard round bullets rather than stars, checkmarks or icons.',
  '<strong>Jobscan</strong>, which makes resume-scanning software, suggests replacing icons with text (“Phone:” instead of a phone symbol), warns that unusual fonts and “clever” icons can be turned into random characters, and advises against graphics that show skill levels.',
  '<strong>The University at Buffalo’s career resource center</strong> tells students to leave out images of any kind, including icons, for ATS-friendly resumes.',
  '<strong>Headers and footers</strong> are a risk too. Indeed notes some systems may not read them accurately, so contact details belong in the main body of the page.',
])}
${p('ATS products vary, and some read images and layouts better than others. You usually cannot know which one an employer uses. So treat this as guidance, not a ban: icons are fine as decoration, as long as the resume still makes complete sense with every icon removed.')}
${figure('xcv1', 'However a resume is made, the words do the real work. Icons are only there to guide the eye.')}

${h2('Where do icons actually help on a resume?')}
${p('In two places, mostly:')}
${ul([
  '<strong>The contact line.</strong> Email, phone, city and a link to your portfolio or LinkedIn. A matching icon in front of each makes the line easy to scan.',
  '<strong>Section headings.</strong> Experience, Education, Skills, Languages, Awards. One small icon beside each heading helps people jump between sections.',
])}
${p('Elsewhere they mostly add clutter. Icons as bullet points, icons inside every job entry, or icons on each skill quickly make a page busy, and Indeed specifically suggests plain round bullets.')}

${h2('Which icons work best on a resume?')}
${p(`Simple, familiar ones. Here is a ready-made set from ${L.icons('with icons')}, all in the ${L.style('line', 'Line style')}, so they share the same stroke and size and look like one family. Click any icon to download it.`)}
${iconGrid(['mail', 'phone', 'map-pin', 'link', 'globe', 'briefcase', 'graduation-cap', 'award', 'language', 'code'], 'line', 'A resume-friendly set: contact details first, then section headings. All free, MIT licensed, no sign-up.')}
${table(['What you are showing', 'Icon', 'Always write next to it'], [
  ['Email', L.icon('mail'), 'Your full email address'],
  ['Phone', L.icon('phone'), 'Your number, with country code if applying abroad'],
  ['Location', L.icon('map-pin'), 'City and country (no street address needed)'],
  ['LinkedIn or portfolio', L.icon('link') + ' or ' + L.icon('globe'), '“LinkedIn:” or “Portfolio:” plus the address'],
  ['Experience', L.icon('briefcase'), 'The heading “Experience”'],
  ['Education', L.icon('graduation-cap'), 'The heading “Education”'],
  ['Awards', L.icon('award'), 'The heading “Awards”'],
  ['Languages', L.icon('language'), 'Each language and your level in words'],
  ['Technical skills', L.icon('code'), 'Each skill as a word'],
], 'Resume icons and the text that should always sit next to them')}
${p(`Notice there are no LinkedIn, GitHub or other company logos here. with icons has no brand logos on purpose, and you do not need them: a ${L.icon('link', 'link icon')} plus the words “LinkedIn:” and your address is clearer for software and people alike.`)}
${styleRow('briefcase', 'Line and Solid suit a resume. The playful styles are lovely on a portfolio site or a creative CV, but keep them off a resume that goes through an ATS.', { styles: ['line', 'solid', 'duo', 'gloss', 'sticker', 'kawaii'] })}

${h2('What should you avoid?')}
${table(['Idea', 'On a resume?', 'Why'], [
  ['Small line icons beside contact details', yes('Good'), 'Faster to scan; text stays readable by software'],
  ['One icon per section heading', yes('Good'), 'Helps the eye jump between sections'],
  ['Icons as bullet points', no('Avoid'), 'Indeed suggests standard round bullets'],
  ['Skill bars, stars or rating dots', no('Avoid'), 'Software cannot read them, and “4 of 5” means little to a recruiter'],
  ['Icons in the header or footer', no('Avoid'), 'Some systems skip headers and footers entirely'],
  ['Icon fonts (icons typed as special characters)', no('Avoid'), 'They can turn into random symbols when the text is extracted'],
  ['Coloured, 3D or glossy icons', meh('Creative fields only'), 'Can look busy and print poorly in black and white'],
], 'Resume icon ideas, from safe to risky')}
${doDont('<p>Use 5 to 8 small icons in one style and one colour, each right next to the words it describes, in the main body of the page.</p>', '<p>Show your phone number only as an icon, rate your skills with stars, or mix icons from different sets in different colours.</p>')}

${h2('How do you add icons to a resume in Word?')}
${p(`Word in Microsoft 365, and Word 2019 or newer, can insert SVG files, which stay perfectly sharp in print and can be recoloured. Our ${L.guide('word-google-docs', 'Word and Google Docs guide')} has pictures for each step.`)}
${steps([
  ['Download the SVG', `Open an icon page, for example ${L.icon('mail')}, pick a colour that matches your text (dark grey or black is safest), and click Download SVG.`],
  ['Insert it', 'Click where the icon should go, then choose Insert › Pictures › This Device (Windows) or Insert › Pictures › Picture from File (Mac).'],
  ['Keep it in line with the text', 'Click the icon, open Layout Options and choose In Line with Text, so it moves with your words instead of floating.'],
  ['Make it text-sized', 'Set the height to about 0.45 cm (0.18 in) for 11 pt text in the Graphics Format tab.'],
  ['Type the words next to it', 'Add a space, then the actual text: your email, phone or heading. Repeat for each line.'],
])}
${callout('tip', 'Put your contact line in the main body at the top of page one, not in Word’s Header area. It looks the same on paper, but some ATS skip headers.')}

${h2('How do you add icons in Google Docs?')}
${p('Google Docs works with PNG images rather than SVG, which is fine: at resume size, a 256 px PNG is far sharper than your printer needs.')}
${steps([
  ['Download a PNG', 'On the icon page, choose your colour, click Download PNG and pick 256 px.'],
  ['Insert it', 'Place your cursor, then choose Insert › Image › Upload from computer.'],
  ['Set it to In line', 'Click the image and choose In line in the small bar under it.'],
  ['Resize it', 'Drag a corner until the icon is about as tall as your text, or set it in Image options › Size & Rotation.'],
])}

${h2('How do you add icons in Canva?')}
${p(`Canva is popular for good-looking resumes, and it accepts both SVG and PNG uploads. The ${L.guide('canva', 'Canva guide')} covers recolouring in detail.`)}
${h3('PNG or SVG for Canva?')}
${ul([
  '<strong>SVG</strong> stays sharp at any size and Canva can recolour filled shapes. For outline styles like Line, choose the colour on with icons before you download, because Canva may not let you recolour outlines.',
  '<strong>PNG</strong> is the simple fallback if an upload fails. Download it at 256 px or larger in your final colour.',
])}
${steps([
  ['Upload', 'In the Canva editor, open Uploads › Upload files and choose your icons.'],
  ['Place and size', 'Click an icon to add it, then drag a corner until it matches the height of your text.'],
  ['Pick a simple template', 'Choose a single-column layout. Jobscan notes that multi-column layouts often scramble the reading order for ATS.'],
  ['Download as PDF', 'Use Share › Download › PDF Standard (or PDF Print for printing), then run the copy-and-paste test below.'],
])}

${h2('What size should resume icons be for print?')}
${p('Make icons about the same size as your body text, so they sit neatly on the line. For 10 to 11 pt text, that is roughly <strong>0.35 to 0.45 cm</strong> (0.14 to 0.18 in). Printers commonly work at around 300 dots per inch, so an icon that size needs only about 55 pixels to look sharp. A 256 px PNG gives you several times that, and an SVG has no pixels at all, so it is always crisp.')}
${sizeRamp(['mail', 'phone', 'map-pin', 'link'], [12, 14, 16, 20, 24], 'line', 'Contact icons from small to large. On a resume, the 14 to 16 px range on screen usually matches 10 to 11 pt text.')}
${p(`Keep all your icons the same size and the same colour. Mixing sizes is the fastest way to make a page look untidy. Our post on ${L.post('consistent-icons', 'keeping icons consistent')} explains why, and ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')} covers the file formats.`)}

${h2('How can you check your resume still works for an ATS?')}
${steps([
  ['Copy and paste everything', 'Open your final PDF or document, select all, copy, and paste into a plain text editor like Notepad or TextEdit.'],
  ['Read it top to bottom', 'Is your name, email, phone and city there as text? Are sections in a sensible order? If a detail is missing, it was trapped in an image, a text box or the header.'],
  ['Check the file type', 'Send the format the job listing asks for. If it does not say, Indeed notes that .docx helps systems read your details.'],
  ['Get a human to skim it', 'Ask a friend to look for 10 seconds and tell you your email and last job. If they find them fast, the icons are doing their job.'],
])}

${h2('The bottom line')}
${p(`Icons on a resume are a nice extra, not a requirement. Used lightly, as small, matching line icons beside your contact details and section headings, they make the page friendlier to skim. Used heavily, or instead of words, they can cost you with the software that reads resumes before people do. Keep the words, keep it simple, and test with copy and paste. When you are ready, grab ${L.icon('mail')}, ${L.icon('phone')}, ${L.icon('map-pin')} and ${L.icon('briefcase')} and you are done in five minutes. Icons that carry meaning should also be clear for everyone: see ${L.post('accessible-icons', 'accessible icons')}.`)}
${cta('Grab a matching resume icon set', `${N_ICONS} free icons in ${N_STYLES} styles. Pick a colour, download SVG or PNG, and drop them into Word, Google Docs or Canva. MIT licensed, no sign-up.`, ['mail', 'phone', 'map-pin', 'briefcase', 'graduation-cap', 'award'])}
`,
}
