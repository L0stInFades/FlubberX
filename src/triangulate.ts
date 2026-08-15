import Earcut from "earcut";
import {
  collapseTopology,
  createTopology,
  type TriangleSegments,
} from "./topology.js";
import type { Ring } from "./types.js";

const earcutFn: (coords: number[]) => number[] =
  (Earcut as unknown as { default?: (coords: number[]) => number[] }).default ??
  (Earcut as unknown as (coords: number[]) => number[]);

/**
 * Decomposes a ring into numPieces polygonal components using triangulation and topology collapse.
 */
export default function triangulate(ring: Ring, numPieces: number): Ring[] {
  return collapseTopology(createTopology(cut(ring), ring), numPieces);
}

export function cut(ring: Ring): TriangleSegments[] {
  const flatCoords: number[] = new Array(ring.length * 2);
  for (let i = 0; i < ring.length; i++) {
    flatCoords[i * 2] = ring[i][0];
    flatCoords[i * 2 + 1] = ring[i][1];
  }

  const cuts = earcutFn(flatCoords);
  const triangles: TriangleSegments[] = [];

  for (let i = 0, l = cuts.length; i < l; i += 3) {
    // Save each triangle as segments [a, b], [b, c], [c, a]
    triangles.push([
      [cuts[i], cuts[i + 1]],
      [cuts[i + 1], cuts[i + 2]],
      [cuts[i + 2], cuts[i]],
    ]);
  }

  return triangles;
}
