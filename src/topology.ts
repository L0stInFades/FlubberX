import { bisector } from "d3-array";
import { polygonArea } from "d3-polygon";
import { feature, mergeArcs, neighbors } from "topojson-client";
import type { Point, Ring } from "./types.js";

export type Segment = [number, number];
export type TriangleSegments = [Segment, Segment, Segment];

export interface TopologyGeometry {
  type: string;
  area: number;
  arcs: number[][];
}

export interface FlubberTopology {
  type: "Topology";
  objects: {
    triangles: {
      type: "GeometryCollection";
      geometries: TopologyGeometry[];
    };
  };
  arcs: Point[][];
}

export function createTopology(
  triangles: TriangleSegments[],
  ring: Ring,
): FlubberTopology {
  const arcIndices: Record<string, number> = {};
  const topology: FlubberTopology = {
    type: "Topology",
    objects: {
      triangles: {
        type: "GeometryCollection",
        geometries: [],
      },
    },
    arcs: [],
  };

  triangles.forEach((triangle) => {
    const geometry: number[] = [];

    triangle.forEach((arc) => {
      const slug = arc[0] < arc[1] ? arc.join(",") : `${arc[1]},${arc[0]}`;
      const coordinates = arc.map((pointIndex) => ring[pointIndex]);

      if (slug in arcIndices) {
        geometry.push(~arcIndices[slug]);
      } else {
        const arcIndex = topology.arcs.length;
        arcIndices[slug] = arcIndex;
        geometry.push(arcIndex);
        topology.arcs.push(coordinates);
      }
    });

    topology.objects.triangles.geometries.push({
      type: "Polygon",
      area: Math.abs(polygonArea(triangle.map((d) => ring[d[0]]))),
      arcs: [geometry],
    });
  });

  // Sort smallest first
  topology.objects.triangles.geometries.sort((a, b) => a.area - b.area);

  return topology;
}

export function collapseTopology(
  topology: FlubberTopology,
  numPieces: number,
): Ring[] {
  const geometries = topology.objects.triangles.geometries;
  const bisect = bisector((d: TopologyGeometry) => d.area).left;

  while (geometries.length > numPieces && geometries.length > 1) {
    mergeSmallestFeature();
  }

  if (numPieces > geometries.length) {
    throw new RangeError(`Can't collapse topology into ${numPieces} pieces.`);
  }

  const features = (
    feature(topology as any, topology.objects.triangles as any) as any
  ).features;

  return features.map((f: any) => {
    f.geometry.coordinates[0].pop();
    return f.geometry.coordinates[0] as Ring;
  });

  function mergeSmallestFeature(): void {
    const smallest = geometries[0];
    const neighborList = neighbors(geometries as any);
    const neighborIndex = neighborList[0]?.[0] ?? 1;
    const neighbor = geometries[neighborIndex];
    const merged: any = mergeArcs(topology as any, [smallest, neighbor] as any);

    // MultiPolygon -> Polygon
    merged.area = smallest.area + (neighbor ? neighbor.area : 0);
    merged.type = "Polygon";
    merged.arcs = merged.arcs[0];

    // Delete smallest and its chosen neighbor
    if (neighborIndex > 0) {
      geometries.splice(neighborIndex, 1);
      geometries.shift();
    } else {
      geometries.shift();
    }

    // Add new merged shape in sorted order
    geometries.splice(bisect(geometries, merged.area), 0, merged);
  }
}
