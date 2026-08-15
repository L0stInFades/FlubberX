import { describe, expect, it } from "vitest";
import {
  combine,
  fromCircle,
  fromRect,
  interpolate,
  interpolateAll,
  separate,
  splitPathString,
  toCircle,
  toPathString,
  toRect,
} from "./index";
import { INVALID_INPUT_ALL } from "./errors";
import type { Ring } from "./types";

const SQUARE_PATH = "M0,0L100,0L100,100L0,100Z";
const TRIANGLE_PATH = "M50,0L100,100L0,100Z";
const LEFT_RECT = "M0,0L50,0L50,100L0,100Z";
const RIGHT_RECT = "M50,0L100,0L100,100L50,100Z";

const SQUARE_RING: Ring = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];
const BIG_SQUARE_RING: Ring = [
  [0, 0],
  [200, 0],
  [200, 200],
  [0, 200],
];

function isClosedPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("M") && /Z$/i.test(value);
}

function expectedCirclePath(x: number, y: number, r: number): string {
  return `M${x - r},${y}A${r},${r},0,1,1,${x + r},${y}A${r},${r},0,1,1,${x - r},${y}Z`;
}

function expectedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
): string {
  return `M${x},${y}L${x + width},${y}L${x + width},${y + height}L${x},${y + height}Z`;
}

describe("public surface", () => {
  it("exports the original Flubber function names", async () => {
    const api = await import("./index");
    for (const name of [
      "interpolate",
      "toCircle",
      "fromCircle",
      "toRect",
      "fromRect",
      "separate",
      "combine",
      "interpolateAll",
      "toPathString",
      "splitPathString",
    ] as const) {
      expect(typeof api[name], name).toBe("function");
    }
  });
});

describe("interpolate", () => {
  it("snaps path↔path endpoints to the exact input strings", () => {
    const fn = interpolate(SQUARE_PATH, TRIANGLE_PATH);
    expect(fn(0)).toBe(SQUARE_PATH);
    expect(fn(1)).toBe(TRIANGLE_PATH);
    expect(fn(1e-5)).toBe(SQUARE_PATH);
    expect(fn(1 - 1e-5)).toBe(TRIANGLE_PATH);
  });

  it("snaps each path-string end independently for mixed path/ring input", () => {
    const fromPath = interpolate(SQUARE_PATH, BIG_SQUARE_RING);
    expect(fromPath(0)).toBe(SQUARE_PATH);
    expect(isClosedPath(fromPath(1))).toBe(true);
    expect(fromPath(1)).not.toBe(SQUARE_PATH);

    const toPath = interpolate(SQUARE_RING, TRIANGLE_PATH);
    expect(toPath(1)).toBe(TRIANGLE_PATH);
    expect(isClosedPath(toPath(0))).toBe(true);
    expect(toPath(0)).not.toBe(TRIANGLE_PATH);
  });

  it("returns a closed path string by default for mixed path/ring input", () => {
    const mid = interpolate(SQUARE_PATH, BIG_SQUARE_RING)(0.5);
    expect(isClosedPath(mid)).toBe(true);
  });

  it("defaults maxSegmentLength to 10", () => {
    const noOpts = interpolate(SQUARE_RING, BIG_SQUARE_RING, { string: false })(0);
    const explicit10 = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: 10,
    })(0);
    const disabled = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: false,
    })(0);

    expect(noOpts.length).toBe(explicit10.length);
    expect(noOpts.length).toBeGreaterThan(disabled.length);
    expect(noOpts.length).toBeLessThan(1000);
  });

  it("interpolates only the first outer ring of a multi-subpath d", () => {
    const first = "M0,0L100,0L100,100L0,100Z";
    const second = "M200,0L250,0L250,50L200,50Z";
    const dest = "M0,0L10,0L10,10L0,10Z";
    const multi = `${first} ${second}`;

    const fromMulti = interpolate(multi, dest, { string: false, maxSegmentLength: false });
    const fromFirst = interpolate(first, dest, { string: false, maxSegmentLength: false });

    expect(fromMulti(0).length).toBe(fromFirst(0).length);
    for (const [x, y] of fromMulti(0)) {
      expect(x).toBeLessThan(150);
      expect(y).toBeLessThan(150);
    }

    const mid = interpolate(multi, dest, { maxSegmentLength: false })(0.5);
    expect(isClosedPath(mid)).toBe(true);
    expect(mid).not.toMatch(/200/);
  });

  it("returns rings when string is false and lerps aligned points", () => {
    const fn = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: false,
    });
    const start = fn(0) as Ring;
    const end = fn(1) as Ring;
    const mid = fn(0.5) as Ring;

    expect(start.length).toBe(end.length);
    expect(mid.length).toBe(start.length);
    expect(mid.length).toBeGreaterThan(0);

    for (let i = 0; i < mid.length; i++) {
      expect(mid[i]![0]).toBeCloseTo(start[i]![0] + 0.5 * (end[i]![0] - start[i]![0]));
      expect(mid[i]![1]).toBeCloseTo(start[i]![1] + 0.5 * (end[i]![1] - start[i]![1]));
    }
  });

  it("honors maxSegmentLength false and Infinity as no extra subdivision", () => {
    const dense = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: 10,
    });
    const disabled = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: false,
    });
    const infinite = interpolate(SQUARE_RING, BIG_SQUARE_RING, {
      string: false,
      maxSegmentLength: Infinity,
    });

    expect((disabled(0) as Ring).length).toBe(4);
    expect((infinite(0) as Ring).length).toBe(4);
    expect((dense(0) as Ring).length).toBeGreaterThan(4);
  });
});

