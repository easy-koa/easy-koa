import { InjectPlugin, InjectService } from '@kaola/kapp-server/decorators/injection'
import { MicroService } from '@kaola/kapp-microservice'

interface TypeInfo {
    $class: string
    $: any
}
function createType(className: string, value: any): TypeInfo {
    return {
        $class: className,
        $: value,
    }
}
function int(value: string | number): TypeInfo {
    return createType('int', <number> value)
}

function long(value: string | number): TypeInfo {
    return createType('java.lang.Long', <number> value)
}

function string(value: any): TypeInfo {
    return createType('java.lang.String', <string> value)
}

const types: any = {
    int,
    string,
    long,
}

export const loginProvider: any = {
    login: {
        interface: 'com.netease.haitao.account.service.AccountLoginServiceFacade',
        version: '1.0',
        timeout: 6000,
        group: 'stable_master',
    },
}

export class LoginService {
    @InjectPlugin(MicroService)
    microServices: MicroService

    async getLoginAccount(cookie: string): Promise<any> {
        return await this.microServices.services.login.getLoginAccount(types.string(cookie))
    }
}
