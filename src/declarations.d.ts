declare module "svgpath" {
  interface SvgPath {
    abs(): this;
    rel(): this;
    scale(sx: number, sy?: number): this;
    translate(x: number, y?: number): this;
    rotate(angle: number, rx?: number, ry?: number): this;
    matrix(m: number[]): this;
    transform(str: string): this;
    unshort(): this;
    unarc(): this;
    toString(): string;
    round(precision: number): this;
    iterate(
      iterator: (segment: any[], index: number, x: number, y: number) => void,
    ): this;
    segments: any[][];
  }

  function SvgPath(path: string): SvgPath;
  export = SvgPath;
}

declare module "svg-path-properties" {
  export class svgPathProperties {
    constructor(path: string);
    getTotalLength(): number;
    getPointAtLength(pos: number): { x: number; y: number };
    getTangentAtLength(pos: number): { x: number; y: number };
    getPropertiesAtLength(pos: number): {
      x: number;
      y: number;
      tangentX: number;
      tangentY: number;
    };
    getParts(): any[];
  }
}
