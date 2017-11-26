/// <reference types="koa" />

import { Plugin } from '../../common/plugin';
import Koa = require('koa');
import { InitOptions, ServerContext } from '../../shared/interfaces/index';

class Server extends Plugin {
    readonly application: Koa = new Koa();
    serverContext: ServerContext;

    name() {
        return 'server';
    }

    constructor(serverContext: ServerContext) {
        super();
        this.serverContext = serverContext;
    }

    service() {
        return {
            listen: (...args: any[]) => {
                this.application.listen(...args);
            },
            services: () => {
                // return this.services;
            }
        };
    }
    
    async init({ service }: InitOptions) {
        const { application, serverContext } = this;
        const { middlewares, interceptors } = serverContext;
        
        application.use(async function(ctx: any, next: Function) {
            next(ctx);
            console.log(ctx.status);
        });

        application.use(async function() {
            // preHandle
        });
        
        middlewares.forEach((middleware: any) =>
            application.use(middleware)
        );

        application.use(async function() {
            // postHandle
        });
    }

    destroy() {
        
    }
}

export default Server;