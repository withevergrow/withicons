// The line bell as a design tool might export it (BEFORE), and the same drawing after SVGO 4 with the post's icon
// config (AFTER: viewBox, width/height and currentColor kept, ids, metadata and empty groups gone, numbers shortened, attributes sorted, the two paths not merged). Their real byte
// counts are measured, not typed, so the size badges stay honest. Not a spec (leading underscore).
export const BEFORE = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Generator: Design Tool 27.4.1, SVG Export Plug-In -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve" fill="none" stroke="currentColor" stroke-width="1.7500000" stroke-linecap="round" stroke-linejoin="round">
<metadata>
  <rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:title>bell</dc:title></cc:Work></rdf:RDF>
</metadata>
<defs id="defs_1"></defs>
<g id="Group_12"></g>
<g id="Layer_2">
  <path id="Path_31" d="M6.0000000,16.5000000L6.0000000,11.0000000C6.0000000,7.6862915,8.6862915,5.0000000,12.0000000,5.0000000C15.3137085,5.0000000,18.0000000,7.6862915,18.0000000,11.0000000L18.0000000,16.5000000L19.5000000,18.5000000L4.5000000,18.5000000Z"/>
  <path id="Path_32" d="M9.5000000,18.5000000C9.5000000,19.8807119,10.6192881,21.0000000,12.0000000,21.0000000C13.3807119,21.0000000,14.5000000,19.8807119,14.5000000,18.5000000"/>
</g>
</svg>
`
export const AFTER = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15Z"/><path d="M9.5 18.5a2.5 2.5 0 0 0 5 0"/></svg>`
export const kb = s => `${(Buffer.byteLength(s) / 1024).toFixed(2)} KB`
export const bytes = s => `${Buffer.byteLength(s).toLocaleString('en-US')} bytes`