describe("toPathString / splitPathString", () => {
  it("returns a closed M…L…Z path from a ring", () => {
    expect(toPathString([
      [1, 1],
      [2, 1],
      [1.5, 2],
    ])).toBe("M1,1L2,1L1.5,2Z");
  });

  it("splits a multi-subpath d into one-shape path strings", () => {
    const pieces = splitPathString("M1,2L3,4ZM5,6L7,8Z");
    expect(pieces).toHaveLength(2);
    expect(pieces.every((piece) => piece.startsWith("M"))).toBe(true);
    expect(pieces[0]).toMatch(/Z$/i);
    expect(pieces[1]).toMatch(/Z$/i);
    expect(pieces[0]).toMatch(/1/);
    expect(pieces[1]).toMatch(/5/);
  });
});

describe("toCircle / fromCircle / toRect / fromRect", () => {
  it("ends toCircle on a circle path at the given center and radius", () => {
    const x = 50;
    const y = 40;
    const r = 10;
    const fn = toCircle(SQUARE_PATH, x, y, r);
    expect(fn(1)).toBe(expectedCirclePath(x, y, r));
    expect(isClosedPath(fn(0.5))).toBe(true);
  });

  it("starts fromCircle on that same circle path", () => {
    const x = 50;
    const y = 40;
    const r = 10;
    expect(fromCircle(x, y, r, TRIANGLE_PATH)(0)).toBe(expectedCirclePath(x, y, r));
  });

  it("places string:false circle-end points on the circle", () => {
    const x = 50;
    const y = 40;
    const r = 10;
    const ring = toCircle(SQUARE_RING, x, y, r, {
      string: false,
      maxSegmentLength: false,
    })(1) as Ring;
    expect(ring.length).toBeGreaterThan(0);
    for (const point of ring) {
      expect(Math.hypot(point[0] - x, point[1] - y)).toBeCloseTo(r, 6);
    }
  });

  it("ends toRect on a rectangle path from (x, y) with width × height", () => {
    const fn = toRect(TRIANGLE_PATH, 10, 20, 30, 40);
    expect(fn(1)).toBe(expectedRectPath(10, 20, 30, 40));
    expect(fromRect(10, 20, 30, 40, TRIANGLE_PATH)(0)).toBe(
      expectedRectPath(10, 20, 30, 40),
    );
  });

  it("places string:false rect-end points on the rectangle boundary", () => {
    const x = 10;
    const y = 20;
    const width = 30;
    const height = 40;
    const ring = toRect(SQUARE_RING, x, y, width, height, {
      string: false,
      maxSegmentLength: false,
    })(1) as Ring;
    expect(ring.length).toBeGreaterThan(0);
    for (const [px, py] of ring) {
      const onVertical = (Math.abs(px - x) < 1e-6 || Math.abs(px - (x + width)) < 1e-6)
        && py >= y - 1e-6
        && py <= y + height + 1e-6;
      const onHorizontal = (Math.abs(py - y) < 1e-6 || Math.abs(py - (y + height)) < 1e-6)
        && px >= x - 1e-6
        && px <= x + width + 1e-6;
      expect(onVertical || onHorizontal).toBe(true);
    }
  });
});

