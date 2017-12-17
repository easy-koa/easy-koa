import { LoginService } from '../services/login'
import { InjectService, Koa } from '@one-koa/shared'
import TopicService from '../services/topic'

export class LoginInterceptor {
    @InjectService(LoginService)
    loginService: LoginService

    async preHandle(ctx: Koa.Context): Promise<any> {
        let cookie: string = ctx.cookies.get('NTES_YD_SESS') || ctx.cookies.get('NTES_SESS') || ctx.cookies.get('NTES_OSESS')
        const cookieMock: string = 'ovBF5GgpjzGrML5j.IUobA_eJLycyOTkreBdZULerSjSbtsWYb2sMP83Xai0jOY22qVkwW0xTh.lLbIZRB9La3zqWgfdH.4qIBIoor55SMkz8YAgp89qwNTV8R0KbGa9Mql_e9H9zTP_L'
        // MOCK
        cookie = cookie || cookieMock

        ctx.kaolaContext = ctx.kaolaContext || {}

        if (!cookie) {
            ctx.kaolaContext.accountId = null
        } else {
            const accountId: string = await this.loginService.getLoginAccount(cookie)
            ctx.kaolaContext.accountId = accountId
        }
    }
}
