import { polygonArea } from "d3-polygon";
import { bisect } from "./add.js";
import { INVALID_INPUT } from "./errors.js";
import { isFiniteNumber, samePoint } from "./math.js";
import { pathStringToRing } from "./svg.js";
import type { Ring, ShapeInput } from "./types.js";

/**
 * Normalizes an input shape (SVG path string or coordinate array) into a standardized clockwise Ring.
 */
export default function normalizeRing(
  ring: ShapeInput,
  maxSegmentLength?: number | false,
): Ring {
  let points: Ring;
  let skipBisect = false;

  if (typeof ring === "string") {
    const converted = pathStringToRing(ring, maxSegmentLength);
    points = converted.ring.slice(0);
    skipBisect = Boolean(converted.skipBisect);
  } else if (Array.isArray(ring)) {
    points = ring.slice(0);
  } else {
    throw new TypeError(INVALID_INPUT);
  }

  if (!validRing(points)) {
    throw new TypeError(INVALID_INPUT);
  }

  // Remove duplicate closing point if present
  if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
    points.pop();
  }

  const area = polygonArea(points);

  // Ensure all rings have clockwise orientation (d3-polygon area < 0 for clockwise in standard screen coordinates)
  if (area > 0) {
    points.reverse();
  }

  if (
    !skipBisect &&
    maxSegmentLength !== undefined &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0
  ) {
    bisect(points, maxSegmentLength);
  }

  return points;
}

function validRing(ring: unknown): ring is Ring {
  if (!Array.isArray(ring) || !ring.length) return false;
  return ring.every(
    (point) =>
      Array.isArray(point) &&
      point.length >= 2 &&
      isFiniteNumber(point[0]) &&
      isFiniteNumber(point[1]),
  );
}
