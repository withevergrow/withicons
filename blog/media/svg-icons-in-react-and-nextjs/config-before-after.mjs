import { at, win, code, icon, INK } from '../../tools/hero-kit.mjs'
import { B, BG, LOOK_CSS } from './_look.mjs'

// Before / after: the old webpack() SVGR rule (faded, a red "fails" tag) next to the turbopack.rules version (green tag).
const RED = '#D93A3F', GREEN = '#178A4C'
const OLD = [
  '<s>// next.config.js</s>',
  'webpack(config) {',
  '  config.module.rules.push({',
  '    test: /\\.svg$/,',
  "    use: ['@svgr/webpack'],",
  '  })',
  '  return config',
  '}',
]
const NEW = [
  '<s>// next.config.js</s>',
  '<em>turbopack</em>: {',
  '  rules: {',
  "    <em>'*.svg'</em>: {",
  "      loaders: ['@svgr/webpack'],",
  "      as: <em>'*.js'</em>,",
  '    },',
  '  },',
  '}',
]
const tag = (txt, ic, col) => `<span class="cb-tag" style="background:${col}">${icon(ic, 'line', 36, '#fff')}${txt}</span>`

export default {
  alt: 'Two code editor cards on a pale blueprint grid: a faded Next 15 webpack config rule for SVGR with a red fails next build in 16 tag, and the Next 16 turbopack rules config for svg files with a green works tag',
  bg: BG,
  art: () => [
    win('Next 15 and older', `<div class="cb-old">${code(OLD, { size: 28, style: 'blueprint' })}</div>`, { x: 72, y: 170, w: 690, h: 560, tone: 'ink' }),
    win('Next 16', code(NEW, { size: 28, style: 'blueprint' }), { x: 838, y: 170, w: 690, h: 560, tone: 'ink', cls: 'cb-new' }),
    at(tag('fails next build in 16', 'alert-triangle', RED), { x: 120, y: 770 }),
    at(tag('builds with Turbopack', 'check-circle', GREEN), { x: 886, y: 770 }),
    at(`<span class="cb-arrow">${icon('arrow-right', 'line', 56, '#fff')}</span>`, { cx: 800, cy: 450, z: 3 }),
  ].join(''),
  css: `${LOOK_CSS}
.hk-win__bar { font-size: 28px !important; } .hk-win__bar span { opacity: .85 !important; }
.hk-win__body { padding: 30px 34px !important; }
.hk-code { color: #E8ECF4; }
.cb-old { opacity: .5; }
.cb-new .hk-win { box-shadow: 0 0 0 4px ${B.c}, 0 50px 100px -40px rgba(0,60,80,.6); }
.cb-tag { display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 18px; border-radius: 999px; color: #fff; font: 700 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; box-shadow: 0 20px 34px -18px rgba(17,19,24,.6); }
.cb-arrow { display: grid; place-items: center; width: 96px; height: 96px; border-radius: 50%; background: ${B.c}; box-shadow: 0 0 0 8px #fff, 0 24px 40px -16px rgba(0,60,80,.6); }
`,
}
