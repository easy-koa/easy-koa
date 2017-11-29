import 'reflect-metadata';
import { Plugin } from '../../core/plugin';
import Koa = require('koa');
import { InitOptions, ServerContext, InterceptorMapping } from '../../shared/interfaces';
import { classTypes, classType, pathMeta } from '../../shared/constants';
import { isUndefined, BaseObject } from '../../shared/index';
import { RoutersExplorer } from './routers-explorer';
import { errorHandleMiddleware, interceptorMiddleware} from './middlewares';


export class Server extends Plugin {
    readonly application: Koa = new Koa();
    serverContext: ServerContext;
    preHandles: InterceptorMapping[] = [];
    postHandles: InterceptorMapping[] = [];

    name() {
        return 'server';
    }

    configure(serverContext: ServerContext) {
        const { application } = this;

        const { middlewares, interceptorMappings, controllers } = serverContext;

        this.serverContext = serverContext;
    }

    constructor(serverContext: ServerContext) {
        super();
        this.configure(serverContext);
    }

    async init() {
        this.install();
    }

    private install() {
        const { application, serverContext, postHandles, preHandles } = this;
        const { middlewares, controllers, interceptorMappings } = serverContext;
        const router = RoutersExplorer.createRouters(controllers);
        
        application.use(errorHandleMiddleware());

        interceptorMappings.forEach(item => application.use(interceptorMiddleware(item)));
        
        middlewares.forEach(middleware => application.use(middleware));
        
        application.use(router.routes());
    }

    public listen(...args: any[]) {
        this.application.listen(...args);
    }

    destroy() {
        
    }
}