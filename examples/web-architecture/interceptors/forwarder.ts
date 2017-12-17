import { Koa, InjectPlugin } from '@easy-koa/shared'
import { Forwarder } from '@easy-koa/plugin-forwarder'

export class RawForwardInterceptor {
    @InjectPlugin(Forwarder)
    forwarder: Forwarder

    async postHandle(ctx: Koa.Context): Promise<void> {
        const { body, header } = await this.forwarder.forward(ctx)
        ctx.body = body
        ctx.type = 'text/html'
    }
}

export class APIForwardInterceptor {
    @InjectPlugin(Forwarder)
    forwarder: Forwarder

    async postHandle(ctx: Koa.Context): Promise<void> {
        const { body, header } = await this.forwarder.forward(ctx)
        ctx.body = body
        ctx.type = 'application/json'
    }
}

export class PageForwardInterceptor {
    @InjectPlugin(Forwarder)
    forwarder: Forwarder

    async postHandle(ctx: Koa.Context): Promise<void> {
        const { body, header } = await this.forwarder.forward(ctx)
        const data: any = JSON.parse(body.toString())
        ctx.render(ctx.path.slice(1), data)
    }
}
