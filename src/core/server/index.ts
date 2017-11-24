/// <reference types="koa" />

import { Plugin } from '../../common/plugin';
import initOptions from '../../shared/interfaces/init-options';
import ServerContext from '../../shared/interfaces/server-context';
import Koa = require('koa');

class Server extends Plugin {
    readonly application: Koa = new Koa();

    name() {
        return 'server';
    }

    constructor({ middlewares, interceptors }: ServerContext) {
        super();
        const { application } = this;

        application.use(async function(ctx: any, next: Function) {
            try {
                next();
            } catch(e) {

            }
        });

        application.use(async function() {
            // preHandle
        });
        
        middlewares.forEach(function(middleware: any) {
            application.use(middleware);
        })
        
        application.use(async function() {
            // postHandle
        });
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
    
    async init({ service }: initOptions) {
        
    }

    destroy() {
        
    }
}

export default Server;