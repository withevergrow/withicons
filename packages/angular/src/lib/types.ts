/** The seven with icons styles. */
export type WithIconVariant = 'line' | 'solid' | 'duo' | 'gloss' | 'engrave' | 'blueprint' | 'sketch';

/** Flat list of SVG child elements: [tag, attributes]. */
export type WithIconNode = ReadonlyArray<readonly [tag: string, attrs: Readonly<Record<string, string | number>>]>;

/** How a style dresses the root <svg>. */
export interface WithIconStyle {
  readonly name: string;
  /** attributes for the <svg> element ('currentColor' values follow the `color` input) */
  readonly root: Readonly<Record<string, string | number>>;
  /** default stroke width when the style has live strokes, else false */
  readonly strokeWidth: number | false;
}

/** One icon in one style — what `Home`, `HomeIcon` and `@withicons/angular/solid/icons/home` export. */
export interface WithIconData {
  readonly name: string;
  readonly variant: WithIconVariant | (string & {});
  readonly style: WithIconStyle;
  readonly node: WithIconNode;
}
