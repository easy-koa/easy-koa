import { LoginService } from '../services/login';
import { InjectService } from '../../src/shared/decorators/injection';
import TopicService from '../services/topic';

export default class LoginInterceptor {
    @InjectService(LoginService)
    loginService: LoginService;

    async preHandle(ctx: any) {
        let cookie = ctx.cookies.get('NTES_YD_SESS') || ctx.cookies.get('NTES_SESS') || ctx.cookies.get('NTES_OSESS');
        const cookieMock = 'AoufPGXrKt_fwJ1EwFKESWlj9b_bZHs6UJaTVY9KSpZG6H1js6r1gX7m8_VcR9srrWKvOjcPb0xnmPiGjhx0uRAi4Mt5tlrsB3.v7Cq3QLRNDRUhH_m98T_a0mwFn13y79h17l2C4mfcC';
        // MOCK
        cookie = cookie || cookieMock;

        ctx.kaolaContext = ctx.kaolaContext || {};
        
        if (!cookie) {
            ctx.kaolaContext.accountId = null;
        } else {
            const accountId = await this.loginService.getLoginAccount(cookie);
            ctx.kaolaContext.accountId = accountId;
        }
    }

    postHandle() {
        
    }
}
