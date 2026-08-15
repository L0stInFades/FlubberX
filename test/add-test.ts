import { addPoints, bisect } from "../src/add.ts";
import type { Ring } from "../src/types.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

tape("Add points", (test) => {
  let added = shapes.square1();

  addPoints(added, 4);

  test.inDelta(added, [
    [0, 0],
    [50, 0],
    [100, 0],
    [100, 50],
    [100, 100],
    [50, 100],
    [0, 100],
    [0, 50],
  ]);

  added = shapes.square1();
  addPoints(added, 3);

  test.inDelta(added, [
    [0, 0],
    [(100 * 2) / 3, 0],
    [100, 0],
    [100, 100],
    [100, 100],
    [0, 100],
    [0, (100 * 2) / 3],
  ]);

  test.end();
});

tape("Bisect segments", (test) => {
  const added = shapes.square1();
  const rect = shapes.rect();
  const once = [
    [0, 0],
    [50, 0],
    [100, 0],
    [100, 50],
    [100, 100],
    [50, 100],
    [0, 100],
    [0, 50],
  ];
  const twice = [
    [0, 0],
    [25, 0],
    [50, 0],
    [75, 0],
    [100, 0],
    [100, 25],
    [100, 50],
    [100, 75],
    [100, 100],
    [75, 100],
    [50, 100],
    [25, 100],
    [0, 100],
    [0, 75],
    [0, 50],
    [0, 25],
  ];

  bisect(added, 150);

  test.deepEqual(added, shapes.square1());

  bisect(added, 75);

  test.deepEqual(added, once);

  bisect(added, 50);

  test.deepEqual(added, once);

  bisect(added, 49);

  test.deepEqual(added, twice);

  bisect(added, 25);

  test.deepEqual(added, twice);

  bisect(rect, 30);

  test.deepEqual(rect, [
    [0, 0],
    [1, 0],
    [1, 25],
    [1, 50],
    [1, 75],
    [1, 100],
    [0, 100],
    [0, 75],
    [0, 50],
    [0, 25],
  ]);

  test.end();
});

tape("Zero-length handling", (test) => {
  const original: Record<string, Ring> = {
    all: [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    partial: [
      [0, 0],
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    single: [[0, 0]],
  };

  const added: Record<string, Ring> = {};

  for (const key of Object.keys(original)) {
    added[key] = original[key]?.slice(0);
    addPoints(added[key], 2);
  }

  test.inDelta(added.all, [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  test.inDelta(added.single, [
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  test.inDelta(added.partial, [
    [0, 0],
    [0.5, 0.5],
    [1, 1],
    [1, 1],
    [1, 1],
    [0.5, 0.5],
  ]);

  test.end();
});

tape("Line segment", (test) => {
  const original: Ring = [
    [0, 0],
    [100, 0],
  ];

  let added = original.slice(0);
  addPoints(added, 1);

  test.inDelta(added, [
    [0, 0],
    [100, 0],
    [100, 0],
  ]);

  added = original.slice(0);
  addPoints(added, 2);

  test.inDelta(added, [
    [0, 0],
    [50, 0],
    [100, 0],
    [50, 0],
  ]);

  test.end();
});
