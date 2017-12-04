import Kapp from 'kapp';
import TopicService from './services/topic';
import LoginInterceptor from './interceptors/login';
import TopicController from './controllers/topic';
import { Module } from '@kapp/shared';
import { LoginService } from './services/login';
import KappConfig from './kapp-config';
import { Logger } from '@kapp/logger';

@Module(KappConfig)
class ZoneKapp extends Kapp {}

const zoneKapp = ZoneKapp.create();
    
zoneKapp
    .run()
    .then(function() {
        // do something in completed
    })
    .catch(e => {
        console.log(e);
    });