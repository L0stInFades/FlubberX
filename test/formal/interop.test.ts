import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

// Type verification imports
import type {
  AlignOptions,
  CombineOptions,
  InterpolateAllOptions,
  InterpolateOptions,
  Point,
  Ring,
  SeparateOptions,
  ShapeInput,
} from "../../src/types.ts";

const require = createRequire(import.meta.url);

const cjsPath = resolve(process.cwd(), "dist/index.cjs");
const esmPath = resolve(process.cwd(), "dist/index.mjs");
const browserBundlePath = resolve(process.cwd(), "build/flubber.min.js");
const hasDist = existsSync(cjsPath) && existsSync(esmPath);
const hasBrowserBundle = existsSync(browserBundlePath);

const square = "M0,0L100,0L100,100L0,100Z";
const triangle = "M50,0L100,100L0,100Z";

const expectedExportKeys = [
  "interpolate",
  "interpolateRing",
  "separate",
  "combine",
  "interpolateAll",
  "splitPathString",
  "toPathString",
  "pathStringToRing",
  "fromCircle",
  "toCircle",
  "fromRect",
  "toRect",
  "circlePoints",
  "rectPoints",
  "circlePath",
  "rectPath",
  "align",
  "normalizeRing",
  "triangulate",
  "cut",
  "rotate",
  "pieceOrder",
  "bestOrder",
  "addPoints",
  "bisect",
  "distance",
  "pointAlong",
  "samePoint",
  "isFiniteNumber",
  "polygonCentroid",
  "interpolatePoints",
  "interpolatePoint",
  "INVALID_INPUT",
  "INVALID_INPUT_ALL",
  "INVALID_PATH_STRING",
];

