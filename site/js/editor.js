/* with icons — Icon Studio: the live "Customize" editor + real-world placements.
   Classic script, no build, no dependencies. Load after js/site.js (it attaches to window.WI).

   const ed = WI.Editor.mount(el, {
     name: 'bell',                       // required
     title, style, data,                 // data: { styles: { <style>: { root, inner, hex, title, say, sw } }, component, motion, related, thumbs }
     motion,                             // the icon's motion spec (default: window.WITH_MOTION[name])
     placements: el | selector | false,  // render the 10 live mock-ups into this element
     remember: true, storageKey,         // settings in localStorage (try/catch)
     onChange(state, ed)
   })
   ed.get() · ed.set(patch) · ed.setIcon(name, { data, motion, title }) · ed.on('change', fn) · ed.tab(name) · ed.destroy()
   ed.svg(opts) (markup for the current state) · ed.svgText(mode, style?) · ed.motionInfo()
   ed.actions.{copyImage, copySvg, downloadSvg, downloadPng, downloadAnimated, downloadGif, copyTag, copyCode}
   Download (every format in js/export/*.js, window.WithExport, loaded on first use): the studio shows its own panel
     (opts.downloads: false leaves it out); ed.downloadPanel(el, { quick, title, motionTab, anchor }) mounts one anywhere;
     ed.downloads() lists them (panel.make(formatId, opts) -> { data, filename, mime }, panel.download(formatId, opts)),
     ed.loadExports() fetches the scripts
   "Turn into" (one shared swap state, see SW below):
     ed.set({ swap: { to: 'pause' | 'pause@kawaii', toStyle, link, effect, speed, duration, ease, delay, hold,
       trigger: 'click' | 'hover' | 'auto' | 'focus', on } })   ·   ed.get().swap (null when there is none)
     ed.paintLive(el, { px, trigger }) draws the live icon into el and keeps it in step (on / off is a class, so
     switching animates); ed.swapHost(el) makes el's live swaps follow hover / focus / the shared state;
     ed.swapPress(el) · ed.swapToggle(on?) · ed.swapPlay() · ed.exportCtx() (the WithExport ctx, ctx.swap included)
   The mounted editor is also on its host element: host.withEditor.
   WI.Editor.motionAttrs(entry, { speed, amount, style, deco: 'still', spec }) -> { preset, cls, style } for any wrapper
     (spec: the icon's motion spec, so an inline SVG with part tags keeps its own plate moves and decoration loop)
   Events: 'wied:change' (CustomEvent, detail { state }) bubbles from el. */
