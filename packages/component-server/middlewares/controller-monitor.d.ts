import { Context } from 'koa';
export declare function controllerMonitorMiddleware(): (ctx: Context, next: Function) => Promise<void>;
