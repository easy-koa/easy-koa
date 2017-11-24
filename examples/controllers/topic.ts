import { Controller, Service, Interceptor, Module } from '../../src/common/index';
import TopicService from '../services/topic';
@Controller()
export default class TopicController {
    constructor(topicService: TopicService) {
    }
}