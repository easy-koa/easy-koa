import { ServerOptions } from "@easy-koa/plugin-server/interfaces/server-options"
import { LoggerOptions } from "@easy-koa/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@easy-koa/plugin-monitor/interfaces/index"
import { Component } from "@easy-koa/core/index"
import { BaseObject } from "@easy-koa/shared"

export interface ModuleOptions {
    components?: Component[]
    server?: ServerOptions
    logger?: LoggerOptions
    monitor?: MonitorOptions
    config?: BaseObject
}