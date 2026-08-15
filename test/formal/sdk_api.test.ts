import { describe, expect, it } from "vitest";
import flubber, {
  combine,
  distance,
  fromCircle,
  fromRect,
  interpolate,
  isFiniteNumber,
  pointAlong,
  samePoint,
  separate,
  toCircle,
  toRect,
} from "../../src/index.ts";

describe("Modern SDK API & Ergonomics Verification", () => {
  it("Default export equals interpolate", () => {
    expect(flubber).toBe(interpolate);
  });

  it("fromCircle and toCircle helpers work seamlessly", () => {
    const square = "M0,0L100,0L100,100L0,100Z";
    const morphFromCircle = fromCircle(50, 50, 40, square);
    expect(typeof morphFromCircle(0)).toBe("string");
    expect(typeof morphFromCircle(0.5)).toBe("string");
    expect(typeof morphFromCircle(1)).toBe("string");

    const morphToCircle = toCircle(square, 50, 50, 40);
    expect(typeof morphToCircle(0)).toBe("string");
    expect(typeof morphToCircle(1)).toBe("string");
  });

  it("fromRect and toRect helpers work seamlessly", () => {
    const triangle = "M50,0L100,100L0,100Z";
    const morphFromRect = fromRect(0, 0, 100, 100, triangle);
    expect(typeof morphFromRect(0)).toBe("string");
    expect(typeof morphFromRect(0.5)).toBe("string");
    expect(typeof morphFromRect(1)).toBe("string");

    const morphToRect = toRect(triangle, 0, 0, 100, 100);
    expect(typeof morphToRect(0)).toBe("string");
    expect(typeof morphToRect(1)).toBe("string");
  });

  it("separate and combine with single=true return single unified interpolator", () => {
    const bigSquare = "M0,0L200,0L200,200L0,200Z";
    const sq1 = "M0,0L50,0L50,50L0,50Z";
    const sq2 = "M100,100L150,100L150,150L100,150Z";

    const sepSingle = separate(bigSquare, [sq1, sq2], { single: true });
    expect(typeof sepSingle).toBe("function");
    const mid = (sepSingle as any)(0.5);
    expect(typeof mid).toBe("string");
    expect(mid).toContain(" ");

    const comSingle = combine([sq1, sq2], bigSquare, { single: true });
    expect(typeof comSingle).toBe("function");
    const comMid = (comSingle as any)(0.5);
    expect(typeof comMid).toBe("string");
    expect(comMid).toContain(" ");
  });

  it("Geometry utility exports work as expected", () => {
    expect(distance([0, 0], [3, 4])).toBe(5);
    expect(pointAlong([0, 0], [10, 20], 0.5)).toEqual([5, 10]);
    expect(samePoint([1, 1], [1 + 1e-10, 1])).toBe(true);
    expect(isFiniteNumber(42)).toBe(true);
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
  });
});
