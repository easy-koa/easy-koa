import httpProxy = require('http-proxy');
import { ServerRequest, ServerResponse, Agent, IncomingMessage } from 'http';
import { Component } from '@kapp/core/index';


interface ProxyServerConfig {
    secure: boolean;
    agent: Agent;
    proxyTimeout: number;
    host: string;
    headers: any;
    xfwd: boolean;
}

interface Options extends ProxyServerConfig {

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

        let { headers, secure, proxyTimeout, host, xfwd, agent } = options;
        
        if (!headers) {
            headers = {};
        }

        headers = Object.assign({}, headers, {
            Host: '',
            'X-Special-Proxy-Header': 'foxman',
            'accept-encoding': ''
        });

        this.proxyServerConfig = {
            headers, secure, proxyTimeout, host, xfwd, agent
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
    
        proxyServer.on('end', (req: ServerRequest, res: ServerResponse, proxyRes: ServerResponse) => {
            res.emit('proxyed', req, res, proxyRes);
        });
    
        return proxyServer;
    }

    on(...args: any[]) {
        this.proxyServer.on(...args);
    }

    web(...args: any[]) {
        this.proxyServer.web(args);
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
        
        this.proxyServer = ProxyServer.create({ host, specialHeader, secure, agent, proxyTimeout });
    }

    async forward (req: IncomingMessage, target: any) {
        const res = new ServerResponse(req);

        this.proxyServer.web(req, res, {
            target: target
        });

        const responseBody: any[] = [];

        res.write = function (chunk: Buffer) {
            responseBody.push(chunk);
            return true;
        };

        await new Promise((resolve) => {
            res.once('proxyed', () => resolve());
        });

        return {
            body: responseBody,
            header: res.getHeaders()
        };
    }
}