import { polygonLength } from "d3-polygon";
import { distance, isFiniteNumber, pointAlong } from "./math.js";
import type { Point, Ring } from "./types.js";

/**
 * Distributes additional points uniformly along the perimeter of a polygon ring.
 * Modifies the ring in place.
 */
export function addPoints(ring: Ring, numPoints: number): void {
  if (
    !ring ||
    ring.length === 0 ||
    !numPoints ||
    numPoints <= 0 ||
    !isFiniteNumber(numPoints)
  ) {
    return;
  }

  const desiredLength = ring.length + Math.floor(numPoints);
  const polyLen = polygonLength(ring);
  if (!polyLen || polyLen <= 0 || !isFiniteNumber(polyLen)) {
    // If perimeter is zero (e.g. all points coincide), pad with duplicate points
    const padPoint = ring[0]
      ? ([ring[0][0], ring[0][1]] as Point)
      : ([0, 0] as Point);
    while (ring.length < desiredLength) {
      ring.push([padPoint[0], padPoint[1]]);
    }
    return;
  }

  const step = polyLen / numPoints;
  let i = 0;
  let cursor = 0;
  let insertAt = step / 2;

  while (ring.length < desiredLength && i < ring.length) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const segment = distance(a, b);

    if (insertAt <= cursor + segment) {
      ring.splice(
        i + 1,
        0,
        segment
          ? pointAlong(a, b, (insertAt - cursor) / segment)
          : ([a[0], a[1]] as Point),
      );
      insertAt += step;
      continue;
    }

    cursor += segment;
    i++;
  }
}

/**
 * Recursively bisects any edge longer than maxSegmentLength.
 * Modifies the ring in place.
 */
export function bisect(ring: Ring, maxSegmentLength: number = Infinity): void {
  if (
    !ring ||
    ring.length === 0 ||
    !maxSegmentLength ||
    maxSegmentLength <= 0 ||
    !isFiniteNumber(maxSegmentLength) ||
    maxSegmentLength === Infinity
  ) {
    return;
  }

  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    let b = i === ring.length - 1 ? ring[0] : ring[i + 1];

    let safetyCount = 0;
    while (distance(a, b) > maxSegmentLength && safetyCount < 1000) {
      b = pointAlong(a, b, 0.5);
      ring.splice(i + 1, 0, b);
      safetyCount++;
    }
  }
}
