import * as EarcutModule from "earcut";
import type { Point, Ring } from "./types";

const earcutFn: (coords: number[]) => number[] =
  (EarcutModule as unknown as { default?: (coords: number[]) => number[] }).default ??
  (EarcutModule as unknown as (coords: number[]) => number[]);

interface Piece {
  indices: number[];
  area: number;
}

/**
 * Split a ring into `numPieces` polygonal pieces by triangulating and
 * repeatedly merging the smallest adjacent pair.
 */
export function triangulate(ring: Ring, numPieces: number): Ring[] {
  if (numPieces <= 0) {
    throw new RangeError("Can't collapse topology into " + numPieces + " pieces.");
  }

  if (numPieces === 1) {
    return [ring.slice()];
  }

  const pieces = cut(ring).map((tri) => ({
    indices: tri,
    area: triangleArea(ring, tri),
  }));

  pieces.sort((a, b) => a.area - b.area);

  if (pieces.length < numPieces) {
    throw new RangeError("Can't collapse topology into " + numPieces + " pieces.");
  }

  while (pieces.length > numPieces) {
    mergeSmallest(pieces);
  }

  return pieces.map((piece) => piece.indices.map((i) => ring[i]!.slice() as Point));
}

export function cut(ring: Ring): number[][] {
  const flatCoords = new Array(ring.length * 2);
  for (let i = 0; i < ring.length; i++) {
    flatCoords[i * 2] = ring[i]![0];
    flatCoords[i * 2 + 1] = ring[i]![1];
  }

  const cuts = earcutFn(flatCoords);
  const triangles: number[][] = [];
  for (let i = 0; i < cuts.length; i += 3) {
    triangles.push([cuts[i]!, cuts[i + 1]!, cuts[i + 2]!]);
  }
  return triangles;
}

function triangleArea(ring: Ring, tri: number[]): number {
  const a = ring[tri[0]!]!;
  const b = ring[tri[1]!]!;
  const c = ring[tri[2]!]!;
  return Math.abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2);
}

function findSharedEdge(
  a: number[],
  b: number[],
): { ai: number; bi: number } | null {
  const n = a.length;
  const m = b.length;
  for (let i = 0; i < n; i++) {
    const a0 = a[i];
    const a1 = a[(i + 1) % n];
    for (let j = 0; j < m; j++) {
      if (a0 === b[(j + 1) % m] && a1 === b[j]) {
        return { ai: i, bi: j };
      }
    }
  }
  return null;
}

function mergeIndexRings(a: number[], b: number[], ai: number, bi: number): number[] {
  const n = a.length;
  const m = b.length;
  const merged: number[] = [];

  for (let k = 0; k < n; k++) {
    merged.push(a[(ai + 1 + k) % n]!);
  }
  for (let k = 1; k < m - 1; k++) {
    merged.push(b[(bi + 1 + k) % m]!);
  }
  return merged;
}

function mergeSmallest(pieces: Piece[]): void {
  const smallest = pieces[0]!;
  let neighborIndex = -1;
  let shared: { ai: number; bi: number } | null = null;

  for (let i = 1; i < pieces.length; i++) {
    const found = findSharedEdge(smallest.indices, pieces[i]!.indices);
    if (found) {
      neighborIndex = i;
      shared = found;
      break;
    }
  }

  if (neighborIndex < 0 || !shared) {
    throw new RangeError("Can't collapse topology: no adjacent piece.");
  }

  const neighbor = pieces[neighborIndex]!;
  const merged: Piece = {
    indices: mergeIndexRings(smallest.indices, neighbor.indices, shared.ai, shared.bi),
    area: smallest.area + neighbor.area,
  };

  pieces.splice(neighborIndex, 1);
  pieces.shift();

  let lo = 0;
  let hi = pieces.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pieces[mid]!.area < merged.area) lo = mid + 1;
    else hi = mid;
  }
  pieces.splice(lo, 0, merged);
}
