import { Context } from 'koa';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';

export function errorHandleMiddleware() {
    return async function(ctx: Context, next: Function) {
        try {
            await next(ctx);
        } catch(e) {
            ctx.monitor.collectError(createMonitorPlainObject.error(ctx.path, {
                error: e,
                status: ctx.status
            }));
        }
    }
}