import { Agent, IncomingMessage } from 'http';
import httpProxy = require('http-proxy');
import { ProxyServerConfig, ForwarderOptions } from './interfaces';


export class ProxyServer {
    private proxyServer: any;
    private proxyServerConfig: ProxyServerConfig;

    constructor(options: ForwarderOptions) {

        this.configiure(options);
        
        this.startProxyServer();

        this.bindProxyServerEvents();
    }

    configiure(options: ForwarderOptions) {

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

        proxyServer.on('proxyReq', (req: any) => {});
    
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