describe("separate / combine / interpolateAll", () => {
  it("returns one interpolator per target and snaps string ends", () => {
    const interpolators = separate(SQUARE_PATH, [LEFT_RECT, RIGHT_RECT]);
    expect(Array.isArray(interpolators)).toBe(true);
    expect(interpolators).toHaveLength(2);
    expect(interpolators[0]!(1)).toBe(LEFT_RECT);
    expect(interpolators[1]!(1)).toBe(RIGHT_RECT);
    expect(isClosedPath(interpolators[0]!(0.5))).toBe(true);
    expect(isClosedPath(interpolators[1]!(0.5))).toBe(true);
  });

  it("joins pieces into one interpolator when single is true", () => {
    const fn = separate(SQUARE_PATH, [LEFT_RECT, RIGHT_RECT], { single: true });
    expect(typeof fn).toBe("function");
    expect(fn(0)).toBe(SQUARE_PATH);
    expect(fn(1)).toBe(`${LEFT_RECT} ${RIGHT_RECT}`);
    const mid = fn(0.5);
    expect(typeof mid).toBe("string");
    expect((mid as string).split(" ")).toHaveLength(2);
  });

  it("makes combine the time-reversal of the matching separate", () => {
    const sepSingle = separate(SQUARE_PATH, [LEFT_RECT, RIGHT_RECT], { single: true });
    const combSingle = combine([LEFT_RECT, RIGHT_RECT], SQUARE_PATH, { single: true });
    expect(typeof sepSingle).toBe("function");
    expect(typeof combSingle).toBe("function");
    expect(sepSingle(0)).toBe(combSingle(1));
    expect(sepSingle(1)).toBe(combSingle(0));

    const sep = separate(SQUARE_PATH, [LEFT_RECT, RIGHT_RECT]);
    const comb = combine([LEFT_RECT, RIGHT_RECT], SQUARE_PATH);
    expect(sep).toHaveLength(comb.length);
    expect(sep[0]!(1)).toBe(comb[0]!(0));
    expect(sep[1]!(1)).toBe(comb[1]!(0));
    expect(sep[0]!(0)).toBe(comb[0]!(1));
    expect(sep[1]!(0)).toBe(comb[1]!(1));
  });

  it("pairs interpolateAll by list order and rejects bad lengths", () => {
    const interpolators = interpolateAll(
      [SQUARE_PATH, LEFT_RECT],
      [RIGHT_RECT, TRIANGLE_PATH],
    );
    expect(interpolators).toHaveLength(2);
    expect(interpolators[0]!(0)).toBe(SQUARE_PATH);
    expect(interpolators[0]!(1)).toBe(RIGHT_RECT);
    expect(interpolators[1]!(0)).toBe(LEFT_RECT);
    expect(interpolators[1]!(1)).toBe(TRIANGLE_PATH);

    const joined = interpolateAll(
      [SQUARE_PATH, LEFT_RECT],
      [RIGHT_RECT, TRIANGLE_PATH],
      { single: true },
    );
    expect(typeof joined).toBe("function");
    expect(joined(0)).toBe(`${SQUARE_PATH} ${LEFT_RECT}`);
    expect(joined(1)).toBe(`${RIGHT_RECT} ${TRIANGLE_PATH}`);

    expect(() => interpolateAll([], [])).toThrow(TypeError);
    expect(() => interpolateAll([SQUARE_PATH], [LEFT_RECT, RIGHT_RECT])).toThrow(
      INVALID_INPUT_ALL,
    );
    expect(() =>
      interpolateAll([SQUARE_PATH, LEFT_RECT], [RIGHT_RECT]),
    ).toThrow(TypeError);
  });
});
