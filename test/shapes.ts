import type { Ring } from "../src/types.js";

export function triangle1(): Ring {
  return [
    [5, 0],
    [10, 100],
    [0, 100],
  ];
}

export function triangle2(): Ring {
  return [
    [10, 100],
    [6, 1000],
    [0, 100],
  ];
}

export function square1(): Ring {
  return [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ];
}

export function square2(): Ring {
  return [
    [100, 0],
    [200, 0],
    [200, 100],
    [100, 100],
  ];
}

export function rect(): Ring {
  return [
    [0, 0],
    [1, 0],
    [1, 100],
    [0, 100],
  ];
}
