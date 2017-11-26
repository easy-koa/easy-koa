import { Controller } from '../../src/shared';
import TopicService from '../services/topic';
const formatMetadataKey = Symbol("format");


@Controller()
// @Controller()
export default class TopicController {
    topicService: TopicService;

    constructor(topicService: TopicService) {}

}