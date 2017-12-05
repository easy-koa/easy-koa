import { Component } from '@kapp/core';
import { InitOptions, BaseObject } from '@kapp/shared';
import * as rpc from '@kaola/rpc';
import { InjectPlugin } from '@kapp/shared';
import { Logger } from '@kapp/logger';
import { Monitor } from '@kapp/monitor';
import { Cron } from '@kapp/cron';

interface Services {
    [propName: string]: BaseObject;
};

export class MicroServices extends Component {
    @InjectPlugin(Logger)
    private logger: Logger;

    @InjectPlugin(Monitor)
    monitor: Monitor;

    @InjectPlugin(Cron)
    cron: Cron;

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