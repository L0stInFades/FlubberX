# flubber-edyt

A trimmed, modernized morphing package built specifically for EDYT animation.

## Design Goals

- Keep only the core EDYT needs: path/ring morph interpolation.
- Provide a modern TypeScript + dual ESM/CJS build.
- Preserve compatibility with `flubber` style `interpolate(...)` usage.

## API

### `interpolate(fromShape, toShape, options?)`

Returns a function `(t: number) => string | Ring`.

- `fromShape` / `toShape`: SVG path string or point ring `Array<[x, y]>`
- `options.maxSegmentLength` (default: `0.01`)
- `options.string` (default: `true`)
- `options.optimizeEndpoints` (default: `true`)
- `options.endpointEpsilon` (default: `1e-4`)

### `createShapeMorphInterpolator(fromPath, toPath, options?)`

Animation-focused alias of `interpolate` returning `(t) => string`.

## Example

```ts
import { createShapeMorphInterpolator } from "flubber-edyt";

const morph = createShapeMorphInterpolator(pathA, pathB, {
  maxSegmentLength: 0.005,
});

const d = morph(0.42);
```
