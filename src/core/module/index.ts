// import Application from '../../common/application';
import MicroServices from '../microservices/index';
import Server from '../server';
import { isNil, isNumber } from '../../shared/utils/shared';
import { Application } from '../../common/index';
import { ModuleContext } from '../../shared/interfaces/module-context';


export default class Module {
    readonly application: Application = new Application();

    constructor(moduleContext: ModuleContext) {
        this.configure(moduleContext);
    }

    public static create(): Module {
        const moduleContext: ModuleContext = <any> this;

        return new Module( moduleContext );
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