import { Logger, MicroServices } from "../src/plugins/index";
import LoginInterceptor from "./interceptors/login";
import TopicController from "./controllers/topic";

export default {
    plugins: [
        new Logger(
            'xxx', {}
        ),
        new MicroServices({
            application: 'haitao-wap',
            version: '3.0.3.3',
            register: '10.165.124.205:2181',
            providers: {
                login: {
                    interface: 'com.netease.haitao.account.service.AccountLoginServiceFacade',
                    version: '1.0',
                    timeout: 6000,
                    group: 'stable_master'
                }
            }
        })
    ],
    middlewares: [], // koa middlewares, async function first
    interceptors: [
        LoginInterceptor
    ],
    controllers: [
        TopicController
    ]
}