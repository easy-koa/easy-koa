import Koa = require('koa');

export function errorHandleMiddleware() {
    return async function(ctx: Koa.Context, next: Function) {
        try {
            await next(ctx);
        } catch(e) {
            console.log(ctx.status);
        }
    }
}