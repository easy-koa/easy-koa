import { Controller, RequestMapping } from '@kapp/server/decorators';
import { Koa } from '@kapp/server';
import TopicService from '../services/topic';
import { methodTypes } from '@kapp/shared/constants';


@Controller('/test')
export default class TopicController {

    @RequestMapping({
        path: '/account'
    })
    async getYourName(ctx: any) {
        ctx.body = `您的账号是：${ctx.kaolaContext.accountId}`;
    }

    @RequestMapping({
        path: '/topic'
    })
    topic(ctx: any) {
        ctx.body = 'topic';
    }
}