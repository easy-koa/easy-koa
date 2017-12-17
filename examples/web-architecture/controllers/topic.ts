import { Controller, RequestMapping } from '@easy-koa/plugin-server/decorators'
import { Koa } from '@easy-koa/shared'
import TopicService from '../services/topic'
import { methodTypes } from '@easy-koa/shared/constants'
import { InjectPlugin } from '@easy-koa/plugin-server/decorators/injection'
import { Config } from '@easy-koa/plugin-config/index'

@Controller('/test')
export default class TopicController {

    @InjectPlugin(Config)
    private config: Config

    @RequestMapping({
        path: '/account',
    })
    async getYourName(ctx: any): Promise<void> {
        ctx.body = `您的账号是：${ctx.kaolaContext.accountId}`
    }

    @RequestMapping({
        path: '/topic',
    })
    topic(ctx: any): void {
        ctx.body = 'topic'
    }

    @RequestMapping({
        path: '/config',
    })
    getConfig(ctx: any): void {
        ctx.body = JSON.stringify(this.config.get('x'))
    }
}
