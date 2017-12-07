import Kapp from 'kapp';
import { Module } from '@kaola/kapp-shared';
import KappConfig from './kapp-config';

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