export type Point = [number, number];
export type Ring = Point[];
export type ShapeInput = string | Ring;

export interface InterpolateOptions {
  maxSegmentLength?: number;
  string?: boolean;
  optimizeEndpoints?: boolean;
  endpointEpsilon?: number;
}

export interface ShapeMorphOptions {
  maxSegmentLength?: number;
  optimizeEndpoints?: boolean;
  endpointEpsilon?: number;
}
