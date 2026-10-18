export * from './index'
export class WithLoaderElement extends HTMLElement {
  pause(): void
  play(): void
  /** turn the loader into a finished library icon (default 'check-circle'; always an icon, never a loader) and announce `label` (default 'Done') */
  done(icon?: string, options?: { effect?: import('./index').MorphEffect; label?: string }): this
  reset(): this
}
export function defineLoader(tag?: string): void
declare global { interface HTMLElementTagNameMap { 'with-loader': WithLoaderElement } }
