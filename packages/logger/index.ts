import { Component } from '@kaola/kapp-core'
import { LoggerOptions } from './interfaces/logger-options'
import { loggerFactory, isUndefined, isNil, isEmptyObject } from '@kaola/kapp-shared'
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

    static configure({ application, options, logdir, logfile }: LoggerOptions): LoggerOptions {
        if (isUndefined(application)) {
            application = 'kapp-application'
        }

        if (isNil(options) || isEmptyObject(options)) {
            const clusterId: string = cluster.isWorker && cluster.worker.id
            const clusterSuffix: string = clusterId ? '-' + clusterId : ''

            options = {
                appenders: {
                    frameworks: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-kapp${clusterSuffix}.log`
                        ),
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                        alwaysIncludePattern: true,
                    },
                    application: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-kapp-application${clusterSuffix}.log`
                        ),
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                        alwaysIncludePattern: true,
                    },
                    monitor: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-kapp-monitor${clusterSuffix}.log`
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
                    'kapp-monitor': {
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
                    kapp: {
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
