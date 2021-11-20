/** Send back MIME type by file extension  */
export function mime(ext:string) {
  return {
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".html": "text/html",
    ".css":"text/css",
    ".js": "application/javascript",
    ".json": "application/json",
  }[ext] ?? "text/plain"
}

/** Send back a flattened array without falsy values */
export function toArray<T>(value:T|T[]) {
  return [value].flat(Infinity).filter(value => value)
}

/** Send back area value */
export function calcArea(X: number[], Y: number[]) {
  let area = 0
  for (let i = 0, j = X.length - 1; i < X.length; j = i, i++)
    area += (X[j] + X[i]) * (Y[j] - Y[i])
  return Math.abs(area / 2)
}