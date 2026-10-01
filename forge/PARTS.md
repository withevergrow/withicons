# Shared parts — reuse these EXACT coordinates

Families are split across authors. These parts are what make `file` and `file-pdf`,
`cloud` and `cloud-upload`, `bell` and `bell-ring` look like siblings. When your icon
contains one of these motifs, start from the part verbatim; adapt only what the
concept requires (shorten a line to make room for a badge, etc.).

| part | paths (plate K unless noted) |
|---|---|
| **document** (file, file-*, files, sticky-note base) | `M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z` + fold (A) `M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19` — content glyphs (lines, badge, symbols) sit inside x∈[8,16], y∈[11,18.5] |
| **folder** | `M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z` |
| **cloud** (cloud, cloud-*) | `M7 19 A4.5 4.5 0 0 1 6.2 10.1 A6.2 6.2 0 0 1 18.1 10.6 A4.25 4.25 0 0 1 17.25 19 Z` — for rain/snow/lightning/arrows, raise and shorten the cloud (translate up ~3u, keep proportions) and put the payload (A) below |
| **calendar** (calendar, calendar-*) | body `M5 5 H19 A2 2 0 0 1 21 7 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V7 A2 2 0 0 1 5 5 Z`, header `M3 10 H21`, rings (A) `M8 3 V7` `M16 3 V7` |
| **circle container** (x-circle, check-circle, info-circle, alert-circle, help-circle, plus-circle, minus-circle, user-circle, ban) | `M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z`; inner glyph (A) spans ~x∈[8,16] |
| **square container** (check-square, …) | `M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z` |
| **check** | standalone `M4.5 12.5 L9.5 17.5 L19.5 6.5`; inside a container `M8 12.5 L10.75 15.25 L16 9.5` |
| **x** | standalone `M6 6 L18 18` + `M18 6 L6 18`; inside a container `M9 9 L15 15` + `M15 9 L9 15` |
| **plus / minus** | standalone `M12 5 V19` + `M5 12 H19`; inside a container `M12 8 V16` + `M8 12 H16` |
| **bell** (bell, bell-off, bell-ring) | `M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z` + clapper (A) `M10 21 A2 2 0 0 0 14 21` |
| **battery** | `M4 7 H17 A2 2 0 0 1 19 9 V15 A2 2 0 0 1 17 17 H4 A2 2 0 0 1 2 15 V9 A2 2 0 0 1 4 7 Z` + terminal (A) `M22 10.5 V13.5` |
| **microphone** | capsule `M9 5.5 A3 3 0 0 1 15 5.5 V11.5 A3 3 0 0 1 9 11.5 Z`, cradle (A) `M5.5 11 A6.5 6.5 0 0 0 18.5 11`, stem (A) `M12 17.5 V21` |
| **camera (video)** | body `M4 6 H14 A2 2 0 0 1 16 8 V16 A2 2 0 0 1 14 18 H4 A2 2 0 0 1 2 16 V8 A2 2 0 0 1 4 6 Z` + lens (A) `M16 10.5 L22 7 V17 L16 13.5` |
| **monitor** (monitor, tv shares the screen) | screen `M4 3.5 H20 A2 2 0 0 1 22 5.5 V14.5 A2 2 0 0 1 20 16.5 H4 A2 2 0 0 1 2 14.5 V5.5 A2 2 0 0 1 4 3.5 Z`, stand (A) `M8 21 H16` `M12 16.5 V21` |
| **arrow** (arrow-*) | up: shaft `M12 20 V4` + head (A) `M5.5 10.5 L12 4 L18.5 10.5`; rotate by 90° for the others. Diagonal: shaft `M6.5 17.5 L17.5 6.5` + head (A) `M8 6.5 H17.5 V16`, mirror for other diagonals. `arrow-right` seed is canonical. |
| **chevron** | down `M6 9 L12 15 L18 9`; rotate for up/left/right. Head angle and size of arrows and chevrons must match. |
| **list** (list, list-ordered, list-checks, align-*) | lines `M9 6 H21` `M9 12 H21` `M9 18 H21`; markers (A) at x 3.5–5 on the same rows |
| **eye** (eye, eye-off, …) | `M2.5 12 C4.5 7.5 8 5 12 5 C16 5 19.5 7.5 21.5 12 C19.5 16.5 16 19 12 19 C8 19 4.5 16.5 2.5 12 Z` + pupil (A) `M15 12 A3 3 0 1 1 9 12 A3 3 0 1 1 15 12 Z` |
| **shield** (shield, shield-*) | `M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z` |
| **user** (user, user-*, users, address-book, id-card heads) | seed `forge/icons/user.json`. With a badge: scale the person to ~80% toward the upper-left so the badge fits bottom-right. |
| **lens** (search, zoom-in, zoom-out, file-search) | seed `forge/icons/search.json`; zoom glyphs sit inside the lens centred at (10.5,10.5), arms 3u |
| **badge** (plate S) | circle centred (17.5,17.5) r 4: `M21.5 17.5 A4 4 0 1 1 13.5 17.5 A4 4 0 1 1 21.5 17.5 Z`; glyph inside arms ±2u. Cut the base icon back ≥1.5u from the badge circle. |
| **slash** (plate S; bell-off, eye-off, volume-off, wifi-off, microphone-off, phone-off, video-off) | `M3 3 L21 21`; cut the base icon back 1.5u either side of the slash |
