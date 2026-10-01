#!/usr/bin/env node
// AI coding-tool integrations: forge/integrations.json (hand-researched facts, with doc URLs + verified dates)
//   -> site/data/integrations.js   (window.WITH_INTEGRATIONS, schema in site/DESIGN.md)
//   -> site/brand/ai/*.svg         (normalised, minified logo variants; originals in site/brand/ are kept untouched)
// Deeplinks are computed here (never hand-encoded): Cursor's install link carries base64 JSON of the server config.
// Run: node forge/tools/site-integrations.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const BRAND = path.join(ROOT, 'site', 'brand')
const OUT = path.join(BRAND, 'ai')

// ---------- logos ----------
// Tiny svgo-style pass: drop comments/titles/1em sizing/inline styles, collapse whitespace, round coordinates on
// large viewBoxes, then recolour. "light" = artwork for light backgrounds (dark ink), "dark" = for dark backgrounds,
// "mono" = currentColor (for inline use / CSS masks).
function minify(svg, { decimals } = {}) {
  let s = svg.replace(/<\?xml[^>]*>|<!--[\s\S]*?-->|<title>[\s\S]*?<\/title>/g, '')
    .replace(/\s(width|height)="1em"/g, '').replace(/\sstyle="flex:none;line-height:1"/g, '')
    .replace(/'/g, '"').replace(/>\s+</g, '><').replace(/\s+/g, ' ').replace(/<(\w+)([^>]*)><\/\1>/g, '<$1$2/>').trim()
  if (decimals != null) {
    s = s.replace(/\s(d|x|y|x1|x2|y1|y2|cx|cy|rx|ry|width|height|stdDeviation)="([^"]*)"/g, (m, k, v) => ` ${k}="${v.replace(/-?\d*\.\d+/g, (n, i, all) => {
      let r = String(+(+n).toFixed(decimals))
      if (r === '-0') r = '0'
      if (all[i + n.length] === '.' && !r.includes('.')) r += '.0' // keep "1.5.5"-style runs unambiguous
      return r
    })}"`)
  }
  return s
}
// Remove a full-frame mask/clipPath wrapper (Figma exports) — keeps just the drawn content.
function unwrapFrame(s) {
  return s.replace(/<defs><clipPath[^>]*><rect[^>]*\/><\/clipPath><\/defs>/, '')
    .replace(/<g clip-path="url\(#[^)]+\)"><mask[^>]*><path[^>]*\/><\/mask><g mask="url\(#[^)]+\)">([\s\S]*)<\/g><\/g>/, '$1')
}
const recolor = (s, map) => Object.entries(map).reduce((a, [from, to]) => a.split(from).join(to), s)
const setViewBox = (s, vb) => s.replace(/\sviewBox="[^"]*"/, ` viewBox="${vb}"`).replace(/\s(width|height)="\d+"/g, '')

const INK = '#0b0b0f', PAPER = '#f5f5f4'
const LOGOS = {
  'claude-mark': { src: 'claude-color.svg', both: true },                       // coral mark reads on light and dark
  'codex-mark': { src: 'codex-color.svg', both: true },                         // white tile + gradient: reads on both
  'lovable-mark': { src: 'lovable.svg', both: true, decimals: 2 },              // gradient heart
  'openai-mark': { src: 'openai.svg', mono: s => s },                           // already currentColor
  'cursor-mark': { src: 'cursor.svg', mono: s => s },
  'opencode-mark': {                                                            // 240x300 -> centred in a square box
    src: 'opencode-logo-light.svg', decimals: 2,
    prep: s => setViewBox(unwrapFrame(s), '-30 0 300 300'),
    light: s => s, dark: s => recolor(s, { '#211E1E': '#F1ECEC', '#CFCECD': '#4B4646' }),
    mono: s => recolor(s, { '#211E1E': 'currentColor', 'fill="#CFCECD"': 'fill="currentColor" fill-opacity=".25"' }),
  },
  'opencode-wordmark': {
    src: 'opencode-wordmark-simple-light.svg', decimals: 2, prep: unwrapFrame,
    mono: s => recolor(s, { 'fill="black"': 'fill="currentColor"' }),
  },
  'lovable-wordmark': {
    src: 'lovable-wordmark-light.svg', decimals: 1,
    mono: s => recolor(s, { 'fill="black"': 'fill="currentColor"' }),
  },
}

