import { InjectionToken, Provider } from '@angular/core';
import type { WithIconData } from './types';

/** Multi-provider token holding the icons `<with-icon name="...">` can resolve. */
export const WITH_ICONS = new InjectionToken<ReadonlyArray<ReadonlyArray<WithIconData>>>('WITH_ICONS');

/** Anything provideWithIcons accepts: an icon, an array, a record or a module namespace of icons. */
export type WithIconSource = WithIconData | ReadonlyArray<WithIconSource> | { readonly [key: string]: unknown };

export function isWithIconData(value: unknown): value is WithIconData {
  const v = value as WithIconData | null;
  return !!v && typeof v === 'object' && typeof v.name === 'string' && typeof v.variant === 'string' && Array.isArray(v.node) && !!v.style;
}

function collect(source: unknown, out: WithIconData[]): WithIconData[] {
  if (isWithIconData(source)) out.push(source);
  else if (Array.isArray(source)) for (const s of source) collect(s, out);
  else if (source && typeof source === 'object') for (const v of Object.values(source)) if (isWithIconData(v)) out.push(v);
  return out;
}

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
export function provideWithIcons(...sources: WithIconSource[]): Provider {
  return { provide: WITH_ICONS, multi: true, useValue: collect(sources, []) };
}

const indexCache = new WeakMap<object, Map<string, WithIconData>>();

/** Resolve name + variant against registered icons (what <with-icon> does internally). */
export function lookupWithIcon(registry: ReadonlyArray<ReadonlyArray<WithIconData>> | null, name: string, variant: string): WithIconData | undefined {
  if (!registry) return undefined;
  let index = indexCache.get(registry);
  if (!index) {
    index = new Map();
    for (const set of registry) for (const icon of set) index.set(`${icon.variant}/${icon.name}`, icon);
    indexCache.set(registry, index);
  }
  return index.get(`${variant}/${name}`);
}
