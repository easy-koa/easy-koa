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
import { MicroService } from "@one-koa/plugin-microservice"
import { Forwarder } from "@one-koa/plugin-forwarder"
import { Agent } from "http"
import path = require('path')

export default {
    logger: {
        application: 'one-koa-example',
        logdir: path.join(__dirname, 'logs'),
        options: {},
    },
    monitor: {
        disabled: false,
    },
    server: {
        middlewares: [], // koa middlewares, async function first
        interceptors: [
            // LoginInterceptor, {
            //     path: [
            //         '/h5/hotKey.html',
            //     ],
            //     interceptor: APIForwardInterceptor,
            // }, {
            //     path: ['/user/ajax/getUserProfile.html'],
            //     interceptor: PageForwardInterceptor,
            // }, {
            //     path: [
            //         '/',
            //     ],
            //     interceptor: RawForwardInterceptor,
            // },
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
    ],

    config: {
        x: 1,
    },
}
