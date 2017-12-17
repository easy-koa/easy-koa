import { ServerOptions, ServerContext } from "@koap/plugin-server/interfaces"

import { LoggerOptions } from "@koap/plugin-logger/interfaces/logger-options"
import { MonitorOptions } from "@koap/plugin-monitor/interfaces/index"
import { Component } from "@koap/core/index"
import { BaseObject } from "@koap/shared"

export interface ModuleContext {
    components: Component[]
    server: ServerContext
    logger: LoggerOptions
    monitor: MonitorOptions,
    config: BaseObject
}
