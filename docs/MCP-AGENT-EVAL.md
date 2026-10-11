# MCP agent evaluation: five pitch decks (0.4.0)

Five agents with no shared memory each built a 5-7 slide PowerPoint pitch deck, taking every icon from the with icons
MCP server. Each got a one-paragraph client brief and nothing else about the product: it knew only what `info` (server
instructions + tool schemas) told it. Three used the published local server (`npx -y @withicons/mcp` 0.4.0), two the
hosted one (`https://withicons.com/mcp`). Every deck opens and renders in PowerPoint.

| deck | server | icon style | MCP calls | self-rated (discoverability / search / slide export / overall) |
|---|---|---|---|---|
| Slow Rise Bakehouse (sourdough bakery) | local | duo | 38 | 4 / 2 / 4 / 3 |
| Tiny Trails Day Care (nature day care) | local | duo | 33 | 5 / 3 / 4 / 4 |
| BrightSide Family Dental (brand colours) | local | solid | 41 | 4 / 3 / 4 / 4 |
| Mithai & Crumb (Indian sweets bakery) | hosted | rangoli + palette | 57 | 4 / 3.5 / 3 / 4 |
| Little Sparks (inclusive day care) | hosted | suite + skin-tone avatars | 28 | 4 / 3.5 / 3 / 4 |

No tool call failed once connected. Search was the lowest rating for the three local-server agents, slide export the
lowest for the two hosted ones. Ratings are self-reported; n = 5.

How the test was run: a small stand-in MCP client (one session per call), `pptxgenjs`, PowerPoint for rendering.
Two caveats: the stand-in client opened a new session per call, which costs about 3-4 HTTP requests per tool call and
made the hosted rate limit look worse than a real client would see; and it did not log connect-time failures (the 429s).

## Priorities

Status: **done** = merged and tested on this branch; **partial** says what is left; **open** = not started. Items that
change the hosted server take effect only after a deploy (see "Deploying this round" below).

### P0: agents were misled or blocked

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 1 | Search pads results with guesses and calls them matches. "croissant" returned cake, cookie, donut (low confidence); "bread" returned the same at *medium* confidence through a related concept. | 5 of 5 | `search_icons` / `searchIcons` / `withicons search` return exact matches in `results`, say `noExactMatch` when none, and put up to 5 similar icons in `additional` (no snippet). Beside real matches, low-confidence guesses are left out. | **done** |
| 2 | Hosted rate limit (WAF, per IP, every request counted) was 200 per 5 minutes: two agents hit 429 mid-task. | 2 of 2 hosted | Default `WafRateLimitPer5Min` 1000 in `infra/site.yaml`; docs, skill text and the 429 message follow it. | **done in the template**; the live WAF changes only when the CloudFormation stack is updated (`WafRateLimitPer5Min=1000`) |
| 3 | `duo` documentation did not match behaviour: only `c1` paints it (a 20% tone), `tint` / `accent` roles were ignored, and `export_icon` gave no warning. | 3 of 5 | `export_icon` returns a `colorReport` per icon and style (the colours that changed nothing, the roles a theme or borrowed palette landed on); `list_styles` gives every style a `colours` entry read from the rendered icons (roles, variables, solid / tone / gradient, whether a brand hex shows exactly); instructions and tool descriptions are generated from it. | **done** |
| 4 | Hosted `export_icon` could not make PNG, the format slides need. | 2 of 2 hosted | `@resvg/resvg-wasm` behind the same `Resvg` interface in the Lambda bundle: `png`, `png-set`, `ico`, `favicon-pack`, `pptx`, `docx` and `animated-svg` are made on the hosted server (byte-identical to the CLI in tests). | **partial**: `gif`, `apng`, `pptx-animated` and `pptx-sheet` still answer with the CLI command (0.5 to 4.3 s locally, slower on a Lambda). Timings on the real arm64 Lambda are not measured. Takes effect on deploy. |

