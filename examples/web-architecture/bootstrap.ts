import Kapp from '@kaola/kapp'
import { Module } from '@kaola/kapp-shared'
import KappConfig from './kapp-config'

@Module(KappConfig)
class ZoneKapp extends Kapp {}

const zoneKapp: ZoneKapp = ZoneKapp.create()

zoneKapp
    .run()
    .then(function(): any {
        // do something in completed
    })
    .catch((e: any) => {
        console.log(e)
    })
