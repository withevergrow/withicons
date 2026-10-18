import type { LoaderOptions, MorphEffect, MorphItem } from './index'
export * from './index'
type Common = Omit<LoaderOptions, 'style' | 'flat' | 'idSuffix' | 'class'> & { variant?: string; className?: string; style?: Record<string, unknown>; [k: string]: unknown }
export function Loader(props: Common & { name?: string }): any // Vue component
export function Morph(props: Common & { items: MorphItem[] | string; effect?: MorphEffect; hold?: number }): any // Vue component
export default Loader
