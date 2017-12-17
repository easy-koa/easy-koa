import { ServerOptions, ServerContext } from "@easy-koa/plugin-server/interfaces"

import { LoggerOptions } from "@easy-koa/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@easy-koa/plugin-monitor/interfaces/index"
import { Component } from "@easy-koa/core/index"
import { BaseObject } from "@easy-koa/shared"

export interface ModuleContext {
    components: Component[]
    server: ServerContext
    logger: LoggerOptions
    monitor: MonitorOptions,
    config: BaseObject
}
