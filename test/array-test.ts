import interpolate from "../src/interpolate.ts";
import { combine, separate } from "../src/multiple.ts";
import { toPathString } from "../src/svg.ts";
import type { Ring } from "../src/types.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

tape("interpolate single array", (test) => {
  const interpolator = interpolate(shapes.square1(), shapes.square2(), {
    string: false,
    maxSegmentLength: Infinity,
  });

  test.deepEqual(interpolator(0), shapes.square1());
  test.deepEqual(interpolator(1), shapes.square2());
  test.deepEqual(interpolator(0.5), [
    [50, 0],
    [150, 0],
    [150, 100],
    [50, 100],
  ]);
  test.end();
});

tape("interpolate single array as string", (test) => {
  const interpolator = interpolate(shapes.square1(), shapes.square2(), {
    maxSegmentLength: Infinity,
  });

  test.deepEqual(interpolator(0), toPathString(shapes.square1()));
  test.deepEqual(interpolator(1), toPathString(shapes.square2()));
  test.deepEqual(
    interpolator(0.5),
    toPathString([
      [50, 0],
      [150, 0],
      [150, 100],
      [50, 100],
    ]),
  );
  test.end();
});

tape("separate/combine arrays", (test) => {
  const separator = separate(
    shapes.square1(),
    [shapes.triangle1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      string: false,
    },
  );

  const combiner = combine(
    [shapes.triangle1(), shapes.square2()],
    shapes.square1(),
    {
      maxSegmentLength: Infinity,
      string: false,
    },
  );

  const firstStart = separator[0]?.(0) as Ring;
  const secondStart = separator[1]?.(0) as Ring;
  test.equal(separator.length, 2);
  test.ok(firstStart.length >= 3);
  test.ok(secondStart.length >= 3);
  for (const [x, y] of [...firstStart, ...secondStart]) {
    test.ok(Number.isFinite(x) && Number.isFinite(y));
    test.ok(x >= -1e-6 && x <= 100 + 1e-6);
    test.ok(y >= -1e-6 && y <= 100 + 1e-6);
  }
  test.inDelta(separator[0]?.(1), shapes.triangle1());
  test.inDelta(separator[1]?.(1), shapes.square2());
  test.inDelta(separator[0]?.(0), combiner[0]?.(1));
  test.inDelta(separator[1]?.(0), combiner[1]?.(1));

  test.end();
});

tape("separate/combine arrays single", (test) => {
  const separator = separate(
    shapes.square1(),
    [shapes.triangle1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false,
    },
  );

  const start = separator(0) as Ring[];
  test.equal(start.length, 2);
  test.ok((start[0]?.length ?? 0) >= 3);
  test.ok((start[1]?.length ?? 0) >= 3);
  test.inDelta(separator(1), [shapes.triangle1(), shapes.square2()]);

  test.end();
});

tape("mix and match string/ring", (test) => {
  const separator = separate(
    shapes.square1(),
    [shapes.triangle1(), toPathString(shapes.square2())],
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false,
    },
  );

  const combiner = combine(
    [shapes.triangle1(), shapes.square2()],
    toPathString(shapes.square1()),
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false,
    },
  );

  const start = separator(0) as Ring[];
  test.equal(start.length, 2);
  test.ok((start[0]?.length ?? 0) >= 3);
  test.ok((start[1]?.length ?? 0) >= 3);
  test.inDelta(separator(1), [shapes.triangle1(), shapes.square2()]);
  test.deepEqual(separator(0), combiner(1));

  test.end();
});

tape("separate/combine arrays with too few points", (test) => {
  const separator = separate(
    shapes.triangle1(),
    [shapes.square1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      string: false,
    },
  );

  test.assert(separator.length === 2);

  separator.forEach((fn) => {
    const mid = fn(0.5) as Ring;
    test.assert(Array.isArray(mid) && mid.length === 4);
  });

  test.end();
});
