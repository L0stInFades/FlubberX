import Earcut from "earcut";
import { interpolatePoints } from "./math.js";
import { toPathString } from "./svg.js";
import type { Ring } from "./types.js";

const earcutFn: (coords: number[]) => number[] =
  (Earcut as unknown as { default?: (coords: number[]) => number[] }).default ??
  (Earcut as unknown as (coords: number[]) => number[]);

interface TriangleBlend {
  i0: number;
  i1: number;
  i2: number;
  p0x: number;
  p0y: number;
  q0x: number;
  q0y: number;
  e1x: number;
  e1y: number;
  e2x: number;
  e2y: number;
  theta: number;
  s00: number;
  s01: number;
  s10: number;
  s11: number;
}

/**
 * Compatible-triangle polar interpolation (Alexa 2000 local maps, Jacobi vertex average).
 * Earcut the source ring and reuse those index triples on the target.
 */
export function interpolateRingsRigid(
  from: Ring,
  to: Ring,
  string?: boolean,
  precision?: number | null,
): (t: number) => string | Ring {
  const len = from.length;
  if (len < 3 || to.length !== len) {
    return interpolatePoints(from, to, string, precision);
  }

  const faces = triangleFaces(from);
  const blends: TriangleBlend[] = [];
  const soft: [number, number, number][] = [];

  for (const face of faces) {
    const blend = prepareTriangle(from, to, face);
    if (blend) blends.push(blend);
    else soft.push(face);
  }

  if (!blends.length) {
    return interpolatePoints(from, to, string, precision);
  }

  return (t: number): string | Ring => {
    if (t === 0) {
      const ring = from.map((p) => [p[0], p[1]] as [number, number]);
      return string ? toPathString(ring, precision) : ring;
    }
    if (t === 1) {
      const ring = to.map((p) => [p[0], p[1]] as [number, number]);
      return string ? toPathString(ring, precision) : ring;
    }

    const sumX = new Float64Array(len);
    const sumY = new Float64Array(len);
    const count = new Uint16Array(len);

    for (const face of soft) {
      accumulateLerp(sumX, sumY, count, from, to, face[0], t);
      accumulateLerp(sumX, sumY, count, from, to, face[1], t);
      accumulateLerp(sumX, sumY, count, from, to, face[2], t);
    }

    for (const tri of blends) {
      const ct = Math.cos(t * tri.theta);
      const st = Math.sin(t * tri.theta);
      const st00 = 1 - t + t * tri.s00;
      const st01 = t * tri.s01;
      const st10 = t * tri.s10;
      const st11 = 1 - t + t * tri.s11;
      const a00 = ct * st00 - st * st10;
      const a01 = ct * st01 - st * st11;
      const a10 = st * st00 + ct * st10;
      const a11 = st * st01 + ct * st11;
      const ox = (1 - t) * tri.p0x + t * tri.q0x;
      const oy = (1 - t) * tri.p0y + t * tri.q0y;

      accumulate(sumX, sumY, count, tri.i0, ox, oy);
      accumulate(
        sumX,
        sumY,
        count,
        tri.i1,
        ox + a00 * tri.e1x + a01 * tri.e1y,
        oy + a10 * tri.e1x + a11 * tri.e1y,
      );
      accumulate(
        sumX,
        sumY,
        count,
        tri.i2,
        ox + a00 * tri.e2x + a01 * tri.e2y,
        oy + a10 * tri.e2x + a11 * tri.e2y,
      );
    }

    const ring: Ring = new Array(len);
    for (let i = 0; i < len; i++) {
      const n = count[i];
      if (!n) {
        ring[i] = [
          from[i][0] + t * (to[i][0] - from[i][0]),
          from[i][1] + t * (to[i][1] - from[i][1]),
        ];
        continue;
      }
      const x = sumX[i] / n;
      const y = sumY[i] / n;
      ring[i] = [
        Number.isFinite(x) ? x : from[i][0] + t * (to[i][0] - from[i][0]),
        Number.isFinite(y) ? y : from[i][1] + t * (to[i][1] - from[i][1]),
      ];
    }

    return string ? toPathString(ring, precision) : ring;
  };
}

