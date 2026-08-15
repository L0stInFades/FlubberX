# flubber-edyt

`flubber-edyt` is a modernized morphing package built for EDYT's animation pipeline.

It keeps the original Flubber public morph surface (`interpolate`, `toCircle`, `fromCircle`, `toRect`, `fromRect`, `separate`, `combine`, `interpolateAll`, `toPathString`, `splitPathString`) and adds EDYT-focused helpers for clip-path timeline rendering.

## Why this package exists

EDYT needs high-quality, high-frequency interpolation between shape paths (for timeline and export rendering). This fork is optimized for:

- path-to-path morph interpolation
- the original multi-shape and circle/rect morph APIs
- stable endpoint behavior for timeline scrubbing
- low-GC hot-path execution
- modern TypeScript + ESM/CJS packaging

## Installation

```bash
npm install flubber-edyt
```

## API

Shapes are an SVG path string or a ring (`Array<[x, y]>`). Mixed types are allowed.

### `interpolate(fromShape, toShape, options?)`

Returns `(t) => string` by default, or a ring when `string: false`. A multi-subpath `d` interpolates only its first outer ring.

Options match original Flubber:

- `maxSegmentLength` default: `10`. `false` or `Infinity` disables extra subdivision.
- `string` default: `true`
- `optimizeEndpoints` default: `true` (each path-string end is returned exactly at `t ≈ 0` / `t ≈ 1`)
- `endpointEpsilon` default: `1e-4`
- `clamp` default: `false`
- `precision` default: `null` (no rounding)

### `toCircle(fromShape, x, y, r, options?)` / `fromCircle(x, y, r, toShape, options?)`

Morph to or from a circle centered at `(x, y)` with radius `r`. At the circle end, string output is a circle path at that center and radius.

### `toRect(fromShape, x, y, width, height, options?)` / `fromRect(x, y, width, height, toShape, options?)`

Morph to or from a rectangle whose upper-left corner is `(x, y)`.

### `separate(fromShape, toShapeList, options?)` / `combine(fromShapeList, toShape, options?)`

Break one shape into many (or the reverse). Returns an array of interpolators, or one interpolator when `single: true` (space-joined path string when `string: true`). `combine` is the time-reversal of the matching `separate`.

### `interpolateAll(fromShapeList, toShapeList, options?)`

Pairwise morph. Lists must be the same non-zero length. Same `single` / `string` options as `separate`.

### `toPathString(ring)`

Closed `M…L…Z` path from a ring.

### `splitPathString(pathString)`

Split a multi-subpath `d` into one-shape path strings.

### `createShapeMorphInterpolator(fromPath, toPath, options?)`

Path-only helper for EDYT. Returns `(t: number) => string`.

Defaults (override via `options`): `maxSegmentLength: 0.005`, `clamp: true`, `precision: 6`.

### `createEdytMorphInterpolator(...)`

Alias of `createShapeMorphInterpolator` for EDYT runtime naming.

## EDYT Integration Example

```ts
import { createEdytMorphInterpolator } from "flubber-edyt";

const interpolatePath = createEdytMorphInterpolator(startPath, endPath);
const pathD = interpolatePath(progress);
```

## Notes

- This package targets Node `>=18`.
- Original-named APIs (`interpolate`, `toCircle`, `separate`, …) use original Flubber defaults.
- EDYT-named helpers keep product-tuned `maxSegmentLength` / `clamp` / `precision`.
