import { defineConfig } from "tsup";

export default defineConfig([
  // Primary SDK Build: ESM and CommonJS
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".mjs" : ".cjs",
      };
    },
    splitting: false,
    treeshake: true,
  },
  // Standalone IIFE / UMD browser bundle for legacy backwards compatibility (build/flubber.min.js & build/flubber.js)
  {
    entry: { flubber: "src/index.ts" },
    format: ["iife"],
    globalName: "flubber",
    outDir: "build",
    minify: false,
    sourcemap: true,
    noExternal: [
      "d3-array",
      "d3-polygon",
      "earcut",
      "svg-path-properties",
      "svgpath",
      "topojson-client",
    ],
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
    noExternal: [
      "d3-array",
      "d3-polygon",
      "earcut",
      "svg-path-properties",
      "svgpath",
      "topojson-client",
    ],
    outExtension() {
      return { js: ".js" };
    },
  },
]);
