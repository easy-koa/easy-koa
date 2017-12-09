import { Controller, RequestMapping } from '@kaola/kapp-server/decorators'
import { Koa } from '@kaola/kapp-shared'
import TopicService from '../services/topic'
import { methodTypes } from '@kaola/kapp-shared/constants'
import { InjectPlugin } from '@kaola/kapp-server/decorators/injection'
import { Config } from '@kaola/kapp-config/index'

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
