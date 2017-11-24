import * as os from 'os';
import Logger = require('chalklog');
import parrotSay = require('parrotsay-api');

export function createLogger(scope: string) {
    const logger = new Logger(scope);
    return {
        info(msg: any) {
            logger.blue(msg);
        },

        success(msg: any) {
            logger.green(msg);
        },

        warn(msg: any) {
            if (Array.isArray(msg)) {
                return msg.forEach(m => logger.warn(m));
            }
            logger.yellow(msg.stack || msg);
        },

        error(msg: any) {
            if (Array.isArray(msg)) {
                return msg.forEach(m => logger.red(m));
            }
            logger.red(msg.stack || msg);
        },

        newline() {
            // eslint-disable-next-line
            console.log('\n');
        },

        say(text: any) {
            if (os.platform() === 'win32') {
                logger.blue(text);
            } else {
                parrotSay(text)
                    // eslint-disable-next-line
                    .then(console.log)
                    // eslint-disable-next-line
                    .catch(console.error);
            }
        }
    };
}

export const logger = createLogger('Kapp.js');
