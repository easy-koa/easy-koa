import { Plugin } from '../../core';
import { InitOptions, BaseObject } from '../../shared/interfaces';
import rpc = require('@kaola/rpc');

interface Services {
    [propName: string]: BaseObject;
};

export class MicroServices extends Plugin {
    private logger: any;
    private services: BaseObject;
    private client: any;
    
    name() {
        return 'rpc';
    }

    constructor(options: any) {
        super();
        const { interfaces = [] } = options;

        this.services = interfaces.reduce((services: Services, Interface: any) => {
            return Object.assign(services, {
                [Interface.name]: new Interface()
            })
        }, {});

        this.$options = options;
    }

    service() {
        return {
            services() {
                return this.services;
            }
        };
    }
    
    async init({ service }: InitOptions) {
        this.logger = service('logger');
        
        await rpc.createClient(this.$options).connect()
            .then(({
                services, client
            }) => {
                this.client = client;
                this.services = services;
            })
    }

    destroy() {
        if (this.client) {
            this.client.close();
            if (this.logger)
                this.logger.info('disconnected zookeeper');    
        }
    }
}