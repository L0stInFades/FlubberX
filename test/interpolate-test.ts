import { interpolateRing } from "../src/interpolate.ts";
import { interpolatePoints } from "../src/math.ts";
import { toPathString } from "../src/svg.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

tape("interpolatePoints", (test) => {
  const square1 = shapes.square1();
  const square2 = shapes.square2();
  const interpolateArray = interpolatePoints(square1, square2);
  const interpolateString = interpolatePoints(square1, square2, true);

  test.deepEqual(interpolateArray(0), square1);
  test.deepEqual(interpolateArray(0.5), [
    [50, 0],
    [150, 0],
    [150, 100],
    [50, 100],
  ]);
  test.deepEqual(interpolateArray(1), square2);
  test.deepEqual(interpolateString(0), toPathString(square1));
  test.deepEqual(
    interpolateString(0.5),
    toPathString([
      [50, 0],
      [150, 0],
      [150, 100],
      [50, 100],
    ]),
  );
  test.deepEqual(interpolateString(1), toPathString(square2));

  test.end();
});

tape("interpolateRing", (test) => {
  const square = shapes.square1();
  const triangle = shapes.triangle1();
  const interpolate = interpolateRing(square, triangle);

  test.deepEqual(interpolate(0), [
    [100, 0],
    [100, 100],
    [0, 100],
    [0, 0],
  ]);
  test.deepEqual(interpolate(0.5), [
    [52.5, 0],
    [55, 100],
    [2.5, 100],
    [0, 50],
  ]);
  test.deepEqual(interpolate(1), [
    [5, 0],
    [10, 100],
    [5, 100],
    [0, 100],
  ]);

  test.end();
});
