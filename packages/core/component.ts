import { createSystemId } from "@kaola/kapp-shared";
import { BaseObject, Services, InitOptions } from "@kaola/kapp-shared";

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
