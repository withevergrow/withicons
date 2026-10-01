import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewEncapsulation, booleanAttribute, inject, isDevMode } from '@angular/core';
import { WithAttrsDirective } from './with-attrs.directive';
import { WITH_ICONS, lookupWithIcon } from './provide';
import type { WithIconData, WithIconNode, WithIconVariant } from './types';

type Attrs = Record<string, string | number>;
const warned = new Set<string>();
const GEOMETRY = ['cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points'];
const pathCache = new WeakMap<WithIconNode, ReadonlyArray<Attrs>>();

/** Geometry-equivalent path data for the basic SVG shapes (null for anything else). */
function shapeToD(tag: string, a: Readonly<Record<string, string | number>>): string | null {
  const n = (k: string) => Number(a[k] ?? 0) || 0;
  switch (tag) {
    case 'circle':
    case 'ellipse': {
      const cx = n('cx'), cy = n('cy'), rx = tag === 'circle' ? n('r') : n('rx'), ry = tag === 'circle' ? n('r') : n('ry');
      return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
    }
    case 'line':
      return `M${n('x1')} ${n('y1')}L${n('x2')} ${n('y2')}`;
    case 'polyline':
    case 'polygon': {
      const v = String(a['points'] ?? '').trim().split(/[s,]+/).map(Number);
      const pts: string[] = [];
      for (let i = 0; i + 1 < v.length; i += 2) pts.push(`${v[i]} ${v[i + 1]}`);
      return pts.length ? 'M' + pts.join('L') + (tag === 'polygon' ? 'Z' : '') : null;
    }
    case 'rect': {
      const x = n('x'), y = n('y'), w = n('width'), h = n('height');
      let rx = a['rx'] != null ? n('rx') : n('ry'), ry = a['ry'] != null ? n('ry') : rx;
      rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      if (!rx || !ry) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
      return `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}` +
        `H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`;
    }
  }
  return null;
}

/** IconNode -> attribute maps for <path> elements (cached per node array). */
function pathsOf(node: WithIconNode): ReadonlyArray<Attrs> {
  let out = pathCache.get(node);
  if (!out) {
    const list: Attrs[] = [];
    for (const [tag, attrs] of node) {
      if (tag === 'path') { list.push(attrs as Attrs); continue; }
      const d = shapeToD(tag, attrs);
      if (d === null) continue;
      const p: Attrs = {};
      for (const k of Object.keys(attrs)) if (!GEOMETRY.includes(k)) p[k] = attrs[k];
      p['d'] = d;
      list.push(p);
    }
    pathCache.set(node, (out = list));
  }
  return out;
}

/**
 * <with-icon> — renders any with icons icon as inline SVG.
 *
 *   <with-icon [icon]="Home" />                              import { Home } from '@withicons/angular'
 *   <with-icon name="home" variant="solid" [size]="32" />   after provideWithIcons(...)
 */
@Component({
  selector: 'with-icon',
  standalone: true,
  imports: [WithAttrsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'with-icon', '[attr.title]': 'null' },
  // no emulated encapsulation: keeps _ngcontent attributes off every <path>; easy to override
  encapsulation: ViewEncapsulation.None,
  styles: ['with-icon{display:inline-flex}'],
  // Every node is drawn as a <path> (other shapes are converted once, see toPathAttrs), so the
  // template needs no per-tag branches and SSR output stays small. Unknown names render nothing
  // inside the host, like the other with icons packages.
  template:
    '@if (found) {<svg [withAttrs]="rootAttrs">' +
    '@if (title) {<svg:title>{{ title }}</svg:title>}' +
    '@for (p of paths; track $index) {<svg:path [withAttrs]="p" />}' +
    '<ng-content /></svg>}',
})
export class WithIconComponent implements OnChanges, OnInit {
  /** icon name, resolved with `variant` against icons registered by provideWithIcons() */
  @Input() name?: string | null;
  /** style to resolve `name` in (default 'line') */
  @Input() variant?: WithIconVariant | (string & {}) | null;
  /** icon data to render directly (tree-shakeable, no registration) — wins over name/variant */
  @Input() icon?: WithIconData | null;
  /** width and height in px (default 24) */
  @Input() size?: number | string | null = 24;
  /** any CSS colour; recolours every currentColor in the icon (default 'currentColor') */
  @Input() color?: string | null = 'currentColor';
  /** stroke width for styles with live strokes (line, duo); ignored by the others */
  @Input() strokeWidth?: number | string | null;
  /** keep the stroke width constant in px regardless of size */
  @Input({ transform: booleanAttribute }) absoluteStrokeWidth = false;
  /** accessible name: renders <title> and role="img" (otherwise aria-hidden) */
  @Input() title?: string | null;

  private readonly registry = inject(WITH_ICONS, { optional: true });
  protected rootAttrs: Attrs = {};
  protected paths: ReadonlyArray<Attrs> = [];
  protected found = false;
  private ready = false;

  ngOnChanges(): void { this.update(); }
  ngOnInit(): void { if (!this.ready) this.update(); }

  private update(): void {
    this.ready = true;
    const variant = this.variant || 'line';
    const data = this.icon || (this.name ? lookupWithIcon(this.registry, this.name, variant) : undefined);
    if (!data && isDevMode()) {
      const key = this.name ? `${variant}/${this.name}` : '(none)';
      if (!warned.has(key)) {
        warned.add(key);
        console.warn(this.name
          ? `<with-icon>: icon "${this.name}" (${variant}) is not registered. Add provideWithIcons(...) to your providers, or pass [icon].`
          : '<with-icon>: set [icon] or name.');
      }
    }
    const style = data ? data.style : null;
    const size = this.size === null || this.size === undefined || this.size === '' ? 24 : this.size;
    const color = this.color || 'currentColor';
    const a: Attrs = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' };
    if (style) {
      for (const k of Object.keys(style.root)) a[k] = style.root[k] === 'currentColor' ? color : style.root[k];
      if (style.strokeWidth !== false) {
        const sw = this.strokeWidth;
        const w = sw === null || sw === undefined || sw === '' || isNaN(Number(sw)) ? style.strokeWidth : Number(sw);
        const px = /^\s*\d*\.?\d+(px)?\s*$/.test(String(size)) ? parseFloat(String(size)) : 0;
        a['stroke-width'] = this.absoluteStrokeWidth && px > 0 ? Math.round((w * 24 / px) * 1000) / 1000 : w;
      }
    }
    if (color !== 'currentColor') a['color'] = color;
    a['class'] = `withi withi-${data ? data.name : this.name || 'unknown'}`;
    if (this.title) a['role'] = 'img';
    else a['aria-hidden'] = 'true';
    this.rootAttrs = a;
    this.paths = data ? pathsOf(data.node) : [];
    this.found = !!data;
  }
}
