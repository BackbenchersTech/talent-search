// Clean nulls → undefined
// For each property, if the property type includes `null`, replace `null` with `undefined` in the result type.
type NormalizeResult<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
};

export const normalize = <T extends object>(obj: T): NormalizeResult<T> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value]),
  ) as unknown as NormalizeResult<T>;
