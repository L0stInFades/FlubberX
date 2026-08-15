import { polygonArea } from "d3-polygon";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { distance } from "../../src/math.ts";
import normalizeRing from "../../src/normalize.ts";
import pieceOrder from "../../src/order.ts";
import rotate from "../../src/rotate.ts";
import { collapseTopology, createTopology } from "../../src/topology.ts";
import triangulate, { cut } from "../../src/triangulate.ts";
import type { Point, Ring } from "../../src/types.ts";

const coordinateArb = fc.float({
  min: -500,
  max: 500,
  noNaN: true,
  noDefaultInfinity: true,
});

const pointArb: fc.Arbitrary<Point> = fc.tuple(coordinateArb, coordinateArb);

const validPolygonArb: fc.Arbitrary<Ring> = fc
  .array(pointArb, { minLength: 3, maxLength: 15 })
  .filter((ring) => {
    const area = polygonArea(ring);
    return Math.abs(area) > 1e-3;
  });

function sumOfSquares(ringA: Ring, ringB: Ring): number {
  let sum = 0;
  for (let i = 0; i < ringA.length; i++) {
    const d = distance(ringA[i], ringB[i]);
    sum += d * d;
  }
  return sum;
}

describe("Formal Verification: Mathematical & Topological Invariants", () => {
  it("Invariant 1 (Winding Order Normalization): All normalized rings have clockwise orientation", () => {
    fc.assert(
      fc.property(validPolygonArb, (ring) => {
        const normalized = normalizeRing(ring);
        const area = polygonArea(normalized);
        // In screen coordinates, clockwise has non-positive polygonArea in d3-polygon
        expect(area).toBeLessThanOrEqual(0);
      }),
      { numRuns: 100 },
    );
  });

  it("Invariant 2 (Circular Shift Optimality): rotate() strictly achieves the global minimum sum-of-squares distance", () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 3, max: 20 })
          .chain((len) =>
            fc.tuple(
              fc.array(pointArb, { minLength: len, maxLength: len }),
              fc.array(pointArb, { minLength: len, maxLength: len }),
            ),
          ),
        ([ringA, ringB]) => {
          const rotated = ringA.slice(0);
          rotate(rotated, ringB);

          const achievedSum = sumOfSquares(rotated, ringB);

          // Exhaustively evaluate all possible shifts
          let trueMinSum = Infinity;
          for (let offset = 0; offset < ringA.length; offset++) {
            const shifted = ringA.slice(offset).concat(ringA.slice(0, offset));
            const curSum = sumOfSquares(shifted, ringB);
            if (curSum < trueMinSum) {
              trueMinSum = curSum;
            }
          }

          expect(achievedSum).toBeCloseTo(trueMinSum, 5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("Invariant 3 (Bipartite Centroid Matching): pieceOrder finds optimal assignment permutation", () => {
    const square1: Ring = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ];
    const square2: Ring = [
      [100, 0],
      [110, 0],
      [110, 10],
      [100, 10],
    ];
    const square3: Ring = [
      [200, 0],
      [210, 0],
      [210, 10],
      [200, 10],
    ];

    const start = [square3, square1, square2];
    const end = [square1, square2, square3];

    const order = pieceOrder(start, end);
    // start[1] -> square1 -> end[0] (0)
    // start[2] -> square2 -> end[1] (1)
    // start[0] -> square3 -> end[2] (2)
    expect(order).toEqual([1, 2, 0]);
  });

  it("Invariant 4 (Area Conservation in Triangulation Topology): Total simplicial area is conserved during topological collapse", () => {
    const polygon: Ring = [
      [0, 0],
      [100, 0],
      [100, 100],
      [50, 80],
      [0, 100],
    ];

    const initialArea = Math.abs(polygonArea(polygon));
    const triangles = cut(polygon);
    const topology = createTopology(triangles, polygon);

    const pieces2 = collapseTopology(topology, 2);
    const area2 = pieces2.reduce(
      (sum, piece) => sum + Math.abs(polygonArea(piece)),
      0,
    );
    expect(area2).toBeCloseTo(initialArea, 4);

    const pieces3 = triangulate(polygon, 3);
    const area3 = pieces3.reduce(
      (sum, piece) => sum + Math.abs(polygonArea(piece)),
      0,
    );
    expect(area3).toBeCloseTo(initialArea, 4);
  });
});
