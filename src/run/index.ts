import 'reflect-metadata';
import { Application } from '../core/index';
import { isNumber } from '../shared/index';
import { moduleMeta, methodTypes } from '../shared/constants';
import { ModuleContext, ModuleOptions } from './interfaces'
import { ServerOptions } from '../components/server/interfaces/index';
import { Logger, Monitor, Server, Cron } from '../components/index';

export class Kapp {
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

    public run(port: number) {
        if (!isNumber(port)) {
            return Promise.reject('端口号必须是数字');
        }

        const { application } = this;
        
        return application.start()
            .then(() => {
                this.registerModule();
                return this.start(port);
            });
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

    private start(port: number) {
        const { application } = this;
        return new Promise(function(resolve, reject) {
            const server = application
                .registry.components
                .getInstance(Server);
                
            server.listen(port, (error: Error) => {
                    if (error) {
                        return reject(error );
                    }
                    resolve();
                });
        });
        
    }
}