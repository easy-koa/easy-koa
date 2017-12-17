import { Component } from "@one-koa/core"
import { InjectPlugin, Koa } from "@one-koa/shared"
import { Logger } from "@one-koa/plugin-logger"
import { MonitorOptions } from "./interfaces/index"
import { BaseObject } from "@one-koa/shared"
import { setInterval } from "timers"
import { Cron } from "@one-koa/plugin-cron"
import { MonitorLogger } from "./interfaces/monitor-logger"


export class Monitor extends Component {
    @InjectPlugin(Cron)
    private cron: Cron

    @InjectPlugin(Logger)
    private logger: Logger

    private monitor: MonitorLogger

    name(): string {
        return 'monitor'
    }

    constructor(...args: any[]) {
        super()
    }

    init(): void {
        this.monitor = this.logger.create(`one-koa-${this.name()}`)
    }

    collect(message: any, ctx?: Koa.Context): void {
        if (message) {
            this.monitor.info(this.createCollection(message, ctx))
        }
    }

    collectError(message: any, ctx?: Koa.Context): void {
        if (message) {
            this.monitor.error(this.createCollection(message, ctx))
        }
    }

    createCollection(payload: any, ctx: Koa.Context): void | string {
        if (payload) {
            return JSON.stringify(payload)
        }
    }

    static configure(options: MonitorOptions): BaseObject {
        return {}
    }
}