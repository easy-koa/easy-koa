import { isUndefined, Koa } from '@kapp/shared';
import { InterceptorMapping } from '../interfaces/interceptor';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';
import * as time from '../utils/time';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    const { path: pathReg, methods, interceptor } = interceptorMapping;
    const action = interceptor.constructor.name;

    return async function (ctx: Koa.Context, next: Function) {
        let end = time.start();

        for (let reg of <RegExp[]>pathReg) {
            if (reg.test(ctx.path)) {
                let isContinue;

                if (!isUndefined(interceptor. preHandle)) {
                    isContinue = await interceptor.preHandle(ctx);
                }

                let preHandleTime = end(), postHandleTime;
                
                if (isContinue !== false) {
                    await next(ctx);
                    end = time.start();

                    if (!isUndefined(interceptor.postHandle)) {
                        await interceptor.postHandle(ctx)
                    }
                    
                    postHandleTime = end();
                } 
                
                ctx.monitor.collect(createMonitorPlainObject.interceptor(action, { preHandleTime, postHandleTime }));
                return;
            }
        }

        await next(ctx);
    }
}