import { Component } from '@kaola/kapp-core'
import { LoggerOptions } from './interfaces/logger-options'
import { loggerFactory, isUndefined, isNil, isEmptyObject } from '@kaola/kapp-shared'
import * as path from 'path'

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
            options = {
                appenders: {
                    dateFile: {
                        type: 'dateFile',
                        filename: path.join(
                            isNil(logdir) ? './logs' : logdir,
                            `${application}-kapp-runtime.log`
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
                    default: {
                        appenders: [
                            'dateFile', 'console',
                        ],
                        level: 'all',
                    },
                },
            }
        }

        if (isUndefined(options.pm2)) {
            options.pm2 = true
        }

        // use a default configuration
        loggerFactory.configure(options)

        return { application, options }
    }
}
