# Content gaps found by the search evaluation

The golden set (`eval/golden.json`) holds 104 realistic queries with no honest icon among the 500 (`ideal: []`).
Search can't fix these. The best it can do is return nothing, or a result flagged as weak with a hint to browse.
The list below groups the gaps by domain and suggests icons to add, most-requested first. "Stand-in" names the
closest icon that exists today, which the eval accepts as a fallback at rank 1.

## Health, wellness, fitness
| query | suggested new icon | stand-in today |
|---|---|---|
| yoga, yoga pose | `yoga` (seated or tree-pose figure) | person-running |
| yoga mat | `yoga-mat` (rolled mat) | none |
| meditation, mindfulness, lotus | `lotus` (flower), `meditation` (cross-legged figure) | flower |
| swimming, pool | `swimmer`, `waves-ladder` (pool) | droplet |
| golf | `golf` (flag on green with ball) | flag |
| boxing | `boxing-glove` | dumbbell |
| skiing | `ski` (skier or skis) | snowflake, mountain |
| physiotherapy | `physio` (figure with joint highlight) | accessibility, bandage |
| hearing aid | `ear` / `hearing-aid` | headphones |
| pregnancy, prenatal | `pregnant` (figure) | heart-pulse, hospital |
| scales for weight loss | `bathroom-scale` (today's `scale` is a balance scale) | dumbbell |
| locker (gym, storage) | `locker` | lock |

## Family and kids
| query | suggested new icon | stand-in today |
|---|---|---|
| baby | `baby` (face or swaddled baby) | none |
| pram (UK), stroller (US) | `pram` | none |
| nappy (UK), diaper (US) | `baby-bottle` or `diaper` | none |
| kids, children | `child` (small figure) | school, backpack |
| toys, teddy bear | `teddy-bear`, `blocks` | puzzle-piece, balloon |
| playground | `slide` / `swing` | none |

## Food and drink
| query | suggested new icon | stand-in today |
|---|---|---|
| tea | `tea` (teacup with bag tag) | coffee |
| cocktail | `cocktail` (martini glass) | wine |
| bread, bakery | `bread` / `croissant` | cake |
| sushi | `sushi` | fish |
| fries | `fries` | burger |
| cheese | `cheese` | pizza |
| milk | `milk` (carton or bottle) | cup-soda |
| chicken, steak, meat | `drumstick`, `steak` | utensils |
| rice | `rice-bowl` | soup |
| coffee bean, grinder | `coffee-bean` | coffee |
| lime, pear, other fruit | `citrus`, `pear` / `banana` | apple |
| frying pan | `frying-pan` | cooking-pot |
| jug | `jug` / `pitcher` | cup-soda |

## Fashion and retail (high e-commerce demand)
| query | suggested new icon | stand-in today |
|---|---|---|
| t-shirt, clothing | `shirt` | shopping-bag |
| dress | `dress` | shopping-bag |
| shoe, sneakers | `shoe` | none |
| glasses, sunglasses | `glasses`, `sunglasses` | binoculars, sun |
| makeup | `lipstick` | paintbrush |
| haircut, barber | `barber` / `comb` (scissors cover part of it) | scissors |

## Money (fintech)
| query | suggested new icon | stand-in today |
|---|---|---|
| crypto, bitcoin | `bitcoin` (generic coin with a B) | coins |
| ATM | `atm` (cash machine) | banknote, credit-card |
| cheque (UK), check (US) | `cheque` | banknote, receipt |
| send money, transfer | `banknote-arrow` or `send-money` (the eval accepts hand-coins plus arrow-left-right) | hand-coins |
| out of stock | `package-x` | package, ban |

## Places, buildings, transport
| query | suggested new icon | stand-in today |
|---|---|---|
| church, mosque, temple | `place-of-worship` (or one per faith) | landmark |
| elevator, lift | `elevator` | arrow-up-down |
| stairs | `stairs` | none |
| traffic light | `traffic-light` | traffic-cone |
| tram | `tram` | train |
| van | `van` | truck |
| tyre (UK), tire (US) | `tire` | car |
| car wash | `car-wash` | car, droplet |
| neighbourhood | `map-house` / `neighborhood` | map, map-pin |

## Nature, weather, energy
| query | suggested new icon | stand-in today |
|---|---|---|
| ocean, sea, waves | `waves` | fish, ship, anchor |
| tornado, hurricane | `tornado` | wind |
| fog | `cloud-fog` | cloud |
| recycle | `recycle` | refresh, trash |
| solar panel | `solar-panel` | sun, zap |
| fan | `fan` | wind |
| farm animals: horse, cow, sheep, goat, duck, deer, bear | `horse`, `cow`, `sheep` (pick 2-3) | paw-print |

## Events, culture, leisure
| query | suggested new icon | stand-in today |
|---|---|---|
| wedding | `rings` (two interlocked rings) | heart, gem |
| halloween | `pumpkin` / `ghost` | none |
| fireworks | `fireworks` | party-popper, sparkles |
| theatre (UK), theater (US) | `theater-masks` | ticket, clapperboard |
| guitar, piano | `guitar`, `piano` | music-note |
| chess | `chess-knight` | puzzle-piece |
| dice, board games | `dice` (a live `dice` exists in @withicons/dynamic only) | gamepad |
| yin yang | `yin-yang` | sun-moon |

## Security, legal, devices
| query | suggested new icon | stand-in today |
|---|---|---|
| CCTV, security camera | `cctv` | webcam, video-camera |
| copyright | `copyright` (the © mark) | none |
| calendar x (cancelled event) | `calendar-x` | calendar, x-circle |
| knives | `knife` (utensils shows a fork and knife, but "knives" returns nothing today, so this is also a search fix) | utensils |

## Brands (out of scope on purpose)
github, instagram, whatsapp and other brand logos. The library is original, generic artwork with no brand marks.
Search should say so and point to the generic icon (git-branch, camera, message-circle) instead of guessing.

## Recommended first batch (most demand across the use cases)
`shirt`, `shoe`, `baby`, `pram`, `yoga`, `lotus`, `waves`, `recycle`, `tea`, `cocktail`, `bread`, `bitcoin`, `atm`,
`rings`, `cctv`, `elevator`, `traffic-light`, `swimmer`, `glasses`, `package-x`.
