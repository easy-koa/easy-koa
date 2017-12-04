import { ServerOptions } from "@kapp/server/interfaces/server-options";
import { LoggerOptions } from "@kapp/logger/interfaces/logger-options";
import { MonitorOptions } from "@kapp/monitor/interfaces/index";
import { Component } from "@kapp/core/index";

export interface ModuleOptions {
    components?: Component[];
    server?: ServerOptions;
    logger?: LoggerOptions;
    monitor?: MonitorOptions;
}