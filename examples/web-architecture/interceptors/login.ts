import { LoginService } from '../services/login';
import { InjectService, Koa } from '@kapp/shared';
import TopicService from '../services/topic';

export default class LoginInterceptor {
    @InjectService(LoginService)
    loginService: LoginService;

    async preHandle(ctx: Koa.Context) {
        let cookie = ctx.cookies.get('NTES_YD_SESS') || ctx.cookies.get('NTES_SESS') || ctx.cookies.get('NTES_OSESS');
        const cookieMock = 'ovBF5GgpjzGrML5j.IUobA_eJLycyOTkreBdZULerSjSbtsWYb2sMP83Xai0jOY22qVkwW0xTh.lLbIZRB9La3zqWgfdH.4qIBIoor55SMkz8YAgp89qwNTV8R0KbGa9Mql_e9H9zTP_L';
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
}