describe("Formal Verification: Module Loading & Interoperability", () => {
  describe.skipIf(!hasDist)("1. CommonJS require: dist/index.cjs", () => {
    it("Loads dist/index.cjs without errors in Node.js", () => {
      const cjsModule = require(cjsPath);
      expect(cjsModule).toBeDefined();
      expect(typeof cjsModule).toBe("object");
    });

    it("Exposes default export as interpolate function and supports direct invocation", () => {
      const cjsModule = require(cjsPath);
      const interpolate = cjsModule.default ?? cjsModule;
      expect(typeof interpolate).toBe("function");

      const morph = interpolate(square, triangle);
      expect(typeof morph).toBe("function");
      expect(typeof morph(0.5)).toBe("string");
      expect(morph(0.5)).toMatch(/^M/);
    });

    it("Exposes all 35 required named exports with correct types", () => {
      const cjsModule = require(cjsPath);
      for (const key of expectedExportKeys) {
        expect(
          cjsModule[key],
          `Missing export "${key}" in dist/index.cjs`,
        ).toBeDefined();
      }

      // Check key functions
      expect(typeof cjsModule.interpolate).toBe("function");
      expect(typeof cjsModule.fromCircle).toBe("function");
      expect(typeof cjsModule.toCircle).toBe("function");
      expect(typeof cjsModule.fromRect).toBe("function");
      expect(typeof cjsModule.toRect).toBe("function");
      expect(typeof cjsModule.separate).toBe("function");
      expect(typeof cjsModule.combine).toBe("function");
      expect(typeof cjsModule.interpolateAll).toBe("function");
      expect(typeof cjsModule.align).toBe("function");
      expect(typeof cjsModule.distance).toBe("function");

      // Check constants
      expect(typeof cjsModule.INVALID_INPUT).toBe("string");
      expect(typeof cjsModule.INVALID_INPUT_ALL).toBe("string");
      expect(typeof cjsModule.INVALID_PATH_STRING).toBe("string");
    });

    it("Executes geometry and shape morphing helpers in CommonJS context", () => {
      const { fromCircle, align, separate, combine } = require(cjsPath);

      const circleMorph = fromCircle(50, 50, 40, square);
      expect(typeof circleMorph(0.5)).toBe("string");

      const [alignedA, alignedB] = align(square, triangle);
      expect(typeof alignedA).toBe("string");
      expect(typeof alignedB).toBe("string");

      const sq1 = "M0,0L50,0L50,50L0,50Z";
      const sq2 = "M100,100L150,100L150,150L100,150Z";
      const sep = separate(square, [sq1, sq2], { single: true });
      expect(typeof sep(0.5)).toBe("string");

      const com = combine([sq1, sq2], square, { single: true });
      expect(typeof com(0.5)).toBe("string");
    });
  });

  describe.skipIf(!hasDist)("2. ESM import: dist/index.mjs", () => {
    it("Loads dist/index.mjs dynamically without errors in Node.js", async () => {
      const esmModule = await import(esmPath);
      expect(esmModule).toBeDefined();
      expect(typeof esmModule.default).toBe("function");
    });

    it("Matches expected named export signatures and values", async () => {
      const esmModule = await import(esmPath);
      for (const key of expectedExportKeys) {
        expect(
          esmModule[key],
          `Missing export "${key}" in dist/index.mjs`,
        ).toBeDefined();
      }

      const morph = esmModule.interpolate(square, triangle);
      expect(typeof morph(0.5)).toBe("string");

      const morphDef = esmModule.default(square, triangle);
      expect(morphDef(0.5)).toBe(morph(0.5));
    });
  });

  describe.skipIf(!hasBrowserBundle)("3. Browser bundle: build/flubber.min.js in simulated environments", () => {
    it("Loads and executes IIFE bundle in a simulated headless window sandbox", () => {
      const bundleCode = readFileSync(browserBundlePath, "utf-8");
      const sandbox: Record<string, any> = {
        console,
        Math,
        parseFloat,
        parseInt,
        isFinite,
      };

      const context = vm.createContext(sandbox);
      vm.runInContext(bundleCode, context);

      expect(context.flubber).toBeDefined();
      const flubber = context.flubber;

      const interpolate = flubber.default || flubber.interpolate;
      expect(typeof interpolate).toBe("function");

      const morph = interpolate(square, triangle);
      expect(typeof morph(0.5)).toBe("string");

      for (const key of expectedExportKeys) {
        expect(
          flubber[key],
          `Missing export "${key}" in browser bundle`,
        ).toBeDefined();
      }
    });

    it("Executes correctly with simulated DOM createElementNS SVG path implementation", () => {
      const bundleCode = readFileSync(browserBundlePath, "utf-8");

      const mockSvgPath = {
        setAttributeNS: () => {},
        getTotalLength: () => 400,
        getPointAtLength: (len: number) => ({ x: len / 4, y: len / 4 }),
      };

      const sandbox: Record<string, any> = {
        console,
        Math,
        parseFloat,
        parseInt,
        isFinite,
        window: {
          document: {
            createElementNS: () => mockSvgPath,
          },
        },
      };

      const context = vm.createContext(sandbox);
      vm.runInContext(bundleCode, context);

      const flubber = context.flubber;
      const morph = flubber.interpolate(square, triangle);
      const res = morph(0.5);
      expect(typeof res).toBe("string");
    });

    it("Produces mathematically consistent output between ESM, CJS, and Browser bundles", async () => {
      const cjsModule = require(cjsPath);
      const esmModule = await import(esmPath);

      const bundleCode = readFileSync(browserBundlePath, "utf-8");
      const sandbox: Record<string, any> = {
        console,
        Math,
        parseFloat,
        parseInt,
        isFinite,
      };
      const context = vm.createContext(sandbox);
      vm.runInContext(bundleCode, context);
      const browserFlubber = context.flubber;

      const t = 0.42;
      const cjsOut = cjsModule.interpolate(square, triangle, { precision: 4 })(
        t,
      );
      const esmOut = esmModule.interpolate(square, triangle, { precision: 4 })(
        t,
      );
      const browserOut = browserFlubber.interpolate(square, triangle, {
        precision: 4,
      })(t);

      expect(cjsOut).toBe(esmOut);
      expect(browserOut).toBe(esmOut);
    });
  });

  describe("4. TypeScript declarations & Type resolution", () => {
    it("Resolves all TypeScript type interfaces correctly", () => {
      const point: Point = [10, 20];
      const ring: Ring = [point, [30, 40], [50, 60]];
      const input: ShapeInput = square;

      const opts: InterpolateOptions = {
        maxSegmentLength: 10,
        string: true,
        optimizeEndpoints: true,
        endpointEpsilon: 1e-4,
        clamp: false,
        precision: 2,
        closed: true,
      };

      const sepOpts: SeparateOptions = { ...opts, single: true };
      const comOpts: CombineOptions = { ...opts, single: false };
      const allOpts: InterpolateAllOptions = { ...opts, single: true };
      const alignOpts: AlignOptions = {
        maxSegmentLength: 15,
        string: true,
        precision: 3,
        closed: true,
      };

      expect(point.length).toBe(2);
      expect(ring.length).toBe(3);
      expect(typeof input).toBe("string");
      expect(opts.precision).toBe(2);
      expect(sepOpts.single).toBe(true);
      expect(comOpts.single).toBe(false);
      expect(allOpts.single).toBe(true);
      expect(alignOpts.maxSegmentLength).toBe(15);
    });
  });
});
