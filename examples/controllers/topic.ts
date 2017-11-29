import 'reflect-metadata';

import { Controller, RequestMapping } from '../../src/shared';
import TopicService from '../services/topic';
import { methodTypes } from '../../src/shared/constants';
import { Injection } from '../../src/shared/decorators/injection';


@Controller('/hello')
export default class TopicController {

    // @Injection(TopicService)
    // topicService: TopicService;

    @RequestMapping({
        path: '/world'
    })
    async helloworld(ctx: any) {
        ctx.body = `Your name is ${ctx.kaolaContext.accountId}`;
    }
}