import { Koa, InjectPlugin } from '@kapp/shared';
import { Forward } from '@kapp/forward';

export class ForwardAPIInterceptor {
    @InjectPlugin(Forward)
    forward: Forward;

    async postHandle(ctx: Koa.Context) {
        const { body, header } = await this.forward.forward(ctx);
        ctx.body = body;
        ctx.type = 'application/json';
    }
}

export class ForwardPageInterceptor {
    @InjectPlugin(Forward)
    forward: Forward;

    async postHandle(ctx: Koa.Context) {
        const { body, header } = await this.forward.forward(ctx);
        const data = JSON.parse(body.toString());
        ctx.render(ctx.path.slice(1), data);
    }
}