import { Component } from '@kapp/core';
import { LoggerOptions } from './interfaces/logger-options';
import { loggerFactory, isUndefined } from '@kapp/shared';

export class Logger extends Component {
    private logger: any;
    private loggerFactory: any;
    
    constructor(name: string, cfg: any) {
        super();
        loggerFactory.configure(cfg);
        this.loggerFactory = loggerFactory;
        this.logger = this.create(name);
    }

    create(name: string) {
        return this.loggerFactory.getLogger(name);
    }

    name() {
        return 'logger';
    }

    public fatal(message: any) {
        const logger = this.logger;
        return logger.fatal(message);
    }

    public info(message: any) {
        const logger = this.logger;
        return logger.info(message);
    }

    public error(message: any) {
        const logger = this.logger;
        return logger.error(message);
    }

    public warn(message: any) {
        const logger = this.logger;
        return logger.warn(message);
    }

    destroy(error: any) {
        if (error) {
            const logger = this.logger;
            logger.fatal(error);
        }
    }

    static configure({ application, options} : LoggerOptions): LoggerOptions {
        if (isUndefined(application)) {
            application = 'kapp-application';
        }
        if (isUndefined(options)) {
            options = {
                appenders: {
                    dateFile: {
                        type: 'dateFile',
                        filename: './logs/runtime.log',
                        pattern: '.yyyy-MM-dd-hh',
                        compress: false,
                    },
                    console: {
                        type: 'console'
                    }
                },
                categories: {
                    default: {
                        appenders: [
                            'dateFile', 'console'
                        ],
                        level: 'all'
                    }
                }
            };
        }
        return { application, options } ;
    }
}