### P1: slows every agent down

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 5 | No slide recipe. Nothing said which format to embed in a `.pptx`. | 3 of 5 said so; 5 of 5 inferred it | A "Making slides and docs" paragraph in the server instructions (local and hosted wording), a line in the `export_icon` `format` description, and a note from `recommend_styles({ use: 'slides' })`. | **done** |
| 6 | Icon gaps for these businesses. | 5 of 5 | 16 new icons with motion and palettes: `bread`, `baguette`, `croissant`, `wheat`, `oven`, `rolling-pin`, `playground`, `crayon`, `stroller`, `baby-bottle`, `dental-chair`, `tooth-crown`, `worried`, `mosque`, `avatar-woman-hijab`, `avatar-person-wheelchair` (750 icons), with default colours in 19 colourful styles. | **partial**: `playground` is a slide only (no swing fits at 16 px); the wheelchair avatar is about 15% smaller than the other avatars; in duo, adult and child avatars still differ mainly by hairstyle (render children at about 80% size, or redraw them in a later release) |
| 7 | No preview. | 5 of 5 | `preview_icons`: one labelled sheet of up to 24 icons x 6 styles (PNG locally, SVG on the hosted server). | **done** |
| 8 | Phrases match single words ("children playing" -> play, audio-lines; "nature-based day care" -> dog; "shop counter" -> rotate-ccw). | 5 of 5 | Search 1.6 reads multi-word queries as phrases (head word first, function words and "-based" ignored, a word in another sense no longer wins); 12 agent phrases and 7 guard phrases added to the eval (top-1 hits 33% to 78%, no bad top-5 results left); the 1125 existing queries are equal or better. | **partial**: "waiting list", "working parent", "staff to child ratio", "anxious worried patient" and "unit economics" / "market size" still lead with weak or no icons (they need icons or data, not ranking) |
| 9 | `search_icons` with `format: svg` dumps SVG bodies. | 3 of 5 | `format: "none"` (names, categories, reasons, urls); one documented rule for which results carry a snippet. | **done** |

### P2: friction

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 10 | Brand colours across a set (wrong `mainRole`, per-icon palette ids, per-icon clay roles, stray borrowed accents, one export per colour). | 4 of 5 | `theme` (`"#hex"` or `{ primary, secondary?, tertiary?, ink? }`) on `get_icon` and `export_icon` puts the brand colours on each icon's own parts by size in any style; `per_icon` colours individual icons; `mainRole` is measured on the render; borrowed palettes are matched by part size. CLI: `--theme`, `--per-icon`. | **done** (a theme also recolours people's skin; `per_icon` with `c1` keeps it) |
| 11 | `recommend_styles` is large, ignored "exact brand colours" and ranked christmas first for four festivals. | 2 of 5 | `compact: true` (about 1 to 2 KB; also `/api/recommend?compact=1`); "exact brand colours" ranks flat styles first with a note; several festivals are ranked by coverage with a note on gaps (Eid has no style). | **done**; the default (full) output is only about 5% smaller, `compact` is the short form |
| 12 | No-match suggestions are junk ("nervous" -> angry, arrow-left). | 3 of 5 | `suggestions`, `resolve_icon.nearest` and the `get_icon` "Did you mean" keep only names near the spelling or the meaning (none of 89 unmatched words got a suggestion; 57 of 57 typos still did). | **done** |

### Cosmetic leftovers from the new icons (reported by the icon agents)
`utsav` tooth-crown roots stay magenta and `kawaii` paints the crown and tooth in one colour (style limits); `anime` rolling-pin
has pink knobs; `soft3d` wheat has a dark glass patch in the lowest grain; `halloween` wheat is too thin to show colour; in
`pixel` the croissant is weak and the wheat thin; the worried face and the dental chair are busy at 16 px; "prayer" and
"worship" rank the mosque marginally above the puja icons.

## Re-running the evaluation

