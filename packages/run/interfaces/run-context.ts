import { ServerOptions, ServerContext } from "@kaola/kapp-server/interfaces"

import { LoggerOptions } from "@kaola/kapp-logger/interfaces/logger-options"
import { MonitorOptions } from "@kaola/kapp-monitor/interfaces/index"
import { Component } from "@kaola/kapp-core/index"
import { BaseObject } from "@kaola/kapp-shared"

export interface ModuleContext {
    components: Component[]
    server: ServerContext
    logger: LoggerOptions
    monitor: MonitorOptions,
    config: BaseObject
}
