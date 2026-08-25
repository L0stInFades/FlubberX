import { defineConfig } from "tsup";

const runtimeDeps = [
  "d3-array",
  "d3-polygon",
  "earcut",
  "svg-path-properties",
  "svgpath",
  "topojson-client",
];

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: false,
    sourcemap: true,
    clean: false,
    outDir: "dist",
    outExtension() {
      return { js: ".mjs" };
    },
    splitting: false,
    treeshake: true,
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: false,
    sourcemap: true,
    clean: false,
    outDir: "dist",
    noExternal: runtimeDeps,
    outExtension() {
      return { js: ".cjs" };
    },
    splitting: false,
    treeshake: true,
  },
  {
    entry: { flubber: "src/index.ts" },
    format: ["iife"],
    globalName: "flubber",
    outDir: "build",
    minify: false,
    sourcemap: true,
    noExternal: runtimeDeps,
    outExtension() {
      return { js: ".js" };
    },
  },
  {
    entry: { "flubber.min": "src/index.ts" },
    format: ["iife"],
    globalName: "flubber",
    outDir: "build",
    minify: true,
    sourcemap: true,
    noExternal: runtimeDeps,
    outExtension() {
      return { js: ".js" };
    },
  },
]);
