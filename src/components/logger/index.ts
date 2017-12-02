import * as logger from 'log4js';
import { Component } from '../../core';
import { LoggerOptions } from './interfaces/logger-options';
import { isUndefined } from '../../shared/index';

export class Logger extends Component{
    private _logger: any;
    
    constructor(name: string, cfg: any) {
        super();
        logger.configure(cfg);
        this._logger = logger.getLogger(name);
    }

    name() {
        return 'logger';
    }

    public fatal(message: any) {
        const logger = this._logger;
        return logger.fatal(message);
    }

    public info(message: any) {
        const logger = this._logger;
        return logger.info(message);
    }

    public error(message: any) {
        const logger = this._logger;
        return logger.error(message);
    }

    public warn(message: any) {
        const logger = this._logger;
        return logger.warn(message);
    }

    destroy(error: any) {
        if (error) {
            const logger = this._logger;
            logger.fatal(error);
        }
    }

    static configure({ application, options} : LoggerOptions): LoggerOptions {
        if (isUndefined(application)) {
            application = 'kapp-application';
        }
        if (isUndefined(options)) {
            options = {
                appenders: [{
                    type: 'console'
                }, {
                    type: 'dateFile',
                    filename: './logs/runtime.log',
                    pattern: '.yyyy-MM-dd-hh',
                    compress: false,
                }],
                levels:{'[all]': 'ALL'}
            };
        }
        return { application, options } ;
    }
}