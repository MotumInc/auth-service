type AnyFunction<R = any> = (...params: any[]) => R
type CallbackFunc<R, E = any> = (err: E, res: R) => void

type Prev<T extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62][T];
type GetLength<original extends any[]> = original extends { length: infer L } ? L : never
type GetLast<original extends any[]> = original[Prev<GetLength<original>>]

type Callbackable<F extends AnyFunction> = Parameters<F> extends [] ? never : GetLast<Parameters<F>> extends CallbackFunc<any> ? F : never

// type PromisifyType<F extends AnyFunction> = (f: )
