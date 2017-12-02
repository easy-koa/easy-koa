import { createSystemId } from "../shared/utils/create-systemid";
import { BaseObject, Services, InitOptions } from "../shared/interfaces/index";

const pid = createSystemId();

interface Options extends BaseObject{
    enable: boolean;
}

export abstract class Component {
    constructor(...args: any[]) {}
    id = pid();
    
    $options: any = { enable: true };
    
    abstract name(): string;

    registerService(constructor: any, component: any) {
        throw Error('registerService has not been rewrite');
    }

    init(options: InitOptions) {}

    ready() {}

    destroy(options?: any) {}

    afterCreated() {
        if (typeof this.$options.enable === 'undefined') {
            this.$options.enable = true;
        }
    }
    
    static configure(options: BaseObject): BaseObject {
        return options || {};
    }
}

export interface Components {
    [propName: string]: Component;
}
