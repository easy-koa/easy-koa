import { Controller, Service, Interceptor, Module } from '../../src/common/index';
import TopicService from '../services/topic';
const formatMetadataKey = Symbol("format");

@Controller()
export default class TopicController {
    topicService: TopicService;

    constructor(topicService: TopicService) {}

}