/// <reference types="koa" />
import 'reflect-metadata';
import { Plugin } from '../../core/plugin';
import Koa = require('koa');
import { InitOptions, ServerContext } from '../../shared/interfaces';
import { classTypes, classType, pathMeta } from '../../shared/constants';
import { isUndefined, BaseObject } from '../../shared/index';
import { RoutersExplorer } from './routers-explorer';
import Router = require('koa-router');
import { IRouter } from './interfaces/index';
import { Injection } from '../../shared/decorators/injection';
import { MicroServices } from '../index';

export class Server extends Plugin {
    readonly application: Koa = new Koa();
    serverContext: ServerContext;

    @Injection(MicroServices)
    private microServices: MicroServices;

    name() {
        return 'server';
    }

    constructor(serverContext: ServerContext) {
        super();
        this.serverContext = serverContext;
    }

    async init() {
        const { application, serverContext } = this;
        const { middlewares, interceptors, controllers } = serverContext;
        
        application.use(async function(ctx: Koa.Context, next: Function) {
            // try catcher
            await next(ctx);
        });

        application.use(async function(ctx: Koa.Context, next: Function) {
            // interceptors prehandler
            for (let interceptor of interceptors) {
                interceptor = interceptor.interceptor || interceptor;
                if (interceptor.preHandle) {
                    await interceptor.preHandle(ctx);
                }
            }
            await next(ctx);
        });
        
        middlewares.forEach((middleware: any) =>
            application.use(middleware)
        );

        const routers = RoutersExplorer
            .createRouters(controllers);

        application.use(routers.routes());

        application.use(async function() {
            // interceptors postHandle
        });
    }

    public listen(...args: any[]) {
        this.application.listen(...args);
    }

    destroy() {
        
    }
}