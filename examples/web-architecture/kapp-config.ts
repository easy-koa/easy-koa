declare module 'koa' {
    interface Context {
        kaolaContext: any;
    }
}

import LoginInterceptor from "./interceptors/login";
import { ForwardAPIInterceptor } from "./interceptors/forward-api";
import { ForwardPageInterceptor } from "./interceptors/forward-page";

import TopicController from "./controllers/topic";
import HomeController from "./controllers/home";
import { loginProvider } from "./services/login";
import { MicroServices } from "@kapp/microservice";
import { Forward } from "@kapp/forward";
import { Agent } from "http";
import path = require('path');

export default {
    logger: {
        application: 'kapp-example',
        config: {}
    },
    monitor: {
        disabled: false,  
    },
    server: {
        middlewares: [], // koa middlewares, async function first
        interceptors: [
            LoginInterceptor, {
                path: [ '/h5/hotKey.html' ],
                interceptor: ForwardAPIInterceptor
            }, {
                path: [ '/user/ajax/getUserProfile.html' ],
                interceptor: ForwardPageInterceptor
            }
        ],
        controllers: [
            TopicController
        ],
        renderOptions: {
            root: path.join(__dirname, 'view'),
        },
        port: 3000
    },
    components: [
        new MicroServices({
            application: 'haitao-wap',
            version: '3.0.3.3',
            register: '10.165.124.205:2181',
            providers: {
                ...loginProvider
            }
        }),
        new Forward({
            secure: false,
            proxyTimeout: 3000,
            host: 'm.kaola.com',
            headers: {
                'a': 'b'
            },
            xfwd: true,
            target: 'https://m.kaola.com'
        })
    ]
}