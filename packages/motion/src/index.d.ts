// @withicons/motion — types
export type Preset =
  | 'spin' | 'spin-once' | 'tick' | 'pulse' | 'beat' | 'breathe' | 'float' | 'bounce' | 'sway' | 'ring' | 'wiggle' | 'shake'
  | 'nod' | 'nudge' | 'pass' | 'rise' | 'drop' | 'blink' | 'flicker' | 'twinkle' | 'pop' | 'tada' | 'jelly' | 'flip' | 'rock'
  | 'tilt' | 'zoom' | 'orbit' | 'glow' | 'draw' | 'type' | 'fill'
export type SwapEffect =
  | 'fade' | 'scale' | 'rotate' | 'flip' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'blur' | 'spin' | 'morph' | 'draw'
export type Trigger = 'loop' | 'hover' | 'once' | 'inview'

/** One motion: the preset plus its options (forge/MOTION.md). */
export interface MotionObject {
  preset: Preset
  /** Pivot in the 24x24 icon grid. Default [12, 12] (or the preset's own default). */
  origin?: [number, number]
  /** Direction in degrees for nudge / pass: 0 = right, 90 = down, 180 = left, 270 = up. */
  dir?: number
  /** Intensity multiplier 0.25-2. Default 1. */
  amount?: number
  /** Seconds: one loop cycle, or the length of a one-shot. */
  duration?: number
  /** > 0 makes rotation presets (spin, tick, orbit) stepped. */
  steps?: number
}
export interface MotionSpec {
  name: string
  /** Plain English: what the motion says. */
  intent: string
  /** The continuous animation. */
  loop: MotionObject
  /** The one-shot played on hover / focus / tap. */
  hover: MotionObject
  /** Other presets that suit the icon. */
  alt?: MotionObject[]
  /** Icons this one naturally turns into: 'name' or 'name@style'. */
  swap?: { to: string; effect: SwapEffect }[]
  /** Parts choreography: overrides for the plates a style keeps apart (A moving part, S badge), each with a delay in seconds. */
  parts?: { A?: MotionObject & { delay?: number }; S?: MotionObject & { delay?: number } }
  /** The decorations' own loop (default: chosen per preset). */
  deco?: DecoKind
  /** true when derived automatically (no hand-written spec yet). */
  auto?: boolean
}
/** How decorations (nodes tagged wm-deco: backdrops, sparkles, accent dots) move while the icon animates. */
export type DecoKind = 'breathe' | 'float' | 'twinkle' | 'still'
export interface PresetDefaults {
  /** One-shot length in seconds. */
  shot: number
  /** Default loop cycle in seconds (longer than shot = the loop rests between plays). */
  cycle: number
  origin?: [number, number]
  dir?: number
  ease?: string
  /** Shortest allowed duration in seconds (flicker: stays under 3 flashes per second). */
  min?: number
  intent: string
}

export const PRESETS: Preset[]
export const EFFECTS: SwapEffect[]
export const PRESET_DEFAULTS: Record<Preset, PresetDefaults>
export const EFFECT_DEFAULTS: Record<SwapEffect, { dur: number }>
/** Seconds an auto swap rests on each icon by default (0.9). */
export const SWAP_HOLD: number
export type SwapEaseName = 'natural' | 'springy' | 'smooth' | 'snappy' | 'gentle' | 'linear'
/** Named feels for --wm-swap-ease (null = the effect's own easing). */
export const SWAP_EASES: Record<SwapEaseName, string | null>
/** A SWAP_EASES name or any CSS easing -> CSS easing, or null for the effect's own. */
export function swapEase(ease?: SwapEaseName | string | null): string | null
/** One auto-swap cycle in seconds: 2 x (duration + hold). */
export function swapCycle(duration: number, hold?: number): number

/** The icon's motion spec, or null. Uses the full spec table (about 29 KB gzipped), so bundlers include it only when this (or motionAttrs) is imported. */
export function motionFor(name: string): MotionSpec | null

