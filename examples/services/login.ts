import { Service } from  '../../src/shared';

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
    getLoginAccount(cookie: string): any {
        return [
            types.string(cookie)
        ];
    }
}

@Service()
export class LoginInterface {
    interface = 'com.netease.haitao.account.service.AccountLoginServiceFacade';
    version = '1.0';
    timeout = 6000;
    group = 'stable_master';
    compose = new LoginService()
}