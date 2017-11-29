import { createSystemId } from "../shared/utils/create-systemid";
import { BaseObject, Services, InitOptions } from "../shared/interfaces/index";

const pid = createSystemId();

interface Options extends BaseObject{
    enable: boolean;
}

export abstract class Plugin {
    id = pid();
    
    $options: any = { enable: true };
    
    abstract name(): string;

    registerComponent(constructor: any, component: any) {}

    init(options: InitOptions) {};

    ready() {}

    destroy(options?: any) {}

    afterCreated() {
        if (typeof this.$options.enable === 'undefined') {
            this.$options.enable = true;
        }
    }
}

export interface Plugins {
    [propName: string]: Plugin;
}