import { ServerOptions } from "../../components/server/interfaces/server-options";
import { LoggerOptions } from "../../components/logger/interfaces/logger-options";
import { MonitorOptions } from "../../components/monitor/interfaces/index";
import { Component } from "../../core/index";

export interface ModuleOptions {
    components?: Component[];
    server?: ServerOptions;
    logger?: LoggerOptions;
    monitor?: MonitorOptions;
}