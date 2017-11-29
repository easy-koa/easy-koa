import Kapp from '../src';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';
import { Logger, MicroServices } from '../src/components';
import { Module } from '../src/shared';
import { LoginInterface } from './services/login';

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
                new LoginInterface()
            ]
        })
    ],
    middlewares: [], // koa middlewares, async function first
    interceptors: [
        new LoginInterceptor()
    ],
    controllers: [
        new TopicController()
    ]
})
class ZoneKapp extends Kapp {}

const zoneKapp = ZoneKapp.create();
    

zoneKapp
    .run(9999)
    .then(function() {
        const logger = zoneKapp
            .application
            .getPlugin(Logger);

        console.log('Server run successfully on port http://0.0.0.0:9999');
    })
    .catch(e => {
        console.log(e);
    });