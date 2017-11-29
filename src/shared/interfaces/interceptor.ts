import Koa = require('koa');

export interface Interceptor {
    new(): Interceptor;
    preHandle: (ctx: Koa.Context) => (boolean | void);
    postHandle: (ctx: Koa.Context) => (boolean | void);
}

export interface InterceptorMapping {
    path: string | RegExp;
    methods: string[];
    interceptor: Interceptor
}

export type InterceptorItem = Interceptor | InterceptorMapping;
