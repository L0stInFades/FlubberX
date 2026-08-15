import { describe, expect, it } from "vitest";
import { align } from "../../src/align.ts";
import interpolate from "../../src/interpolate.ts";
import { polygonCentroid } from "../../src/math.ts";
import pieceOrder from "../../src/order.ts";
import { toPathString } from "../../src/svg.ts";
import type { Ring } from "../../src/types.ts";

describe("Formal Verification: Edge Cases & GitHub Issue Fixes", () => {
  it("Fix Issue #3 / #8a731f5 (Collinear & Zero-Area Degenerate Polygons): Centroid calculates safely without NaN", () => {
    // 3 collinear points along horizontal line
    const collinearH: Ring = [
      [0, 0],
      [50, 0],
      [100, 0],
    ];
    const c1 = polygonCentroid(collinearH);
    expect(Number.isFinite(c1[0])).toBe(true);
    expect(Number.isFinite(c1[1])).toBe(true);
    expect(c1).toEqual([50, 0]);

    // 3 collinear points along vertical line
    const collinearV: Ring = [
      [0, 0],
      [0, 50],
      [0, 100],
    ];
    const c2 = polygonCentroid(collinearV);
    expect(c2).toEqual([0, 50]);

    // 2-point line
    const line: Ring = [
      [10, 20],
      [30, 40],
    ];
    const c3 = polygonCentroid(line);
    expect(c3).toEqual([20, 30]);
  });

  it("Fix Issue #110 (Output Precision): Configurable decimal places in SVG path strings", () => {
    const ring: Ring = [
      [10.123456789, 20.987654321],
      [30.555555555, 40.444444444],
      [50.111111111, 60.999999999],
    ];

    // Precision = 2
    const str2 = toPathString(ring, 2);
    expect(str2).toBe("M10.12,20.99L30.56,40.44L50.11,61Z");

    // Precision = 0 (integer coordinates)
    const str0 = toPathString(ring, 0);
    expect(str0).toBe("M10,21L31,40L50,61Z");

    // Interpolation with precision option
    const square = "M0,0L100,0L100,100L0,100Z";
    const triangle = "M50,0L100,100L0,100Z";
    const interpolator = interpolate(square, triangle, { precision: 2 });
    const mid = interpolator(0.5) as string;
    expect(mid).toMatch(/^M[0-9.]+,[0-9.]+L/);
    // Ensure no 10+ digit floats
    expect(mid.split(/[MLZ,]/).every((token) => token.length < 10)).toBe(true);
  });

  it("Fix Issues #94 & #85 (Shape Alignment API): align() generates matching compatible shapes", () => {
    const square = "M0,0L100,0L100,100L0,100Z";
    const triangle = "M50,0L100,100L0,100Z";

    // Align as path strings
    const [fromStr, toStr] = align(square, triangle);
    expect(typeof fromStr).toBe("string");
    expect(typeof toStr).toBe("string");
    expect(fromStr.startsWith("M")).toBe(true);
    expect(toStr.startsWith("M")).toBe(true);

    // Both should have identical number of 'L' commands (identical vertex count)
    const countL1 = (fromStr.match(/L/g) || []).length;
    const countL2 = (toStr.match(/L/g) || []).length;
    expect(countL1).toBe(countL2);

    // Align as Rings
    const [fromRing, toRing] = align(square, triangle, { string: false });
    expect(Array.isArray(fromRing)).toBe(true);
    expect(Array.isArray(toRing)).toBe(true);
    expect((fromRing as Ring).length).toBe((toRing as Ring).length);
  });

  it("Combinatorial safety in pieceOrder for > 8 shapes: Identity permutation fallback", () => {
    const shapes: Ring[] = [];
    for (let i = 0; i < 10; i++) {
      shapes.push([
        [i * 10, 0],
        [i * 10 + 5, 0],
        [i * 10 + 5, 5],
      ]);
    }
    const order = pieceOrder(shapes, shapes);
    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("Duplicate start/end vertex deduplication", () => {
    const closedRing: Ring = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 0],
    ];
    const interpolator = interpolate(
      closedRing,
      [
        [5, 0],
        [10, 10],
        [0, 10],
      ],
      { string: false },
    );
    const result = interpolator(0.5) as Ring;
    expect(result.length).toBeGreaterThanOrEqual(3);
  });
});
