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

Status: **done** = in the commit that added this file; **open** = not started.

### P0: agents were misled or blocked

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 1 | Search pads results with guesses and calls them matches. "croissant" returned cake, cookie, donut (low confidence); "bread" returned the same at *medium* confidence through a related concept. An agent cannot tell "no icon for this" from "here are icons". | 5 of 5 | `search_icons` / `searchIcons` / `withicons search` return exact matches in `results`, say `noExactMatch` when none, and put up to 5 similar icons in `additional` (loosely related, no snippet). "Exact" = high confidence, or medium confidence that is not a concept expansion. | **done** |
| 2 | Hosted rate limit (WAF, per IP, every request counted) was 200 per 5 minutes: two agents hit 429 mid-task, 57 calls was enough. | 2 of 2 hosted | Default `WafRateLimitPer5Min` 1000 in `infra/site.yaml`; docs, skill text and the 429 message follow it. The deploy cache warm stays capped at 180. | **done in the template**; the live WAF changes only when the CloudFormation stack is updated (`WafRateLimitPer5Min=1000`) |
| 3 | `duo` documentation does not match behaviour. Instructions list `tint` and `accent` as duo variables; only `c1` paints it (about 20% opacity), `tint` / `accent` are ignored, and `export_icon` gave no warning, so a first export came out grey. | 3 of 5 | Make `export_icon` return the same `ignored` colours warning as `get_icon`; correct the duo line in `list_styles` / instructions (or map `tint` to `c1` in duo). Add a "which roles does each style honour" table to `list_styles`. | open |
| 4 | Hosted `export_icon` cannot make PNG (the format slides need); it answers with an `npx withicons export` command. Agents that ran it succeeded, one rasterised SVG itself. | 2 of 2 hosted | Short term: say so in the hosted instructions and in `recommend_styles({ use: 'slides' })` ("for slides use the local server or the CLI"). Long term: render PNG in the Lambda (resvg-wasm) or return download URLs. | open |

### P1: slows every agent down

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 5 | No slide recipe. Nothing says which format to embed in a `.pptx`; the `pptx` export is a one-icon deck that cannot be merged. All five ended on "PNG, 512 px, transparent". | 3 of 5 said so; 5 of 5 inferred it | A "slides" paragraph in the server instructions: PNG 512 px, `names[]` + one `colors` + `out_dir` in one call, display sizes that stay crisp, what `pptx` / `pptx-sheet` are for. | open |
| 6 | Icon gaps for these businesses: bread, loaf, baguette, croissant, wheat, oven; playground, crayon, stroller, baby bottle; dental chair, dental crown, anxious / nervous face; mosque (Eid); hijab, wheelchair and child-versus-adult avatars. Stand-ins were a cooking pot for sourdough and a royal crown for "same-day crowns". | 5 of 5 | New icons (icon authors). Cheap first step: aliases for what exists (`dental` / `crown` -> `tooth`, `anxious` / `nervous` -> a worried face). | open |
| 7 | No preview. Four agents built their own contact sheets; one chose icons blind. | 5 of 5 | `preview_icons({ names, styles })` returning one image (local) or an SVG sheet (works remotely). | open |
| 8 | Phrases match single words: "children playing" -> play, audio-lines; "nature-based day care" -> dog (via "doggy daycare"); "kids" -> balloon, rainbow, snowman; "shop counter" -> rotate-ccw. | 5 of 5 | Search engine: weight the head noun, penalise partial coverage, and add these queries to `packages/search/eval`. | open |
| 9 | `search_icons` with `format: svg` dumps full SVG bodies for the top results. | 3 of 5 | A names-only `format` (`none`) and one consistent rule for which results carry code. | open |

### P2: friction

| # | finding | evidence | fix | status |
|---|---|---|---|---|
| 10 | Brand colours across a set. `list_palettes` reports a wrong `mainRole` for suite and avatars; palette ids differ per icon; clay roles differ per icon; borrowed palettes put stray accents on icons that lack the palette (a green accent on `trending-up`). Brand-colour work needed one export per colour. | 4 of 5 | `export_icon({ theme })` that resolves one colour set to each icon's own roles in any style; per-name `colors` in one call; fix `mainRole` for suite and avatars. | open |
| 11 | `recommend_styles` is about 5 KB, ignores an "exact brand colours" request (it recommended gradient styles), and ranked christmas first for a prompt naming four festivals. | 2 of 5 (the other three were happy with it) | `compact` option; treat "exact brand colours" as a flat-style signal; rank multi-festival prompts by coverage. | open |
| 12 | No-match suggestions are weak: "nervous" -> angry, arrow-left, chevron-left; "wheat" -> thermometer, heart, wreath; "playground" -> circle-play, key-round. | 3 of 5 | Return `suggestions` only when they pass a similarity floor. | open |

## Re-running the evaluation

The harness (stand-in client, five briefs, render and call-log scripts) lives in `.tmp/pitch-decks/` and is not part of
the repository. To measure the fixes above, re-run the same five briefs and compare: stumbles per deck, MCP calls per
deck, queries that fell back to a stand-in icon, and the self-ratings. Log connect-time failures this time, and reuse one
MCP session per agent so the rate limit is measured fairly.
