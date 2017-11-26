import Kapp from '../src/core/index';
import { Controller, Service, Interceptor, Module } from '../src/common/index';
import LoginService from './services/login';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';
import MicroServices from '../src/core/microservices';
import Logger from '../src/core/logger';

@Module({
    plugins: [
        new Logger(
            'xxx', {}
        ),
        new MicroServices({
            application: 'haitao-wap',
            version: '3.0.3.3',
            register: '10.165.124.205:2181',
            interfaces: [
                LoginService, TopicService
            ]
        })
    ],
    middlewares: [], // koa middlewares, async function first
    interceptors: [
        {
            mappding: '/*',
            interceptor: LoginInterceptor
        }
    ],
    controllers: [ TopicController ],
    components: [
        LoginService
    ]
})
class ZoneKapp extends Kapp {}

ZoneKapp
    .create()
    .run(9999)
    .then(function() {
        console.log('run success on port 9999');
    });