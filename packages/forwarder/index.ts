import { ServerRequest, ServerResponse, Agent, IncomingMessage, OutgoingHttpHeaders } from 'http';
import { Component } from '@kapp/core';
import { Koa, startTime } from '@kapp/shared';
import { InjectPlugin } from '@kapp/shared';
import { Monitor } from '@kapp/monitor';
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

        this.monitor.collect(createMonitorPlainObject.forward(ctx.path, { time: end() }))

        return {
            body: Buffer.concat(responseBody),
            header: res._headers
        };
    }
}