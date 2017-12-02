import { Context } from 'koa';
import { isUndefined } from '../../../shared/index';
import { InterceptorMapping } from '../interfaces/interceptor';


export function interceptorMiddleware(interceptorMapping: InterceptorMapping) {
    const { path, methods, interceptor } = interceptorMapping;
    return async function (ctx: Context, next: Function) {
        const pathReg = <RegExp> path;

        if (!pathReg.test(ctx.path)) {
            return await next(ctx);
        }

        const done = await interceptor.preHandle(ctx);

        if (isUndefined(done) || done === true) {
            await next(ctx);
            await interceptor.postHandle(ctx)
        }
    }
}