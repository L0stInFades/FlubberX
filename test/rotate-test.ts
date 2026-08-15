import rotate from "../src/rotate.ts";
import type { Ring } from "../src/types.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

tape("Rotate squares successfully", (test) => {
  const square = shapes.square1();

  for (let i = 0; i < 4; i++) {
    const off = offsetRing(shapes.square1(), i);

    test[i ? "notDeepEqual" : "deepEqual"](square, off);

    rotate(off, square);

    test.deepEqual(square, off);

    test.deepEqual(square, shapes.square1());
  }

  test.end();
});

tape("Min Distance", (test) => {
  const triangle = shapes.triangle1();
  const alt = shapes.triangle2();

  for (let i = 0; i < 3; i++) {
    const off = offsetRing(shapes.triangle2(), i);

    test[i ? "notDeepEqual" : "deepEqual"](alt, off);

    rotate(off, triangle);

    test.deepEqual(alt, off);

    test.deepEqual(triangle, shapes.triangle1());
  }

  test.end();
});

function offsetRing(arr: Ring, n: number): Ring {
  for (let i = 0; i < n; i++) {
    const first = arr.shift();
    if (first) arr.push(first);
  }

  return arr;
}
