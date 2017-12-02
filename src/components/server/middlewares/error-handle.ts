import { Context } from 'koa';

export function errorHandleMiddleware() {
    return async function(ctx: Context, next: Function) {
        try {
            await next(ctx);
        } catch(e) {
            console.log(ctx.status);
            console.log(e);
        }
    }
}