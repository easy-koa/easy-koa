import { ServerRequest, ServerResponse, Agent, IncomingMessage, OutgoingHttpHeaders } from 'http'
import { Component } from '@kaola/kapp-core'
import { Koa, startTime } from '@kaola/kapp-shared'
import { InjectPlugin } from '@kaola/kapp-shared'
import { Monitor } from '@kaola/kapp-monitor'
import { ProxyServer } from './proxy-server'
import { ProxyServerConfig } from './interfaces'
import * as createMonitorPlainObject from './utils/create-monitor-plain-object'

declare module 'http' {
    interface ServerResponse {
        _headers: any[]
    }
}

export class Forwarder extends Component {
    private proxyServer: ProxyServer

    @InjectPlugin(Monitor)
    private monitor: Monitor

    name(): string {
        return 'forward'
    }

    constructor(options: ProxyServerConfig) {
        super()
        this.$options = options
    }

    async init(): Promise<void> {
        const { host, specialHeader, secure = false, agent = false, proxyTimeout = 3000 } = this.$options
        this.proxyServer = ProxyServer.create({
            host,
            specialHeader,
            secure,
            agent,
            proxyTimeout,
        })

        this.proxyServer.on('error', (error: Error) => {
            this.monitor.collectError({
                type: 'error',
                payload: {
                    stack: error && error.stack,
                    message: error && error.message,
                },
            })
        })
    }

    async forward(ctx: Koa.Context): Promise<{ body: any, header: any}> {
        const end: Function = startTime()
        const { target } = this.$options

        const responseBody: any[] = []

        const req: IncomingMessage = ctx.req
        const res: ServerResponse = new ServerResponse(req)

        res.write = function (chunk: Buffer): boolean {
            responseBody.push(chunk)
            return true
        }

        this.proxyServer.web(req, res, { target })

        await new Promise((resolve: Function): void => {
            res.once('proxyed', () => resolve())
        })

        this.monitor.collect(createMonitorPlainObject.forward({
            action: ctx.path,
            time: end(),
            status: res.statusCode,
        }))

        return {
            body: Buffer.concat(responseBody),
            header: res._headers,
        }
    }
}