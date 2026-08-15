import { INVALID_INPUT } from "../src/errors.ts";
import normalizeRing from "../src/normalize.ts";
import type { ShapeInput } from "../src/types.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

tape("No closing point", (test) => {
  const square = shapes.square1();
  const closed = [...square, square[0]!];
  const fuzzy: ShapeInput = [...square, [0, 1e-12]];
  const normalized = normalizeRing(square);

  test.notEqual(square, normalized);
  test.deepEqual(square, normalized);

  test.notDeepEqual(closed, normalized);
  closed.pop();
  test.deepEqual(closed, normalized);

  test.notDeepEqual(fuzzy, normalized);
  fuzzy.pop();
  test.deepEqual(fuzzy, normalized);

  test.end();
});

tape("Matching order", (test) => {
  const square = shapes.square1();
  const reversed = shapes.square1().reverse();
  const reversedClosed = [...reversed, reversed[0]!];

  test.deepEqual(square, normalizeRing(square));

  test.deepEqual(square, normalizeRing(reversed));
  test.deepEqual(square, normalizeRing(reversedClosed));

  test.end();
});

tape("Expects valid ring or string", (test) => {
  const err = new RegExp(INVALID_INPUT.slice(0, 25));

  test.throws(() => normalizeRing(1 as unknown as ShapeInput), err);
  test.throws(() => normalizeRing({} as unknown as ShapeInput), err);
  test.throws(() => normalizeRing([1, 2, 3] as unknown as ShapeInput), err);

  test.throws(
    () => normalizeRing([[0, 0], [1, 1], [2, 2], "x"] as unknown as ShapeInput),
    err,
  );

  test.end();
});

tape("Bisect", (test) => {
  test.deepEqual(normalizeRing([[0, 0]], 1e-6), [[0, 0]]);
  test.deepEqual(
    normalizeRing(
      [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      1e-6,
    ),
    [
      [0, 0],
      [0, 0],
    ],
  );
  test.deepEqual(
    normalizeRing(
      [
        [0, 0],
        [0, 0],
        [1, 0],
      ],
      0.6,
    ),
    [
      [0, 0],
      [0, 0],
      [0.5, 0],
      [1, 0],
      [0.5, 0],
    ],
  );

  test.deepEqual(
    normalizeRing(
      [
        [0, 0],
        [1, 0],
      ],
      0.6,
    ),
    [
      [0, 0],
      [0.5, 0],
      [1, 0],
      [0.5, 0],
    ],
  );
  test.end();
});
