import { Component } from "@kaola/kapp-core"
import { InjectPlugin, Koa } from "@kaola/kapp-shared"
import { Logger } from "@kaola/kapp-logger"
import { MonitorOptions } from "./interfaces/index"
import { BaseObject } from "@kaola/kapp-shared"
import { setInterval } from "timers"
import { Cron } from "@kaola/kapp-cron"
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
        this.monitor = this.logger.create(`kapp-${this.name()}`)
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