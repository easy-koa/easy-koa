import { Agent } from 'http'

export interface ProxyServerConfig {
    secure: boolean
    agent?: Agent
    proxyTimeout: number
    host: string
    headers?: any
    xfwd: boolean
    target: string
}
