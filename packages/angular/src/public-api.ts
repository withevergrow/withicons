/*
 * @withicons/angular — component entry, compiled by scripts/build-component.mjs
 * (ng-packagr, partial Ivy) into prebuilt/. Icon data (Home, HomeIcon, ...) is plain ESM
 * that forge/lib/emit-angular.mjs writes next to it.
 */
export { WithIconComponent } from './lib/with-icon.component';
export { WithAttrsDirective } from './lib/with-attrs.directive';
export { WITH_ICONS, provideWithIcons, isWithIconData, lookupWithIcon } from './lib/provide';
export type { WithIconSource } from './lib/provide';
export type { WithIconData, WithIconNode, WithIconStyle, WithIconVariant } from './lib/types';
