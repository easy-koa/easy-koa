export interface InterceptorConstructor {
    new(): this;
    preHandle: Function;
    postHandle: Function;
}

export type mapping = string | RegExp;

export interface InterceptorMapping {
    path: mapping[];
    methods: string[];
    interceptor: InterceptorConstructor
}

export type Interceptor = InterceptorMapping | InterceptorConstructor;