export interface MotionOptions {
  /** Default 'loop'. 'hover' plays the one-shot on pointer enter / focus / tap of the element or its closest .wm-trigger. */
  trigger?: Trigger
  /** Overrides the icon's own preset. */
  preset?: Preset
  /** Seconds. */
  duration?: number
  amount?: number
  origin?: [number, number]
  dir?: number
  steps?: number
  /** Seconds before it starts. */
  delay?: number
  /** Keep animating even when the user prefers reduced motion. */
  force?: boolean
  /** The decorations' loop (overrides the icon's / the preset's default). */
  deco?: DecoKind
  /** inview: play again each time it re-enters the viewport. Default true. */
  repeat?: boolean
  /** loop: 'pause' (default) pauses while scrolled out of view; 'run' keeps it running. */
  offscreen?: 'pause' | 'run'
}
export interface MotionHandle {
  el: Element
  play(): void
  pause(): void
  destroy(): void
}
/**
 * The attributes that make a wrapper move, for markup you write yourself (frameworks, SSR, copy-paste):
 * motionAttrs('bell', { trigger: 'hover', preset: 'shake' }) -> { class: 'wm wm-hover wm-p-shake', 'data-wm': 'bell' }
 */
export function motionAttrs(nameOrSpec?: string | MotionSpec | null, options?: MotionOptions): { class: string; 'data-wm'?: string; style?: string }
/**
 * Applies motion classes and variables to the element that holds the icon. Calling it again on the same element replaces
 * the previous motion. A named icon's own defaults come from icons.css on the element, so load icons.css first.
 */
export function motion(el: Element | string, nameOrSpec?: string | MotionSpec | null, options?: MotionOptions): MotionHandle

export interface SwapOptions {
  /** SVG/HTML string or element. Default: the element's current content. */
  from?: string | Element
  to: string | Element
  /** Default 'fade'. */
  effect?: SwapEffect
  /**
   * Default 'hover'. 'click' toggles (and sets aria-pressed on buttons). 'focus' shows B while the element (or the
   * .wm-trigger around it) has focus. 'auto' turns into B and back on its own, resting `hold` seconds on each.
   * 'loop' alternates with CSS only (--wm-swap-cycle).
   */
  trigger?: 'hover' | 'click' | 'focus' | 'auto' | 'manual' | 'loop'
  /** Start on B. */
  on?: boolean
  /** Seconds for one transition. */
  duration?: number
  /** Easing of the incoming icon: a SWAP_EASES name or any CSS easing. Default: the effect's own. */
  ease?: SwapEaseName | string
  /** Seconds to wait before switching ('auto': before the first switch). */
  delay?: number
  /** 'auto': seconds to rest on each icon. Default SWAP_HOLD (0.9). */
  hold?: number
  /** 'auto': start right away (default true). */
  autoplay?: boolean
  /** 'auto': keep going even when the user prefers reduced motion. */
  force?: boolean
  /** trigger 'loop' / 'auto': 'pause' (default) pauses while scrolled out of view; 'run' keeps it running. */
  offscreen?: 'pause' | 'run'
}
export interface SwapHandle {
  el: Element
  readonly on: boolean
  toggle(on?: boolean): boolean
  /** 'auto': start / resume turning back and forth. */
  play(): void
  /** 'auto': stop where it is. */
  pause(): void
  destroy(): void
}
/** Stacks two icons in `el` and transitions between them. */
export function swap(el: Element | string, options: SwapOptions): SwapHandle

/** Pauses the element's animations (class wm-offscreen) while it is out of view. Returns a function that stops watching. */
export function pauseWhenOffscreen(el: Element): () => void
/** Prepares inline SVG strokes for `draw` (pathLength="1"). Returns true if anything can be drawn. */
export function prepareDraw(root: Element): boolean
export function unprepareDraw(root: Element): void
/** The CSS custom properties for a spec (what icons.css writes for it). */
export function specVars(spec: MotionSpec, full?: boolean): Record<string, string>
/** The element's icon <svg> when its nodes carry part tags (wm-deco, wm-shadow, wm-a, wm-s), else null. */
export function partsSvg(el: Element): SVGSVGElement | null
export function slotVars(m: MotionObject, slot: 'L' | 'H', full?: boolean): Record<string, string>
/** 'wm-<preset>' or 'wm-<preset>-loop'. */
export function keyframeName(preset: Preset, loop: boolean): string
