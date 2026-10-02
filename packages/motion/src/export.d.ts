import type { Preset, SwapEffect, MotionSpec } from './index.js'

export interface ExportOptions {
  /** Use this icon's spec (loop or hover) for preset, origin, amount... */
  name?: string
  spec?: MotionSpec
  preset?: Preset
  /** 'loop' (default) | 'hover' (inline SVG only) | 'once' */
  trigger?: 'loop' | 'hover' | 'once'
  duration?: number
  amount?: number
  origin?: [number, number]
  dir?: number
  steps?: number
  delay?: number
  /** Output width/height. */
  size?: number
  /** Sets color="…" on the root so currentColor resolves outside a page. */
  color?: string
  /** Seconds: freeze the animation at this moment. */
  time?: number
  /** Turn into this SVG and back, forever. */
  swapTo?: string
  effect?: SwapEffect
  /** Seconds for a whole A -> B -> A swap cycle. Default 2.4, or 2 x (duration + hold) when `hold` is set. */
  cycle?: number
  /** Swap: seconds resting on each icon (sets the cycle to 2 x (duration + hold)). */
  hold?: number
  /** Swap: easing of the incoming icon, a SWAP_EASES name or any CSS easing. */
  ease?: string
}
export interface FrameOptions {
  size?: number
  fps?: number
  seconds?: number
  color?: string
  background?: string
  /** video / webm only: how many cycles to record. Default 2. */
  loops?: number
  /** Most frames to render; longer animations keep their length at a lower frame rate. gif: 150, video / renderFrames: 600. */
  maxFrames?: number
  /** video only: MediaRecorder types to try, in order. Default WebM (VP9, VP8), then MP4 (H.264). */
  mimeTypes?: string[]
}
export interface VideoResult {
  blob: Blob
  /** What the browser actually recorded, e.g. 'video/webm;codecs=vp9' or 'video/mp4'. */
  mimeType: string
  /** File extension to save it with. */
  ext: 'webm' | 'mp4'
}
export interface ResolvedMotion {
  preset: Preset; trigger: 'loop' | 'hover' | 'once'; loop: boolean; duration: number; k: number
  origin: [number, number]; dir: number; steps: number; ease: string; delay: number
}
export function parseSvg(svg: string): { attrs: Record<string, string>; inner: string }
export function resolveMotion(options?: ExportOptions): ResolvedMotion
/** A self-contained animated SVG string (only the keyframes it needs, scoped by a unique class). */
export function animatedSvg(svg: string, options?: ExportOptions): string
export function animatedSwapSvg(a: string, b: string, options?: ExportOptions): string
/** svg: the icon, so loops whose tagged decorations run longer than one cycle record until everything lines up. */
export function exportDuration(options?: ExportOptions, svg?: string): number
export function frameSvg(svg: string, options: ExportOptions | undefined, time: number): string
export function renderFrames(svg: string, options?: ExportOptions, frame?: FrameOptions): Promise<HTMLCanvasElement[]>
export function encodeGif(frames: (HTMLCanvasElement | ImageData)[], options?: { delay?: number; loop?: number }): Uint8Array
/** Streams frames (one canvas, quantised as it goes), so memory stays at one frame. */
export function gif(svg: string, options?: ExportOptions, frame?: FrameOptions): Promise<Blob>
/** WebM where the browser records it, otherwise MP4 (Safari before 18.4). */
export function video(svg: string, options?: ExportOptions, frame?: FrameOptions): Promise<VideoResult>
/** WebM only: rejects where the browser cannot record WebM (use video()). */
export function webm(svg: string, options?: ExportOptions, frame?: FrameOptions): Promise<Blob>
