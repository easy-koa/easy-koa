import httpProxy = require('http-proxy');
import { ServerRequest, ServerResponse, Agent, IncomingMessage, OutgoingHttpHeaders } from 'http';
import { Component } from '@kapp/core';
import { Koa } from '@kapp/shared';

declare module 'http' {
    interface ServerResponse {
        _headers: any[]
    }
}

export interface ProxyServerConfig {
    secure: boolean;
    agent?: Agent;
    proxyTimeout: number;
    host: string;
    headers?: any;
    xfwd: boolean;
    target: string;
}

export interface Options extends ProxyServerConfig {

}

class ProxyServer {
    private proxyServer: any;
    private proxyServerConfig: ProxyServerConfig;

    constructor(options: Options) {

        this.configiure(options);
        
        this.startProxyServer();

        this.bindProxyServerEvents();
    }

    configiure(options: Options) {

        let { headers, secure, proxyTimeout, host, xfwd, agent, target } = options;
        
        if (!headers) {
            headers = {};
        }

        headers = Object.assign({}, headers, {
            Host: host,
            'X-Special-Proxy-Header': 'foxman',
            'accept-encoding': ''
        });


        if (!target) {
            target = 'http://' + host;
        }

        this.proxyServerConfig = {
            headers, secure, proxyTimeout, host, xfwd, agent, target
        }
    }

    startProxyServer() {
        this.proxyServer = httpProxy.createProxyServer(this.proxyServerConfig);
    }

    static create(options: any) {
        return new this(options);
    }

    bindProxyServerEvents() {
        const { proxyServer, proxyServerConfig } = this;

        proxyServer.on('proxyReq', (req: IncomingMessage) => {});
    
        proxyServer.on('end', (req: any, res: any, proxyRes: any) => {
            res.emit('proxyed', req, res, proxyRes);
        });
    
        return proxyServer;
    }

    on(...args: any[]) {
        this.proxyServer.on(...args);
    }

    web(...args: any[]) {
        this.proxyServer.web(...args);
    }
}

export class Forward extends Component {
    private proxyServer: ProxyServer;

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

        return {
            body: Buffer.concat(responseBody),
            header: res._headers
        };
    }
}