import { Application } from '@kaola/kapp-core'
import { isNumber } from '@kaola/kapp-shared'
import { ModuleContext, ModuleOptions } from './interfaces'
import { Logger } from '@kaola/kapp-logger'
import { Monitor } from '@kaola/kapp-monitor'
import { Server } from '@kaola/kapp-server'
import { Cron } from '@kaola/kapp-cron'
import { moduleMeta } from '@kaola/kapp-shared/constants'

export default class Kapp {
    readonly application: Application = new Application()
    private moduleContext: ModuleContext
    private registerCache: Set<any> = new Set()

    constructor(moduleOptions: ModuleOptions) {
        this.configure(moduleOptions)
        this.cacheResgiterModule()
        this.install()
    }

    private install(): void {
        const { application } = this
        const {
            logger, server, monitor, components,
        }: ModuleContext = this.moduleContext

        application.use(new Cron())

        application.use(new Logger(logger.application, logger.options))

        application.use(new Monitor())

        components.forEach((component: any) =>
            application.use(component)
        )

        application.use(new Server(server))
    }

    public static create(): Kapp {
        const moduleOptions: ModuleOptions = <ModuleOptions> Reflect.getMetadata(moduleMeta, this)
        return new this(moduleOptions)
    }

    private configure(moduleOptions: ModuleOptions): void {
        const {
            logger = {}, monitor = {}, components = [], server = {},
        } = moduleOptions

        const loggerContext: any = Logger.configure(logger)
        const monitorContext: any = Monitor.configure(monitor)
        const serverContext: any = Server.configure(server)

        this.moduleContext = { logger: loggerContext, monitor: monitorContext, server: serverContext, components }
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
