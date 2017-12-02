import { Context } from 'koa';
import { isUndefined } from '../../../shared/index';
import { InterceptorMapping } from '../interfaces/interceptor';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';
import * as time from '../utils/time';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    const { path, methods, interceptor } = interceptorMapping;
    const action = interceptor.constructor.name;
    const pathReg = <RegExp> path;
    
    return async function (ctx: Context, next: Function) {
        let end = time.start(), post;

        if (!pathReg.test(ctx.path)) {
            return await next(ctx);
        }

        const done = await interceptor.preHandle(ctx);
        let preHandleTime = end(), postHandleTime;

        if (done !== false) {
            await next(ctx);
            end = time.start();
            await interceptor.postHandle(ctx)
            postHandleTime = end();
        } 
        
        ctx.monitor.collect(createMonitorPlainObject.interceptor(action, { preHandleTime, postHandleTime }));
    }
}