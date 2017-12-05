declare module 'koa' {
    interface BaseContext {
        monitor: Monitor;
    }

    interface Context {
        monitor: Monitor;
        controller: string;
        render: any;
    }
}

import { Component } from '@kapp/core/component';
import { Koa, isNil } from '@kapp/shared';
import * as pathToRegexp from 'path-to-regexp';
import { InitOptions } from '@kapp/shared/interfaces';
import { classTypes, classType, pathMeta, methodTypes } from '@kapp/shared/constants';
import { isUndefined, BaseObject } from '@kapp/shared/index';
import { Controller } from './decorators';
import { RoutersExplorer } from './utils/routers-explorer';
import { defaultRender } from './utils/render';
import { errorHandleMiddleware, interceptorMiddleware, controllerMonitorMiddleware} from './middlewares';
import { ServerOptions, ServerContext } from './interfaces';
import { InterceptorConstructor, Interceptor, InterceptorMapping } from './interfaces/interceptor';
import { InjectPlugin } from '@kapp/shared/decorators/injection';
import { Logger } from '@kapp/logger';
import { Monitor } from '@kapp/monitor';
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
            this.logger.info(`Server run successfully on port ${this.$options.port}`);
        });
    }

    private install() {
        const { application, $options, monitor, logger } = this;
        const { middlewares, controllers, interceptorMappings, render, renderOptions = {} } = $options;

        this.application.context.monitor = monitor;

        application.context.render = render || (defaultRender)(renderOptions);

        const { router, rawRouters } = RoutersExplorer.createRouters(controllers);

        logController(logger, rawRouters);

        application.use(errorHandleMiddleware());

        interceptorMappings.forEach(item => application.use(interceptorMiddleware(item)));

        middlewares.forEach(middleware => application.use(middleware));

        application.use(controllerMonitorMiddleware());

        application.use(router.routes());
    }

    destroy() {}

    static configure(options: ServerOptions): ServerContext {
        let { interceptors, controllers, middlewares = [], port = 3000, render, renderOptions } = options;

        controllers = controllers.map(Item => new Item());
        const interceptorMappings = <InterceptorMapping[]> interceptors.map((interceptor: Interceptor): InterceptorMapping => {
            let path, InterceptorConstructor, methods;

            if (!('interceptor' in interceptor)) {
                InterceptorConstructor = <InterceptorConstructor> interceptor;
            } else {
                let interceptorMapping = <InterceptorMapping> interceptor;
                InterceptorConstructor = interceptorMapping.interceptor;
                path = interceptorMapping.path;
                methods = interceptorMapping.methods;
            }

            if (isNil(path)) {
                path = [ /.*/ ];
            }

            if (isNil(methods)) {
                methods = [ 
                    methodTypes.GET, methodTypes.POST
                ];
            }

            if (!Array.isArray(path)) {
                path = [ path ];
            }
            
            path = path.map(path => pathToRegexp(path));
            interceptor = new InterceptorConstructor();

            return { path, methods, interceptor };
        });
        return { controllers, interceptorMappings, middlewares, port, render, renderOptions };
    }
}