import { Plugin } from '../../core';
import { InitOptions, BaseObject } from '../../shared/interfaces';
import rpc = require('@kaola/rpc');
import { Injection } from '../../shared/decorators/injection';
import { Logger } from '../index';
import { entries } from '../../shared/index';

interface Services {
    [propName: string]: BaseObject;
};

export class MicroServices extends Plugin {
    @Injection(Logger)
    private logger: Logger;
    private client: any;
    
    name() {
        return 'rpc';
    }

    constructor(options: any) {
        super();
        const { interfaces = [] } = options;

        options.services = interfaces.reduce((services: Services, service: any) => {
            return Object.assign(services, {
                [service.constructor.name]: service
            })
        }, {});
        this.$options = options;
    }

    public services() {
        return this.services;
    }
    
    async init() {
        const interfaces = this.$options.interfaces;
        
        await rpc.createClient(this.$options).connect()
            .then(({
                services, client
            }) => {
                this.client = client;
                this.services = services;
                for (let [
                    serviceName
                ] of entries(services)) {
                    const apis = interfaces.filter((api: any) => {
                        return api.constructor.name === serviceName
                    });
                    if (apis.length > 0) {
                        const ServiceConstructor = apis[0].compose.constructor;
                        this.registerComponent(ServiceConstructor, services[serviceName]);
                    }
                }
                
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