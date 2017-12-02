import { Context } from 'koa';
import * as time from '../utils/time';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';

export function controllerMonitorMiddleware () {
    return async function (ctx: Context, next: Function) {
        const controllerTime = time.start();
        await next(ctx);

        if (!ctx.controller) {
            return;
        }
        
        ctx.monitor.collect(createMonitorPlainObject.controller(ctx.controller, {
            time: controllerTime(),
            method: ctx.method
        }));
    }
}