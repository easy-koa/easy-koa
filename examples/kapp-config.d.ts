declare module 'koa' {
    interface Context {
        kaolaContext: any;
    }
}
import LoginInterceptor from "./interceptors/login";
import TopicController from "./controllers/topic";
declare const _default: {
    logger: {
        application: string;
        config: {};
    };
    monitor: {
        disabled: boolean;
    };
    server: {
        middlewares: any[];
        interceptors: (typeof LoginInterceptor)[];
        controllers: (typeof TopicController)[];
        port: number;
    };
    components: any[];
};
export default _default;
