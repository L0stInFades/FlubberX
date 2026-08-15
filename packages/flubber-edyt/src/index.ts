export {
  interpolate,
  interpolateRing,
  interpolatePoints,
  createShapeMorphInterpolator,
  createEdytMorphInterpolator,
} from "./interpolate";

export { toCircle, fromCircle, toRect, fromRect } from "./shape";

export { separate, combine, interpolateAll } from "./multiple";

export { toPathString, splitPathString } from "./svg";

export type {
  InterpolateOptions,
  ShapeMorphOptions,
  SeparateOptions,
  CombineOptions,
  InterpolateAllOptions,
  Interpolator,
  MultiInterpolator,
  Point,
  Ring,
  ShapeInput,
} from "./types";