export function buildLogos() {
  fs.mkdirSync(OUT, { recursive: true })
  const made = {}, w = (name, s) => {
    const file = path.join(OUT, name + '.svg')
    fs.writeFileSync(file, s + '\n')
    return `brand/ai/${name}.svg`
  }
  for (const [name, L] of Object.entries(LOGOS)) {
    let s = minify(fs.readFileSync(path.join(BRAND, L.src), 'utf8'), { decimals: L.decimals })
    if (L.prep) s = L.prep(s)
    if (L.both) { const p = w(name, s); made[name] = { light: p, dark: p }; continue }
    const mono = L.mono(s.replace(/\sfill="currentColor"/, ' fill="currentColor"'))
    const light = L.light ? L.light(s) : mono.replace(/currentColor/g, INK)
    const dark = L.dark ? L.dark(s) : mono.replace(/currentColor/g, PAPER)
    made[name] = { light: w(name + '-light', light), dark: w(name + '-dark', dark), mono: w(name, mono) }
  }
  return made
}

// ---------- deeplinks ----------
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64')
export const DEEPLINKS = {
  // https://cursor.com/docs/mcp/install-links — config = base64(JSON.stringify(server object)); the name goes in name=
  'cursor-web': (name, cfg) => `https://cursor.com/en/install-mcp?name=${encodeURIComponent(name)}&config=${encodeURIComponent(b64(cfg))}`,
  'cursor': (name, cfg) => `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(name)}&config=${encodeURIComponent(b64(cfg))}`,
  // https://code.visualstudio.com/docs/copilot/customization/mcp-servers — vscode:mcp/install?<url-encoded JSON incl. name>
  'vscode': (name, cfg) => `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name, ...cfg }))}`,
  'vscode-insiders': (name, cfg) => `vscode-insiders:mcp/install?${encodeURIComponent(JSON.stringify({ name, ...cfg }))}`,
}

// ---------- data ----------
const mcpOut = m => {
  const { json, ...rest } = m
  return json ? { ...rest, snippet: JSON.stringify(json, null, 2), lang: 'json' } : rest
}

export function build() {
  const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'integrations.json'), 'utf8'))
  const logos = buildLogos()
  const servers = src.servers
  const tools = src.tools.map(t => {
    const pick = ref => ref && (logos[ref] ? { light: logos[ref].light, dark: logos[ref].dark, ...(logos[ref].mono ? { mono: logos[ref].mono } : {}) } : null)
    const out = {
      id: t.id, name: t.name, logo: pick(t.logo), ...(t.wordmark ? { wordmark: pick(t.wordmark) } : {}),
      blurb: t.blurb, oneLiner: t.oneLiner || null, steps: t.steps, mcp: mcpOut(t.mcp), ...(t.mcpLocal ? { mcpLocal: mcpOut(t.mcpLocal) } : {}),
      skill: t.skill || null,
    }
    if (t.deeplinks) {
      out.deeplinks = t.deeplinks.map(d => ({ label: d.label, href: d.href || DEEPLINKS[d.kind](src.name, servers[d.server]) }))
      out.deeplink = out.deeplinks[0]
    }
    out.docs = t.docs
    out.sources = t.sources
    out.verified = t.verified || src.verified
    return out
  })
  const js = `// Generated by forge/tools/site-integrations.mjs from forge/integrations.json — do not edit by hand.\n` +
    `// Schema: site/DESIGN.md "AI coding-tool integrations data".\n` +
    `window.WITH_INTEGRATIONS = ${JSON.stringify(tools, null, 1)};\n`
  fs.mkdirSync(path.join(ROOT, 'site', 'data'), { recursive: true })
  fs.writeFileSync(path.join(ROOT, 'site', 'data', 'integrations.js'), js)
  return `integrations: ${tools.length} tools, ${Object.keys(logos).length} logos`
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) console.log(build())
