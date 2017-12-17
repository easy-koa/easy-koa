import { Application } from '@one-koa/core'
import { isNumber } from '@one-koa/shared'
import { ModuleContext, ModuleOptions } from './interfaces'
import { Logger } from '@one-koa/plugin-logger'
import { Monitor } from '@one-koa/plugin-monitor'
import { Server } from '@one-koa/plugin-server'
import { Cron } from '@one-koa/plugin-cron'
import { moduleMeta } from '@one-koa/shared/constants'
import { Config } from '@one-koa/plugin-config'

export default class OneKoa {
    private moduleContext: ModuleContext
    readonly application: Application
    private registerCache: Set<any> = new Set()

    constructor(moduleOptions: ModuleOptions) {
        // must do some config by all plugins first
        this.configure(moduleOptions)

        this.application = new Application()

        this.cacheResgiterModule()
        this.install()
    }

    private install(): void {
        const { application } = this
        const {
            logger, server, monitor, components, config,
        }: ModuleContext = this.moduleContext

        application.use(new Config(config))

        application.use(new Cron())

        application.use(new Logger(logger.application, logger.options))

        application.use(new Monitor())

        components.forEach((component: any) =>
            application.use(component)
        )

        application.use(new Server(server))
    }

    public static create(): OneKoa {
        const moduleOptions: ModuleOptions = <ModuleOptions> Reflect.getMetadata(moduleMeta, this)
        return new this(moduleOptions)
    }

    private configure(moduleOptions: ModuleOptions): void {
        const {
            logger = {}, monitor = {}, components = [], server = {}, config = {},
        } = moduleOptions

        const loggerContext: any = Logger.configure(logger)
        const monitorContext: any = Monitor.configure(monitor)
        const serverContext: any = Server.configure(server)

        this.moduleContext = { logger: loggerContext, monitor: monitorContext, server: serverContext, components, config }
    }

    public run(): Promise<void> {
        const { application } = this

        return application.start()
            .then(() => {
                this.registerModule()
            })
            .then(() =>
                application.ready()
            )
    }

    private cacheResgiterModule(): void {
        const { registerCache } = this
        const { controllers = [], interceptorMappings = [] } = this.moduleContext.server

        controllers.forEach((item: any) => {
            registerCache.add(item)
        })

        interceptorMappings.forEach((item: any) => {
            registerCache.add(item.interceptor)
        })
    }

    private registerModule(): void {
        const { registerCache } = this
        const { application } = this

        registerCache.forEach(function(item: any): void {
            application.registry.install(item)
        })
    }
}