The harness (stand-in client, five briefs, render and call-log scripts) lives in `.tmp/pitch-decks/` and is not part of
the repository. To measure the fixes above, re-run the same five briefs and compare: stumbles per deck, MCP calls per
deck, queries that fell back to a stand-in icon, and the self-ratings. Log connect-time failures this time, and reuse one
MCP session per agent so the rate limit is measured fairly.

## Deploying this round

Pushing a branch deploys nothing. Only a push to `main` runs `.github/workflows/deploy-site.yml`, and nothing runs CloudFormation
for you.

1. **Merge to `main`.** Open a PR from this branch: CI runs *Build, lint icons, test packages* and *Lint CloudFormation*. The merge
   triggers `deploy-site.yml` (environment `production`, OIDC role `AWS_DEPLOY_ROLE_ARN`), which builds, uploads the site (750 icon
   pages), replaces the API Lambda code and invalidates `/api/*`. The Lambda zip is now 23 MB (108.7 MB unzipped; limits 50 and
   250) and carries `resvg.wasm` next to `lambda.mjs`; `scripts/deploy.mjs` stops if the wasm is missing and smoke-tests a PNG.
   This ships the hosted MCP changes: the new icons, the exact / additional search split, the suggestion floor, `preview_icons`,
   `theme` and `per_icon`, hosted PNG and the slide recipe.
2. **Raise the WAF limit** (`infra/site.yaml` is not part of the workflow; the live limit is still 200 until you do this):
   ```bash
   aws cloudformation deploy --region us-east-1 --profile withicons --stack-name withicons-site --template-file infra/site.yaml      --capabilities CAPABILITY_NAMED_IAM --parameter-overrides WafRateLimitPer5Min=1000
   aws cloudformation describe-stacks --region us-east-1 --stack-name withicons-site      --query "Stacks[0].Parameters[?ParameterKey=='WafRateLimitPer5Min'].ParameterValue" --output text    # 1000
   ```
   `deploy` keeps every parameter you do not pass. Any order relative to step 1 is fine.
3. **Verify on the live site.**
   ```bash
   curl -s "https://withicons.com/api/search?q=sheep"            # noExactMatch: true, no junk suggestions
   curl -s "https://withicons.com/api/search?q=bread&format=none" # bread first, no snippets
   curl -s "https://withicons.com/api/recommend?for=pitch+deck+for+a+dentist&compact=1" | head -c 400
   npx @modelcontextprotocol/inspector                            # https://withicons.com/mcp: ten tools; export_icon
                                                                  # {name:"cake",style:"clay",format:"png"} returns a PNG
                                                                  # resource; preview_icons returns an SVG sheet
   ```
   Not verifiable without AWS: render time and memory on the real arm64 Lambda (measured locally: wasm start 60 to 130 ms, a
   512 px icon 30 to 190 ms, peak about 205 MB of the 512 MB), and how each MCP client saves the base64 PNG resources.
4. **Release to npm** (the local MCP server, CLI and search engine only change for users after this): choose the version (0.5.0:
   a new tool, new icons, new search behaviour), move the `Unreleased` changelog block under it, set `withiconsVersion` in the root
   `package.json`, run the gates below, commit, tag `v0.5.0` and push the tag: `release.yml` publishes all packages in lockstep.
   ```bash
   npm ci && node forge/build.mjs
   node forge/tools/check.mjs && node forge/tools/check-motion.mjs && node scripts/skill-sync.mjs --check
   npm test --workspaces --if-present && node scripts/publish.mjs --dry-run
   ```
   Package size to watch: with per-icon Angular typings `@withicons/angular` is at 51,113 files against a budget of 52,000
   (about 26 more icons); `@withicons/svelte` is at 26,470.
5. **Rollback.** Revert the merge commit on `main` (the workflow redeploys); S3 keeps 30 days of old versions; the WAF limit is
   one more `deploy` with `WafRateLimitPer5Min=200`.
