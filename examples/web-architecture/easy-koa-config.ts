import { LoginInterceptor } from "./interceptors/login"
import { RawForwardInterceptor, APIForwardInterceptor, PageForwardInterceptor } from "./interceptors/forwarder"
import TopicController from "./controllers/topic"
import { loginProvider } from "./services/login"
import { MicroService } from "@easy-koa/plugin-microservice"
import { Forwarder } from "@easy-koa/plugin-forwarder"
import { Agent } from "http"
import path = require('path')

export default {
    logger: {
        application: 'easy-koa-example',
        logdir: path.join(__dirname, 'logs'),
        options: {},
    },
    monitor: {
        disabled: false,
    },
    server: {
        middlewares: [], // koa middlewares, async function first
        interceptors: [
            {
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
            host: 'www.baidu.com',
            headers: {
                'a': 'b',
            },
            xfwd: true,
            target: 'https://www.baidu.com',
        }),
    ],

    config: {
        x: 1,
    },
}
