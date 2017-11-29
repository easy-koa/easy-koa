import 'reflect-metadata';
import { Application } from "./core/index";
import { ModuleContext } from "./shared/interfaces";
import { Server } from "./components/server/index";
import { isNumber } from "./shared/utils/index";
import { moduleMeta, methodTypes } from './shared/constants';
import { InterceptorMapping, Interceptor, InterceptorItem } from './shared/interfaces/interceptor';
import { ModuleOptions } from './shared/index';

import pathToRegexp = require('path-to-regexp')

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
            interceptorMappings = [],
            controllers = [],
            middlewares = [],
            plugins = []
        }: ModuleContext = this.moduleContext;

        plugins.forEach(plugin => 
            application.use(plugin)
        );

        application.use(new Server({ controllers, interceptorMappings, middlewares }));
    }

    public static create(): Kapp {
        const moduleOptions: ModuleOptions = <ModuleOptions> Reflect.getMetadata(moduleMeta, this);
        return new this( moduleOptions );
    }

    private configure(moduleOptions: ModuleOptions): void {
        let { 
            interceptors = [],
            controllers = [],
            middlewares = [],
            plugins = []
        }: ModuleOptions = moduleOptions;

        const interceptorMappings = <InterceptorMapping[]> interceptors.map((interceptorItem: InterceptorItem) => {
            let interceptorMapping;

            if ('preHandle' in interceptorItem || 'postHandle' in interceptorItem) {
                interceptorMapping = {
                    path: '*',
                    methods: [
                        methodTypes.GET,
                        methodTypes.POST
                    ],
                    interceptor: <Interceptor> interceptorItem
                }
            } else {
                interceptorMapping = <InterceptorMapping> interceptorItem
            }

            interceptorMapping.path = pathToRegexp(interceptorMapping.path);

            return interceptorMapping;
        });

        this.moduleContext = { interceptorMappings, controllers, middlewares, plugins }
    }

    public run(port: number) {
        if (!isNumber(port)) {
            return Promise.reject('端口号必须是数字');
        }

        const { application } = this;
        
        return application.start()
            .then(() => {
                this.registerModule();
                this.start(port);
            });
    }

    private cacheResgiterModule() {
        const { registerCache } = this;
        const { controllers = [], interceptorMappings = []} = this.moduleContext;

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
            application.inject(item);
        })
    }

    private start(port: number) {
        const { application } = this;
        return new Promise(function(resolve, reject) {
            
            application
                .getPlugin(Server)
                .listen(port, (error: Error) => {
                    if (error) {
                        return reject(error );
                    }
                    resolve();
                });
        });
        
    }
}