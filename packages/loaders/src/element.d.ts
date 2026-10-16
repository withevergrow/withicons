export * from './index'
export class WithLoaderElement extends HTMLElement {
  pause(): void
  play(): void
  /** turn the loader into a finished icon (default 'check-circle') */
  done(icon?: string, options?: { effect?: import('./index').MorphEffect; label?: string }): this
  reset(): this
}
export function defineLoader(tag?: string): void
declare global { interface HTMLElementTagNameMap { 'with-loader': WithLoaderElement } }
