import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// A dictionary page lifted off the open book: three entries set in Instrument Serif, each with an engraved icon in the
// margin, grey bars for the definitions, and a violet thumb-index tab on the edge.
const entry = (name, word, pos) => `<div class="dc-e"><span class="dc-ic">${icon(name, 'engrave', 116, INK)}</span><div><p><b>${word}</b> <i>${pos}</i></p><s></s><s></s><s class="is-short"></s></div></div>`

export default {
  base: 'xgloss3',
  alt: 'An open dictionary on a wooden table behind a tilted cream glossary page with three serif entries, glyph, keyline and viewBox, each beside an engraved icon',
  photo: { filter: 'saturate(.85) brightness(.62) blur(2px)', pos: '50% 50%', scale: 1.05 },
  overlay: `radial-gradient(90% 90% at 60% 45%, ${rgba(INK, 0.05)} 0%, ${rgba(INK, 0.45)} 100%)`,
  art: () => at(`<div class="dc">
      <div class="dc-head"><span>glyph</span><span>viewBox</span></div>
      ${entry('star', 'glyph', 'n.')}
      ${entry('circle-dashed', 'keyline', 'n.')}
      ${entry('scan', 'viewBox', 'n.')}
      <span class="dc-tab">G</span>
    </div>`, { x: 724, y: 130, w: 646, h: 730, rot: 3 }),
  css: `
.dc { position: relative; width: 100%; height: 100%; box-sizing: border-box; padding: 40px 50px 40px 46px; border-radius: 22px; background: linear-gradient(100deg, #EFE6D2 0%, #FBF6EA 8%, #FBF6EA 100%); box-shadow: 0 2px 0 rgba(0,0,0,.05), 0 60px 110px -40px rgba(0,0,0,.9); color: ${INK}; }
.dc-head { display: flex; justify-content: space-between; padding-bottom: 14px; margin-bottom: 30px; border-bottom: 2px solid ${rgba(INK, 0.15)}; font: italic 400 30px/1 var(--font-serif); opacity: .6; }
.dc-e { display: grid; grid-template-columns: 130px 1fr; gap: 26px; align-items: start; margin-bottom: 34px; }
.dc-ic { display: grid; place-items: center; width: 130px; height: 130px; }
.dc-e p { margin: 0 0 16px; font: 400 76px/1 var(--font-serif); letter-spacing: -.01em; }
.dc-e p i { font-size: 38px; color: ${C.duo.text}; }
.dc-e s { display: block; height: 14px; margin-bottom: 12px; border-radius: 7px; background: ${rgba(INK, 0.13)}; }
.dc-e s.is-short { width: 58%; }
.dc-tab { position: absolute; right: -54px; top: 230px; width: 96px; height: 110px; border-radius: 0 22px 22px 0; display: grid; place-items: center; background: ${C.duo.c}; color: #fff; font: 400 60px/1 var(--font-serif); box-shadow: 0 20px 40px -18px rgba(0,0,0,.6); z-index: -1; padding-left: 26px; box-sizing: border-box; }
`,
}
