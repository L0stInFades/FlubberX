import { collapseTopology, createTopology } from "../src/topology.ts";
import { cut } from "../src/triangulate.ts";
import type { Ring } from "../src/types.ts";
import * as shapes from "./shapes.ts";
import { supertape } from "./utils.ts";

const tape = supertape();

function undirectedEdges(tri: number[][]): string {
  return tri
    .map((edge) => [...edge].sort((a, b) => a - b).join("-"))
    .sort()
    .join("|");
}

function ringSignature(ring: Ring): string {
  const pts = ring.map((p) => p.join(","));
  const rotations = pts.map((_, i) =>
    pts.slice(i).concat(pts.slice(0, i)).join(";"),
  );
  const reversed = [...pts].reverse();
  const reverseRotations = reversed.map((_, i) =>
    reversed.slice(i).concat(reversed.slice(0, i)).join(";"),
  );
  return [...rotations, ...reverseRotations].sort()[0] ?? "";
}

tape("Triangulate a square", (test) => {
  const square = shapes.square1();
  const triangles = cut(square);

  test.equal(triangles.length, 2);
  for (const tri of triangles) {
    test.equal(tri.length, 3);
    for (const edge of tri) {
      test.equal(edge.length, 2);
      test.ok(edge[0] >= 0 && edge[0] < square.length);
      test.ok(edge[1] >= 0 && edge[1] < square.length);
    }
  }

  const edgeSets = triangles.map(undirectedEdges);
  test.equal(new Set(edgeSets).size, 2);

  const allEdges = new Set(
    triangles.flatMap((tri) =>
      tri.map((edge) => [...edge].sort((a, b) => a - b).join("-")),
    ),
  );
  test.equal(allEdges.size, 5);
  const usedVertices = new Set(triangles.flatMap((tri) => tri.flat()));
  test.deepEqual(
    [...usedVertices].sort((a, b) => a - b),
    [0, 1, 2, 3],
  );
  test.end();
});

tape("Create/collapse a triangulation", (test) => {
  const square = shapes.square1();
  const cuts = cut(square);
  const topology = createTopology(cuts, square);

  test.equal(topology.type, "Topology");
  test.equal(topology.objects.triangles.type, "GeometryCollection");
  test.equal(topology.objects.triangles.geometries.length, 2);
  test.ok(topology.arcs.length >= 3);
  for (const geometry of topology.objects.triangles.geometries) {
    test.equal(geometry.type, "Polygon");
    test.equal(geometry.area, 5000);
  }

  let collapsed = collapseTopology(topology, 2);
  test.equal(collapsed.length, 2);
  const twoPieces: Ring[] = [
    [
      [100, 100],
      [0, 100],
      [0, 0],
    ],
    [
      [0, 0],
      [100, 0],
      [100, 100],
    ],
  ];
  test.deepEqual(
    collapsed.map((ring) => ringSignature(ring)).sort(),
    twoPieces.map((ring) => ringSignature(ring)).sort(),
  );
  test.equal(topology.objects.triangles.geometries.length, 2);

  collapsed = collapseTopology(topology, 1);
  test.equal(collapsed.length, 1);
  test.equal(collapsed[0]?.length, 4);
  const merged: Ring = collapsed[0] ?? [];
  test.deepEqual(
    ringSignature(merged),
    ringSignature([
      [100, 100],
      [0, 100],
      [0, 0],
      [100, 0],
    ]),
  );
  test.equal(topology.objects.triangles.geometries.length, 1);

  test.throws(() => collapseTopology(topology, 2));

  test.end();
});
