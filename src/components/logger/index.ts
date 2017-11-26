import logger = require('log4js');
import { Plugin } from '../../core';

export class Logger extends Plugin{
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
}