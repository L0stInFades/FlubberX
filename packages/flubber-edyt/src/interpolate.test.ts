import { describe, expect, it } from "vitest";
import { createShapeMorphInterpolator, interpolate } from "./interpolate";

describe("flubber-edyt interpolate", () => {
  it("returns exact endpoints for string inputs", () => {
    const a = "M0,0L1,0L1,1L0,1Z";
    const b = "M0.5,0L1,1L0,1Z";

    const fn = createShapeMorphInterpolator(a, b);

    expect(fn(0)).toBe(a);
    expect(fn(1)).toBe(b);
  });

  it("interpolates ring output when string=false", () => {
    const a: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    const b: Array<[number, number]> = [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ];

    const fn = interpolate(a, b, { string: false });
    const mid = fn(0.5);

    expect(Array.isArray(mid)).toBe(true);
    expect((mid as Array<[number, number]>).length).toBeGreaterThan(0);
  });
});
