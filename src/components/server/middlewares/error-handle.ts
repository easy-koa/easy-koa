import { Context } from 'koa';
import * as createMonitorParams from '../utils/create-monitor-params';

export function errorHandleMiddleware() {
    return async function(ctx: Context, next: Function) {
        try {
            await next(ctx);
        } catch(e) {
            ctx.monitor.collectError(createMonitorParams.error(ctx.path, {
                error: e,
                status: ctx.status
            }));
        }
    }
}