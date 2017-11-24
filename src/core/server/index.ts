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

    constructor(options: ServerContext) {
        super();
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