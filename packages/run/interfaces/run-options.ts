import { ServerOptions } from "@one-koa/plugin-server/interfaces/server-options"
import { LoggerOptions } from "@one-koa/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@one-koa/plugin-monitor/interfaces/index"
import { Component } from "@one-koa/core/index"
import { BaseObject } from "@one-koa/shared"

export interface ModuleOptions {
    components?: Component[]
    server?: ServerOptions
    logger?: LoggerOptions
    monitor?: MonitorOptions
    config?: BaseObject
}