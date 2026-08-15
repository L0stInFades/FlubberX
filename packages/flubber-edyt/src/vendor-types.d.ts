declare module "svgpath" {
  const svgpath: (path: string) => {
    abs: () => any;
  };
  export default svgpath;
}

declare module "earcut" {
  function earcut(data: number[], holeIndices?: number[], dim?: number): number[];
  export default earcut;
}
