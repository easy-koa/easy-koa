import {  Interceptor } from  '../../src/shared';
import LoginService from '../services/login';

@Interceptor()
export default class LoginInterceptor {
    constructor(loginService: LoginService) {}

    preHandle() {

    }

    postHandle() {
        
    }
}