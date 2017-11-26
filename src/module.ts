import { Application } from "./core/index";
import { ModuleContext } from "./shared/interfaces";
import { Server } from "./components/server/index";
import { isNumber } from "./shared/utils/index";

export class Kapp {
    readonly application: Application = new Application();

    constructor(moduleContext: ModuleContext) {
        this.configure(moduleContext);
    }

    public static create(): Kapp {
        const moduleContext: ModuleContext = <any> this;

        return new this( moduleContext );
    }

    private configure({ interceptors = [], controllers = [], middlewares = [], components = [], plugins = [] }: ModuleContext): void {
        const { application } = this;
        
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
                return new Promise(function(resolve, reject) {
                    application
                        .service('server')
                        .listen(port, (error: Error) => {
                            if (error) {
                                return reject(error );
                            }
                            resolve();
                        });
                })
            });
    }
}