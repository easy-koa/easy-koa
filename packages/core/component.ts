import { createSystemId } from "@kapp/shared/utils/create-systemid";
import { BaseObject, Services, InitOptions } from "@kapp/shared/interfaces/index";

const pid = createSystemId();

interface Options extends BaseObject{
    enable: boolean;
}

export abstract class Component {
    constructor(...args: any[]) {}
    id = pid();
    
    $options: any = { enable: true };
    
    abstract name(): string;

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
