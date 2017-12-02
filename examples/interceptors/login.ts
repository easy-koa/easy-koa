import { LoginService } from '../services/login';
import { InjectService } from '../../src/shared/decorators/injection';
import TopicService from '../services/topic';
import { Context } from 'koa';

export default class LoginInterceptor {
    @InjectService(LoginService)
    loginService: LoginService;

    async preHandle(ctx: Context) {
        let cookie = ctx.cookies.get('NTES_YD_SESS') || ctx.cookies.get('NTES_SESS') || ctx.cookies.get('NTES_OSESS');
        const cookieMock = '1yJLFPkpsjLQpOJm5z3kLaUq2CjjaIEKgdxk4BwFzq5Unx2OnJy7pcfNN8XULG64QVl.pBhJEbPDKumeWacKsMfyWI.mt53EoWropIuhwW6zeU2WYFr3SLj.WuZHWON6K6Nk86gAcwRc0OBQrRfMZlBmgi4xG4dTpW3D.q4mky5xQ6lfPMei.kQEU5XeVpS.8';
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

