import ensurePromise from '../shared/utils/ensure-promise';
import createSystemId from '../shared/utils/create-systemid';
import BaseObject from '../shared/interfaces/base-object';
import Services from '../shared/interfaces/services';
import initOptions from '../shared/interfaces/init-options';

const pid = createSystemId();

interface Options extends BaseObject{
    enable: boolean;
}

export abstract class Plugin {
    id = pid();
    
    $options: Options = { enable: true };
    
    abstract name(): string;

    service(): Services {
        return {};
    };

    init(options: initOptions) {};

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
