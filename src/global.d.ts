/// <reference types="vite/client" />

interface ObjectConstructor {
  // entries<T extends object>(o: T): T extends (infer U)[]
  //   ? [number, U][]
  //   : { [K in keyof T]: [K, T[K]] }[keyof T][];
  keys<T extends object>(o: T): (keyof T)[];
  values<T extends object>(o: T): T[keyof T][];
}
