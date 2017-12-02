import { Context } from 'koa';
import * as time from '../utils/time';
import * as createMonitorParams from '../utils/create-monitor-params';

export function controllerMonitorMiddleware (controllerMap: Map <string, string>) {
    return async function (ctx: Context, next: Function) {
        const controllerTime = time.start();
        await next(ctx);
        ctx.monitor.collect(createMonitorParams.controller(controllerMap.get(ctx.path), {
            time: controllerTime(),
            method: ctx.method
        }));
    }
}