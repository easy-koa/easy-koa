import 'reflect-metadata';
import { Component } from '../../core/component';
import Koa = require('koa');
import pathToRegexp = require('path-to-regexp');
import { InitOptions } from '../../shared/interfaces';
import { classTypes, classType, pathMeta, methodTypes } from '../../shared/constants';
import { isUndefined, BaseObject, Controller } from '../../shared/index';
import { RoutersExplorer } from './routers-explorer';
import { errorHandleMiddleware, interceptorMiddleware} from './middlewares';
import { ServerOptions, ServerContext } from './interfaces';
import { InterceptorConstructor, Interceptor, InterceptorMapping } from './interfaces/interceptor';
import { InjectPlugin } from '../../shared/decorators/injection';
import { Logger } from '../logger';

export class Server extends Component {
    readonly application: Koa = new Koa();
    $options: ServerContext;

    @InjectPlugin(Logger)
    logger: Logger;

    name() {
        return 'server';
    }

    constructor(serverContext: ServerContext) {
        super();
        this.$options = serverContext;
    }

    async init() {
        this.install();
    }

    private install() {
        const { application, $options } = this;
        const { middlewares, controllers, interceptorMappings } = $options;

        const { router, rawRouters } = RoutersExplorer.createRouters(controllers);

        rawRouters.forEach(({prefix, routers}) =>
            routers.forEach(({methods, path}) => 
                this.logger.info(`Router registered: path - ${prefix}${path}, methods - ${methods.join(',')} `)
            )
        )
        
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

    static configure(options: ServerOptions): ServerContext {
        let { interceptors, controllers, middlewares } = options;

        controllers = controllers.map(Item => new Item());
        const interceptorMappings = <InterceptorMapping[]> interceptors.map((interceptor: Interceptor): InterceptorMapping => {
            let interceptorMapping;

            if (!('interceptor' in interceptor)) {
                interceptorMapping = {
                    path: '*',
                    methods: [
                        methodTypes.GET,
                        methodTypes.POST
                    ],
                    interceptor: <InterceptorConstructor> interceptor
                }
            } else {
                interceptorMapping = <InterceptorMapping> interceptor;
            }
            interceptorMapping.path = pathToRegexp(interceptorMapping.path);
            interceptorMapping.interceptor = new interceptorMapping.interceptor();

            return interceptorMapping;
        });

        return { controllers, interceptorMappings, middlewares };
    }
}