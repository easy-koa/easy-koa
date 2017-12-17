import { Component } from "@easy-koa/core"
import { InjectPlugin, Koa } from "@easy-koa/shared"
import { Logger } from "@easy-koa/plugin-logger"
import { MonitorOptions } from "./interfaces/index"
import { BaseObject } from "@easy-koa/shared"
import { setInterval } from "timers"
import { Cron } from "@easy-koa/plugin-cron"
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
        this.monitor = this.logger.create(`easy-koa-${this.name()}`)
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