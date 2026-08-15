export type Point = [number, number];
export type Ring = Point[];
export type ShapeInput = string | Ring;

export type Interpolator<T = string | Ring> = (t: number) => T;

export type MultiInterpolator = (t: number) => string | Ring[];

export interface InterpolateOptions {
  /**
   * Maximum segment length when subdividing paths.
   * Original Flubber default is `10`. `false` or `Infinity` disables extra subdivision.
   */
  maxSegmentLength?: number | false;
  /**
   * Return SVG path string when true, ring points when false.
   */
  string?: boolean;
  /**
   * Preserve original input path strings for near-endpoint samples.
   */
  optimizeEndpoints?: boolean;
  /**
   * Threshold for endpoint optimization.
   */
  endpointEpsilon?: number;
  /**
   * Clamp `t` into [0, 1] before interpolation.
   * Original Flubber default is `false`.
   */
  clamp?: boolean;
  /**
   * Decimal precision when output is path string.
   * Original Flubber default is `null` (no rounding).
   */
  precision?: number | null;
}

export interface ShapeMorphOptions
  extends Omit<InterpolateOptions, "string"> {}

export interface SeparateOptions extends InterpolateOptions {
  /**
   * If true, return one interpolator (space-joined path string or ring[])
   * instead of an array of interpolators.
   */
  single?: boolean;
}

export type CombineOptions = SeparateOptions;
export type InterpolateAllOptions = SeparateOptions;
