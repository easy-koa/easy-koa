import { BaseObject } from "@one-koa/shared"

export interface LoggerOptions {
    application?: string
    logdir?: string
    logfile?: string
    options?: any
    splitCluster?: any
}
