import { addPoints } from "./add";
import { clamp01, interpolatePoint } from "./geometry";
import { normalizeRing } from "./normalize";
import { rotateToBestAlignment } from "./rotate";
import { toPathString } from "./svg";
import type {
  InterpolateOptions,
  Ring,
  ShapeInput,
  ShapeMorphOptions,
  Point,
} from "./types";

const DEFAULT_MAX_SEGMENT_LENGTH = 0.01;
const DEFAULT_ENDPOINT_EPSILON = 1e-4;

export function interpolate(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  {
    maxSegmentLength = DEFAULT_MAX_SEGMENT_LENGTH,
    string = true,
    optimizeEndpoints = true,
    endpointEpsilon = DEFAULT_ENDPOINT_EPSILON,
  }: InterpolateOptions = {},
): (t: number) => string | Ring {
  const fromRing = normalizeRing(fromShape, maxSegmentLength);
  const toRing = normalizeRing(toShape, maxSegmentLength);

  const morph = interpolateRing(fromRing, toRing, string);

  if (
    !optimizeEndpoints ||
    !string ||
    (typeof fromShape !== "string" && typeof toShape !== "string")
  ) {
    return morph;
  }

  return (t: number) => {
    const clamped = clamp01(t);
    if (clamped < endpointEpsilon && typeof fromShape === "string") {
      return fromShape;
    }
    if (1 - clamped < endpointEpsilon && typeof toShape === "string") {
      return toShape;
    }
    return morph(clamped);
  };
}

export function createShapeMorphInterpolator(
  fromPath: string,
  toPath: string,
  options: ShapeMorphOptions = {},
): (t: number) => string {
  return interpolate(fromPath, toPath, {
    ...options,
    string: true,
  }) as (t: number) => string;
}

export function interpolateRing(
  fromRingInput: Ring,
  toRingInput: Ring,
  string = true,
): (t: number) => string | Ring {
  const fromRing = fromRingInput.slice() as Ring;
  const toRing = toRingInput.slice() as Ring;

  const diff = fromRing.length - toRing.length;
  addPoints(fromRing, diff < 0 ? -diff : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotateToBestAlignment(fromRing, toRing);

  const pointInterpolators: Array<(t: number) => Point> = fromRing.map((point, i) => {
    const target = toRing[i]!;
    return (t: number) => interpolatePoint(point, target, t);
  });

  return (t: number) => {
    const clamped = clamp01(t);
    const ring = pointInterpolators.map((fn) => fn(clamped));
    return string ? toPathString(ring) : ring;
  };
}
