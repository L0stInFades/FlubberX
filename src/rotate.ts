import { distance } from "./math.js";
import type { Ring } from "./types.js";

/**
 * Rotates ring in place to minimize the sum-of-squares Euclidean distance to vs.
 */
export default function rotate(ring: Ring, vs: Ring): void {
  if (!ring || !vs) return;
  const len = ring.length;
  if (len === 0 || vs.length === 0) return;

  let min = Infinity;
  let bestOffset = 0;

  for (let offset = 0; offset < len; offset++) {
    let sumOfSquares = 0;

    for (let i = 0; i < vs.length; i++) {
      const p = vs[i];
      const d = distance(ring[(offset + i) % len], p);
      sumOfSquares += d * d;
    }

    if (sumOfSquares < min) {
      min = sumOfSquares;
      bestOffset = offset;
    }
  }

  if (bestOffset) {
    const spliced = ring.splice(0, bestOffset);
    ring.splice(ring.length, 0, ...spliced);
  }
}
