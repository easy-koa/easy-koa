import { isUndefined, Koa, startTime } from '@koap/shared';
import { InterceptorMapping } from '../interfaces/interceptor';
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    const { path: pathReg, methods, interceptor } = interceptorMapping;
    const action = interceptor.constructor.name;

    return async function (ctx: Koa.Context, next: Function) {
        let end = startTime();
        let preHandleTime, postHandleTime;

        for (let reg of <RegExp[]>pathReg) {
            if (reg.test(ctx.path)) {
                let isContinue;

                if (!isUndefined(interceptor. preHandle)) {
                    isContinue = await interceptor.preHandle(ctx);
                }

                let preHandleTime = end();
                
                if (isContinue !== false) {
                    await next(ctx);
                    end = startTime();

                    if (!isUndefined(interceptor.postHandle)) {
                        await interceptor.postHandle(ctx)
                    }
                    
                    postHandleTime = end();
                } 
                
                ctx.collect(createMonitorPlainObject.interceptor(action, { preHandleTime, postHandleTime }));
                return;
            }
        }

        await next(ctx);
    }
}