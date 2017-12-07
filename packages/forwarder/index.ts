import { ServerRequest, ServerResponse, Agent, IncomingMessage, OutgoingHttpHeaders } from 'http';
import { Component } from '@kaola/kapp-core';
import { Koa, startTime } from '@kaola/kapp-shared';
import { InjectPlugin } from '@kaola/kapp-shared';
import { Monitor } from '@kaola/kapp-monitor';
import { ProxyServer } from './proxy-server';
import { ProxyServerConfig } from './interfaces';
import * as createMonitorPlainObject from './utils/create-monitor-plain-object';

declare module 'http' {
    interface ServerResponse {
        _headers: any[]
    }
}

export class Forwarder extends Component {
    private proxyServer: ProxyServer;

    @InjectPlugin(Monitor)
    private monitor: Monitor;

    name() {
        return 'forward';
    }

    constructor(options: ProxyServerConfig) {
        super();
        this.$options = options;
    }

    async init() {
        const { host, specialHeader, secure = false, agent = false, proxyTimeout = 3000 } = this.$options;
        this.proxyServer = ProxyServer.create({
            host,
            specialHeader,
            secure,
            agent,
            proxyTimeout
        });
    }

    async forward (ctx: Koa.Context ) {
        let end = startTime();
        const { target } = this.$options;

        const responseBody: any[] = [];

        const req = ctx.req;
        const res = new ServerResponse(req);
        
        res.write = function (chunk: Buffer) {
            responseBody.push(chunk);
            return true;
        };

        this.proxyServer.web(req, res, { target });

        await new Promise((resolve) => {
            res.once('proxyed', () => resolve());
        });

        this.monitor.collect( createMonitorPlainObject.forward({
            action: ctx.path,
            time: end(),
            status: res.statusCode
        }) )

        return {
            body: Buffer.concat(responseBody),
            header: res._headers
        };
    }
}