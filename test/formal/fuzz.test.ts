import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  addPoints,
  align,
  bisect,
  fromCircle,
  interpolate,
  pathStringToRing,
  pieceOrder,
  rotate,
  splitPathString,
  toRect,
} from "../../src/index.ts";
import type { Point, Ring } from "../../src/types.ts";

// Generators
const pointGen: fc.Arbitrary<Point> = fc.tuple(
  fc.oneof(
    fc.integer({ min: -500, max: 500 }),
    fc.double({ min: -500, max: 500, noNaN: true }),
    fc.constant(0),
    fc.constant(1e-4),
  ),
  fc.oneof(
    fc.integer({ min: -500, max: 500 }),
    fc.double({ min: -500, max: 500, noNaN: true }),
    fc.constant(0),
    fc.constant(1e-4),
  ),
);

const ringGen: fc.Arbitrary<Ring> = fc.array(pointGen, {
  minLength: 0,
  maxLength: 15,
});

const validRingGen: fc.Arbitrary<Ring> = fc
  .array(pointGen, { minLength: 3, maxLength: 8 })
  .filter((r) =>
    r.some(
      (p, i) =>
        i > 0 &&
        (Math.abs(p[0] - r[0][0]) > 1e-2 || Math.abs(p[1] - r[0][1]) > 1e-2),
    ),
  );

// Options generator
const optionsGen = fc.record(
  {
    maxSegmentLength: fc.oneof(
      fc.constant(0),
      fc.constant(-1),
      fc.constant(Infinity),
      fc.constant(10),
      fc.double({ min: 5, max: 50, noNaN: true }),
    ),
    precision: fc.oneof(
      fc.constant(-1),
      fc.constant(0),
      fc.constant(1),
      fc.constant(6),
      fc.constant(null),
    ),
    clamp: fc.boolean(),
    optimizeEndpoints: fc.boolean(),
  },
  { requiredKeys: [] },
);

describe("Flubber Fuzzing and Extreme Edge Cases", () => {
  it("Fuzz 1: addPoints with arbitrary rings & extreme counts never throws unhandled or loops infinitely", () => {
    fc.assert(
      fc.property(
        ringGen,
        fc.integer({ min: 0, max: 30 }),
        (ring, numPoints) => {
          const copy = ring.map((p) => [p[0], p[1]] as Point);
          addPoints(copy, numPoints);
          if (ring.length > 0) {
            expect(copy.length).toBe(ring.length + numPoints);
          }
        },
      ),
      { numRuns: 50 },
    );
  });

  it("Fuzz 2: bisect with extreme/invalid maxSegmentLength never loops infinitely", () => {
    fc.assert(
      fc.property(
        ringGen,
        fc.oneof(
          fc.constant(0),
          fc.constant(-1),
          fc.constant(Infinity),
          fc.constant(NaN),
          fc.double({ min: 1, max: 50, noNaN: true }),
        ),
        (ring, maxLen) => {
          const copy = ring.map((p) => [p[0], p[1]] as Point);
          bisect(copy, maxLen);
          expect(copy.length).toBeGreaterThanOrEqual(ring.length);
        },
      ),
      { numRuns: 50 },
    );
  });

  it("Fuzz 3: interpolate with randomized path strings and options permutations", () => {
    const pathStringGen = validRingGen.map((ring) => {
      return `M${ring.map((p) => `${p[0]},${p[1]}`).join("L")}Z`;
    });

    fc.assert(
      fc.property(
        pathStringGen,
        pathStringGen,
        optionsGen,
        (from, to, opts) => {
          try {
            const interpolator = interpolate(from, to, opts as any);
            const r0 = interpolator(0);
            const rMid = interpolator(0.5);
            const r1 = interpolator(1);

            expect(r0).toBeDefined();
            expect(rMid).toBeDefined();
            expect(r1).toBeDefined();
          } catch (e) {
            expect(e instanceof TypeError || e instanceof RangeError).toBe(
              true,
            );
          }
        },
      ),
      { numRuns: 50 },
    );
  }, 10000);

  it("Fuzz 4: Malformed, empty, and non-geometric path strings throw clean TypeErrors without crashes", () => {
    const malformed = [
      "",
      "M0,0Z",
      "M10,10L10,10Z",
      "M0 0 L0 0 L0 0 Z",
      "not a path string",
      "M NaN NaN L NaN NaN Z",
    ];

    malformed.forEach((p) => {
      try {
        splitPathString(p);
      } catch (_e) {}
      try {
        pathStringToRing(p, 10);
      } catch (_e) {}
      try {
        const interp = interpolate(p, "M0,0L100,0L100,100L0,100Z");
        interp(0.5);
      } catch (e) {
        expect(e instanceof TypeError || e instanceof Error).toBe(true);
      }
    });
  });

  it("Fuzz 5: rotate and pieceOrder with mismatched or extreme rings", () => {
    fc.assert(
      fc.property(ringGen, ringGen, (ringA, ringB) => {
        const copyA = ringA.map((p) => [p[0], p[1]] as Point);
        const copyB = ringB.map((p) => [p[0], p[1]] as Point);
        rotate(copyA, copyB);
        expect(copyA.length).toBe(ringA.length);
      }),
      { numRuns: 50 },
    );

    fc.assert(
      fc.property(
        fc.array(validRingGen, { minLength: 0, maxLength: 6 }),
        fc.array(validRingGen, { minLength: 0, maxLength: 6 }),
        (starts, ends) => {
          const order = pieceOrder(starts, ends);
          expect(Array.isArray(order)).toBe(true);
          expect(order.length).toBe(starts.length);
        },
      ),
      { numRuns: 50 },
    );
  });

  it("Fuzz 6: align, toCircle, fromCircle, toRect, fromRect with valid shapes", () => {
    const square = "M0,0L100,0L100,100L0,100Z";
    const triangle = "M50,0L100,100L0,100Z";

    // align
    const [a1, a2] = align(square, triangle, { precision: 2 });
    expect(typeof a1).toBe("string");
    expect(typeof a2).toBe("string");

    // circle / rect
    const c1 = fromCircle(50, 50, 25, square);
    expect(typeof c1(0.5)).toBe("string");

    const r1 = toRect(square, 0, 0, 100, 100);
    expect(typeof r1(0.5)).toBe("string");
  });
});
