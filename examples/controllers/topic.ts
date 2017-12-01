import 'reflect-metadata';

import { Controller, RequestMapping } from '../../src/shared';
import TopicService from '../services/topic';
import { methodTypes } from '../../src/shared/constants';
// import { InjectPlugin } from '../../src/shared/decorators/injection';


@Controller('/hello')
export default class TopicController {

    @RequestMapping({
        path: '/world'
    })
    async helloworld(ctx: any) {
        ctx.body = `Your name is ${ctx.kaolaContext.accountId}`;
    }

    @RequestMapping({
        path: '/topic'
    })
    topic(ctx: any) {
        ctx.body = 'topic';
    }
}