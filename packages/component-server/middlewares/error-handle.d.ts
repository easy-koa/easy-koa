import { Context } from 'koa';
export declare function errorHandleMiddleware(): (ctx: Context, next: Function) => Promise<void>;
