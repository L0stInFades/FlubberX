import * as SvgPathPropertiesModule from "svg-path-properties";
import SvgPath from "svgpath";
import { INVALID_INPUT } from "./errors.js";
import { isFiniteNumber } from "./math.js";
import type { Ring } from "./types.js";

// Robust interop for svgpath
const svgPathFactory: (path: string) => any =
  (SvgPath as unknown as { default?: (p: string) => any }).default ??
  (SvgPath as unknown as (p: string) => any);

// Robust interop for svg-path-properties (resolves Issue #108 / PR #112)
type SvgPathPropertiesFn = (path: string) => {
  getTotalLength(): number;
  getPointAtLength(length: number): { x: number; y: number } | [number, number];
};

const getSvgPathProperties: SvgPathPropertiesFn = (() => {
  const mod = SvgPathPropertiesModule as unknown as {
    svgPathProperties?: SvgPathPropertiesFn;
    default?: SvgPathPropertiesFn | { svgPathProperties?: SvgPathPropertiesFn };
  };

  if (typeof mod.svgPathProperties === "function") {
    return mod.svgPathProperties;
  }
  if (typeof mod.default === "function") {
    return mod.default;
  }
  if (
    mod.default &&
    typeof (mod.default as { svgPathProperties?: SvgPathPropertiesFn })
      .svgPathProperties === "function"
  ) {
    return (mod.default as { svgPathProperties: SvgPathPropertiesFn })
      .svgPathProperties;
  }
  if (typeof SvgPathPropertiesModule === "function") {
    return SvgPathPropertiesModule as unknown as SvgPathPropertiesFn;
  }
  throw new Error("Unable to resolve svg-path-properties module");
})();

function parse(str: string): any {
  return svgPathFactory(str).abs();
}

function split(parsed: any): string[] {
  return parsed
    .toString()
    .split("M")
    .map((d: string, i: number) => {
      d = d.trim();
      return i && d ? `M${d}` : d;
    })
    .filter((d: string) => Boolean(d));
}

/**
 * Formats a coordinate ring into an SVG path string "M...L...Z".
 * Supports configurable precision (Issue #110).
 */
export function toPathString(
  ring: Ring,
  precision?: number | null,
  closed: boolean = true,
): string {
  if (!ring?.length) return "";

  if (
    precision !== undefined &&
    precision !== null &&
    isFiniteNumber(precision)
  ) {
    const p = Math.max(0, Math.min(16, Math.floor(precision)));
    const factor = 10 ** p;
    let out = "M";
    for (let i = 0; i < ring.length; i++) {
      const pt = ring[i];
      const x =
        p === 0 ? Math.round(pt[0]) : Math.round(pt[0] * factor) / factor;
      const y =
        p === 0 ? Math.round(pt[1]) : Math.round(pt[1] * factor) / factor;
      out += `${x},${y}`;
      if (i < ring.length - 1) out += "L";
    }
    if (closed) out += "Z";
    return out;
  }

  // Exact backward-compatible format: "M" + ring.join("L") + "Z"
  return `M${ring.join("L")}${closed ? "Z" : ""}`;
}

/**
 * Splits a composite SVG path string into individual subpaths.
 */
export function splitPathString(str: string): string[] {
  return split(parse(str));
}

/**
 * Converts an SVG path string to an array of coordinate points.
 */
export function pathStringToRing(
  str: string,
  maxSegmentLength?: number | false,
): { ring: Ring; skipBisect?: boolean } {
  const parsed = parse(str);
  const result = exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
  if (!result) {
    throw new TypeError(INVALID_INPUT);
  }
  return result;
}

function exactRing(parsed: any): { ring: Ring } | false {
  const segments = parsed.segments || [];
  const ring: Ring = [];

  if (!segments.length || segments[0][0] !== "M") {
    return false;
  }

  for (let i = 0; i < segments.length; i++) {
    const [command, x, y] = segments[i];
    if ((command === "M" && i) || command === "Z") {
      break;
    } else if (command === "M" || command === "L") {
      ring.push([x, y]);
    } else if (command === "H") {
      ring.push([x, ring[ring.length - 1][1]]);
    } else if (command === "V") {
      ring.push([ring[ring.length - 1][0], x]);
    } else {
      return false;
    }
  }

  return ring.length ? { ring } : false;
}

function approximateRing(
  parsed: any,
  maxSegmentLength?: number | false,
): { ring: Ring; skipBisect: boolean } {
  const ringPath = split(parsed)[0];
  const ring: Ring = [];
  let numPoints = 3;

  if (!ringPath) {
    throw new TypeError(INVALID_INPUT);
  }

  const m = measure(ringPath);
  const len = m.getTotalLength();

  if (
    maxSegmentLength &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0
  ) {
    numPoints = Math.max(numPoints, Math.ceil(len / maxSegmentLength));
    if (numPoints > 100000) {
      numPoints = 100000;
    }
  }

  for (let i = 0; i < numPoints; i++) {
    const p = m.getPointAtLength((len * i) / numPoints);
    if (Array.isArray(p)) {
      ring.push([p[0], p[1]]);
    } else {
      ring.push([p.x, p.y]);
    }
  }

  return {
    ring,
    skipBisect: true,
  };
}

/**
 * Universal isomorphic SVG path measurement.
 * Handles DOM, Node.js, Web Workers, JSDOM, and Chromium edge cases seamlessly.
 */
function measure(d: string): {
  getTotalLength(): number;
  getPointAtLength(length: number): { x: number; y: number } | [number, number];
} {
  // Use native browser measurement if running in browser with functional SVG support
  if (
    typeof window !== "undefined" &&
    window &&
    window.document &&
    typeof window.document.createElementNS === "function"
  ) {
    try {
      const path = window.document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttributeNS(null, "d", d);
      // Defensive check: Ensure getTotalLength exists and does not throw (resolves Issue #101, #109)
      if (typeof (path as any).getTotalLength === "function") {
        const testLen = (path as any).getTotalLength();
        if (isFiniteNumber(testLen)) {
          return path as any;
        }
      }
    } catch {
      // Fall through to svg-path-properties
    }
  }

  // Fall back to svg-path-properties
  return getSvgPathProperties(d);
}
