import { LoginService } from '../services/login';
import { Context } from 'koa';
export default class LoginInterceptor {
    loginService: LoginService;
    preHandle(ctx: Context): Promise<void>;
    postHandle(): void;
}
