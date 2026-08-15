import { polygonLength } from "d3-polygon";
import { addPoints } from "./add.js";
import { interpolateRingsRigid } from "./arap.js";
import { distance, isFiniteNumber, polygonCentroid } from "./math.js";
import normalizeRing from "./normalize.js";
import type {
  InterpolateOptions,
  Interpolator,
  Point,
  Ring,
  ShapeInput,
} from "./types.js";

export function fromCircle(
  x: number,
  y: number,
  radius: number,
  toShape: ShapeInput,
  options?: InterpolateOptions,
): Interpolator {
  return fromShape(
    circlePoints(x, y, radius),
    toShape,
    circlePath(x, y, radius),
    2 * Math.PI * radius,
    options,
  );
}

export function toCircle(
  fromShape: ShapeInput,
  x: number,
  y: number,
  radius: number,
  options?: InterpolateOptions,
): Interpolator {
  const interpolator = fromCircle(x, y, radius, fromShape, options);
  return (t: number) => interpolator(1 - t);
}

export function fromRect(
  x: number,
  y: number,
  width: number,
  height: number,
  toShape: ShapeInput,
  options?: InterpolateOptions,
): Interpolator {
  return fromShape(
    rectPoints(x, y, width, height),
    toShape,
    rectPath(x, y, width, height),
    2 * width + 2 * height,
    options,
  );
}

export function toRect(
  fromShape: ShapeInput,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: InterpolateOptions,
): Interpolator {
  const interpolator = fromRect(x, y, width, height, fromShape, options);
  return (t: number) => interpolator(1 - t);
}

function fromShape(
  fromFn: (ring: Ring) => Ring,
  toShape: ShapeInput,
  original: string,
  perimeter: number,
  {
    maxSegmentLength = 10,
    string = true,
    precision = null,
  }: InterpolateOptions = {},
): Interpolator {
  const toRing = normalizeRing(toShape, maxSegmentLength);

  // Enforce maxSegmentLength on circle/rect perimeter too
  if (
    isFiniteNumber(perimeter) &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0 &&
    toRing.length < perimeter / maxSegmentLength
  ) {
    addPoints(toRing, Math.ceil(perimeter / maxSegmentLength - toRing.length));
  }

  const fromRing = fromFn(toRing);
  const interpolator = interpolateRingsRigid(
    fromRing,
    toRing,
    string,
    precision,
  );

  if (string) {
    return (t: number) => (t < 1e-4 ? original : interpolator(t));
  }

  return interpolator;
}

export function circlePoints(
  x: number,
  y: number,
  radius: number,
): (ring: Ring) => Ring {
  return (ring: Ring): Ring => {
    const centroid = polygonCentroid(ring);
    const perimeter = polygonLength([...ring, ring[0]]);
    const startingAngle = Math.atan2(
      ring[0][1] - centroid[1],
      ring[0][0] - centroid[0],
    );
    let along = 0;

    return ring.map((point, i) => {
      if (i) {
        along += distance(point, ring[i - 1]);
      }
      const angle =
        startingAngle +
        2 * Math.PI * (perimeter ? along / perimeter : i / ring.length);
      return [Math.cos(angle) * radius + x, Math.sin(angle) * radius + y];
    });
  };
}

export function rectPoints(
  x: number,
  y: number,
  width: number,
  height: number,
): (ring: Ring) => Ring {
  return (ring: Ring): Ring => {
    const centroid = polygonCentroid(ring);
    const perimeter = polygonLength([...ring, ring[0]]);
    let startingAngle = Math.atan2(
      ring[0][1] - centroid[1],
      ring[0][0] - centroid[0],
    );
    let along = 0;

    if (startingAngle < 0) {
      startingAngle = 2 * Math.PI + startingAngle;
    }

    const startingProgress = startingAngle / (2 * Math.PI);

    return ring.map((point, i) => {
      if (i) {
        along += distance(point, ring[i - 1]);
      }
      const relative = rectPoint(
        (startingProgress + (perimeter ? along / perimeter : i / ring.length)) %
          1,
      );
      return [x + relative[0] * width, y + relative[1] * height];
    });
  };
}

function rectPoint(progress: number): Point {
  if (progress <= 1 / 8) {
    return [1, 0.5 + progress * 4];
  }
  if (progress <= 3 / 8) {
    return [1.5 - 4 * progress, 1];
  }
  if (progress <= 5 / 8) {
    return [0, 2.5 - 4 * progress];
  }
  if (progress <= 7 / 8) {
    return [4 * progress - 2.5, 0];
  }
  return [1, 4 * progress - 3.5];
}

export function circlePath(x: number, y: number, radius: number): string {
  const l = `${x - radius},${y}`;
  const r = `${x + radius},${y}`;
  const pre = `A${radius},${radius},0,1,1,`;

  return `M${l}${pre}${r}${pre}${l}Z`;
}

export function rectPath(
  x: number,
  y: number,
  width: number,
  height: number,
): string {
  const r = x + width;
  const b = y + height;
  return (
    "M" +
    x +
    "," +
    y +
    "L" +
    r +
    "," +
    y +
    "L" +
    r +
    "," +
    b +
    "L" +
    x +
    "," +
    b +
    "Z"
  );
}
