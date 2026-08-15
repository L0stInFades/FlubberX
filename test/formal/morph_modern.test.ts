import { describe, expect, it } from "vitest";
import { addPoints } from "../../src/add.ts";
import interpolate, {
  combine,
  fromCircle,
  interpolateAll,
  separate,
  splitPathString,
  toCircle,
  toPathString,
  toRect,
} from "../../src/index.ts";
import { interpolatePoints } from "../../src/math.ts";
import normalizeRing from "../../src/normalize.ts";
import rotate from "../../src/rotate.ts";
import type { Ring } from "../../src/types.ts";

const SQUARE: Ring = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];
const TRIANGLE: Ring = [
  [50, 0],
  [100, 100],
  [0, 100],
];
const SQUARE_PATH = "M0,0L100,0L100,100L0,100Z";
const TRIANGLE_PATH = "M50,0L100,100L0,100Z";

function alignedLerpMid(fromShape: Ring, toShape: Ring, t: number): Ring {
  const from = normalizeRing(fromShape, false);
  const to = normalizeRing(toShape, false);
  const diff = from.length - to.length;
  addPoints(from, diff < 0 ? -diff : 0);
  addPoints(to, diff > 0 ? diff : 0);
  rotate(from, to);
  return interpolatePoints(from, to, false)(t) as Ring;
}

function ringsDiffer(a: Ring, b: Ring, eps = 1e-4): boolean {
  if (a.length !== b.length) return true;
  return a.some((p, i) => {
    const q = b[i];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > eps;
  });
}

describe("modern interpolate (local ARAP)", () => {
  it("snaps path string ends and returns a closed mid path", () => {
    const fn = interpolate(SQUARE_PATH, TRIANGLE_PATH);
    expect(fn(0)).toBe(SQUARE_PATH);
    expect(fn(1)).toBe(TRIANGLE_PATH);
    const mid = fn(0.5);
    expect(typeof mid).toBe("string");
    expect(mid.startsWith("M")).toBe(true);
    expect(/Z$/i.test(mid)).toBe(true);
  });

  it("supports mixed path/ring and string:false rings of finite points", () => {
    const mixed = interpolate(SQUARE_PATH, TRIANGLE, { string: false });
    const ring = mixed(0.5);
    expect(Array.isArray(ring)).toBe(true);
    expect(ring.length).toBeGreaterThan(2);
    for (const point of ring) {
      expect(point.length).toBe(2);
      expect(Number.isFinite(point[0])).toBe(true);
      expect(Number.isFinite(point[1])).toBe(true);
    }
  });

  it("mid-t is not addPoints+rotate+lerp of the same normalized rings", () => {
    const shipped = interpolate(SQUARE, TRIANGLE, {
      string: false,
      maxSegmentLength: false,
    });
    const mid = shipped(0.5);
    const lerpMid = alignedLerpMid(SQUARE, TRIANGLE, 0.5);
    expect(ringsDiffer(mid, lerpMid)).toBe(true);
  });

  it("skips sliver triangles so a dt step stays bounded", () => {
    const sliver: Ring = [
      [0, 0],
      [152.58, 0],
      [0, 1e-9],
    ];
    const solid: Ring = [
      [0, 0],
      [100, 0],
      [50, 80],
    ];
    const fn = interpolate(sliver, solid, {
      string: false,
      maxSegmentLength: false,
    });
    const a = fn(0.5);
    const b = fn(0.51);
    const start = fn(0);
    const end = fn(1);
    let maxStep = 0;
    let maxSpan = 0;
    for (let i = 0; i < a.length; i++) {
      maxStep = Math.max(
        maxStep,
        Math.hypot(b[i][0] - a[i][0], b[i][1] - a[i][1]),
      );
      maxSpan = Math.max(
        maxSpan,
        Math.hypot(end[i][0] - start[i][0], end[i][1] - start[i][1]),
      );
    }
    expect(maxStep).toBeLessThanOrEqual(maxSpan * 0.01 * Math.PI + 1);
  });

  it("keeps original public morph names callable", () => {
    expect(typeof toCircle).toBe("function");
    expect(typeof fromCircle).toBe("function");
    expect(typeof toRect).toBe("function");
    expect(typeof separate).toBe("function");
    expect(typeof combine).toBe("function");
    expect(typeof interpolateAll).toBe("function");
    expect(typeof toPathString).toBe("function");
    expect(typeof splitPathString).toBe("function");
    expect(toCircle(SQUARE_PATH, 50, 50, 10)(1)).toMatch(/^M/);
    expect(splitPathString("M1,2L3,4ZM5,6L7,8Z")).toHaveLength(2);
  });
});
