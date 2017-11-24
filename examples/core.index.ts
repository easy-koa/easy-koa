import AppModule from '../src/core/index';
import { Controller, Service, Interceptor, Module } from '../src/common/index';
import LoginService from './services/login';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';


@Module({
    microServices: {
        application: 'haitao-wap',
        version: '3.0.3.3',
        register: '10.165.124.205:2181',
        interfaces: [
            LoginService, TopicService
        ]
    },
    middleways: [], // koa middleways, async function first
    interceptors: [ LoginInterceptor ],
    controllers: [ TopicController ],
    components: []
})
class ApplicationModule extends AppModule {}


ApplicationModule
    .create()
    .run(9999)
    .then(function() {
        console.log('run success on port 9999');
    });