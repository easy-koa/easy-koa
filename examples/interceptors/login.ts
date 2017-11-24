import { Controller, Service, Interceptor, Module } from '../../src/common/index';
import LoginService from '../services/login';

@Interceptor()
export default class LoginInterceptor {
    constructor(loginService: LoginService) {}

    preHandle() {

    }

    postHandle() {

    }
}