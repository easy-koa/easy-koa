import { Component } from '../../core';
import { InitOptions, BaseObject } from '../../shared/interfaces';
import * as rpc from '@kaola/rpc';
import { InjectPlugin } from '../../shared/decorators/injection';
import { Logger } from '../index';

interface Services {
    [propName: string]: BaseObject;
};

export class MicroServices extends Component {
    @InjectPlugin(Logger)
    private logger: Logger;
    private client: any;
    public services: any;
    private microServices: any;
    
    name() {
        return 'rpc';
    }

    constructor(options: any) {
        super();
        const { providers = {} } = options;

        options.services = providers;
        this.$options = options;
        this.microServices = rpc.createClient(this.$options);
    }

    
    async init() {      
        await this.microServices
            .connect()
            .then(({
                services, client
            }: {
                services: any, client: any
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