// ANIME snowman, hand-drawn: a chubby cream two-ball body with cel shading, a sakura knit
// beanie (cream cuff, gold pompom), big sparkly eyes with catch-lights and blush, a coral
// carrot nose, a gold scarf whose end flutters (A), gold outlined twig arms with raised fingers (A),
// two coal buttons, a snow mound and a sparkle.
export const R = {
  snowman: (icon, k) => [
    k.ground(12, 21.6, 7.4, 1),
    k.tube('M7.2 14.6 L3.4 11.6 M4.6 12.6 L4.4 10.2 M4.2 12 L2.2 12.2', 'c3', { part: 'a', w: 0.85, ol: 0.4 }),
    k.tube('M16.8 14.6 L20.6 11.6 M19.4 12.6 L19.6 10.2 M19.8 12 L21.8 12.2', 'c3', { part: 'a', w: 0.85, ol: 0.4 }),
    k.surf(k.circle(12, 16.4, 5.3), 'tint', { shineSize: 0.8 }),
    k.surf(k.circle(12, 8.6, 4.1), 'tint', { shineSize: 0.7 }),
    k.surf(k.arch(8.1, 1.6, 15.9, 6.6), 'c2', { shine: 'streak', shineSize: 0.6, ol: 0.5 }),
    k.surf(k.pill(7.6, 5.4, 16.4, 7.2), 'tint', { shine: 'none', ol: 0.45 }),
    k.surf(k.circle(12, 1.7, 1.25), 'c3', { shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.paint(k.join(k.ellipse(10.4, 9, 0.75, 1), k.ellipse(13.6, 9, 0.75, 1)), 'ink'),
    k.shine(k.join(k.circle(10.15, 8.6, 0.3), k.circle(13.35, 8.6, 0.3))),
    k.paint(k.join(k.ellipse(9.1, 10.6, 0.8, 0.5), k.ellipse(14.9, 10.6, 0.8, 0.5)), 'c2', { op: 0.75 }),
    k.surf(k.poly([[11.6, 9.9], [15.4, 10.9], [11.6, 11.2]], 0.3), 'accent', { shine: 'none', ol: 0.3, shade: 0 }),
    k.surf(k.pill(7.4, 11.6, 16.6, 13.6), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.rr(13.4, 12.6, 15.6, 17.4, 0.9), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
    k.paint(k.join(k.circle(12, 15.4, 0.75), k.circle(12, 18.4, 0.75)), 'ink'),
    k.sparkleAt(20.4, 4.2, 1.5, { mx: -1, my: 1 }),
  ],
}
