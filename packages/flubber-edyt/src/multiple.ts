import { addPoints } from "./add";
import { INVALID_INPUT_ALL } from "./errors";
import { interpolateRing } from "./interpolate";
import { normalizeRing } from "./normalize";
import { pieceOrder } from "./order";
import { triangulate } from "./triangulate";
import type {
  CombineOptions,
  InterpolateAllOptions,
  Interpolator,
  MultiInterpolator,
  Ring,
  SeparateOptions,
  ShapeInput,
} from "./types";

const DEFAULT_MAX_SEGMENT_LENGTH = 10;

export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  options: SeparateOptions & { single: true; string: false },
): (t: number) => Ring[];
export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  options: SeparateOptions & { single: true },
): (t: number) => string;
export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  options: SeparateOptions & { string: false },
): Interpolator<Ring>[];
export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  options?: SeparateOptions,
): MultiInterpolator | Interpolator[];
export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  {
    maxSegmentLength = DEFAULT_MAX_SEGMENT_LENGTH,
    string = true,
    single = false,
    precision = null,
  }: SeparateOptions = {},
): MultiInterpolator | Interpolator[] {
  const fromRing = normalizeRing(fromShape, maxSegmentLength);

  if (fromRing.length < toShapes.length + 2) {
    addPoints(fromRing, toShapes.length + 2 - fromRing.length);
  }

  const fromRings = triangulate(fromRing, toShapes.length);
  const toRings = toShapes.map((d) => normalizeRing(d, maxSegmentLength));
  let t0: string | false | string[] = typeof fromShape === "string" && fromShape;
  let t1: ShapeInput[] | undefined;

  if (!single || toShapes.every((s) => typeof s === "string")) {
    t1 = toShapes.slice(0);
  }

  return interpolateSets(fromRings, toRings, {
    match: true,
    string,
    single,
    t0,
    t1,
    precision,
  });
}

export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  options: CombineOptions & { single: true; string: false },
): (t: number) => Ring[];
export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  options: CombineOptions & { single: true },
): (t: number) => string;
export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  options: CombineOptions & { string: false },
): Interpolator<Ring>[];
export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  options?: CombineOptions,
): MultiInterpolator | Interpolator[];
export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  {
    maxSegmentLength = DEFAULT_MAX_SEGMENT_LENGTH,
    string = true,
    single = false,
    precision = null,
  }: CombineOptions = {},
): MultiInterpolator | Interpolator[] {
  const interpolators = separate(toShape, fromShapes, {
    maxSegmentLength,
    string,
    single,
    precision,
  });

  return single
    ? (t: number) => (interpolators as MultiInterpolator)(1 - t)
    : (interpolators as Interpolator[]).map((fn) => (t: number) => fn(1 - t));
}

export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  options: InterpolateAllOptions & { single: true; string: false },
): (t: number) => Ring[];
export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  options: InterpolateAllOptions & { single: true },
): (t: number) => string;
export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  options: InterpolateAllOptions & { string: false },
): Interpolator<Ring>[];
export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  options?: InterpolateAllOptions,
): MultiInterpolator | Interpolator[];
export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  {
    maxSegmentLength = DEFAULT_MAX_SEGMENT_LENGTH,
    string = true,
    single = false,
    precision = null,
  }: InterpolateAllOptions = {},
): MultiInterpolator | Interpolator[] {
  if (
    !Array.isArray(fromShapes) ||
    !Array.isArray(toShapes) ||
    fromShapes.length !== toShapes.length ||
    !fromShapes.length
  ) {
    throw new TypeError(INVALID_INPUT_ALL);
  }

  const normalize = (s: ShapeInput) => normalizeRing(s, maxSegmentLength);
  const fromRings = fromShapes.map(normalize);
  const toRings = toShapes.map(normalize);
  let t0: ShapeInput[] | undefined;
  let t1: ShapeInput[] | undefined;

  if (single) {
    if (fromShapes.every((s) => typeof s === "string")) {
      t0 = fromShapes.slice(0);
    }
    if (toShapes.every((s) => typeof s === "string")) {
      t1 = toShapes.slice(0);
    }
  } else {
    t0 = fromShapes.slice(0);
    t1 = toShapes.slice(0);
  }

  return interpolateSets(fromRings, toRings, {
    string,
    single,
    t0,
    t1,
    match: false,
    precision,
  });
}

interface InterpolateSetsOptions {
  string?: boolean;
  single?: boolean;
  t0?: string | false | unknown[] | undefined;
  t1?: string | unknown[] | undefined;
  match?: boolean;
  precision?: number | null;
}

function interpolateSets(
  fromRings: Ring[],
  toRings: Ring[],
  {
    string = true,
    single = false,
    t0,
    t1,
    match = false,
    precision = null,
  }: InterpolateSetsOptions = {},
): MultiInterpolator | Interpolator[] {
  const order = match ? pieceOrder(fromRings, toRings) : fromRings.map((_, i) => i);

  const interpolators = order.map((d, i) =>
    interpolateRing(fromRings[d]!, toRings[i]!, { string, precision, clamp: false }),
  );

  if (match && Array.isArray(t0)) {
    t0 = order.map((d) => (t0 as unknown[])[d]);
  }

  if (single && string) {
    if (Array.isArray(t0)) {
      t0 = t0.join(" ");
    }
    if (Array.isArray(t1)) {
      t1 = t1.join(" ");
    }
  }

  if (single) {
    const multiInterpolator: MultiInterpolator = string
      ? (t: number) => interpolators.map((fn) => fn(t)).join(" ")
      : (t: number) => interpolators.map((fn) => fn(t)) as Ring[];

    if (string && (t0 || t1)) {
      const snap0 = typeof t0 === "string" ? t0 : "";
      const snap1 = typeof t1 === "string" ? t1 : "";
      return (t: number) => {
        if (t < 1e-4 && snap0) return snap0;
        if (1 - t < 1e-4 && snap1) return snap1;
        return multiInterpolator(t);
      };
    }
    return multiInterpolator;
  }

  if (string) {
    const snap0 = Array.isArray(t0)
      ? t0.map((d) => (typeof d === "string" ? d : ""))
      : [];
    const snap1 = Array.isArray(t1)
      ? t1.map((d) => (typeof d === "string" ? d : ""))
      : [];

    return interpolators.map((fn, i) => {
      if (snap0[i] || snap1[i]) {
        return (t: number) => {
          if (t < 1e-4 && snap0[i]) return snap0[i]!;
          if (1 - t < 1e-4 && snap1[i]) return snap1[i]!;
          return fn(t);
        };
      }
      return fn;
    });
  }

  return interpolators;
}
