import { distance, polygonCentroid } from "./math.js";
import type { Ring } from "./types.js";

/**
 * Finds the optimal bipartite permutation matching start shapes to end shapes
 * by minimizing total squared centroid distances.
 */
export default function pieceOrder(start: Ring[], end: Ring[]): number[] {
  if (!start?.length) return [];
  if (!end?.length || start.length !== end.length || start.length > 8) {
    return start.map((_, i) => i);
  }
  const distances = start.map((p1) => end.map((p2) => squaredDistance(p1, p2)));
  return bestOrder(start, end, distances);
}

export function bestOrder(
  start: Ring[],
  _end: Ring[],
  distances: number[][],
): number[] {
  let min = Infinity;
  let best = start.map((_, i) => i);

  function permute(arr: number[], order: number[] = [], sum: number = 0): void {
    for (let i = 0; i < arr.length; i++) {
      const cur = arr.splice(i, 1);
      const dist = distances[cur[0]][order.length];
      if (sum + dist < min) {
        if (arr.length) {
          permute(arr.slice(), order.concat(cur), sum + dist);
        } else {
          min = sum + dist;
          best = order.concat(cur);
        }
      }
      if (arr.length) {
        arr.splice(i, 0, cur[0]);
      }
    }
  }

  permute(best);
  return best;
}

function squaredDistance(p1: Ring, p2: Ring): number {
  const d = distance(polygonCentroid(p1), polygonCentroid(p2));
  return d * d;
}
