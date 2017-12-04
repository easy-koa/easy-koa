import { MicroServices } from '../../src/components/index';
export declare const loginProvider: {
    login: {
        interface: string;
        version: string;
        timeout: number;
        group: string;
    };
};
export declare class LoginService {
    microServices: MicroServices;
    getLoginAccount(cookie: string): Promise<any>;
}
