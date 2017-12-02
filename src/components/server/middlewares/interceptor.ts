import { Context } from 'koa';
import { isUndefined } from '../../../shared/index';
import { InterceptorMapping } from '../interfaces/interceptor';
import * as createMonitorParams from '../utils/create-monitor-params';
import * as time from '../utils/time';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    const { path, methods, interceptor } = interceptorMapping;
    const action = interceptor.constructor.name;
    const pathReg = <RegExp> path;
    
    return async function (ctx: Context, next: Function) {
        let pre = time.start(), post;

        if (!pathReg.test(ctx.path)) {
            return await next(ctx);
        }

        const done = await interceptor.preHandle(ctx);
        let preHandleTime = pre(), postHandleTime;

        if (done !== false) {
            await next(ctx);
            let post = time.start();
            await interceptor.postHandle(ctx)
            postHandleTime = post();
        } 
        
        ctx.monitor.collect(createMonitorParams.interceptor(action, { preHandleTime, postHandleTime }));
    }
}