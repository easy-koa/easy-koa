import { Controller, RequestMapping } from '@kaola/kapp-server/decorators'
import { Koa } from '@kaola/kapp-shared'
import TopicService from '../services/topic'
import { methodTypes } from '@kaola/kapp-shared/constants'

@Controller('/test')
export default class TopicController {

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
}
