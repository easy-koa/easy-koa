import { Component } from "@kapp/core/index";
import { InjectPlugin } from "@kapp/shared/decorators/injection";
import { Logger } from "@kapp/logger";
import { MonitorOptions } from "./interfaces/index";
import * as Koa from 'koa'; 
import { BaseObject } from "@kapp/shared/index";
import { setInterval } from "timers";
import { Cron } from "@kapp/cron";
import { MonitorLogger } from "./interfaces/monitor-logger";



export class Monitor extends Component {
    @InjectPlugin(Cron)
    private cron: Cron;

    @InjectPlugin(Logger)
    private logger: Logger;

    private monitor: MonitorLogger;

    private traceMap = new Map()

    name() {
        return 'monitor';
    }

    constructor(...args: any[]) {
        super();
    }

    init() {
        this.monitor = this.logger.create(`kapp-${this.name()}`);
    }

    collect(message: any): void {
        this.monitor.info(this.createCollection(message));
    }

    collectError(message: any): void {
        this.monitor.error(this.createCollection(message));
    }

    createCollection(payload: any) {
        return JSON.stringify(payload);
    }

    static configure(options: MonitorOptions) {
        return {};
    }
}