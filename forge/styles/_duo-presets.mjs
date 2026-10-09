// DUO looks as data: one-click CSS-variable sets for the site / studio ("Duo with an accent", "Duo gradient").
// Each preset is { title, description, vars: { '--with-duo-*': '#hex' }, strokeWidth?, render? }. Apply the vars on the
// icon (or any ancestor); strokeWidth is the suggested stroke-width prop (the look it reproduces); render names the
// duo render to use: omitted = the default Duo output, 'gradient' = duo.variants.gradient (lines need its defs).
// Plain Duo (no variables) is unchanged: tint and lines follow currentColor.
//
//   --with-duo          the tint plane (the object's mass at 20%)            default currentColor
//   --with-duo-accent   the ONE accent detail (badge / slash / inner part)   default currentColor
//   --with-duo-from     line gradient, top-left end      (gradient render)   default currentColor
//   --with-duo-to       line gradient, bottom-right end  (gradient render)   default currentColor
export const DUO_PRESETS = {
  accent: {
    title: 'Duo with an accent',
    description: 'Crisp lines over a soft indigo plane, one detail picked out in the accent colour (the Linear look).',
    vars: { '--with-duo': '#6B70F7', '--with-duo-accent': '#6B70F7' },
    strokeWidth: 1.5,
  },
  gradient: {
    title: 'Duo gradient',
    description: 'Lines swept with one indigo-to-pink gradient over a faint violet body (the Spectrum look).',
    vars: { '--with-duo': '#8B5CF6', '--with-duo-from': '#6366F1', '--with-duo-to': '#EC4899', '--with-duo-accent': '#EC4899' },
    strokeWidth: 2,
    render: 'gradient',
  },
}

// "--a:#x;--b:#y" for a style attribute / CSS rule
export const presetCss = name => Object.entries((DUO_PRESETS[name] || { vars: {} }).vars).map(([k, v]) => `${k}:${v}`).join(';')
