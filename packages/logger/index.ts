import { Component } from '@kaola/kapp-core'
import { LoggerOptions } from './interfaces/logger-options'
import { loggerFactory, isUndefined } from '@kaola/kapp-shared'

export class Logger extends Component {
    private logger: any
    private loggerFactory: any

    constructor(name: string, cfg: any) {
        super()

        if (!isUndefined(cfg)) {
            loggerFactory.configure(cfg)
        }

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

    static configure({ application, options }: LoggerOptions): LoggerOptions {
        if (isUndefined(application)) {
            application = 'kapp-application'
        }
        if (!isUndefined(options)) {
            options.pm2 = true
        }

        return { application, options }
    }
}
