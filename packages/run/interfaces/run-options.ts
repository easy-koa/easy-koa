import { ServerOptions } from "@kaola/kapp-server/interfaces/server-options";
import { LoggerOptions } from "@kaola/kapp-logger/interfaces/logger-options";
import { MonitorOptions } from "@kaola/kapp-monitor/interfaces/index";
import { Component } from "@kaola/kapp-core/index";

export interface ModuleOptions {
    components?: Component[];
    server?: ServerOptions;
    logger?: LoggerOptions;
    monitor?: MonitorOptions;
}