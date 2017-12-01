import LoginInterceptor from "./interceptors/login";
import TopicController from "./controllers/topic";
import { loginProvider } from "./services/login";
import { MicroServices } from "../src/components/index";

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
            LoginInterceptor
        ],
        controllers: [
            TopicController
        ]
    },
    components: [
        new MicroServices({
            application: 'haitao-wap',
            version: '3.0.3.3',
            register: '10.165.124.205:2181',
            providers: {
                ...loginProvider
            }
        })
    ]
}