import { Service } from  '../../src/shared';
import { InjectPlugin, InjectService } from '../../src/shared/decorators/injection';
import { MicroServices } from '../../src/plugins/index';

function createType(className: string, value: any) {
    return {
        $class: className,
        $: value
    };
}
function int(value: string | number) {
    return createType('int', <number>value);
}

function long(value: string | number) {
    return createType('java.lang.Long', <number>value);
}

function string(value: any) {
    return createType('java.lang.String', <string>value);
}

const types = {
    int,
    string,
    long
};


export class LoginService {
    @InjectPlugin(MicroServices)
    microServices: MicroServices;

    async getLoginAccount(cookie: string) {
        return await this.microServices.services.login.getLoginAccount(types.string(cookie));
    }
}