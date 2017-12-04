import { Application } from '@kapp/core/index';
import { isNumber } from '@kapp/shared/index';
import { moduleMeta, methodTypes } from '@kapp/shared/constants';
import { ModuleContext, ModuleOptions } from './interfaces'
import { ServerOptions } from '@kapp/server/interfaces/index';
import { Logger } from '@kapp/logger';
import { Monitor } from '@kapp/monitor';
import { Server } from '@kapp/server';
import { Cron } from '@kapp/cron';


export default class Kapp {
    readonly application: Application = new Application();
    private moduleContext: ModuleContext;
    private registerCache = new Set();

    constructor(moduleOptions: ModuleOptions) {
        this.configure(moduleOptions);
        this.cacheResgiterModule();
        this.install();
    }

    private install() {
        const { application } = this;
        let { 
            logger, server, monitor, components
        }: ModuleContext = this.moduleContext;

        application.use(new Cron());

        application.use(new Logger(logger.application, logger.options));
        
        application.use(new Monitor());

        components.forEach(component => 
            application.use(component)
        );

        application.use(new Server(server));
    }

    public static create(): Kapp {
        const moduleOptions: ModuleOptions = <ModuleOptions> Reflect.getMetadata(moduleMeta, this);
        return new this( moduleOptions );
    }

    private configure(moduleOptions: ModuleOptions): void {
        let { 
            logger = {}, monitor = {}, components = [], server = {}
        } = moduleOptions;
        
        const loggerContext = Logger.configure(logger);
        const monitorContext = Monitor.configure(monitor);
        const serverContext = Server.configure(server);
        
        this.moduleContext = { logger: loggerContext, monitor: monitorContext, server: serverContext, components }
    }

    public run() {
        const { application } = this;
        
        return application.start()
            .then(() => {
                this.registerModule();
            })
            .then(() => 
                application.ready()
            );
    }

    private cacheResgiterModule() {
        const { registerCache } = this;
        const { controllers = [], interceptorMappings = []} = this.moduleContext.server;

        controllers.forEach(item => {
            registerCache.add(item);
        });
        
        interceptorMappings.forEach(item => { 
            registerCache.add(item.interceptor);
        });
    }

    private registerModule() {
        const { registerCache } = this;
        const { application } = this;
        
        registerCache.forEach(function(item) {
            application.registry.install(item);
        })
    }
}