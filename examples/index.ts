import Kapp from '../src';
import LoginService from './services/login';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';
import { Logger, MicroServices } from '../src/components';
import { Module } from '../src/shared';

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

const zoneKapp = ZoneKapp.create();
    

zoneKapp
    .run(9999)
    .then(function() {
        const logger = zoneKapp
            .application
            .service('logger');

        console.log('Server run successfully on port 9999');
        logger.info('Server run successfully on port 9999');
    });