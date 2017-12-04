export interface InterceptorConstructor {
    new(): this;
    preHandle: Function;
    postHandle: Function;
}

export interface InterceptorMapping {
    path: string | RegExp;
    methods: string[];
    interceptor: InterceptorConstructor
}

export type Interceptor = InterceptorMapping | InterceptorConstructor;
