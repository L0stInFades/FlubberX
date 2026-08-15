import type { Test } from "tape";
import tape from "tape";

declare module "tape" {
  interface Test {
    inDelta(actual: unknown, expected: unknown, delta?: number): void;
  }
}

function inDelta(actual: unknown, expected: unknown, delta: number): boolean {
  if (Array.isArray(expected)) {
    return inDeltaArray(actual, expected, delta);
  }
  return inDeltaNumber(actual, expected, delta);
}

function inDeltaArray(
  actual: unknown,
  expected: unknown[],
  delta: number,
): boolean {
  if (!Array.isArray(actual) || actual.length !== expected.length) {
    return false;
  }
  for (let i = 0; i < expected.length; i++) {
    if (!inDelta(actual[i], expected[i], delta)) return false;
  }
  return true;
}

function inDeltaNumber(
  actual: unknown,
  expected: unknown,
  delta: number,
): boolean {
  return (
    typeof actual === "number" &&
    typeof expected === "number" &&
    actual >= expected - delta &&
    actual <= expected + delta
  );
}

type TapeAssert = {
  _assert: (
    ok: boolean,
    opts: {
      message: string;
      operator: string;
      actual: unknown;
      expected: unknown;
    },
  ) => void;
};

export function supertape(): typeof tape {
  (tape.Test.prototype as Test).inDelta = function (
    actual: unknown,
    expected: unknown,
    delta?: number,
  ): void {
    const threshold = delta ?? 1e-6;
    (this as unknown as TapeAssert)._assert(
      inDelta(actual, expected, threshold),
      {
        message: `should be in delta ${threshold}`,
        operator: "inDelta",
        actual,
        expected,
      },
    );
  };

  return tape;
}
