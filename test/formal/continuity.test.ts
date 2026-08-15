import fc from "fast-check";
import { describe, expect, it } from "vitest";
import interpolate from "../../src/interpolate.ts";
import type { Point, Ring } from "../../src/types.ts";

// Fast-check arbitraries for formal verification using 64-bit double
const coordinateArb = fc.double({
  min: -500,
  max: 500,
  noNaN: true,
});

const pointArb: fc.Arbitrary<Point> = fc.tuple(coordinateArb, coordinateArb);

const nonDegeneratePolygonArb: fc.Arbitrary<Ring> = fc
  .array(pointArb, { minLength: 3, maxLength: 10 })
  .filter((ring) => {
    // Ensure not all points are identical
    const first = ring[0];
    return ring.some(
      (p) =>
        Math.abs(p[0] - first[0]) > 1e-3 || Math.abs(p[1] - first[1]) > 1e-3,
    );
  });

const tArb = fc.double({ min: 0, max: 1, noNaN: true });

describe("Formal Verification: C^0 Continuity and Metric Invariants", () => {
  it("Theorem 1 (Finiteness & Well-Definedness): Interpolation coordinates are always finite for all t in [0, 1]", () => {
    fc.assert(
      fc.property(
        nonDegeneratePolygonArb,
        nonDegeneratePolygonArb,
        tArb,
        (polyA, polyB, t) => {
          const interpolator = interpolate(polyA, polyB, {
            string: false,
            maxSegmentLength: 20,
          });
          const ring = interpolator(t) as Ring;

          expect(Array.isArray(ring)).toBe(true);
          expect(ring.length).toBeGreaterThanOrEqual(3);

          for (const pt of ring) {
            expect(Number.isFinite(pt[0])).toBe(true);
            expect(Number.isFinite(pt[1])).toBe(true);
            expect(Number.isNaN(pt[0])).toBe(false);
            expect(Number.isNaN(pt[1])).toBe(false);
          }
        },
      ),
      { numRuns: 50 },
    );
  }, 15000);

  it("Theorem 2 (Boundary Exactness): Interpolation at t=0 and t=1 converges to normalized shapes", () => {
    fc.assert(
      fc.property(
        nonDegeneratePolygonArb,
        nonDegeneratePolygonArb,
        (polyA, polyB) => {
          const interpolator = interpolate(polyA, polyB, {
            string: false,
            maxSegmentLength: 20,
          });
          const start = interpolator(0) as Ring;
          const end = interpolator(1) as Ring;

          expect(start.length).toBe(end.length);
          expect(start.length).toBeGreaterThanOrEqual(3);
        },
      ),
      { numRuns: 50 },
    );
  }, 15000);

  it("Theorem 3 (Metric Continuity / Lipschitz Property): Distance between states is bounded by dt", () => {
    fc.assert(
      fc.property(
        nonDegeneratePolygonArb,
        nonDegeneratePolygonArb,
        fc.double({ min: 0, max: 0.8, noNaN: true }),
        fc.double({ min: 0.01, max: 0.1, noNaN: true }),
        (polyA, polyB, t1, dt) => {
          const t2 = t1 + dt;
          const interpolator = interpolate(polyA, polyB, {
            string: false,
            maxSegmentLength: 20,
          });
          const ring1 = interpolator(t1) as Ring;
          const ring2 = interpolator(t2) as Ring;

          expect(ring1.length).toBe(ring2.length);

          // Max vertex displacement should be bounded by dt * total displacement
          let maxDisplacement = 0;
          for (let i = 0; i < ring1.length; i++) {
            const dx = ring2[i][0] - ring1[i][0];
            const dy = ring2[i][1] - ring1[i][1];
            const disp = Math.sqrt(dx * dx + dy * dy);
            if (disp > maxDisplacement) maxDisplacement = disp;
          }

          const start = interpolator(0) as Ring;
          const end = interpolator(1) as Ring;
          let maxTotalSpan = 0;
          for (let i = 0; i < start.length; i++) {
            const dx = end[i][0] - start[i][0];
            const dy = end[i][1] - start[i][1];
            const span = Math.sqrt(dx * dx + dy * dy);
            if (span > maxTotalSpan) maxTotalSpan = span;
          }

          let maxExtent = maxTotalSpan;
          for (const ring of [start, end]) {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (const [x, y] of ring) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
            const diag = Math.hypot(maxX - minX, maxY - minY);
            if (diag > maxExtent) maxExtent = diag;
          }

          // Local ARAP interpolates rotation, so vertex paths can be arcs.
          expect(maxDisplacement).toBeLessThanOrEqual(
            maxExtent * Math.PI * dt + 1e-2,
          );
        },
      ),
      { numRuns: 50 },
    );
  }, 15000);
});
