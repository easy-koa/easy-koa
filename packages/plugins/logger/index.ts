import { Component } from '@one-koa/core'
import { LoggerOptions } from './interfaces/logger-options'
import { loggerFactory, isUndefined, isNil, isEmptyObject } from '@one-koa/shared'
import * as path from 'path'
import * as cluster from 'cluster'

export class Logger extends Component {
    private logger: any
    private loggerFactory: any

    constructor(name: string, cfg: any) {
        super()

        this.loggerFactory = loggerFactory
        this.logger = this.create(name)
    }

    create(name: string): any {
        return this.loggerFactory.getLogger(name)
    }

    name(): any {
        return 'logger'
    }

    public fatal(message: any): any {
        const logger: any = this.logger
        return logger.fatal(message)
    }

    public info(message: any): any {
        const logger: any = this.logger
        return logger.info(message)
    }

    public error(message: any): any {
        const logger: any = this.logger
        return logger.error(message)
    }

    public warn(message: any): any {
        const logger: any = this.logger
        return logger.warn(message)
    }

    destroy(error: any): void {
        if (error) {
            const logger: any = this.logger
            logger.fatal(error)
        }
    }

    static configure({ application, options, logdir, logfile, splitCluster }: LoggerOptions): LoggerOptions {
        if (isUndefined(application)) {
            application = 'one-koa-application'
        }

        if (isNil(options) || isEmptyObject(options)) {
            const clusterId: string = (splitCluster && cluster.isWorker) ? '-' + cluster.worker.id : ''

            options = {
                appenders: {
                    frameworks: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-one-koa${clusterId}.log`
                        ),
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                        alwaysIncludePattern: true,
                    },
                    application: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-one-koa-application${clusterId}.log`
                        ),
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                        alwaysIncludePattern: true,
                    },
                    monitor: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-one-koa-monitor${clusterId}.log`
                        ),
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                        alwaysIncludePattern: true,
                    },
                    console: {
                        type: 'console',
                    },
                },
                categories: {
                    'one-koa-monitor': {
                        appenders: [
                            'monitor', 'console',
                        ],
                        level: 'all',
                    },
                    default: {
                        appenders: [
                            'application', 'console',
                        ],
                        level: 'all',
                    },
                    'one-koa': {
                        appenders: [
                            'frameworks', 'console',
                        ],
                        level: 'all',
                    },
                },
            }
        }

        if (isUndefined(options.pm2)) {
            options.pm2 = true
        }

        if (isUndefined(options.disableClustering)) {
            options.disableClustering = true
        }

        // use a default configuration
        loggerFactory.configure(options)

        return { application, options }
    }
}
