import Koa = require('koa');
import { InterceptorMapping } from '../../../shared/interfaces/interceptor';
import { isUndefined } from '../../../shared/index';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    return async function (ctx: Koa.Context, next: Function) {
        const { path, methods, interceptor } = interceptorMapping;
        const pathReg = <RegExp> path;

        if (pathReg.test(ctx.path)) {
            return await next(ctx);
        }

        const done = await interceptor.preHandle(ctx);

        if (isUndefined(done) || done === true) {
            await next(ctx);
            await interceptor.postHandle(ctx)
        }
    }
}