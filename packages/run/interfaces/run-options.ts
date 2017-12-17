import { ServerOptions } from "@koap/plugin-server/interfaces/server-options"
import { LoggerOptions } from "@koap/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@koap/plugin-monitor/interfaces/index"
import { Component } from "@koap/core/index"
import { BaseObject } from "@koap/shared"

export interface ModuleOptions {
    components?: Component[]
    server?: ServerOptions
    logger?: LoggerOptions
    monitor?: MonitorOptions
    config?: BaseObject
}