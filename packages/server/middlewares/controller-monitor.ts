import { Koa, startTime } from '@kapp/shared';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';

export function controllerMonitorMiddleware () {
    return async function (ctx: Koa.Context, next: Function) {
        const end = startTime();
        await next(ctx);

        if (!ctx.controller) {
            return;
        }
        
        ctx.collect(createMonitorPlainObject.controller({
            action: ctx.controller,
            time: end(),
            method: ctx.method,
            status: ctx.status
        }));
    }
}