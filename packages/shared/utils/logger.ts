import log4js = require('log4js')

// use a default configuration
log4js.configure({
    pm2: true,
    appenders: {
        dateFile: {
            type: 'dateFile',
            filename: './logs/runtime.log',
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
})

export const loggerFactory: any = log4js
export const logger: any = log4js.getLogger('Kapp.js')
