import { Controller, RequestMapping } from '@kapp/server/decorators';
import TopicService from '../services/topic';
import { methodTypes } from '@kapp/shared/constants';


@Controller('/test')
export default class TopicController {

    @RequestMapping({
        path: '/account'
    })
    async getYourName(ctx: any) {
        ctx.body = `Your name is ${ctx.kaolaContext.accountId}`;
        throw new Error('1')
    }

    @RequestMapping({
        path: '/topic'
    })
    topic(ctx: any) {
        ctx.body = 'topic';
    }
}