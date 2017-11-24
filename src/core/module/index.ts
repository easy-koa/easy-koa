import Application from '../../common/application';
import MicroServices from '../microservices/index';
import Logger from '../logger/index';
import Server from '../server';
import { isNil, isNumber } from '../../shared/utils/shared';
import BaseObject from '../../shared/interfaces/base-object';
import ModuleContext from '../../shared/interfaces/module-context';



export default class Module {
    readonly application: Application = new Application();

    constructor(moduleContext: ModuleContext) {
        this.configure(moduleContext);
    }

    public static create(): Module {
        const moduleContext: ModuleContext = <any> this;

        return new Module( moduleContext );
    }

    private configure({ interceptors = [], controllers = [], middleways = [], components = [], microServices = null }: ModuleContext): void {
        const { application } = this;

        const interfaces = microServices ? microServices.interfaces: [];

        application.use(new Logger(
            'xxx', {}
        ));

        if (!isNil(microServices)) {
            application.use(new MicroServices(microServices));
        }

        application.use(new Server({
            controllers,
            interceptors,
            components: [ ...components, ...interfaces ],
            middleways
        }));
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