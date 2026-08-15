import { polygonCentroid as d3Centroid } from "d3-polygon";
import { toPathString } from "./svg.js";
import type { Point, Ring } from "./types.js";

/**
 * Calculates Euclidean distance between two 2D points.
 */
export function distance(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Computes a point along a line segment between a and b at parametric fraction pct.
 */
export function pointAlong(a: Point, b: Point, pct: number): Point {
  return [a[0] + (b[0] - a[0]) * pct, a[1] + (b[1] - a[1]) * pct];
}

/**
 * Tests if two 2D points are identical within numerical epsilon (1e-9).
 */
export function samePoint(a: Point, b: Point): boolean {
  return distance(a, b) < 1e-9;
}

/**
 * Creates an interpolator function between two coordinate rings.
 */
export function interpolatePoints(
  a: Ring,
  b: Ring,
  string?: boolean,
  precision?: number | null,
): (t: number) => string | Ring {
  const len = a.length;
  const fromX = new Float64Array(len);
  const fromY = new Float64Array(len);
  const dx = new Float64Array(len);
  const dy = new Float64Array(len);

  for (let i = 0; i < len; i++) {
    const start = a[i];
    const end = b[i];
    fromX[i] = start[0];
    fromY[i] = start[1];
    dx[i] = end[0] - start[0];
    dy[i] = end[1] - start[1];
  }

  return (t: number): string | Ring => {
    const values: Ring = new Array(len);
    for (let i = 0; i < len; i++) {
      values[i] = [fromX[i] + t * dx[i], fromY[i] + t * dy[i]];
    }
    return string ? toPathString(values, precision) : values;
  };
}

/**
 * Linearly interpolates between two 2D points at parametric value t.
 */
export function interpolatePoint(a: Point, b: Point): (t: number) => Point {
  return (t: number): Point => [
    a[0] + t * (b[0] - a[0]),
    a[1] + t * (b[1] - a[1]),
  ];
}

/**
 * Type guard for finite numbers.
 */
export function isFiniteNumber(number: unknown): number is number {
  return typeof number === "number" && Number.isFinite(number);
}

/**
 * Calculates the geometric centroid of a polygon.
 * Falls back to arithmetic midpoint for degenerate polygons (collinear or single point).
 */
export function polygonCentroid(polygon: Ring): Point {
  if (!polygon?.length) return [0, 0];
  return nonZeroArea(polygon)
    ? (d3Centroid(polygon) as Point)
    : [
        (polygon[0][0] + polygon[polygon.length - 1][0]) / 2,
        (polygon[0][1] + polygon[polygon.length - 1][1]) / 2,
      ];
}

/**
 * Checks if a polygon has non-zero enclosed area across any vertex triple.
 */
function nonZeroArea(polygon: Ring): boolean {
  for (let i = 0; i < polygon.length - 2; i++) {
    const a = polygon[i];
    const b = polygon[i + 1];
    const c = polygon[i + 2];

    if (
      a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]) !==
      0
    ) {
      return true;
    }
  }

  return false;
}
