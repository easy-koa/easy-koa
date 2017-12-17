import EasyKoa from 'easy-koa'
import { Module } from '@easy-koa/shared'
import EasyKoaConfig from './easy-koa-config'

@Module(EasyKoaConfig)
class ZoneKoap extends EasyKoa {}

const zoneKoap: ZoneKoap = ZoneKoap.create()

zoneKoap
    .run()
    .then(function(): any {
        // do something in completed
    })
    .catch((e: any) => {
        console.log(e)
    })
