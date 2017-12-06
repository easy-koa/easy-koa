declare module 'koa' {
    interface BaseContext {
        collect: any
        collectError: any
        render: Function
    }

    interface Context {
        controller: any

    }
}

import { Component } from '@kapp/core'
import { Koa, isNil } from '@kapp/shared'
import * as pathToRegexp from 'path-to-regexp'
import { InitOptions, startTime } from '@kapp/shared'
import { classTypes, classType, pathMeta, methodTypes } from '@kapp/shared/constants'
import { isUndefined, BaseObject } from '@kapp/shared'
import { Controller } from './decorators'
import { RoutersExplorer } from './utils/routers-explorer'
import { defaultRender } from './utils/render'
import { errorHandleMiddleware, interceptorMiddleware, controllerMonitorMiddleware } from './middlewares'
import { ServerOptions, ServerContext } from './interfaces'
import { InterceptorConstructor, Interceptor, InterceptorMapping } from './interfaces/interceptor'
import { InjectPlugin } from '@kapp/shared'
import { Logger } from '@kapp/logger'
import { Monitor } from '@kapp/monitor'
import { getControllerMap } from './utils/get-controller-map'
import { logController } from './utils/log-controller'
import * as createMonitorPlainObject from './utils/create-monitor-plain-object'
import { wrapRenderMonitor } from './utils/wrap-render-monitor'

export class Server extends Component {
    readonly application: Koa = new Koa()
    $options: ServerContext

    @InjectPlugin(Logger)
    logger: Logger

    @InjectPlugin(Monitor)
    monitor: Monitor

    name() {
        return 'server'
    }

    constructor(serverContext: ServerContext) {
        super()
        this.$options = serverContext
    }

    async init() {
        this.install()
    }

    async ready() {
        this.application.listen(this.$options.port, () => {
            this.logger.info(`Server run successfully on port ${this.$options.port}`)
        })
    }

    private install() {
        const { application, $options, monitor, logger } = this
        let { middlewares, controllers, interceptorMappings, render, renderOptions = {} } = $options

        this.application.context.collect = function(message: any) {
            monitor.collect(message, this)
        }

        this.application.context.collectError = function(message: any) {
            monitor.collect(message, this)
        }

        render = render || (defaultRender)(renderOptions)

        application.context.render = wrapRenderMonitor(render)

        const { router, rawRouters } = RoutersExplorer.createRouters(controllers)

        logController(logger, rawRouters)

        application.use(errorHandleMiddleware())

        interceptorMappings.forEach(item => application.use(interceptorMiddleware(item)))

        middlewares.forEach(middleware => application.use(middleware))

        application.use(controllerMonitorMiddleware())

        application.use(router.routes())
    }

    destroy() {}

    static configure(options: ServerOptions): ServerContext {
        let { interceptors, controllers, middlewares = [], port = 3000, render, renderOptions } = options

        controllers = controllers.map(Item => new Item())
        const interceptorMappings = <InterceptorMapping[]> interceptors.map((interceptor: Interceptor): InterceptorMapping => {
            let path, InterceptorConstructor, methods

            if (!('interceptor' in interceptor)) {
                InterceptorConstructor = <InterceptorConstructor> interceptor
            } else {
                const interceptorMapping = <InterceptorMapping> interceptor
                InterceptorConstructor = interceptorMapping.interceptor
                path = interceptorMapping.path
                methods = interceptorMapping.methods
            }

            if (isNil(path)) {
                path = [ /.*/ ]
            }

            if (isNil(methods)) {
                methods = [
                    methodTypes.GET, methodTypes.POST,
                ]
            }

            if (!Array.isArray(path)) {
                path = [ path ]
            }

            path = path.map(path => pathToRegexp(path))
            interceptor = new InterceptorConstructor()

            return { path, methods, interceptor }
        })
        return { controllers, interceptorMappings, middlewares, port, render, renderOptions }
    }
}
