import Koap from 'koap'
import { Module } from '@koap/shared'
import KoapConfig from './koap-config'

@Module(KoapConfig)
class ZoneKoap extends Koap {}

const zoneKoap: ZoneKoap = ZoneKoap.create()

zoneKoap
    .run()
    .then(function(): any {
        // do something in completed
    })
    .catch((e: any) => {
        // console.log(e)
    })
