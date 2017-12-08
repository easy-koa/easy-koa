declare module 'koa' {
    interface Context {
        kaolaContext: any
        render(path: string, data?: any): void
    }
}

import { LoginInterceptor } from "./interceptors/login"
import { RawForwardInterceptor, APIForwardInterceptor, PageForwardInterceptor } from "./interceptors/forwarder"
import TopicController from "./controllers/topic"
import { loginProvider } from "./services/login"
import { MicroServices } from "@kaola/kapp-microservice"
import { Forwarder } from "@kaola/kapp-forwarder"
import { Agent } from "http"
import path = require('path')

export default {
    logger: {
        application: 'kapp-example',
        config: {},
    },
    monitor: {
        disabled: false,
    },
    server: {
        middlewares: [], // koa middlewares, async function first
        interceptors: [
            LoginInterceptor, {
                path: [
                    '/h5/hotKey.html',
                ],
                interceptor: APIForwardInterceptor,
            }, {
                path: ['/user/ajax/getUserProfile.html'],
                interceptor: PageForwardInterceptor,
            }, {
                path: [
                    '/',
                ],
                interceptor: RawForwardInterceptor,
            },
        ],
        controllers: [
            TopicController,
        ],
        renderOptions: {
            root: path.join(__dirname, 'view'),
        },
        port: 3000,
    },
    components: [
        new Forwarder({
            secure: false,
            proxyTimeout: 3000,
            host: 'm.kaola.com',
            headers: {
                'a': 'b',
            },
            xfwd: true,
            target: 'https://m.kaola.com',
        }),
        new MicroServices({
            application: 'haitao-wap',
            version: '3.0.3.3',
            register: '10.165.124.205:2181',
            providers: {
                ...loginProvider,
            },
        }),
    ],
}
