import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

/**
 * Applies a plain attribute map to its host element (added, changed and removed keys).
 * Works the same in the browser, on the server and during hydration.
 * Used by WithIconComponent; exported for custom renderers.
 */
@Directive({ selector: '[withAttrs]', standalone: true })
export class WithAttrsDirective implements OnChanges {
  @Input() withAttrs: Readonly<Record<string, string | number | null | undefined | false>> | null | undefined = null;

  private readonly el: ElementRef<Element> = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private applied: string[] = [];

  ngOnChanges(): void {
    const next = this.withAttrs || {};
    const node = this.el.nativeElement;
    const keys: string[] = [];
    for (const key of Object.keys(next)) {
      const value = next[key];
      if (value === null || value === undefined || value === false) continue;
      this.renderer.setAttribute(node, key, String(value));
      keys.push(key);
    }
    for (const key of this.applied) if (!keys.includes(key)) this.renderer.removeAttribute(node, key);
    this.applied = keys;
  }
}
