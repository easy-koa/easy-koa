declare module 'koa' {
    interface BaseContext {
        monitor: Monitor;
    }

    interface Context {
        monitor: Monitor;
    }
}

import 'reflect-metadata';
import { Component } from '../../core/component';
import * as Koa from 'koa';
import * as pathToRegexp from 'path-to-regexp';
import { InitOptions } from '../../shared/interfaces';
import { classTypes, classType, pathMeta, methodTypes } from '../../shared/constants';
import { isUndefined, BaseObject, Controller } from '../../shared/index';
import { RoutersExplorer } from './routers-explorer';
import { errorHandleMiddleware, interceptorMiddleware, controllerMonitorMiddleware} from './middlewares';
import { ServerOptions, ServerContext } from './interfaces';
import { InterceptorConstructor, Interceptor, InterceptorMapping } from './interfaces/interceptor';
import { InjectPlugin } from '../../shared/decorators/injection';
import { Logger } from '../logger';
import { Monitor } from '../monitor';
import { Context } from 'koa';
import { getControllerMap } from './utils/get-controller-map';
import { logController } from './utils/log-controller';

export class Server extends Component {
    readonly application: Koa = new Koa();
    $options: ServerContext;

    @InjectPlugin(Logger)
    logger: Logger;

    @InjectPlugin(Monitor)
    monitor: Monitor;

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

    async ready() {
        this.application.listen(this.$options.port, () => {
            this.logger.info('Server run successfully on port http://0.0.0.0:9999');
        });
    }

    private install() {
        const { application, $options, monitor, logger } = this;
        const { middlewares, controllers, interceptorMappings } = $options;

        this.application.context.monitor = monitor;

        const { router, rawRouters } = RoutersExplorer.createRouters(controllers);

        const cMap = getControllerMap(rawRouters);

        logController(logger, rawRouters);

        application.use(errorHandleMiddleware());

        interceptorMappings.forEach(item => application.use(interceptorMiddleware(item)));

        middlewares.forEach(middleware => application.use(middleware));

        application.use(controllerMonitorMiddleware(cMap));

        application.use(router.routes());
    }

    destroy() {}

    static configure(options: ServerOptions): ServerContext {
        let { interceptors, controllers, middlewares = [], port = 3000 } = options;

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

        return { controllers, interceptorMappings, middlewares, port };
    }
}