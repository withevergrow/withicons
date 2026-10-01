# Security policy

## Supported versions

with icons is in `0.x`. Only the latest published minor version of each `@withicons/*` package (and the
`withicons` CLI) receives security fixes. The website and the hosted MCP endpoint
(`https://withicons.com/mcp`) are always the latest version.

## Reporting a vulnerability

**Please do not open a public issue.** Report privately via GitHub:
[Security -> Report a vulnerability](https://github.com/withevergrow/withicons/security/advisories/new).

Include what is affected (package and version, URL, or MCP tool), how to reproduce it, and the impact you see.
You will get an acknowledgement within 3 working days and a status update at least weekly until it is resolved.
We credit reporters in the advisory unless you prefer to stay anonymous.

## Scope

In scope:

- the npm packages under `@withicons/*` and `withicons` (for example: injection through an icon `name`,
  `title` or attribute that leads to XSS, prototype pollution, or a malicious dependency),
- the generated SVG output (scriptable content in SVGs),
- `https://withicons.com` including `/api/*` and the remote MCP server at `/mcp`,
- the release pipeline (`.github/workflows`, `scripts/publish.mjs`) and npm provenance.

Out of scope: denial of service by volume, findings from automated scanners without a working proof of
concept, missing headers on pages that serve no user data, and social engineering.

## Supply chain

Packages are published from GitHub Actions with npm Trusted Publishing and provenance. You can verify any
release with `npm audit signatures`. The packages have no runtime dependencies besides their framework peer.
