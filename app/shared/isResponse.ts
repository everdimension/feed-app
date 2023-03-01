export function isResponse<T>(x: T | Response): x is Response {
  return x instanceof Response;
}
