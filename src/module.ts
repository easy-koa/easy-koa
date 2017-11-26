import 'reflect-metadata';
import { Application } from "./core/index";
import { ModuleContext } from "./shared/interfaces";
import { Server } from "./components/server/index";
import { isNumber } from "./shared/utils/index";
import { moduleMeta } from './shared/constants';

export class Kapp {
    readonly application: Application = new Application();
    private moduleContext: ModuleContext;
    private injectSet = new Set();

    constructor(moduleContext: ModuleContext) {
        this.moduleContext = moduleContext;
        this.configure();
    }

    public static create(): Kapp {
        const moduleContext: ModuleContext = <ModuleContext> Reflect.getMetadata(moduleMeta, this);

        return new this( moduleContext );
    }

    private configure(): void {
        const { application } = this;
        const { interceptors = [], controllers = [], middlewares = [], components = [], plugins = [] }: ModuleContext = this.moduleContext;
        
        this.pushInjectSet();

        plugins.forEach(plugin => 
            application.use(plugin)
        );

        application.use(new Server({ controllers, interceptors, components, middlewares }));
    }

    public run(port: number) {
        if (!isNumber(port)) {
            return Promise.reject('端口号必须是数字');
        }

        const { application } = this;
        
        return application.start()
            .then(() => {
                this.inject();
            })
            .then(() => {
                this.start(port)
            });
    }

    private pushInjectSet() {
        const { injectSet } = this;
        const { controllers = [], interceptors = [], components = [] } = this.moduleContext;

        controllers.forEach(item => {
            injectSet.add(item);
        });

        components.forEach(item => {
            injectSet.add(item);
        });
        
        interceptors.forEach(item => {
            injectSet.add(item.interceptor ? item.interceptor: item);
        });
    }

    private inject() {
        const { injectSet } = this;
        const { application } = this;
        
        injectSet.forEach(function(item) {
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