import OneKoa from 'one-koa'
import { Module } from '@one-koa/shared'
import EasyKoaConfig from './one-koa-config'

@Module(EasyKoaConfig)
class ZoneKoap extends OneKoa {}

const zoneKoap: ZoneKoap = ZoneKoap.create()

zoneKoap
    .run()
    .then(function(): any {
        // do something in completed
    })
    .catch((e: any) => {
        // console.log(e)
    })
