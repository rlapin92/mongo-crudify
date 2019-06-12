

export type Middlewares<T> = { [actionName: string]: ((arg: T) => T)[]; };
