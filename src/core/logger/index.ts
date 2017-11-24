import logger = require('log4js');
import { Plugin } from '../../common';

class Logger extends Plugin{
    private _logger: any;
    
    constructor(name: string, cfg: any) {
        super();
        logger.configure(cfg);
        this._logger = logger.getLogger(name);
    }

    name() {
        return 'logger';
    }

    service() {
        const logger = this._logger;

        return {
            fatal:  logger.fatal.bind(logger),
            info:   logger.info.bind(logger),
            error:  logger.error.bind(logger),
            warn:   logger.warn.bind(logger)
        };
    }

    destroy(error: any) {
        if (error) {
            const logger = this._logger;
            logger.fatal(error);
        }
    }
}

export default Logger;