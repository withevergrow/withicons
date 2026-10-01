import * as i0 from "@angular/core";
import { InjectionToken, OnChanges, OnInit, Provider } from "@angular/core";
/** The seven with icons styles. */
type WithIconVariant = 'line' | 'solid' | 'duo' | 'gloss' | 'engrave' | 'blueprint' | 'sketch';
/** Flat list of SVG child elements: [tag, attributes]. */
type WithIconNode = ReadonlyArray<readonly [tag: string, attrs: Readonly<Record<string, string | number>>]>;
/** How a style dresses the root <svg>. */
interface WithIconStyle {
  readonly name: string;
  /** attributes for the <svg> element ('currentColor' values follow the `color` input) */
  readonly root: Readonly<Record<string, string | number>>;
  /** default stroke width when the style has live strokes, else false */
  readonly strokeWidth: number | false;
}
/** One icon in one style — what `Home`, `HomeIcon` and `@withicons/angular/solid/icons/home` export. */
interface WithIconData {
  readonly name: string;
  readonly variant: WithIconVariant | (string & {});
  readonly style: WithIconStyle;
  readonly node: WithIconNode;
}
type Attrs = Record<string, string | number>;
/**
 * <with-icon> — renders any with icons icon as inline SVG.
 *
 *   <with-icon [icon]="Home" />                              import { Home } from '@withicons/angular'
 *   <with-icon name="home" variant="solid" [size]="32" />   after provideWithIcons(...)
 */
export declare class WithIconComponent implements OnChanges, OnInit {
  /** icon name, resolved with `variant` against icons registered by provideWithIcons() */
  name?: string | null;
  /** style to resolve `name` in (default 'line') */
  variant?: WithIconVariant | (string & {}) | null;
  /** icon data to render directly (tree-shakeable, no registration) — wins over name/variant */
  icon?: WithIconData | null;
  /** width and height in px (default 24) */
  size?: number | string | null;
  /** any CSS colour; recolours every currentColor in the icon (default 'currentColor') */
  color?: string | null;
  /** stroke width for styles with live strokes (line, duo); ignored by the others */
  strokeWidth?: number | string | null;
  /** keep the stroke width constant in px regardless of size */
  absoluteStrokeWidth: boolean;
  /** accessible name: renders <title> and role="img" (otherwise aria-hidden) */
  title?: string | null;
  private readonly registry;
  protected rootAttrs: Attrs;
  protected paths: ReadonlyArray<Attrs>;
  protected found: boolean;
  private ready;
  ngOnChanges(): void;
  ngOnInit(): void;
  private update;
  static ɵfac: i0.ɵɵFactoryDeclaration<WithIconComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<WithIconComponent, "with-icon", never, {
    "name": {
      "alias": "name";
      "required": false;
    };
    "variant": {
      "alias": "variant";
      "required": false;
    };
    "icon": {
      "alias": "icon";
      "required": false;
    };
    "size": {
      "alias": "size";
      "required": false;
    };
    "color": {
      "alias": "color";
      "required": false;
    };
    "strokeWidth": {
      "alias": "strokeWidth";
      "required": false;
    };
    "absoluteStrokeWidth": {
      "alias": "absoluteStrokeWidth";
      "required": false;
    };
    "title": {
      "alias": "title";
      "required": false;
    };
  }, {}, never, ["*"], true, never>;
  static ngAcceptInputType_absoluteStrokeWidth: unknown;
}
/**
 * Applies a plain attribute map to its host element (added, changed and removed keys).
 * Works the same in the browser, on the server and during hydration.
 * Used by WithIconComponent; exported for custom renderers.
 */
export declare class WithAttrsDirective implements OnChanges {
  withAttrs: Readonly<Record<string, string | number | null | undefined | false>> | null | undefined;
  private readonly el;
  private readonly renderer;
  private applied;
  ngOnChanges(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<WithAttrsDirective, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<WithAttrsDirective, "[withAttrs]", never, {
    "withAttrs": {
      "alias": "withAttrs";
      "required": false;
    };
  }, {}, never, never, true, never>;
}
/** Multi-provider token holding the icons `<with-icon name="...">` can resolve. */
export declare const WITH_ICONS: InjectionToken<readonly (readonly WithIconData[])[]>;
/** Anything provideWithIcons accepts: an icon, an array, a record or a module namespace of icons. */
type WithIconSource = WithIconData | ReadonlyArray<WithIconSource> | {
  readonly [key: string]: unknown;
};
export declare function isWithIconData(value: unknown): value is WithIconData;
/**
 * Register icons for `<with-icon name="home" variant="solid" />`.
 *
 *   provideWithIcons({ Home, Lock })                       // just these (tree-shaken)
 *   provideWithIcons(Home, SolidHome)                      // individual icons, any style
 *   import * as solid from '@withicons/angular/solid';
 *   provideWithIcons(solid)                                // a whole style
 *
 * Use it in bootstrapApplication / ApplicationConfig providers, or in a route or component
 * `providers` array (the nearest injector that registers icons wins).
 */
export declare function provideWithIcons(...sources: WithIconSource[]): Provider;
/** Resolve name + variant against registered icons (what <with-icon> does internally). */
export declare function lookupWithIcon(registry: ReadonlyArray<ReadonlyArray<WithIconData>> | null, name: string, variant: string): WithIconData | undefined;
export type { WithIconData, WithIconNode, WithIconSource, WithIconStyle, WithIconVariant };