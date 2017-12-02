import { Component } from "../../core/index";
import { InjectPlugin } from "../../shared/decorators/injection";
import { Logger } from "../logger";
import { MonitorOptions } from "./interfaces/index";
import * as Koa from 'koa'; 
import { BaseObject } from "../../shared/index";
import { setInterval } from "timers";
import { Cron } from "../cron";


export class Monitor extends Component {
    @InjectPlugin(Cron)
    private cron: Cron;

    @InjectPlugin(Logger)
    private logger: Logger;

    private traceMap = new Map()

    name() {
        return 'monitor';
    }

    constructor(...args: any[]) {
        super();
    }

    collect(message: any): void {
        this.logger.info(this.createCollection(message));
    }

    collectError(message: any): void {
        this.logger.error(this.createCollection(message));
    }

    createCollection(payload: any) {
        return 'kapp monitor - ' + JSON.stringify(payload)
    }

    static configure(options: MonitorOptions) {
        return {};
    }
}