import { ServerOptions, ServerContext } from "@kaola/kapp-server/interfaces";

import { LoggerOptions } from "@kaola/kapp-logger/interfaces/logger-options";
import { MonitorOptions } from "@kaola/kapp-monitor/interfaces/index";
import { Component } from "@kaola/core/index";

export interface ModuleContext {
    components: Component[];
    server: ServerContext;
    logger: LoggerOptions;
    monitor: MonitorOptions;
}