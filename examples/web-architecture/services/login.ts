import { InjectPlugin, InjectService } from '@kaola/kapp-server/decorators/injection';
import { MicroServices } from '@kaola/kapp-microservice';

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


export const loginProvider = {
    login: {
        interface: 'com.netease.haitao.account.service.AccountLoginServiceFacade',
        version: '1.0',
        timeout: 6000,
        group: 'stable_master'
    }
}

export class LoginService {
    @InjectPlugin(MicroServices)
    microServices: MicroServices;

    async getLoginAccount(cookie: string) {
        return await this.microServices.services.login.getLoginAccount(types.string(cookie));
    }
}