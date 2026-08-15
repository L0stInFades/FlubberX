import { range, shuffle } from "d3-array";
import tape from "tape";
import { bestOrder } from "../src/order.ts";
import type { Ring } from "../src/types.ts";

const start = range(6);

tape("Best order", (test) => {
  for (let i = 0; i < 3; i++) {
    const end = start.slice(0);
    shuffle(end);
    const distances = start.map((a) => end.map((b) => Math.abs(a - b)));
    const order = bestOrder(
      start as unknown as Ring[],
      end as unknown as Ring[],
      distances,
    );
    const ordered = order.map((d) => start[d]);
    test.deepEqual(ordered, end);
  }

  test.end();
});