function triangleFaces(ring: Ring): [number, number, number][] {
  const coords = new Array(ring.length * 2);
  for (let i = 0; i < ring.length; i++) {
    coords[i * 2] = ring[i][0];
    coords[i * 2 + 1] = ring[i][1];
  }
  const cuts = earcutFn(coords);
  const faces: [number, number, number][] = [];
  for (let i = 0; i + 2 < cuts.length; i += 3) {
    faces.push([cuts[i], cuts[i + 1], cuts[i + 2]]);
  }
  return faces;
}

function prepareTriangle(
  from: Ring,
  to: Ring,
  face: [number, number, number],
): TriangleBlend | null {
  const [i0, i1, i2] = face;
  const p0 = from[i0];
  const p1 = from[i1];
  const p2 = from[i2];
  const q0 = to[i0];
  const q1 = to[i1];
  const q2 = to[i2];
  const e1x = p1[0] - p0[0];
  const e1y = p1[1] - p0[1];
  const e2x = p2[0] - p0[0];
  const e2y = p2[1] - p0[1];
  const det = e1x * e2y - e1y * e2x;
  const e1 = Math.hypot(e1x, e1y);
  const e2 = Math.hypot(e2x, e2y);
  const e3 = Math.hypot(e1x - e2x, e1y - e2y);
  const longest = Math.max(e1, e2, e3);
  if (longest < 1e-12) return null;
  if (Math.abs(det) < longest * longest * 1e-6) return null;

  const f1x = q1[0] - q0[0];
  const f1y = q1[1] - q0[1];
  const f2x = q2[0] - q0[0];
  const f2y = q2[1] - q0[1];
  const fdet = f1x * f2y - f1y * f2x;
  const flongest = Math.max(
    Math.hypot(f1x, f1y),
    Math.hypot(f2x, f2y),
    Math.hypot(f1x - f2x, f1y - f2y),
  );
  if (flongest < 1e-12 || Math.abs(fdet) < flongest * flongest * 1e-6) {
    return null;
  }

  const inv = 1 / det;
  const v00 = e2y * inv;
  const v01 = -e2x * inv;
  const v10 = -e1y * inv;
  const v11 = e1x * inv;

  const a00 = f1x * v00 + f2x * v10;
  const a01 = f1x * v01 + f2x * v11;
  const a10 = f1y * v00 + f2y * v10;
  const a11 = f1y * v01 + f2y * v11;
  if (
    !Number.isFinite(a00 + a01 + a10 + a11) ||
    Math.hypot(a00, a01, a10, a11) > 1e4
  ) {
    return null;
  }

  const rx = a00 + a11;
  const ry = a10 - a01;
  const rn = Math.hypot(rx, ry);
  const cos = rn < 1e-12 ? 1 : rx / rn;
  const sin = rn < 1e-12 ? 0 : ry / rn;
  const theta = Math.atan2(sin, cos);

  const s00 = cos * a00 + sin * a10;
  const s01 = cos * a01 + sin * a11;
  const s10 = -sin * a00 + cos * a10;
  const s11 = -sin * a01 + cos * a11;

  return {
    i0,
    i1,
    i2,
    p0x: p0[0],
    p0y: p0[1],
    q0x: q0[0],
    q0y: q0[1],
    e1x,
    e1y,
    e2x,
    e2y,
    theta,
    s00,
    s01,
    s10,
    s11,
  };
}

function accumulate(
  sumX: Float64Array,
  sumY: Float64Array,
  count: Uint16Array,
  index: number,
  x: number,
  y: number,
): void {
  sumX[index] += x;
  sumY[index] += y;
  count[index] += 1;
}

function accumulateLerp(
  sumX: Float64Array,
  sumY: Float64Array,
  count: Uint16Array,
  from: Ring,
  to: Ring,
  index: number,
  t: number,
): void {
  const p = from[index];
  const q = to[index];
  accumulate(
    sumX,
    sumY,
    count,
    index,
    p[0] + t * (q[0] - p[0]),
    p[1] + t * (q[1] - p[1]),
  );
}
