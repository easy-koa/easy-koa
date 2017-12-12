import { Agent, IncomingMessage } from 'http'
import httpProxy = require('http-proxy')
import { ProxyServerConfig, ForwarderOptions } from './interfaces'

export class ProxyServer {
    private proxyServer: any
    private proxyServerConfig: ProxyServerConfig

    constructor(options: ForwarderOptions) {
        this.configiure(options)
        this.startProxyServer()
        this.bindProxyServerEvents()
    }

    configiure(options: ForwarderOptions): void {

        let { headers, target } = options
        const { secure, proxyTimeout, host, xfwd, agent } = options

        if (!headers) {
            headers = {}
        }

        headers = Object.assign({}, headers, {
            Host: host,
            'X-Special-Proxy-Header': 'foxman',
            'accept-encoding': '',
        })

        if (!target) {
            target = 'http://' + host
        }

        this.proxyServerConfig = {
            headers, secure, proxyTimeout, host, xfwd, agent, target,
        }
    }

    startProxyServer(): void {
        this.proxyServer = httpProxy.createProxyServer(this.proxyServerConfig)
    }

    static create(options: any): ProxyServer {
        return new this(options)
    }

    bindProxyServerEvents(): any {
        const { proxyServer, proxyServerConfig } = this

        proxyServer.on('proxyReq', (req: any) => {})

        proxyServer.on('end', (req: any, res: any, proxyRes: any) => {
            res.emit('proxyed', req, res, proxyRes)
        })

        return proxyServer
    }

    on(...args: any[]): void {
        this.proxyServer.on(...args)
    }

    web(...args: any[]): void {
        this.proxyServer.web(...args)
    }
}