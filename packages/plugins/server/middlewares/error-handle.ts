import { Koa } from '@one-koa/shared';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';

export function errorHandleMiddleware() {
    return async function(ctx: Koa.Context, next: Function) {
        try {
            await next(ctx);
        } catch(e) {
            ctx.collectError(createMonitorPlainObject.error({
                action: ctx.path,
                error: e,
                status: ctx.status
            }));
            
            ctx.body = 500 + e.message;
        }

        const status = ctx.status;
        if (/4.*$/.test(String(ctx.status))) {
            ctx.body = 'not found';
        }
        ctx.status = status;
    }
}