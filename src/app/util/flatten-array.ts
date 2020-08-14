export function flattenArray(arr: any[][]) {
  let filas = arr.map(f => Array.isArray(f) ? f : [f]);
  return  [].concat.apply([], filas);
}
