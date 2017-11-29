import { Plugin } from '../../core';
import { InitOptions, BaseObject } from '../../shared/interfaces';
import rpc = require('@kaola/rpc');
import { InjectPlugin } from '../../shared/decorators/injection';
import { Logger } from '../index';
import { entries } from '../../shared/index';

interface Services {
    [propName: string]: BaseObject;
};

export class MicroServices extends Plugin {
    @InjectPlugin(Logger)
    private logger: Logger;
    private client: any;
    public services: any;
    
    name() {
        return 'rpc';
    }

    constructor(options: any) {
        super();
        const { interfaces = {} } = options;

        options.services = interfaces;
        this.$options = options;
    }

    
    async init() {
        const interfaces = this.$options.interfaces;
        
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