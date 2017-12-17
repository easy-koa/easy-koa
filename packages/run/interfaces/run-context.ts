import { ServerOptions, ServerContext } from "@one-koa/plugin-server/interfaces"

import { LoggerOptions } from "@one-koa/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@one-koa/plugin-monitor/interfaces/index"
import { Component } from "@one-koa/core/index"
import { BaseObject } from "@one-koa/shared"

export interface ModuleContext {
    components: Component[]
    server: ServerContext
    logger: LoggerOptions
    monitor: MonitorOptions,
    config: BaseObject
}
