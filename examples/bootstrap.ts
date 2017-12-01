import Kapp from '../src';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';
import { Module } from '../src/shared';
import { LoginService } from './services/login';
import KappConfig from './kapp-config';
import { Logger } from '../src/components/index';

@Module(KappConfig)
class ZoneKapp extends Kapp {}

const zoneKapp = ZoneKapp.create();
    
zoneKapp
    .run(9999)
    .then(function() {
        
        const logger = zoneKapp
            .application
            .registry
            .components
            .getInstance(Logger);
            
        logger.info('Server run successfully on port http://0.0.0.0:9999');
    })
    .catch(e => {
        console.log(e);
    });