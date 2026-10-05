// `npx -y @withicons/mcp` — MCP server over stdio.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer, VERSION } from './server.mjs'

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--version') || argv.includes('-v')) { console.log(VERSION); return }
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`withicons-mcp ${VERSION} — MCP server for with icons (withicons.com)\n\nUsage: npx -y @withicons/mcp\nSpeaks MCP over stdio. Tools: search_icons, get_icon, list_palettes, animate_icon, export_icon (files: svg, png, pdf, pptx, animated gif / apng / PowerPoint, Lottie, ...), list_styles, list_categories, resolve_icon.\nResources: icon://<style>/<name>.svg`)
    return
  }
  const server = createServer()
  await server.connect(new StdioServerTransport())
  // logs go to stderr: stdout is the protocol channel
  console.error(`withicons-mcp ${VERSION} ready (stdio)`)
}

main().catch(e => { console.error(e); process.exit(1) })
