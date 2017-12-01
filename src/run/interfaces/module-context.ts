import { ServerOptions, ServerContext } from "../../components/server/interfaces";

import { LoggerOptions } from "../../components/logger/interfaces/logger-options";
import { MonitorOptions } from "../../components/monitor/interfaces/index";
import { Component } from "../../core/index";

export interface ModuleContext {
    components: Component[];
    server: ServerContext;
    logger: LoggerOptions;
    monitor: MonitorOptions;
}