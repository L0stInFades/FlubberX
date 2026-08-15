/**
 * Represents a 2D coordinate point [x, y].
 */
export type Point = [number, number];

/**
 * A polygonal ring represented as an ordered array of 2D points.
 */
export type Ring = Point[];

/**
 * Valid input shape representation: either an SVG path string or an array of [x, y] points.
 */
export type ShapeInput = string | Ring;

/**
 * Interpolation function taking a normalized time t in [0, 1] and returning the morphed shape.
 */
export type Interpolator<T = string | Ring> = (t: number) => T;

/**
 * Multi-shape interpolation function taking a normalized time t in [0, 1] and returning multiple morphed shapes.
 */
export type MultiInterpolator = (t: number) => string | Ring[];

/**
 * Options for shape interpolation.
 */
export interface InterpolateOptions {
  /**
   * Maximum length of any segment when subdividing paths.
   * Lower values produce smoother, higher-density morphs.
   * Defaults to 10. `false` or `Infinity` disables extra subdivision.
   */
  maxSegmentLength?: number | false;

  /**
   * Whether to output an SVG path string (true) or an array of coordinate points (false).
   * Defaults to true.
   */
  string?: boolean;

  /**
   * Extra optimization to return exact input shapes when t is very close to 0 or 1.
   * Defaults to true.
   */
  optimizeEndpoints?: boolean;

  /**
   * Epsilon threshold near t=0 or t=1 for endpoint optimization.
   * Defaults to 1e-4.
   */
  endpointEpsilon?: number;

  /**
   * Whether to clamp t to [0, 1] before evaluation.
   * Defaults to false for standard flubber compatibility.
   */
  clamp?: boolean;

  /**
   * Coordinate precision for generated SVG path strings (number of decimal places).
   * If null/undefined, preserves full floating-point precision.
   */
  precision?: number | null;

  /**
   * Whether the shape should be treated as a closed polygon (default: true) or an open polyline (false).
   */
  closed?: boolean;
}

/**
 * Options for separating a single shape into multiple shapes.
 */
export interface SeparateOptions extends InterpolateOptions {
  /**
   * If true, returns a single interpolator function returning space-separated paths
   * or nested arrays, instead of an array of individual interpolators.
   * Defaults to false.
   */
  single?: boolean;
}

/**
 * Options for combining multiple shapes into a single shape.
 */
export interface CombineOptions extends InterpolateOptions {
  /**
   * If true, returns a single interpolator function returning space-separated paths
   * or nested arrays, instead of an array of individual interpolators.
   * Defaults to false.
   */
  single?: boolean;
}

/**
 * Options for interpolating between two arrays of shapes.
 */
export interface InterpolateAllOptions extends InterpolateOptions {
  /**
   * If true, returns a single interpolator function returning space-separated paths
   * or nested arrays, instead of an array of individual interpolators.
   * Defaults to false.
   */
  single?: boolean;
}

/**
 * Options for aligning shapes without generating an animation interpolator.
 */
export interface AlignOptions {
  /**
   * Maximum length of any segment when subdividing paths.
   * Defaults to 10.
   */
  maxSegmentLength?: number;

  /**
   * Whether to output SVG path strings (true) or arrays of coordinate points (false).
   * Defaults to true.
   */
  string?: boolean;

  /**
   * Coordinate precision for generated SVG path strings.
   */
  precision?: number | null;

  /**
   * Whether to treat as closed ring. Defaults to true.
   */
  closed?: boolean;
}

/**
 * Result of aligning two shapes.
 */
export type AlignResult<T = string | Ring> = [T, T];
