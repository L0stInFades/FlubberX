import { addPoints } from "./add.js";
import { INVALID_INPUT_ALL } from "./errors.js";
import { interpolateRing } from "./interpolate.js";
import normalizeRing from "./normalize.js";
import pieceOrder from "./order.js";
import triangulate from "./triangulate.js";
import type {
  CombineOptions,
  InterpolateAllOptions,
  Interpolator,
  MultiInterpolator,
  Ring,
  SeparateOptions,
  ShapeInput,
} from "./types.js";

/**
 * Splits a single shape into multiple shapes and interpolates between them.
 */
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
): Interpolator[];
export function separate(
  fromShape: ShapeInput,
  toShapes: ShapeInput[],
  {
    maxSegmentLength = 10,
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
  const t0: string | false | unknown[] | undefined =
    typeof fromShape === "string" && fromShape;
  let t1: string | unknown[] | undefined;

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

/**
 * Combines multiple shapes into a single shape and interpolates between them.
 */
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
): Interpolator[];
export function combine(
  fromShapes: ShapeInput[],
  toShape: ShapeInput,
  {
    maxSegmentLength = 10,
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
    ? (t: number) => (interpolators as unknown as MultiInterpolator)(1 - t)
    : (interpolators as Interpolator[]).map((fn) => (t: number) => fn(1 - t));
}

/**
 * Interpolates between matching pairs of shapes in two shape arrays.
 */
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
): Interpolator[];
export function interpolateAll(
  fromShapes: ShapeInput[],
  toShapes: ShapeInput[],
  {
    maxSegmentLength = 10,
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
  let t0: string | unknown[] | undefined;
  let t1: string | unknown[] | undefined;

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
  const order = match
    ? pieceOrder(fromRings, toRings)
    : fromRings.map((_, i) => i);

  const interpolators = order.map((d, i) =>
    interpolateRing(fromRings[d], toRings[i], { string, precision }),
  );

  let snap0: unknown = t0;
  let snap1: unknown = t1;

  if (match && Array.isArray(snap0)) {
    const pieces = snap0;
    snap0 = order.map((d) => pieces[d]);
  }

  if (single && string) {
    if (Array.isArray(snap0)) {
      snap0 = snap0.join(" ");
    }
    if (Array.isArray(snap1)) {
      snap1 = snap1.join(" ");
    }
  }

  if (single) {
    const multiInterpolator: MultiInterpolator = string
      ? (t: number) => interpolators.map((fn) => fn(t)).join(" ")
      : (t: number) => interpolators.map((fn) => fn(t)) as Ring[];

    if (string && (snap0 || snap1)) {
      const start = typeof snap0 === "string" ? snap0 : "";
      const end = typeof snap1 === "string" ? snap1 : "";
      return (t: number) => {
        if (t < 1e-4 && start) return start;
        if (1 - t < 1e-4 && end) return end;
        return multiInterpolator(t);
      };
    }
    return multiInterpolator;
  }

  if (string) {
    const starts = Array.isArray(snap0)
      ? snap0.map((d) => (typeof d === "string" ? d : ""))
      : [];
    const ends = Array.isArray(snap1)
      ? snap1.map((d) => (typeof d === "string" ? d : ""))
      : [];

    return interpolators.map((fn, i) => {
      if (starts[i] || ends[i]) {
        return (t: number) => {
          if (t < 1e-4 && starts[i]) return starts[i]!;
          if (1 - t < 1e-4 && ends[i]) return ends[i]!;
          return fn(t);
        };
      }
      return fn;
    });
  }

  return interpolators;
}