(function () {
  'use strict'
  var W = window, D = document
  var ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
  var HEX = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7252FF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861', glass: '#5B9DFF', kawaii: '#FF7A9A', sticker: '#B57CFF', pixel: '#4FAE0C', retro: '#F57C12', luxe: '#2B3FB8', bauhaus: '#D62718', skeuo: '#5A6E86', anime: '#2E9BF0', gothic: '#7A1F3D', pastel: '#3DBFA0', coquette: '#E2456F', plush: '#F2AE24' }
  var INK = '#111318', INK_D = '#F4F0E8'
  var CDN = 'https://cdn.jsdelivr.net/npm/@withicons'
  var CLASH = ['Map', 'Image', 'History', 'File', 'Link', 'Navigation', 'Clipboard', 'Keyboard', 'Bluetooth', 'Screen', 'Option', 'Text', 'Location', 'Range', 'Selection', 'Notification', 'Set', 'Date', 'Error', 'Symbol', 'Proxy', 'Worker', 'Lock', 'Headers', 'Request', 'Response']
  var reducedMq = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false }
  // touch-first devices (phones, tablets): say "tap", not "hover"
  var touchMq = W.matchMedia ? W.matchMedia('(hover: none)') : { matches: false }
  var PX = [64, 128, 256, 512, 1024]
  var SWATCHES = [['ink', 'Black'], ['style', 'Style colour'], ['#FFFFFF', 'White'], ['#2F5BFF', 'Cobalt'], ['#FF5A36', 'Tomato'], ['#22A861', 'Leaf'], ['#FF4FA3', 'Pink'], ['#FFB020', 'Amber'], ['#7252FF', 'Violet']]

  /* ───────────── motion vocabulary (forge/MOTION.md) ─────────────
     [name, label, default seconds, easing, keyframes]. $k = amount, $dx/$dy = unit direction.
     Distances are % of the icon box, so the same keyframes drive an HTML wrapper and an SVG <g>. */
  var PRESET_LIST = [
    ['spin', 'Spin', 1.2, 'linear', 'from{transform:rotate(0)}to{transform:rotate(360deg)}'],
    ['spin-once', 'Spin once', 0.8, 'cubic-bezier(.65,0,.25,1)', 'from{transform:rotate(0)}to{transform:rotate(360deg)}'],
    ['tick', 'Tick', 1, 'linear', 'from{transform:rotate(0)}to{transform:rotate(360deg)}'],
    ['pulse', 'Pulse', 1.4, 'ease-in-out', '0%,100%{transform:scale(1)}50%{transform:scale(calc(1 + .1*$k))}'],
    ['beat', 'Heartbeat', 1.2, 'ease-in-out', '0%,56%,100%{transform:scale(1)}14%{transform:scale(calc(1 + .16*$k))}28%{transform:scale(1)}42%{transform:scale(calc(1 + .12*$k))}'],
    ['breathe', 'Breathe', 3, 'ease-in-out', '0%,100%{transform:scale(1);opacity:1}50%{transform:scale(calc(1 + .07*$k));opacity:.72}'],
    ['float', 'Float', 2.6, 'ease-in-out', '0%,100%{transform:translateY(0)}50%{transform:translateY(calc(-9% * $k))}'],
    ['bounce', 'Bounce', 1, 'ease-in-out', '0%,100%{transform:translateY(0) scale(1)}35%{transform:translateY(calc(-22% * $k)) scale(.98,1.03)}62%{transform:translateY(0) scale(calc(1 + .1*$k),calc(1 - .1*$k))}80%{transform:translateY(calc(-4% * $k)) scale(1)}'],
    ['sway', 'Sway', 2.8, 'ease-in-out', '0%,100%{transform:rotate(calc(-6deg * $k))}50%{transform:rotate(calc(6deg * $k))}'],
    ['ring', 'Ring', 1.4, 'ease-in-out', '0%,70%,100%{transform:rotate(0)}8%{transform:rotate(calc(16deg * $k))}18%{transform:rotate(calc(-14deg * $k))}28%{transform:rotate(calc(10deg * $k))}38%{transform:rotate(calc(-7deg * $k))}48%{transform:rotate(calc(4deg * $k))}58%{transform:rotate(calc(-2deg * $k))}'],
    ['wiggle', 'Wiggle', 0.8, 'ease-in-out', '0%,100%{transform:rotate(0)}20%{transform:rotate(calc(-7deg * $k))}40%{transform:rotate(calc(7deg * $k))}60%{transform:rotate(calc(-4deg * $k))}80%{transform:rotate(calc(3deg * $k))}'],
    ['shake', 'Shake (no)', 0.6, 'ease-in-out', '0%,100%{transform:translateX(0)}15%{transform:translateX(calc(-9% * $k))}30%{transform:translateX(calc(8% * $k))}45%{transform:translateX(calc(-6% * $k))}60%{transform:translateX(calc(4% * $k))}75%{transform:translateX(calc(-2% * $k))}'],
    ['nod', 'Nod (yes)', 0.8, 'ease-in-out', '0%,100%{transform:translateY(0)}20%{transform:translateY(calc(8% * $k))}40%{transform:translateY(calc(-3% * $k))}60%{transform:translateY(calc(5% * $k))}80%{transform:translateY(calc(-1% * $k))}'],
    ['nudge', 'Nudge', 1.2, 'ease-in-out', '0%,100%{transform:translate(0,0)}50%{transform:translate(calc($dx * 14% * $k),calc($dy * 14% * $k))}'],
    ['pass', 'Pass through', 1.4, 'ease-in-out', '0%,100%{transform:translate(0,0);opacity:1}45%{transform:translate(calc($dx * 70% * $k),calc($dy * 70% * $k));opacity:0}46%{transform:translate(calc($dx * -70% * $k),calc($dy * -70% * $k));opacity:0}'],
    ['rise', 'Rise', 1.6, 'ease-in-out', '0%,100%{transform:translateY(0);opacity:1}55%{transform:translateY(calc(-40% * $k));opacity:0}56%{transform:translateY(calc(30% * $k));opacity:0}'],
    ['drop', 'Drop', 1.6, 'ease-in-out', '0%,100%{transform:translateY(0);opacity:1}55%{transform:translateY(calc(40% * $k));opacity:0}56%{transform:translateY(calc(-30% * $k));opacity:0}'],
    ['blink', 'Blink', 3.5, 'ease-in-out', '0%,88%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}'],
    ['flicker', 'Flicker', 1.6, 'linear', '0%,100%{opacity:1;transform:scale(1)}18%{opacity:.7;transform:scale(.97)}24%{opacity:1;transform:scale(1.02)}46%{opacity:.82}52%{opacity:1}74%{opacity:.68;transform:scale(.98)}80%{opacity:1;transform:scale(1)}'],
    ['twinkle', 'Twinkle', 1.8, 'ease-in-out', '0%,100%{transform:scale(1) rotate(0);filter:drop-shadow(0 0 0 transparent)}50%{transform:scale(calc(1 + .16*$k)) rotate(calc(10deg * $k));filter:drop-shadow(0 0 calc(3px * $k) currentColor)}'],
    ['pop', 'Pop', 0.5, 'ease-out', '0%{transform:scale(calc(1 - .15*$k))}55%{transform:scale(calc(1 + .12*$k))}100%{transform:scale(1)}'],
    ['tada', 'Ta-da', 1, 'ease-in-out', '0%,100%{transform:scale(1) rotate(0)}10%,20%{transform:scale(calc(1 - .08*$k)) rotate(calc(-4deg * $k))}30%,50%,70%{transform:scale(calc(1 + .1*$k)) rotate(calc(4deg * $k))}40%,60%{transform:scale(calc(1 + .1*$k)) rotate(calc(-4deg * $k))}80%{transform:scale(1) rotate(0)}'],
    ['jelly', 'Jelly', 0.9, 'ease-in-out', '0%,100%{transform:scale(1,1)}30%{transform:scale(calc(1 + .2*$k),calc(1 - .2*$k))}45%{transform:scale(calc(1 - .14*$k),calc(1 + .14*$k))}60%{transform:scale(calc(1 + .07*$k),calc(1 - .07*$k))}75%{transform:scale(calc(1 - .03*$k),calc(1 + .03*$k))}'],
    ['flip', 'Flip', 1.2, 'ease-in-out', 'from{transform:perspective(400px) rotateY(0)}to{transform:perspective(400px) rotateY(360deg)}'],
    ['rock', 'Rock', 2.4, 'ease-in-out', '0%,100%{transform:rotate(calc(-10deg * $k))}50%{transform:rotate(calc(10deg * $k))}'],
    ['tilt', 'Tilt', 1.6, 'ease-in-out', '0%,100%{transform:rotate(0)}30%,70%{transform:rotate(calc(-8deg * $k))}'],
    ['zoom', 'Zoom', 1.2, 'ease-in-out', '0%,100%{transform:scale(1)}50%{transform:scale(calc(1 + .18*$k))}'],
    ['orbit', 'Orbit', 2.4, 'linear', 'from{transform:rotate(0) translateX(calc(7% * $k)) rotate(0)}to{transform:rotate(360deg) translateX(calc(7% * $k)) rotate(-360deg)}'],
    ['glow', 'Glow', 1.8, 'ease-in-out', '0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 calc(5px * $k) currentColor)}'],
    ['draw', 'Draw on', 1.6, 'ease-in-out', '0%{stroke-dashoffset:1}60%,100%{stroke-dashoffset:0}'],
    ['type', 'Type', 0.9, 'steps(1,end)', '0%,100%{transform:translate(0,0)}25%{transform:translate(0,calc(-4% * $k))}50%{transform:translate(calc(3% * $k),0)}75%{transform:translate(0,calc(3% * $k))}'],
    ['fill', 'Fill up', 1.6, 'ease-out', '0%{opacity:.35}70%,100%{opacity:1}']
  ]
  var PRESETS = {}; PRESET_LIST.forEach(function (p) { PRESETS[p[0]] = { name: p[0], label: p[1], dur: p[2], ease: p[3], kf: p[4] } })
  var EFFECTS = [['fade', 'Fade'], ['scale', 'Scale'], ['rotate', 'Rotate'], ['flip', 'Flip'], ['slide-up', 'Slide up'], ['slide-down', 'Slide down'], ['slide-left', 'Slide left'], ['slide-right', 'Slide right'], ['blur', 'Blur'], ['spin', 'Spin'], ['morph', 'Morph'], ['draw', 'Draw']]
  /* "Turn into" timing vocabulary. Durations are one transition in seconds (the runtime's EFFECT_DEFAULTS win when loaded);
     a speed preset scales the effect's own duration; an easing preset is the feel of the incoming icon (natural = the
     effect's own: a spring for scale / rotate / spin / morph, a soft landing for the rest). */
  var FX_DUR = { fade: 0.3, scale: 0.45, rotate: 0.5, flip: 0.6, 'slide-up': 0.42, 'slide-down': 0.42, 'slide-left': 0.42, 'slide-right': 0.42, blur: 0.45, spin: 0.55, morph: 0.55, draw: 0.75 }
  var SPEEDS = [['snappy', 'Snappy', 0.6], ['smooth', 'Smooth', 1], ['slow', 'Slow', 1.8]]
  var EASES = [['natural', 'Natural', null], ['springy', 'Springy', 'cubic-bezier(.3,1.75,.5,1)'], ['smooth', 'Smooth', 'cubic-bezier(.65,0,.35,1)'], ['snappy', 'Snappy', 'cubic-bezier(.12,.9,.18,1)'], ['gentle', 'Gentle', 'cubic-bezier(.4,0,.2,1)'], ['linear', 'Steady', 'linear']]
  var TRIGGERS = [['click', 'Click or tap', 'Switches each time someone clicks or taps it, and switches back on the next one.'], ['hover', 'Hover', 'Shows the second icon while the pointer is over it. On phones a tap switches it.'], ['auto', 'On its own', 'Turns into the second icon and back by itself, pausing on each one.'], ['focus', 'Focus', 'Shows the second icon while the button or field is selected, by click, tap or keyboard.']]
  var SW_HOLD = 0.9, SW_DUR = [0.1, 2], SW_DELAY = [0, 1], SW_HOLDR = [0.2, 4]

  /* ───────────── Download: every export format, grouped by what people need it for ─────────────
     Format ids are js/export/*.js descriptors (WithExport.get(id)). A format may sit in more than one group. */
  var DL_GROUPS = [
    { id: 'slides', title: 'Slides & documents', say: 'PowerPoint, Word, Keynote, Google Slides, email', use: 'For PowerPoint, Word, Keynote, Google Slides and email.', ids: ['png', 'pptx', 'docx', 'pdf', 'gif', 'pptx-sheet', 'jpg'] },
    { id: 'design', title: 'Design tools', say: 'Figma, Illustrator, Canva, Sketch, After Effects', use: 'For Figma, Illustrator, Canva, Sketch and After Effects.', ids: ['svg-flat', 'svg', 'pdf', 'eps', 'png-set', 'lottie'] },
    { id: 'web', title: 'Websites & apps', say: 'Websites, iPhone and Android apps, code', use: 'For websites, iPhone and Android apps, and code.', ids: ['svg-flat', 'svg', 'webp', 'avif', 'favicon-pack', 'ico', 'android', 'ios'], code: ['jsx', 'tsx', 'vue', 'svelte', 'angular', 'react-native', 'html', 'css', 'data-uri', 'base64'] },
    { id: 'animated', title: 'Animated', say: 'GIF, video, animated PNG and SVG, Lottie', use: 'Moving files: GIF, video, animated PNG and SVG, Lottie.', ids: ['gif', 'apng', 'webp-animated', 'webm', 'mp4', 'animated-svg', 'png-sequence', 'lottie', 'dotlottie'] }
  ]
  // the three files most people want for each goal; the rest of a group (and its code files) wait behind "More formats"
  var DL_TOP = { slides: ['png', 'pptx', 'docx'], design: ['svg-flat', 'pdf', 'svg'], web: ['svg-flat', 'webp', 'favicon-pack'], animated: ['gif', 'mp4', 'animated-svg'] }
  // [short name, what it is for, the badge on its card]
  var DL_FMT = {
    png: ['PNG', 'Slides, docs, chat, Canva', 'PNG'], pptx: ['PowerPoint', 'A ready slide, icon centred', 'PPTX'], 'pptx-sheet': ['PowerPoint, every style', 'Pick a look with your team', 'PPTX'],
    docx: ['Word', 'Reports, briefs, handouts', 'DOCX'], pdf: ['PDF', 'Prints razor sharp', 'PDF'], gif: ['GIF', 'Moves in slides, chat, email', 'GIF'], jpg: ['JPG', 'Where PNG isn’t accepted', 'JPG'],
    'svg-flat': ['SVG', 'Sharp at any size, colours locked in', 'SVG'], svg: ['SVG, themable', 'Recolour it with CSS', 'SVG'], eps: ['EPS', 'Older print and design tools', 'EPS'],
    'png-set': ['PNG set', '@1x to @4x in one ZIP', 'ZIP'], lottie: ['Lottie', 'Vector animation, any size', 'JSON'], dotlottie: ['dotLottie', 'Compact Lottie package', 'LOTTIE'],
    webp: ['WebP', 'Like PNG, smaller file', 'WEBP'], avif: ['AVIF', 'The smallest web image', 'AVIF'], 'favicon-pack': ['Favicon pack', 'Every site icon, plus the tags', 'ZIP'],
    ico: ['ICO', 'favicon.ico and Windows', 'ICO'], android: ['Android', 'Vector drawable for Android Studio', 'XML'], ios: ['iOS', 'Image set for Xcode', 'ZIP'],
    apng: ['Animated PNG', 'Smooth see-through edges', 'PNG'], 'webp-animated': ['Animated WebP', 'Small, for websites', 'WEBP'], webm: ['WebM video', 'Websites and video editors', 'WEBM'],
    mp4: ['MP4 video', 'Keynote, social posts, editors', 'MP4'], 'animated-svg': ['Animated SVG', 'Tiny, sharp, plays by itself', 'SVG'], 'png-sequence': ['PNG frames', 'After Effects, Premiere, Resolve', 'ZIP'],
    jsx: ['React', 'Component file (JSX)', 'JSX'], tsx: ['React + TypeScript', 'Typed component (TSX)', 'TSX'], vue: ['Vue', 'Single-file component', 'VUE'], svelte: ['Svelte', 'Svelte 4 and 5 component', 'SVELTE'],
    angular: ['Angular', 'Standalone component', 'TS'], 'react-native': ['React Native', 'react-native-svg component', 'JSX'], html: ['HTML', 'Inline SVG snippet', 'HTML'],
    css: ['CSS', 'A class for the icon', 'CSS'], 'data-uri': ['Data URI', 'One line for CSS url()', 'TXT'], base64: ['Base64', 'For tools that want base64', 'TXT']
  }
  // plain notes where a descriptor's own note leans on a word the options below explain anyway
  var DL_NOTE = { gif: 'Plays everywhere: Slack, email, Notion, Google Slides, PowerPoint and Keynote. Its see-through edges are simple, so choose the colour it will sit on below.' }
  var DL_AUD = { designers: 'Designers', developers: 'Developers', presentations: 'Slides & docs', web: 'Websites', print: 'Print', mobile: 'Mobile apps' }
  // what each format's size means, its presets and limits (opts key: size | dp | points | inches)
  var DL_SIZE = {
    raster: { key: 'size', unit: 'px', list: [32, 64, 128, 256, 512, 1024], def: 512, min: 8, max: 4096, x2: true },
    set: { key: 'size', unit: 'px', list: [16, 20, 24, 32, 48, 64], def: 24, min: 8, max: 1024, label: 'Size at 1x', hint: '@2x, @3x and @4x are added for you' },
    vector: { key: 'size', unit: 'px', list: [16, 24, 32, 48, 64, 128, 256, 512], def: 24, min: 8, max: 4096, hint: 'It stays sharp at any size; this is the size it opens at' },
    print: { key: 'size', unit: 'pt', list: [24, 48, 72, 144, 288, 576], def: 144, min: 8, max: 4096, hint: '72 points is one inch' },
    anim: { key: 'size', unit: 'px', list: [64, 128, 256, 512, 1024], def: 256, min: 16, max: 1024 },
    svganim: { key: 'size', unit: 'px', list: [24, 48, 64, 128, 256, 512], def: 256, min: 8, max: 4096 },
    lottie: { key: 'size', unit: 'px', list: [128, 256, 512, 1024], def: 512, min: 16, max: 2048 },
    dp: { key: 'dp', unit: 'dp', list: [16, 20, 24, 32, 48], def: 24, min: 8, max: 512 },
    pt: { key: 'points', unit: 'pt', list: [16, 20, 24, 28, 32, 48], def: 24, min: 8, max: 512 },
    doc: { key: 'inches', unit: 'in', list: [0.5, 1, 1.5, 2, 3], def: 1.5, min: 0.25, max: 6, label: 'Size on the page' },
    code: { key: 'size', unit: 'px', list: [16, 20, 24, 32, 48], def: 24, min: 8, max: 512 }
  }
  var DL_KIND = { png: 'raster', webp: 'raster', jpg: 'raster', avif: 'raster', 'png-set': 'set', 'svg-flat': 'vector', svg: 'vector', pdf: 'print', eps: 'print', gif: 'anim', apng: 'anim',
    'webp-animated': 'anim', webm: 'anim', mp4: 'anim', 'png-sequence': 'anim', 'animated-svg': 'svganim', lottie: 'lottie', dotlottie: 'lottie', android: 'dp', ios: 'pt', docx: 'doc' }
  var DL_FRAMES = ['gif', 'apng', 'webp-animated', 'webm', 'mp4', 'png-sequence']
  var DL_SLOW = { gif: 1, apng: 1, 'webp-animated': 1, webm: 1, mp4: 1, 'png-sequence': 1, pptx: 1, 'pptx-sheet': 1, docx: 1, 'png-set': 1, 'favicon-pack': 1, ico: 1 }
  var DL_PADS = [['0', 'None'], ['0.08', 'Small'], ['0.16', 'Medium'], ['0.25', 'Large']]
  var DLKEY = 'with-download-v1'
  // when "on": where A goes, and where B starts from
  var FX = {
    fade: ['', ''], scale: ['scale(.3)', 'scale(.3)'], rotate: ['rotate(90deg) scale(.5)', 'rotate(-90deg) scale(.5)'],
    flip: ['perspective(300px) rotateY(90deg)', 'perspective(300px) rotateY(-90deg)'], 'slide-up': ['translateY(-70%)', 'translateY(70%)'],
    'slide-down': ['translateY(70%)', 'translateY(-70%)'], 'slide-left': ['translateX(-70%)', 'translateX(70%)'], 'slide-right': ['translateX(70%)', 'translateX(-70%)'],
    blur: ['scale(1.15)', 'scale(.85)'], spin: ['rotate(180deg) scale(.6)', 'rotate(-180deg) scale(.6)'], morph: ['scale(.6) rotate(-45deg)', 'scale(.6) rotate(45deg)'], draw: ['', '']
  }
  var kfText = function (p) { return p.kf.replace(/\$k/g, 'var(--wm-k,1)').replace(/\$dx/g, 'var(--wm-dx,1)').replace(/\$dy/g, 'var(--wm-dy,0)') }

  // fallback stylesheet, injected only when the real motion.css (site/vendor/motion) is not on the page
  function fallbackCss() {
    var css = '.wm{display:inline-block;transform-origin:var(--wm-ox,50%) var(--wm-oy,50%);vertical-align:middle}.wm>svg{display:block}.wm-paused,.wm-paused *{animation-play-state:paused!important}'
    var shapes = '[data-wm-pl]'
    PRESET_LIST.forEach(function (r) {
      var p = PRESETS[r[0]], a = 'wm-' + p.name + ' var(--wm-dur,' + p.dur + 's) ' + p.ease
      css += '@keyframes wm-' + p.name + '{' + kfText(p) + '}'
      if (p.name === 'draw') {
        css += '.wm-loop.wm-p-draw ' + shapes + '{stroke-dasharray:1 1.5;animation:' + a + ' infinite both}'
        css += '.wm-once.wm-p-draw ' + shapes + '{stroke-dasharray:1 1.5;animation:' + a + ' 1 both}'
        css += '.wm-hover.wm-p-draw:hover ' + shapes + ',.wm-trigger:hover .wm-hover.wm-p-draw ' + shapes + ',.wm-trigger:focus-visible .wm-hover.wm-p-draw ' + shapes + '{stroke-dasharray:1 1.5;animation:' + a + ' 1}'
        return
      }
      css += '.wm-loop.wm-p-' + p.name + '{animation:' + a + ' infinite both}.wm-once.wm-p-' + p.name + '{animation:' + a + ' 1 both}'
      css += '.wm-hover.wm-p-' + p.name + ':hover,.wm-trigger:hover .wm-hover.wm-p-' + p.name + ',.wm-trigger:focus-visible .wm-hover.wm-p-' + p.name + '{animation:' + a + ' 1}'
    })
    css += '.wm[style*="--wm-steps"]{animation-timing-function:steps(var(--wm-steps))!important}'
    var on = ['.wm-swap.is-on', '.wm-swap[aria-pressed="true"]', '.is-on>.wm-swap', '[aria-pressed="true"]>.wm-swap', '.wm-trigger:hover>.wm-swap:not(.wm-js)', '.wm-trigger:focus-visible>.wm-swap:not(.wm-js)']
    css += '.wm-swap{display:inline-grid;place-items:center;vertical-align:middle}.wm-swap>.wm-a,.wm-swap>.wm-b{grid-area:1/1;display:block;transition:opacity calc(var(--wm-swap-dur,.5s) * .55) ease var(--wm-swap-delay,0s),transform var(--wm-swap-dur,.5s) var(--wm-swap-ease,cubic-bezier(.34,1.45,.64,1)) var(--wm-swap-delay,0s),filter .3s ease var(--wm-swap-delay,0s)}.wm-swap>.wm-b{opacity:0}'
    css += on.map(function (s) { return s + '>.wm-a' }).join(',') + '{opacity:0}' + on.map(function (s) { return s + '>.wm-b' }).join(',') + '{opacity:1;transform:none;filter:none}'
    Object.keys(FX).forEach(function (k) {
      var f = FX[k], blur = k === 'blur' || k === 'morph'
      if (f[1] || blur) css += '.wm-fx-' + k + '>.wm-b{' + (f[1] ? 'transform:' + f[1] + ';' : '') + (blur ? 'filter:blur(4px);' : '') + '}'
      if (f[0] || blur) css += on.map(function (s) { return s + '.wm-fx-' + k + '>.wm-a' }).join(',') + '{' + (f[0] ? 'transform:' + f[0] + ';' : '') + (blur ? 'filter:blur(4px);' : '') + '}'
    })
    css += '@media (prefers-reduced-motion:reduce){.wm:not(.wm-force),.wm:not(.wm-force) *{animation:none!important}.wm-swap:not(.wm-force)>*{transition:none!important}}'
    return css
  }
  var motionChecked = false
  function ensureMotionCss() {
    if (motionChecked) return
    motionChecked = true
    try {
      var probe = D.createElement('span')
      probe.className = 'wm wm-loop wm-p-spin'; probe.style.cssText = 'position:absolute;left:-9999px;top:0'
      D.body.appendChild(probe)
      var nm = getComputedStyle(probe).animationName || ''
      probe.parentNode.removeChild(probe)
      if (nm.indexOf('wm-spin') >= 0) return
    } catch (e) { }
    var st = D.createElement('style'); st.id = 'wied-motion-fallback'; st.textContent = fallbackCss(); D.head.appendChild(st)
  }

  /* ───────────── small utils ───────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function $(s, r) { return (r || D).querySelector(s) }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)) }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
  function titleOf(n) { var M = { qr: 'QR', id: 'ID', cpu: 'CPU', pdf: 'PDF', rss: 'RSS', tv: 'TV', wifi: 'Wi-Fi', ai: 'AI', ui: 'UI' }; return String(n).split('-').map(function (w) { return M[w] || cap(w) }).join(' ') }
  function pascal(n) { return String(n).split('-').map(cap).join('') }
  function comp(n) { var p = pascal(n); return CLASH.indexOf(p) >= 0 ? p + 'Icon' : p }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)) }
  function round(v, d) { var m = Math.pow(10, d == null ? 3 : d); return Math.round(v * m) / m }
  function resolveVars(s) { var prev; do { prev = s; s = s.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (s !== prev); return s }
  function hexRgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }
  function lum(h) { return hexRgb(h).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }).reduce(function (a, c, i) { return a + c * [0.2126, 0.7152, 0.0722][i] }, 0) }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  function onColor(h) { return contrast(h, '#FFFFFF') >= contrast(h, INK) ? '#FFFFFF' : INK }
  function mixHex(a, b, t) { var x = hexRgb(a), y = hexRgb(b); return '#' + x.map(function (v, i) { return ('0' + Math.round(v * t + y[i] * (1 - t)).toString(16)).slice(-2) }).join('') }
  function isHex(c) { return /^#[0-9a-f]{6}$/i.test(c || '') }
  function store(key, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(key) || 'null'); localStorage.setItem(key, JSON.stringify(v)) } catch (e) { return null } }
  function toast(msg) {
    if (W.WI && W.WI.toast) { try { W.WI.toast(msg); return } catch (e) { } }
    var t = $('.wied-toast'); if (!t) { t = D.createElement('div'); t.className = 'wied-toast'; t.setAttribute('role', 'status'); D.body.appendChild(t) }
    t.textContent = msg; t.classList.add('is-on'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('is-on') }, 2600)
  }
  function copyText(text) {
    if (W.WI && W.WI.copy) { try { return Promise.resolve(W.WI.copy(text)) } catch (e) { } }
    if (navigator.clipboard && W.isSecureContext) return navigator.clipboard.writeText(text).then(function () { return true }, legacy)
    return Promise.resolve(legacy())
    function legacy() { var ta = D.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'; D.body.appendChild(ta); ta.select(); var ok = false; try { ok = D.execCommand('copy') } catch (e) { } ta.remove(); return ok }
  }
  function saveBlob(blob, name) { var u = URL.createObjectURL(blob), a = D.createElement('a'); a.href = u; a.download = name; D.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u) }, 4000) }
  var pngCache = {}
  function toPng(svgText, px) {
    var key = px + '|' + svgText
    if (pngCache[key]) return pngCache[key]
    var pr = new Promise(function (res, rej) {
      var img = new Image()
      img.onload = function () {
        var c = D.createElement('canvas'); c.width = c.height = px
        c.getContext('2d').drawImage(img, 0, 0, px, px)
        c.toBlob(function (b) { if (!b) return rej(new Error('png')); var o = { blob: b, dataUrl: null }; try { o.dataUrl = c.toDataURL('image/png') } catch (e) { } res(o) }, 'image/png')
      }
      img.onerror = rej
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
    })
    pr.then(function (v) { pr.value = v }, function () { delete pngCache[key] })
    return (pngCache[key] = pr)
  }
  var scriptBase = (function () { var s = D.currentScript && D.currentScript.src; return s && /js\/editor\.js(\?.*)?$/.test(s) ? s.replace(/js\/editor\.js(\?.*)?$/, '') : '' })()
  function siteUrl(p) { return (W.WI && W.WI.base) ? W.WI.base + p : scriptBase + p }
  var loading = {}
  function loadScript(src) {
    if (loading[src]) return loading[src]
    return (loading[src] = new Promise(function (ok) { var s = D.createElement('script'); s.src = src; s.async = true; s.onload = function () { ok(true) }; s.onerror = function () { ok(false) }; D.head.appendChild(s) }))
  }
  /* our own pickers (css/ui-kit.css + js/ui-kit.js, window.WIKit) replace the browser's colour dialog, sliders and number
     spinners. They load with the studio (never before it), from wherever this script was loaded; a page that already
     carries the kit (the library) just reuses it. */
  var kitP = null
  function loadKit() {
    if (W.WIKit) return Promise.resolve(W.WIKit)
    if (kitP) return kitP
    var css = new Promise(function (ok) {
      if (D.querySelector('link[href$="ui-kit.css"]')) { ok(); return }
      var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = siteUrl('css/ui-kit.css'); l.onload = l.onerror = function () { ok() }; D.head.appendChild(l)
    })
    return (kitP = Promise.all([css, loadScript(siteUrl('js/ui-kit.js'))]).then(function () { return W.WIKit || null }))
  }
  function svgStore(style) { var s = W.WITH_SVG || W.EGI_SVG; return s && s[style] }
  function loadStyleData(style) {
    if (svgStore(style)) return Promise.resolve(true)
    return loadScript(siteUrl('data/style-' + style + '.js')).then(function () { return !!svgStore(style) })
  }
  // One icon in every style, cheaply: its own page (site/icons/<name>.html, ~110 KB) carries every style as a
  // <symbol>, while a style's data file holds all 500 icons (up to 1.5 MB). Used for "Turn into" targets. Needs http(s):
  // from file:// the fetch fails and callers fall back to the style data files.
  var XS = {}, xsLoading = {}
  function fetchIconPage(name) {
    if (XS[name]) return Promise.resolve(true)
    if (xsLoading[name]) return xsLoading[name]
    if (!W.fetch || !W.DOMParser || /^file:/.test(location.protocol) || !/^[a-z0-9-]+$/.test(name)) return Promise.resolve(false)
    return (xsLoading[name] = W.fetch(siteUrl('icons/' + name + '.html')).then(function (r) { return r.ok ? r.text() : '' }).then(function (html) {
      if (!html) return false
      var doc = new W.DOMParser().parseFromString(html, 'text/html'), got = {}, n = 0
      $$('symbol[id^="s-"]', doc).forEach(function (sym) { got[sym.id.slice(2)] = sym.innerHTML; n++ })
      if (n) XS[name] = got
      return n > 0
    }, function () { return false }))
  }
  /* the export formats (js/export/*.js -> window.WithExport) load on first use of a Download panel, in order: the registry,
     then vector.js (the others reuse its helpers), then every format module. Dynamic scripts with async = false run in the
     order they were added. A failed load can be retried. */
  var EXPORTS = ['registry', 'vector', 'raster', 'app', 'code', 'office', 'animated', 'lottie'], exportP = null
  function exportReady() { var X = W.WithExport; return !!(X && X.get && X.get('png') && X.get('svg-flat') && X.get('pptx') && X.get('gif') && X.get('lottie') && X.get('jsx') && X.get('ico')) }
  function loadExports() {
    if (exportReady()) return Promise.resolve(true)
    if (exportP) return exportP
    // the motion table for all icons (~180 KB) is not on icon pages up front (the page carries its own icon's motion):
    // formats that look an icon's spec up by name find it here
    if (!W.WITH_MOTION) loadScript(siteUrl('data/motion.js'))
    exportP = new Promise(function (resolve) {
      var left = EXPORTS.length
      var one = function () { if (--left > 0) return; var ok = exportReady(); if (!ok) exportP = null; resolve(ok) }
      EXPORTS.forEach(function (n) {
        var s = D.createElement('script'); s.src = siteUrl('js/export/' + n + '.js'); s.async = false
        s.onload = one; s.onerror = one
        D.head.appendChild(s)
      })
    })
    return exportP
  }
  function browserName() {
    var u = (W.navigator && navigator.userAgent) || ''
    return /Firefox\//.test(u) ? 'Firefox' : /Edg\//.test(u) ? 'Edge' : /(Chrome|CriOS)\//.test(u) ? 'Chrome' : /Safari\//.test(u) ? 'Safari' : 'This browser'
  }
  function loadMeta() {
    if (W.WITH && W.WITH.icons) return Promise.resolve(true)
    if (W.WI && W.WI.loadMeta) return W.WI.loadMeta()
    return loadScript(siteUrl('data/meta.js'))
  }

  /* ───────────── motion helpers (shared) ───────────── */
  // motion entry {preset, origin, dir, amount, duration, steps} -> wrapper class + inline CSS vars
  // the real runtime (site/vendor/motion/motion.js -> window.WithMotion) owns the defaults when it is on the page
  function WM() { return W.WithMotion || null }
  function baseDur(preset, trigger) {
    var m = WM(), d = m && m.PRESET_DEFAULTS && m.PRESET_DEFAULTS[preset]
    if (d) return trigger === 'loop' ? (d.cycle || d.shot) : (d.shot || d.cycle)
    return PRESETS[preset].dur
  }
  function motionAttrs(entry, o) {
    o = o || {}
    if (!entry || !entry.preset || !PRESETS[entry.preset]) return null
    var preset = entry.preset
    if (preset === 'draw' && o.stroked === false) preset = 'pop'
    var v = {}, trig = o.trigger || 'loop'
    if (entry.origin) { v['--wm-ox'] = round(entry.origin[0] / 24 * 100, 2) + '%'; v['--wm-oy'] = round(entry.origin[1] / 24 * 100, 2) + '%' }
    if (entry.dir != null) { var r = entry.dir * Math.PI / 180; v['--wm-dx'] = round(Math.cos(r)); v['--wm-dy'] = round(Math.sin(r)) }
    var k = clamp((entry.amount || 1) * (o.amount || 1), 0.25, 2)
    if (Math.abs(k - 1) > 0.001) v['--wm-k'] = round(k, 2)
    var base = entry.duration || baseDur(preset, trig), speed = o.speed || 1
    var dur = clamp(base / speed, 0.15, 12)
    if (entry.duration || Math.abs(speed - 1) > 0.001) v['--wm-dur'] = round(dur, 2) + 's'
    var steps = entry.steps || 0
    if (steps) v['--wm-steps'] = steps
    var cls = 'wm wm-' + trig + ' wm-p-' + preset + (preset === 'draw' ? ' wm-drawing' : '')
    // parts choreography (forge/MOTION.md): decorations kept still
    if (o.deco === 'still' && preset !== 'draw') v['--wm-deco'] = 'none'
    var out = { preset: preset, trigger: trig, cls: cls, vars: v, dur: dur, k: k, steps: steps, origin: entry.origin || null, dir: entry.dir, deco: o.deco === 'still' ? 'still' : '' }
    // an icon whose drawing has tagged parts, playing its OWN motion: no preset class (it would make every plate play
    // the main preset), the spec's slot + parts variables instead, so a plate keeps its own move (a bell's clapper rings
    // a beat behind) and the decorations their own loop. Code uses data-wm + icons.css for the same thing (out.own).
    // o.spec: the icon's motion spec (o.parts: false when the drawing has no part tags, which keeps the classic form)
    var m = WM()
    if (o.spec && o.parts !== false && preset !== 'draw' && m && m.specVars) {
      var slot = trig === 'loop' ? '--wmL' : '--wmH', own = trig === 'loop' ? o.spec.loop : o.spec.hover
      if (own && own.preset === preset) {
        var sv = {}
        try { var all = m.specVars(o.spec); for (var x in all) if (x.indexOf(slot) === 0) sv[x] = all[x] } catch (e) { sv = null }
        if (sv) {
          var keep = {}
          if (v['--wm-dur'] && Math.abs(speed - 1) > 0.001) keep['--wm-dur'] = v['--wm-dur']
          if (Math.abs((o.amount || 1) - 1) > 0.001) keep['--wm-k'] = v['--wm-k'] || '1'
          if (v['--wm-deco']) keep['--wm-deco'] = v['--wm-deco']
          out.own = true; out.ownVars = keep
          out.cls = 'wm wm-' + trig
          out.vars = Object.assign(sv, keep)
        }
      }
    }
    out.style = Object.keys(out.vars).map(function (x) { return x + ':' + out.vars[x] }).join(';')
    return out
  }
  // the part tags a drawing carries (forge/MOTION.md "Parts choreography"): { a, s, deco, shadow, any }
  function partTags(inner) {
    var s = String(inner || ''), has = function (t) { return new RegExp('\\sclass="[^"]*\\bwm-' + t + '\\b').test(s) }
    var o = { a: has('a'), s: has('s'), deco: has('deco'), shadow: has('shadow') }
    o.any = o.a || o.s || o.deco || o.shadow
    return o
  }
  // the decoration loop the engine picks for a preset when the spec names none (packages/motion/src/meta.js DECO_DEFAULT)
  var DECO_DEFAULT = { spin: 'breathe', 'spin-once': 'breathe', tick: 'breathe', orbit: 'breathe', flip: 'breathe', nudge: 'breathe', pass: 'breathe', draw: 'breathe', fill: 'breathe', blink: 'breathe', glow: 'breathe', flicker: 'breathe', twinkle: 'breathe', zoom: 'breathe',
    ring: 'float', wiggle: 'float', shake: 'float', nod: 'float', type: 'float', tilt: 'float', sway: 'float', rock: 'float', breathe: 'float',
    bounce: 'twinkle', float: 'twinkle', rise: 'twinkle', drop: 'twinkle', jelly: 'twinkle', beat: 'twinkle', pulse: 'twinkle', pop: 'twinkle', tada: 'twinkle' }
  var GROUND = ['bounce', 'float', 'rise', 'drop', 'jelly']
  function decoKind(preset, specDeco) {
    var m = WM(), d = m && m.DECO_DEFAULT
    if (['breathe', 'float', 'twinkle', 'still'].indexOf(specDeco) >= 0) return specDeco
    return (d && d[preset]) || DECO_DEFAULT[preset] || 'breathe'
  }
  // the draw preset: every stroked shape gets pathLength="1" (same rule as WithMotion.prepareDraw)
  function prepareDraw(rootEl) {
    if (!rootEl) return
    var m = WM()
    $$('.wm-drawing', rootEl).forEach(function (w) {
      if (m && m.prepareDraw) { try { m.prepareDraw(w); return } catch (e) { } }
      $$('svg', w).forEach(function (svg) {
        $$('path,line,polyline,polygon,circle,ellipse,rect', svg).forEach(function (sh) {
          if (sh.hasAttribute('data-wm-pl') || sh.hasAttribute('data-wm-fill')) return
          var stroke = null
          for (var n = sh; n && n !== svg.parentNode; n = n.parentNode) { if (n.getAttribute && stroke == null && n.getAttribute('stroke') != null) stroke = n.getAttribute('stroke') }
          if (!stroke || stroke === 'none' || sh.hasAttribute('pathLength')) { sh.setAttribute('data-wm-fill', ''); return }
          sh.setAttribute('pathLength', '1'); sh.setAttribute('data-wm-pl', '')
        })
      })
    })
  }

  // pause endless animations while their container is scrolled out of view (phones: battery and repaints);
  // .wied-off (editor.css) sets animation-play-state: paused on everything inside
  function watchOffscreen(el) {
    if (!el || !W.IntersectionObserver) return null
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('wied-off', !e.isIntersecting) }) }, { rootMargin: '160px 0px' })
    io.observe(el)
    return io
  }

  var seq = 0

  /* ═════════════════════════════ the editor ═════════════════════════════ */
  function mount(host, opts) {
    if (typeof host === 'string') host = $(host)
    if (!host) return null
    opts = opts || {}
    ensureMotionCss()
    var uid = 'wied' + (++seq)
    var KEY = opts.storageKey || 'with-editor-v1'
    var remember = opts.remember !== false
    var subs = []
    var I = { name: '', title: '', data: null, motion: null }   // the current icon
    var S = { style: 'line', color: 'ink', size: 24, px: 256, stroke: null, bg: 'light', anim: 'loop', preset: '', speed: 1, amount: 1, deco: '', code: 'tag', tab: 'look', flat: false }
    var saved = remember ? (store(KEY) || {}) : {}
    if (remember && !store(KEY)) { var old = store('with-ip'); if (old) saved = { px: old.px, color: old.color, style: old.style } }
    ;['color', 'size', 'px', 'bg', 'anim', 'speed', 'amount', 'deco', 'code', 'style', 'flat'].forEach(function (k) { if (saved[k] != null) S[k] = saved[k] })
    if (PX.indexOf(S.px) < 0) S.px = 256
    if (['none', 'loop', 'hover', 'once'].indexOf(S.anim) < 0) S.anim = 'loop'
    if (S.deco !== 'still') S.deco = ''
    if (opts.anim) S.anim = opts.anim

    /* "Turn into": the one source of truth for the swap. Every live copy (preview, placements, the library stage, effect
       chips), the code and every download is drawn from SW; on/off is applied to the live copies as a class (syncSwaps), so
       switching never rebuilds the markup and a transition reverses smoothly when someone switches mid-way.
         to       target icon name ('' = none)          toStyle  '' = same style as the first icon (Before)
         link     After wears the same colours as Before; otherwise BCS[to] (its own colour, palette and tweaks)
         effect   '' = fade                             speed    'snappy' | 'smooth' | 'slow' ('' = a custom duration)
         dur      seconds for one transition, null = effect default x speed     ease  EASES key
         delay    seconds before switching (auto: before the first switch)      hold  auto: seconds resting on each icon
         trigger  'click' | 'hover' | 'auto' | 'focus'  on  B is showing (click / auto, or Switch)   paused  auto stopped
       Before (A) is the icon itself: its style is S.style and its colours are the Look tab's (S.color + the palette state). */
    var SW_DEF = { to: '', toStyle: '', link: true, effect: '', speed: 'smooth', dur: null, ease: 'natural', delay: 0, hold: SW_HOLD, trigger: 'click' }
    var SW = {}, SWKEY = 'with-swap-v1', BCS = {}
    function swReset(keepTarget) {
      var t = { to: SW.to, toStyle: SW.toStyle, effect: SW.effect }
      for (var k in SW_DEF) SW[k] = SW_DEF[k]
      if (keepTarget) { SW.to = t.to; SW.toStyle = t.toStyle; SW.effect = t.effect }
      SW.on = false; SW.paused = false; SW.go = false
    }
    swReset()
    ;(function () {
      var sv = remember ? store(SWKEY) : null
      if (!sv) return
      if (TRIGGERS.some(function (t) { return t[0] === sv.trigger })) SW.trigger = sv.trigger
      if (SPEEDS.some(function (t) { return t[0] === sv.speed })) SW.speed = sv.speed
      if (EASES.some(function (t) { return t[0] === sv.ease })) SW.ease = sv.ease
      if (typeof sv.hold === 'number') SW.hold = clamp(sv.hold, SW_HOLDR[0], SW_HOLDR[1])
    })()
    function swSave() { if (remember) store(SWKEY, { trigger: SW.trigger, speed: SW.speed || 'smooth', ease: SW.ease, hold: SW.hold }) }

    function setIcon(name, o) {
      o = o || {}
      I.name = name
      I.data = o.data || (name === opts.name ? opts.data : null) || null
      I.title = o.title || (I.data && I.data.title) || (W.WI && W.WI.icon && W.WI.icon(name) && W.WI.icon(name).title) || titleOf(name)
      I.motion = o.motion || (I.data && I.data.motion) || (W.WITH_MOTION && W.WITH_MOTION[name]) || null
      S.preset = ''; SW.to = ''; SW.toStyle = ''; SW.effect = ''; SW.link = true; SW.on = false; SW.paused = false; SW.go = false; SW.form = 'a'
      stopAuto()
      var list = styleList()
      if (o.style && list.indexOf(o.style) >= 0) S.style = o.style
      if (list.length && list.indexOf(S.style) < 0) S.style = list[0]
      built = false
      ensureStyle(S.style).then(function () { build(); render() })
    }

    /* ───────── style data ───────── */
    function metaStyles() { return (W.WITH && W.WITH.styles) || [] }
    function styleList() {
      if (I.data && I.data.styles) return Object.keys(I.data.styles)
      var names = metaStyles().map(function (s) { return s.name })
      if (!names.length) names = ORDER.slice()
      return names.sort(function (a, b) { return rank(a) - rank(b) })
    }
    function rank(n) { var i = ORDER.indexOf(n); return i < 0 ? 99 : i }
    function info(s) {
      var d = I.data && I.data.styles && I.data.styles[s]
      var m = null; metaStyles().forEach(function (x) { if (x.name === s) m = x })
      var wi = W.WI && W.WI.styleInfo && W.WI.styleInfo[s]
      var root = (d && d.root) || (m && m.root) || (s === 'solid' || s === 'gloss' ? { fill: 'currentColor' } : { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
      var sw = d ? d.sw : (m ? m.strokeWidth : false)
      return { name: s, title: (d && d.title) || (m && m.title) || (wi && wi.title) || cap(s), hex: (d && d.hex) || (wi && wi.color) || HEX[s] || '#2F5BFF', say: (d && d.say) || (wi && wi.plain) || (m && m.description) || '', root: root, sw: typeof sw === 'number' ? sw : false, stroked: !!root.stroke && root.stroke !== 'none' }
    }
    function innerOf(name, style) {
      if (name === I.name && I.data && I.data.styles && I.data.styles[style]) return I.data.styles[style].inner
      var m = svgStore(style); if (m && m[name] != null) return m[name]
      if (XS[name] && XS[name][style] != null) return XS[name][style]
      if (style === 'line' && I.data && I.data.thumbs && I.data.thumbs[name] != null) return I.data.thumbs[name]
      return null
    }
    // tried[style]: 1 while its data file loads, 2 once it has (only then may a missing drawing fall back to line)
    var tried = {}
    function ensureStyle(style) { return innerOf(I.name, style) != null ? Promise.resolve(true) : loadStyleData(style) }
    function thumbInner(name) {
      if (I.data && I.data.thumbs && I.data.thumbs[name]) return I.data.thumbs[name]
      return innerOf(name, 'line')
    }

    /* ───────── colour ───────── */
    // the single colour of a one-colour style: 'ink' (black, or near-white on the dark preview), 'style' or a hex.
    // colorHex(style, value) also serves After's own colour (its value comes from BCS)
    function colorHex(style, c) {
      c = c === undefined ? S.color : c
      if (c === 'ink') return INK
      if (c === 'style') return info(style || S.style).hex
      return isHex(c) ? c : INK
    }
    function previewColor(c) {
      c = c === undefined ? S.color : c
      if (c === 'ink') return S.bg === 'dark' ? INK_D : INK
      return colorHex(undefined, c)
    }

    /* ───────── every colour (multi-colour styles) + per-icon palettes (forge/PALETTES.md) ─────────
       A palette sets roles (ink c1..c4 tint accent shadow shine edge); js/palette-map.js (generated from
       forge/lib/palette-map.mjs) maps them onto the CSS variables each rendered icon actually uses.
       A colour state: { name, color (one-colour styles), pal, palName, roles: {role: hex}, tw: { <style>: { 'ink' | '--with-x': hex } } }.
       roles carry across styles and icons (pick a palette in Retro, switch to Sticker: same palette; After "same colours as
       before" wears Before's roles); tw are tweaks of one icon in one style.
       Two subjects edit colours: 'a' = the icon itself (CS, remembered; its one colour is S.color) and 'b' = the "Turn into"
       target with colours of its own (BCS, per target, for this visit). */
    var CS = {}, rmCache = {}, CKEY = 'with-colors-v1', rememberColors = opts.rememberColors !== false
    function PL() { return W.WithPalette || null }
    function cstate() {
      if (!CS[I.name]) {
        var sv = rememberColors ? store(CKEY) : null, e = sv && sv.icons && sv.icons[I.name]
        CS[I.name] = e ? { name: I.name, pal: e.pal || '', palName: e.palName || '', roles: e.roles || {}, tw: e.tw || {} } : { name: I.name, pal: '', palName: '', roles: {}, tw: {} }
      }
      return CS[I.name]
    }
    function bstate(name) {
      name = name || SW.to
      return BCS[name] || (BCS[name] = { name: name, color: 'ink', pal: '', palName: '', roles: {}, tw: {} })
    }
    // the subject a colour control edits: 'a' (Before / the icon) or 'b' (After, when it has colours of its own)
    function subj(k) {
      if (k === 'b') {
        var t = swapTarget(); if (!t) return null
        return { k: 'b', name: t.name, style: t.style, title: t.title, st: bstate(t.name), mono: function () { return bstate(t.name).color } }
      }
      return { k: 'a', name: I.name, style: S.style, title: I.title, st: cstate(), mono: function () { return S.color } }
    }
    function hasCustom(c) { if (!c) return false; if (c.pal || Object.keys(c.roles).length) return true; for (var s in c.tw) if (Object.keys(c.tw[s]).length) return true; return false }
    function saveC() {
      if (!rememberColors) return
      var sv = store(CKEY) || {}, c = cstate()
      sv.icons = sv.icons || {}
      if (hasCustom(c)) sv.icons[I.name] = { pal: c.pal, palName: c.palName, roles: c.roles, tw: c.tw, n: (sv.seq = (sv.seq || 0) + 1) }
      else delete sv.icons[I.name]
      var names = Object.keys(sv.icons).sort(function (a, b) { return sv.icons[b].n - sv.icons[a].n })
      names.slice(40).forEach(function (n) { delete sv.icons[n] })
      store(CKEY, sv)
    }
    // the variables an icon uses in a style: { roles: {var: role}, order: [var], defs: {var: default} }
    function rmap(name, style) {
      var inner = innerOf(name, style); if (inner == null || !PL()) return null
      var k = name + '|' + style + '|' + inner.length
      if (rmCache[k]) return rmCache[k]
      var roles = PL().rolesFor(inner), defs = {}
      String(inner).replace(/var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g, function (a, v, d) { if (!(v in defs)) defs[v] = d; return a })
      return (rmCache[k] = { roles: roles, order: Object.keys(roles), defs: defs })
    }
    function isMulti(style, name) { var inner = innerOf(name || I.name, style || S.style); return inner != null && /var\(\s*--with-/.test(inner) }
    var CLABEL = {
      duo: { ink: 'Lines', '--with-duo': 'Tint' },
      blueprint: { ink: 'Lines', '--with-accent': 'Accent lines' },
      glass: { ink: 'Rim', '--with-glass-back': 'Back glass', '--with-glass-pane': 'Front pane', '--with-glass-etch': 'Etching', '--with-glass-frost': 'Frost', '--with-glass-shine': 'Shine', '--with-glass-accent': 'Accent' },
      kawaii: { ink: 'Outline', slot: ['Body', 'Second colour', 'Third colour', 'Fourth colour', 'Fifth colour', 'Sixth colour'], '--with-kawaii-face': 'Face', '--with-kawaii-blush': 'Blush', '--with-kawaii-sparkle': 'Sparkle', '--with-kawaii-accent': 'Accent', '--with-kawaii-shine': 'Shine' },
      sticker: { ink: 'Outline', merge: ['--with-sticker-ink'], slot: ['Main colour', 'Second colour', 'Third colour', 'Fourth colour', 'Fifth colour', 'Sixth colour'], '--with-sticker-edge': 'Border', '--with-sticker-shadow': 'Shadow', '--with-sticker-shine': 'Shine' },
      pixel: { ink: 'Outline', '--with-pixel-fill': 'Fill', '--with-pixel-shine': 'Highlight' },
      retro: { ink: 'Outline', slot: ['Stripe 1', 'Stripe 2', 'Stripe 3', 'Stripe 4', 'Stripe 5', 'Stripe 6'], '--with-retro-shadow': 'Shadow' },
      // the studio styles use role-named variables (--with-<style>-<role>): label the ROLE, so any variable a
      // renderer adds later is named too
      luxe: { ink: 'Outline', role: { c1: 'Main', c2: 'Jewel', c3: 'Depth', c4: 'Gold shade', accent: 'Gold trim', tint: 'Gold light', edge: 'Rim light', shadow: 'Shadow', shine: 'Highlight' } },
      // Bauhaus colours are named after what they are by default (Red, Yellow, Blue, Black, Paper), whichever role holds them
      // (the overlaps where two inks overprint are named after their colour too: "Orange overlap")
      bauhaus: { ink: 'Black', role: function (role, def) { var h = hueName(def); if (h && (role === 'c4' || role === 'accent')) return h + ' overlap'; return h || ({ c1: 'Main colour', c2: 'Second colour', c3: 'Third colour', c4: 'Overlap', accent: 'Overlap', tint: 'Paper', edge: 'Border', shadow: 'Shadow', shine: 'Shine' })[role] } },
      skeuo: { ink: 'Outline', role: { c1: 'Main material', c2: 'Second material', c3: 'Third material', c4: 'Fourth material', tint: 'Glass', edge: 'Rim', accent: 'Stitching', shadow: 'Shadow', shine: 'Gloss' } },
      // the storybook styles (role-named too), labelled after what each role paints in that style
      anime: { ink: 'Line art', role: { c1: 'Main colour', c2: 'Second colour', c3: 'Gold', c4: 'Green', tint: 'Cream', accent: 'Coral', shadow: 'Cel shadow', shine: 'Shine', edge: 'Rim light' } },
      gothic: { ink: 'Lead and iron', role: { c1: 'Ruby glass', c2: 'Sapphire glass', c3: 'Gold glass', c4: 'Emerald glass', tint: 'Stone', accent: 'Gilding', shadow: 'Shadow', shine: 'Candlelight', edge: 'Stone shade' } },
      pastel: { ink: 'Outline', role: { c1: 'Main pastel', c2: 'Second pastel', c3: 'Third pastel', c4: 'Fourth pastel', accent: 'Fifth pastel', tint: 'Paper', shadow: 'Shadow', shine: 'Highlight', edge: 'Rim' } },
      coquette: { ink: 'Outline', role: { c1: 'Blush', c2: 'Rose', c3: 'Ribbon', c4: 'Cream and pearls', tint: 'Satin light', accent: 'Gold', shadow: 'Shadow', shine: 'Sheen', edge: 'Lace' } },
      plush: { ink: 'Piping', role: { c1: 'Main felt', c2: 'Second felt', c3: 'Third felt', c4: 'Fourth felt', accent: 'Patches', tint: 'Cream felt', shadow: 'Fabric shade', shine: 'Fleece highlight', edge: 'Stitching' } }
    }
    // plain colour name of a default (#hex) for the Bauhaus labels
    function hueName(hex) {
      var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return ''
      var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1]
      var r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn
      if (l > 0.86) return 'Paper'
      if (d < 0.12) return l < 0.25 ? 'Black' : 'Grey'
      var hu = (mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60
      return hu < 18 || hu >= 330 ? 'Red' : hu < 42 ? 'Orange' : hu < 70 ? 'Yellow' : hu < 165 ? 'Green' : hu < 255 ? 'Blue' : 'Violet'
    }
    // variables painted together with the outline: a style's own list, plus the role-named ink of the studio styles
    // (--with-luxe-ink …), so "Outline" is one row
    function mergeOf(style, m) {
      var L = CLABEL[style] || {}, out = (L.merge || []).slice()
      if (L.role && m) m.order.forEach(function (v) { if (m.roles[v] === 'ink' && out.indexOf(v) < 0) out.push(v) })
      return out
    }
    var RRANK = { c1: 1, c2: 2, c3: 3, c4: 4, edge: 5, tint: 6, ink: 7, accent: 8, shadow: 9, shine: 10 }
    function rowsFor(style, name) {
      var m = rmap(name || I.name, style); if (!m) return []
      var L = CLABEL[style] || {}, merge = mergeOf(style, m), slot = 0
      var rest = []
      m.order.forEach(function (v, i) {
        if (merge.indexOf(v) >= 0) return
        var role = m.roles[v], lab = L[v]
        if (!lab && L.slot && /^c\d$/.test(role)) lab = L.slot[slot++]
        if (!lab && L.role) lab = typeof L.role === 'function' ? L.role(role, m.defs[v]) : L.role[role]
        rest.push({ key: v, label: lab || (PL().ROLE_LABELS[role]) || v, role: role, i: i })
      })
      rest.sort(function (a, b) { return ((RRANK[a.role] || 20) - (RRANK[b.role] || 20)) || a.i - b.i })
      // two rows with one name (two reds in a Bauhaus icon): number them
      var seenL = {}; rest.forEach(function (r) { var n = (seenL[r.label] = (seenL[r.label] || 0) + 1); if (n > 1) r.label += ' ' + n })
      return [{ key: 'ink', label: L.ink || 'Outline', role: 'ink', merge: merge.filter(function (v) { return v in m.roles }) }].concat(rest)
    }
    // the colours to paint: { vars: {var: hex}, ink: hex|null } or null when nothing is customised.
    // c = a colour state (default: the icon's); its tweaks apply only to its own icon
    function colorsFor(style, name, c) {
      name = name || I.name; style = style || S.style; c = c || cstate()
      if (!hasCustom(c) || !PL()) return null
      var m = rmap(name, style); if (!m || !m.order.length) return null
      var tw = (c.name || I.name) === name ? (c.tw[style] || {}) : {}
      var base = PL().applyPalette(innerOf(name, style), c.roles).vars, merge = mergeOf(style, m)
      var vars = {}, ink = tw.ink || c.roles.ink || null, n = 0
      m.order.forEach(function (v) { var x = tw[v] || (merge.indexOf(v) >= 0 && tw.ink) || base[v]; if (x) { vars[v] = x; n++ } })
      return n || ink ? { vars: vars, ink: ink } : null
    }
    // palette -> colours for a mini render (no tweaks)
    function colorsOfPalette(p, style, name) {
      var inner = innerOf(name || I.name, style || S.style); if (inner == null || !PL()) return null
      var r = PL().applyPalette(inner, p.colors || p)
      return { vars: r.vars, ink: r.color }
    }
    // var(--with-x, d) -> chosen hex; currentColor -> ink (the rest is flattened by the caller)
    function bakeColors(markup, cz) {
      if (!cz) return markup
      var s = String(markup).replace(/var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g, function (all, v) { return cz.vars[v] || all })
      return cz.ink ? s.replace(/currentColor/g, cz.ink) : s
    }
    function cssOf(cz, inkFallback, pretty) {
      var sep = pretty ? ': ' : ':', parts = [], ink = (cz && cz.ink) || inkFallback
      if (ink) parts.push('color' + sep + ink)
      if (cz) Object.keys(cz.vars).forEach(function (v) { parts.push(v + sep + cz.vars[v]) })
      return parts.join(pretty ? '; ' : ';')
    }
    function colorKey() { var c = CS[I.name]; return hasCustom(c) ? JSON.stringify([c.pal, c.roles, c.tw[S.style] || 0]) : '' }
    function inkAuto(row, sb) {
      sb = sb || subj('a')
      var m = rmap(sb.name, sb.style), d = row && row.merge && row.merge.length && m && m.defs[row.merge[0]]
      return isHex(d) ? d.toUpperCase() : colorHex(sb.style, sb.mono())
    }
    function rowValue(row, cz, sb) {
      sb = sb || subj('a')
      if (row.key === 'ink') return ((cz && cz.ink) || inkAuto(row, sb)).toUpperCase()
      var v = cz && cz.vars[row.key]; if (v) return v.toUpperCase()
      var m = rmap(sb.name, sb.style), d = m && m.defs[row.key]
      if (/^#[0-9a-f]{3}$/i.test(d || '')) d = '#' + d.slice(1).replace(/./g, '$&$&')
      return isHex(d) ? d.toUpperCase() : ((cz && cz.ink) || inkAuto(null, sb)).toUpperCase()
    }
    function mainColor() {
      var cz = colorsFor(); if (!cz) return null
      var rows = rowsFor(S.style); for (var i = 0; i < rows.length; i++) if (rows[i].role === 'c1') return rowValue(rows[i], cz)
      return null
    }
    function colorsInfo() {
      var cz = colorsFor(), c = cstate(), tw = c.tw[S.style] || {}
      return { multi: isMulti(), custom: !!cz, pal: c.pal, palName: c.palName, edited: !!Object.keys(tw).length, vars: cz ? cz.vars : {}, ink: cz ? cz.ink : null, main: cz ? mainColor() : null, css: cz ? cssOf(cz, null, true) : '' }
    }
    var palLoading = {}
    function ensurePL() { return PL() ? Promise.resolve(true) : loadScript(siteUrl('js/palette-map.js')).then(function () { rmCache = {}; return !!PL() }) }
    function palettesOf(name) { var a = W.WITH_PALETTES && W.WITH_PALETTES[name]; return Array.isArray(a) ? a : null }
    function loadPalettes(name) {
      if (palettesOf(name)) return Promise.resolve(palettesOf(name))
      return palLoading[name] || (palLoading[name] = loadScript(siteUrl('data/palettes/' + name + '.js')).then(function () { return palettesOf(name) }))
    }
    var colorRaf = 0
    function colorsChanged(live, sb) {
      if (!sb || sb.k === 'a') saveC()
      presetKey = ''
      if (!live) { cancelAnimationFrame(colorRaf); colorRaf = 0; render(); return }
      if (colorRaf) return
      colorRaf = requestAnimationFrame(function () { colorRaf = 0; render() })
    }
    function setTweak(key, hex, live, sb) { sb = sb || subj('a'); var c = sb.st; (c.tw[sb.style] = c.tw[sb.style] || {})[key] = hex.toUpperCase(); colorsChanged(live, sb) }
    function clearTweak(key, sb) { sb = sb || subj('a'); var c = sb.st, t = c.tw[sb.style]; if (t) { delete t[key]; if (!Object.keys(t).length) delete c.tw[sb.style] } colorsChanged(false, sb) }
    function say(msg) { var l = $('[data-live]', root); if (l) l.textContent = msg }
    function choosePalette(p, sb) {
      sb = sb || subj('a')
      var c = sb.st, roles = {}
      for (var r in p.colors) if (isHex(p.colors[r])) roles[r] = p.colors[r].toUpperCase()
      c.pal = p.id; c.palName = p.name; c.roles = roles; c.tw = {}
      colorsChanged(false, sb)
      say('Palette ' + p.name + ' applied to every colour' + (sb.k === 'b' ? ' of ' + sb.title : '') + '.')
    }
    function resetColors(sb) {
      sb = sb && sb.k ? sb : subj('a')
      if (sb.k === 'b') { var keep = sb.st.color; BCS[sb.name] = { name: sb.name, color: keep, pal: '', palName: '', roles: {}, tw: {} } }
      else CS[I.name] = { name: I.name, pal: '', palName: '', roles: {}, tw: {} }
      colorsChanged(false, sb)
      say('Colours reset to the defaults.')
    }
    function normHex(v) {
      v = String(v || '').trim().replace(/^#?/, '#')
      if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v.slice(1).replace(/./g, '$&$&')
      return isHex(v) ? v.toUpperCase() : null
    }

    /* the Colours panel: every colour of an icon in a style + its palette gallery. Mountable anywhere (the library drawer
       puts one in its own Look tab; "Turn into" mounts one per form); every panel follows the same state.
       k = 'a' (the icon, default) or 'b' (the "Turn into" target's own colours). */
    var panels = []
    var RESET_I = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4.5 12 A7.5 7.5 0 1 0 7 6.4"/><path d="M4 3.5 V7.5 H8"/></svg>'
    var DICE_I = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" stroke-width="3"/></svg>'
    var TAG_LABEL = { 'true-to-life': 'True to life', 'on-dark': 'For dark pages', y2k: 'Y2K' }
    function colorPanel(el, k) {
      var P = { el: el, k: k === 'b' ? 'b' : 'a', key: '', gkey: '', filter: '', more: false, id: uid + '-cp' + panels.length }
      el.classList.add('wied-cpanel')
      kitWatch(el)
      function sb() { return subj(P.k) }
      function shell(rows) {
        return '<div class="wcp-head"><p class="wied-l" id="' + P.id + '-l">Colours <small>every part, in every download</small></p>' +
            '<button type="button" class="wcp-resetall" data-cp-resetall>' + RESET_I + '<span>Reset all</span></button></div>' +
          '<div class="wcp-rows" role="list" aria-labelledby="' + P.id + '-l">' + rows.map(function (r) {
            var id = P.id + '-' + r.key.replace(/[^\w-]/g, '')
            return '<div class="wcp-row" role="listitem" data-cp-row="' + esc(r.key) + '" title="' + esc(r.key === 'ink' ? 'currentColor (color)' + (r.merge.length ? ' + ' + r.merge.join(', ') : '') : r.key) + '">' +
              '<label class="wcp-sw"><input type="color" data-cp-pick="' + esc(r.key) + '" aria-label="' + esc(r.label) + ' colour"><span aria-hidden="true"></span></label>' +
              '<label class="wcp-name" for="' + id + '">' + esc(r.label) + '</label>' +
              '<input class="wcp-hex" id="' + id + '" data-cp-hex="' + esc(r.key) + '" type="text" inputmode="text" maxlength="7" spellcheck="false" autocomplete="off" aria-label="' + esc(r.label) + ' hex code">' +
              '<button type="button" class="wcp-reset" data-cp-reset="' + esc(r.key) + '" aria-label="Reset ' + esc(r.label) + '" title="Reset ' + esc(r.label) + '">' + RESET_I + '</button></div>'
          }).join('') + '</div>' +
          '<div class="wcp-pal"><div class="wcp-pal-head"><p class="wied-l" id="' + P.id + '-pl">Palettes <small data-cp-count></small></p>' +
            '<button type="button" class="wcp-dice" data-cp-surprise>' + DICE_I + '<span>Surprise me</span></button></div>' +
            '<div class="wcp-tags" role="group" aria-label="Filter palettes" data-cp-tags></div>' +
            '<div class="wcp-grid" role="radiogroup" aria-labelledby="' + P.id + '-pl" data-cp-grid></div>' +
            '<button type="button" class="wcp-more" data-cp-more hidden></button>' +
            '<p class="wcp-note" data-cp-note aria-live="polite"></p></div>'
      }
      function chips(list, s) {
        return list.map(function (p) {
          var cz = colorsOfPalette(p, s.style, s.name), dark = (p.tags || []).indexOf('on-dark') >= 0
          var dots = ['c1', 'c2', 'c3', 'c4', 'ink'].map(function (r) { return p.colors[r] ? '<i style="background:' + p.colors[r] + '"></i>' : '' }).join('')
          return '<button type="button" role="radio" class="wcp-chip' + (dark ? ' is-dark' : '') + '" data-cp-pal="' + esc(p.id) + '" aria-checked="false" tabindex="-1" title="' + esc(p.name + (p.tags && p.tags.length ? ' · ' + p.tags.map(function (t) { return TAG_LABEL[t] || t }).join(', ') : '')) + '">' +
            '<span class="wcp-chip-i" aria-hidden="true">' + buildSvg(s.name, s.style, { size: 40, mode: 'live', colors: cz, full: true }) + '</span>' +
            '<span class="wcp-chip-n">' + esc(p.name) + '</span><span class="wcp-dots" aria-hidden="true">' + dots + '</span></button>'
        }).join('')
      }
      function visible(list) { return P.filter ? list.filter(function (p) { return (p.tags || []).indexOf(P.filter) >= 0 }) : list }
      function update() {
        var s = sb()
        if (!I.name || !s) { el.hidden = true; return }
        var multi = isMulti(s.style, s.name)
        el.hidden = !multi
        if (!multi) return
        if (!PL()) { if (!el.firstChild) el.innerHTML = '<p class="wcp-wait"><span class="wcp-skel"></span>Getting the colours ready…</p>'; ensurePL().then(update); return }
        var rows = rowsFor(s.style, s.name), key = s.name + '|' + s.style + '|' + rows.map(function (r) { return r.key }).join(',')
        if (key !== P.key) { if (P.key.split('|')[0] !== s.name) { P.more = false; P.filter = '' } el.innerHTML = shell(rows); P.key = key; P.gkey = ''; P.rows = rows }
        var cz = colorsFor(s.style, s.name, s.st), c = s.st, tw = c.tw[s.style] || {}
        P.rows.forEach(function (r) {
          var row = $('[data-cp-row="' + r.key + '"]', el); if (!row) return
          var v = rowValue(r, cz, s), pick = $('[data-cp-pick]', row), hx = $('[data-cp-hex]', row)
          row.style.setProperty('--c', v)
          row.classList.toggle('is-set', r.key in tw)
          if (D.activeElement !== pick && pick.value !== v.toLowerCase()) pick.value = v.toLowerCase()
          if (D.activeElement !== hx) { hx.value = v; hx.removeAttribute('aria-invalid') }
          $('[data-cp-reset]', row).disabled = !(r.key in tw)
        })
        $('[data-cp-resetall]', el).disabled = !hasCustom(c)
        var list = palettesOf(s.name), grid = $('[data-cp-grid]', el)
        if (!list) {
          if (!grid.firstChild) grid.innerHTML = new Array(9).join('<span class="wcp-chip is-skel" aria-hidden="true"></span>')
          loadPalettes(s.name).then(function (l) { if (l) update(); else grid.innerHTML = '<p class="wcp-empty">No palettes for this icon yet.</p>' })
          return
        }
        var vis = visible(list)
        if (!P.more && c.pal && !P.filter) { for (var j = 12; j < vis.length; j++) if (vis[j].id === c.pal) P.more = true }
        var shown = P.filter || P.more || vis.length <= 15 ? vis : vis.slice(0, 12)
        var gkey = key + '|' + P.filter + '|' + list.length + '|' + shown.length
        if (gkey !== P.gkey) {
          P.gkey = gkey
          var tags = {}; list.forEach(function (p) { (p.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1 }) })
          // filters worth having: tags shared by two or more palettes (plus "for dark pages"), most common first
          var tl = Object.keys(tags).filter(function (t) { return tags[t] > 1 || t === 'on-dark' }).sort(function (a, b) { return tags[b] - tags[a] || (a < b ? -1 : 1) }).slice(0, 10)
          if (P.filter && tl.indexOf(P.filter) < 0) P.filter = ''
          $('[data-cp-tags]', el).innerHTML = [['', 'All']].concat(tl.map(function (t) { return [t, TAG_LABEL[t] || t.replace(/-/g, ' ')] })).map(function (t) { return '<button type="button" class="wcp-tag" data-cp-tag="' + t[0] + '" aria-pressed="' + (P.filter === t[0]) + '">' + esc(t[1]) + (t[0] ? '<small>' + tags[t[0]] + '</small>' : '') + '</button>' }).join('')
          grid.innerHTML = chips(shown, s)
          var mb = $('[data-cp-more]', el); mb.hidden = shown.length >= vis.length; mb.textContent = 'Show all ' + vis.length + ' palettes'
          $('[data-cp-count]', el).textContent = list.length + ' picked for ' + s.title
        }
        var chipsEl = $$('[data-cp-pal]', grid), any = false
        chipsEl.forEach(function (b) { var on = b.getAttribute('data-cp-pal') === c.pal; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; any = any || on })
        if (!any && chipsEl[0]) chipsEl[0].tabIndex = 0
        var note = $('[data-cp-note]', el), edited = Object.keys(tw).length
        note.textContent = c.pal ? (c.palName + (edited ? ', with your edits' : '') + '. Applies to every style.') : hasCustom(c) ? 'Your own colours.' : 'Pick a palette, or change any colour above.'
      }
      function pal(id) { var s = sb(), l = (s && palettesOf(s.name)) || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null }
      function onClick(e) {
        var b = e.target.closest('button'); if (!b || !el.contains(b)) return
        var v, s = sb(); if (!s) return
        if ((v = b.getAttribute('data-cp-pal'))) { var p = pal(v); if (p) choosePalette(p, s) }
        else if (b.hasAttribute('data-cp-tag')) { P.filter = b.getAttribute('data-cp-tag'); update() }
        else if (b.hasAttribute('data-cp-more')) { P.more = true; var k0 = $('[data-cp-pal]', el).length; update(); var nx = $('[data-cp-pal]', el)[k0]; if (nx) nx.focus() }
        else if ((v = b.getAttribute('data-cp-reset'))) clearTweak(v, s)
        else if (b.hasAttribute('data-cp-resetall')) resetColors(s)
        else if (b.hasAttribute('data-cp-surprise')) {
          var l = visible(palettesOf(s.name) || []).filter(function (p) { return p.id !== s.st.pal })
          if (l.length) { var p2 = l[Math.floor(Math.random() * l.length)]; choosePalette(p2, s); var nb = $('[data-cp-pal="' + p2.id + '"]', el); if (nb && nb.scrollIntoView) nb.scrollIntoView({ block: 'nearest', behavior: reducedMq.matches ? 'auto' : 'smooth' }) }
        }
      }
      function onInput(e) {
        var t = e.target, v, s = sb(); if (!s) return
        if ((v = t.getAttribute('data-cp-pick'))) setTweak(v, t.value, true, s)
        else if ((v = t.getAttribute('data-cp-hex'))) { var h = normHex(t.value); t.setAttribute('aria-invalid', h || !t.value ? 'false' : 'true'); if (h && t.value.replace('#', '').length >= 6) setTweak(v, h, true, s) }
      }
      function onChange(e) {
        var t = e.target, v, s = sb(); if (!s) return
        if ((v = t.getAttribute('data-cp-pick'))) setTweak(v, t.value, false, s)
        else if ((v = t.getAttribute('data-cp-hex'))) { var h = normHex(t.value); if (h) { t.value = h; setTweak(v, h, false, s) } else { t.blur(); update() } }
      }
      function onKey(e) {
        var t = e.target
        if (t.hasAttribute && t.hasAttribute('data-cp-hex') && e.key === 'Enter') { e.preventDefault(); var h = normHex(t.value), k2 = t.getAttribute('data-cp-hex'); if (h) { t.value = h; setTweak(k2, h, false, sb()) } t.select(); return }
        if (!t.hasAttribute || !t.hasAttribute('data-cp-pal')) return
        var list = $$('[data-cp-pal]', el), i = list.indexOf(t), cols = Math.max(1, Math.round(t.parentNode.clientWidth / (t.offsetWidth || 1)))
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? cols : e.key === 'ArrowUp' ? -cols : e.key === 'Home' ? -i : e.key === 'End' ? list.length - 1 - i : 0
        if (!d) return
        e.preventDefault(); e.stopPropagation()
        var n = list[clamp(i + d, 0, list.length - 1)]; if (!n || n === t) return
        n.focus(); n.click()
      }
      function onOut(e) { var t = e.target; if (t.hasAttribute && t.hasAttribute('data-cp-hex')) setTimeout(update, 0) }
      el.addEventListener('click', onClick); el.addEventListener('input', onInput); el.addEventListener('change', onChange); el.addEventListener('keydown', onKey); el.addEventListener('focusout', onOut)
      var api2 = { el: el, k: P.k, update: update, destroy: function () { el.removeEventListener('click', onClick); el.removeEventListener('input', onInput); el.removeEventListener('change', onChange); el.removeEventListener('keydown', onKey); el.removeEventListener('focusout', onOut); panels = panels.filter(function (x) { return x !== api2 }); kitUnwatch(el); el.innerHTML = ''; el.classList.remove('wied-cpanel') } }
      panels.push(api2)
      update()
      return api2
    }

    /* the single colour of one-colour styles (black, the style colour, presets, any colour, a typed hex). k = 'a' (the
       icon: S.color) or 'b' (the "Turn into" target's own colour). Drawn by monoHtml, painted by paintMono, handled in
       onClick / onMonoInput. */
    function monoHtml(k, labelId) {
      return '<div class="wied-sw" role="group" aria-labelledby="' + labelId + '" data-mono="' + k + '">' +
        SWATCHES.map(function (c) { return '<button type="button" data-mono-c="' + c[0] + '" aria-pressed="false" title="' + c[1] + '"><span' + (c[0] === 'ink' ? ' style="background:' + INK + '"' : c[0] === 'style' ? ' class="is-style"' : ' style="background:' + c[0] + '"') + '></span><i class="visually-hidden">' + c[1] + '</i></button>' }).join('') +
        '<label class="wied-sw-custom" title="Any colour"><input type="color" value="#ff5a36" data-mono-pick aria-label="Pick any colour"><span></span></label>' +
        // a typed hex code: exact brand colours, keyboards and screen readers, and Firefox for Android (whose picker only offers presets)
        '<input class="wied-hex" data-mono-hex type="text" inputmode="text" maxlength="7" spellcheck="false" autocomplete="off" aria-label="Colour hex code, for example #2F5BFF" title="Type or paste a hex code"></div>'
    }
    function monoValue(k) { return k === 'b' ? (SW.to ? bstate().color : 'ink') : S.color }
    function setMono(k, v, soft) {
      if (k === 'b') { if (!SW.to) return; bstate().color = v; presetKey = ''; if (soft) { if (!colorRaf) colorRaf = requestAnimationFrame(function () { colorRaf = 0; render() }) } else render(); return }
      set({ color: v }, soft ? { soft: true } : undefined)
    }
    function paintMono() {
      $$('[data-mono]', root).forEach(function (g) {
        var k = g.getAttribute('data-mono'), v = monoValue(k), st = k === 'b' ? (swapTarget() || {}).style : S.style
        $$('[data-mono-c]', g).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mono-c') === v) })
        var sty = $('.is-style', g); if (sty && st) sty.style.setProperty('--sc', info(st).hex)
        var custom = $('.wied-sw-custom', g), isC = isHex(v) && !SWATCHES.some(function (c) { return c[0] === v })
        custom.classList.toggle('is-on', isC); var mp = $('[data-mono-pick]', g); if (isC && mp.value !== v.toLowerCase()) mp.value = v.toLowerCase()
        var hx = $('[data-mono-hex]', g); if (D.activeElement !== hx) { hx.value = colorHex(st, v); hx.removeAttribute('aria-invalid') }
      })
    }
    function onMonoInput(e, commit) {
      var t = e.target, g = t.closest && t.closest('[data-mono]'); if (!g || !root.contains(g)) return false
      var k = g.getAttribute('data-mono')
      if (t.hasAttribute('data-mono-pick')) { setMono(k, t.value.toUpperCase(), !commit); return true }
      if (!t.hasAttribute('data-mono-hex')) return false
      var h = normHex(t.value), full = t.value.replace('#', '').length >= 6, st = k === 'b' ? (swapTarget() || {}).style : S.style
      t.setAttribute('aria-invalid', h || (!commit && !full) ? 'false' : 'true')
      if (h && (commit || full)) { if (commit) t.value = h; if (h !== colorHex(st, monoValue(k))) setMono(k, h, !commit) }
      else if (commit) { t.value = colorHex(st, monoValue(k)); t.removeAttribute('aria-invalid') }
      return true
    }

    function colorName() {
      var ci = isMulti() ? colorsFor() : null
      if (ci) { var c = cstate(); return c.pal ? c.palName.toLowerCase() + (Object.keys(c.tw[S.style] || {}).length ? ', edited' : '') + ' palette' : 'your colours' }
      var c = S.color
      if (c === 'ink') return 'black'
      if (c === 'style') return info(S.style).title.toLowerCase() + ' colour'
      for (var i = 0; i < SWATCHES.length; i++) if (SWATCHES[i][0] === c) return SWATCHES[i][1].toLowerCase()
      return String(c).toUpperCase()
    }

    /* ───────── SVG builders ───────── */
    function rootFor(style, stroke) {
      var r = {}, src = info(style).root
      for (var k in src) r[k] = src[k]
      if (stroke != null && r['stroke-width'] != null) r['stroke-width'] = stroke
      return r
    }
    function attrStr(o) { return Object.keys(o).map(function (k) { var v = o[k]; return v === false || v == null ? '' : ' ' + k + '="' + esc(v) + '"' }).join('') }
    // every palette variable an icon uses in a style (from its markup; no palette map needed)
    function varNames(name, style) {
      var inner = innerOf(name, style), out = []
      String(inner || '').replace(/var\(\s*(--with-[\w-]+)/g, function (a, v) { if (out.indexOf(v) < 0) out.push(v); return a })
      return out
    }
    // mode: 'live' (currentColor, decorative), 'code' (currentColor unless a colour is picked), 'file' (colour baked in)
    // o: { size, mode, colors (cz, default: the icon's), mono ('ink' | 'style' | hex: this svg's single colour, default
    //      S.color), ink (live: an explicit colour for currentColor), full (live: set every palette variable on the svg,
    //      unset ones to initial = their own default, so nothing leaks in from the page or the other form of a swap),
    //      cls, title, head, body, extra, hex, flat, resolve }
    function buildSvg(name, style, o) {
      o = o || {}
      var inner = innerOf(name, style); if (inner == null) return ''
      var a = { xmlns: 'http://www.w3.org/2000/svg', width: o.size, height: o.size, viewBox: '0 0 24 24' }
      var r = rootFor(style, S.stroke); for (var k in r) a[k] = r[k]
      if (o.cls) a['class'] = o.cls
      if (o.mode === 'live') { a['aria-hidden'] = 'true'; a.focusable = 'false' }
      // colours of multi-colour styles: live -> CSS variables on the svg; code -> the same, pretty (or baked when flat); file -> baked
      var cz = o.colors !== undefined ? o.colors : colorsFor(style, name), mono = o.mono !== undefined ? o.mono : S.color
      if (o.mode === 'live') {
        var css = cssOf(cz, o.ink)
        if (o.full) varNames(name, style).forEach(function (v) { if (!cz || !cz.vars[v]) css += (css ? ';' : '') + v + ':initial' })
        if (css) a.style = css
      } else if (cz && o.mode === 'code' && !o.flat) a.style = cssOf(cz, mono !== 'ink' ? colorHex(style, mono) : null, true)
      var bake = o.mode === 'file' || (o.mode === 'code' && (o.flat || (mono !== 'ink' && !cz)))
      var body = (o.title ? '<title>' + esc(o.title) + '</title>' : '') + (o.body != null ? o.body : inner)
      var out = '<svg' + attrStr(a) + (o.extra || '') + '>' + (o.head || '') + body + '</svg>'
      if (bake) { var h = o.hex || colorHex(style, mono); out = resolveVars(bakeColors(out, cz)).replace(/currentColor/g, h) }
      else if (o.mode !== 'live') out = out.replace(/var\(--(?:eg|with)-(duo|accent),\s*currentColor\)/g, function (all, k) { return cz && cz.vars['--with-' + k] ? all : 'currentColor' })
      // for apps (Figma, Canva, Keynote…): their SVG importers have no CSS cascade, so var(--with-x, #hex) would paint black.
      // Resolve every variable to its colour; currentColor stays, so pasted HTML still follows `color`.
      if (o.resolve && !bake) out = resolveVars(out)
      return out
    }
    function svgText(mode, style, px) { return buildSvg(I.name, style || S.style, { size: px || S.size, mode: mode || 'file', title: mode === 'file' ? null : null }) }

    /* ───────── motion for the current state ───────── */
    function spec() { return I.motion || { intent: '', loop: { preset: 'float' }, hover: { preset: 'pop' } } }
    function entryFor(preset) {
      var sp = spec(), all = [sp.loop, sp.hover].concat(sp.alt || []).filter(Boolean)
      for (var i = 0; i < all.length; i++) if (all[i].preset === preset) return all[i]
      return { preset: preset }
    }
    function currentEntry(trigger) {
      var sp = spec()
      if (S.preset) return entryFor(S.preset)
      return (trigger === 'loop' ? sp.loop : sp.hover) || sp.loop || { preset: 'pop' }
    }
    function motionInfo(trigger) {
      trigger = trigger || S.anim
      if (trigger === 'none') return null
      var o = { trigger: trigger, speed: S.speed, amount: S.amount, stroked: info(S.style).stroked, deco: S.deco, spec: S.preset ? null : I.motion, parts: parts().any }
      return motionAttrs(currentEntry(trigger), o) || motionAttrs({ preset: trigger === 'loop' ? 'float' : 'pop' }, o)
    }
    // the part tags of the current drawing (style), cached per drawing
    var partsKey = '', partsVal = null
    function parts(style) {
      var inner = innerOf(I.name, style || S.style) || '', k = I.name + '|' + (style || S.style) + '|' + inner.length
      if (k !== partsKey) { partsKey = k; partsVal = partTags(inner) }
      return partsVal
    }
    function presetsOrdered() {
      var sp = spec(), own = []
      ;[sp.loop, sp.hover].concat(sp.alt || []).forEach(function (e) { if (e && e.preset && PRESETS[e.preset] && own.indexOf(e.preset) < 0) own.push(e.preset) })
      return { own: own, rest: PRESET_LIST.map(function (p) { return p[0] }).filter(function (p) { return own.indexOf(p) < 0 }) }
    }
    /* ───────── "Turn into": target, After's colours, timing ───────── */
    function iconTitle(n) { if (n === I.name) return I.title; var w = W.WI && W.WI.icon && W.WI.icon(n); return (w && w.title) || titleOf(n) }
    // bTried[name|style]: 1 while After's drawing loads, 2 once tried (only then may a missing style fall back to line)
    var bTried = {}
    function swapTarget() {
      if (!SW.to) return null
      var n = SW.to, want = SW.toStyle || S.style, st = want
      if (innerOf(n, st) == null && bTried[n + '|' + st] === 2 && innerOf(n, 'line') != null) st = 'line'
      var title = iconTitle(n)
      return { name: n, style: st, want: want, title: title, label: title + (st !== S.style ? ' (' + info(st).title + ')' : '') }
    }
    function swapReady() { var t = swapTarget(); return !!t && innerOf(t.name, t.style) != null }
    // After's drawing in a style: its own page first (every style, small), else that style's data file
    function ensureB(n, st) {
      var key = n + '|' + st
      if (innerOf(n, st) != null || bTried[key]) return
      bTried[key] = 1
      var done = function () {
        bTried[key] = 2
        // no drawing in that style, nor in line: not an icon we have (a typo in a host's set(), a removed icon)
        if (innerOf(n, st) == null && innerOf(n, 'line') == null) return loadStyleData('line').then(function () {
          if (innerOf(n, 'line') == null && SW.to === n) { SW.to = ''; SW.toStyle = ''; SW.on = false; toast('Couldn’t find an icon called “' + n + '”. Pick another one.') }
          if (built) render()
        })
        presetKey = ''; if (built) render()
      }
      fetchIconPage(n).then(function (ok) { return ok && innerOf(n, st) != null ? true : loadStyleData(st) }).then(done, done)
    }
    // After's colours: { cz: palette colours (multi-colour styles) or null, mono: 'ink' | 'style' | hex }.
    // Linked ("same colours as before"): Before's palette roles and single colour; else its own (BCS).
    function bColors(t) {
      t = t || swapTarget(); if (!t) return null
      if (SW.link) return { cz: isMulti(t.style, t.name) ? colorsFor(t.style, t.name) : null, mono: S.color }
      var st = bstate(t.name)
      return { cz: isMulti(t.style, t.name) ? colorsFor(t.style, t.name, st) : null, mono: st.color }
    }
    function swEffect() { return SW.effect || 'fade' }
    function fxDur(e) { var m = WM(), d = m && m.EFFECT_DEFAULTS && m.EFFECT_DEFAULTS[e]; return d ? d.dur : (FX_DUR[e] || 0.3) }
    function speedMul() { for (var i = 0; i < SPEEDS.length; i++) if (SPEEDS[i][0] === SW.speed) return SPEEDS[i][2]; return 1 }
    function swDur() { return SW.dur != null ? SW.dur : round(fxDur(swEffect()) * speedMul(), 2) }
    function swEaseCss() { for (var i = 0; i < EASES.length; i++) if (EASES[i][0] === SW.ease) return EASES[i][2]; return null }
    function swCycle() { return round(2 * (swDur() + SW.hold), 3) }
    // the swap's CSS variables. all: also the ones equal to motion.css defaults (live copies); live: script-timed copies
    // (an auto swap waits --wm-swap-delay once, before its first switch, so live copies leave it out)
    function swVars(o) {
      o = o || {}
      var v = {}, d = swDur(), auto = SW.trigger === 'auto'
      if (o.all || Math.abs(d - fxDur(swEffect())) > 0.001) v['--wm-swap-dur'] = round(d, 2) + 's'
      var e = swEaseCss(); if (e) v['--wm-swap-ease'] = e
      if (SW.delay > 0 && !(o.live && auto)) v['--wm-swap-delay'] = round(SW.delay, 2) + 's'
      if (auto && (o.all || Math.abs(SW.hold - SW_HOLD) > 0.001)) v['--wm-swap-hold'] = round(SW.hold, 2) + 's'
      return v
    }
    function varsCss(v, pretty) { return Object.keys(v).map(function (k) { return k + (pretty ? ': ' : ':') + v[k] }).join(pretty ? '; ' : ';') }

    /* ───────── live icon markup (preview, placements, the library stage) ───────── */
    // the stacked pair. Both forms carry every palette variable of their own (full), so a palette on one never paints the
    // other, and nothing leaks in from the page. o.colorB: After's single colour (default: its own, or Before's when linked).
    function swapMarkup(t, px, o) {
      var fx = swEffect(), bc = bColors(t), v = swVars({ all: true, live: true })
      var inkB = o.colorB !== undefined ? o.colorB : SW.link ? null : previewColor(bc.mono)
      var a = buildSvg(I.name, S.style, { size: px, mode: 'live', full: true })
      var b = buildSvg(t.name, t.style, { size: px, mode: 'live', colors: bc.cz, ink: inkB, full: true })
      return '<span class="wm-swap wm-js wm-fx-' + fx + (o.on ? ' is-on' : '') + '" data-wsw style="' + varsCss(v) + '"><span class="wm-a">' + a + '</span><span class="wm-b">' + b + '</span></span>'
    }
    // o: { px, color, colorB, trigger: 'auto'|'hover'|'none'|'loop'|'once', swap: bool, on: bool (default: the shared state) }
    function liveIcon(o) {
      o = o || {}
      var px = o.px || 24
      var t = o.swap !== false && swapReady() ? swapTarget() : null
      if (o.on === undefined) o.on = SW.on
      var inner = t ? swapMarkup(t, px, o) : buildSvg(I.name, S.style, { size: px, mode: 'live', full: true })
      var trig = o.trigger === 'auto' || !o.trigger ? S.anim : o.trigger
      var mi = trig === 'none' ? null : motionInfo(trig)
      var col = o.color ? 'color:' + o.color + ';' : ''
      if (!mi) return '<span class="wied-ic" style="' + col + 'width:' + px + 'px;height:' + px + 'px">' + inner + '</span>'
      var force = forced ? ' wm-force' : ''
      if (!t && mi.preset !== 'draw' && parts().any) force += ' wm-parts'
      return '<span class="wied-ic ' + mi.cls + force + '" style="' + col + mi.style + (mi.style ? ';' : '') + 'width:' + px + 'px;height:' + px + 'px">' + inner + '</span>'
    }
    var forced = false
    // put live markup into el only when the drawing itself changed (on / off is not part of the comparison: it is a
    // class, applied after), so switching mid-transition reverses smoothly instead of restarting. Returns true if repainted.
    function paintLive(el, o) {
      o = o || {}
      var k = {}; for (var x in o) k[x] = o[x]
      k.on = false
      var key = liveIcon(k)
      if (el._wk === key && !o.force) { syncSwaps(el); return false }
      var p = {}; for (var y in o) p[y] = o[y]
      p.on = undefined
      el._wk = key
      el.innerHTML = liveIcon(p)
      prepareDraw(el); prepareSwaps(el); syncSwaps(el)
      return true
    }
    // the draw effect needs every stroke on pathLength 1 (data-wm-pl) and .wm-drawable on the pair
    function prepareSwaps(scope) {
      $$('.wm-swap.wm-fx-draw:not(.wm-drawable)', scope).forEach(function (w) {
        var m = WM(), ok = false
        $$('.wm-a,.wm-b', w).forEach(function (f) { try { ok = (m && m.prepareDraw ? m.prepareDraw(f) : false) || ok } catch (e) { } })
        if (ok) w.classList.add('wm-drawable')
      })
    }

    /* ───────── switching: one shared state, applied to every live copy ───────── */
    // swHosts: the editor, the placements and any element a host page registers (library stage). A copy shows After
    // when the shared state is on (click / auto / Switch) or when its own trigger element is hovered / focused
    // (hover / focus triggers: el._wswOn on the nearest [data-wsw-t], else the host itself).
    var swHosts = []
    function trigEl(w, host) { var t = w.closest('[data-wsw-t]'); return t && host.contains(t) ? t : host }
    function syncSwaps(scope) {
      var list = scope ? [scope] : swHosts.map(function (h) { return h.el })
      var pressed = SW.trigger === 'click'
      list.forEach(function (h) {
        $$('[data-wsw]', h).forEach(function (w) {
          if (w.closest('[data-wsw-preview]')) return
          var t = trigEl(w, h), on = !!(SW.on || t._wswOn)
          if (w.classList.contains('is-on') !== on) w.classList.toggle('is-on', on)
        })
        $$('[data-wsw-btn]', h).concat(h.hasAttribute && h.hasAttribute('data-wsw-btn') ? [h] : []).forEach(function (b) {
          if (pressed && SW.to) b.setAttribute('aria-pressed', SW.on ? 'true' : 'false'); else b.removeAttribute('aria-pressed')
        })
      })
    }
    function setLocal(t, v) { if (!!t._wswOn === !!v) return; t._wswOn = !!v; syncSwaps() }
    var lastPointer = 'mouse', downAt = 0
    function focusVisible(el) { try { return el.matches(':focus-visible') } catch (e) { return true } }
    function addHost(el, o) {
      o = o || {}
      if (!el) return function () { }
      var h = { el: el }
      var tOf = function (e) { var t = e.target && e.target.closest ? e.target.closest('[data-wsw-t]') : null; return t && el.contains(t) ? t : (o.self ? el : null) }
      var over = function (e) { if (e.pointerType === 'touch' || SW.trigger !== 'hover') return; var t = tOf(e); if (t && !t.contains(e.relatedTarget)) setLocal(t, true) }
      var out = function (e) { if (e.pointerType === 'touch') return; var t = tOf(e); if (t && !t.contains(e.relatedTarget)) setLocal(t, false) }
      var down = function (e) {
        lastPointer = e.pointerType || 'mouse'; downAt = Date.now()
        // focus trigger on touch: Safari never focuses a tapped button, so focus it (focusin then shows After)
        if (SW.trigger === 'focus' && lastPointer !== 'mouse') { var t = tOf(e); if (t && t.focus && t.matches('button,[tabindex],a[href],input')) setTimeout(function () { t.focus({ preventScroll: true }) }, 0) }
      }
      // hover: only keyboard focus stands in for the pointer. Focus that a press just gave (a tap on a phone can report as
      // :focus-visible) must not switch it on, or the tap's own click would switch it straight back off
      var fin = function (e) { var t = tOf(e); if (!t) return; if (SW.trigger === 'focus' || (SW.trigger === 'hover' && focusVisible(e.target) && Date.now() - downAt > 600)) setLocal(t, true) }
      var fout = function (e) { var t = tOf(e); if (t && !t.contains(e.relatedTarget) && (SW.trigger === 'focus' || SW.trigger === 'hover')) setLocal(t, false) }
      el.addEventListener('pointerover', over); el.addEventListener('pointerout', out); el.addEventListener('pointerdown', down, true)
      el.addEventListener('focusin', fin); el.addEventListener('focusout', fout)
      h.off = function () { el.removeEventListener('pointerover', over); el.removeEventListener('pointerout', out); el.removeEventListener('pointerdown', down, true); el.removeEventListener('focusin', fin); el.removeEventListener('focusout', fout); swHosts = swHosts.filter(function (x) { return x !== h }) }
      swHosts.push(h)
      syncSwaps(el)
      return h.off
    }
    // a press on a live copy (the preview, a placement, the library stage), by trigger:
    //   click: switch for everyone · hover: a tap (touch, no hover there) switches this copy · auto: pause / resume · focus: nothing (focus does it)
    // returns true when the press was used
    function swapPress(t) {
      if (!SW.to || !swapReady()) return false
      if (SW.trigger === 'click') { toggleSwap(); return true }
      if (SW.trigger === 'hover') { if (lastPointer === 'touch' || lastPointer === 'pen') { setLocal(t, !t._wswOn); return true } return false }
      if (SW.trigger === 'auto') { pauseAuto(!autoHeld()); return true }
      return SW.trigger === 'focus'
    }
    function toggleSwap(v) {
      SW.on = v === undefined ? !SW.on : !!v
      applyOn()
      var t = swapTarget(); if (t) say(SW.on ? 'Showing ' + t.title + '.' : 'Showing ' + I.title + '.')
    }
    // on / off changed: classes on every live copy + the few labels that depend on it (no re-render, no rebuilt markup)
    function applyOn(quiet) {
      syncSwaps()
      paintSwapState()
      if (!quiet) emit()
    }

    /* ───────── auto: turns into After and back on its own ───────── */
    var autoT = 0, autoSig = '', demoT = 0
    // held: paused by the visitor, or waiting for Play because the device asks for less motion (Play starts it anyway)
    function autoHeld() { return !!SW.paused || (reducedMq.matches && !forced && !SW.go) }
    function autoWanted() { return built && SW.trigger === 'auto' && swapReady() && !autoHeld() }
    function stopAuto() { if (autoT) clearTimeout(autoT); autoT = 0; autoSig = '' }
    function syncAuto() {
      var sig = autoWanted() ? [SW.to, SW.toStyle, swDur(), SW.hold, SW.delay].join('|') : ''
      if (sig === autoSig && (autoT || !sig)) return
      stopAuto()
      if (!sig) { if (SW.trigger === 'auto' && SW.on && !SW.paused) { SW.on = false; applyOn(true) } return }
      autoSig = sig
      autoT = setTimeout(autoTick, (SW.delay + SW.hold) * 1000)
    }
    function autoTick() {
      autoT = 0
      if (!autoWanted()) { autoSig = ''; return }
      if (D.visibilityState !== 'hidden') { SW.on = !SW.on; applyOn(true) }
      autoT = setTimeout(autoTick, (swDur() + SW.hold) * 1000)
    }
    function pauseAuto(p) {
      SW.paused = !!p; if (!p) SW.go = true
      if (p) stopAuto(); else syncAuto()
      paintSwapState()
      say(p ? 'Paused.' : 'Playing: ' + I.title + ' turns into ' + ((swapTarget() || {}).title || '') + ' and back.')
    }
    // Play: one A -> B -> A (auto: pause / resume the loop)
    function playDemo() {
      if (!swapReady()) return
      if (SW.trigger === 'auto') { pauseAuto(!autoHeld()); return }
      clearTimeout(demoT)
      SW.on = true; applyOn()
      demoT = setTimeout(function () { SW.on = false; applyOn() }, (SW.delay + swDur() + Math.max(0.7, SW.hold)) * 1000)
    }

    /* ───────── build the UI ───────── */
    var root = D.createElement('div')
    root.className = 'wied'
    root.id = uid
    host.innerHTML = ''
    host.appendChild(root)
    var built = false, ownPanel = null, offIO = null

    /* ───────── our pickers (window.WIKit) ─────────
       Every colour, range and number field the studio draws (here, in Colours panels and Download panels mounted
       anywhere) becomes the kit's control as soon as it appears. The natives stay the value holders, so every input /
       change listener below keeps working. Colour pickers suggest this icon's own colours and its palettes; the list is
       refreshed each time a picker is about to open. */
    var kitWatched = [], dead = false
    function kitAdd(out, seen, c, n) {
      c = String(c || '').toUpperCase(); if (/^#[0-9A-F]{3}$/.test(c)) c = '#' + c.slice(1).replace(/./g, '$&$&')
      if (!isHex(c) || seen[c] || out.length >= 16) return
      seen[c] = 1; out.push({ name: n, color: c })
    }
    function kitOpts(t) {
      var out = [], seen = {}, add = function (c, n) { kitAdd(out, seen, c, n) }, k, s, label = 'Picked for ' + I.title
      if ((k = t.getAttribute('data-cp-pick'))) {
        // one part of a multi-colour icon: every colour it wears now, then this part's colour in each of its palettes
        var pn = null; panels.forEach(function (p) { if (p.el.contains(t)) pn = p })
        s = subj(pn ? pn.k : 'a'); if (!s) return {}
        var cz = colorsFor(s.style, s.name, s.st)
        rowsFor(s.style, s.name).forEach(function (r) { add(rowValue(r, cz, s), r.label) })
        ;(palettesOf(s.name) || []).forEach(function (p) { var z = colorsOfPalette(p, s.style, s.name); if (z) add(k === 'ink' ? z.ink : z.vars[k], p.name) })
        label = 'Picked for ' + s.title
      } else if (t.hasAttribute('data-mono-pick')) {
        var g = t.closest('[data-mono]'); s = subj(g ? g.getAttribute('data-mono') : 'a'); if (!s) return {}
        add(info(s.style).hex, info(s.style).title + ' colour'); add(INK, 'Ink')
        ;(palettesOf(s.name) || []).forEach(function (p) { if (p.colors) add(p.colors.c1, p.name) })
        styleList().forEach(function (st) { add(info(st).hex, info(st).title) })
        label = 'Picked for ' + s.title
      } else if (t.hasAttribute('data-dl-pick')) {
        // a background / edge colour for a download: this icon's colours first, then the preview's backgrounds
        var cz2 = isMulti() ? colorsFor() : null
        if (cz2) rowsFor(S.style).forEach(function (r) { add(rowValue(r, cz2), r.label) })
        else add(colorHex(S.style), 'Icon colour')
        add(info(S.style).hex, info(S.style).title + ' colour'); add(pageHex(), 'Preview background')
        add('#FBF8F3', 'Paper'); add('#0D0F14', 'Night'); add(mixHex(info(S.style).hex, '#FBF8F3', 0.22), 'Tint')
        label = 'From this icon'
      } else return {}
      return { palette: out, paletteLabel: label }
    }
    function kitColor(K, t) {
      // the suggestions follow the icon: the kit reads them each time the picker opens. On phones the live preview is
      // scrolled into view above the picker's sheet.
      var lab = ''
      K.colorPicker(t, {
        palette: function () { var o = kitOpts(t); lab = o.paletteLabel || ''; return o.palette },
        paletteLabel: function () { return lab },
        preview: function () { return root.contains(t) && !t.hasAttribute('data-dl-pick') ? $('[data-art]', root) : null }
      })
    }
    function kitScan(scope) {
      var K = W.WIKit; if (!K || !scope || dead) return
      $$('input[type=color]', scope).forEach(function (t) { if (!K.get(t)) kitColor(K, t) })
      $$('input[type=range]', scope).forEach(function (r) { if (!K.get(r)) K.slider(r) })
      $$('input[type=number]', scope).forEach(function (n) { if (!K.get(n)) K.stepper(n) })
    }
    function kitWatch(el) {
      if (!el || kitWatched.some(function (w) { return w.el === el })) return
      var w = { el: el, mo: null }; kitWatched.push(w)
      loadKit().then(function (K) {
        if (!K || dead || kitWatched.indexOf(w) < 0) return
        kitScan(el)
        if (W.MutationObserver) { w.mo = new MutationObserver(function () { kitScan(el) }); w.mo.observe(el, { childList: true, subtree: true }) }
      })
    }
    function kitUnwatch(el) { kitWatched = kitWatched.filter(function (w) { if (w.el !== el && el) return true; if (w.mo) w.mo.disconnect(); return false }) }
    kitWatch(host)
    function build() {
      var list = styleList()
      root.innerHTML =
        '<div class="wied-main">' +
          '<div class="wied-stagecol">' +
            '<div class="wied-canvas wm-trigger" data-canvas>' +
              '<div class="wied-canvas-top"><span class="wied-live"><i aria-hidden="true"></i>Live preview</span>' +
                '<div class="wied-bgs" role="group" aria-label="Preview background">' +
                  [['light', 'Light background'], ['dark', 'Dark background'], ['brand', 'Tinted background']].map(function (b) { return '<button type="button" class="wied-bgb is-' + b[0] + '" data-bg="' + b[0] + '" aria-pressed="false" title="' + b[1] + '"><span class="visually-hidden">' + b[1] + '</span></button>' }).join('') +
                '</div></div>' +
              '<button type="button" class="wied-art" data-art data-wsw-t data-wsw-btn></button>' +
              '<div class="wied-canvas-foot"><p class="wied-hint" data-hint></p><button type="button" class="wied-replay" data-replay><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12 A7.5 7.5 0 1 0 7 6.4"/><path d="M4 3.5 V7.5 H8"/></svg><span>Replay</span></button></div>' +
            '</div>' +
            '<div class="wied-sizes" data-sizes role="img"></div>' +
          '</div>' +
          '<div class="wied-panel">' +
            '<div class="wied-tabs" role="tablist" aria-label="Customize options">' +
              [['look', 'Look'], ['motion', 'Motion'], ['swap', 'Turn into']].map(function (t) { return '<button type="button" role="tab" id="' + uid + '-t-' + t[0] + '" data-tab="' + t[0] + '" aria-controls="' + uid + '-p-' + t[0] + '" aria-selected="false" tabindex="-1">' + t[1] + '</button>' }).join('') +
              '<span class="wied-tab-ink" aria-hidden="true"></span>' +
            '</div>' +
            '<div class="wied-pane" role="tabpanel" id="' + uid + '-p-look" aria-labelledby="' + uid + '-t-look" data-pane="look">' +
              '<div class="wied-f"><p class="wied-l" id="' + uid + '-sl">Style <small data-style-say></small></p><div class="wied-styles" role="radiogroup" aria-labelledby="' + uid + '-sl" data-styles>' +
                list.map(function (s) { var f = info(s); return '<button type="button" role="radio" class="wied-st" data-st="' + s + '" aria-checked="false" style="--sc:var(--c-' + s + ', ' + f.hex + ')" title="' + esc(f.title) + '"><span class="wied-st-i" data-st-i="' + s + '"></span><span class="wied-st-n">' + esc(f.title) + '</span></button>' }).join('') +
              '</div></div>' +
              '<div class="wied-f" data-cpanel hidden></div>' +
              '<div class="wied-f" data-monof><p class="wied-l" id="' + uid + '-cl">Colour <small>in every download</small></p>' + monoHtml('a', uid + '-cl') + '</div>' +
              layer('fine', 'Size, line and background',
                '<div class="wied-f wied-sliders">' +
                  range('size', 'Size', 12, 128, 4, 'px') +
                  range('stroke', 'Line thickness', 0.75, 3, 0.25, '') +
                '</div>' +
                '<div class="wied-f"><p class="wied-l" id="' + uid + '-bgl">Background <small>for the preview and the examples</small></p><div class="wied-seg is-3" role="group" aria-labelledby="' + uid + '-bgl">' +
                  [['light', 'Light'], ['dark', 'Dark'], ['brand', 'Tinted']].map(function (b) { return '<button type="button" data-bg="' + b[0] + '" aria-pressed="false">' + b[1] + '</button>' }).join('') +
                '</div></div>') +
            '</div>' +
            '<div class="wied-pane" role="tabpanel" id="' + uid + '-p-motion" aria-labelledby="' + uid + '-t-motion" data-pane="motion" hidden>' +
              '<p class="wied-intent" data-intent></p>' +
              '<div class="wied-f"><p class="wied-l" id="' + uid + '-al">When does it move?</p><div class="wied-seg" role="group" aria-labelledby="' + uid + '-al">' +
                [['none', 'Still'], ['loop', 'Always'], ['hover', 'On hover'], ['once', 'Once']].map(function (a) { return '<button type="button" data-anim="' + a[0] + '" aria-pressed="false">' + a[1] + '</button>' }).join('') +
              '</div></div>' +
              '<div class="wied-f"><p class="wied-l" id="' + uid + '-pl">Move <small>' + (touchMq.matches ? 'tap one to try it' : 'hover one to preview it') + '</small></p><div data-presets></div></div>' +
              '<div class="wied-f" data-partsf hidden><p class="wied-l" id="' + uid + '-ptl">Moves in parts <small data-parts-say></small></p><ul class="wied-parts" data-parts aria-labelledby="' + uid + '-ptl"></ul>' +
                '<div data-decof hidden><p class="wied-l wied-l2" id="' + uid + '-dl">Decorations <small>sparkles, backdrops and accent dots</small></p><div class="wied-seg is-2" role="group" aria-labelledby="' + uid + '-dl">' +
                  [['', 'Animate'], ['still', 'Keep still']].map(function (a) { return '<button type="button" data-deco="' + a[0] + '" aria-pressed="false">' + a[1] + '</button>' }).join('') +
                '</div></div></div>' +
              layer('pace', 'Speed and intensity', '<div class="wied-f wied-sliders">' + range('speed', 'Speed', 0.25, 2.5, 0.25, '×') + range('amount', 'Intensity', 0.25, 2, 0.25, '×') + '</div>') +
              '<p class="wied-reduced" data-reduced hidden>Your device asks for less motion, so previews stay still. <button type="button" data-force>Play them anyway</button></p>' +
            '</div>' +
            swapPaneHtml(list) +
          '</div>' +
        '</div>' +
        '<div class="wied-out">' +
          (opts.downloads === false ? '' : '<div class="wied-dlhost" data-dl-host></div>') +
          (opts.codeFold ? '<details class="wied-codefold"><summary><span class="wied-codefold-i" aria-hidden="true">' + G.code + '</span><span class="wied-codefold-t"><b>Copy it as code</b><small>&lt;i&gt; tag, HTML + SVG, React, Vue or a web component, with your colours and motion</small></span><span class="wied-codefold-x" aria-hidden="true"></span></summary>' : '') +
          '<div class="wied-code">' +
            '<div class="wied-code-head"><p class="wied-l">Copy the code</p><div class="wied-ctabs" role="tablist" aria-label="Code format">' +
              [['tag', '&lt;i&gt; tag'], ['html', 'HTML + SVG'], ['react', 'React'], ['vue', 'Vue'], ['web', 'Web component']].map(function (c) { return '<button type="button" role="tab" data-code="' + c[0] + '" aria-selected="false" tabindex="-1">' + c[1] + '</button>' }).join('') +
            '</div></div>' +
            '<label class="wied-flat" data-flat-wrap hidden><input type="checkbox" data-flat><span class="wied-flat-ui" aria-hidden="true"></span><span>Flat colours <small>write the hex values into the SVG instead of CSS variables</small></span></label>' +
            '<div class="wied-codebox"><pre><code data-code-out></code></pre><button type="button" class="wied-copy" data-do="copy-code">' + G.copy + '<span>Copy</span></button></div>' +
            '<details class="wied-setup" data-setup><summary><span>First time? Show setup</span><small>one line for your page’s &lt;head&gt;</small></summary>' +
              '<p class="wied-setup-hint"><b>First time?</b> Add this line once inside your page’s <code>&lt;head&gt;</code> <span class="wied-soon">launching soon</span></p>' +
              '<div data-setup-lines></div>' +
              '<p class="wied-setup-more">Prefer not to add anything? <button type="button" class="wied-link" data-do="copy-svg">Copy the SVG code</button> instead: it works anywhere, today.</p>' +
            '</details>' +
          '</div>' + (opts.codeFold ? '</details>' : '') +
        '</div>' +
        '<p class="visually-hidden" aria-live="polite" data-live></p>'
      built = true
      // the Colours panel in the Look pane (hosts with their own Look tab, like the library drawer, mount one there instead)
      if (ownPanel) ownPanel.destroy()
      ownPanel = opts.colorsPanel === false ? null : colorPanel($('[data-cpanel]', root))
      // "Turn into": Before's and After's own Colours panels (After's only shows when it has colours of its own)
      swPanels.forEach(function (p) { p.destroy() })
      swPanels = [colorPanel($('[data-sw-acp]', root), 'a'), colorPanel($('[data-sw-bcp]', root), 'b')]
      // the Download panel (hosts that place their own, like the library drawer, pass downloads: false and mount one)
      if (ownDl) ownDl.destroy()
      var dh = $('[data-dl-host]', root)
      ownDl = dh ? downloadPanel(dh, { anchor: D.getElementById('download') ? '' : 'download', quick: opts.dlQuick === false ? false : undefined, title: opts.dlTitle }) : null
      selectTab(S.tab, false)
      paintStyleIcons()
      buildPresets()
      buildSwap()
      // offscreen: pause the preview's endless animations (battery on phones); they resume when scrolled back
      if (offIO) offIO.disconnect()
      offIO = watchOffscreen($('[data-canvas]', root))
      $$('input[type=range][data-range]', root).forEach(function (r) {
        r.addEventListener('input', function () { var k = r.getAttribute('data-range'), v = +r.value; var p = {}; p[k] = v; set(p, { soft: true }) })
      })
      $$('input[type=range][data-sw-range]', root).forEach(function (r) {
        r.addEventListener('input', function () { swRangeInput(r.getAttribute('data-sw-range'), +r.value) })
      })
      $('[data-flat]', root).addEventListener('change', function (e) { set({ flat: e.target.checked }) })
      var q = $('[data-q]', root), qt
      q.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { searchIcons(q.value) }, 120) })
      q.addEventListener('keydown', function (e) {
        // ArrowDown from the field moves into the results
        if (e.key === 'ArrowDown') { var f = $('[data-results] button', root); if (f) { e.preventDefault(); f.focus() } }
      })
    }
    var swPanels = [], ownDl = null
    function swRangeInput(k, v) {
      if (k === 'dur') { SW.dur = clamp(v, SW_DUR[0], SW_DUR[1]); SW.speed = '' }
      else if (k === 'delay') SW.delay = clamp(v, SW_DELAY[0], SW_DELAY[1])
      else if (k === 'hold') SW.hold = clamp(v, SW_HOLDR[0], SW_HOLDR[1])
      swSave(); swChanged(true)
    }
    // a swap setting changed: everything that is drawn from SW repaints (live copies keep their on / off state)
    var swRaf = 0
    function swChanged(soft) {
      if (!soft) { cancelAnimationFrame(swRaf); swRaf = 0; render(); return }
      if (swRaf) return
      swRaf = requestAnimationFrame(function () { swRaf = 0; render() })
    }

    /* ───────── the "Turn into" pane ───────── */
    function radios(attr, list, labelId, cls) {
      return '<div class="' + (cls || 'wied-seg') + '" role="radiogroup" aria-labelledby="' + labelId + '">' +
        list.map(function (x) { return '<button type="button" role="radio" ' + attr + '="' + x[0] + '" aria-checked="false" tabindex="-1">' + esc(x[1]) + '</button>' }).join('') + '</div>'
    }
    function swRange(k, label, min, max, step) {
      return '<label class="wied-range" data-sw-rw="' + k + '"><span class="wied-l"><span data-sw-rl="' + k + '">' + label + '</span> <output data-sw-out="' + k + '"></output></span>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-sw-range="' + k + '"></label>'
    }
    function formTab(k) {
      return '<button type="button" role="tab" class="wsw-form is-' + k + '" id="' + uid + '-sf-' + k + '" data-sw-form="' + k + '" aria-controls="' + uid + '-sfp" aria-selected="false" tabindex="-1">' +
        '<span class="wsw-form-i" data-sw-fi="' + k + '" aria-hidden="true"></span>' +
        '<span class="wsw-form-t"><small>' + (k === 'a' ? 'Before' : 'After') + '</small><b data-sw-fn="' + k + '"></b><span data-sw-fs="' + k + '"></span></span></button>'
    }
    function swapPaneHtml(list) {
      var L = function (s) { return uid + '-' + s }
      return '<div class="wied-pane wsw" role="tabpanel" id="' + L('p-swap') + '" aria-labelledby="' + L('t-swap') + '" data-pane="swap" hidden>' +
        '<p class="wied-note" data-sw-note></p>' +
        '<div class="wied-f wsw-pick">' +
          '<p class="wied-l" id="' + L('sgl') + '">Turns into <small data-sw-sgl></small></p>' +
          '<div class="wied-sugg" role="group" aria-labelledby="' + L('sgl') + '" data-sugg></div>' +
          '<div class="wied-q"><label class="visually-hidden" for="' + L('q') + '">Search every icon to turn into</label><input type="search" id="' + L('q') + '" data-q placeholder="Search all icons, e.g. check" autocomplete="off" spellcheck="false" aria-describedby="' + L('qh') + '"></div>' +
          '<p class="visually-hidden" id="' + L('qh') + '">Results appear below. Press the down arrow to reach them.</p>' +
          '<div class="wied-results" data-results role="list" aria-label="Icons to turn into"></div>' +
        '</div>' +
        '<div class="wsw-body" data-sw-body hidden>' +
          '<div class="wsw-forms" role="tablist" aria-label="Before and after">' + formTab('a') +
            '<span class="wsw-arrow" aria-hidden="true"><span class="wsw-arrow-i">' + G.arrow + '</span><small data-sw-fxl></small></span>' + formTab('b') + '</div>' +
          '<div class="wsw-fpane" role="tabpanel" id="' + L('sfp') + '" data-sw-fp>' +
            '<div data-sw-fa>' +
              '<div class="wied-f"><p class="wied-l" id="' + L('sal') + '">Style <small>the same as in Look</small></p><div class="wied-styles" role="radiogroup" aria-labelledby="' + L('sal') + '">' +
                list.map(function (s) { var f = info(s); return '<button type="button" role="radio" class="wied-st" data-st="' + s + '" aria-checked="false" style="--sc:var(--c-' + s + ', ' + f.hex + ')" title="' + esc(f.title) + '"><span class="wied-st-i" data-st-i="' + s + '"></span><span class="wied-st-n">' + esc(f.title) + '</span></button>' }).join('') +
              '</div></div>' +
              '<div class="wied-f" data-sw-acp hidden></div>' +
              '<div class="wied-f" data-sw-amono><p class="wied-l" id="' + L('acl') + '">Colour <small>the same as in Look</small></p>' + monoHtml('a', L('acl')) + '</div>' +
            '</div>' +
            '<div data-sw-fb hidden>' +
              '<div class="wied-f"><p class="wied-l" id="' + L('bsl') + '">Style <small data-sw-bsay></small></p><div class="wied-styles wsw-bst" role="radiogroup" aria-labelledby="' + L('bsl') + '" data-sw-bst></div></div>' +
              '<div class="wied-f"><button type="button" role="switch" class="wsw-link" data-sw-link aria-checked="true"><span class="wsw-link-ui" aria-hidden="true"></span><span class="wsw-link-t"><b>Same colours as before</b><small data-sw-linksay></small></span></button></div>' +
              '<div data-sw-bown hidden>' +
                '<div class="wied-f" data-sw-bcp hidden></div>' +
                '<div class="wied-f" data-sw-bmono><p class="wied-l" id="' + L('bcl') + '">Colour <small>for the second icon</small></p>' + monoHtml('b', L('bcl')) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="wied-f"><p class="wied-l" id="' + L('el') + '">Effect <small>how it changes</small></p><div class="wsw-fxs" role="radiogroup" aria-labelledby="' + L('el') + '" data-effects></div></div>' +
          '<div class="wied-f"><p class="wied-l" id="' + L('tl') + '">When does it switch?</p>' + radios('data-sw-trig', TRIGGERS, L('tl'), 'wied-seg wsw-trig') + '<p class="wsw-say" data-sw-say></p></div>' +
          '<div class="wied-f"><p class="wied-l" id="' + L('spl') + '">Speed <small data-sw-durl></small></p>' + radios('data-sw-speed', SPEEDS, L('spl'), 'wied-seg is-3') + '</div>' +
          '<details class="wied-more wsw-adv" data-sw-adv><summary>Fine-tune the timing</summary><div class="wsw-advin">' +
            swRange('dur', 'Duration', SW_DUR[0], SW_DUR[1], 0.05) +
            '<div><p class="wied-l" id="' + L('ezl') + '">Feel <small data-sw-ezsay></small></p>' + radios('data-sw-ease', EASES, L('ezl'), 'wied-chips wsw-eases') + '</div>' +
            '<div class="wied-sliders">' + swRange('delay', 'Wait before', SW_DELAY[0], SW_DELAY[1], 0.05) + swRange('hold', 'Pause on each', SW_HOLDR[0], SW_HOLDR[1], 0.1) + '</div>' +
          '</div></details>' +
          '<div class="wied-swap-act">' +
            '<button type="button" class="wied-mini is-ink" data-sw-play>' + G.play.replace(/width="20" height="20"/, 'width="16" height="16"') + '<span>Play</span></button>' +
            '<button type="button" class="wied-mini" data-sw-toggle><span>Switch</span></button>' +
            '<button type="button" class="wied-mini" data-sw-reset>' + RESET_I + '<span>Reset</span></button>' +
            '<button type="button" class="wied-mini is-quiet" data-swap-clear><span>Remove</span></button>' +
          '</div>' +
        '</div>' +
      '</div>'
    }
    function layer(k, title, inner) {
      if (!opts.layers) return inner
      return '<details class="wied-layer" data-layer="' + k + '"><summary><span class="wied-layer-t"><b>' + title + '</b><small data-layer-sum="' + k + '"></small></span><span class="wied-layer-x" aria-hidden="true"></span></summary><div class="wied-layer-in">' + inner + '</div></details>'
    }
    function range(k, label, min, max, step, unit) {
      return '<label class="wied-range" data-range-wrap="' + k + '"><span class="wied-l">' + label + ' <output data-out="' + k + '"></output></span>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-range="' + k + '" data-unit="' + unit + '"></label>'
    }
    var G = {
      copy: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5 V6 A2.5 2.5 0 0 0 13 3.5 H6 A2.5 2.5 0 0 0 3.5 6 V13 A2.5 2.5 0 0 0 6 15.5 H8.5"/></svg>',
      down: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3.5 V15 M7 10.5 L12 15.5 L17 10.5 M4.5 19.5 H19.5"/></svg>',
      play: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 4.8 V19.2 L19 12 Z"/></svg>',
      code: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17"/></svg>',
      film: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M10 9.5 V14.5 L14.5 12 Z"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>'
    }
    function paintStyleIcons() {
      // a host that hides the Look pane (the library drawer has its own style strip) must not pull in every style
      // files: there the icon's own page (every style, ~110 KB) fills the "Before" style chips instead
      var lookHidden = !!($('[data-pane="look"]', root) || {}).hidden
      var draw = function (el, s) { el.innerHTML = buildSvg(I.name, s, { size: 22, mode: 'live', full: true }); el.removeAttribute('data-wait') }
      var missing = []
      $$('[data-st-i]', root).forEach(function (el) {
        var s = el.getAttribute('data-st-i')
        if (innerOf(I.name, s) != null) draw(el, s)
        else { el.setAttribute('data-wait', ''); missing.push([el, s]) }
      })
      if (!missing.length) return
      var name = I.name
      fetchIconPage(name).then(function () {
        if (name !== I.name) return
        missing.forEach(function (m) {
          if (innerOf(name, m[1]) != null) draw(m[0], m[1])
          else if (!lookHidden) loadStyleData(m[1]).then(function () { if (name === I.name && innerOf(name, m[1]) != null) draw(m[0], m[1]) })
        })
      })
    }
    var presetKey = ''
    // "Moves in parts": what each tagged part of this drawing does (forge/MOTION.md "Parts choreography"), so it is clear
    // that only the object plays the move: a backdrop breathes on its own loop and a shadow stays on the ground
    var DECO_SAY = { breathe: 'breathe in place, on their own loop', float: 'drift gently, on their own loop', twinkle: 'twinkle, on their own loop', still: 'keep still' }
    function renderParts(mi) {
      var f = $('[data-partsf]', root); if (!f) return
      var pt = parts(), on = S.anim !== 'none' && !!mi && mi.preset !== 'draw' && pt.any && !(swapReady() && swapTarget())
      f.hidden = !on
      $('[data-decof]', root).hidden = !(on && pt.deco)
      $$('[data-deco]', root).forEach(function (b) { b.setAttribute('aria-pressed', (b.getAttribute('data-deco') || '') === (S.deco || '')) })
      if (!on) return
      var sp = spec(), P = (mi.own && sp.parts) || {}, mv = PRESETS[mi.preset].label.toLowerCase()
      var rows = [['obj', I.title, mv]]
      var plate = function (k, nm) {
        var q = P[k], p = q && PRESETS[q.preset] ? q.preset : mi.preset
        if (!q) return [k.toLowerCase(), nm, 'moves with it']
        return [k.toLowerCase(), nm, (p === mi.preset ? mv : PRESETS[p].label.toLowerCase()) + (q.delay > 0 ? ', a beat behind' : '') + (q.amount != null && q.amount > (mi.k || 1) ? ', a little more' : '')]
      }
      if (pt.a) rows.push(plate('A', 'Moving part'))
      if (pt.s) rows.push(plate('S', 'Badge'))
      if (pt.deco) rows.push(['deco', 'Decorations', DECO_SAY[S.deco === 'still' ? 'still' : decoKind(mi.preset, mi.own ? sp.deco : null)]])
      if (pt.shadow) rows.push(['shadow', 'Shadow', GROUND.indexOf(mi.preset) >= 0 ? 'stays on the ground and shrinks as it lifts' : 'moves with it'])
      $('[data-parts-say]', root).textContent = 'in ' + info(S.style).title
      $('[data-parts]', root).innerHTML = rows.map(function (r) { return '<li class="is-' + r[0] + '"><i aria-hidden="true"></i><b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span></li>' }).join('')
    }
    function buildPresets() {
      var box = $('[data-presets]', root); if (!box) return
      var key = I.name + '|' + S.style + '|' + S.color + '|' + S.bg + '|' + colorKey() + '|' + S.deco
      if (key === presetKey) return
      presetKey = key
      var o = presetsOrdered()
      var chip = function (p, own) {
        var mi = motionAttrs(entryFor(p), { trigger: 'hover', stroked: info(S.style).stroked, deco: S.deco })
        return '<button type="button" class="wied-pchip wm-trigger' + (own ? ' is-own' : '') + '" data-preset="' + p + '" aria-pressed="false"><span class="wied-pchip-i ' + (mi ? mi.cls : '') + '" style="' + (mi ? mi.style : '') + '">' + buildSvg(I.name, S.style, { size: 20, mode: 'live' }) + '</span><span>' + esc(PRESETS[p].label) + '</span></button>'
      }
      box.innerHTML = '<div class="wied-pgroup"><p class="wied-sub">Made for ' + esc(I.title) + '</p><div class="wied-pchips">' + o.own.map(function (p) { return chip(p, true) }).join('') + '</div></div>' +
        '<details class="wied-more"><summary>All ' + PRESET_LIST.length + ' moves</summary><div class="wied-pchips">' + o.rest.map(function (p) { return chip(p, false) }).join('') + '</div></details>'
      prepareDraw(box)
    }
    function fxLabel(e) { for (var i = 0; i < EFFECTS.length; i++) if (EFFECTS[i][0] === e) return EFFECTS[i][1]; return 'Fade' }
    // suggested targets from the icon's motion spec ("name" or "name@style"), each with its own effect
    function buildSwap() {
      var box = $('[data-sugg]', root); if (!box) return
      var sw = (spec().swap || []).slice(0, 4)
      $('[data-sw-sgl]', root).textContent = sw.length ? 'made for ' + I.title + ', or search below' : 'search for any icon'
      if (!sw.length) { box.innerHTML = '<p class="wied-empty">No suggestions for ' + esc(I.title) + ' yet. Search for any icon below.</p>'; return }
      box.innerHTML = sw.map(function (x) {
        var parts = String(x.to).split('@'), n = parts[0]
        var label = parts[1] ? iconTitle(n) + ' · ' + info(parts[1]).title : iconTitle(n)
        return '<button type="button" class="wied-sg" data-swap="' + esc(x.to) + '" data-swap-fx="' + esc(x.effect || 'fade') + '" aria-pressed="false">' +
          '<span class="wied-sg-a" data-thumb="' + esc(I.name) + '" aria-hidden="true"></span>' + G.arrow + '<span class="wied-sg-b" data-thumb="' + esc(x.to) + '" aria-hidden="true"></span>' +
          '<span class="wied-sg-t"><b>' + esc(label) + '</b><small>' + esc(fxLabel(x.effect || 'fade')) + '</small></span></button>'
      }).join('')
      // thumbnails may need another style's drawing: paint them when the "Turn into" pane is shown (selectTab does)
      if (S.tab === 'swap') paintThumbs(box)
    }
    function paintThumbs(scope) {
      $$('[data-thumb]', scope).forEach(function (el) {
        var parts = el.getAttribute('data-thumb').split('@'), n = parts[0], st = parts[1]
        var draw = function () {
          var style = st || (n === I.name ? S.style : 'line')
          var inner = st ? innerOf(n, st) : (n === I.name ? innerOf(n, S.style) : thumbInner(n))
          if (inner != null) el.innerHTML = buildSvg(n, style, { size: 22, mode: 'live', full: true }) || ('<svg viewBox="0 0 24 24" width="22" height="22"' + attrStr(rootFor(style)) + '>' + inner + '</svg>')
          return inner != null
        }
        if (!draw()) (st ? fetchIconPage(n).then(function (ok) { return ok && innerOf(n, st) != null ? true : loadStyleData(st) }) : loadStyleData('line')).then(draw)
      })
    }
    function searchIcons(q) {
      var box = $('[data-results]', root); q = (q || '').trim().toLowerCase()
      if (!q) { box.innerHTML = ''; return }
      var paint = function (names) {
        names = names.filter(function (n) { return n !== I.name }).slice(0, 8)
        box.innerHTML = names.length ? names.map(function (n) { return '<div role="listitem"><button type="button" class="wied-res" data-swap="' + esc(n) + '" aria-pressed="false" title="' + esc(iconTitle(n)) + '"><span data-thumb="' + esc(n) + '" aria-hidden="true"></span><small>' + esc(iconTitle(n)) + '</small></button></div>' }).join('') : '<p class="wied-empty">No icon matches “' + esc(q) + '”. Try another word, like arrow, heart or check.</p>'
        paintThumbs(box)
        paintSwapPicks()
        say(names.length ? names.length + ' icons found.' : 'No icon matches ' + q + '.')
      }
      loadMeta().then(function () {
        var hits = null
        try { if (W.WI && W.WI.search) hits = (W.WI.search(q, { limit: 12 }) || []).map(function (h) { return h.name }) } catch (e) { }
        if (!hits || !hits.length) hits = ((W.WITH && W.WITH.icons) || []).map(function (i) { return i.name }).filter(function (n) { return n.indexOf(q.replace(/\s+/g, '-')) >= 0 })
        paint(hits)
      })
    }
    // choose what the icon turns into ("name" or "name@style"), with a suggestion's own effect; plays it once so the
    // choice is visible right away (the shared state is reset to Before first, so the very first switch animates)
    function chooseTarget(to, fx) {
      var parts = String(to).split('@'), n = parts[0]
      if (!n || n === SW.to && (parts[1] || '') === SW.toStyle) return
      clearTimeout(demoT)
      SW.to = n; SW.toStyle = parts[1] && parts[1] !== S.style ? parts[1] : ''
      if (fx) SW.effect = fx
      SW.on = false; SW.paused = false; SW.go = false
      render()
      var t = swapTarget()
      say(I.title + ' now turns into ' + t.label + '.')
      if (SW.trigger !== 'auto') setTimeout(function () { if (swapReady() && SW.to === n) playDemo() }, 420)
    }
    function paintSwapPicks() {
      var cur = SW.to + (SW.toStyle ? '@' + SW.toStyle : '')
      $$('[data-swap]', root).forEach(function (b) { var v = b.getAttribute('data-swap'); b.setAttribute('aria-pressed', v === cur || (!SW.toStyle && v === SW.to) ? 'true' : 'false') })
    }
    // roving tabindex + aria-checked for a radiogroup of [attr] buttons
    function paintRadios(attr, value, scope) {
      var list = $$('[' + attr + ']', scope || root), any = false
      list.forEach(function (b) { var on = b.getAttribute(attr) === value; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; any = any || on })
      if (!any && list[0]) list[0].tabIndex = 0
    }
    function setSwRange(k, v, txt, hidden) {
      var w = $('[data-sw-rw="' + k + '"]', root); if (!w) return
      w.hidden = !!hidden
      var r = $('[data-sw-range]', w), out = $('[data-sw-out]', w)
      if (D.activeElement !== r) r.value = v
      r.setAttribute('aria-valuetext', txt)
      r.style.setProperty('--p', clamp((v - r.min) / (r.max - r.min) * 100, 0, 100) + '%')
      out.textContent = txt
    }
    function secs(v) { return (Math.round(v * 100) / 100) + ' s' }
    function formSay(k, t) {
      var st = k === 'a' ? S.style : t.style, multi = isMulti(st, k === 'a' ? I.name : t.name)
      var c = k === 'a' ? cstate() : (SW.link ? cstate() : bstate(t.name)), mono = k === 'a' || SW.link ? S.color : bstate(t.name).color
      var col = multi ? (c.pal ? c.palName : hasCustom(c) ? 'your colours' : 'as drawn') : mono === 'ink' ? 'black' : mono === 'style' ? info(st).title + ' colour' : String(mono).toUpperCase()
      if (k === 'b' && SW.link) col = 'same colours'
      return info(st).title + ' · ' + col
    }
    // the tiny mini swap in each effect chip: Before and After at 22 px, alternating with that effect (CSS loop)
    var fxKey = ''
    function paintEffects(t) {
      var box = $('[data-effects]', root); if (!box) return
      var bc = bColors(t), inkB = SW.link ? null : (bc.mono === 'ink' ? null : colorHex(t.style, bc.mono)), inkA = S.color === 'ink' ? null : colorHex()
      var a = buildSvg(I.name, S.style, { size: 22, mode: 'live', full: true, ink: inkA })
      var b = buildSvg(t.name, t.style, { size: 22, mode: 'live', colors: bc.cz, ink: inkB, full: true })
      var key = a + b + forced
      if (key !== fxKey) {
        fxKey = key
        box.innerHTML = EFFECTS.map(function (e) {
          return '<button type="button" role="radio" class="wsw-fx" data-fx="' + e[0] + '" aria-checked="false" tabindex="-1">' +
            '<span class="wsw-fx-i" aria-hidden="true"><span class="wm-swap wm-loop wm-fx-' + e[0] + (forced ? ' wm-force' : '') + '"><span class="wm-a">' + a + '</span><span class="wm-b">' + b + '</span></span></span>' +
            '<span class="wsw-fx-n">' + esc(e[1]) + '</span></button>'
        }).join('')
      }
      paintRadios('data-fx', swEffect(), box)
    }
    // After's style chips: "Same as before" + every style, each drawn with After in that style when its drawing is here
    var bstKey = ''
    function paintBStyles(t) {
      var box = $('[data-sw-bst]', root); if (!box) return
      var list = styleList(), key = t.name + '|' + S.style + '|' + list.join(',') + '|' + list.map(function (s) { return innerOf(t.name, s) != null ? 1 : 0 }).join('') + '|' + JSON.stringify(bColors(t))
      if (key !== bstKey) {
        bstKey = key
        var bc = bColors(t)
        var one = function (s, same) {
          var f = info(s), inner = innerOf(t.name, s)
          var ic = inner != null ? buildSvg(t.name, s, { size: 22, mode: 'live', full: true, colors: isMulti(s, t.name) ? (SW.link ? colorsFor(s, t.name) : colorsFor(s, t.name, bstate(t.name))) : null }) : ''
          return '<button type="button" role="radio" class="wied-st' + (same ? ' is-same' : '') + '" data-bst="' + (same ? '' : s) + '" aria-checked="false" tabindex="-1" style="--sc:var(--c-' + s + ', ' + f.hex + ')" title="' + esc(same ? 'Same style as before (' + f.title + ')' : f.title) + '">' +
            '<span class="wied-st-i"' + (inner == null ? ' data-wait' : '') + '>' + ic + '</span><span class="wied-st-n">' + esc(same ? 'Same as before · ' + f.title : f.title) + '</span></button>'
        }
        box.innerHTML = one(S.style, true) + list.map(function (s) { return one(s, false) }).join('')
        if (bc && list.some(function (s) { return innerOf(t.name, s) == null })) fetchIconPage(t.name).then(function (ok) { if (ok && built) { bstKey = ''; paintBStyles(swapTarget() || t) } })
      }
      paintRadios('data-bst', SW.toStyle, box)
      $('[data-sw-bsay]', root).textContent = SW.toStyle ? info(SW.toStyle).title : 'same as before'
    }
    function renderSwap() {
      var pane = $('[data-pane="swap"]', root); if (!pane) return
      var t = swapTarget(), touch = touchMq.matches
      $('[data-sw-note]', root).textContent = t ? (I.title + ' turns into ' + t.label + '. Pick how it looks before and after, how it changes and when.') :
        'Show a different icon when someone ' + (touch ? 'taps' : 'clicks') + ', hovers or focuses it, or let it switch on its own. Great for play and pause, like, show and hide, menu and close.'
      paintSwapPicks()
      var body = $('[data-sw-body]', root)
      body.hidden = !t
      if (!t) return
      if (pane.hidden) return   // the rest is drawn when the pane is shown (selectTab renders)
      var ready = swapReady()
      // Before / After tabs
      var form = SW.form === 'b' ? 'b' : 'a'
      $$('[data-sw-form]', root).forEach(function (b) { var on = b.getAttribute('data-sw-form') === form; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
      $('[data-sw-fp]', root).setAttribute('aria-labelledby', uid + '-sf-' + form)
      $('[data-sw-fa]', root).hidden = form !== 'a'
      $('[data-sw-fb]', root).hidden = form !== 'b'
      var bc = bColors(t)
      var fia = $('[data-sw-fi="a"]', root), fib = $('[data-sw-fi="b"]', root)
      var ha = buildSvg(I.name, S.style, { size: 40, mode: 'live', full: true, ink: S.color === 'ink' ? null : colorHex() })
      var hb = ready ? buildSvg(t.name, t.style, { size: 40, mode: 'live', colors: bc.cz, full: true, ink: bc.mono === 'ink' ? null : colorHex(t.style, bc.mono) }) : '<span class="wcp-skel"></span>'
      if (fia._h !== ha) { fia.innerHTML = ha; fia._h = ha }
      if (fib._h !== hb) { fib.innerHTML = hb; fib._h = hb }
      $('[data-sw-fn="a"]', root).textContent = I.title
      $('[data-sw-fn="b"]', root).textContent = t.title
      $('[data-sw-fs="a"]', root).textContent = formSay('a', t)
      $('[data-sw-fs="b"]', root).textContent = formSay('b', t)
      $('[data-sw-fxl]', root).textContent = fxLabel(swEffect()) + '\n' + secs(swDur())
      // Before: the icon's own colour controls; After: its style chips, the link switch, its own colours when unlinked
      var multiA = isMulti()
      $('[data-sw-amono]', root).hidden = multiA
      paintBStyles(t)
      var link = $('[data-sw-link]', root)
      link.setAttribute('aria-checked', SW.link ? 'true' : 'false')
      $('[data-sw-linksay]', root).textContent = SW.link ? 'After wears Before’s ' + (multiA || isMulti(t.style, t.name) ? 'palette' : 'colour') + '. Turn off to colour it on its own.' : 'After has colours of its own.'
      $('[data-sw-bown]', root).hidden = SW.link
      $('[data-sw-bmono]', root).hidden = SW.link || isMulti(t.style, t.name)
      // effect, trigger, speed, fine-tuning
      if (ready) paintEffects(t)
      paintRadios('data-sw-trig', SW.trigger)
      var tr = TRIGGERS.filter(function (x) { return x[0] === SW.trigger })[0]
      $('[data-sw-say]', root).textContent = tr ? (SW.trigger === 'hover' && touch ? 'Shows the second icon while hovered with a mouse. On this device, a tap switches it.' : tr[2]) + (SW.trigger === 'auto' && reducedMq.matches && !forced && !SW.go ? ' Your device asks for less motion, so it waits for Play.' : '') : ''
      paintRadios('data-sw-speed', SW.speed)
      $('[data-sw-durl]', root).textContent = secs(swDur()) + (SW.speed ? '' : ' · custom')
      paintRadios('data-sw-ease', SW.ease)
      $('[data-sw-ezsay]', root).textContent = SW.ease === 'natural' ? fxLabel(swEffect()) + '’s own' : ''
      setSwRange('dur', swDur(), secs(swDur()))
      $('[data-sw-rl="delay"]', root).textContent = SW.trigger === 'auto' ? 'Wait before starting' : 'Wait before switching'
      setSwRange('delay', SW.delay, SW.delay ? secs(SW.delay) : 'none')
      setSwRange('hold', SW.hold, secs(SW.hold), SW.trigger !== 'auto')
      paintSwapState()
    }
    // the parts that follow on / off (and paused): Play / Switch labels, the preview's label, hint and pressed state
    function paintSwapState() {
      if (!built) return
      var t = swapTarget(), ready = swapReady(), auto = SW.trigger === 'auto', touch = touchMq.matches
      var pb = $('[data-sw-play]', root)
      if (pb) {
        pb.disabled = !ready
        $('span', pb).textContent = auto ? (autoHeld() ? 'Play' : 'Pause') : 'Play once'
        var tb = $('[data-sw-toggle]', root); tb.disabled = !ready
        $('span', tb).textContent = SW.on ? 'Switch back' : t ? 'Switch to ' + t.title : 'Switch'
        $('[data-sw-reset]', root).disabled = !t
      }
      var art = $('[data-art]', root); if (!art) return
      if (t) {
        var verb = touch ? 'Tap' : 'Click'
        art.setAttribute('aria-label', SW.trigger === 'click' ? (I.title + ' turns into ' + t.title + '. ' + verb + ' to switch') :
          auto ? (I.title + ' turns into ' + t.title + ' on its own. ' + verb + ' to ' + (autoHeld() ? 'play' : 'pause')) :
          SW.trigger === 'hover' ? (I.title + ' turns into ' + t.title + ' on hover' + (touch ? '. Tap to switch' : '')) : (I.title + ' turns into ' + t.title + ' while focused'))
        $('[data-hint]', root).textContent = SW.trigger === 'click' ? verb + ' the icon to switch' : auto ? (autoHeld() ? 'Paused · press Play' : 'Switching on its own · ' + verb.toLowerCase() + ' to pause') :
          SW.trigger === 'hover' ? (touch ? 'Tap the icon to switch' : 'Hover the icon to switch') : (touch ? 'Tap the icon to focus it' : 'Click or Tab to the icon to switch')
      }
    }

    /* ───────── tabs ───────── */
    function selectTab(t, focus) {
      S.tab = t
      $$('[role=tab][data-tab]', root).forEach(function (b) { var on = b.getAttribute('data-tab') === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus() })
      $$('[data-pane]', root).forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== t })
      var on = $('[role=tab][aria-selected="true"]', root), ink = $('.wied-tab-ink', root)
      if (on && ink) { ink.style.width = on.offsetWidth + 'px'; ink.style.transform = 'translateX(' + on.offsetLeft + 'px)' }
      if (t === 'swap') { var b = $('[data-sugg]', root); if (b) paintThumbs(b); renderSwap(); if ($('[data-st-i][data-wait]', root)) paintStyleIcons() }
      if (t === 'look' && $('[data-st-i][data-wait]', root)) paintStyleIcons()
    }

    /* ───────── render ───────── */
    var lastArt = '', lastCK = ''
    function render(o) {
      if (!built) return
      o = o || {}
      var f = info(S.style), hexNow = colorHex()
      root.setAttribute('data-bg', S.bg)
      root.style.setProperty('--sc', 'var(--c-' + S.style + ', ' + f.hex + ')')
      root.style.setProperty('--sc-on', 'var(--c-' + S.style + '-on, ' + onColor(f.hex) + ')')
      root.className = root.className.replace(/s-[a-z]+/g, '').trim() + ' s-' + S.style
      root.style.setProperty('--ic', previewColor())
      // style + colour controls
      $$('[data-st]', root).forEach(function (b) { var on = b.getAttribute('data-st') === S.style; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1 })
      var sayEl = $('[data-style-say]', root); if (sayEl) sayEl.textContent = f.title + (f.say ? ' · ' + f.say : '')
      paintMono()
      // multi-colour styles: every colour + palettes replace the single colour row
      var multi = isMulti()
      $('[data-monof]', root).hidden = multi
      panels.forEach(function (p) { p.update() })
      var ck = colorKey()
      if (ck !== lastCK) { lastCK = ck; paintStyleIcons() }
      var cz = multi ? colorsFor() : null
      var fw = $('[data-flat-wrap]', root); fw.hidden = !(cz && S.code === 'html'); $('[data-flat]', root).checked = !!S.flat
      $$('[data-bg]', root).forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', b.getAttribute('data-bg') === S.bg) })
      setRange('size', S.size, S.size + ' px')
      var sw = f.sw, sr = $('[data-range-wrap="stroke"]', root)
      sr.classList.toggle('is-off', !sw)
      $('[data-range="stroke"]', root).disabled = !sw
      setRange('stroke', S.stroke != null ? S.stroke : (sw || 1.75), sw ? (S.stroke != null ? S.stroke : sw) + ' px' : 'fixed')
      setRange('speed', S.speed, S.speed + '×')
      setRange('amount', S.amount, S.amount + '×')
      var lf = $('[data-layer-sum="fine"]', root); if (lf) lf.textContent = S.size + ' px · ' + (sw ? (S.stroke != null ? S.stroke : sw) + ' line' : 'fixed line') + ' · ' + ({ light: 'light', dark: 'dark', brand: 'tinted' })[S.bg] + ' background'
      var lp = $('[data-layer-sum="pace"]', root); if (lp) lp.textContent = (S.speed === 1 ? 'normal speed' : S.speed + '× speed') + ' · ' + (S.amount === 1 ? 'normal intensity' : S.amount + '× intensity')
      $$('[data-anim]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-anim') === S.anim) })
      var mi = motionInfo(S.anim === 'none' ? 'loop' : S.anim)
      var cur = S.preset || (motionInfo(S.anim === 'none' ? 'loop' : S.anim) || {}).preset
      $$('[data-preset]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-preset') === cur) })
      renderParts(mi)
      var it = $('[data-intent]', root), sp = spec()
      it.innerHTML = '<b>' + esc(I.title) + '</b> ' + esc(sp.intent || 'moves gently to draw the eye') + '.'
      $('[data-reduced]', root).hidden = !(reducedMq.matches && !forced)
      // "Turn into": fetch After's drawing when needed, then everything drawn from SW
      var t = swapTarget()
      if (t && !swapReady()) ensureB(t.name, t.want)
      renderSwap()
      // preview: the markup only changes with the drawing; on / off is a class (syncSwaps)
      var art = $('[data-art]', root)
      if (o.replay) art._wk = ''
      paintLive(art, { px: 120, trigger: S.anim })
      var touch = touchMq.matches
      if (t && swapReady()) paintSwapState()
      else {
        art.setAttribute('aria-label', t ? 'Getting ' + t.title + ' ready' : 'Replay the animation')
        $('[data-hint]', root).textContent = t ? 'Getting ' + t.title + ' ready…' : S.anim === 'hover' ? (touch ? 'Tap the preview to play' : 'Hover the preview to play') : S.anim === 'once' ? 'Plays once · press Replay' : S.anim === 'none' ? 'Still · pick a movement in Motion' : 'Moving · ' + PRESETS[(mi || {}).preset || 'pop'].label
      }
      syncAuto()
      $('[data-replay]', root).hidden = S.anim === 'none'
      var sz = $('[data-sizes]', root)
      sz.setAttribute('aria-label', I.title + ' at 16, 24, 32, 48 and 64 pixels')
      sz.innerHTML = [16, 24, 32, 48, 64].map(function (p) { return '<figure' + (p === S.size ? ' class="is-cur"' : '') + '>' + buildSvg(I.name, S.style, { size: p, mode: 'live' }) + '<figcaption>' + p + '</figcaption></figure>' }).join('')
      // code
      $$('[data-code]', root).forEach(function (b) { var on = b.getAttribute('data-code') === S.code; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1 })
      $('[data-code-out]', root).innerHTML = hl(codeFor(S.code))
      $('[data-setup-lines]', root).innerHTML = setupLines().map(function (l, i) { return '<button type="button" class="wied-line" data-line="' + i + '"><code>' + esc(l) + '</code>' + G.copy + '<span class="visually-hidden">Copy this line</span></button>' }).join('')
      buildPresets()
      dlPanels.forEach(function (p) { p.update() })
      if (place) place.render()
      if (remember) store(KEY, { style: S.style, color: S.color, size: S.size, px: S.px, bg: S.bg, anim: S.anim, speed: S.speed, amount: S.amount, deco: S.deco, code: S.code, flat: S.flat })
      if (!o.silent) emit()
    }
    function setRange(k, v, txt) {
      var r = $('[data-range="' + k + '"]', root), out = $('[data-out="' + k + '"]', root)
      if (r && D.activeElement !== r) r.value = v
      if (r) { r.setAttribute('aria-valuetext', txt); var p = (v - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', clamp(p, 0, 100) + '%') }
      if (out) out.textContent = txt
    }
    function emit() {
      var st = get()
      subs.forEach(function (fn) { try { fn(st, api) } catch (e) { if (W.console) console.error(e) } })
      if (opts.onChange) try { opts.onChange(st, api) } catch (e) { if (W.console) console.error(e) }
      try { host.dispatchEvent(new CustomEvent('wied:change', { bubbles: true, detail: { state: st } })) } catch (e) { }
    }
    function get() {
      var o = {}; for (var k in S) o[k] = S[k]
      o.name = I.name; o.title = I.title; o.hex = colorHex(); o.colorName = colorName(); o.styleTitle = info(S.style).title; o.styleHex = info(S.style).hex
      o.motion = motionInfo(); o.intent = spec().intent || ''
      o.colors = colorsInfo(); o.colorsKey = colorKey()
      // "Turn into": the whole swap (legacy fields swapTo / swapFx / swapOn kept for hosts written against 1.0)
      var t = swapTarget()
      o.swap = t ? { to: t.name, title: t.title, fromStyle: S.style, toStyle: t.style, sameStyle: !SW.toStyle, link: SW.link, effect: swEffect(),
        speed: SW.speed, duration: swDur(), ease: SW.ease, easing: swEaseCss(), delay: SW.delay, hold: SW.hold, cycle: swCycle(), trigger: SW.trigger,
        on: SW.on, paused: SW.paused, held: autoHeld(), ready: swapReady(), vars: swVars(), fromColors: { color: S.color, colors: isMulti() ? colorsFor() : null },
        toColors: (function () { var bc = bColors(t); return { color: bc.mono, colors: bc.cz } })() } : null
      o.swapTo = t ? SW.to + (SW.toStyle ? '@' + SW.toStyle : '') : ''; o.swapFx = SW.effect; o.swapOn = SW.on
      o.swapKey = t ? JSON.stringify([o.swapTo, SW.link, SW.link ? 0 : bstate(t.name), SW.effect, swDur(), SW.ease, SW.delay, SW.hold, SW.trigger, swapReady()]) : ''
      return o
    }
    function set(patch, o) {
      o = o || {}
      // swap settings: patch.swap = { to, toStyle, link, effect, speed, duration, ease, delay, hold, trigger, on } (and the
      // 1.0 names swapTo 'name[@style]' / swapFx / swapOn)
      var sp = patch.swap || {}, swDirty = false
      if ('swapTo' in patch) sp.to = patch.swapTo
      if ('swapFx' in patch) sp.effect = patch.swapFx
      if ('swapOn' in patch) sp.on = patch.swapOn
      if ('to' in sp) {
        var parts = String(sp.to || '').split('@')
        if (parts[0] !== SW.to || (parts[1] || '') !== SW.toStyle) { SW.to = parts[0]; SW.toStyle = parts[1] && parts[1] !== S.style ? parts[1] : ''; SW.on = false; SW.paused = false; SW.go = false; swDirty = true }
        if (!SW.to) { SW.toStyle = ''; SW.effect = ''; stopAuto() }
      }
      if ('toStyle' in sp) { SW.toStyle = sp.toStyle && sp.toStyle !== S.style ? sp.toStyle : ''; swDirty = true }
      if ('link' in sp) { SW.link = !!sp.link; swDirty = true }
      if ('effect' in sp) { SW.effect = EFFECTS.some(function (e) { return e[0] === sp.effect }) ? sp.effect : ''; swDirty = true }
      if ('speed' in sp && SPEEDS.some(function (x) { return x[0] === sp.speed })) { SW.speed = sp.speed; SW.dur = null; swDirty = true }
      if ('duration' in sp) { SW.dur = sp.duration == null ? null : clamp(+sp.duration || 0.3, SW_DUR[0], SW_DUR[1]); if (SW.dur != null) SW.speed = ''; swDirty = true }
      if ('ease' in sp && EASES.some(function (x) { return x[0] === sp.ease })) { SW.ease = sp.ease; swDirty = true }
      if ('delay' in sp) { SW.delay = clamp(+sp.delay || 0, SW_DELAY[0], SW_DELAY[1]); swDirty = true }
      if ('hold' in sp) { SW.hold = clamp(+sp.hold || SW_HOLD, SW_HOLDR[0], SW_HOLDR[1]); swDirty = true }
      if ('trigger' in sp && TRIGGERS.some(function (x) { return x[0] === sp.trigger })) { SW.trigger = sp.trigger; SW.on = false; SW.paused = false; SW.go = false; swDirty = true }
      if (swDirty) swSave()
      if ('on' in sp && !!sp.on !== SW.on) { SW.on = !!sp.on; if (!swDirty && Object.keys(patch).length === ('swap' in patch ? 1 : 0) + ('swapOn' in patch ? 1 : 0)) { applyOn(); return } }
      var styleChanged = patch.style && patch.style !== S.style
      for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k) && k in S) S[k] = patch[k]
      if (styleChanged) { S.stroke = null; presetKey = '' }
      if ('color' in patch || 'bg' in patch) presetKey = ''
      if (styleChanged && innerOf(I.name, S.style) == null) return ensureStyle(S.style).then(function () { paintStyleIcons(); render(o) })
      render(o)
      if (styleChanged && !reducedMq.matches) {
        var a = $('[data-art]', root)
        if (a && a.animate) a.animate([{ transform: 'scale(.82) rotate(-8deg)', opacity: 0.3 }, { transform: 'scale(1.04) rotate(1deg)', opacity: 1, offset: 0.6 }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }
      if (patch.style || patch.anim || patch.preset || patch.speed || patch.amount) announce()
    }
    function announce() { var l = $('[data-live]', root); if (l) l.textContent = info(S.style).title + ', ' + colorName() + (S.anim === 'none' ? ', still' : ', ' + PRESETS[(motionInfo() || { preset: 'pop' }).preset].label + ' ' + (S.anim === 'loop' ? 'on a loop' : S.anim === 'hover' ? 'on hover' : 'once')) }
    function replay() {
      var w = $('[data-art] .wm', root); if (!w) return
      if (S.anim === 'hover') { w.classList.remove('wm-hover'); w.classList.add('wm-once'); w.style.animation = 'none'; void w.offsetWidth; w.style.animation = ''; setTimeout(function () { w.classList.remove('wm-once'); w.classList.add('wm-hover') }, (motionInfo('hover') || { dur: 1 }).dur * 1000 + 80); return }
      w.style.animation = 'none'; $$('*', w).forEach(function (x) { x.style.animation = 'none' }); void w.offsetWidth; w.style.animation = ''; $$('*', w).forEach(function (x) { x.style.animation = '' })
    }

    /* ───────── code output ───────── */
    function motionTagCls(mi) { return mi ? ' ' + mi.cls : '' }
    // code for an inline SVG playing the icon's own parts motion: data-wm + icons.css carry the spec (slot, plates, decorations);
    // only what the visitor changed (speed, intensity, decorations kept still) goes inline
    function ownCode(mi) { return !!(mi && mi.own) }
    function ownList(mi) { return Object.keys(mi.ownVars || {}).map(function (k) { return k + ': ' + mi.ownVars[k] }) }
    function wrapOpen(mi, jsx) {
      if (ownCode(mi)) return '<span ' + (jsx ? 'className' : 'class') + '="' + mi.cls + '" data-wm="' + I.name + '"'
      return '<span ' + (jsx ? 'className' : 'class') + '="' + mi.cls + '"'
    }
    function styleAttr(parts) { parts = parts.filter(Boolean); return parts.length ? ' style="' + parts.join('; ') + '"' : '' }
    function varsList(mi) { return mi ? Object.keys(mi.vars).map(function (k) { return k + ': ' + mi.vars[k] }) : [] }
    function setupLines() {
      var lines = ['<link rel="stylesheet" href="' + CDN + '/web/dist/classes/with-' + S.style + '.css">']
      // CSS-only icons paint palettes from a data URI that CSS variables cannot reach: custom colours need the tiny runtime
      var tb = swapReady() ? swapTarget() : null, bcz = tb ? bColors(tb).cz : null
      if (S.code === 'tag' && ((isMulti() && colorsFor()) || bcz)) lines.push('<script src="' + CDN + '/web/dist/classes/with-icons.js" defer></script>')
      if (S.anim !== 'none' || swapTarget()) lines.push('<link rel="stylesheet" href="' + CDN + '/motion/dist/motion.css">')
      if (S.code !== 'tag' && !swapReady() && ownCode(motionInfo())) lines.push('<link rel="stylesheet" href="' + CDN + '/motion/dist/icons.css">')
      return lines
    }
    function codeFor(kind) {
      var n = I.name, st = S.style, mi = motionInfo(), t = swapReady() ? swapTarget() : null
      // a swap pair is never animated part by part: the whole-icon form of the motion
      if (t && ownCode(mi)) mi = motionAttrs(currentEntry(mi.trigger), { trigger: mi.trigger, speed: S.speed, amount: S.amount, stroked: info(S.style).stroked })
      var cz = isMulti(st) ? colorsFor(st) : null
      var col = cz && cz.ink ? cz.ink : S.color === 'ink' ? null : colorHex()
      var cvars = cz ? Object.keys(cz.vars).map(function (k) { return k + ': ' + cz.vars[k] }) : []
      var sub = st === 'line' ? '' : '/' + st
      var C = comp(n)
      // "Turn into": both forms with their own style and colours, the wrapper with the effect, the trigger and the timing
      var fx = swEffect(), trig = SW.trigger, sv = t ? swVars() : {}, bc = t ? bColors(t) : null
      var colB = bc ? (bc.cz && bc.cz.ink ? bc.cz.ink : bc.mono === 'ink' ? null : colorHex(t.style, bc.mono)) : null
      var bvars = bc && bc.cz ? Object.keys(bc.cz.vars).map(function (k) { return k + ': ' + bc.cz.vars[k] }) : []
      var wrapCls = 'wm-swap wm-fx-' + fx + (trig === 'auto' ? ' wm-swap-auto' : trig === 'focus' ? ' wm-swap-focus' : '')
      var svList = Object.keys(sv).map(function (k) { return k + ': ' + sv[k] })
      var label = esc(I.title), autoLabel = t ? esc(I.title + ' turning into ' + t.title) : ''
      var trigNote = t ? (trig === 'hover' ? '<!-- shows ' + esc(t.title) + ' while hovered or keyboard-focused. Touch screens have no hover: pick "Click or tap" for anything that must work on phones -->\n' :
        trig === 'focus' ? '<!-- shows ' + esc(t.title) + ' while this button (or a field inside its .wm-trigger) has focus -->\n' :
        trig === 'auto' ? '<!-- turns into ' + esc(t.title) + ' and back on its own; stops for visitors who prefer reduced motion -->\n' : '') : ''
      // the element around the pair, by trigger (auto: no control, the pair is a picture)
      var open = function (ind) {
        if (trig === 'auto') return ''
        if (trig === 'click') return ind + '<button class="wm-trigger" type="button" aria-pressed="false" aria-label="' + label + '"\n' + ind + '        onclick="this.setAttribute(\'aria-pressed\', this.getAttribute(\'aria-pressed\') !== \'true\')">\n'
        return ind + '<button class="wm-trigger" type="button" aria-label="' + label + '">\n'
      }
      var close = function (ind) { return trig === 'auto' ? '' : '\n' + ind + '</button>' }
      var wrapAttrs = function (extra) { return ' class="' + wrapCls + '"' + (trig === 'auto' ? ' role="img" aria-label="' + autoLabel + '"' : '') + styleAttr((extra || []).concat(svList)) }
      if (kind === 'tag') {
        var cls = function (nm, s2) { return 'with with-' + nm + (s2 === 'line' ? '' : ' with-' + s2) }
        var fs = S.size !== 24 ? 'font-size: ' + S.size + 'px' : ''
        // CSS-only tags paint palettes from a data URI that CSS variables can't reach: say so instead of implying they work
        var palNote = cz || (bc && bc.cz) ? '\n<!-- custom colours: with CSS only, tags keep the default palette. Add with-icons.js from the setup lines below and these colours apply -->' : ''
        if (t) {
          var ind = trig === 'auto' ? '' : '  '
          return trigNote + open('') + ind + '<span' + wrapAttrs([fs]) + '>\n' +
            ind + '  <i class="' + cls(n, st) + ' wm-a"' + styleAttr([col ? 'color: ' + col : ''].concat(cvars)) + '></i>\n' +
            ind + '  <i class="' + cls(t.name, t.style) + ' wm-b"' + styleAttr([colB ? 'color: ' + colB : ''].concat(bvars)) + '></i>\n' + ind + '</span>' + close('') + palNote
        }
        if (ownCode(mi)) mi = motionAttrs(currentEntry(mi.trigger), { trigger: mi.trigger, speed: S.speed, amount: S.amount, stroked: info(S.style).stroked })
        var sty = styleAttr([col ? 'color: ' + col : '', fs].concat(cvars, varsList(mi)))
        return '<i class="' + cls(n, st) + motionTagCls(mi) + '"' + sty + '></i>' + (mi && mi.trigger === 'hover' ? '\n<!-- plays on hover. To play when a parent is hovered or focused, give that button or link class="wm-trigger".\n     Touch screens: tapping a button or link with class="wm-trigger" plays it (a bare <i> never gets :hover on iOS), or use the JS runtime: motion() from @withicons/motion -->' : '') + palNote
      }
      if (kind === 'html') {
        var svgA = buildSvg(n, st, { size: S.size, mode: 'code', flat: S.flat })
        var head = S.anim !== 'none' || t ? '<!-- motion: ' + CDN + '/motion/dist/motion.css -->\n' : ''
        if (t) {
          var svgB = buildSvg(t.name, t.style, { size: S.size, mode: 'code', flat: S.flat, colors: bc.cz, mono: bc.mono })
          var i2 = trig === 'auto' ? '' : '  '
          return head + trigNote + open('') + i2 + '<span' + wrapAttrs() + '>\n' + i2 + '  ' + svgA.replace('<svg ', '<svg class="wm-a" ') + '\n' + i2 + '  ' + svgB.replace('<svg ', '<svg class="wm-b" ') + '\n' + i2 + '</span>' + close('')
        }
        if (!mi) return svgA
        if (ownCode(mi)) return '<!-- motion: ' + CDN + '/motion/dist/motion.css + icons.css (data-wm plays ' + esc(I.title) + '’s own moves, part by part) -->\n' + wrapOpen(mi) + styleAttr(ownList(mi)) + '>\n  ' + svgA + '\n</span>'
        return head + '<span class="' + mi.cls + '"' + styleAttr(varsList(mi)) + '>\n  ' + svgA + '\n</span>'
      }
      var imports = function (fw) {
        var lines = ["import { " + C + " } from '@withicons/" + fw + sub + "'"]
        if (t) {
          var CT = comp(t.name), tsub = t.style === 'line' ? '' : '/' + t.style
          if (CT === C && tsub === sub) lines = ["import { " + C + " } from '@withicons/" + fw + sub + "'"]
          else if (tsub === sub) lines = ["import { " + C + ", " + CT + " } from '@withicons/" + fw + sub + "'"]
          else lines.push("import { " + CT + (CT === C ? ' as ' + CT + cap(t.style) : '') + " } from '@withicons/" + fw + tsub + "'")
        }
        if (mi || t) lines.push("import '@withicons/motion/motion.css'")
        if (!t && ownCode(mi)) lines.push("import '@withicons/motion/icons.css'   // " + I.title + "’s own moves, part by part (data-wm)")
        return lines.join('\n')
      }
      var bName = t ? (comp(t.name) === C && t.style !== st ? comp(t.name) + cap(t.style) : comp(t.name)) : ''
      var jsObj = function (o) { var k = Object.keys(o); return k.length ? '{{ ' + k.map(function (x) { return "'" + x + "': '" + o[x] + "'" }).join(', ') + ' }}' : '' }
      if (kind === 'react') {
        var sw0 = S.stroke != null && info(st).sw ? ' strokeWidth={' + S.stroke + '}' : ''
        var props = ' size={' + S.size + '}' + (col ? ' color="' + col + '"' : '') + sw0 + (cz && Object.keys(cz.vars).length ? ' style=' + jsObj(cz.vars) : '')
        var rvars = mi ? (ownCode(mi) ? mi.ownVars : mi.vars) : {}
        var rv = mi && Object.keys(rvars).length ? ' style={{ ' + Object.keys(rvars).map(function (k) { return "'" + k + "': '" + rvars[k] + "'" }).join(', ') + ' }}' : ''
        if (t) {
          var propsB = ' size={' + S.size + '}' + (colB ? ' color="' + colB + '"' : '') + (S.stroke != null && info(t.style).sw ? ' strokeWidth={' + S.stroke + '}' : '') + (bc.cz && Object.keys(bc.cz.vars).length ? ' style=' + jsObj(bc.cz.vars) : '')
          var wsty = Object.keys(sv).length ? ' style=' + jsObj(sv) : ''
          var pair = '<span className="' + wrapCls + '"' + wsty + (trig === 'auto' ? ' role="img" aria-label="' + autoLabel + '"' : '') + '>\n' +
            '        <' + C + ' className="wm-a"' + props + ' />\n        <' + bName + ' className="wm-b"' + propsB + ' />\n      </span>'
          if (trig === 'click') return "import { useState } from 'react'\n" + imports('react') + '\n\nexport function ' + C + 'Toggle() {\n  const [on, setOn] = useState(false)\n  return (\n    <button className="wm-trigger" type="button" aria-pressed={on} aria-label="' + I.title + '" onClick={() => setOn(!on)}>\n      ' + pair + '\n    </button>\n  )\n}'
          if (trig === 'auto') return imports('react') + '\n\n// turns into ' + t.title + ' and back on its own (stops for reduced motion)\nexport const ' + C + 'Swap = () => (\n  ' + pair.replace(/\n {6}/g, '\n  ').replace(/\n {8}/g, '\n    ') + '\n)'
          return imports('react') + '\n\n// shows ' + t.title + (trig === 'hover' ? ' on hover and keyboard focus' : ' while focused') + '\nexport const ' + C + 'Button = () => (\n  <button className="wm-trigger" type="button" aria-label="' + I.title + '">\n    ' + pair.replace(/\n {6}/g, '\n    ').replace(/\n {8}/g, '\n      ') + '\n  </button>\n)'
        }
        if (!mi) return imports('react') + '\n\nexport const Example = () => <' + C + props + ' />'
        return imports('react') + '\n\nexport const Example = () => (\n  ' + wrapOpen(mi, true) + rv + '>\n    <' + C + props + ' />\n  </span>\n)'
      }
      if (kind === 'vue') {
        var vp = ' :size="' + S.size + '"' + (col ? ' color="' + col + '"' : '') + (S.stroke != null && info(st).sw ? ' :stroke-width="' + S.stroke + '"' : '') + (cvars.length ? ' style="' + cvars.join('; ') + '"' : '')
        var vl = mi ? (ownCode(mi) ? ownList(mi) : varsList(mi)) : []
        var vs = vl.length ? ' style="' + vl.join('; ') + '"' : ''
        if (t) {
          var vpB = ' :size="' + S.size + '"' + (colB ? ' color="' + colB + '"' : '') + (S.stroke != null && info(t.style).sw ? ' :stroke-width="' + S.stroke + '"' : '') + (bvars.length ? ' style="' + bvars.join('; ') + '"' : '')
          var vpair = function (ind) { return ind + '<span' + wrapAttrs() + '>\n' + ind + '  <' + C + ' class="wm-a"' + vp + ' />\n' + ind + '  <' + bName + ' class="wm-b"' + vpB + ' />\n' + ind + '</span>' }
          if (trig === 'click') return '<script setup>\nimport { ref } from \'vue\'\n' + imports('vue') + '\nconst on = ref(false)\n</script>\n\n<template>\n  <button class="wm-trigger" type="button" :aria-pressed="on" aria-label="' + I.title + '" @click="on = !on">\n' + vpair('    ') + '\n  </button>\n</template>'
          if (trig === 'auto') return '<script setup>\n' + imports('vue') + '\n</script>\n\n<template>\n  <!-- turns into ' + t.title + ' and back on its own -->\n' + vpair('  ') + '\n</template>'
          return '<script setup>\n' + imports('vue') + '\n</script>\n\n<template>\n  <button class="wm-trigger" type="button" aria-label="' + I.title + '">\n' + vpair('    ') + '\n  </button>\n</template>'
        }
        return '<script setup>\n' + imports('vue') + '\n</script>\n\n<template>\n' + (mi ? '  ' + wrapOpen(mi) + vs + '>\n    <' + C + vp + ' />\n  </span>' : '  <' + C + vp + ' />') + '\n</template>'
      }
      if (kind === 'web') {
        var at = ' name="' + n + '"' + (st === 'line' ? '' : ' variant="' + st + '"') + (S.size !== 24 ? ' size="' + S.size + '"' : '')
        // the icon's own motion: no preset attribute, so with-icon[name] in icons.css plays it part by part
        if (mi) at += ' motion="' + mi.trigger + '"' + (ownCode(mi) && !t ? '' : ' preset="' + mi.preset + '"')
        if (t) {
          at += '\n  swap-to="' + t.name + (t.style !== st ? '@' + t.style : '') + '" swap-effect="' + fx + '" swap-trigger="' + trig + '"'
          var extra = []
          if (sv['--wm-swap-dur']) extra.push('swap-duration="' + parseFloat(sv['--wm-swap-dur']) + '"')
          if (SW.ease !== 'natural') extra.push('swap-ease="' + SW.ease + '"')
          if (SW.delay > 0) extra.push('swap-delay="' + round(SW.delay, 2) + '"')
          if (sv['--wm-swap-hold']) extra.push('swap-hold="' + parseFloat(sv['--wm-swap-hold']) + '"')
          if (colB && colB !== col) extra.push('swap-color="' + colB + '"')
          // After's own palette variables (linked: Before's palette mapped onto After's parts)
          if (bvars.length) extra.push('swap-colors="' + bvars.join('; ') + '"')
          if (extra.length) at += '\n  ' + extra.join(' ')
        }
        var ws = styleAttr([col ? 'color: ' + col : ''].concat(cvars, mi ? (ownCode(mi) && !t ? ownList(mi) : varsList(mi).filter(function (v) { return !/--wm-(ox|oy|dx|dy|steps)/.test(v) })) : []))
        return '<script type="module" src="' + CDN + '/web/dist/index.js"></script>\n' + (mi || t ? '<script type="module" src="' + CDN + '/motion/dist/element.js"></script>\n' : '') + '\n<with-icon' + at + (t ? '\n ' : '') + ' label="' + I.title + '"' + ws + '></with-icon>'
      }
      return ''
    }
    function hl(code) {
      if (W.WI && W.WI.highlight) { try { var h = W.WI.highlight(code); if (h) return h } catch (e) { } }
      var re = /(\/\/[^\n]*|<!--[\s\S]*?-->)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(import|from|export|const|function|return|setup)\b|(<\/?[A-Za-z][\w.-]*)/g
      var out = '', last = 0, m
      while ((m = re.exec(code))) { out += esc(code.slice(last, m.index)); out += '<span class="' + (m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : 'tk-t') + '">' + esc(m[0]) + '</span>'; last = re.lastIndex }
      return out + esc(code.slice(last))
    }

    /* ───────── animated SVG (self-contained) ───────── */
    // the motion a downloaded file plays. A file used as an image (<img>, Notion, a README, a CSS background) is never
    // hovered, so "On hover" exports its hover move on a loop; a GIF cannot play "once" either, so it loops too.
    function exportMotion(gif) {
      var trig = S.anim === 'none' ? 'loop' : S.anim
      if (trig === 'hover' || (gif && trig === 'once')) return motionAttrs(currentEntry('hover'), { trigger: 'loop', speed: S.speed, amount: S.amount, stroked: info(S.style).stroked, deco: S.deco }) || motionInfo('loop')
      return motionInfo(trig)
    }
    function exportLabel() {
      var mi = exportMotion(), t = swapTarget()
      if (t && swapReady()) return 'turns into ' + t.title.toLowerCase() + ' and back, ' + fxLabel(swEffect()).toLowerCase()
      return PRESETS[mi.preset].label.toLowerCase() + (mi.trigger === 'once' ? ', once' : ' on a loop')
    }
    function animatedSvg() {
      var mi = exportMotion(), p = PRESETS[mi.preset], t = swapTarget()
      var trig = mi.trigger
      var it = trig === 'loop' ? 'infinite' : '1'
      var vars = '--wm-k:' + mi.k + ';--wm-dx:' + (mi.vars['--wm-dx'] != null ? mi.vars['--wm-dx'] : 1) + ';--wm-dy:' + (mi.vars['--wm-dy'] != null ? mi.vars['--wm-dy'] : 0) + ';'
      var origin = (mi.vars['--wm-ox'] || '50%') + ' ' + (mi.vars['--wm-oy'] || '50%')
      var timing = mi.steps ? 'steps(' + mi.steps + ')' : p.ease
      var anim = 'wm-' + p.name + ' ' + mi.dur + 's ' + timing + ' ' + it + ' both'
      var sel = p.name === 'draw' ? '.wm :is(path,circle,ellipse,line,polyline,polygon,rect)' : '.wm'
      var rule = (p.name === 'draw' ? sel + '{stroke-dasharray:80}' : '') + (trig === 'hover' ? 'svg:hover ' + sel : sel) + '{animation:' + anim + '}'
      var css = '.wm{' + vars + 'transform-box:view-box;transform-origin:' + origin + '}@keyframes wm-' + p.name + '{' + kfText(p) + '}' + rule
      var body = innerOf(I.name, S.style)
      if (t && swapReady()) {
        // no motion runtime on the page: a hover swap with the chosen timing (the runtime's export loops A -> B -> A)
        var fx = FX[swEffect()] || FX.fade, rootB = rootFor(t.style, S.stroke), rootA = rootFor(S.style, S.stroke), bc = bColors(t), d = swDur()
        var tr = 'transition:opacity ' + round(d * 0.55, 2) + 's ease ' + SW.delay + 's,transform ' + d + 's ' + (swEaseCss() || 'cubic-bezier(.34,1.45,.64,1)') + ' ' + SW.delay + 's'
        css += '.wa,.wb{transform-box:view-box;transform-origin:50% 50%;' + tr + '}.wb{opacity:0' + (fx[1] ? ';transform:' + fx[1] : '') + '}svg:hover .wa,svg:focus .wa{opacity:0' + (fx[0] ? ';transform:' + fx[0] : '') + '}svg:hover .wb,svg:focus .wb{opacity:1;transform:none}'
        var innerB = resolveVars(bakeColors(innerOf(t.name, t.style), bc.cz)).replace(/currentColor/g, colorHex(t.style, bc.mono))
        body = '<g class="wa"' + attrStr(rootA) + '>' + body + '</g><g class="wb"' + attrStr(rootB).replace(/currentColor/g, colorHex(t.style, bc.mono)) + '>' + innerB + '</g>'
      }
      css += '@media (prefers-reduced-motion:reduce){.wm,.wm *{animation:none!important}}'
      return buildSvg(I.name, S.style, { size: S.size, mode: 'file', head: '<style>' + css + '</style>', body: '<g class="wm">' + body + '</g>' })
    }

    function exportOpts(mi) {
      var o = { trigger: mi.trigger, preset: mi.preset, duration: mi.dur, amount: mi.k }
      if (mi.origin) o.origin = mi.origin
      if (mi.dir != null) o.dir = mi.dir
      if (mi.steps) o.steps = mi.steps
      // parts: the icon's own plates and decoration loop come from its spec; "Keep still" holds the decorations
      if (mi.own && I.motion) o.spec = Object.assign({}, I.motion, mi.deco === 'still' ? { deco: 'still' } : {})
      else if (mi.deco === 'still') o.spec = { deco: 'still' }
      return o
    }
    function animatedExport() {
      var m = WM(), mi = exportMotion(), t = swapTarget()
      if (m && m.animatedSvg) {
        try {
          var file = buildSvg(I.name, S.style, { size: S.size, mode: 'file' })
          if (t && swapReady()) { var F = swapFiles(S.size); return m.animatedSwapSvg(F.a, F.b, swapOpts()) }
          return m.animatedSvg(file, exportOpts(mi))
        } catch (e) { }
      }
      return animatedSvg()
    }
    /* ───────── actions ───────── */
    function fname(st, ext, px, extra) { return I.name + (st === 'line' ? '' : '-' + st) + (extra ? '-' + extra : '') + (px ? '-' + px : '') + '.' + ext }
    var actions = {
      downloadSvg: function (st) { st = st || S.style; var txt = buildSvg(I.name, st, { size: S.size, mode: 'file', hex: colorHex(st) }); saveBlob(new Blob([txt], { type: 'image/svg+xml' }), fname(st, 'svg')); toast('Downloaded ' + fname(st, 'svg')) },
      downloadPng: function (st) {
        st = st || S.style
        return toPng(buildSvg(I.name, st, { size: S.px, mode: 'file', hex: colorHex(st) }), S.px).then(function (r) { saveBlob(r.blob, fname(st, 'png', S.px)); toast('Downloaded ' + fname(st, 'png', S.px)) }, function () { toast('Couldn’t make the PNG. Try SVG.') })
      },
      copySvg: function (st) { st = st || S.style; return copyText(buildSvg(I.name, st, { size: 24, mode: 'code', flat: !!colorsFor(st), resolve: true })).then(function (ok) { toast(ok ? 'Copied ' + I.title + ' as SVG code. Paste it into Figma, Canva or HTML.' : 'Couldn’t reach the clipboard.') }) },
      copyImage: function (st) {
        st = st || S.style
        var file = buildSvg(I.name, st, { size: Math.max(S.px, 256), mode: 'file', hex: colorHex(st) })
        if (!(W.ClipboardItem && navigator.clipboard && navigator.clipboard.write && W.isSecureContext)) {
          return copyText(buildSvg(I.name, st, { size: 24, mode: 'file', hex: colorHex(st) })).then(function () { toast('Your browser can’t copy images, so we copied the SVG code. Use Download PNG for a picture.') })
        }
        var blobP = toPng(file, Math.max(S.px, 256)).then(function (r) { return r.blob })
        return navigator.clipboard.write([new W.ClipboardItem({ 'image/png': blobP })]).then(function () { toast('Copied ' + I.title + ' as an image. Paste it into Slides, Docs or Notion.') },
          function () { copyText(buildSvg(I.name, st, { size: 24, mode: 'file', hex: colorHex(st) })).then(function () { toast('Image copy was blocked, so we copied the SVG code instead.') }) })
      },
      downloadAnimated: function () {
        var mi = exportMotion(), t = swapTarget()
        var n = fname(S.style, 'svg', 0, t && swapReady() ? 'to-' + t.name : 'animated-' + mi.preset)
        saveBlob(new Blob([animatedExport()], { type: 'image/svg+xml' }), n)
        var sw = t && swapReady(), lab = PRESETS[mi.preset].label.toLowerCase()
        var say = sw ? 'turns into ' + t.title.toLowerCase() + ' and back on a loop (' + fxLabel(swEffect()).toLowerCase() + ', ' + secs(swDur()) + ', pausing ' + secs(SW.hold) + ' on each)' : 'plays ' + lab + (mi.trigger === 'once' ? ' once' : ' on a loop')
        toast('Downloaded ' + n + '. It ' + say + ' in browsers, Notion and web pages' + (S.anim === 'hover' && !sw ? ' (a file can’t sense hover, so it loops).' : '.'))
      },
      downloadGif: function () {
        var m = WM(); if (!m || !m.gif) return toast('GIF export needs the motion runtime on this page.')
        var mi = exportMotion(true), t = swapTarget(), px = clamp(S.px, 128, 512)
        var file = buildSvg(I.name, S.style, { size: px, mode: 'file' })
        var opts = t && swapReady() ? Object.assign({ swapTo: swapFiles(px).b }, swapOpts()) : exportOpts(mi)
        if (opts.trigger === 'hover' || opts.trigger === 'once') opts.trigger = 'loop'
        var bg = S.bg === 'dark' ? '#0D0F14' : S.bg === 'brand' ? mixHex(info(S.style).hex, '#FBF8F3', 0.22) : '#FFFFFF'
        var n = fname(S.style, 'gif', px, t && swapReady() ? 'to-' + t.name : mi.preset)
        toast('Making your GIF…')
        return m.gif(file, opts, { size: px, fps: 25, background: bg }).then(function (b) { saveBlob(b, n); toast('Downloaded ' + n + '. Drop it onto a slide: it plays in slideshow mode.') }, function () { toast('Couldn’t make the GIF in this browser. Try the animated SVG.') })
      },
      copyTag: function () { return copyText(codeFor('tag')).then(function (ok) { toast(ok ? 'Copied the <i> tag. Paste it into your HTML.' : 'Couldn’t reach the clipboard.') }) },
      copyCode: function (kind) {
        kind = kind || S.code
        var b = $('[data-do="copy-code"]', root)
        return copyText(codeFor(kind)).then(function (ok) {
          toast(ok ? 'Copied the ' + ({ tag: '<i> tag', html: 'HTML', react: 'React code', vue: 'Vue code', web: 'web component' })[kind] + '.' : 'Couldn’t reach the clipboard.')
          if (ok && b) { b.classList.add('is-done'); $('span', b).textContent = 'Copied'; clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('is-done'); $('span', b).textContent = 'Copy' }, 1500) }
        })
      },
      code: codeFor, animatedSvg: animatedExport, png: function (st, px) { st = st || S.style; px = px || S.px; return toPng(buildSvg(I.name, st, { size: px, mode: 'file', hex: colorHex(st) }), px) }
    }

    /* ───────── events ───────── */
    function onClick(e) {
      var b = e.target.closest('button, [data-art]'); if (!b || !root.contains(b)) return
      if (b.closest('.wied-cpanel, .wdl')) return   // the Colours and Download panels handle their own buttons
      var v
      if ((v = b.getAttribute('data-st'))) set({ style: v })
      else if (b.hasAttribute('data-mono-c')) setMono(b.closest('[data-mono]').getAttribute('data-mono'), b.getAttribute('data-mono-c'))
      else if ((v = b.getAttribute('data-anim'))) { set({ anim: v }); if (v !== 'none') setTimeout(replay, 20) }
      else if (b.hasAttribute('data-deco')) { set({ deco: b.getAttribute('data-deco') === 'still' ? 'still' : '' }); say(S.deco === 'still' ? 'Decorations keep still.' : 'Decorations move on their own.') }
      else if (b.hasAttribute('data-bg') && b.tagName === 'BUTTON') set({ bg: b.getAttribute('data-bg') })
      else if ((v = b.getAttribute('data-preset'))) { set({ preset: v, anim: S.anim === 'none' ? 'loop' : S.anim }); setTimeout(replay, 20) }
      else if ((v = b.getAttribute('data-px'))) set({ px: +v })
      // "Turn into"
      else if ((v = b.getAttribute('data-swap'))) chooseTarget(v, b.getAttribute('data-swap-fx'))
      else if ((v = b.getAttribute('data-fx'))) {
        // a new effect: switch back to Before, then play it once so the difference shows
        clearTimeout(demoT); SW.effect = v; var was = SW.on; SW.on = false; swChanged()
        if (SW.trigger !== 'auto') setTimeout(function () { playDemo() }, was ? 380 : 60)
        say(fxLabel(v) + ' effect.')
      }
      else if (b.hasAttribute('data-sw-form')) { SW.form = b.getAttribute('data-sw-form'); renderSwap() }
      else if (b.hasAttribute('data-bst')) { SW.toStyle = b.getAttribute('data-bst'); swChanged(); var tt = swapTarget(); if (tt) say(tt.title + ' in ' + info(tt.want).title + '.') }
      else if (b.hasAttribute('data-sw-link')) {
        SW.link = !SW.link
        // unlinking starts After from Before's colours, so nothing jumps; it then changes on its own
        var tl = swapTarget()
        if (!SW.link && tl) { var bs = bstate(tl.name), c = cstate(); if (!hasCustom(bs) && bs.color === 'ink') { bs.color = S.color; bs.pal = c.pal; bs.palName = c.palName; bs.roles = JSON.parse(JSON.stringify(c.roles)) } }
        swChanged(); say(SW.link ? 'After uses the same colours as before.' : 'After has colours of its own.')
      }
      else if ((v = b.getAttribute('data-sw-trig'))) { SW.trigger = v; SW.on = false; SW.paused = false; SW.go = false; clearTimeout(demoT); $$('[data-wsw-t]', root).concat(swHosts.map(function (h) { return h.el })).forEach(function (x) { x._wswOn = false }); swSave(); swChanged(); syncSwaps() }
      else if ((v = b.getAttribute('data-sw-speed'))) { SW.speed = v; SW.dur = null; swSave(); swChanged() }
      else if ((v = b.getAttribute('data-sw-ease'))) { SW.ease = v; swSave(); swChanged(); if (SW.trigger !== 'auto') { clearTimeout(demoT); SW.on = false; applyOn(); setTimeout(playDemo, 60) } }
      else if (b.hasAttribute('data-sw-play')) playDemo()
      else if (b.hasAttribute('data-sw-toggle')) { clearTimeout(demoT); toggleSwap() }
      else if (b.hasAttribute('data-sw-reset')) {
        clearTimeout(demoT); var keep = swapTarget()
        swReset(true); if (keep) delete BCS[keep.name]
        swSave(); swChanged(); say('Turn into settings reset.')
      }
      else if (b.hasAttribute('data-swap-clear')) { clearTimeout(demoT); stopAuto(); SW.to = ''; SW.toStyle = ''; SW.effect = ''; SW.on = false; SW.paused = false; SW.go = false; swChanged(); say('Turn into removed.'); var qf = $('[data-q]', root); if (qf) qf.focus() }
      else if (b.hasAttribute('data-art')) { if (!swapTarget() || !swapPress(b)) replay() }
      else if (b.hasAttribute('data-replay')) replay()
      else if (b.hasAttribute('data-force')) { forced = true; root.classList.add('is-forced'); presetKey = ''; fxKey = ''; render() }
      else if ((v = b.getAttribute('data-tab'))) selectTab(v)
      else if ((v = b.getAttribute('data-code'))) set({ code: v })
      else if (b.hasAttribute('data-line')) { var l = setupLines()[+b.getAttribute('data-line')]; copyText(l).then(function (ok) { toast(ok ? 'Copied. Add it once inside <head>.' : 'Couldn’t reach the clipboard.') }) }
      else if ((v = b.getAttribute('data-do'))) {
        if (v === 'copy-img') actions.copyImage(); else if (v === 'svg') actions.downloadSvg(); else if (v === 'png') actions.downloadPng()
        else if (v === 'anim') actions.downloadAnimated(); else if (v === 'gif') actions.downloadGif(); else if (v === 'copy-code') actions.copyCode(); else if (v === 'copy-svg') actions.copySvg()
      }
    }
    // single-choice groups: arrow keys move and choose within the group (radiogroup / tablist around the button)
    var KEYGROUPS = [['data-tab', function (v) { selectTab(v, true) }], ['data-code', function (v) { set({ code: v }) }], ['data-st', function (v) { set({ style: v }) }],
      ['data-bst'], ['data-fx'], ['data-sw-trig'], ['data-sw-speed'], ['data-sw-ease'], ['data-sw-form']]
    function onKey(e) {
      var t = e.target
      if (!t.getAttribute || t.tagName !== 'BUTTON') return
      for (var g = 0; g < KEYGROUPS.length; g++) {
        var attr = KEYGROUPS[g][0]
        if (!t.hasAttribute(attr)) continue
        var scope = t.closest('[role=radiogroup],[role=tablist]') || root
        var list = $$('button[' + attr + ']', scope), i = list.indexOf(t)
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
        if (e.key === 'Home') { d = -i } else if (e.key === 'End') { d = list.length - 1 - i }
        if (!d && e.key !== 'Home') return
        e.preventDefault()
        var n = list[(i + d + list.length) % list.length]
        if (KEYGROUPS[g][1]) KEYGROUPS[g][1](n.getAttribute(attr)); else n.click()
        var again = $('button[' + attr + '="' + n.getAttribute(attr) + '"]', scope.isConnected ? scope : root) || n
        again.focus()
        return
      }
    }
    function onInput(e) { onMonoInput(e, false) }
    function onChange(e) { onMonoInput(e, true) }
    function onKeyMono(e) { var t = e.target; if (e.key === 'Enter' && t.hasAttribute && t.hasAttribute('data-mono-hex')) { e.preventDefault(); onMonoInput(e, true); t.select() } }
    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onKey)
    root.addEventListener('keydown', onKeyMono)
    root.addEventListener('input', onInput)
    root.addEventListener('change', onChange)
    var unHost = addHost(root)
    var onMq = function () { fxKey = ''; render({ silent: true }) }
    if (reducedMq.addEventListener) reducedMq.addEventListener('change', onMq)
    var onResize = function () { selectTab(S.tab) }
    W.addEventListener('resize', onResize)
    var onVis = function () { if (D.visibilityState === 'visible') syncAuto() }
    D.addEventListener('visibilitychange', onVis)

    /* ───────── exports of a swap (animated files, other formats) ───────── */
    function swapFiles(px) {
      var t = swapTarget(), bc = bColors(t)
      return { a: buildSvg(I.name, S.style, { size: px, mode: 'file' }), b: buildSvg(t.name, t.style, { size: px, mode: 'file', colors: bc.cz, mono: bc.mono }), t: t }
    }
    function swapOpts() { return { effect: swEffect(), duration: swDur(), hold: SW.hold, ease: swEaseCss() || undefined } }
    /* the context the export formats (js/export/*.js, window.WithExport) take, with "Turn into" in ctx.swap:
       { name, title, style, inner, root, color, vars, motion, motionSpec,
         swap: { name, style, title, inner, root, color, vars, effect, duration, ease, delay, hold, cycle, trigger } | null } */
    function exportCtx() {
      var cz = isMulti() ? colorsFor() : null
      var mi = exportMotion(), t = swapReady() ? swapTarget() : null
      var ctx = { name: I.name, title: I.title, style: S.style, inner: innerOf(I.name, S.style), root: rootFor(S.style, S.stroke),
        color: (cz && cz.ink) || colorHex(), vars: cz ? cz.vars : {}, motionSpec: spec(),
        motion: mi ? exportOpts(mi) : null, swap: null }
      if (t) {
        var bc = bColors(t), bcz = bc.cz
        ctx.swap = { name: t.name, style: t.style, title: t.title, inner: innerOf(t.name, t.style), root: rootFor(t.style, S.stroke),
          color: (bcz && bcz.ink) || colorHex(t.style, bc.mono), vars: bcz ? bcz.vars : {}, effect: swEffect(), duration: swDur(), ease: swEaseCss(),
          delay: SW.delay, hold: SW.hold, cycle: swCycle(), trigger: SW.trigger }
        ctx.motion = Object.assign({}, ctx.motion || {}, { swapTo: t.name + '@' + t.style, effect: swEffect(), cycle: swCycle() })
      }
      return ctx
    }

    /* ───────── Download: every format in js/export/*.js, drawn from the editor's state ─────────
       downloadPanel(el, { quick }) mounts the panel into el: the studio's own, or a host's (the library drawer). The export
       scripts load on first use: the panel nearing the screen, a pointer or focus on it, or a press. Style, colours (palettes,
       After's own colours), stroke, motion and "Turn into" come from exportCtx(); the panel adds the file's own options:
       background (see-through by default), GIF edge colour, size, padding, and for animations the motion, frame rate and
       loops. Per-viewer choices are remembered in localStorage. */
    var dlPanels = []
    function pageHex() { return S.bg === 'dark' ? '#0D0F14' : S.bg === 'brand' ? mixHex(info(S.style).hex, '#FBF8F3', 0.22).toUpperCase() : '#FBF8F3' }
    function downloadPanel(el, po) {
      po = po || {}
      var id = uid + '-dl' + (dlPanels.length + 1)
      var sv = (remember ? store(DLKEY) : null) || {}
      var obj = function (v) { return v && typeof v === 'object' ? v : {} }
      var P = {
        group: DL_GROUPS.some(function (g) { return g.id === sv.group }) ? sv.group : 'slides', pick: obj(sv.pick),
        bg: /^(none|white|page|custom)$/.test(sv.bg) ? sv.bg : 'none', bgHex: isHex(sv.bgHex) ? sv.bgHex.toUpperCase() : '#2F5BFF',
        matte: /^(white|page|black|custom)$/.test(sv.matte) ? sv.matte : 'white', matteHex: isHex(sv.matteHex) ? sv.matteHex.toUpperCase() : '#FFFFFF',
        pad: obj(sv.pad), size: obj(sv.size), custom: {}, x2: !!sv.x2, motion: '', fps: obj(sv.fps), loop: [0, 1, 3].indexOf(sv.loop) >= 0 ? sv.loop : 0,
        loops: [1, 2, 3, 5].indexOf(sv.loops) >= 0 ? sv.loops : 1, adv: !!sv.adv, more: false, which: 'a', busy: 0, bkey: '', okey: '', akey: '', na: {}, t0: 0, tick: 0
      }
      function save() {
        if (!remember) return
        store(DLKEY, { adv: P.adv, group: P.group, pick: P.pick, bg: P.bg, bgHex: P.bgHex, matte: P.matte, matteHex: P.matteHex, pad: P.pad, size: P.size, x2: P.x2, fps: P.fps, loop: P.loop, loops: P.loops })
      }
      var X = function () { return W.WithExport || null }
      function desc(f) { var x = X(); return x && x.get ? x.get(f) : null }
      function groupOf(g) { for (var i = 0; i < DL_GROUPS.length; i++) if (DL_GROUPS[i].id === g) return DL_GROUPS[i]; return DL_GROUPS[0] }
      function idsOf(g) { g = groupOf(g); return g.ids.concat(g.code || []) }
      function isCode(f) { return (groupOf('web').code || []).indexOf(f) >= 0 }
      function kind(f) { return isCode(f) ? 'code' : DL_KIND[f] || null }
      function moving(f) { return DL_FRAMES.indexOf(f) >= 0 || f === 'animated-svg' || f === 'lottie' || f === 'dotlottie' }
      function tops(g) { var l = idsOf(g); return (DL_TOP[g] || l.slice(0, 3)).filter(function (x) { return l.indexOf(x) >= 0 }) }
      function cur() { var l = idsOf(P.group), f = P.pick[P.group]; return l.indexOf(f) >= 0 ? f : tops(P.group)[0] || l[0] }
      // can this browser make it? (only known once the scripts are here; until then everything looks available)
      function avail(f) {
        if (!exportReady()) return true
        if (f in P.na) return !P.na[f]
        var d = desc(f), ok = false
        try { ok = !!d && (!d.available || !!d.available()) } catch (e) { ok = false }
        P.na[f] = !ok
        return ok
      }
      function naWhy(f) {
        var b = browserName(), alt = { webm: 'MP4 or GIF', mp4: 'WebM or GIF', avif: 'WebP or PNG', webp: 'PNG', 'webp-animated': 'animated PNG or GIF' }[f]
        return b + ' can’t make ' + (DL_FMT[f] ? DL_FMT[f][0] : f) + ' files' + (alt ? '. Use ' + alt + ' instead.' : '. Try another format.')
      }
      // background: 'alpha' (see-through allowed), 'matte' (GIF: 1-bit, soft edges blended), 'solid' (no transparency), null (no choice)
      var webmAlpha = function () { return /Chrome\/|Edg\//.test((W.navigator && navigator.userAgent) || '') }
      function bgMode(f) {
        if (isCode(f)) return null
        var d = desc(f), t = d ? d.transparent : true
        if (f === 'webm' && !webmAlpha()) return 'solid'
        if (f === 'jpg' || f === 'eps' || f === 'mp4') return 'solid'
        return t === false ? 'solid' : t === '1-bit' || f === 'gif' ? 'matte' : 'alpha'
      }
      function bgVal(f) { var v = P.bg; if (bgMode(f) === 'solid' && v === 'none') v = 'white'; return v }
      function bgHex(f) { var v = bgVal(f); return v === 'none' ? null : v === 'white' ? '#FFFFFF' : v === 'page' ? pageHex() : P.bgHex }
      function matteHex() { return P.matte === 'white' ? '#FFFFFF' : P.matte === 'black' ? '#000000' : P.matte === 'page' ? pageHex() : P.matteHex }
      function sizeVal(k) {
        var z = DL_SIZE[k], v = +P.size[k]
        if (!(v >= z.min && v <= z.max)) v = k === 'raster' && S.px >= z.min && S.px <= z.max ? S.px : k === 'code' || k === 'vector' ? clamp(S.size, z.min, z.max) : z.def
        return v
      }
      function padDef(f) { return DL_FRAMES.indexOf(f) >= 0 || f === 'animated-svg' ? 'auto' : f === 'lottie' || f === 'dotlottie' ? '0.08' : '0' }
      function padVal(f) { var v = P.pad[kind(f) === 'anim' || f === 'animated-svg' ? 'anim' : f === 'lottie' || f === 'dotlottie' ? 'lottie' : 'still']; return v != null && (v === 'auto' ? padDef(f) === 'auto' : /^0(\.\d+)?$/.test(v)) ? v : padDef(f) }
      function padKey(f) { return kind(f) === 'anim' || f === 'animated-svg' ? 'anim' : f === 'lottie' || f === 'dotlottie' ? 'lottie' : 'still' }
      function fpsList(f) { return f === 'gif' ? [10, 15, 25, 50] : [12, 24, 30, 60] }
      function fpsVal(f) { var l = fpsList(f), k = f === 'gif' ? 'gif' : 'v', v = +P.fps[k]; return l.indexOf(v) >= 0 ? v : f === 'gif' ? 25 : 30 }
      // the motions a file can carry: "Turn into" (when set), the icon's loop, its hover move (looped: files can't sense hover)
      function motions(f) {
        var t = swapReady() ? swapTarget() : null, out = [], o = { trigger: 'loop', speed: S.speed, amount: S.amount, stroked: info(S.style).stroked, deco: S.deco }
        var lo = motionAttrs(currentEntry('loop'), Object.assign({ spec: S.preset ? null : I.motion, parts: parts().any }, o)), hv = motionAttrs(currentEntry('hover'), o)
        if (t) out.push(['swap', 'Turns into ' + t.title])
        if (lo) out.push(['loop', PRESETS[lo.preset].label])
        if (hv && (!lo || hv.preset !== lo.preset)) out.push(['hover', PRESETS[hv.preset].label + ' (hover move)'])
        if (f === 'lottie' || f === 'dotlottie') out.push(['still', 'Still'])
        return { list: out, mi: { loop: lo, hover: hv } }
      }
      function motionPick(f) {
        var l = motions(f).list.map(function (x) { return x[0] })
        if (l.indexOf(P.motion) >= 0) return P.motion
        return l.indexOf('swap') >= 0 ? 'swap' : S.anim === 'hover' && l.indexOf('hover') >= 0 ? 'hover' : 'loop'
      }
      function loopSecs(f) {
        var m = motionPick(f)
        if (m === 'swap') return swCycle()
        if (m === 'still') return 0
        var mi = motions(f).mi[m === 'hover' ? 'hover' : 'loop']
        return mi ? round(mi.dur, 2) : 0
      }
      function swapOn() { return swapReady() && !!swapTarget() }

      /* the ctx each format gets */
      function ctxFor(f) {
        var c = exportCtx()
        if (c.inner == null) return null
        if (isCode(f)) {
          // code keeps the page's real trigger (hover stays hover) and the swap, like the snippet box
          var mi = S.anim === 'none' ? null : motionInfo()
          c.motion = mi ? exportOpts(mi) : null
          if (c.swap) c.motion = Object.assign({}, c.motion || {}, { swapTo: c.swap.name + '@' + c.swap.style, effect: c.swap.effect, cycle: c.swap.cycle })
          return c
        }
        if (moving(f)) {
          var m = motionPick(f)
          if (m === 'swap' && c.swap && c.swap.inner) return c
          c.swap = null
          if (m === 'still') { c.motion = false; return c }
          var me = motions(f).mi[m === 'hover' ? 'hover' : 'loop']
          c.motion = me ? exportOpts(me) : null
          return c
        }
        var s = c.swap
        if (P.which === 'b' && s && s.inner) return { name: s.name, title: s.title, style: s.style, inner: s.inner, root: s.root, color: s.color, vars: s.vars || {}, motion: null, motionSpec: null, swap: null }
        c.swap = null; c.motion = null
        return c
      }
      // the icon in every style, in this icon's colours (PowerPoint: all styles)
      function allStyles() {
        var miss = styleList().filter(function (s) { return innerOf(I.name, s) == null })
        if (!miss.length) return Promise.resolve()
        return fetchIconPage(I.name).then(function (ok) { if (!ok || styleList().some(function (s) { return innerOf(I.name, s) == null })) return Promise.all(miss.map(loadStyleData)) })
      }
      function variants() {
        return styleList().filter(function (s) { return innerOf(I.name, s) != null }).map(function (s) {
          var cz = isMulti(s) ? colorsFor(s) : null, ink = (cz && cz.ink) || colorHex(s), r = rootFor(s, S.stroke), rr = {}
          for (var k in r) rr[k] = String(r[k]).replace(/currentColor/g, ink)
          return { style: s, title: info(s).title, inner: bakeColors(innerOf(I.name, s), cz).replace(/currentColor/g, ink), root: rr }
        })
      }
      function optsFor(f) {
        var o = {}, k = kind(f), z = k && DL_SIZE[k], bm = bgMode(f)
        if (z) { o[z.key] = sizeVal(k); if (z.x2 && P.x2) o.scale = 2 }
        if (bm) {
          o.background = bgHex(f)
          if (bm === 'matte' && !o.background) o.matte = matteHex()
          var pd = padVal(f); if (pd !== 'auto') o.padding = +pd
        }
        if (DL_FRAMES.indexOf(f) >= 0) { o.fps = fpsVal(f); if (f === 'webm' || f === 'mp4') o.loops = P.loops; else if (f !== 'png-sequence') o.loop = P.loop }
        if (moving(f) && motionPick(f) === 'still') o.static = true
        if (f === 'pptx-sheet') o.variants = variants()
        return o
      }
      // the four quick buttons: the most common downloads with sensible defaults
      var QUICK = {
        svg: { f: 'svg-flat', o: function () { return { size: S.size } } },
        png: { f: 'png', o: function () { return { size: S.px } } },
        pptx: { f: 'pptx', o: function () { return {} } },
        gif: { f: 'gif', o: function () { return { size: 256, fps: 25, matte: '#FFFFFF' } } }
      }

      /* ── markup ── */
      var GI = {
        slides: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M12 16.5V20M8.5 20h7M7 12.5l3-3 2.5 2 4-4.5"/></svg>',
        design: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3.5l6.5 9-6.5 8-6.5-8z"/><path d="M12 3.5v8"/><circle cx="12" cy="12.6" r="1.6"/></svg>',
        web: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 8.5h18M9.5 12.5l-2 2 2 2M14.5 12.5l2 2-2 2"/></svg>',
        animated: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M10 8.8v6.4l5.2-3.2z"/></svg>'
      }
      var FAM = { png: 'img', webp: 'img', jpg: 'img', avif: 'img', 'png-set': 'img', pptx: 'doc', 'pptx-sheet': 'doc', docx: 'doc', pdf: 'doc', eps: 'doc', 'svg-flat': 'vec', svg: 'vec',
        ico: 'app', 'favicon-pack': 'app', android: 'app', ios: 'app', lottie: 'mo', dotlottie: 'mo', gif: 'mo', apng: 'mo', 'webp-animated': 'mo', webm: 'mo', mp4: 'mo', 'animated-svg': 'mo', 'png-sequence': 'mo' }
      function shell() {
        var q = po.quick === false ? '' :
          '<div class="wdl-quick" role="group" aria-label="Quick downloads">' +
            '<button type="button" class="wdl-q is-copy" data-dlq="copy">' + G.copy + '<span><b>Copy image</b><small>paste into Slides, Docs, Notion</small></span></button>' +
            [['svg', 'SVG', 'sharp at any size', 'vec'], ['png', 'PNG', '', 'img'], ['pptx', 'PowerPoint', 'a ready slide', 'doc'], ['gif', 'GIF', '', 'mo']].map(function (x) {
              return '<button type="button" class="wdl-q" data-dlq="' + x[0] + '"><span class="wdl-badge is-' + x[3] + '" aria-hidden="true">' + (x[0] === 'pptx' ? 'PPTX' : x[1]) + '</span><span><b>' + x[1] + '</b><small data-dlq-l="' + x[0] + '">' + x[2] + '</small></span><i class="wdl-spin" aria-hidden="true"></i></button>'
            }).join('') +
          '</div>'
        return '<section class="wdl' + (po.quick === false ? ' no-quick' : '') + '"' + (po.anchor ? ' id="' + esc(po.anchor) + '"' : '') + ' aria-labelledby="' + id + '-h">' +
          '<div class="wdl-top"><h3 class="wdl-h" id="' + id + '-h">' + esc(po.title || 'Download') + '</h3><p class="wdl-sub">Any format, in your style and colours. <span class="wdl-chk" aria-hidden="true"></span>See-through background unless you pick one.</p></div>' + q +
          '<div class="wdl-groups" role="tablist" aria-label="Formats, by what you need them for">' + DL_GROUPS.map(function (g) {
            return '<button type="button" role="tab" class="wdl-g" id="' + id + '-g-' + g.id + '" data-dlg="' + g.id + '" aria-controls="' + id + '-p" aria-selected="false" tabindex="-1">' +
              '<span class="wdl-g-i">' + GI[g.id] + '</span><span class="wdl-g-t"><b>' + (g.id === 'animated' ? esc(g.title) : '<span class="wdl-for">For ' + esc(g.title.charAt(0).toLowerCase() + g.title.slice(1)) + '</span><span class="wdl-short">' + esc(g.title) + '</span>') + '</b><small>' + esc(g.say) + '</small></span></button>'
          }).join('') + '</div>' +
          '<div class="wdl-body" role="tabpanel" id="' + id + '-p" data-dl-body>' +
            '<p class="wdl-gsay" data-dl-gsay></p>' +
            '<div class="wdl-fcol"><div class="wdl-fmts" id="' + id + '-f" role="radiogroup" aria-label="Format" data-dl-fmts></div></div>' +
            '<div class="wdl-side">' +
              '<div class="wdl-prev"><div class="wdl-box" role="img" data-dl-box><span class="wdl-art" data-dl-art></span></div>' +
                '<div class="wdl-about"><p class="wdl-name"><span class="wdl-badge" data-dl-badge aria-hidden="true"></span><b data-dl-name></b></p><p class="wdl-note" data-dl-note></p><p class="wdl-aud" data-dl-aud></p></div></div>' +
              '<button type="button" class="wdl-adj" data-dl-adj aria-expanded="false" aria-controls="' + id + '-opts"><span class="wdl-adj-i" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg></span><span class="wdl-adj-t"><b>Options</b><small data-dl-adjsum></small></span><span class="wdl-adj-x" aria-hidden="true"></span></button>' +
              '<div class="wdl-opts" id="' + id + '-opts" data-dl-opts></div>' +
              '<div class="wdl-go">' +
                '<button type="button" class="wdl-dl" data-dl-go><span class="wdl-dl-i">' + G.down + '<i class="wdl-spin" aria-hidden="true"></i></span><span class="wdl-dl-t"><b data-dl-gol>Download</b><small id="' + id + '-sum" data-dl-sum></small></span><span class="wdl-bar" aria-hidden="true"></span></button>' +
                '<button type="button" class="wdl-copy" data-dl-copy hidden>' + G.copy + '<span>Copy</span></button>' +
              '</div>' +
              '<p class="wdl-warn" data-dl-warn hidden></p>' +
              '<p class="wdl-status" role="status" aria-live="polite" data-dl-status></p>' +
              '<div class="wdl-err" role="alert" data-dl-err hidden></div>' +
            '</div>' +
          '</div>' +
        '</section>'
      }
      el.innerHTML = shell()
      kitWatch(el)
      var sec = $('.wdl', el)
      function fmtBtn(f) {
        var d = DL_FMT[f] || [f, '', f.toUpperCase()], ok = avail(f)
        return '<button type="button" role="radio" class="wdl-f' + (ok ? '' : ' is-na') + '" data-dlf="' + f + '" aria-checked="false" tabindex="-1">' +
          '<span class="wdl-badge is-' + (isCode(f) ? 'code' : FAM[f] || 'img') + '" aria-hidden="true">' + d[2] + '</span>' +
          '<span class="wdl-f-t"><b>' + esc(d[0]) + '</b><small>' + esc(ok ? d[1] : 'Not in this browser') + '</small></span></button>'
      }
      function seg(name, label, items, value, cls) {
        var lid = id + '-o-' + name
        return '<div class="wdl-o' + (cls ? ' ' + cls : '') + '"><p class="wdl-l" id="' + lid + '">' + label + '</p><div class="wdl-seg" data-n="' + items.length + '" role="radiogroup" aria-labelledby="' + lid + '">' +
          items.map(function (x) {
            var on = String(x[0]) === String(value)
            return '<button type="button" role="radio" data-dl-o="' + name + '" data-v="' + esc(x[0]) + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '"' + (x[2] ? ' disabled title="' + esc(x[2]) + '"' : x[4] ? ' title="' + esc(x[4]) + '"' : '') + '>' +
              (x[3] ? '<span class="wdl-sw" style="background:' + x[3] + '" aria-hidden="true"></span>' : '') + esc(x[1]) + '</button>'
          }).join('') + '</div></div>'
      }
      function hexRow(name, value, label) {
        return '<div class="wdl-hexrow"><label class="wdl-pick"><input type="color" data-dl-pick="' + name + '" value="' + value.toLowerCase() + '" aria-label="' + esc(label) + '"><span style="background:' + value + '"></span></label>' +
          '<input class="wdl-hex" type="text" data-dl-hex="' + name + '" value="' + value + '" maxlength="7" spellcheck="false" autocomplete="off" inputmode="text" aria-label="' + esc(label) + ', hex code"></div>'
      }
      function optsHtml(f) {
        var h = '', k = kind(f), z = k && DL_SIZE[k], bm = bgMode(f), t = swapOn() ? swapTarget() : null, name = DL_FMT[f] ? DL_FMT[f][0] : f
        var ml = moving(f) ? motions(f).list : null
        if (ml && ml.length > 1) h += seg('motion', 'Motion', ml, motionPick(f), 'is-wide')
        else if (ml && ml.length) h += '<div class="wdl-o is-wide"><p class="wdl-l">Motion</p><p class="wdl-fixed"><b>' + esc(ml[0][1]) + '</b> <small>' + esc(S.preset ? 'The movement you picked.' : I.title + '’s own animation.') + ' Change it in ' + esc(po.motionTab || 'Motion') + '.</small></p></div>'
        else if (t && !isCode(f)) h += seg('which', 'Which icon', [['a', I.title + ' (before)'], ['b', t.title + ' (after)']], P.which)
        if (bm) {
          var pg = pageHex(), solid = bm === 'solid'
          h += seg('bg', 'Background', [['none', 'See-through', solid ? name + ' can’t be see-through' : ''], ['white', 'White', '', '#FFFFFF'], ['page', 'Page colour', '', pg, 'The preview’s background, ' + pg], ['custom', 'Custom']], bgVal(f), 'is-bg')
          if (bgVal(f) === 'custom') h += hexRow('bg', P.bgHex, 'Background colour')
          if (solid) h += '<p class="wdl-why">' + esc(f === 'webm' ? browserName() + ' records WebM without transparency, so it sits on a colour. Chrome and Edge keep it see-through.' : name + ' has no transparency, so it sits on a colour: white unless you pick one.') + '</p>'
          if (bm === 'matte' && bgVal(f) === 'none') {
            h += seg('matte', 'Edge colour', [['white', 'White', '', '#FFFFFF'], ['page', 'Page colour', '', pg, 'The preview’s background, ' + pg], ['black', 'Black', '', '#000000'], ['custom', 'Custom']], P.matte, 'is-bg')
            if (P.matte === 'custom') h += hexRow('matte', P.matteHex, 'Edge colour')
            h += '<p class="wdl-why">GIFs can’t fade their edges into what’s behind them, so soft edges are blended with this colour. Pick the colour of the slide or page it will sit on.</p>'
          }
        }
        if (z) {
          var v = sizeVal(k), fmtv = function (n) { return z.unit === 'in' ? n + '″' : String(n) }, custom = P.custom[k] || z.list.indexOf(v) < 0
          h += '<div class="wdl-o is-wide"><p class="wdl-l" id="' + id + '-o-size">' + (z.label || 'Size') + ' <small>' + esc(z.unit === 'in' ? 'inches' : z.unit === 'dp' ? 'dp (Android units)' : z.unit === 'pt' ? 'points' : 'pixels') + '</small></p>' +
            '<div class="wdl-seg is-sizes" data-n="' + (z.list.length + 1) + '" role="radiogroup" aria-labelledby="' + id + '-o-size">' + z.list.map(function (n) { var on = !custom && n === v; return '<button type="button" role="radio" data-dl-o="size" data-v="' + n + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + fmtv(n) + '</button>' }).join('') +
              '<button type="button" role="radio" data-dl-o="size" data-v="custom" aria-checked="' + custom + '" tabindex="' + (custom ? 0 : -1) + '">Custom</button></div>' +
            (custom ? '<label class="wdl-num"><span>Custom ' + esc((z.label || 'size').toLowerCase()) + '</span><input type="number" data-dl-num="' + k + '" min="' + z.min + '" max="' + z.max + '" step="' + (z.unit === 'in' ? 0.25 : 1) + '" value="' + v + '" inputmode="decimal" aria-label="Custom ' + esc((z.label || 'size').toLowerCase()) + ' in ' + z.unit + '"><span aria-hidden="true">' + z.unit + '</span></label>' : '') +
            (z.x2 ? '<button type="button" role="switch" class="wdl-switch" data-dl-x2 aria-checked="' + P.x2 + '"><span class="wdl-switch-ui" aria-hidden="true"></span><span><b>@2x for sharp screens</b><small>twice the pixels, same look on retina displays</small></span></button>' : '') +
            (z.hint ? '<p class="wdl-why">' + esc(z.hint) + '</p>' : '') + '</div>'
        }
        if (bm) {
          var pads = DL_PADS.slice(); if (padDef(f) === 'auto') pads.unshift(['auto', 'Auto'])
          h += seg('pad', 'Space around', pads, padVal(f), 'is-wide')
          if (padVal(f) === 'auto') h += '<p class="wdl-why">Auto leaves just enough room for the motion, so nothing is cut off.</p>'
        }
        if (DL_FRAMES.indexOf(f) >= 0) {
          h += seg('fps', 'Smoothness <small>frames a second</small>', fpsList(f).map(function (n) { return [n, String(n)] }), fpsVal(f))
          if (f === 'webm' || f === 'mp4') h += seg('loops', 'Length', [[1, 'One loop'], [2, '2 loops'], [3, '3 loops'], [5, '5 loops']], P.loops)
          else if (f !== 'png-sequence') h += seg('loop', 'Plays', [[0, 'Forever'], [1, 'Once'], [3, '3 times']], P.loop)
        }
        return h
      }
      function sizeTxt(f) {
        var k = kind(f), z = k && DL_SIZE[k]
        if (f === 'pptx' || f === 'pptx-sheet') return '16:9 slide' + (f === 'pptx-sheet' ? 's' : '')
        if (f === 'ico') return '16 to 256 px inside'
        if (f === 'favicon-pack') return '16 to 512 px'
        if (!z) return ''
        var v = sizeVal(k)
        if (z.unit === 'in') return v + ' in on the page'
        if (k === 'set') return v + ' px, @1x to @4x'
        if (z.x2 && P.x2) return (v * 2) + ' × ' + (v * 2) + ' px (@2x)'
        return v + ' × ' + v + ' ' + z.unit
      }
      function summary(f) {
        var parts = [], s = sizeTxt(f), bm = bgMode(f), bg = bm ? bgHex(f) : null
        if (s) parts.push(s)
        if (bm) parts.push(bg ? (bgVal(f) === 'white' ? 'on white' : bgVal(f) === 'page' ? 'on the page colour' : 'on ' + bg) : bm === 'matte' ? 'see-through, edges on ' + (P.matte === 'custom' ? P.matteHex : P.matte === 'page' ? 'the page colour' : P.matte) : 'see-through')
        if (moving(f) && motionPick(f) !== 'still') { var sec2 = loopSecs(f); if (sec2) parts.push(sec2 + ' s loop') }
        if (DL_FRAMES.indexOf(f) >= 0) parts.push(fpsVal(f) + ' fps')
        if (isCode(f)) parts.push(S.anim === 'none' && !swapOn() ? 'still' : 'with motion')
        return parts.join(' · ')
      }
      function aboutAud(d) { return (d && d.audience || []).map(function (a) { return DL_AUD[a] ? '<span>' + esc(DL_AUD[a]) + '</span>' : '' }).join('') }
      var forceCls = function () { return forced ? ' wm-force' : '' }
      function artHtml(f) {
        var px = 112, t = swapOn() ? swapTarget() : null, cz = isMulti() ? colorsFor() : null, inkA = (cz && cz.ink) || colorHex()
        if (moving(f)) {
          var m = motionPick(f)
          if (m === 'swap' && t) {
            var bc = bColors(t)
            return '<span class="wdl-ic"><span class="wm-swap wm-loop wm-fx-' + swEffect() + forceCls() + '" style="' + varsCss(swVars({ all: true })) + '"><span class="wm-a">' + buildSvg(I.name, S.style, { size: px, mode: 'live', full: true, ink: inkA }) + '</span>' +
              '<span class="wm-b">' + buildSvg(t.name, t.style, { size: px, mode: 'live', colors: bc.cz, full: true, ink: (bc.cz && bc.cz.ink) || colorHex(t.style, bc.mono) }) + '</span></span></span>'
          }
          var mi = m === 'still' ? null : motions(f).mi[m === 'hover' ? 'hover' : 'loop']
          var svg = buildSvg(I.name, S.style, { size: px, mode: 'live', full: true, ink: inkA })
          return '<span class="wdl-ic' + (mi ? ' ' + mi.cls + forceCls() : '') + '"' + (mi && mi.style ? ' style="' + mi.style + '"' : '') + '>' + svg + '</span>'
        }
        if (P.which === 'b' && t && !isCode(f)) { var b2 = bColors(t); return '<span class="wdl-ic">' + buildSvg(t.name, t.style, { size: px, mode: 'live', colors: b2.cz, full: true, ink: (b2.cz && b2.cz.ink) || colorHex(t.style, b2.mono) }) + '</span>' }
        return '<span class="wdl-ic">' + buildSvg(I.name, S.style, { size: px, mode: 'live', full: true, ink: inkA }) + '</span>'
      }

      /* ── paint ── */
      function paintGroups() {
        $$('[data-dlg]', sec).forEach(function (b) { var on = b.getAttribute('data-dlg') === P.group; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
        $('[data-dl-body]', sec).setAttribute('aria-labelledby', id + '-g-' + P.group)
        $('[data-dl-gsay]', sec).textContent = groupOf(P.group).use
      }
      function update() {
        if (!I.name || !built) return
        var f = cur(), d = desc(f), ready = exportReady()
        paintGroups()
        // the format list: rebuilt when the group (or availability) changes
        var bk = P.group + '|' + ready
        var box = $('[data-dl-fmts]', sec)
        if (bk !== P.bkey) {
          P.bkey = bk
          var g = groupOf(P.group), top = tops(P.group), rest = g.ids.filter(function (x) { return top.indexOf(x) < 0 })
          box.innerHTML = top.map(fmtBtn).join('') + rest.map(fmtBtn).join('') + (g.code ? '<p class="wdl-sep" aria-hidden="true">Code files</p>' + g.code.map(fmtBtn).join('') : '')
          var mb = $('[data-dl-more]', sec)
          var extra = rest.concat(g.code || [])
          if (extra.length && !mb) {
            mb = D.createElement('button'); mb.type = 'button'; mb.className = 'wdl-more'; mb.setAttribute('data-dl-more', ''); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-controls', id + '-f')
            box.parentNode.appendChild(mb)
          } else if (!extra.length && mb) mb.remove()
          if (mb) {
            var nm = rest.map(function (x) { return DL_FMT[x] ? DL_FMT[x][0] : x }).concat(g.code ? ['code files'] : [])
            mb.innerHTML = '<span class="wdl-more-i" aria-hidden="true">+</span><span><b data-dl-morel></b><small>' + esc(nm.length > 3 ? nm.slice(0, 3).join(' · ') + ' + ' + (nm.length - 3) + ' more' : nm.join(' · ')) + '</small></span>'
            mb._n = extra.length
          }
        }
        var mbt = $('[data-dl-more]', sec), topNow = tops(P.group)
        var moreOpen = P.more || topNow.indexOf(f) < 0
        if (mbt) {
          mbt.setAttribute('aria-expanded', moreOpen ? 'true' : 'false'); mbt.classList.toggle('is-open', moreOpen)
          var ml = $('[data-dl-morel]', mbt); if (ml) ml.textContent = moreOpen ? 'Fewer formats' : mbt._n + ' more formats'
          mbt.hidden = moreOpen && topNow.indexOf(f) < 0   // a format from the "more" list is chosen: keep them all in view
        }
        $$('.wdl-sep, [data-dlf]', box).forEach(function (b) { var x = b.getAttribute('data-dlf'); var isTop = !!x && topNow.indexOf(x) >= 0; b.classList.toggle('is-top', isTop); b.hidden = !isTop && !moreOpen })
        $$('[data-dlf]', box).forEach(function (b) { var on = b.getAttribute('data-dlf') === f; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1 })
        // what it is
        var dd = DL_FMT[f] || [f, '', f]
        var bdg = $('[data-dl-badge]', sec); bdg.textContent = dd[2]; bdg.className = 'wdl-badge is-' + (isCode(f) ? 'code' : FAM[f] || 'img')
        $('[data-dl-name]', sec).textContent = dd[0]
        var ok = avail(f)
        $('[data-dl-note]', sec).textContent = !ok ? naWhy(f) : DL_NOTE[f] || (d ? d.note : dd[1] + '.')
        $('[data-dl-aud]', sec).innerHTML = ok && d ? '<span class="wdl-aud-l">Best for</span>' + aboutAud(d) : ''
        // options: rebuilt when anything they show changes (never while one of them is being typed in)
        var ok2 = [f, ready, P.bg, P.matte, P.x2, P.pad[padKey(f)], P.motion, P.which, P.fps.gif, P.fps.v, P.loop, P.loops, sizeVal(kind(f) || 'code'), P.custom[kind(f)], pageHex(), swapOn() ? SW.to + SW.toStyle : '', S.anim, S.preset, S.style, I.name, P.bgHex, P.matteHex].join('|')
        var oe = $('[data-dl-opts]', sec)
        if (ok2 !== P.okey && !(oe.contains(D.activeElement) && /^(INPUT)$/.test(D.activeElement.tagName))) {
          var had = oe.contains(D.activeElement) && D.activeElement.getAttribute('data-dl-o')
          var hadV = had && D.activeElement.getAttribute('data-v')
          P.okey = ok2
          oe.innerHTML = ok ? optsHtml(f) : ''
          if (had) { var back = $('[data-dl-o="' + had + '"][aria-checked="true"]', oe) || $('[data-dl-o="' + had + '"][data-v="' + hadV + '"]', oe); if (back) back.focus() }
        }
        // options fold: "Options" names what can be changed for this format; open or closed is remembered
        var adj = $('[data-dl-adj]', sec), has = ok && !!oe.children.length
        adj.hidden = !has
        oe.hidden = !has || !P.adv
        adj.setAttribute('aria-expanded', P.adv ? 'true' : 'false')
        if (has) $('[data-dl-adjsum]', sec).textContent = $$('.wdl-o > .wdl-l', oe).map(function (l) { return (l.firstChild && l.firstChild.nodeType === 3 ? l.firstChild.nodeValue : l.textContent).trim() }).filter(Boolean).join(' · ')
        // the preview: checkerboard when see-through, the file's colour otherwise; the icon sits inside its padding
        var bm = bgMode(f), bg = bm ? bgHex(f) : null, boxEl = $('[data-dl-box]', sec)
        boxEl.classList.toggle('is-alpha', !bg && bm !== null)
        boxEl.classList.toggle('is-matte', !bg && bm === 'matte')
        boxEl.style.setProperty('--dl-bg', bg || 'transparent')
        boxEl.style.setProperty('--dl-matte', matteHex())
        var pd = bm ? padVal(f) : '0', pnum = pd === 'auto' ? 0.12 : +pd
        boxEl.style.setProperty('--dl-pad', round(pnum / (1 + 2 * pnum) * 100, 2) + '%')
        boxEl.setAttribute('data-dark', bg && lum(bg) < 0.3 ? '1' : '0')
        var ah = artHtml(f), ak = ah + '|' + reducedMq.matches
        if (ak !== P.akey) { P.akey = ak; var art = $('[data-dl-art]', sec); art.innerHTML = ah; prepareDraw(art); prepareSwaps(art) }
        boxEl.setAttribute('aria-label', 'Preview: ' + (P.which === 'b' && !moving(f) && swapOn() ? swapTarget().title : I.title) + ', ' + (bg ? 'on ' + bg : 'see-through background'))
        // the big button
        $('[data-dl-gol]', sec).textContent = P.busy ? $('[data-dl-gol]', sec).textContent : 'Download ' + dd[0]
        if (!P.busy) $('[data-dl-sum]', sec).textContent = ok ? summary(f) : 'Not available in ' + (browserName() === 'This browser' ? 'this browser' : browserName())
        var go = $('[data-dl-go]', sec)
        go.disabled = !ok
        var cp = $('[data-dl-copy]', sec), copyable = ok && (f === 'png' || f === 'svg-flat' || f === 'svg' || isCode(f) || f === 'animated-svg' || f === 'lottie' || f === 'android')
        cp.hidden = !copyable
        if (copyable && !cp.classList.contains('is-done')) $('span', cp).textContent = f === 'png' ? 'Copy image' : isCode(f) ? 'Copy code' : f === 'lottie' ? 'Copy JSON' : f === 'android' ? 'Copy XML' : 'Copy SVG'
        // frame-by-frame formats have a limit (600 frames, 64 million pixels): say so before the press, with what to change
        var wn = $('[data-dl-warn]', sec), warn = ''
        if (ok && DL_FRAMES.indexOf(f) >= 0 && motionPick(f) !== 'still') {
          var px = sizeVal('anim'), n = Math.round(loopSecs(f) * fpsVal(f))
          if (n > 600 || n * px * px > 64e6) warn = 'That’s a lot for one animation (' + n + ' frames at ' + px + ' px). Pick ' + Math.max(16, Math.floor(Math.sqrt(64e6 / Math.max(1, n)) / 8) * 8) + ' px or less, or fewer frames a second.'
        }
        wn.hidden = !warn; wn.textContent = warn
        // quick buttons: what they will make right now
        var ql = $('[data-dlq-l="png"]', sec); if (ql) ql.textContent = S.px + ' px · see-through'
        var qg = $('[data-dlq-l="gif"]', sec)
        if (qg) { var mg = motionPick('gif'), tg = swapOn() ? swapTarget() : null; qg.textContent = mg === 'swap' && tg ? 'turns into ' + tg.title.toLowerCase() : ((motions('gif').mi[mg === 'hover' ? 'hover' : 'loop'] || {}).preset ? PRESETS[motions('gif').mi[mg === 'hover' ? 'hover' : 'loop'].preset].label.toLowerCase() + ', loops' : 'loops') }
      }

      /* ── doing it ── */
      function friendly(f, e) {
        var m = (e && e.message) || '', nm = DL_FMT[f] ? DL_FMT[f][0] : f
        if (m === 'load') return 'The download tools didn’t load. Check your connection, then try again.'
        if (m === 'na') return naWhy(f)
        if (m === 'drawing') return 'The drawing is still loading. Try again in a moment.'
        var own = /^[A-Z]/.test(m) && m.length < 220 ? ' ' + m : ''
        var tip = moving(f) && f !== 'lottie' && f !== 'dotlottie' && f !== 'animated-svg' ? ' Try a smaller size or fewer frames per second, or pick GIF.' : ' Try a smaller size, or another format.'
        return 'We couldn’t make your ' + nm + '.' + own + (/\b(Try|Use)\b/.test(own) ? '' : tip)
      }
      function kb(n) { return n < 1024 ? n + ' bytes' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (Math.round(n / 104857.6) / 10) + ' MB' }
      function sizeOf(data) { return data == null ? 0 : typeof data === 'string' ? new Blob([data]).size : data.size != null ? data.size : data.byteLength || data.length || 0 }
      var TIP = { pptx: 'Open it in PowerPoint, Keynote or Google Slides.', 'pptx-sheet': 'An overview slide, then one slide per style.', docx: 'Open it in Word or Google Docs, then copy the icon where you need it.',
        gif: 'Drop it on a slide: it plays in slideshow mode.', 'png-set': 'Unzip it: the README says which file goes where.', 'favicon-pack': 'Unzip it at your site’s root: the README has the tags to paste.',
        ios: 'Unzip it, then drag the .imageset folder into Assets.xcassets.', android: 'Put it in res/drawable in Android Studio.', 'png-sequence': 'Import the first frame as an image sequence.',
        lottie: 'Preview it on lottiefiles.com, or play it with lottie-web.', dotlottie: 'Drop it into LottieFiles, Webflow or Framer.', 'svg-flat': 'Drag it into Figma, Canva, Illustrator, Keynote or Slides.',
        png: 'Drag it into a slide, doc or chat.', mp4: 'Drag it onto a slide or into your video editor.', webm: 'Use it in a <video> tag or your video editor.' }
      function setBusy(f, btn) {
        var go = $('[data-dl-go]', sec)
        if (!f) {
          P.busy = 0; clearInterval(P.tick)
          sec.classList.remove('is-busy'); $$('.is-busy', sec).forEach(function (b) { b.classList.remove('is-busy'); b.removeAttribute('aria-busy') })
          go.removeAttribute('aria-disabled')
          var cx = $('[data-dl-cancel]', sec); if (cx) cx.remove()
          update(); return 0
        }
        P.busy = Date.now() + Math.random(); P.t0 = Date.now()
        var slow = !!DL_SLOW[f], nm = DL_FMT[f] ? DL_FMT[f][0] : f
        sec.classList.toggle('is-busy', slow)
        btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true')
        if (btn === go) {
          go.setAttribute('aria-disabled', 'true')
          $('[data-dl-gol]', sec).textContent = slow ? 'Making your ' + nm + '…' : 'Preparing…'
          $('[data-dl-sum]', sec).textContent = slow ? 'This can take a few seconds' : summary(f)
          if (slow) {
            var c = D.createElement('button'); c.type = 'button'; c.className = 'wdl-cancel'; c.setAttribute('data-dl-cancel', ''); c.textContent = 'Cancel'
            $('.wdl-go', sec).appendChild(c)
            P.tick = setInterval(function () { var s = Math.round((Date.now() - P.t0) / 1000); if (s >= 2 && P.busy) $('[data-dl-sum]', sec).textContent = 'Working… ' + s + ' s' }, 500)
          }
        }
        status(slow ? 'Making your ' + nm + '. This can take a few seconds.' : '', '')
        err('')
        return P.busy
      }
      function status(msg, kind2) { var s = $('[data-dl-status]', sec); s.textContent = msg; s.className = 'wdl-status' + (kind2 ? ' is-' + kind2 : '') }
      function err(msg) { var e = $('[data-dl-err]', sec); e.hidden = !msg; e.innerHTML = msg ? '<b>That didn’t work.</b> <span></span>' : ''; if (msg) $('span', e).textContent = msg }
      // run a format: resolves { data, filename, mime }; pre-loads what it needs (scripts, the other styles, After's drawing)
      function make(f, o) {
        return loadExports().then(function (ok) {
          if (!ok) throw new Error('load')
          P.na = {}
          if (!avail(f)) throw new Error('na')
          return f === 'pptx-sheet' ? allStyles() : null
        }).then(function () {
          var ctx = ctxFor(f); if (!ctx) throw new Error('drawing')
          var opt = o || optsFor(f)
          if (f === 'pptx-sheet' && !opt.variants) opt.variants = variants()
          return desc(f).run(ctx, opt)
        })
      }
      function download(f, btn, o) {
        if (P.busy) return
        var tk = setBusy(f, btn)
        make(f, o).then(function (r) {
          if (P.busy !== tk) return
          X().download(r.data, r.filename, r.mime)
          var n = sizeOf(r.data)
          status('Saved ' + r.filename + (n ? ' · ' + kb(n) : '') + '. ' + (TIP[f] || ''), 'ok')
          // the line under the button says it; a toast only when that line is out of sight (a quick button up top)
          var sr = $('[data-dl-status]', sec).getBoundingClientRect()
          if (sr.bottom < 0 || sr.top > (W.innerHeight || 800) - 90) toast('Downloaded ' + r.filename + (n ? ' (' + kb(n) + ')' : ''))
        }).catch(function (e) {
          if (P.busy !== tk) return
          if (W.console) console.warn('with icons download:', e)
          err(friendly(f, e)); status('', '')
        }).then(function () { if (P.busy === tk) setBusy(null) })
      }
      function flashCopy(b, ok) {
        if (!b || !ok) return
        var l = $('span', b), was = l ? l.textContent : ''
        b.classList.add('is-done'); if (l) l.textContent = 'Copied'
        clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('is-done'); if (l) l.textContent = was; update() }, 1600)
      }
      function copy(f, btn) {
        if (P.busy) return
        if (f === 'png') {
          // the image goes to the clipboard as a promise, so Safari keeps the click's permission while it renders
          if (!(W.ClipboardItem && navigator.clipboard && navigator.clipboard.write && W.isSecureContext)) {
            return make('svg-flat', { size: S.px }).then(function (r) { return copyText(r.data) }).then(function (ok) { status(ok ? 'Your browser can’t copy images, so we copied the SVG code. Paste it into Figma, Canva or HTML.' : 'The clipboard is blocked here. Use Download instead.', ok ? 'ok' : ''); flashCopy(btn, ok) })
          }
          var tk = setBusy(f, btn)
          var blob = make('png').then(function (r) { return r.data })
          return navigator.clipboard.write([new W.ClipboardItem({ 'image/png': blob })]).then(function () {
            if (P.busy !== tk) return
            status('Copied ' + I.title + ' as a ' + sizeTxt('png') + ' image. Paste it into Slides, Docs, Notion or Canva.', 'ok'); flashCopy(btn, true)
          }, function (e) {
            if (P.busy !== tk) return
            return make('svg-flat', { size: S.px }).then(function (r) { return copyText(r.data) }).then(function (ok) { status(ok ? 'Image copying was blocked, so we copied the SVG code instead.' : '', ok ? 'ok' : ''); if (!ok) err(friendly('png', e)) })
          }).then(function () { if (P.busy === tk) setBusy(null) })
        }
        var tk2 = setBusy(f, btn)
        make(f).then(function (r) { return typeof r.data === 'string' ? copyText(r.data) : false }).then(function (ok) {
          if (P.busy !== tk2) return
          var nm = DL_FMT[f] ? DL_FMT[f][0] : f
          status(ok ? 'Copied the ' + nm + (isCode(f) ? ' code' : f === 'lottie' ? ' JSON' : '') + '. Paste it where you need it.' : 'The clipboard is blocked here. Use Download instead.', ok ? 'ok' : '')
          flashCopy(btn, ok)
        }).catch(function (e) { if (P.busy === tk2) err(friendly(f, e)) }).then(function () { if (P.busy === tk2) setBusy(null) })
      }
      // warm up: fetch the scripts once the panel nears the screen, or on the first pointer / focus inside it
      var warm = function () { loadExports().then(function (ok) { if (ok) { P.na = {}; update() } }) }
      var io = null
      if (W.IntersectionObserver) { io = new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting })) { warm(); io.disconnect(); io = null } }, { rootMargin: '600px 0px' }); io.observe(sec) }
      else warm()
      function onPointer() { warm() }

      /* ── events ── */
      function pick(name, v) {
        var f = cur(), k = kind(f)
        if (name === 'bg') P.bg = v
        else if (name === 'matte') P.matte = v
        else if (name === 'pad') P.pad[padKey(f)] = v
        else if (name === 'motion') P.motion = v
        else if (name === 'which') P.which = v
        else if (name === 'fps') P.fps[f === 'gif' ? 'gif' : 'v'] = +v
        else if (name === 'loop') P.loop = +v
        else if (name === 'loops') P.loops = +v
        else if (name === 'size') { if (v === 'custom') P.custom[k] = true; else { P.custom[k] = false; P.size[k] = +v } }
        save(); update()
      }
      function onClick(e) {
        var b = e.target.closest('button'); if (!b || !sec.contains(b)) return
        var v
        if ((v = b.getAttribute('data-dlg'))) { P.group = v; P.more = false; save(); update() }
        else if ((v = b.getAttribute('data-dlf'))) { P.pick[P.group] = v; save(); err(''); status('', ''); update() }
        else if ((v = b.getAttribute('data-dl-o'))) { if (!b.disabled) pick(v, b.getAttribute('data-v')) }
        else if (b.hasAttribute('data-dl-x2')) { P.x2 = !P.x2; save(); update() }
        else if (b.hasAttribute('data-dl-more')) {
          P.more = !P.more; update()
          var shown = P.more ? $$('[data-dlf]:not(.is-top):not([hidden]), .wdl-sep:not([hidden])', sec) : []
          if (shown.length) {
            var first = $('[data-dlf]:not(.is-top):not([hidden])', sec); if (first) first.focus()
            if (!reducedMq.matches && first && first.animate) shown.forEach(function (x, i) { x.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: i * 25, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }) })
          }
        }
        else if (b.hasAttribute('data-dl-adj')) {
          P.adv = !P.adv; save(); update()
          var oe2 = $('[data-dl-opts]', sec)
          if (P.adv && !reducedMq.matches && oe2.animate) oe2.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' })
        }
        else if (b.hasAttribute('data-dl-go')) { if (b.getAttribute('aria-disabled') !== 'true') download(cur(), b) }
        else if (b.hasAttribute('data-dl-copy')) copy(cur(), b)
        else if (b.hasAttribute('data-dl-cancel')) { P.busy = 0; setBusy(null); status('Cancelled.', ''); $('[data-dl-go]', sec).focus() }
        else if ((v = b.getAttribute('data-dlq'))) {
          if (v === 'copy') { actions.copyImage(); return }
          var q = QUICK[v]; if (q) download(q.f, b, q.o())
        }
      }
      // arrow keys inside the tab list and every radio group (disabled choices are skipped)
      function onKey(e) {
        var t = e.target; if (!t.getAttribute || t.tagName !== 'BUTTON') return
        var grp = t.closest('[role=radiogroup],[role=tablist]'); if (!grp || !sec.contains(grp)) return
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
        var list = $$('button[role=radio],button[role=tab]', grp).filter(function (x) { return !x.disabled && !x.hidden }), i = list.indexOf(t)
        if (e.key === 'Home') d = -i; else if (e.key === 'End') d = list.length - 1 - i
        if (!d || i < 0) return
        e.preventDefault()
        var n = list[(i + d + list.length) % list.length], attr = n.hasAttribute('data-dlg') ? 'data-dlg' : n.hasAttribute('data-dlf') ? 'data-dlf' : 'data-dl-o'
        var key = attr === 'data-dl-o' ? '[data-dl-o="' + n.getAttribute('data-dl-o') + '"][data-v="' + n.getAttribute('data-v') + '"]' : '[' + attr + '="' + n.getAttribute(attr) + '"]'
        n.click()
        var again = $(key, sec) || n; again.focus()
      }
      function hexIn(t, commit) {
        var k = t.getAttribute('data-dl-hex') || t.getAttribute('data-dl-pick'), h = normHex(t.value)
        if (t.hasAttribute('data-dl-hex')) t.setAttribute('aria-invalid', h || !commit ? 'false' : 'true')
        if (!h) { if (commit && t.hasAttribute('data-dl-hex')) { t.value = k === 'bg' ? P.bgHex : P.matteHex; t.removeAttribute('aria-invalid') } return }
        if (k === 'bg') P.bgHex = h; else P.matteHex = h
        var sw = t.closest('.wdl-hexrow'); if (sw) { $('.wdl-pick span', sw).style.background = h; if (t.hasAttribute('data-dl-pick')) $('[data-dl-hex]', sw).value = h; else if (commit) { t.value = h; $('[data-dl-pick]', sw).value = h.toLowerCase() } }
        save(); update()
      }
      function numIn(t, commit) {
        var k = t.getAttribute('data-dl-num'), z = DL_SIZE[k], v = +t.value
        if (!(v >= z.min && v <= z.max)) { if (commit) { t.value = sizeVal(k) } return }
        P.size[k] = z.unit === 'in' ? Math.round(v * 4) / 4 : Math.round(v); save()
        if (commit) update(); else $('[data-dl-sum]', sec).textContent = summary(cur())
      }
      function onInput(e) { var t = e.target; if (t.hasAttribute('data-dl-pick')) hexIn(t, false); else if (t.hasAttribute('data-dl-hex') && t.value.replace('#', '').length >= 6) hexIn(t, false); else if (t.hasAttribute('data-dl-num')) numIn(t, false) }
      function onChange(e) { var t = e.target; if (t.hasAttribute('data-dl-pick') || t.hasAttribute('data-dl-hex')) hexIn(t, true); else if (t.hasAttribute('data-dl-num')) numIn(t, true) }
      function onKeyField(e) { var t = e.target; if (e.key === 'Enter' && t.tagName === 'INPUT' && (t.hasAttribute('data-dl-hex') || t.hasAttribute('data-dl-num'))) { e.preventDefault(); onChange(e); t.select() } }
      function onFocusOut(e) { if (e.target.tagName === 'INPUT') setTimeout(update, 0) }
      sec.addEventListener('click', onClick); sec.addEventListener('keydown', onKey); sec.addEventListener('keydown', onKeyField); sec.addEventListener('input', onInput); sec.addEventListener('change', onChange)
      sec.addEventListener('pointerenter', onPointer); sec.addEventListener('focusin', onPointer); sec.addEventListener('focusout', onFocusOut)
      var api3 = {
        el: el, update: update,
        download: function (f, o) { return make(f, o).then(function (r) { X().download(r.data, r.filename, r.mime); return r }) },
        make: make, select: function (g, f) { if (g && g !== P.group) { P.group = g; P.more = false } if (f) P.pick[P.group] = f; save(); update() },
        destroy: function () {
          if (io) io.disconnect(); clearInterval(P.tick)
          sec.removeEventListener('click', onClick); sec.removeEventListener('keydown', onKey); sec.removeEventListener('keydown', onKeyField); sec.removeEventListener('input', onInput); sec.removeEventListener('change', onChange)
          sec.removeEventListener('pointerenter', onPointer); sec.removeEventListener('focusin', onPointer); sec.removeEventListener('focusout', onFocusOut)
          dlPanels = dlPanels.filter(function (x) { return x !== api3 }); kitUnwatch(el); el.innerHTML = ''
        }
      }
      dlPanels.push(api3)
      update()
      return api3
    }

    /* ───────── placements ───────── */
    var place = null
    var api = {
      el: root, host: host, get: get, set: set, setIcon: setIcon, actions: actions, replay: replay,
      // pick the visible options tab ('look' | 'motion' | 'swap'); hosts that hide the tab bar (the library drawer) drive it
      tab: function (t) { if (/^(look|motion|swap)$/.test(t)) selectTab(t); return S.tab },
      svg: function (o) { o = o || {}; return buildSvg(o.name || I.name, o.style || S.style, { size: o.size || S.size, mode: o.mode || 'live', hex: o.hex }) },
      svgText: function (mode, st, px) { return buildSvg(I.name, st || S.style, { size: px || S.size, mode: mode || 'file', hex: colorHex(st || S.style) }) },
      // colours of multi-colour styles (every part + palettes): a Colours panel anywhere, and the colours for hosts' own exports
      colorsPanel: function (el, k) { return colorPanel(el, k) },
      // the Download panel anywhere (the library drawer mounts one beside its own buttons): { quick: false } leaves out
      // the quick buttons. downloads() lists the mounted panels (each has .download(formatId, opts) and .make())
      downloadPanel: function (el, o) { return downloadPanel(el, o) }, downloads: function () { return dlPanels.slice() }, loadExports: loadExports,
      colorsFor: function (st, name) { return isMulti(st || S.style, name) ? colorsFor(st || S.style, name || I.name) : null },
      bakeColors: bakeColors, colorCss: function (st, pretty) { var cz = isMulti(st || S.style) ? colorsFor(st || S.style) : null; return cz ? cssOf(cz, null, pretty) : '' },
      isMulti: function (st) { return isMulti(st || S.style) }, palettes: function () { return palettesOf(I.name) }, loadPalettes: function () { return loadPalettes(I.name) },
      choosePalette: function (id) { var l = palettesOf(I.name) || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) { choosePalette(l[i]); return true } return false },
      resetColors: function () { resetColors() },
      liveIcon: liveIcon, motionInfo: motionInfo, info: info, colorHex: colorHex, previewColor: previewColor, onColor: onColor, related: function () { return relatedIcons() },
      // "Turn into" for host pages: paintLive(el, { px, trigger }) draws the live icon (the swap included) and keeps it in
      // step; swapHost(el) makes el's live swaps follow the shared state and its hover / focus (returns an off function);
      // swapPress(el) is a press on a live copy (click: switch; hover + touch: switch this copy; auto: pause / resume)
      paintLive: paintLive, swapHost: function (el) { return addHost(el, { self: true }) }, swapPress: function (el) { return swapPress(el || root) },
      swapToggle: function (v) { if (swapReady()) toggleSwap(v); return SW.on }, swapPlay: playDemo, syncSwaps: syncSwaps, exportCtx: exportCtx,
      on: function (ev, fn) { if (ev === 'change') subs.push(fn); return function () { subs = subs.filter(function (x) { return x !== fn }) } },
      placements: function (el) { place = placements(el, api); place.render(); return place },
      destroy: function () {
        dead = true; kitUnwatch(null); if (W.WIKit) W.WIKit.close()
        stopAuto(); clearTimeout(demoT); panels.slice().forEach(function (p) { p.destroy() }); dlPanels.slice().forEach(function (p) { p.destroy() }); if (offIO) offIO.disconnect()
        root.removeEventListener('click', onClick); root.removeEventListener('keydown', onKey); root.removeEventListener('keydown', onKeyMono); root.removeEventListener('input', onInput); root.removeEventListener('change', onChange)
        unHost(); W.removeEventListener('resize', onResize); D.removeEventListener('visibilitychange', onVis); if (reducedMq.removeEventListener) reducedMq.removeEventListener('change', onMq)
        if (place) place.destroy(); swHosts.slice().forEach(function (h) { h.off() }); host.innerHTML = ''; subs = []
      }
    }
    function relatedIcons() {
      var r = (opts.related || (I.data && I.data.related) || []).filter(function (x) { return x && x.name !== I.name })
      if (r.length < 3) ['home', 'search', 'user', 'settings', 'heart', 'star'].forEach(function (n) { if (n !== I.name && r.length < 4 && !r.some(function (x) { return x.name === n })) r.push({ name: n, title: titleOf(n) }) })
      return r.map(function (x) { var inner = x.inner || thumbInner(x.name); return { name: x.name, title: x.title || titleOf(x.name), svg: inner != null ? '<svg viewBox="0 0 24 24" width="22" height="22"' + attrStr(rootFor('line')) + ' aria-hidden="true" focusable="false">' + inner + '</svg>' : '' } })
    }
    setIcon(opts.name, { data: opts.data, motion: opts.motion, title: opts.title, style: opts.style })
    if (!PL()) ensurePL().then(function () { if (built) { presetKey = ''; render() } })
    if (opts.placements) { var pel = typeof opts.placements === 'string' ? $(opts.placements) : opts.placements; if (pel) api.placements(pel) }
    try { host.withEditor = api } catch (e) { }   // the mounted studio, for host scripts and tests: el.withEditor.get()
    return api
  }

  /* ═════════════════════════════ placements ═════════════════════════════ */
  function placements(el, ed) {
    el.classList.add('wied-places')
    var last = ''
    // the swap's verb for captions, by trigger
    function swapCaption(sw) {
      var touch = touchMq.matches
      return sw.trigger === 'click' ? (touch ? 'tap' : 'click') + ' to switch' : sw.trigger === 'hover' ? (touch ? 'tap to switch' : 'hover to switch') : sw.trigger === 'auto' ? 'switches on its own' : 'focus to switch'
    }
    function render() {
      var st = ed.get(), dark = st.bg === 'dark', sw = st.swap && st.swap.ready ? st.swap : null
      // surfaces (buttons, tiles, tints) take the picked colour, or the style colour while the icon is plain black;
      // icons sitting on light surfaces take the picked colour itself
      var accent = st.colors && st.colors.main ? st.colors.main : st.color === 'ink' ? st.styleHex : st.hex
      if (!dark && lum(accent) > 0.75) accent = st.styleHex
      var adapt = function (c, hex) { return c === 'ink' ? (dark ? INK_D : INK) : (!dark && lum(hex) > 0.75 ? INK : hex) }
      var iconC = adapt(st.color, st.hex)
      // After's own single colour, adapted the same way (linked: the same as Before)
      var iconCB = sw && !sw.link ? adapt(sw.toColors.color, ed.colorHex(sw.toStyle, sw.toColors.color)) : undefined
      var on = onColor(accent)
      var scale = clamp(st.size / 24, 0.75, 1.5)
      var px = function (n) { return Math.round(n * scale) }
      // ic(size, colour, trigger, { swap }): a swap on a coloured surface follows that surface's colour too
      var ic = function (n, color, trig, o) { o = o || {}; return ed.liveIcon({ px: px(n), color: color, colorB: o.swap ? (color === on ? on : iconCB) : undefined, trigger: trig || 'auto', swap: o.swap === true, on: false }) }
      var rel = ed.related()
      var T = esc(st.title), hasSwap = !!sw
      var BT = sw ? esc(sw.title) : ''
      var cards = [
        ['btn', hasSwap ? 'Button · ' + swapCaption(sw) : 'Button', '<div class="pl-stage"><button type="button" class="pl-btn pl-primary" data-wsw-t style="--a:' + accent + ';--on:' + on + '">' + ic(20, on, 'auto', { swap: true }) + '<span>' + T + '</span></button></div>'],
        ['hover', 'Button that moves on hover', '<div class="pl-stage"><button type="button" class="pl-btn pl-ghost wm-trigger" style="--a:' + accent + '">' + ic(20, iconC, 'hover') + '<span>Hover me</span></button><span class="pl-note" aria-hidden="true">hover me ↗</span></div>'],
        ['iconbtn', hasSwap ? 'Icon button · ' + swapCaption(sw) : 'Icon button with tooltip', '<div class="pl-stage"><span class="pl-tipwrap"><button type="button" class="pl-round" data-pl-toggle data-wsw-t data-wsw-btn aria-label="' + T + (hasSwap ? ', turns into ' + BT : '') + '" style="--a:' + accent + ';--on:' + on + '">' + ic(22, on, 'auto', { swap: true }) + '</button><span class="pl-tip" role="tooltip">' + T + '</span></span></div>'],
        ['slide', 'Presentation slide', '<div class="pl-slide" style="--a:' + accent + '"><div class="pl-slide-in"><span class="pl-slide-k">Q3 review</span><b>' + T + ' at a glance</b><span class="pl-slide-l"></span><span class="pl-slide-l is-short"></span><span class="pl-slide-ic">' + ic(30, iconC) + '</span><span class="pl-slide-n">04</span></div></div>'],
        ['toast', 'Notification', '<div class="pl-stage"><div class="pl-toast" style="--a:' + accent + '"><span class="pl-toast-i">' + ic(20, iconC) + '</span><span class="pl-toast-t"><b>' + T + '</b><small>Your changes were saved just now.</small></span><button type="button" class="pl-toast-b">View</button></div></div>'],
        ['tabs', 'Tab bar · active state', '<div class="pl-stage"><div class="pl-tabs" style="--a:' + accent + '">' +
          [rel[0], { name: st.name, title: st.title, cur: true }, rel[1], rel[2]].filter(Boolean).map(function (r) { return '<span class="pl-tab' + (r.cur ? ' is-on' : '') + '">' + (r.cur ? ic(22, iconC) : (r.svg || '')) + '<small>' + esc(r.title) + '</small></span>' }).join('') + '</div></div>'],
        ['list', 'Bullet points', '<ul class="pl-list" style="--a:' + accent + '">' + ['Free for any project', 'Works in slides and docs', 'Recolour it in one click'].map(function (t) { return '<li>' + ic(18, iconC) + '<span>' + t + '</span></li>' }).join('') + '</ul>'],
        ['card', 'Feature card', '<div class="pl-card" style="--a:' + accent + ';--on:' + on + '"><span class="pl-card-i">' + ic(26, iconC) + '</span><b>' + T + '</b><p>A short line that explains this feature in plain words.</p><span class="pl-card-a">Learn more →</span></div>'],
        ['input', 'Search field', '<div class="pl-stage"><label class="pl-input" style="--a:' + accent + '">' + ic(18, iconC) + '<span class="pl-input-ph">Search ' + esc(st.title.toLowerCase()) + '…</span><kbd>/</kbd></label></div>'],
        ['app', hasSwap ? 'App tile · ' + swapCaption(sw) : 'App tile and tags', '<div class="pl-stage pl-appwrap"><span class="pl-app" data-wsw-t><span class="pl-app-tile" style="--a:' + accent + ';--on:' + on + '">' + ic(30, on, 'auto', { swap: true }) + '</span><small>' + T + '</small></span><span class="pl-chips"><span class="pl-chip" style="--a:' + accent + '">' + ic(14, iconC) + '<span>' + T + '</span></span><span class="pl-chip is-solid" style="--a:' + accent + ';--on:' + on + '">' + ic(14, on) + '<span>New</span></span></span></div>']
      ]
      var html = cards.map(function (c) { return '<figure class="wied-pl is-' + c[0] + (st.anim === 'hover' && c[0] !== 'hover' ? ' wm-trigger' : '') + '"><div class="wied-pl-box">' + c[2] + '</div><figcaption>' + c[1] + '</figcaption></figure>' }).join('')
      el.setAttribute('data-theme-mock', dark ? 'dark' : 'light')
      // the markup only changes with the drawing (style, colours, size, motion, swap set-up); switching on and off is a
      // class on the live swaps (the editor's syncSwaps), so a switch here animates and never rebuilds the cards
      if (html === last) { ed.syncSwaps(el); return }
      last = html
      // switched on right now: the new cards start on After (no replayed transition when, say, a colour changes)
      el.innerHTML = st.swapOn ? html.replace(/(class="wm-swap wm-js wm-fx-[\w-]+)"/g, '$1 is-on"') : html
      // the mock-ups are pictures: no tab stops or fake controls for keyboards and screen readers (the caption names each one).
      // Not `inert`: that would also switch off hover, which the "moves on hover" demos need. The icon button stays a real toggle.
      $$('.wied-pl-box', el).forEach(function (box) {
        if ($('[data-pl-toggle]', box) && hasSwap) return
        box.setAttribute('aria-hidden', 'true')
        $$('button, a[href], input, [tabindex]', box).forEach(function (b) { b.tabIndex = -1 })
      })
      prepareDraw(el)
      $$('.wm-swap.wm-fx-draw:not(.wm-drawable)', el).forEach(function (w) {
        var m = W.WithMotion, ok = false
        $$('.wm-a,.wm-b', w).forEach(function (f) { try { ok = (m && m.prepareDraw ? m.prepareDraw(f) : false) || ok } catch (e) { } })
        if (ok) w.classList.add('wm-drawable')
      })
      ed.syncSwaps(el)
      keyScroll()
    }
    // a sideways scroller of pictures (phones, the library drawer) has nothing to tab to: make the strip itself a tab stop
    // so keyboards can scroll it (WCAG 2.1.1), and drop that again when it fits or holds a real control
    function keyScroll() {
      var need = el.scrollWidth > el.clientWidth + 2 && !$('button:not([tabindex="-1"]), a[href]:not([tabindex="-1"])', el)
      if (need && !el._wiKey) { el._wiKey = 1; el.tabIndex = 0; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Examples of ' + ed.get().title + ' in use, scroll sideways for more') }
      else if (!need && el._wiKey) { el._wiKey = 0; el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label') }
    }
    var keyRO = W.ResizeObserver ? new ResizeObserver(function () { keyScroll() }) : null
    if (keyRO) keyRO.observe(el)
    var offIO = watchOffscreen(el)
    var unHost = ed.swapHost ? ed.swapHost(el) : function () { }
    function onClick(e) {
      var t = e.target.closest('[data-wsw-t]')
      if (t && el.contains(t) && $('[data-wsw]', t)) { e.preventDefault(); ed.swapPress(t); return }
      if (e.target.closest('button')) e.preventDefault()
    }
    el.addEventListener('click', onClick)
    return { el: el, render: render, destroy: function () { el.removeEventListener('click', onClick); unHost(); if (keyRO) keyRO.disconnect(); if (el._wiKey) { el._wiKey = 0; el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label') } if (offIO) offIO.disconnect(); el.classList.remove('wied-off'); el.innerHTML = '' } }
  }

  var Editor = { version: '1.1.0', mount: mount, loadKit: loadKit, motionAttrs: motionAttrs, prepareDraw: prepareDraw, ensureMotionCss: ensureMotionCss, PRESETS: PRESETS, EFFECTS: EFFECTS.map(function (e) { return e[0] }), ORDER: ORDER, HEX: HEX, titleOf: titleOf, comp: comp }
  W.WithEditor = Editor
  /* hex code fields hold a full "#RRGGBB" at their 7-character limit: a click or tap that only placed the caret left no
     room to type, so the code is selected on focus and a new one simply replaces it (the click's mouseup would collapse
     that selection again, so it is swallowed once) */
  var HEXF = '.wied-hex, .wcp-hex, .wdl-hex'
  D.addEventListener('focusin', function (e) {
    var t = e.target; if (!t || !t.matches || !t.matches(HEXF)) return
    t._wiSel = 1; setTimeout(function () { if (D.activeElement === t) { try { t.select() } catch (x) { } } }, 0)
  })
  D.addEventListener('mouseup', function (e) { var t = e.target; if (t && t._wiSel) e.preventDefault() }, true)
  // a tap places the caret late (after its compatibility mouse events), so the click that ends it selects once more
  D.addEventListener('click', function (e) { var t = e.target; if (t && t._wiSel) { t._wiSel = 0; try { t.select() } catch (x) { } } }, true)
  D.addEventListener('focusout', function (e) { if (e.target) e.target._wiSel = 0 })
  function attach() { if (W.WI && !W.WI.Editor) W.WI.Editor = Editor }
  attach()
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', attach)
})()
