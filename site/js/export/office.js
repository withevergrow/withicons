/* with icons — Office exports: PowerPoint slide, PowerPoint style sheet, Word document.
 * UMD like registry.js: a classic script in browsers (registers on window.WithExport when loaded after registry.js),
 * and in Node `require('./office.js')(WithExport)` (also `.register(WithExport)`).
 *
 * Every picture is embedded twice: as SVG through the Office 2016+ svgBlip extension (PowerPoint/Word 365 keep it
 * vector and recolourable) and as a high-res PNG fallback in the standard <a:blip> (older Office, Keynote, Google
 * Slides, LibreOffice and thumbnails show the PNG). Packages are minimal but complete OOXML, zipped with STORE.
 *
 * PNG fallback needs a rasterizer: WithExport.rasterize in browsers. In Node, set WithExport.pngFromSvg =
 * async (svg, w, h) => Uint8Array to enable these formats (available() is false otherwise).
 *
 * pptx-sheet needs the icon in every style. It uses ctx.variants / opts.variants when given
 * ([{ style, title?, inner, root }]); otherwise, in browsers, it reads window.WITH.styles + window.WITH_SVG and loads
 * missing data/style-<name>.js files on demand.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var reg = function (WithExport) { return factory(WithExport, typeof globalThis !== 'undefined' ? globalThis : root) }
    reg.register = reg
    module.exports = reg
  } else if (root.WithExport && root.WithExport.register) {
    factory(root.WithExport, root)
  }
})(typeof self !== 'undefined' ? self : this, function (X, G) {
  var D = typeof document !== 'undefined' ? document : null

  // Base URL of the site, for lazy-loading style data (captured while this script is executing).
  var scriptBase = (function () {
    try { var s = D && D.currentScript && D.currentScript.src; return s && /js\/export\/office\.js(\?.*)?$/.test(s) ? s.replace(/js\/export\/office\.js(\?.*)?$/, '') : '' } catch (e) { return '' }
  })()

  /* ───────── small helpers ───────── */
  var EMU_IN = 914400
  function x(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') }
  var XMLDECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
  var NS_A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
  var NS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
  var NS_P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
  var NS_SVG = 'http://schemas.microsoft.com/office/drawing/2016/SVG/main'
  var SVG_EXT = '{96DAC541-7B7A-43D3-8B79-37D633B846F1}'
  var REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/'
  var CT = 'application/vnd.openxmlformats-officedocument.'
  var round = Math.round

  function titleOf(ctx) {
    if (ctx.title) return String(ctx.title)
    return String(ctx.name || 'icon').split('-').map(function (w, i) { return i ? w : w.charAt(0).toUpperCase() + w.slice(1) }).join(' ')
  }
  function styleMeta(name) {
    var W = G && (G.WITH || (G.window && G.window.WITH))
    var list = (W && W.styles) || []
    for (var i = 0; i < list.length; i++) if (list[i].name === name) return list[i]
    return null
  }
  function styleTitle(name, given) {
    if (given) return String(given)
    var m = styleMeta(name)
    return m && m.title ? m.title : String(name || '').charAt(0).toUpperCase() + String(name || '').slice(1)
  }
  function clampPx(v, lo, hi, d) { v = +v || d; return Math.max(lo, Math.min(hi, round(v))) }

  function rels(list) {
    return XMLDECL + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      list.map(function (r) { return '<Relationship Id="' + r[0] + '" Type="' + (r[1].indexOf('http') === 0 ? r[1] : REL + r[1]) + '" Target="' + x(r[2]) + '"/>' }).join('') +
      '</Relationships>'
  }
  function contentTypes(overrides) {
    return XMLDECL + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Default Extension="png" ContentType="image/png"/>' +
      '<Default Extension="svg" ContentType="image/svg+xml"/>' +
      overrides.map(function (o) { return '<Override PartName="' + o[0] + '" ContentType="' + o[1] + '"/>' }).join('') +
      '</Types>'
  }
  // No timestamps on purpose: same input -> byte-identical package (apart from the browser's PNG encoder).
  function coreXml(title, subject, keywords) {
    return XMLDECL + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      '<dc:title>' + x(title) + '</dc:title><dc:subject>' + x(subject) + '</dc:subject><dc:creator>with icons</dc:creator>' +
      '<cp:keywords>' + x(keywords) + '</cp:keywords><dc:description>Icon from with icons (withicons.com)</dc:description>' +
      '</cp:coreProperties>'
  }
  function appXml(extra) {
    return XMLDECL + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">' +
      '<Application>with icons</Application>' + (extra || '') + '</Properties>'
  }

  /* ───────── pictures: SVG (vector) + PNG (fallback) ───────── */
  function toBytes(blob) {
    if (!blob) return Promise.reject(new Error('PNG encoding failed'))
    if (blob instanceof Uint8Array) return Promise.resolve(blob)
    if (blob.arrayBuffer) return blob.arrayBuffer().then(function (b) { return new Uint8Array(b) })
    return new Promise(function (ok, no) { var r = new FileReader(); r.onload = function () { ok(new Uint8Array(r.result)) }; r.onerror = no; r.readAsArrayBuffer(blob) })
  }
  function pngFromSvg(svg, px) {
    if (typeof X.pngFromSvg === 'function') return Promise.resolve(X.pngFromSvg(svg, px, px)).then(toBytes)
    return X.rasterize(svg, px, px).then(function (c) { return X.canvasBlob(c, 'image/png') }).then(toBytes)
  }
  function canRaster() {
    if (typeof X.pngFromSvg === 'function') return true
    try {
      if (!D || typeof Image === 'undefined' || typeof X.rasterize !== 'function') return false
      var c = D.createElement('canvas')
      return !!(c.getContext && c.getContext('2d') && c.toBlob)
    } catch (e) { return false }
  }
  // svgString's background <rect> inherits the root's stroke="currentColor" in stroked styles (line, duo, engrave,
  // blueprint, sketch, kawaii), which frames the tile. Give that first rect stroke="none" unless it already has a stroke.
  function unstrokeBg(svg, bg) {
    if (!bg) return svg
    return svg.replace(/<rect (x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*")([^>]*)\/>/, function (m, a, rest) {
      return /\sstroke=/.test(rest) ? m : '<rect ' + a + ' stroke="none"' + rest + '/>'
    })
  }
  // One picture = { svg: string, png: Uint8Array } for an icon variant.
  function picture(v, ctx, opts, px, displayPx) {
    var base = { name: ctx.name, title: ctx.title, style: v.style, inner: v.inner, root: v.root, color: ctx.color, vars: ctx.vars }
    var o = { background: opts.background || null, padding: opts.padding || 0, flat: true }
    var svgEmbed = '<?xml version="1.0" encoding="UTF-8"?>\n' + unstrokeBg(X.svgString(base, Object.assign({}, o, { size: displayPx })), o.background)
    var svgRaster = unstrokeBg(X.svgString(base, Object.assign({}, o, { size: px })), o.background)
    return pngFromSvg(svgRaster, px).then(function (png) { return { svg: svgEmbed, png: png } })
  }
  function blip(pngRid, svgRid) {
    return '<a:blip r:embed="' + pngRid + '"><a:extLst><a:ext uri="' + SVG_EXT + '"><asvg:svgBlip xmlns:asvg="' + NS_SVG + '" r:embed="' + svgRid + '"/></a:ext></a:extLst></a:blip>'
  }

  /* ───────── variants (all styles) for the sheet ───────── */
  var loading = {}
  function loadScript(src) {
    if (loading[src]) return loading[src]
    return (loading[src] = new Promise(function (ok) {
      var s = D.createElement('script'); s.src = src; s.async = true
      s.onload = function () { ok(true) }; s.onerror = function () { ok(false) }; D.head.appendChild(s)
    }))
  }
  function siteUrl(p) { return (G.WI && G.WI.base) ? G.WI.base + p : scriptBase + p }
  function svgStore() { return G.WITH_SVG || G.EGI_SVG || null }
  function variants(ctx, opts) {
    var given = opts.variants || ctx.variants
    if (given && given.length) return Promise.resolve(given.filter(function (v) { return v && v.inner != null }))
    var self = { style: ctx.style, inner: ctx.inner, root: ctx.root }
    var W = G && G.WITH
    if (!D || !W || !W.styles || !W.styles.length) return Promise.resolve([self])
    return Promise.all(W.styles.map(function (s) {
      if (s.name === ctx.style) return Promise.resolve(self)
      var have = function () { var st = svgStore(); return st && st[s.name] && st[s.name][ctx.name] != null }
      var p = have() ? Promise.resolve(true) : loadScript(siteUrl('data/style-' + s.name + '.js'))
      return p.then(function () { return have() ? { style: s.name, title: s.title, inner: svgStore()[s.name][ctx.name], root: s.root || {} } : null })
    })).then(function (vs) { return vs.filter(Boolean) })
  }

  /* ───────── PowerPoint ───────── */
  var SW = 12192000, SH = 6858000 // 16:9 (13.333 x 7.5 in)
  var SP_ID = 1
  function xfrm(xx, y, w, h) { return '<a:xfrm><a:off x="' + round(xx) + '" y="' + round(y) + '"/><a:ext cx="' + round(w) + '" cy="' + round(h) + '"/></a:xfrm>' }
  function grpRoot() { return '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>' }
  function run(text, sz, color, bold) {
    return '<a:r><a:rPr lang="en-US" sz="' + sz + '"' + (bold ? ' b="1"' : '') + ' dirty="0">' + (color ? '<a:solidFill><a:srgbClr val="' + color + '"/></a:solidFill>' : '') + '</a:rPr><a:t>' + x(text) + '</a:t></a:r>'
  }
  function titleSp(id, text, y, h) {
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="Title ' + id + '"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>' +
      '<p:spPr>' + xfrm(609600, y, SW - 1219200, h) + '</p:spPr>' +
      '<p:txBody><a:bodyPr anchor="ctr"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/>' + run(text, 3600, null, false) + '</a:p></p:txBody></p:sp>'
  }
  function textSp(id, name, text, xx, y, w, h, sz, color, bold) {
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="' + x(name) + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>' +
      '<p:spPr>' + xfrm(xx, y, w, h) + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>' +
      '<p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="t"><a:noAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/>' + run(text, sz, color, bold) + '</a:p></p:txBody></p:sp>'
  }
  function picSp(id, name, descr, pngRid, svgRid, xx, y, w, h) {
    return '<p:pic><p:nvPicPr><p:cNvPr id="' + id + '" name="' + x(name) + '" descr="' + x(descr) + '"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>' +
      '<p:blipFill>' + blip(pngRid, svgRid) + '<a:stretch><a:fillRect/></a:stretch></p:blipFill>' +
      '<p:spPr>' + xfrm(xx, y, w, h) + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
  }
  function slideXml(shapes) {
    return XMLDECL + '<p:sld xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '"><p:cSld><p:spTree>' + grpRoot() + shapes +
      '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>'
  }
  var THEME = XMLDECL + '<a:theme xmlns:a="' + NS_A + '" name="with icons"><a:themeElements>' +
    '<a:clrScheme name="with icons"><a:dk1><a:srgbClr val="111827"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F3F4F6"/></a:lt2>' +
    '<a:accent1><a:srgbClr val="4F46E5"/></a:accent1><a:accent2><a:srgbClr val="0EA5E9"/></a:accent2><a:accent3><a:srgbClr val="10B981"/></a:accent3><a:accent4><a:srgbClr val="F59E0B"/></a:accent4><a:accent5><a:srgbClr val="EF4444"/></a:accent5><a:accent6><a:srgbClr val="8B5CF6"/></a:accent6>' +
    '<a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme>' +
    '<a:fontScheme name="with icons"><a:majorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>' +
    '<a:fmtScheme name="with icons"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>' +
    '<a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>' +
    '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>' +
    '<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>' +
    '</a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>'
  var TITLE_PH = '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>' +
    '<p:spPr>' + xfrm(609600, 365760, SW - 1219200, 1005840) + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>' +
    '<p:txBody><a:bodyPr anchor="ctr"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>Title</a:t></a:r></a:p></p:txBody></p:sp>'
  var LVL = '<a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr>'
  var MASTER = XMLDECL + '<p:sldMaster xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '"><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>' + grpRoot() + TITLE_PH + '</p:spTree></p:cSld>' +
    '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
    '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>' +
    '<p:txStyles><p:titleStyle><a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:lnSpc><a:spcPct val="90000"/></a:lnSpc><a:spcBef><a:spcPct val="0"/></a:spcBef><a:buNone/>' +
    '<a:defRPr sz="3600" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl1pPr></p:titleStyle>' +
    '<p:bodyStyle><a:lvl1pPr marL="0" indent="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPts val="1000"/></a:spcBef><a:buNone/>' + LVL + '</a:lvl1pPr></p:bodyStyle>' +
    '<p:otherStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr><a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">' + LVL + '</a:lvl1pPr></p:otherStyle></p:txStyles></p:sldMaster>'
  var LAYOUT = XMLDECL + '<p:sldLayout xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '" type="titleOnly" preserve="1"><p:cSld name="Title Only"><p:spTree>' + grpRoot() +
    '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>Title</a:t></a:r></a:p></p:txBody></p:sp>' +
    '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>'

  // slides: [{ xml, media: [mediaIndex...] }], media: [{ svg, png }] -> pptx bytes
  function pptxPackage(title, subject, slides, media) {
    var files = [], n = slides.length
    var ov = [['/ppt/presentation.xml', CT + 'presentationml.presentation.main+xml'], ['/ppt/slideMasters/slideMaster1.xml', CT + 'presentationml.slideMaster+xml'],
      ['/ppt/slideLayouts/slideLayout1.xml', CT + 'presentationml.slideLayout+xml'], ['/ppt/theme/theme1.xml', CT + 'theme+xml'],
      ['/ppt/presProps.xml', CT + 'presentationml.presProps+xml'], ['/ppt/viewProps.xml', CT + 'presentationml.viewProps+xml'], ['/ppt/tableStyles.xml', CT + 'presentationml.tableStyles+xml'],
      ['/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'], ['/docProps/app.xml', CT + 'extended-properties+xml']]
    slides.forEach(function (s, i) { ov.push(['/ppt/slides/slide' + (i + 1) + '.xml', CT + 'presentationml.slide+xml']) })
    files.push({ name: '[Content_Types].xml', data: contentTypes(ov) })
    files.push({ name: '_rels/.rels', data: rels([['rId1', 'officeDocument', 'ppt/presentation.xml'], ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'], ['rId3', 'extended-properties', 'docProps/app.xml']]) })
    files.push({ name: 'docProps/core.xml', data: coreXml(title, subject, 'icon, ' + subject) })
    files.push({ name: 'docProps/app.xml', data: appXml('<PresentationFormat>Widescreen</PresentationFormat><Slides>' + n + '</Slides>') })
    var pres = XMLDECL + '<p:presentation xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '" saveSubsetFonts="1">' +
      '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>' +
      slides.map(function (s, i) { return '<p:sldId id="' + (256 + i) + '" r:id="rId' + (10 + i) + '"/>' }).join('') + '</p:sldIdLst>' +
      '<p:sldSz cx="' + SW + '" cy="' + SH + '"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr><a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">' + LVL + '</a:lvl1pPr></p:defaultTextStyle></p:presentation>'
    files.push({ name: 'ppt/presentation.xml', data: pres })
    var prels = [['rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'], ['rId2', 'theme', 'theme/theme1.xml'], ['rId3', 'presProps', 'presProps.xml'], ['rId4', 'viewProps', 'viewProps.xml'], ['rId5', 'tableStyles', 'tableStyles.xml']]
    slides.forEach(function (s, i) { prels.push(['rId' + (10 + i), 'slide', 'slides/slide' + (i + 1) + '.xml']) })
    files.push({ name: 'ppt/_rels/presentation.xml.rels', data: rels(prels) })
    files.push({ name: 'ppt/presProps.xml', data: XMLDECL + '<p:presentationPr xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '"/>' })
    files.push({ name: 'ppt/viewProps.xml', data: XMLDECL + '<p:viewPr xmlns:a="' + NS_A + '" xmlns:r="' + NS_R + '" xmlns:p="' + NS_P + '"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>' })
    files.push({ name: 'ppt/tableStyles.xml', data: XMLDECL + '<a:tblStyleLst xmlns:a="' + NS_A + '" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>' })
    files.push({ name: 'ppt/slideMasters/slideMaster1.xml', data: MASTER })
    files.push({ name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'], ['rId2', 'theme', '../theme/theme1.xml']]) })
    files.push({ name: 'ppt/slideLayouts/slideLayout1.xml', data: LAYOUT })
    files.push({ name: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', data: rels([['rId1', 'slideMaster', '../slideMasters/slideMaster1.xml']]) })
    files.push({ name: 'ppt/theme/theme1.xml', data: THEME })
    slides.forEach(function (s, i) {
      files.push({ name: 'ppt/slides/slide' + (i + 1) + '.xml', data: s.xml })
      var r = [['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml']]
      s.media.forEach(function (m, k) {
        r.push(['rId' + (2 + 2 * k), 'image', '../media/image' + (m + 1) + '.png'])
        r.push(['rId' + (3 + 2 * k), 'image', '../media/image' + (m + 1) + '.svg'])
      })
      files.push({ name: 'ppt/slides/_rels/slide' + (i + 1) + '.xml.rels', data: rels(r) })
    })
    media.forEach(function (m, i) {
      files.push({ name: 'ppt/media/image' + (i + 1) + '.png', data: m.png })
      files.push({ name: 'ppt/media/image' + (i + 1) + '.svg', data: m.svg })
    })
    return X.zip(files)
  }
  // Layout of a single-icon slide: title on top, icon centred, style caption below.
  function iconSlide(title, styleLabel, descr) {
    var pic = 3657600, top = 1554480
    return slideXml(
      titleSp(2, title, 365760, 1005840) +
      picSp(3, 'Icon', descr, 'rId2', 'rId3', (SW - pic) / 2, top, pic, pic) +
      textSp(4, 'Style', styleLabel + ' style', 609600, top + pic + 228600, SW - 1219200, 457200, 1600, '6B7280', false))
  }
  function pptxOut(ctx, bytes, suffix) {
    return { data: bytes, filename: X.filename(ctx, suffix, 'pptx'), mime: CT + 'presentationml.presentation' }
  }
  function pngPx(opts, d) { return clampPx(opts.size, 128, 2048, d) }

  /* ───────── Word ───────── */
  var NS_W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  function docxPackage(ctx, opts, pic, title, styleLabel) {
    var inches = +opts.inches > 0 ? Math.min(6, +opts.inches) : 1.5
    var e = round(inches * EMU_IN), descr = title + ' icon, ' + styleLabel + ' style'
    var drawing = '<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + e + '" cy="' + e + '"/><wp:effectExtent l="0" t="0" r="0" b="0"/>' +
      '<wp:docPr id="1" name="' + x(title) + '" descr="' + x(descr) + '"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="' + NS_A + '" noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
      '<a:graphic xmlns:a="' + NS_A + '"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:nvPicPr><pic:cNvPr id="1" name="' + x(X.filename(ctx, null, 'svg')) + '" descr="' + x(descr) + '"/><pic:cNvPicPr><a:picLocks noChangeAspect="1"/></pic:cNvPicPr></pic:nvPicPr>' +
      '<pic:blipFill>' + blip('rId1', 'rId2') + '<a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + e + '" cy="' + e + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>'
    var doc = XMLDECL + '<w:document xmlns:w="' + NS_W + '" xmlns:r="' + NS_R + '" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>' +
      '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r>' + drawing + '</w:r></w:p>' +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>'
    var styles = XMLDECL + '<w:styles xmlns:w="' + NS_W + '"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault>' +
      '<w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style></w:styles>'
    var files = [
      { name: '[Content_Types].xml', data: contentTypes([['/word/document.xml', CT + 'wordprocessingml.document.main+xml'], ['/word/styles.xml', CT + 'wordprocessingml.styles+xml'],
        ['/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'], ['/docProps/app.xml', CT + 'extended-properties+xml']]) },
      { name: '_rels/.rels', data: rels([['rId1', 'officeDocument', 'word/document.xml'], ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'], ['rId3', 'extended-properties', 'docProps/app.xml']]) },
      { name: 'docProps/core.xml', data: coreXml(title + ' icon', styleLabel + ' style', 'icon, ' + ctx.name + ', ' + ctx.style) },
      { name: 'docProps/app.xml', data: appXml() },
      { name: 'word/document.xml', data: doc },
      { name: 'word/_rels/document.xml.rels', data: rels([['rId1', 'image', 'media/image1.png'], ['rId2', 'image', 'media/image1.svg'], ['rId3', 'styles', 'styles.xml']]) },
      { name: 'word/styles.xml', data: styles },
      { name: 'word/media/image1.png', data: pic.png },
      { name: 'word/media/image1.svg', data: pic.svg }
    ]
    return X.zip(files)
  }

  /* ───────── registrations ───────── */
  var common = { group: 'office', transparent: true, animated: false, available: canRaster }

  X.register(Object.assign({}, common, {
    id: 'pptx', label: 'PowerPoint slide', ext: 'pptx', mime: CT + 'presentationml.presentation',
    audience: ['presentations'],
    note: 'A ready 16:9 slide with the icon centred. Stays sharp and recolourable in PowerPoint 365; opens in Keynote and Google Slides too.',
    run: function (ctx, opts) {
      opts = opts || {}
      var title = titleOf(ctx), st = styleTitle(ctx.style)
      return picture({ style: ctx.style, inner: ctx.inner, root: ctx.root }, ctx, opts, pngPx(opts, 1024), 384).then(function (pic) {
        var bytes = pptxPackage(title, st + ' style', [{ xml: iconSlide(title, st, title + ' icon, ' + st + ' style'), media: [0] }], [pic])
        return pptxOut(ctx, bytes)
      })
    }
  }))

  X.register(Object.assign({}, common, {
    id: 'pptx-sheet', label: 'PowerPoint: all styles', ext: 'pptx', mime: CT + 'presentationml.presentation',
    audience: ['presentations', 'designers'],
    note: 'A deck showing this icon in every style side by side, then one slide per style. Handy for picking a look with your team.',
    run: function (ctx, opts) {
      opts = opts || {}
      var title = titleOf(ctx), px = pngPx(opts, 768)
      return variants(ctx, opts).then(function (vs) {
        if (!vs.length) throw new Error('no styles available for ' + ctx.name)
        return Promise.all(vs.map(function (v) { return picture(v, ctx, opts, px, 192) })).then(function (pics) {
          // overview grid
          var n = vs.length, cols = n <= 6 ? n : Math.min(6, Math.ceil(n / 2)), rows = Math.ceil(n / cols)
          var top = 1463040, bottom = SH - 365760, margin = 609600
          var cellW = (SW - 2 * margin) / cols, cellH = (bottom - top) / rows
          var labelH = 320040, pic = Math.min(cellW * 0.7, (cellH - labelH) * 0.82, 1645920)
          var shapes = titleSp(2, title + ' in ' + n + ' style' + (n === 1 ? '' : 's'), 365760, 1005840), id = 3
          var media = []
          vs.forEach(function (v, i) {
            var c = i % cols, r = Math.floor(i / cols)
            var cx = margin + cellW * c + cellW / 2, y0 = top + cellH * r + (cellH - pic - labelH) / 2
            var label = styleTitle(v.style, v.title), current = v.style === ctx.style
            shapes += picSp(id++, label, title + ' icon, ' + label + ' style', 'rId' + (2 + 2 * i), 'rId' + (3 + 2 * i), cx - pic / 2, y0, pic, pic)
            shapes += textSp(id++, label + ' label', label, cx - cellW / 2, y0 + pic + 91440, cellW, labelH, 1400, current ? '111827' : '4B5563', current)
            media.push(i)
          })
          var slides = [{ xml: slideXml(shapes), media: media }]
          vs.forEach(function (v, i) {
            var label = styleTitle(v.style, v.title)
            slides.push({ xml: iconSlide(title, label, title + ' icon, ' + label + ' style'), media: [i] })
          })
          return pptxOut(ctx, pptxPackage(title, 'all styles', slides, pics), 'styles')
        })
      })
    }
  }))

  X.register(Object.assign({}, common, {
    id: 'docx', label: 'Word document', ext: 'docx', mime: CT + 'wordprocessingml.document',
    audience: ['presentations', 'print'],
    note: 'A Word document with the icon placed inline, ready to copy into reports, briefs and handouts. Vector in Word 365, picture elsewhere.',
    run: function (ctx, opts) {
      opts = opts || {}
      var title = titleOf(ctx), st = styleTitle(ctx.style)
      return picture({ style: ctx.style, inner: ctx.inner, root: ctx.root }, ctx, opts, pngPx(opts, 1024), 144).then(function (pic) {
        return { data: docxPackage(ctx, opts, pic, title, st), filename: X.filename(ctx, null, 'docx'), mime: CT + 'wordprocessingml.document' }
      })
    }
  }))

  return X
})
