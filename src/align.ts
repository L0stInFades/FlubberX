import { addPoints } from "./add.js";
import normalizeRing from "./normalize.js";
import rotate from "./rotate.js";
import { toPathString } from "./svg.js";
import type { AlignOptions, AlignResult, Ring, ShapeInput } from "./types.js";

/**
 * Aligns two shapes to have identical vertex counts and optimal rotational correspondence.
 * Returns compatible [from, to] path strings or coordinate rings ready for CSS / external animation engines.
 * Resolves Issues #94 and #85.
 */
export function align(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  options: AlignOptions & { string: false },
): AlignResult<Ring>;
export function align(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  options?: AlignOptions,
): AlignResult<string>;
export function align(
  fromShape: ShapeInput,
  toShape: ShapeInput,
  {
    maxSegmentLength = 10,
    string = true,
    precision = null,
    closed = true,
  }: AlignOptions = {},
): AlignResult {
  const fromRing = normalizeRing(fromShape, maxSegmentLength);
  const toRing = normalizeRing(toShape, maxSegmentLength);

  const diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotate(fromRing, toRing);

  if (string) {
    return [
      toPathString(fromRing, precision, closed),
      toPathString(toRing, precision, closed),
    ];
  }

  return [fromRing as Ring, toRing as Ring];
}
