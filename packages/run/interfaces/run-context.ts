import { ServerOptions, ServerContext } from "@kapp/server/interfaces";

import { LoggerOptions } from "@kapp/logger/interfaces/logger-options";
import { MonitorOptions } from "@kapp/monitor/interfaces/index";
import { Component } from "../../core/index";

export interface ModuleContext {
    components: Component[];
    server: ServerContext;
    logger: LoggerOptions;
    monitor: MonitorOptions;
}