import { addPoints } from "./add.js";
import { interpolateRingsRigid } from "./arap.js";
import normalizeRing from "./normalize.js";
import rotate from "./rotate.js";
import type {
  InterpolateOptions,
  Interpolator,
  Ring,
  ShapeInput,
} from "./types.js";

/**
 * Creates an interpolator function between two SVG paths or polygon coordinate arrays.
 */
export default function interpolate(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  options: InterpolateOptions & { string: false },
): (t: number) => Ring;
export default function interpolate(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  options?: InterpolateOptions,
): (t: number) => string;
export default function interpolate(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  {
    maxSegmentLength = 10,
    string = true,
    optimizeEndpoints = true,
    endpointEpsilon = 1e-4,
    clamp = false,
    precision = null,
  }: InterpolateOptions = {},
): Interpolator {
  const fromRing = normalizeRing(fromShape, maxSegmentLength);
  const toRing = normalizeRing(toShape, maxSegmentLength);
  const interpolator = interpolateRing(fromRing, toRing, {
    string,
    precision,
  });

  // Extra optimization for near either end with path strings
  if (
    !optimizeEndpoints ||
    !string ||
    (typeof fromShape !== "string" && typeof toShape !== "string")
  ) {
    if (clamp) {
      return (t: number) => interpolator(Math.max(0, Math.min(1, t)));
    }
    return interpolator;
  }

  return (t: number) => {
    const tt = clamp ? Math.max(0, Math.min(1, t)) : t;
    if (tt < endpointEpsilon && typeof fromShape === "string") {
      return fromShape;
    }
    if (1 - tt < endpointEpsilon && typeof toShape === "string") {
      return toShape;
    }
    return interpolator(tt);
  };
}

/**
 * Interpolates directly between two normalized polygon coordinate rings.
 * Supports legacy signature (fromRing, toRing, string) and modern options object.
 * If 3rd parameter is omitted, defaults to returning array of coordinates (string = false).
 */
export function interpolateRing(
  fromRingInput: Ring,
  toRingInput: Ring,
  stringOrOptions?: boolean | InterpolateOptions,
): Interpolator {
  let string = false;
  let precision: number | null = null;

  if (typeof stringOrOptions === "boolean") {
    string = stringOrOptions;
  } else if (typeof stringOrOptions === "object" && stringOrOptions !== null) {
    if (stringOrOptions.string !== undefined) {
      string = Boolean(stringOrOptions.string);
    }
    if (stringOrOptions.precision !== undefined) {
      precision = stringOrOptions.precision;
    }
  }

  const fromRing = fromRingInput.slice(0);
  const toRing = toRingInput.slice(0);

  const diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotate(fromRing, toRing);

  return interpolateRingsRigid(fromRing, toRing, string, precision);
}
